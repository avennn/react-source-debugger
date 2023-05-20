'use strict';

var React = require('react');

// Re-export dynamic flags from the www version.
const dynamicFeatureFlags = require('ReactFeatureFlags');

const disableInputAttributeSyncing = dynamicFeatureFlags.disableInputAttributeSyncing,
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

// ATTENTION
const usePolyfill =  (typeof Symbol !== 'function' || !Symbol.for); // The Symbol used to tag the ReactElement-like types.
const REACT_FRAGMENT_TYPE = usePolyfill ? 0xeacb : Symbol.for('react.fragment');

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

exports.Fragment = REACT_FRAGMENT_TYPE;
exports.jsxDEV = jsxDEV;
//# sourceMappingURL=JSXDEVRuntime-prod.js.map
