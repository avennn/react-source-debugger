'use strict';

var ReactFlightDOMRelayClientIntegration = require('ReactFlightDOMRelayClientIntegration');
var React = require('react');

var isArrayImpl = Array.isArray; // eslint-disable-next-line no-redeclare

function isArray(a) {
  return isArrayImpl(a);
}

function resolveModuleReference(bundlerConfig, moduleData) {
  return ReactFlightDOMRelayClientIntegration.resolveModuleReference(moduleData);
}

function parseModelRecursively(response, parentObj, value) {
  if (typeof value === 'string') {
    return parseModelString(response, parentObj, value);
  }

  if (typeof value === 'object' && value !== null) {
    if (isArray(value)) {
      var parsedValue = [];

      for (var i = 0; i < value.length; i++) {
        parsedValue[i] = parseModelRecursively(response, value, value[i]);
      }

      return parseModelTuple(response, parsedValue);
    } else {
      var _parsedValue = {};

      for (var innerKey in value) {
        _parsedValue[innerKey] = parseModelRecursively(response, value, value[innerKey]);
      }

      return _parsedValue;
    }
  }

  return value;
}

var dummy = {};
function parseModel(response, json) {
  return parseModelRecursively(response, dummy, json);
}

// Re-export dynamic flags from the www version.
var dynamicFeatureFlags = require('ReactFeatureFlags');

var disableInputAttributeSyncing = dynamicFeatureFlags.disableInputAttributeSyncing,
    enableTrustedTypesIntegration = dynamicFeatureFlags.enableTrustedTypesIntegration,
    disableSchedulerTimeoutBasedOnReactExpirationTime = dynamicFeatureFlags.disableSchedulerTimeoutBasedOnReactExpirationTime,
    warnAboutSpreadingKeyToJSX = dynamicFeatureFlags.warnAboutSpreadingKeyToJSX,
    replayFailedUnitOfWorkWithInvokeGuardedCallback = dynamicFeatureFlags.replayFailedUnitOfWorkWithInvokeGuardedCallback,
    enableFilterEmptyStringAttributesDOM = dynamicFeatureFlags.enableFilterEmptyStringAttributesDOM,
    enableLegacyFBSupport = dynamicFeatureFlags.enableLegacyFBSupport,
    deferRenderPhaseUpdateToNextBatch = dynamicFeatureFlags.deferRenderPhaseUpdateToNextBatch,
    enableDebugTracing = dynamicFeatureFlags.enableDebugTracing,
    skipUnmountedBoundaries = dynamicFeatureFlags.skipUnmountedBoundaries,
    createRootStrictEffectsByDefault = dynamicFeatureFlags.createRootStrictEffectsByDefault,
    enableUseRefAccessWarning = dynamicFeatureFlags.enableUseRefAccessWarning,
    disableNativeComponentFrames = dynamicFeatureFlags.disableNativeComponentFrames,
    disableSchedulerTimeoutInWorkLoop = dynamicFeatureFlags.disableSchedulerTimeoutInWorkLoop,
    enableLazyContextPropagation = dynamicFeatureFlags.enableLazyContextPropagation,
    enableSyncDefaultUpdates = dynamicFeatureFlags.enableSyncDefaultUpdates,
    enableCapturePhaseSelectiveHydrationWithoutDiscreteEventReplay = dynamicFeatureFlags.enableCapturePhaseSelectiveHydrationWithoutDiscreteEventReplay,
    enableClientRenderFallbackOnTextMismatch = dynamicFeatureFlags.enableClientRenderFallbackOnTextMismatch; // On WWW, true is used for a new modern build.
var enableStrictEffects =  dynamicFeatureFlags.enableStrictEffects;
var enableProfilerNestedUpdateScheduledHook =  dynamicFeatureFlags.enableProfilerNestedUpdateScheduledHook;

var enableSchedulingProfiler =  dynamicFeatureFlags.enableSchedulingProfiler; // Note: we'll want to remove this when we to userland implementation.

// ATTENTION
var usePolyfill =  (typeof Symbol !== 'function' || !Symbol.for); // The Symbol used to tag the ReactElement-like types.

var REACT_ELEMENT_TYPE = usePolyfill ? 0xeac7 : Symbol.for('react.element');
var REACT_LAZY_TYPE = usePolyfill ? 0xead4 : Symbol.for('react.lazy');

var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

var ContextRegistry = ReactSharedInternals.ContextRegistry;

var PENDING = 0;
var RESOLVED_MODEL = 1;
var RESOLVED_MODULE = 2;
var INITIALIZED = 3;
var ERRORED = 4;

function Chunk(status, value, response) {
  this._status = status;
  this._value = value;
  this._response = response;
}

Chunk.prototype.then = function (resolve) {
  var chunk = this;

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

    case RESOLVED_MODULE:
      return initializeModuleChunk(chunk);

    case PENDING:
      // eslint-disable-next-line no-throw-literal
      throw chunk;

    default:
      throw chunk._value;
  }
}

function readRoot() {
  var response = this;
  var chunk = getChunk(response, 0);
  return readChunk(chunk);
}

function createPendingChunk(response) {
  return new Chunk(PENDING, null, response);
}

function createErrorChunk(response, error) {
  return new Chunk(ERRORED, error, response);
}

function createInitializedChunk(response, value) {
  return new Chunk(INITIALIZED, value, response);
}

function wakeChunk(listeners) {
  if (listeners !== null) {
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }
  }
}

function triggerErrorOnChunk(chunk, error) {
  if (chunk._status !== PENDING) {
    // We already resolved. We didn't expect to see this.
    return;
  }

  var listeners = chunk._value;
  var erroredChunk = chunk;
  erroredChunk._status = ERRORED;
  erroredChunk._value = error;
  wakeChunk(listeners);
}

function createResolvedModelChunk(response, value) {
  return new Chunk(RESOLVED_MODEL, value, response);
}

function createResolvedModuleChunk(response, value) {
  return new Chunk(RESOLVED_MODULE, value, response);
}

function resolveModelChunk(chunk, value) {
  if (chunk._status !== PENDING) {
    // We already resolved. We didn't expect to see this.
    return;
  }

  var listeners = chunk._value;
  var resolvedChunk = chunk;
  resolvedChunk._status = RESOLVED_MODEL;
  resolvedChunk._value = value;
  wakeChunk(listeners);
}

function resolveModuleChunk(chunk, value) {
  if (chunk._status !== PENDING) {
    // We already resolved. We didn't expect to see this.
    return;
  }

  var listeners = chunk._value;
  var resolvedChunk = chunk;
  resolvedChunk._status = RESOLVED_MODULE;
  resolvedChunk._value = value;
  wakeChunk(listeners);
}

function initializeModelChunk(chunk) {
  var value = parseModel(chunk._response, chunk._value);
  var initializedChunk = chunk;
  initializedChunk._status = INITIALIZED;
  initializedChunk._value = value;
  return value;
}

function initializeModuleChunk(chunk) {
  var value = ReactFlightDOMRelayClientIntegration.requireModule(chunk._value);
  var initializedChunk = chunk;
  initializedChunk._status = INITIALIZED;
  initializedChunk._value = value;
  return value;
} // Report that any missing chunks in the model is now going to throw this
// error upon read. Also notify any pending promises.


function reportGlobalError(response, error) {
  response._chunks.forEach(function (chunk) {
    // If this chunk was already resolved or errored, it won't
    // trigger an error but if it wasn't then we need to
    // because we won't be getting any new data to resolve it.
    triggerErrorOnChunk(chunk, error);
  });
}

function createElement(type, key, props) {
  var element = {
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

  {
    // We don't really need to add any of these but keeping them for good measure.
    // Unfortunately, _store is enumerable in jest matchers so for equality to
    // work, I need to keep it or make _store non-enumerable in the other file.
    element._store = {};
    Object.defineProperty(element._store, 'validated', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: true // This element has already been validated on the server.

    });
    Object.defineProperty(element, '_self', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: null
    });
    Object.defineProperty(element, '_source', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: null
    });
  }

  return element;
}

function createLazyChunkWrapper(chunk) {
  var lazyType = {
    $$typeof: REACT_LAZY_TYPE,
    _payload: chunk,
    _init: readChunk
  };
  return lazyType;
}

function getChunk(response, id) {
  var chunks = response._chunks;
  var chunk = chunks.get(id);

  if (!chunk) {
    chunk = createPendingChunk(response);
    chunks.set(id, chunk);
  }

  return chunk;
}

function parseModelString(response, parentObject, value) {
  switch (value[0]) {
    case '$':
      {
        if (value === '$') {
          return REACT_ELEMENT_TYPE;
        } else if (value[1] === '$' || value[1] === '@') {
          // This was an escaped string value.
          return value.substring(1);
        } else {
          var id = parseInt(value.substring(1), 16);
          var chunk = getChunk(response, id);
          return readChunk(chunk);
        }
      }

    case '@':
      {
        var _id = parseInt(value.substring(1), 16);

        var _chunk = getChunk(response, _id); // We create a React.lazy wrapper around any lazy values.
        // When passed into React, we'll know how to suspend on this.


        return createLazyChunkWrapper(_chunk);
      }
  }

  return value;
}
function parseModelTuple(response, value) {
  var tuple = value;

  if (tuple[0] === REACT_ELEMENT_TYPE) {
    // TODO: Consider having React just directly accept these arrays as elements.
    // Or even change the ReactElement type to be an array.
    return createElement(tuple[1], tuple[2], tuple[3]);
  }

  return value;
}
function createResponse(bundlerConfig) {
  var chunks = new Map();
  var response = {
    _bundlerConfig: bundlerConfig,
    _chunks: chunks,
    readRoot: readRoot
  };
  return response;
}
function resolveModel(response, id, model) {
  var chunks = response._chunks;
  var chunk = chunks.get(id);

  if (!chunk) {
    chunks.set(id, createResolvedModelChunk(response, model));
  } else {
    resolveModelChunk(chunk, model);
  }
}
function resolveModule(response, id, model) {
  var chunks = response._chunks;
  var chunk = chunks.get(id);
  var moduleMetaData = parseModel(response, model);
  var moduleReference = resolveModuleReference(response._bundlerConfig, moduleMetaData); // TODO: Add an option to encode modules that are lazy loaded.
  // For now we preload all modules as early as possible since it's likely
  // that we'll need them.

  ReactFlightDOMRelayClientIntegration.preloadModule(moduleReference);

  if (!chunk) {
    chunks.set(id, createResolvedModuleChunk(response, moduleReference));
  } else {
    resolveModuleChunk(chunk, moduleReference);
  }
}
function resolveSymbol(response, id, name) {
  var chunks = response._chunks; // We assume that we'll always emit the symbol before anything references it
  // to save a few bytes.

  chunks.set(id, createInitializedChunk(response, Symbol.for(name)));
}
function resolveError(response, id, message, stack) {
  // eslint-disable-next-line react-internal/prod-error-codes
  var error = new Error(message);
  error.stack = stack;
  var chunks = response._chunks;
  var chunk = chunks.get(id);

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

function resolveRow(response, chunk) {
  if (chunk[0] === 'J') {
    resolveModel(response, chunk[1], chunk[2]);
  } else if (chunk[0] === 'M') {
    resolveModule(response, chunk[1], chunk[2]);
  } else if (chunk[0] === 'S') {
    // $FlowFixMe: Flow doesn't support disjoint unions on tuples.
    resolveSymbol(response, chunk[1], chunk[2]);
  } else {
    // $FlowFixMe: Flow doesn't support disjoint unions on tuples.
    resolveError(response, chunk[1], chunk[2].message, chunk[2].stack);
  }
}

exports.close = close;
exports.createResponse = createResponse;
exports.resolveRow = resolveRow;
//# sourceMappingURL=ReactFlightDOMRelayClient-dev.js.map
