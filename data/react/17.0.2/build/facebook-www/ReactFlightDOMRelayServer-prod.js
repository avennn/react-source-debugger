'use strict';

var ReactFlightDOMRelayServerIntegration = require('ReactFlightDOMRelayServerIntegration');
var React = require('react');

// Do not require this module directly! Use normal `invariant` calls with
// template literal strings. The messages will be replaced with error codes
// during build.
function formatProdErrorMessage(code) {
  let url = 'https://reactjs.org/docs/error-decoder.html?invariant=' + code;

  for (let i = 1; i < arguments.length; i++) {
    url += '&args[]=' + encodeURIComponent(arguments[i]);
  }

  return "Minified React error #" + code + "; visit " + url + " for the full message or " + 'use the non-minified dev environment for full errors and additional ' + 'helpful warnings.';
}

function resolveModuleMetaData(config, resource) {
  return ReactFlightDOMRelayServerIntegration.resolveModuleMetaData(config, resource);
}
function processErrorChunk(request, id, message, stack) {
  return {
    type: 'error',
    id: id,
    json: {
      message,
      stack
    }
  };
}

function convertModelToJSON(request, parent, key, model) {
  const json = resolveModelToJSON(request, parent, key, model);

  if (typeof json === 'object' && json !== null) {
    if (Array.isArray(json)) {
      const jsonArray = [];

      for (let i = 0; i < json.length; i++) {
        jsonArray[i] = convertModelToJSON(request, json, '' + i, json[i]);
      }

      return jsonArray;
    } else {
      const jsonObj = {};

      for (const nextKey in json) {
        jsonObj[nextKey] = convertModelToJSON(request, json, nextKey, json[nextKey]);
      }

      return jsonObj;
    }
  }

  return json;
}

function processModelChunk(request, id, model) {
  const json = convertModelToJSON(request, {}, '', model);
  return {
    type: 'json',
    id: id,
    json: json
  };
}
function scheduleWork(callback) {
  callback();
}
function writeChunk(destination, chunk) {
  if (chunk.type === 'json') {
    ReactFlightDOMRelayServerIntegration.emitModel(destination, chunk.id, chunk.json);
  } else {
    ReactFlightDOMRelayServerIntegration.emitError(destination, chunk.id, chunk.json.message, chunk.json.stack);
  }

  return true;
}

// ATTENTION
// When adding new symbols to this file,
// Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
let REACT_ELEMENT_TYPE = 0xeac7;
let REACT_FRAGMENT_TYPE = 0xeacb;
let REACT_STRICT_MODE_TYPE = 0xeacc;
let REACT_PROFILER_TYPE = 0xead2;
let REACT_FORWARD_REF_TYPE = 0xead0;
let REACT_SUSPENSE_TYPE = 0xead1;
let REACT_SUSPENSE_LIST_TYPE = 0xead8;
let REACT_MEMO_TYPE = 0xead3;
let REACT_LAZY_TYPE = 0xead4;
let REACT_BLOCK_TYPE = 0xead9;
let REACT_SERVER_BLOCK_TYPE = 0xeada;
let REACT_SCOPE_TYPE = 0xead7;
let REACT_DEBUG_TRACING_MODE_TYPE = 0xeae1;
let REACT_OFFSCREEN_TYPE = 0xeae2;
let REACT_LEGACY_HIDDEN_TYPE = 0xeae3;

if (typeof Symbol === 'function' && Symbol.for) {
  const symbolFor = Symbol.for;
  REACT_ELEMENT_TYPE = symbolFor('react.element');
  REACT_FRAGMENT_TYPE = symbolFor('react.fragment');
  REACT_STRICT_MODE_TYPE = symbolFor('react.strict_mode');
  REACT_PROFILER_TYPE = symbolFor('react.profiler');
  REACT_FORWARD_REF_TYPE = symbolFor('react.forward_ref');
  REACT_SUSPENSE_TYPE = symbolFor('react.suspense');
  REACT_SUSPENSE_LIST_TYPE = symbolFor('react.suspense_list');
  REACT_MEMO_TYPE = symbolFor('react.memo');
  REACT_LAZY_TYPE = symbolFor('react.lazy');
  REACT_BLOCK_TYPE = symbolFor('react.block');
  REACT_SERVER_BLOCK_TYPE = symbolFor('react.server.block');
  REACT_SCOPE_TYPE = symbolFor('react.scope');
  REACT_DEBUG_TRACING_MODE_TYPE = symbolFor('react.debug_trace_mode');
  REACT_OFFSCREEN_TYPE = symbolFor('react.offscreen');
  REACT_LEGACY_HIDDEN_TYPE = symbolFor('react.legacy_hidden');
}

const ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

const ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
function createRequest(model, destination, bundlerConfig) {
  const pingedSegments = [];
  const request = {
    destination,
    bundlerConfig,
    nextChunkId: 0,
    pendingChunks: 0,
    pingedSegments: pingedSegments,
    completedJSONChunks: [],
    completedErrorChunks: [],
    flowing: false,
    toJSON: function (key, value) {
      return resolveModelToJSON(request, this, key, value);
    }
  };
  request.pendingChunks++;
  const rootSegment = createSegment(request, () => model);
  pingedSegments.push(rootSegment);
  return request;
}

function attemptResolveElement(element) {
  const type = element.type;
  const props = element.props;

  if (typeof type === 'function') {
    // This is a server-side component.
    return type(props);
  } else if (typeof type === 'string') {
    // This is a host element. E.g. HTML.
    return [REACT_ELEMENT_TYPE, type, element.key, element.props];
  } else if (type[0] === REACT_SERVER_BLOCK_TYPE) {
    return [REACT_ELEMENT_TYPE, type, element.key, element.props];
  } else if (type === REACT_FRAGMENT_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_SCOPE_TYPE || type === REACT_DEBUG_TRACING_MODE_TYPE || type === REACT_LEGACY_HIDDEN_TYPE || type === REACT_OFFSCREEN_TYPE || // TODO: These are temporary shims
  // and we'll want a different behavior.
  type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE) {
    return element.props.children;
  } else if (type != null && typeof type === 'object') {
    switch (type.$$typeof) {
      case REACT_FORWARD_REF_TYPE:
        {
          const render = type.render;
          return render(props, undefined);
        }

      case REACT_MEMO_TYPE:
        {
          const nextChildren = React.createElement(type.type, element.props);
          return attemptResolveElement(nextChildren);
        }
    }
  }

  {
    {
      throw Error( formatProdErrorMessage(351));
    }
  }
}

function pingSegment(request, segment) {
  const pingedSegments = request.pingedSegments;
  pingedSegments.push(segment);

  if (pingedSegments.length === 1) {
    scheduleWork(() => performWork(request));
  }
}

function createSegment(request, query) {
  const id = request.nextChunkId++;
  const segment = {
    id,
    query,
    ping: () => pingSegment(request, segment)
  };
  return segment;
}

function serializeIDRef(id) {
  return '$' + id.toString(16);
}

function escapeStringValue(value) {
  if (value[0] === '$' || value[0] === '@') {
    // We need to escape $ or @ prefixed strings since we use those to encode
    // references to IDs and as special symbol values.
    return '$' + value;
  } else {
    return value;
  }
}

function resolveModelToJSON(request, parent, key, value) {
  // Special Symbols
  switch (value) {
    case REACT_ELEMENT_TYPE:
      return '$';

    case REACT_SERVER_BLOCK_TYPE:
      return '@';

    case REACT_LAZY_TYPE:
    case REACT_BLOCK_TYPE:
      {
        {
          throw Error( formatProdErrorMessage(352));
        }
      }

  }

  if (parent[0] === REACT_SERVER_BLOCK_TYPE) {
    // We're currently encoding part of a Block. Look up which key.
    switch (key) {
      case '1':
        {
          // Module reference
          const moduleReference = value;

          try {
            const moduleMetaData = resolveModuleMetaData(request.bundlerConfig, moduleReference);
            return moduleMetaData;
          } catch (x) {
            request.pendingChunks++;
            const errorId = request.nextChunkId++;
            emitErrorChunk(request, errorId, x);
            return serializeIDRef(errorId);
          }
        }

      case '2':
        {
          // Load function
          const load = value;

          try {
            // Attempt to resolve the data.
            return load();
          } catch (x) {
            if (typeof x === 'object' && x !== null && typeof x.then === 'function') {
              // Something suspended, we'll need to create a new segment and resolve it later.
              request.pendingChunks++;
              const newSegment = createSegment(request, load);
              const ping = newSegment.ping;
              x.then(ping, ping);
              return serializeIDRef(newSegment.id);
            } else {
              // This load failed, encode the error as a separate row and reference that.
              request.pendingChunks++;
              const errorId = request.nextChunkId++;
              emitErrorChunk(request, errorId, x);
              return serializeIDRef(errorId);
            }
          }
        }

      default:
        {
          {
            {
              throw Error( formatProdErrorMessage(353));
            }
          }
        }
    }
  }

  if (typeof value === 'string') {
    return escapeStringValue(value);
  } // Resolve server components.


  while (typeof value === 'object' && value !== null && value.$$typeof === REACT_ELEMENT_TYPE) {
    // TODO: Concatenate keys of parents onto children.
    const element = value;

    try {
      // Attempt to render the server component.
      value = attemptResolveElement(element);
    } catch (x) {
      if (typeof x === 'object' && x !== null && typeof x.then === 'function') {
        // Something suspended, we'll need to create a new segment and resolve it later.
        request.pendingChunks++;
        const newSegment = createSegment(request, () => value);
        const ping = newSegment.ping;
        x.then(ping, ping);
        return serializeIDRef(newSegment.id);
      } else {
        // Something errored. Don't bother encoding anything up to here.
        throw x;
      }
    }
  }

  return value;
}

function emitErrorChunk(request, id, error) {
  // TODO: We should not leak error messages to the client in prod.
  // Give this an error code instead and log on the server.
  // We can serialize the error in DEV as a convenience.
  let message;
  let stack = '';

  try {
    if (error instanceof Error) {
      message = '' + error.message;
      stack = '' + error.stack;
    } else {
      message = 'Error: ' + error;
    }
  } catch (x) {
    message = 'An error occurred but serializing the error message failed.';
  }

  const processedChunk = processErrorChunk(request, id, message, stack);
  request.completedErrorChunks.push(processedChunk);
}

function retrySegment(request, segment) {
  const query = segment.query;
  let value;

  try {
    value = query();

    while (typeof value === 'object' && value !== null && value.$$typeof === REACT_ELEMENT_TYPE) {
      // TODO: Concatenate keys of parents onto children.
      const element = value; // Attempt to render the server component.
      // Doing this here lets us reuse this same segment if the next component
      // also suspends.

      segment.query = () => value;

      value = attemptResolveElement(element);
    }

    const processedChunk = processModelChunk(request, segment.id, value);
    request.completedJSONChunks.push(processedChunk);
  } catch (x) {
    if (typeof x === 'object' && x !== null && typeof x.then === 'function') {
      // Something suspended again, let's pick it back up later.
      const ping = segment.ping;
      x.then(ping, ping);
      return;
    } else {
      // This errored, we need to serialize this error to the
      emitErrorChunk(request, segment.id, x);
    }
  }
}

function performWork(request) {
  const prevDispatcher = ReactCurrentDispatcher.current;
  ReactCurrentDispatcher.current = Dispatcher;
  const pingedSegments = request.pingedSegments;
  request.pingedSegments = [];

  for (let i = 0; i < pingedSegments.length; i++) {
    const segment = pingedSegments[i];
    retrySegment(request, segment);
  }

  if (request.flowing) {
    flushCompletedChunks(request);
  }

  ReactCurrentDispatcher.current = prevDispatcher;
}

let reentrant = false;

function flushCompletedChunks(request) {
  if (reentrant) {
    return;
  }

  reentrant = true;
  const destination = request.destination;

  try {
    const jsonChunks = request.completedJSONChunks;
    let i = 0;

    for (; i < jsonChunks.length; i++) {
      request.pendingChunks--;
      const chunk = jsonChunks[i];

      if (!writeChunk(destination, chunk)) {
        request.flowing = false;
        i++;
        break;
      }
    }

    jsonChunks.splice(0, i);
    const errorChunks = request.completedErrorChunks;
    i = 0;

    for (; i < errorChunks.length; i++) {
      request.pendingChunks--;
      const chunk = errorChunks[i];

      if (!writeChunk(destination, chunk)) {
        request.flowing = false;
        i++;
        break;
      }
    }

    errorChunks.splice(0, i);
  } finally {
    reentrant = false;
  }

  if (request.pendingChunks === 0) {
    // We're done.
    ReactFlightDOMRelayServerIntegration.close(destination);
  }
}

function startWork(request) {
  request.flowing = true;
  scheduleWork(() => performWork(request));
}

function unsupportedHook() {
  {
    {
      throw Error( formatProdErrorMessage(373));
    }
  }
}

const Dispatcher = {
  useMemo(nextCreate) {
    return nextCreate();
  },

  useCallback(callback) {
    return callback;
  },

  useDebugValue() {},

  useDeferredValue(value) {
    return value;
  },

  useTransition() {
    return [() => {}, false];
  },

  readContext: unsupportedHook,
  useContext: unsupportedHook,
  useReducer: unsupportedHook,
  useRef: unsupportedHook,
  useState: unsupportedHook,
  useLayoutEffect: unsupportedHook,
  useImperativeHandle: unsupportedHook,
  useEffect: unsupportedHook,
  useOpaqueIdentifier: unsupportedHook,
  useMutableSource: unsupportedHook
};

function render(model, destination, config) {
  const request = createRequest(model, destination, config);
  startWork(request);
}

exports.render = render;
//# sourceMappingURL=ReactFlightDOMRelayServer-prod.js.map
