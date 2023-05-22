'use strict';

var React = require('react');

// ATTENTION
exports.Fragment = 0xeacb;

if (typeof Symbol === 'function' && Symbol.for) {
  const symbolFor = Symbol.for;
  exports.Fragment = symbolFor('react.fragment');
}

// Re-export dynamic flags from the www version.
const dynamicFeatureFlags = require('ReactFeatureFlags');

const debugRenderPhaseSideEffectsForStrictMode = dynamicFeatureFlags.debugRenderPhaseSideEffectsForStrictMode,
      disableInputAttributeSyncing = dynamicFeatureFlags.disableInputAttributeSyncing,
      enableTrustedTypesIntegration = dynamicFeatureFlags.enableTrustedTypesIntegration,
      disableSchedulerTimeoutBasedOnReactExpirationTime = dynamicFeatureFlags.disableSchedulerTimeoutBasedOnReactExpirationTime,
      warnAboutSpreadingKeyToJSX = dynamicFeatureFlags.warnAboutSpreadingKeyToJSX,
      replayFailedUnitOfWorkWithInvokeGuardedCallback = dynamicFeatureFlags.replayFailedUnitOfWorkWithInvokeGuardedCallback,
      enableFilterEmptyStringAttributesDOM = dynamicFeatureFlags.enableFilterEmptyStringAttributesDOM,
      enableLegacyFBSupport = dynamicFeatureFlags.enableLegacyFBSupport,
      deferRenderPhaseUpdateToNextBatch = dynamicFeatureFlags.deferRenderPhaseUpdateToNextBatch,
      decoupleUpdatePriorityFromScheduler = dynamicFeatureFlags.decoupleUpdatePriorityFromScheduler,
      enableDebugTracing = dynamicFeatureFlags.enableDebugTracing,
      skipUnmountedBoundaries = dynamicFeatureFlags.skipUnmountedBoundaries,
      enableEagerRootListeners = dynamicFeatureFlags.enableEagerRootListeners,
      enableDoubleInvokingEffects = dynamicFeatureFlags.enableDoubleInvokingEffects; // On WWW, true is used for a new modern build.

const ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

const ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;

const ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;

const ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner;

/**
 * ReactElementValidator provides a wrapper around a element factory
 * which validates the props passed to the element. This is intended to be
 * used only in DEV and could be replaced by a static type checker for languages
 * that support it.
 */
const ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner;
const ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;

const jsxDEV =  undefined;

exports.jsxDEV = jsxDEV;
//# sourceMappingURL=JSXDEVRuntime-profiling.js.map
