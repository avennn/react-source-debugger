'use strict';

var React = require('react');

// ATTENTION
const REACT_FRAGMENT_TYPE = Symbol.for('react.fragment');

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
//# sourceMappingURL=JSXDEVRuntime-profiling.js.map
