'use strict';

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
var enableTransitionTracing = false;

// ATTENTION
var usePolyfill =  (typeof Symbol !== 'function' || !Symbol.for); // The Symbol used to tag the ReactElement-like types.

var REACT_ELEMENT_TYPE = usePolyfill ? 0xeac7 : Symbol.for('react.element');
var REACT_PORTAL_TYPE = usePolyfill ? 0xeaca : Symbol.for('react.portal');
var REACT_FRAGMENT_TYPE = usePolyfill ? 0xeacb : Symbol.for('react.fragment');
var REACT_STRICT_MODE_TYPE = usePolyfill ? 0xeacc : Symbol.for('react.strict_mode');
var REACT_PROFILER_TYPE = usePolyfill ? 0xead2 : Symbol.for('react.profiler');
var REACT_PROVIDER_TYPE = usePolyfill ? 0xeacd : Symbol.for('react.provider');
var REACT_CONTEXT_TYPE = usePolyfill ? 0xeace : Symbol.for('react.context');
var REACT_SERVER_CONTEXT_TYPE = usePolyfill ? 0xeae6 : Symbol.for('react.server_context');
var REACT_FORWARD_REF_TYPE = usePolyfill ? 0xead0 : Symbol.for('react.forward_ref');
var REACT_SUSPENSE_TYPE = usePolyfill ? 0xead1 : Symbol.for('react.suspense');
var REACT_SUSPENSE_LIST_TYPE = usePolyfill ? 0xead8 : Symbol.for('react.suspense_list');
var REACT_MEMO_TYPE = usePolyfill ? 0xead3 : Symbol.for('react.memo');
var REACT_LAZY_TYPE = usePolyfill ? 0xead4 : Symbol.for('react.lazy');
var REACT_SCOPE_TYPE = usePolyfill ? 0xead7 : Symbol.for('react.scope');
var REACT_DEBUG_TRACING_MODE_TYPE = usePolyfill ? 0xeae1 : Symbol.for('react.debug_trace_mode');
var REACT_OFFSCREEN_TYPE = usePolyfill ? 0xeae2 : Symbol.for('react.offscreen');
var REACT_LEGACY_HIDDEN_TYPE = usePolyfill ? 0xeae3 : Symbol.for('react.legacy_hidden');
var REACT_CACHE_TYPE = usePolyfill ? 0xeae4 : Symbol.for('react.cache');

var REACT_MODULE_REFERENCE;

{
  if (typeof Symbol === 'function') {
    REACT_MODULE_REFERENCE = Symbol.for('react.module.reference');
  } else {
    REACT_MODULE_REFERENCE = 0;
  }
}

function isValidElementType(type) {
  if (typeof type === 'string' || typeof type === 'function') {
    return true;
  } // Note: typeof might be other than 'symbol' or 'number' (e.g. if it's a polyfill).


  if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing && type === REACT_DEBUG_TRACING_MODE_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE ||  type === REACT_LEGACY_HIDDEN_TYPE || type === REACT_OFFSCREEN_TYPE ||  type === REACT_SCOPE_TYPE ||  type === REACT_CACHE_TYPE || enableTransitionTracing ) {
    return true;
  }

  if (typeof type === 'object' && type !== null) {
    if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object
    // types supported by any Flight configuration anywhere since
    // we don't know which Flight build this will end up being used
    // with.
    type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== undefined) {
      return true;
    }
  }

  return false;
}

function typeOf(object) {
  if (typeof object === 'object' && object !== null) {
    var $$typeof = object.$$typeof;

    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
        var type = object.type;

        switch (type) {
          case REACT_FRAGMENT_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_SUSPENSE_TYPE:
          case REACT_SUSPENSE_LIST_TYPE:
            return type;

          default:
            var $$typeofType = type && type.$$typeof;

            switch ($$typeofType) {
              case REACT_SERVER_CONTEXT_TYPE:
              case REACT_CONTEXT_TYPE:
              case REACT_FORWARD_REF_TYPE:
              case REACT_LAZY_TYPE:
              case REACT_MEMO_TYPE:
              case REACT_PROVIDER_TYPE:
                return $$typeofType;

              default:
                return $$typeof;
            }

        }

      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }

  return undefined;
}
var ContextConsumer = REACT_CONTEXT_TYPE;
var ContextProvider = REACT_PROVIDER_TYPE;
var Element = REACT_ELEMENT_TYPE;
var ForwardRef = REACT_FORWARD_REF_TYPE;
var Fragment = REACT_FRAGMENT_TYPE;
var Lazy = REACT_LAZY_TYPE;
var Memo = REACT_MEMO_TYPE;
var Portal = REACT_PORTAL_TYPE;
var Profiler = REACT_PROFILER_TYPE;
var StrictMode = REACT_STRICT_MODE_TYPE;
var Suspense = REACT_SUSPENSE_TYPE;
var SuspenseList = REACT_SUSPENSE_LIST_TYPE;
var hasWarnedAboutDeprecatedIsAsyncMode = false;
var hasWarnedAboutDeprecatedIsConcurrentMode = false; // AsyncMode should be deprecated

function isAsyncMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
      hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

      console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 18+.');
    }
  }

  return false;
}
function isConcurrentMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsConcurrentMode) {
      hasWarnedAboutDeprecatedIsConcurrentMode = true; // Using console['warn'] to evade Babel and ESLint

      console['warn']('The ReactIs.isConcurrentMode() alias has been deprecated, ' + 'and will be removed in React 18+.');
    }
  }

  return false;
}
function isContextConsumer(object) {
  return typeOf(object) === REACT_CONTEXT_TYPE;
}
function isContextProvider(object) {
  return typeOf(object) === REACT_PROVIDER_TYPE;
}
function isElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}
function isForwardRef(object) {
  return typeOf(object) === REACT_FORWARD_REF_TYPE;
}
function isFragment(object) {
  return typeOf(object) === REACT_FRAGMENT_TYPE;
}
function isLazy(object) {
  return typeOf(object) === REACT_LAZY_TYPE;
}
function isMemo(object) {
  return typeOf(object) === REACT_MEMO_TYPE;
}
function isPortal(object) {
  return typeOf(object) === REACT_PORTAL_TYPE;
}
function isProfiler(object) {
  return typeOf(object) === REACT_PROFILER_TYPE;
}
function isStrictMode(object) {
  return typeOf(object) === REACT_STRICT_MODE_TYPE;
}
function isSuspense(object) {
  return typeOf(object) === REACT_SUSPENSE_TYPE;
}
function isSuspenseList(object) {
  return typeOf(object) === REACT_SUSPENSE_LIST_TYPE;
}

exports.ContextConsumer = ContextConsumer;
exports.ContextProvider = ContextProvider;
exports.Element = Element;
exports.ForwardRef = ForwardRef;
exports.Fragment = Fragment;
exports.Lazy = Lazy;
exports.Memo = Memo;
exports.Portal = Portal;
exports.Profiler = Profiler;
exports.StrictMode = StrictMode;
exports.Suspense = Suspense;
exports.SuspenseList = SuspenseList;
exports.isAsyncMode = isAsyncMode;
exports.isConcurrentMode = isConcurrentMode;
exports.isContextConsumer = isContextConsumer;
exports.isContextProvider = isContextProvider;
exports.isElement = isElement;
exports.isForwardRef = isForwardRef;
exports.isFragment = isFragment;
exports.isLazy = isLazy;
exports.isMemo = isMemo;
exports.isPortal = isPortal;
exports.isProfiler = isProfiler;
exports.isStrictMode = isStrictMode;
exports.isSuspense = isSuspense;
exports.isSuspenseList = isSuspenseList;
exports.isValidElementType = isValidElementType;
exports.typeOf = typeOf;
//# sourceMappingURL=ReactIs-dev.js.map
