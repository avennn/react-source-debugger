'use strict';

var JSResourceReferenceImpl = require('JSResourceReferenceImpl');
var ReactFlightNativeRelayServerIntegration = require('ReactFlightNativeRelayServerIntegration');
var util = require('util');
var React = require('react');

const hasOwnProperty = Object.prototype.hasOwnProperty;

const isArrayImpl = Array.isArray; // eslint-disable-next-line no-redeclare

function isArray(a) {
  return isArrayImpl(a);
}

function isModuleReference(reference) {
  return reference instanceof JSResourceReferenceImpl;
}
function getModuleKey(reference) {
  // We use the reference object itself as the key because we assume the
  // object will be cached by the bundler runtime.
  return reference;
}
function resolveModuleMetaData(config, resource) {
  return ReactFlightNativeRelayServerIntegration.resolveModuleMetaData(config, resource);
}
function processErrorChunk(request, id, message, stack) {
  return ['E', id, {
    message,
    stack
  }];
}

function convertModelToJSON(request, parent, key, model) {
  const json = resolveModelToJSON(request, parent, key, model);

  if (typeof json === 'object' && json !== null) {
    if (isArray(json)) {
      const jsonArray = [];

      for (let i = 0; i < json.length; i++) {
        jsonArray[i] = convertModelToJSON(request, json, '' + i, json[i]);
      }

      return jsonArray;
    } else {
      const jsonObj = {};

      for (const nextKey in json) {
        if (hasOwnProperty.call(json, nextKey)) {
          jsonObj[nextKey] = convertModelToJSON(request, json, nextKey, json[nextKey]);
        }
      }

      return jsonObj;
    }
  }

  return json;
}

function processModelChunk(request, id, model) {
  const json = convertModelToJSON(request, {}, '', model);
  return ['J', id, json];
}
function processModuleChunk(request, id, moduleMetaData) {
  // The moduleMetaData is already a JSON serializable value.
  return ['M', id, moduleMetaData];
}
function processProviderChunk(request, id, contextName) {
  return ['P', id, contextName];
}
function processSymbolChunk(request, id, name) {
  return ['S', id, name];
}
function scheduleWork(callback) {
  callback();
}
function writeChunkAndReturn(destination, chunk) {
  ReactFlightNativeRelayServerIntegration.emitRow(destination, chunk);
  return true;
}
function closeWithError(destination, error) {
  ReactFlightNativeRelayServerIntegration.close(destination);
}

// ATTENTION
// When adding new symbols to this file,
// Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
// The Symbol used to tag the ReactElement-like types.
const REACT_ELEMENT_TYPE = Symbol.for('react.element');
const REACT_FRAGMENT_TYPE = Symbol.for('react.fragment');
const REACT_PROVIDER_TYPE = Symbol.for('react.provider');
const REACT_FORWARD_REF_TYPE = Symbol.for('react.forward_ref');
const REACT_MEMO_TYPE = Symbol.for('react.memo');
const REACT_LAZY_TYPE = Symbol.for('react.lazy');
const REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED = Symbol.for('react.default_value');

const textEncoder = new util.TextEncoder();
function stringToPrecomputedChunk(content) {
  return textEncoder.encode(content);
}

const END_TAG = 0; // Tree node tags.

const INSTANCE_TAG = 1;
const PLACEHOLDER_TAG = 2;
const SUSPENSE_PENDING_TAG = 3;
const SUSPENSE_COMPLETE_TAG = 4;
const SUSPENSE_CLIENT_RENDER_TAG = 5; // Command tags.

const SEGMENT_TAG = 1;
const SUSPENSE_UPDATE_TO_COMPLETE_TAG = 2;
const SUSPENSE_UPDATE_TO_CLIENT_RENDER_TAG = 3;
const END = new Uint8Array(1);
END[0] = END_TAG;
const PLACEHOLDER = new Uint8Array(1);
PLACEHOLDER[0] = PLACEHOLDER_TAG;
const INSTANCE = new Uint8Array(1);
INSTANCE[0] = INSTANCE_TAG;
const SUSPENSE_PENDING = new Uint8Array(1);
SUSPENSE_PENDING[0] = SUSPENSE_PENDING_TAG;
const SUSPENSE_COMPLETE = new Uint8Array(1);
SUSPENSE_COMPLETE[0] = SUSPENSE_COMPLETE_TAG;
const SUSPENSE_CLIENT_RENDER = new Uint8Array(1);
SUSPENSE_CLIENT_RENDER[0] = SUSPENSE_CLIENT_RENDER_TAG;
const SEGMENT = new Uint8Array(1);
SEGMENT[0] = SEGMENT_TAG;
const SUSPENSE_UPDATE_TO_COMPLETE = new Uint8Array(1);
SUSPENSE_UPDATE_TO_COMPLETE[0] = SUSPENSE_UPDATE_TO_COMPLETE_TAG;
const SUSPENSE_UPDATE_TO_CLIENT_RENDER = new Uint8Array(1);
SUSPENSE_UPDATE_TO_CLIENT_RENDER[0] = SUSPENSE_UPDATE_TO_CLIENT_RENDER_TAG; // Per response,
const RAW_TEXT = stringToPrecomputedChunk('RCTRawText');

// Forming a reverse tree.


const rootContextSnapshot = null; // We assume that this runtime owns the "current" field on all ReactContext instances.
// This global (actually thread local) state represents what state all those "current",
// fields are currently in.

let currentActiveSnapshot = null;

function popNode(prev) {
  {
    prev.context._currentValue = prev.parentValue;
  }
}

function pushNode(next) {
  {
    next.context._currentValue = next.value;
  }
}

function popToNearestCommonAncestor(prev, next) {
  if (prev === next) ; else {
    popNode(prev);
    const parentPrev = prev.parent;
    const parentNext = next.parent;

    if (parentPrev === null) {
      if (parentNext !== null) {
        throw new Error('The stacks must reach the root at the same time. This is a bug in React.');
      }
    } else {
      if (parentNext === null) {
        throw new Error('The stacks must reach the root at the same time. This is a bug in React.');
      }

      popToNearestCommonAncestor(parentPrev, parentNext); // On the way back, we push the new ones that weren't common.

      pushNode(next);
    }
  }
}

function popAllPrevious(prev) {
  popNode(prev);
  const parentPrev = prev.parent;

  if (parentPrev !== null) {
    popAllPrevious(parentPrev);
  }
}

function pushAllNext(next) {
  const parentNext = next.parent;

  if (parentNext !== null) {
    pushAllNext(parentNext);
  }

  pushNode(next);
}

function popPreviousToCommonLevel(prev, next) {
  popNode(prev);
  const parentPrev = prev.parent;

  if (parentPrev === null) {
    throw new Error('The depth must equal at least at zero before reaching the root. This is a bug in React.');
  }

  if (parentPrev.depth === next.depth) {
    // We found the same level. Now we just need to find a shared ancestor.
    popToNearestCommonAncestor(parentPrev, next);
  } else {
    // We must still be deeper.
    popPreviousToCommonLevel(parentPrev, next);
  }
}

function popNextToCommonLevel(prev, next) {
  const parentNext = next.parent;

  if (parentNext === null) {
    throw new Error('The depth must equal at least at zero before reaching the root. This is a bug in React.');
  }

  if (prev.depth === parentNext.depth) {
    // We found the same level. Now we just need to find a shared ancestor.
    popToNearestCommonAncestor(prev, parentNext);
  } else {
    // We must still be deeper.
    popNextToCommonLevel(prev, parentNext);
  }

  pushNode(next);
} // Perform context switching to the new snapshot.
// To make it cheap to read many contexts, while not suspending, we make the switch eagerly by
// updating all the context's current values. That way reads, always just read the current value.
// At the cost of updating contexts even if they're never read by this subtree.


function switchContext(newSnapshot) {
  // The basic algorithm we need to do is to pop back any contexts that are no longer on the stack.
  // We also need to update any new contexts that are now on the stack with the deepest value.
  // The easiest way to update new contexts is to just reapply them in reverse order from the
  // perspective of the backpointers. To avoid allocating a lot when switching, we use the stack
  // for that. Therefore this algorithm is recursive.
  // 1) First we pop which ever snapshot tree was deepest. Popping old contexts as we go.
  // 2) Then we find the nearest common ancestor from there. Popping old contexts as we go.
  // 3) Then we reapply new contexts on the way back up the stack.
  const prev = currentActiveSnapshot;
  const next = newSnapshot;

  if (prev !== next) {
    if (prev === null) {
      // $FlowFixMe: This has to be non-null since it's not equal to prev.
      pushAllNext(next);
    } else if (next === null) {
      popAllPrevious(prev);
    } else if (prev.depth === next.depth) {
      popToNearestCommonAncestor(prev, next);
    } else if (prev.depth > next.depth) {
      popPreviousToCommonLevel(prev, next);
    } else {
      popNextToCommonLevel(prev, next);
    }

    currentActiveSnapshot = next;
  }
}
function pushProvider(context, nextValue) {
  let prevValue;

  {
    prevValue = context._currentValue;
    context._currentValue = nextValue;
  }

  const prevNode = currentActiveSnapshot;
  const newNode = {
    parent: prevNode,
    depth: prevNode === null ? 0 : prevNode.depth + 1,
    context: context,
    parentValue: prevValue,
    value: nextValue
  };
  currentActiveSnapshot = newNode;
  return newNode;
}
function popProvider() {
  const prevSnapshot = currentActiveSnapshot;

  if (prevSnapshot === null) {
    throw new Error('Tried to pop a Context at the root of the app. This is a bug in React.');
  }

  {
    const value = prevSnapshot.parentValue;

    if (value === REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED) {
      prevSnapshot.context._currentValue = prevSnapshot.context._defaultValue;
    } else {
      prevSnapshot.context._currentValue = value;
    }
  }

  return currentActiveSnapshot = prevSnapshot.parent;
}
function getActiveContext() {
  return currentActiveSnapshot;
}
function readContext(context) {
  const value =  context._currentValue ;
  return value;
}

let currentRequest = null;
function prepareToUseHooksForRequest(request) {
  currentRequest = request;
}
function resetHooksForRequest() {
  currentRequest = null;
}

function readContext$1(context) {

  return readContext(context);
}

const Dispatcher = {
  useMemo(nextCreate) {
    return nextCreate();
  },

  useCallback(callback) {
    return callback;
  },

  useDebugValue() {},

  useDeferredValue: unsupportedHook,
  useTransition: unsupportedHook,

  getCacheForType(resourceType) {
    if (!currentCache) {
      throw new Error('Reading the cache is only supported while rendering.');
    }

    let entry = currentCache.get(resourceType);

    if (entry === undefined) {
      entry = resourceType(); // TODO: Warn if undefined?

      currentCache.set(resourceType, entry);
    }

    return entry;
  },

  readContext: readContext$1,
  useContext: readContext$1,
  useReducer: unsupportedHook,
  useRef: unsupportedHook,
  useState: unsupportedHook,
  useInsertionEffect: unsupportedHook,
  useLayoutEffect: unsupportedHook,
  useImperativeHandle: unsupportedHook,
  useEffect: unsupportedHook,
  useId,
  useMutableSource: unsupportedHook,
  useSyncExternalStore: unsupportedHook,

  useCacheRefresh() {
    return unsupportedRefresh;
  }

};

function unsupportedHook() {
  throw new Error('This Hook is not supported in Server Components.');
}

function unsupportedRefresh() {
  if (!currentCache) {
    throw new Error('Refreshing the cache is not supported in Server Components.');
  }
}

let currentCache = null;
function setCurrentCache(cache) {
  currentCache = cache;
  return currentCache;
}
function getCurrentCache() {
  return currentCache;
}

function useId() {
  if (currentRequest === null) {
    throw new Error('useId can only be used while React is rendering');
  }

  const id = currentRequest.identifierCount++; // use 'S' for Flight components to distinguish from 'R' and 'r' in Fizz/Client

  return ':' + currentRequest.identifierPrefix + 'S' + id.toString(32) + ':';
}

const ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

const ContextRegistry = ReactSharedInternals.ContextRegistry;
function getOrCreateServerContext(globalName) {
  if (!ContextRegistry[globalName]) {
    ContextRegistry[globalName] = React.createServerContext(globalName, REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED);
  }

  return ContextRegistry[globalName];
}

const ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;

function defaultErrorHandler(error) {
  console['error'](error); // Don't transform to our wrapper
}

const OPEN = 0;
const CLOSING = 1;
const CLOSED = 2;
function createRequest(model, bundlerConfig, onError, context, identifierPrefix) {
  const pingedSegments = [];
  const request = {
    status: OPEN,
    fatalError: null,
    destination: null,
    bundlerConfig,
    cache: new Map(),
    nextChunkId: 0,
    pendingChunks: 0,
    pingedSegments: pingedSegments,
    completedModuleChunks: [],
    completedJSONChunks: [],
    completedErrorChunks: [],
    writtenSymbols: new Map(),
    writtenModules: new Map(),
    writtenProviders: new Map(),
    identifierPrefix: identifierPrefix || '',
    identifierCount: 1,
    onError: onError === undefined ? defaultErrorHandler : onError,
    toJSON: function (key, value) {
      return resolveModelToJSON(request, this, key, value);
    }
  };
  request.pendingChunks++;
  const rootContext = createRootContext(context);
  const rootSegment = createSegment(request, model, rootContext);
  pingedSegments.push(rootSegment);
  return request;
}

function createRootContext(reqContext) {
  return importServerContexts(reqContext);
}

const POP = {};

function attemptResolveElement(type, key, ref, props) {
  if (ref !== null && ref !== undefined) {
    // When the ref moves to the regular props object this will implicitly
    // throw for functions. We could probably relax it to a DEV warning for other
    // cases.
    throw new Error('Refs cannot be used in server components, nor passed to client components.');
  }

  if (typeof type === 'function') {
    // This is a server-side component.
    return type(props);
  } else if (typeof type === 'string') {
    // This is a host element. E.g. HTML.
    return [REACT_ELEMENT_TYPE, type, key, props];
  } else if (typeof type === 'symbol') {
    if (type === REACT_FRAGMENT_TYPE) {
      // For key-less fragments, we add a small optimization to avoid serializing
      // it as a wrapper.
      // TODO: If a key is specified, we should propagate its key to any children.
      // Same as if a server component has a key.
      return props.children;
    } // This might be a built-in React component. We'll let the client decide.
    // Any built-in works as long as its props are serializable.


    return [REACT_ELEMENT_TYPE, type, key, props];
  } else if (type != null && typeof type === 'object') {
    if (isModuleReference(type)) {
      // This is a reference to a client component.
      return [REACT_ELEMENT_TYPE, type, key, props];
    }

    switch (type.$$typeof) {
      case REACT_LAZY_TYPE:
        {
          const payload = type._payload;
          const init = type._init;
          const wrappedType = init(payload);
          return attemptResolveElement(wrappedType, key, ref, props);
        }

      case REACT_FORWARD_REF_TYPE:
        {
          const render = type.render;
          return render(props, undefined);
        }

      case REACT_MEMO_TYPE:
        {
          return attemptResolveElement(type.type, key, ref, props);
        }

      case REACT_PROVIDER_TYPE:
        {
          pushProvider(type._context, props.value);

          return [REACT_ELEMENT_TYPE, type, key, // Rely on __popProvider being serialized last to pop the provider.
          {
            value: props.value,
            children: props.children,
            __pop: POP
          }];
        }
    }
  }

  throw new Error("Unsupported server component type: " + describeValueForErrorMessage(type));
}

function pingSegment(request, segment) {
  const pingedSegments = request.pingedSegments;
  pingedSegments.push(segment);

  if (pingedSegments.length === 1) {
    scheduleWork(() => performWork(request));
  }
}

function createSegment(request, model, context) {
  const id = request.nextChunkId++;
  const segment = {
    id,
    model,
    context,
    ping: () => pingSegment(request, segment)
  };
  return segment;
}

function serializeByValueID(id) {
  return '$' + id.toString(16);
}

function serializeByRefID(id) {
  return '@' + id.toString(16);
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

function objectName(object) {
  const name = Object.prototype.toString.call(object);
  return name.replace(/^\[object (.*)\]$/, function (m, p0) {
    return p0;
  });
}

function describeKeyForErrorMessage(key) {
  const encodedKey = JSON.stringify(key);
  return '"' + key + '"' === encodedKey ? key : encodedKey;
}

function describeValueForErrorMessage(value) {
  switch (typeof value) {
    case 'string':
      {
        return JSON.stringify(value.length <= 10 ? value : value.substr(0, 10) + '...');
      }

    case 'object':
      {
        if (isArray(value)) {
          return '[...]';
        }

        const name = objectName(value);

        if (name === 'Object') {
          return '{...}';
        }

        return name;
      }

    case 'function':
      return 'function';

    default:
      // eslint-disable-next-line react-internal/safe-string-coercion
      return String(value);
  }
}

function describeObjectForErrorMessage(objectOrArray, expandedName) {
  if (isArray(objectOrArray)) {
    let str = '[';
    const array = objectOrArray;

    for (let i = 0; i < array.length; i++) {
      if (i > 0) {
        str += ', ';
      }

      if (i > 6) {
        str += '...';
        break;
      }

      const value = array[i];

      if ('' + i === expandedName && typeof value === 'object' && value !== null) {
        str += describeObjectForErrorMessage(value);
      } else {
        str += describeValueForErrorMessage(value);
      }
    }

    str += ']';
    return str;
  } else {
    let str = '{';
    const object = objectOrArray;
    const names = Object.keys(object);

    for (let i = 0; i < names.length; i++) {
      if (i > 0) {
        str += ', ';
      }

      if (i > 6) {
        str += '...';
        break;
      }

      const name = names[i];
      str += describeKeyForErrorMessage(name) + ': ';
      const value = object[name];

      if (name === expandedName && typeof value === 'object' && value !== null) {
        str += describeObjectForErrorMessage(value);
      } else {
        str += describeValueForErrorMessage(value);
      }
    }

    str += '}';
    return str;
  }
}
function resolveModelToJSON(request, parent, key, value) {


  switch (value) {
    case REACT_ELEMENT_TYPE:
      return '$';
  }


  while (typeof value === 'object' && value !== null && (value.$$typeof === REACT_ELEMENT_TYPE || value.$$typeof === REACT_LAZY_TYPE)) {

    try {
      switch (value.$$typeof) {
        case REACT_ELEMENT_TYPE:
          {
            // TODO: Concatenate keys of parents onto children.
            const element = value; // Attempt to render the server component.

            value = attemptResolveElement(element.type, element.key, element.ref, element.props);
            break;
          }

        case REACT_LAZY_TYPE:
          {
            const payload = value._payload;
            const init = value._init;
            value = init(payload);
            break;
          }
      }
    } catch (x) {
      if (typeof x === 'object' && x !== null && typeof x.then === 'function') {
        // Something suspended, we'll need to create a new segment and resolve it later.
        request.pendingChunks++;
        const newSegment = createSegment(request, value, getActiveContext());
        const ping = newSegment.ping;
        x.then(ping, ping);
        return serializeByRefID(newSegment.id);
      } else {
        logRecoverableError(request, x); // Something errored. We'll still send everything we have up until this point.
        // We'll replace this element with a lazy reference that throws on the client
        // once it gets rendered.

        request.pendingChunks++;
        const errorId = request.nextChunkId++;
        emitErrorChunk(request, errorId, x);
        return serializeByRefID(errorId);
      }
    }
  }

  if (value === null) {
    return null;
  }

  if (typeof value === 'object') {
    if (isModuleReference(value)) {
      const moduleReference = value;
      const moduleKey = getModuleKey(moduleReference);
      const writtenModules = request.writtenModules;
      const existingId = writtenModules.get(moduleKey);

      if (existingId !== undefined) {
        if (parent[0] === REACT_ELEMENT_TYPE && key === '1') {
          // If we're encoding the "type" of an element, we can refer
          // to that by a lazy reference instead of directly since React
          // knows how to deal with lazy values. This lets us suspend
          // on this component rather than its parent until the code has
          // loaded.
          return serializeByRefID(existingId);
        }

        return serializeByValueID(existingId);
      }

      try {
        const moduleMetaData = resolveModuleMetaData(request.bundlerConfig, moduleReference);
        request.pendingChunks++;
        const moduleId = request.nextChunkId++;
        emitModuleChunk(request, moduleId, moduleMetaData);
        writtenModules.set(moduleKey, moduleId);

        if (parent[0] === REACT_ELEMENT_TYPE && key === '1') {
          // If we're encoding the "type" of an element, we can refer
          // to that by a lazy reference instead of directly since React
          // knows how to deal with lazy values. This lets us suspend
          // on this component rather than its parent until the code has
          // loaded.
          return serializeByRefID(moduleId);
        }

        return serializeByValueID(moduleId);
      } catch (x) {
        request.pendingChunks++;
        const errorId = request.nextChunkId++;
        emitErrorChunk(request, errorId, x);
        return serializeByValueID(errorId);
      }
    } else if (value.$$typeof === REACT_PROVIDER_TYPE) {
      const providerKey = value._context._globalName;
      const writtenProviders = request.writtenProviders;
      let providerId = writtenProviders.get(key);

      if (providerId === undefined) {
        request.pendingChunks++;
        providerId = request.nextChunkId++;
        writtenProviders.set(providerKey, providerId);
        emitProviderChunk(request, providerId, providerKey);
      }

      return serializeByValueID(providerId);
    } else if (value === POP) {
      popProvider();

      return undefined;
    }

    return value;
  }

  if (typeof value === 'string') {
    return escapeStringValue(value);
  }

  if (typeof value === 'boolean' || typeof value === 'number' || typeof value === 'undefined') {
    return value;
  }

  if (typeof value === 'function') {
    if (/^on[A-Z]/.test(key)) {
      throw new Error('Event handlers cannot be passed to client component props. ' + ("Remove " + describeKeyForErrorMessage(key) + " from these props if possible: " + describeObjectForErrorMessage(parent) + "\n") + 'If you need interactivity, consider converting part of this to a client component.');
    } else {
      throw new Error('Functions cannot be passed directly to client components ' + "because they're not serializable. " + ("Remove " + describeKeyForErrorMessage(key) + " (" + (value.displayName || value.name || 'function') + ") from this object, or avoid the entire object: " + describeObjectForErrorMessage(parent)));
    }
  }

  if (typeof value === 'symbol') {
    const writtenSymbols = request.writtenSymbols;
    const existingId = writtenSymbols.get(value);

    if (existingId !== undefined) {
      return serializeByValueID(existingId);
    }

    const name = value.description;

    if (Symbol.for(name) !== value) {
      throw new Error('Only global symbols received from Symbol.for(...) can be passed to client components. ' + ("The symbol Symbol.for(" + value.description + ") cannot be found among global symbols. ") + ("Remove " + describeKeyForErrorMessage(key) + " from this object, or avoid the entire object: " + describeObjectForErrorMessage(parent)));
    }

    request.pendingChunks++;
    const symbolId = request.nextChunkId++;
    emitSymbolChunk(request, symbolId, name);
    writtenSymbols.set(value, symbolId);
    return serializeByValueID(symbolId);
  } // $FlowFixMe: bigint isn't added to Flow yet.


  if (typeof value === 'bigint') {
    throw new Error("BigInt (" + value + ") is not yet supported in client component props. " + ("Remove " + describeKeyForErrorMessage(key) + " from this object or use a plain number instead: " + describeObjectForErrorMessage(parent)));
  }

  throw new Error("Type " + typeof value + " is not supported in client component props. " + ("Remove " + describeKeyForErrorMessage(key) + " from this object, or avoid the entire object: " + describeObjectForErrorMessage(parent)));
}

function logRecoverableError(request, error) {
  const onError = request.onError;
  onError(error);
}

function fatalError(request, error) {
  // This is called outside error handling code such as if an error happens in React internals.
  if (request.destination !== null) {
    request.status = CLOSED;
    closeWithError(request.destination);
  } else {
    request.status = CLOSING;
    request.fatalError = error;
  }
}

function emitErrorChunk(request, id, error) {
  // TODO: We should not leak error messages to the client in prod.
  // Give this an error code instead and log on the server.
  // We can serialize the error in DEV as a convenience.
  let message;
  let stack = '';

  try {
    if (error instanceof Error) {
      // eslint-disable-next-line react-internal/safe-string-coercion
      message = String(error.message); // eslint-disable-next-line react-internal/safe-string-coercion

      stack = String(error.stack);
    } else {
      message = 'Error: ' + error;
    }
  } catch (x) {
    message = 'An error occurred but serializing the error message failed.';
  }

  const processedChunk = processErrorChunk(request, id, message, stack);
  request.completedErrorChunks.push(processedChunk);
}

function emitModuleChunk(request, id, moduleMetaData) {
  const processedChunk = processModuleChunk(request, id, moduleMetaData);
  request.completedModuleChunks.push(processedChunk);
}

function emitSymbolChunk(request, id, name) {
  const processedChunk = processSymbolChunk(request, id, name);
  request.completedModuleChunks.push(processedChunk);
}

function emitProviderChunk(request, id, contextName) {
  const processedChunk = processProviderChunk(request, id, contextName);
  request.completedJSONChunks.push(processedChunk);
}

function retrySegment(request, segment) {
  switchContext(segment.context);

  try {
    let value = segment.model;

    while (typeof value === 'object' && value !== null && value.$$typeof === REACT_ELEMENT_TYPE) {
      // TODO: Concatenate keys of parents onto children.
      const element = value; // Attempt to render the server component.
      // Doing this here lets us reuse this same segment if the next component
      // also suspends.

      segment.model = value;
      value = attemptResolveElement(element.type, element.key, element.ref, element.props);
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
      logRecoverableError(request, x); // This errored, we need to serialize this error to the

      emitErrorChunk(request, segment.id, x);
    }
  }
}

function performWork(request) {
  const prevDispatcher = ReactCurrentDispatcher.current;
  const prevCache = getCurrentCache();
  ReactCurrentDispatcher.current = Dispatcher;
  setCurrentCache(request.cache);
  prepareToUseHooksForRequest(request);

  try {
    const pingedSegments = request.pingedSegments;
    request.pingedSegments = [];

    for (let i = 0; i < pingedSegments.length; i++) {
      const segment = pingedSegments[i];
      retrySegment(request, segment);
    }

    if (request.destination !== null) {
      flushCompletedChunks(request, request.destination);
    }
  } catch (error) {
    logRecoverableError(request, error);
    fatalError(request, error);
  } finally {
    ReactCurrentDispatcher.current = prevDispatcher;
    setCurrentCache(prevCache);
    resetHooksForRequest();
  }
}

function flushCompletedChunks(request, destination) {

  try {
    // We emit module chunks first in the stream so that
    // they can be preloaded as early as possible.
    const moduleChunks = request.completedModuleChunks;
    let i = 0;

    for (; i < moduleChunks.length; i++) {
      request.pendingChunks--;
      const chunk = moduleChunks[i];
      const keepWriting = writeChunkAndReturn(destination, chunk);

      if (!keepWriting) {
        request.destination = null;
        i++;
        break;
      }
    }

    moduleChunks.splice(0, i); // Next comes model data.

    const jsonChunks = request.completedJSONChunks;
    i = 0;

    for (; i < jsonChunks.length; i++) {
      request.pendingChunks--;
      const chunk = jsonChunks[i];
      const keepWriting = writeChunkAndReturn(destination, chunk);

      if (!keepWriting) {
        request.destination = null;
        i++;
        break;
      }
    }

    jsonChunks.splice(0, i); // Finally, errors are sent. The idea is that it's ok to delay
    // any error messages and prioritize display of other parts of
    // the page.

    const errorChunks = request.completedErrorChunks;
    i = 0;

    for (; i < errorChunks.length; i++) {
      request.pendingChunks--;
      const chunk = errorChunks[i];
      const keepWriting = writeChunkAndReturn(destination, chunk);

      if (!keepWriting) {
        request.destination = null;
        i++;
        break;
      }
    }

    errorChunks.splice(0, i);
  } finally {
  }

  if (request.pendingChunks === 0) {
    // We're done.
    ReactFlightNativeRelayServerIntegration.close(destination);
  }
}

function startWork(request) {
  scheduleWork(() => performWork(request));
}
function startFlowing(request, destination) {
  if (request.status === CLOSING) {
    request.status = CLOSED;
    closeWithError(destination, request.fatalError);
    return;
  }

  if (request.status === CLOSED) {
    return;
  }

  if (request.destination !== null) {
    // We're already flowing.
    return;
  }

  request.destination = destination;

  try {
    flushCompletedChunks(request, destination);
  } catch (error) {
    logRecoverableError(request, error);
    fatalError(request, error);
  }
}

function importServerContexts(contexts) {
  if (contexts) {
    const prevContext = getActiveContext();
    switchContext(rootContextSnapshot);

    for (let i = 0; i < contexts.length; i++) {
      const _contexts$i = contexts[i],
            name = _contexts$i[0],
            value = _contexts$i[1];
      const context = getOrCreateServerContext(name);
      pushProvider(context, value);
    }

    const importedContext = getActiveContext();
    switchContext(prevContext);
    return importedContext;
  }

  return rootContextSnapshot;
}

function render(model, destination, config) {
  const request = createRequest(model, config);
  startWork(request);
  startFlowing(request, destination);
}

exports.render = render;
//# sourceMappingURL=ReactFlightNativeRelayServer-prod.js.map
