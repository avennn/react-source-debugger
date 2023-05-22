'use strict';

var ReactFlightDOMRelayClientIntegration = require('ReactFlightDOMRelayClientIntegration');

function parseModelRecursively(response, parentObj, value) {
  if (typeof value === 'string') {
    return parseModelString(response, parentObj, value);
  }

  if (typeof value === 'object' && value !== null) {
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        value[i] = parseModelRecursively(response, value, value[i]);
      }

      return parseModelTuple(response, value);
    } else {
      for (const innerKey in value) {
        value[innerKey] = parseModelRecursively(response, value, value[innerKey]);
      }
    }
  }

  return value;
}

const dummy = {};
function parseModel(response, json) {
  return parseModelRecursively(response, dummy, json);
}

// ATTENTION
// When adding new symbols to this file,
// Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
let REACT_ELEMENT_TYPE = 0xeac7;
let REACT_LAZY_TYPE = 0xead4;
let REACT_BLOCK_TYPE = 0xead9;

if (typeof Symbol === 'function' && Symbol.for) {
  const symbolFor = Symbol.for;
  REACT_ELEMENT_TYPE = symbolFor('react.element');
  REACT_LAZY_TYPE = symbolFor('react.lazy');
  REACT_BLOCK_TYPE = symbolFor('react.block');
}

const PENDING = 0;
const RESOLVED_MODEL = 1;
const INITIALIZED = 2;
const ERRORED = 3;

function Chunk(status, value, response) {
  this._status = status;
  this._value = value;
  this._response = response;
}

Chunk.prototype.then = function (resolve) {
  const chunk = this;

  if (chunk._status === PENDING) {
    if (chunk._value === null) {
      chunk._value = [];
    }

    chunk._value.push(resolve);
  } else {
    resolve();
  }
};

function readChunk(chunk) {
  switch (chunk._status) {
    case INITIALIZED:
      return chunk._value;

    case RESOLVED_MODEL:
      return initializeModelChunk(chunk);

    case PENDING:
      // eslint-disable-next-line no-throw-literal
      throw chunk;

    default:
      throw chunk._value;
  }
}

function readRoot() {
  const response = this;
  const chunk = getChunk(response, 0);
  return readChunk(chunk);
}

function createPendingChunk(response) {
  return new Chunk(PENDING, null, response);
}

function createErrorChunk(response, error) {
  return new Chunk(ERRORED, error, response);
}

function wakeChunk(listeners) {
  if (listeners !== null) {
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
  }
}

function triggerErrorOnChunk(chunk, error) {
  if (chunk._status !== PENDING) {
    // We already resolved. We didn't expect to see this.
    return;
  }

  const listeners = chunk._value;
  const erroredChunk = chunk;
  erroredChunk._status = ERRORED;
  erroredChunk._value = error;
  wakeChunk(listeners);
}

function createResolvedModelChunk(response, value) {
  return new Chunk(RESOLVED_MODEL, value, response);
}

function resolveModelChunk(chunk, value) {
  if (chunk._status !== PENDING) {
    // We already resolved. We didn't expect to see this.
    return;
  }

  const listeners = chunk._value;
  const resolvedChunk = chunk;
  resolvedChunk._status = RESOLVED_MODEL;
  resolvedChunk._value = value;
  wakeChunk(listeners);
}

function initializeModelChunk(chunk) {
  const value = parseModel(chunk._response, chunk._value);
  const initializedChunk = chunk;
  initializedChunk._status = INITIALIZED;
  initializedChunk._value = value;
  return value;
} // Report that any missing chunks in the model is now going to throw this
// error upon read. Also notify any pending promises.


function reportGlobalError(response, error) {
  response._chunks.forEach(chunk => {
    // If this chunk was already resolved or errored, it won't
    // trigger an error but if it wasn't then we need to
    // because we won't be getting any new data to resolve it.
    triggerErrorOnChunk(chunk, error);
  });
}

function readMaybeChunk(maybeChunk) {
  if (maybeChunk == null || !(maybeChunk instanceof Chunk)) {
    // $FlowFixMe
    return maybeChunk;
  }

  const chunk = maybeChunk;
  return readChunk(chunk);
}

function createElement(type, key, props) {
  const element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,
    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: null,
    props: props,
    // Record the component responsible for creating this element.
    _owner: null
  };

  return element;
}

function initializeBlock(tuple) {
  // Require module first and then data. The ordering matters.
  const moduleMetaData = readMaybeChunk(tuple[1]);
  const moduleReference = ReactFlightDOMRelayClientIntegration.resolveModuleReference(moduleMetaData); // TODO: Do this earlier, as the chunk is resolved.

  ReactFlightDOMRelayClientIntegration.preloadModule(moduleReference);
  const moduleExport = ReactFlightDOMRelayClientIntegration.requireModule(moduleReference); // The ordering here is important because this call might suspend.
  // We don't want that to prevent the module graph for being initialized.

  const data = readMaybeChunk(tuple[2]);
  return {
    $$typeof: REACT_BLOCK_TYPE,
    _status: -1,
    _data: data,
    _render: moduleExport
  };
}

function createLazyBlock(tuple) {
  const lazyType = {
    $$typeof: REACT_LAZY_TYPE,
    _payload: tuple,
    _init: initializeBlock
  };
  return lazyType;
}

function getChunk(response, id) {
  const chunks = response._chunks;
  let chunk = chunks.get(id);

  if (!chunk) {
    chunk = createPendingChunk(response);
    chunks.set(id, chunk);
  }

  return chunk;
}

function parseModelString(response, parentObject, value) {
  if (value[0] === '$') {
    if (value === '$') {
      return REACT_ELEMENT_TYPE;
    } else if (value[1] === '$' || value[1] === '@') {
      // This was an escaped string value.
      return value.substring(1);
    } else {
      const id = parseInt(value.substring(1), 16);
      const chunk = getChunk(response, id);

      if (parentObject[0] === REACT_BLOCK_TYPE) {
        // Block types know how to deal with lazy values.
        return chunk;
      } // For anything else we must Suspend this block if
      // we don't yet have the value.


      return readChunk(chunk);
    }
  }

  if (value === '@') {
    return REACT_BLOCK_TYPE;
  }

  return value;
}
function parseModelTuple(response, value) {
  const tuple = value;

  if (tuple[0] === REACT_ELEMENT_TYPE) {
    // TODO: Consider having React just directly accept these arrays as elements.
    // Or even change the ReactElement type to be an array.
    return createElement(tuple[1], tuple[2], tuple[3]);
  } else if (tuple[0] === REACT_BLOCK_TYPE) {
    // TODO: Consider having React just directly accept these arrays as blocks.
    return createLazyBlock(tuple);
  }

  return value;
}
function createResponse() {
  const chunks = new Map();
  const response = {
    _chunks: chunks,
    readRoot: readRoot
  };
  return response;
}
function resolveModel(response, id, model) {
  const chunks = response._chunks;
  const chunk = chunks.get(id);

  if (!chunk) {
    chunks.set(id, createResolvedModelChunk(response, model));
  } else {
    resolveModelChunk(chunk, model);
  }
}
function resolveError(response, id, message, stack) {
  const error = new Error(message);
  error.stack = stack;
  const chunks = response._chunks;
  const chunk = chunks.get(id);

  if (!chunk) {
    chunks.set(id, createErrorChunk(response, error));
  } else {
    triggerErrorOnChunk(chunk, error);
  }
}
function close(response) {
  // In case there are any remaining unresolved chunks, they won't
  // be resolved now. So we need to issue an error to those.
  // Ideally we should be able to early bail out if we kept a
  // ref count of pending chunks.
  reportGlobalError(response, new Error('Connection closed.'));
}

exports.close = close;
exports.createResponse = createResponse;
exports.resolveError = resolveError;
exports.resolveModel = resolveModel;
//# sourceMappingURL=ReactFlightDOMRelayClient-prod.js.map
