'use strict';

var ReactFlightDOMRelayServerIntegration = require('ReactFlightDOMRelayServerIntegration');
var React = require('react');

function resolveModuleMetaData(config, resource) {
  return ReactFlightDOMRelayServerIntegration.resolveModuleMetaData(config, resource);
}
function processErrorChunk(request, id, message, stack) {
  return {
    type: 'error',
    id: id,
    json: {
      message: message,
      stack: stack
    }
  };
}

function convertModelToJSON(request, parent, key, model) {
  var json = resolveModelToJSON(request, parent, key, model);

  if (typeof json === 'object' && json !== null) {
    if (Array.isArray(json)) {
      var jsonArray = [];

      for (var i = 0; i < json.length; i++) {
        jsonArray[i] = convertModelToJSON(request, json, '' + i, json[i]);
      }

      return jsonArray;
    } else {
      var jsonObj = {};

      for (var nextKey in json) {
        jsonObj[nextKey] = convertModelToJSON(request, json, nextKey, json[nextKey]);
      }

      return jsonObj;
    }
  }

  return json;
}

function processModelChunk(request, id, model) {
  var json = convertModelToJSON(request, {}, '', model);
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
var REACT_ELEMENT_TYPE = 0xeac7;
var REACT_PORTAL_TYPE = 0xeaca;
var REACT_FRAGMENT_TYPE = 0xeacb;
var REACT_STRICT_MODE_TYPE = 0xeacc;
var REACT_PROFILER_TYPE = 0xead2;
var REACT_PROVIDER_TYPE = 0xeacd;
var REACT_CONTEXT_TYPE = 0xeace;
var REACT_FORWARD_REF_TYPE = 0xead0;
var REACT_SUSPENSE_TYPE = 0xead1;
var REACT_SUSPENSE_LIST_TYPE = 0xead8;
var REACT_MEMO_TYPE = 0xead3;
var REACT_LAZY_TYPE = 0xead4;
var REACT_BLOCK_TYPE = 0xead9;
var REACT_SERVER_BLOCK_TYPE = 0xeada;
var REACT_FUNDAMENTAL_TYPE = 0xead5;
var REACT_SCOPE_TYPE = 0xead7;
var REACT_OPAQUE_ID_TYPE = 0xeae0;
var REACT_DEBUG_TRACING_MODE_TYPE = 0xeae1;
var REACT_OFFSCREEN_TYPE = 0xeae2;
var REACT_LEGACY_HIDDEN_TYPE = 0xeae3;

if (typeof Symbol === 'function' && Symbol.for) {
  var symbolFor = Symbol.for;
  REACT_ELEMENT_TYPE = symbolFor('react.element');
  REACT_PORTAL_TYPE = symbolFor('react.portal');
  REACT_FRAGMENT_TYPE = symbolFor('react.fragment');
  REACT_STRICT_MODE_TYPE = symbolFor('react.strict_mode');
  REACT_PROFILER_TYPE = symbolFor('react.profiler');
  REACT_PROVIDER_TYPE = symbolFor('react.provider');
  REACT_CONTEXT_TYPE = symbolFor('react.context');
  REACT_FORWARD_REF_TYPE = symbolFor('react.forward_ref');
  REACT_SUSPENSE_TYPE = symbolFor('react.suspense');
  REACT_SUSPENSE_LIST_TYPE = symbolFor('react.suspense_list');
  REACT_MEMO_TYPE = symbolFor('react.memo');
  REACT_LAZY_TYPE = symbolFor('react.lazy');
  REACT_BLOCK_TYPE = symbolFor('react.block');
  REACT_SERVER_BLOCK_TYPE = symbolFor('react.server.block');
  REACT_FUNDAMENTAL_TYPE = symbolFor('react.fundamental');
  REACT_SCOPE_TYPE = symbolFor('react.scope');
  REACT_OPAQUE_ID_TYPE = symbolFor('react.opaque.id');
  REACT_DEBUG_TRACING_MODE_TYPE = symbolFor('react.debug_trace_mode');
  REACT_OFFSCREEN_TYPE = symbolFor('react.offscreen');
  REACT_LEGACY_HIDDEN_TYPE = symbolFor('react.legacy_hidden');
}

var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
function createRequest(model, destination, bundlerConfig) {
  var pingedSegments = [];
  var request = {
    destination: destination,
    bundlerConfig: bundlerConfig,
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
  var rootSegment = createSegment(request, function () {
    return model;
  });
  pingedSegments.push(rootSegment);
  return request;
}

function attemptResolveElement(element) {
  var type = element.type;
  var props = element.props;

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
          var render = type.render;
          return render(props, undefined);
        }

      case REACT_MEMO_TYPE:
        {
          var nextChildren = React.createElement(type.type, element.props);
          return attemptResolveElement(nextChildren);
        }
    }
  }

  {
    {
      throw Error( "Unsupported type." );
    }
  }
}

function pingSegment(request, segment) {
  var pingedSegments = request.pingedSegments;
  pingedSegments.push(segment);

  if (pingedSegments.length === 1) {
    scheduleWork(function () {
      return performWork(request);
    });
  }
}

function createSegment(request, query) {
  var id = request.nextChunkId++;
  var segment = {
    id: id,
    query: query,
    ping: function () {
      return pingSegment(request, segment);
    }
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
          throw Error( "React Blocks (and Lazy Components) are expected to be replaced by a compiler on the server. Try configuring your compiler set up and avoid using React.lazy inside of Blocks." );
        }
      }

  }

  if (parent[0] === REACT_SERVER_BLOCK_TYPE) {
    // We're currently encoding part of a Block. Look up which key.
    switch (key) {
      case '1':
        {
          // Module reference
          var moduleReference = value;

          try {
            var moduleMetaData = resolveModuleMetaData(request.bundlerConfig, moduleReference);
            return moduleMetaData;
          } catch (x) {
            request.pendingChunks++;
            var errorId = request.nextChunkId++;
            emitErrorChunk(request, errorId, x);
            return serializeIDRef(errorId);
          }
        }

      case '2':
        {
          // Load function
          var load = value;

          try {
            // Attempt to resolve the data.
            return load();
          } catch (x) {
            if (typeof x === 'object' && x !== null && typeof x.then === 'function') {
              // Something suspended, we'll need to create a new segment and resolve it later.
              request.pendingChunks++;
              var newSegment = createSegment(request, load);
              var ping = newSegment.ping;
              x.then(ping, ping);
              return serializeIDRef(newSegment.id);
            } else {
              // This load failed, encode the error as a separate row and reference that.
              request.pendingChunks++;

              var _errorId = request.nextChunkId++;

              emitErrorChunk(request, _errorId, x);
              return serializeIDRef(_errorId);
            }
          }
        }

      default:
        {
          {
            {
              throw Error( "A server block should never encode any other slots. This is a bug in React." );
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
    var element = value;

    try {
      // Attempt to render the server component.
      value = attemptResolveElement(element);
    } catch (x) {
      if (typeof x === 'object' && x !== null && typeof x.then === 'function') {
        // Something suspended, we'll need to create a new segment and resolve it later.
        request.pendingChunks++;

        var _newSegment = createSegment(request, function () {
          return value;
        });

        var _ping = _newSegment.ping;
        x.then(_ping, _ping);
        return serializeIDRef(_newSegment.id);
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
  var message;
  var stack = '';

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

  var processedChunk = processErrorChunk(request, id, message, stack);
  request.completedErrorChunks.push(processedChunk);
}

function retrySegment(request, segment) {
  var query = segment.query;
  var value;

  try {
    value = query();

    while (typeof value === 'object' && value !== null && value.$$typeof === REACT_ELEMENT_TYPE) {
      // TODO: Concatenate keys of parents onto children.
      var element = value; // Attempt to render the server component.
      // Doing this here lets us reuse this same segment if the next component
      // also suspends.

      segment.query = function () {
        return value;
      };

      value = attemptResolveElement(element);
    }

    var processedChunk = processModelChunk(request, segment.id, value);
    request.completedJSONChunks.push(processedChunk);
  } catch (x) {
    if (typeof x === 'object' && x !== null && typeof x.then === 'function') {
      // Something suspended again, let's pick it back up later.
      var ping = segment.ping;
      x.then(ping, ping);
      return;
    } else {
      // This errored, we need to serialize this error to the
      emitErrorChunk(request, segment.id, x);
    }
  }
}

function performWork(request) {
  var prevDispatcher = ReactCurrentDispatcher.current;
  ReactCurrentDispatcher.current = Dispatcher;
  var pingedSegments = request.pingedSegments;
  request.pingedSegments = [];

  for (var i = 0; i < pingedSegments.length; i++) {
    var segment = pingedSegments[i];
    retrySegment(request, segment);
  }

  if (request.flowing) {
    flushCompletedChunks(request);
  }

  ReactCurrentDispatcher.current = prevDispatcher;
}

var reentrant = false;

function flushCompletedChunks(request) {
  if (reentrant) {
    return;
  }

  reentrant = true;
  var destination = request.destination;

  try {
    var jsonChunks = request.completedJSONChunks;
    var i = 0;

    for (; i < jsonChunks.length; i++) {
      request.pendingChunks--;
      var chunk = jsonChunks[i];

      if (!writeChunk(destination, chunk)) {
        request.flowing = false;
        i++;
        break;
      }
    }

    jsonChunks.splice(0, i);
    var errorChunks = request.completedErrorChunks;
    i = 0;

    for (; i < errorChunks.length; i++) {
      request.pendingChunks--;
      var _chunk = errorChunks[i];

      if (!writeChunk(destination, _chunk)) {
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
  scheduleWork(function () {
    return performWork(request);
  });
}

function unsupportedHook() {
  {
    {
      throw Error( "This Hook is not supported in Server Components." );
    }
  }
}

var Dispatcher = {
  useMemo: function (nextCreate) {
    return nextCreate();
  },
  useCallback: function (callback) {
    return callback;
  },
  useDebugValue: function () {},
  useDeferredValue: function (value) {
    return value;
  },
  useTransition: function () {
    return [function () {}, false];
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
  var request = createRequest(model, destination, config);
  startWork(request);
}

exports.render = render;
//# sourceMappingURL=ReactFlightDOMRelayServer-dev.js.map
