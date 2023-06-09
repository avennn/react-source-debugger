'use strict';

var React = require('react');
var Transform = require('art/core/transform');
var Mode$1 = require('art/modes/current');
var Scheduler = require('scheduler');
var tracing = require('scheduler/tracing');
var FastNoSideEffects = require('art/modes/fast-noSideEffects');

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

// TODO: this is special because it gets imported during build.
var ReactVersion = '17.0.0-alpha.0';

const LegacyRoot = 0;
const BlockingRoot = 1;
const ConcurrentRoot = 2;

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

const FunctionComponent = 0;
const ClassComponent = 1;
const IndeterminateComponent = 2; // Before we know whether it is function or class

const HostRoot = 3; // Root of a host tree. Could be nested inside another node.

const HostPortal = 4; // A subtree. Could be an entry point to a different renderer.

const HostComponent = 5;
const HostText = 6;
const Fragment = 7;
const Mode = 8;
const ContextConsumer = 9;
const ContextProvider = 10;
const ForwardRef = 11;
const Profiler = 12;
const SuspenseComponent = 13;
const MemoComponent = 14;
const SimpleMemoComponent = 15;
const LazyComponent = 16;
const IncompleteClassComponent = 17;
const DehydratedFragment = 18;
const SuspenseListComponent = 19;
const FundamentalComponent = 20;
const ScopeComponent = 21;
const Block = 22;
const OffscreenComponent = 23;
const LegacyHiddenComponent = 24;

/**
 * `ReactInstanceMap` maintains a mapping from a public facing stateful
 * instance (key) and the internal representation (value). This allows public
 * methods to accept the user facing instance as an argument and map them back
 * to internal methods.
 *
 * Note that this module is currently shared and assumed to be stateless.
 * If this becomes an actual Map, that will break.
 */
function get(key) {
  return key._reactInternals;
}
function set(key, value) {
  key._reactInternals = value;
}

const ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

// ATTENTION
// When adding new symbols to this file,
// Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
let REACT_ELEMENT_TYPE = 0xeac7;
let REACT_PORTAL_TYPE = 0xeaca;
let REACT_FRAGMENT_TYPE = 0xeacb;
let REACT_STRICT_MODE_TYPE = 0xeacc;
let REACT_PROFILER_TYPE = 0xead2;
let REACT_PROVIDER_TYPE = 0xeacd;
let REACT_CONTEXT_TYPE = 0xeace;
let REACT_FORWARD_REF_TYPE = 0xead0;
let REACT_SUSPENSE_TYPE = 0xead1;
let REACT_SUSPENSE_LIST_TYPE = 0xead8;
let REACT_MEMO_TYPE = 0xead3;
let REACT_LAZY_TYPE = 0xead4;
let REACT_BLOCK_TYPE = 0xead9;
let REACT_SCOPE_TYPE = 0xead7;
let REACT_DEBUG_TRACING_MODE_TYPE = 0xeae1;
let REACT_OFFSCREEN_TYPE = 0xeae2;
let REACT_LEGACY_HIDDEN_TYPE = 0xeae3;

if (typeof Symbol === 'function' && Symbol.for) {
  const symbolFor = Symbol.for;
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
  REACT_SCOPE_TYPE = symbolFor('react.scope');
  REACT_DEBUG_TRACING_MODE_TYPE = symbolFor('react.debug_trace_mode');
  REACT_OFFSCREEN_TYPE = symbolFor('react.offscreen');
  REACT_LEGACY_HIDDEN_TYPE = symbolFor('react.legacy_hidden');
}

const MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
const FAUX_ITERATOR_SYMBOL = '@@iterator';
function getIteratorFn(maybeIterable) {
  if (maybeIterable === null || typeof maybeIterable !== 'object') {
    return null;
  }

  const maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];

  if (typeof maybeIterator === 'function') {
    return maybeIterator;
  }

  return null;
}

function getWrappedName(outerType, innerType, wrapperName) {
  const functionName = innerType.displayName || innerType.name || '';
  return outerType.displayName || (functionName !== '' ? wrapperName + "(" + functionName + ")" : wrapperName);
}

function getContextName(type) {
  return type.displayName || 'Context';
}

function getComponentName(type) {
  if (type == null) {
    // Host root, text node or just invalid type.
    return null;
  }

  if (typeof type === 'function') {
    return type.displayName || type.name || null;
  }

  if (typeof type === 'string') {
    return type;
  }

  switch (type) {
    case REACT_FRAGMENT_TYPE:
      return 'Fragment';

    case REACT_PORTAL_TYPE:
      return 'Portal';

    case REACT_PROFILER_TYPE:
      return 'Profiler';

    case REACT_STRICT_MODE_TYPE:
      return 'StrictMode';

    case REACT_SUSPENSE_TYPE:
      return 'Suspense';

    case REACT_SUSPENSE_LIST_TYPE:
      return 'SuspenseList';
  }

  if (typeof type === 'object') {
    switch (type.$$typeof) {
      case REACT_CONTEXT_TYPE:
        const context = type;
        return getContextName(context) + '.Consumer';

      case REACT_PROVIDER_TYPE:
        const provider = type;
        return getContextName(provider._context) + '.Provider';

      case REACT_FORWARD_REF_TYPE:
        return getWrappedName(type, type.render, 'ForwardRef');

      case REACT_MEMO_TYPE:
        return getComponentName(type.type);

      case REACT_BLOCK_TYPE:
        return getComponentName(type._render);

      case REACT_LAZY_TYPE:
        {
          const lazyComponent = type;
          const payload = lazyComponent._payload;
          const init = lazyComponent._init;

          try {
            return getComponentName(init(payload));
          } catch (x) {
            return null;
          }
        }
    }
  }

  return null;
}

// Don't change these two values. They're used by React Dev Tools.
const NoFlags =
/*                      */
0b000000000000000000;
const PerformedWork =
/*                */
0b000000000000000001; // You can change the rest (and add more).

const Placement =
/*                    */
0b000000000000000010;
const Update =
/*                       */
0b000000000000000100;
const PlacementAndUpdate =
/*           */
0b000000000000000110;
const Deletion =
/*                     */
0b000000000000001000;
const ContentReset =
/*                 */
0b000000000000010000;
const Callback =
/*                     */
0b000000000000100000;
const DidCapture =
/*                   */
0b000000000001000000;
const Ref =
/*                          */
0b000000000010000000;
const Snapshot =
/*                     */
0b000000000100000000;
const Passive =
/*                      */
0b000000001000000000; // TODO (effects) Remove this bit once the new reconciler is synced to the old.
const Hydrating =
/*                    */
0b000000010000000000;
const HydratingAndUpdate =
/*           */
0b000000010000000100; // Passive & Update & Callback & Ref & Snapshot

const LifecycleEffectMask =
/*          */
0b000000001110100100; // Union of all host effects

const HostEffectMask =
/*               */
0b000000011111111111; // These are not really side effects, but we still reuse this field.

const Incomplete =
/*                   */
0b000000100000000000;
const ShouldCapture =
/*                */
0b000001000000000000;
const ForceUpdateForLegacySuspense =
/* */
0b000100000000000000; // Static tags describe aspects of a fiber that are not specific to a render,

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
      enableDoubleInvokingEffects = dynamicFeatureFlags.enableDoubleInvokingEffects; // On WWW, true is used for a new modern build.
const enableProfilerTimer = false;
const enableProfilerCommitHooks = false; // Logs additional User Timing API marks for use with an experimental profiling tool.
const enableFundamentalAPI = false;
// don't have to add another test dimension. The build system will compile this
// to the correct value.

const enableNewReconciler = false; // Flow magic to verify the exports of this file match the original version.

const ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner;
function getNearestMountedFiber(fiber) {
  let node = fiber;
  let nearestMounted = fiber;

  if (!fiber.alternate) {
    // If there is no alternate, this might be a new tree that isn't inserted
    // yet. If it is, then it will have a pending insertion effect on it.
    let nextNode = node;

    do {
      node = nextNode;

      if ((node.flags & (Placement | Hydrating)) !== NoFlags) {
        // This is an insertion or in-progress hydration. The nearest possible
        // mounted fiber is the parent but we need to continue to figure out
        // if that one is still mounted.
        nearestMounted = node.return;
      }

      nextNode = node.return;
    } while (nextNode);
  } else {
    while (node.return) {
      node = node.return;
    }
  }

  if (node.tag === HostRoot) {
    // TODO: Check if this was a nested HostRoot when used with
    // renderContainerIntoSubtree.
    return nearestMounted;
  } // If we didn't hit the root, that means that we're in an disconnected tree
  // that has been unmounted.


  return null;
}
function isMounted(component) {

  const fiber = get(component);

  if (!fiber) {
    return false;
  }

  return getNearestMountedFiber(fiber) === fiber;
}

function assertIsMounted(fiber) {
  if (!(getNearestMountedFiber(fiber) === fiber)) {
    {
      throw Error( formatProdErrorMessage(188));
    }
  }
}

function findCurrentFiberUsingSlowPath(fiber) {
  const alternate = fiber.alternate;

  if (!alternate) {
    // If there is no alternate, then we only need to check if it is mounted.
    const nearestMounted = getNearestMountedFiber(fiber);

    if (!(nearestMounted !== null)) {
      {
        throw Error( formatProdErrorMessage(188));
      }
    }

    if (nearestMounted !== fiber) {
      return null;
    }

    return fiber;
  } // If we have two possible branches, we'll walk backwards up to the root
  // to see what path the root points to. On the way we may hit one of the
  // special cases and we'll deal with them.


  let a = fiber;
  let b = alternate;

  while (true) {
    const parentA = a.return;

    if (parentA === null) {
      // We're at the root.
      break;
    }

    const parentB = parentA.alternate;

    if (parentB === null) {
      // There is no alternate. This is an unusual case. Currently, it only
      // happens when a Suspense component is hidden. An extra fragment fiber
      // is inserted in between the Suspense fiber and its children. Skip
      // over this extra fragment fiber and proceed to the next parent.
      const nextParent = parentA.return;

      if (nextParent !== null) {
        a = b = nextParent;
        continue;
      } // If there's no parent, we're at the root.


      break;
    } // If both copies of the parent fiber point to the same child, we can
    // assume that the child is current. This happens when we bailout on low
    // priority: the bailed out fiber's child reuses the current child.


    if (parentA.child === parentB.child) {
      let child = parentA.child;

      while (child) {
        if (child === a) {
          // We've determined that A is the current branch.
          assertIsMounted(parentA);
          return fiber;
        }

        if (child === b) {
          // We've determined that B is the current branch.
          assertIsMounted(parentA);
          return alternate;
        }

        child = child.sibling;
      } // We should never have an alternate for any mounting node. So the only
      // way this could possibly happen is if this was unmounted, if at all.


      {
        {
          throw Error( formatProdErrorMessage(188));
        }
      }
    }

    if (a.return !== b.return) {
      // The return pointer of A and the return pointer of B point to different
      // fibers. We assume that return pointers never criss-cross, so A must
      // belong to the child set of A.return, and B must belong to the child
      // set of B.return.
      a = parentA;
      b = parentB;
    } else {
      // The return pointers point to the same fiber. We'll have to use the
      // default, slow path: scan the child sets of each parent alternate to see
      // which child belongs to which set.
      //
      // Search parent A's child set
      let didFindChild = false;
      let child = parentA.child;

      while (child) {
        if (child === a) {
          didFindChild = true;
          a = parentA;
          b = parentB;
          break;
        }

        if (child === b) {
          didFindChild = true;
          b = parentA;
          a = parentB;
          break;
        }

        child = child.sibling;
      }

      if (!didFindChild) {
        // Search parent B's child set
        child = parentB.child;

        while (child) {
          if (child === a) {
            didFindChild = true;
            a = parentB;
            b = parentA;
            break;
          }

          if (child === b) {
            didFindChild = true;
            b = parentB;
            a = parentA;
            break;
          }

          child = child.sibling;
        }

        if (!didFindChild) {
          {
            throw Error( formatProdErrorMessage(189));
          }
        }
      }
    }

    if (!(a.alternate === b)) {
      {
        throw Error( formatProdErrorMessage(190));
      }
    }
  } // If the root is not a host container, we're in a disconnected tree. I.e.
  // unmounted.


  if (!(a.tag === HostRoot)) {
    {
      throw Error( formatProdErrorMessage(188));
    }
  }

  if (a.stateNode.current === a) {
    // We've determined that A is the current branch.
    return fiber;
  } // Otherwise B has to be current branch.


  return alternate;
}
function findCurrentHostFiber(parent) {
  const currentParent = findCurrentFiberUsingSlowPath(parent);

  if (!currentParent) {
    return null;
  } // Next we'll drill down this component to find the first HostComponent/Text.


  let node = currentParent;

  while (true) {
    if (node.tag === HostComponent || node.tag === HostText) {
      return node;
    } else if (node.child) {
      node.child.return = node;
      node = node.child;
      continue;
    }

    if (node === currentParent) {
      return null;
    }

    while (!node.sibling) {
      if (!node.return || node.return === currentParent) {
        return null;
      }

      node = node.return;
    }

    node.sibling.return = node.return;
    node = node.sibling;
  } // Flow needs the return null here, but ESLint complains about it.
  // eslint-disable-next-line no-unreachable


  return null;
}
function isFiberSuspenseAndTimedOut(fiber) {
  const memoizedState = fiber.memoizedState;
  return fiber.tag === SuspenseComponent && memoizedState !== null && memoizedState.dehydrated === null;
}
function doesFiberContain(parentFiber, childFiber) {
  let node = childFiber;
  const parentFiberAlternate = parentFiber.alternate;

  while (node !== null) {
    if (node === parentFiber || node === parentFiberAlternate) {
      return true;
    }

    node = node.return;
  }

  return false;
}

const TYPES = {
  CLIPPING_RECTANGLE: 'ClippingRectangle',
  GROUP: 'Group',
  SHAPE: 'Shape',
  TEXT: 'Text'
};
const EVENT_TYPES = {
  onClick: 'click',
  onMouseMove: 'mousemove',
  onMouseOver: 'mouseover',
  onMouseOut: 'mouseout',
  onMouseUp: 'mouseup',
  onMouseDown: 'mousedown'
};
function childrenAsString(children) {
  if (!children) {
    return '';
  } else if (typeof children === 'string') {
    return children;
  } else if (children.length) {
    return children.join('');
  } else {
    return '';
  }
}

// can re-export everything from this module.

function shim() {
  {
    {
      throw Error( formatProdErrorMessage(305));
    }
  }
} // Hydration (when unsupported)
const isSuspenseInstancePending = shim;
const isSuspenseInstanceFallback = shim;
const registerSuspenseInstanceRetry = shim;
const hydrateTextInstance = shim;
const clearSuspenseBoundary = shim;
const clearSuspenseBoundaryFromContainer = shim;

// can re-export everything from this module.

function shim$1() {
  {
    {
      throw Error( formatProdErrorMessage(357));
    }
  }
} // React Scopes (when unsupported)


const prepareScopeUpdate = shim$1;
const getInstanceFromScope = shim$1;

const pooledTransform = new Transform();
const NO_CONTEXT = {};
const UPDATE_SIGNAL = {};
/** Helper Methods */


function addEventListeners(instance, type, listener) {
  // We need to explicitly unregister before unmount.
  // For this reason we need to track subscriptions.
  if (!instance._listeners) {
    instance._listeners = {};
    instance._subscriptions = {};
  }

  instance._listeners[type] = listener;

  if (listener) {
    if (!instance._subscriptions[type]) {
      instance._subscriptions[type] = instance.subscribe(type, createEventHandler(instance), instance);
    }
  } else {
    if (instance._subscriptions[type]) {
      instance._subscriptions[type]();

      delete instance._subscriptions[type];
    }
  }
}

function createEventHandler(instance) {
  return function handleEvent(event) {
    const listener = instance._listeners[event.type];

    if (!listener) ; else if (typeof listener === 'function') {
      listener.call(instance, event);
    } else if (listener.handleEvent) {
      listener.handleEvent(event);
    }
  };
}

function destroyEventListeners(instance) {
  if (instance._subscriptions) {
    for (const type in instance._subscriptions) {
      instance._subscriptions[type]();
    }
  }

  instance._subscriptions = null;
  instance._listeners = null;
}

function getScaleX(props) {
  if (props.scaleX != null) {
    return props.scaleX;
  } else if (props.scale != null) {
    return props.scale;
  } else {
    return 1;
  }
}

function getScaleY(props) {
  if (props.scaleY != null) {
    return props.scaleY;
  } else if (props.scale != null) {
    return props.scale;
  } else {
    return 1;
  }
}

function isSameFont(oldFont, newFont) {
  if (oldFont === newFont) {
    return true;
  } else if (typeof newFont === 'string' || typeof oldFont === 'string') {
    return false;
  } else {
    return newFont.fontSize === oldFont.fontSize && newFont.fontStyle === oldFont.fontStyle && newFont.fontVariant === oldFont.fontVariant && newFont.fontWeight === oldFont.fontWeight && newFont.fontFamily === oldFont.fontFamily;
  }
}
/** Render Methods */


function applyClippingRectangleProps(instance, props) {
  let prevProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  applyNodeProps(instance, props, prevProps);
  instance.width = props.width;
  instance.height = props.height;
}

function applyGroupProps(instance, props) {
  let prevProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  applyNodeProps(instance, props, prevProps);
  instance.width = props.width;
  instance.height = props.height;
}

function applyNodeProps(instance, props) {
  let prevProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const scaleX = getScaleX(props);
  const scaleY = getScaleY(props);
  pooledTransform.transformTo(1, 0, 0, 1, 0, 0).move(props.x || 0, props.y || 0).rotate(props.rotation || 0, props.originX, props.originY).scale(scaleX, scaleY, props.originX, props.originY);

  if (props.transform != null) {
    pooledTransform.transform(props.transform);
  }

  if (instance.xx !== pooledTransform.xx || instance.yx !== pooledTransform.yx || instance.xy !== pooledTransform.xy || instance.yy !== pooledTransform.yy || instance.x !== pooledTransform.x || instance.y !== pooledTransform.y) {
    instance.transformTo(pooledTransform);
  }

  if (props.cursor !== prevProps.cursor || props.title !== prevProps.title) {
    instance.indicate(props.cursor, props.title);
  }

  if (instance.blend && props.opacity !== prevProps.opacity) {
    instance.blend(props.opacity == null ? 1 : props.opacity);
  }

  if (props.visible !== prevProps.visible) {
    if (props.visible == null || props.visible) {
      instance.show();
    } else {
      instance.hide();
    }
  }

  for (const type in EVENT_TYPES) {
    addEventListeners(instance, EVENT_TYPES[type], props[type]);
  }
}

function applyRenderableNodeProps(instance, props) {
  let prevProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  applyNodeProps(instance, props, prevProps);

  if (prevProps.fill !== props.fill) {
    if (props.fill && props.fill.applyFill) {
      props.fill.applyFill(instance);
    } else {
      instance.fill(props.fill);
    }
  }

  if (prevProps.stroke !== props.stroke || prevProps.strokeWidth !== props.strokeWidth || prevProps.strokeCap !== props.strokeCap || prevProps.strokeJoin !== props.strokeJoin || // TODO: Consider deep check of stokeDash; may benefit VML in IE.
  prevProps.strokeDash !== props.strokeDash) {
    instance.stroke(props.stroke, props.strokeWidth, props.strokeCap, props.strokeJoin, props.strokeDash);
  }
}

function applyShapeProps(instance, props) {
  let prevProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  applyRenderableNodeProps(instance, props, prevProps);
  const path = props.d || childrenAsString(props.children);
  const prevDelta = instance._prevDelta;
  const prevPath = instance._prevPath;

  if (path !== prevPath || path.delta !== prevDelta || prevProps.height !== props.height || prevProps.width !== props.width) {
    instance.draw(path, props.width, props.height);
    instance._prevDelta = path.delta;
    instance._prevPath = path;
  }
}

function applyTextProps(instance, props) {
  let prevProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  applyRenderableNodeProps(instance, props, prevProps);
  const string = props.children;

  if (instance._currentString !== string || !isSameFont(props.font, prevProps.font) || props.alignment !== prevProps.alignment || props.path !== prevProps.path) {
    instance.draw(string, props.font, props.alignment, props.path);
    instance._currentString = string;
  }
}
function appendInitialChild(parentInstance, child) {
  if (typeof child === 'string') {
    // Noop for string children of Text (eg <Text>{'foo'}{'bar'}</Text>)
    {
      {
        throw Error( formatProdErrorMessage(216));
      }
    }
  }

  child.inject(parentInstance);
}
function createInstance(type, props, internalInstanceHandle) {
  let instance;

  switch (type) {
    case TYPES.CLIPPING_RECTANGLE:
      instance = Mode$1.ClippingRectangle();
      instance._applyProps = applyClippingRectangleProps;
      break;

    case TYPES.GROUP:
      instance = Mode$1.Group();
      instance._applyProps = applyGroupProps;
      break;

    case TYPES.SHAPE:
      instance = Mode$1.Shape();
      instance._applyProps = applyShapeProps;
      break;

    case TYPES.TEXT:
      instance = Mode$1.Text(props.children, props.font, props.alignment, props.path);
      instance._applyProps = applyTextProps;
      break;
  }

  if (!instance) {
    {
      throw Error( formatProdErrorMessage(217, type));
    }
  }

  instance._applyProps(instance, props);

  return instance;
}
function createTextInstance(text, rootContainerInstance, internalInstanceHandle) {
  return text;
}
function getPublicInstance(instance) {
  return instance;
}
function prepareForCommit() {
  // Noop
  return null;
}
function prepareUpdate(domElement, type, oldProps, newProps) {
  return UPDATE_SIGNAL;
}
function resetAfterCommit() {// Noop
}
function resetTextContent(domElement) {// Noop
}
function getRootHostContext() {
  return NO_CONTEXT;
}
function getChildHostContext() {
  return NO_CONTEXT;
}
const scheduleTimeout = setTimeout;
const cancelTimeout = clearTimeout;
const noTimeout = -1;
function shouldSetTextContent(type, props) {
  return typeof props.children === 'string' || typeof props.children === 'number';
} // The ART renderer is secondary to the React DOM renderer.
function appendChild(parentInstance, child) {
  if (child.parentNode === parentInstance) {
    child.eject();
  }

  child.inject(parentInstance);
}
function appendChildToContainer(parentInstance, child) {
  if (child.parentNode === parentInstance) {
    child.eject();
  }

  child.inject(parentInstance);
}
function insertBefore(parentInstance, child, beforeChild) {
  if (!(child !== beforeChild)) {
    {
      throw Error( formatProdErrorMessage(218));
    }
  }

  child.injectBefore(beforeChild);
}
function insertInContainerBefore(parentInstance, child, beforeChild) {
  if (!(child !== beforeChild)) {
    {
      throw Error( formatProdErrorMessage(218));
    }
  }

  child.injectBefore(beforeChild);
}
function removeChild(parentInstance, child) {
  destroyEventListeners(child);
  child.eject();
}
function removeChildFromContainer(parentInstance, child) {
  destroyEventListeners(child);
  child.eject();
}
function commitUpdate(instance, updatePayload, type, oldProps, newProps) {
  instance._applyProps(instance, newProps, oldProps);
}
function hideInstance(instance) {
  instance.hide();
}
function unhideInstance(instance, props) {
  if (props.visible == null || props.visible) {
    instance.show();
  }
}
function unhideTextInstance(textInstance, text) {// Noop
}
function clearContainer(container) {// TODO Implement this
}
function getInstanceFromNode(node) {
  throw new Error('Not yet implemented.');
}
function makeClientId() {
  throw new Error('Not yet implemented');
}
function preparePortalMount(portalInstance) {// noop
}

const ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
let prefix;
function describeBuiltInComponentFrame(name, source, ownerFn) {
  {
    if (prefix === undefined) {
      // Extract the VM specific prefix used by each line.
      try {
        throw Error();
      } catch (x) {
        const match = x.stack.trim().match(/\n( *(at )?)/);
        prefix = match && match[1] || '';
      }
    } // We use the prefix to ensure our stacks line up with native stack frames.


    return '\n' + prefix + name;
  }
}
let reentry = false;

function describeNativeComponentFrame(fn, construct) {
  // If something asked for a stack inside a fake render, it should get ignored.
  if (!fn || reentry) {
    return '';
  }

  let control;
  reentry = true;
  const previousPrepareStackTrace = Error.prepareStackTrace; // $FlowFixMe It does accept undefined.

  Error.prepareStackTrace = undefined;

  try {
    // This should throw.
    if (construct) {
      // Something should be setting the props in the constructor.
      const Fake = function () {
        throw Error();
      }; // $FlowFixMe


      Object.defineProperty(Fake.prototype, 'props', {
        set: function () {
          // We use a throwing setter instead of frozen or non-writable props
          // because that won't throw in a non-strict mode function.
          throw Error();
        }
      });

      if (typeof Reflect === 'object' && Reflect.construct) {
        // We construct a different control for this case to include any extra
        // frames added by the construct call.
        try {
          Reflect.construct(Fake, []);
        } catch (x) {
          control = x;
        }

        Reflect.construct(fn, [], Fake);
      } else {
        try {
          Fake.call();
        } catch (x) {
          control = x;
        }

        fn.call(Fake.prototype);
      }
    } else {
      try {
        throw Error();
      } catch (x) {
        control = x;
      }

      fn();
    }
  } catch (sample) {
    // This is inlined manually because closure doesn't do it for us.
    if (sample && control && typeof sample.stack === 'string') {
      // This extracts the first frame from the sample that isn't also in the control.
      // Skipping one frame that we assume is the frame that calls the two.
      const sampleLines = sample.stack.split('\n');
      const controlLines = control.stack.split('\n');
      let s = sampleLines.length - 1;
      let c = controlLines.length - 1;

      while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
        // We expect at least one stack frame to be shared.
        // Typically this will be the root most one. However, stack frames may be
        // cut off due to maximum stack limits. In this case, one maybe cut off
        // earlier than the other. We assume that the sample is longer or the same
        // and there for cut off earlier. So we should find the root most frame in
        // the sample somewhere in the control.
        c--;
      }

      for (; s >= 1 && c >= 0; s--, c--) {
        // Next we find the first one that isn't the same which should be the
        // frame that called our sample function and the control.
        if (sampleLines[s] !== controlLines[c]) {
          // In V8, the first line is describing the message but other VMs don't.
          // If we're about to return the first line, and the control is also on the same
          // line, that's a pretty good indicator that our sample threw at same line as
          // the control. I.e. before we entered the sample frame. So we ignore this result.
          // This can happen if you passed a class to function component, or non-function.
          if (s !== 1 || c !== 1) {
            do {
              s--;
              c--; // We may still have similar intermediate frames from the construct call.
              // The next one that isn't the same should be our match though.

              if (c < 0 || sampleLines[s] !== controlLines[c]) {
                // V8 adds a "new" prefix for native classes. Let's remove it to make it prettier.
                const frame = '\n' + sampleLines[s].replace(' at new ', ' at ');


                return frame;
              }
            } while (s >= 1 && c >= 0);
          }

          break;
        }
      }
    }
  } finally {
    reentry = false;

    Error.prepareStackTrace = previousPrepareStackTrace;
  } // Fallback to just using the name if we couldn't make it throw.


  const name = fn ? fn.displayName || fn.name : '';
  const syntheticFrame = name ? describeBuiltInComponentFrame(name) : '';

  return syntheticFrame;
}

function describeClassComponentFrame(ctor, source, ownerFn) {
  {
    return describeNativeComponentFrame(ctor, true);
  }
}
function describeFunctionComponentFrame(fn, source, ownerFn) {
  {
    return describeNativeComponentFrame(fn, false);
  }
}

const ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;

const valueStack = [];

let index = -1;

function createCursor(defaultValue) {
  return {
    current: defaultValue
  };
}

function pop(cursor, fiber) {
  if (index < 0) {

    return;
  }

  cursor.current = valueStack[index];
  valueStack[index] = null;

  index--;
}

function push(cursor, value, fiber) {
  index++;
  valueStack[index] = cursor.current;

  cursor.current = value;
}

const emptyContextObject = {};

function hasContextChanged() {
  {
    return false;
  }
}

function isContextProvider(type) {
  {
    return false;
  }
}

function pushTopLevelContextObject(fiber, context, didChange) {
  {
    return;
  }
}

function processChildContext(fiber, type, parentContext) {
  {
    return parentContext;
  }
}

function findCurrentUnmaskedContext(fiber) {
  {
    return emptyContextObject;
  }
}

let rendererID = null;
let injectedHook = null;
function injectInternals(internals) {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined') {
    // No DevTools
    return false;
  }

  const hook = __REACT_DEVTOOLS_GLOBAL_HOOK__;

  if (hook.isDisabled) {
    // This isn't a real property on the hook, but it can be set to opt out
    // of DevTools integration and associated warnings and logs.
    // https://github.com/facebook/react/issues/3877
    return true;
  }

  if (!hook.supportsFiber) {


    return true;
  }

  try {
    rendererID = hook.inject(internals); // We have successfully injected, so now it is safe to set up hooks.

    injectedHook = hook;
  } catch (err) {
  } // DevTools exists


  return true;
}
function onCommitRoot(root, priorityLevel) {
  if (injectedHook && typeof injectedHook.onCommitFiberRoot === 'function') {
    try {
      const didError = (root.current.flags & DidCapture) === DidCapture;

      if (enableProfilerTimer) {
        injectedHook.onCommitFiberRoot(rendererID, root, priorityLevel, didError);
      } else {
        injectedHook.onCommitFiberRoot(rendererID, root, undefined, didError);
      }
    } catch (err) {
    }
  }
}
function onCommitUnmount(fiber) {
  if (injectedHook && typeof injectedHook.onCommitFiberUnmount === 'function') {
    try {
      injectedHook.onCommitFiberUnmount(rendererID, fiber);
    } catch (err) {
    }
  }
}

const Scheduler_now = Scheduler.unstable_now;

{
  // Provide explicit error message when production+profiling bundle of e.g.
  // react-dom is used with production (non-profiling) bundle of
  // scheduler/tracing
  if (!(tracing.__interactionsRef != null && tracing.__interactionsRef.current != null)) {
    {
      throw Error( formatProdErrorMessage(302));
    }
  }
}
// ascending numbers so we can compare them like numbers. They start at 90 to
// avoid clashing with Scheduler's priorities.

const ImmediatePriority = 99;
const UserBlockingPriority = 98;
const NormalPriority = 97;
const LowPriority = 96;
const IdlePriority = 95; // NoPriority is the absence of priority. Also React-only.

const NoPriority = 90;
const initialTimeMs = Scheduler_now(); // If the initial timestamp is reasonably small, use Scheduler's `now` directly.

const SyncLanePriority = 15;
const SyncBatchedLanePriority = 14;
const InputDiscreteHydrationLanePriority = 13;
const InputDiscreteLanePriority = 12;
const InputContinuousHydrationLanePriority = 11;
const InputContinuousLanePriority = 10;
const DefaultHydrationLanePriority = 9;
const DefaultLanePriority = 8;
const TransitionHydrationPriority = 7;
const TransitionPriority = 6;
const RetryLanePriority = 5;
const SelectiveHydrationLanePriority = 4;
const IdleHydrationLanePriority = 3;
const IdleLanePriority = 2;
const OffscreenLanePriority = 1;
const NoLanePriority = 0;
const TotalLanes = 31;
const NoLanes =
/*                        */
0b0000000000000000000000000000000;
const NoLane =
/*                          */
0b0000000000000000000000000000000;
const SyncLane =
/*                        */
0b0000000000000000000000000000001;
const SyncBatchedLane =
/*                 */
0b0000000000000000000000000000010;
const InputDiscreteHydrationLane =
/*      */
0b0000000000000000000000000000100;
const InputDiscreteLanes =
/*                    */
0b0000000000000000000000000011000;
const InputContinuousHydrationLane =
/*           */
0b0000000000000000000000000100000;
const InputContinuousLanes =
/*                  */
0b0000000000000000000000011000000;
const DefaultHydrationLane =
/*            */
0b0000000000000000000000100000000;
const DefaultLanes =
/*                   */
0b0000000000000000000111000000000;
const TransitionHydrationLane =
/*                */
0b0000000000000000001000000000000;
const TransitionLanes =
/*                       */
0b0000000001111111110000000000000;
const RetryLanes =
/*                            */
0b0000011110000000000000000000000;
const SomeRetryLane =
/*                  */
0b0000010000000000000000000000000;
const SelectiveHydrationLane =
/*          */
0b0000100000000000000000000000000;
const NonIdleLanes =
/*                                 */
0b0000111111111111111111111111111;
const IdleHydrationLane =
/*               */
0b0001000000000000000000000000000;
const IdleLanes =
/*                             */
0b0110000000000000000000000000000;
const OffscreenLane =
/*                   */
0b1000000000000000000000000000000;
const NoTimestamp = -1;
function setCurrentUpdateLanePriority(newLanePriority) {
} // "Registers" used to "return" multiple values
// Used by getHighestPriorityLanes and getNextLanes:

let return_highestLanePriority = DefaultLanePriority;

function getHighestPriorityLanes(lanes) {
  if ((SyncLane & lanes) !== NoLanes) {
    return_highestLanePriority = SyncLanePriority;
    return SyncLane;
  }

  if ((SyncBatchedLane & lanes) !== NoLanes) {
    return_highestLanePriority = SyncBatchedLanePriority;
    return SyncBatchedLane;
  }

  if ((InputDiscreteHydrationLane & lanes) !== NoLanes) {
    return_highestLanePriority = InputDiscreteHydrationLanePriority;
    return InputDiscreteHydrationLane;
  }

  const inputDiscreteLanes = InputDiscreteLanes & lanes;

  if (inputDiscreteLanes !== NoLanes) {
    return_highestLanePriority = InputDiscreteLanePriority;
    return inputDiscreteLanes;
  }

  if ((lanes & InputContinuousHydrationLane) !== NoLanes) {
    return_highestLanePriority = InputContinuousHydrationLanePriority;
    return InputContinuousHydrationLane;
  }

  const inputContinuousLanes = InputContinuousLanes & lanes;

  if (inputContinuousLanes !== NoLanes) {
    return_highestLanePriority = InputContinuousLanePriority;
    return inputContinuousLanes;
  }

  if ((lanes & DefaultHydrationLane) !== NoLanes) {
    return_highestLanePriority = DefaultHydrationLanePriority;
    return DefaultHydrationLane;
  }

  const defaultLanes = DefaultLanes & lanes;

  if (defaultLanes !== NoLanes) {
    return_highestLanePriority = DefaultLanePriority;
    return defaultLanes;
  }

  if ((lanes & TransitionHydrationLane) !== NoLanes) {
    return_highestLanePriority = TransitionHydrationPriority;
    return TransitionHydrationLane;
  }

  const transitionLanes = TransitionLanes & lanes;

  if (transitionLanes !== NoLanes) {
    return_highestLanePriority = TransitionPriority;
    return transitionLanes;
  }

  const retryLanes = RetryLanes & lanes;

  if (retryLanes !== NoLanes) {
    return_highestLanePriority = RetryLanePriority;
    return retryLanes;
  }

  if (lanes & SelectiveHydrationLane) {
    return_highestLanePriority = SelectiveHydrationLanePriority;
    return SelectiveHydrationLane;
  }

  if ((lanes & IdleHydrationLane) !== NoLanes) {
    return_highestLanePriority = IdleHydrationLanePriority;
    return IdleHydrationLane;
  }

  const idleLanes = IdleLanes & lanes;

  if (idleLanes !== NoLanes) {
    return_highestLanePriority = IdleLanePriority;
    return idleLanes;
  }

  if ((OffscreenLane & lanes) !== NoLanes) {
    return_highestLanePriority = OffscreenLanePriority;
    return OffscreenLane;
  }


  return_highestLanePriority = DefaultLanePriority;
  return lanes;
}

function schedulerPriorityToLanePriority(schedulerPriorityLevel) {
  switch (schedulerPriorityLevel) {
    case ImmediatePriority:
      return SyncLanePriority;

    case UserBlockingPriority:
      return InputContinuousLanePriority;

    case NormalPriority:
    case LowPriority:
      // TODO: Handle LowSchedulerPriority, somehow. Maybe the same lane as hydration.
      return DefaultLanePriority;

    case IdlePriority:
      return IdleLanePriority;

    default:
      return NoLanePriority;
  }
}
function lanePriorityToSchedulerPriority(lanePriority) {
  switch (lanePriority) {
    case SyncLanePriority:
    case SyncBatchedLanePriority:
      return ImmediatePriority;

    case InputDiscreteHydrationLanePriority:
    case InputDiscreteLanePriority:
    case InputContinuousHydrationLanePriority:
    case InputContinuousLanePriority:
      return UserBlockingPriority;

    case DefaultHydrationLanePriority:
    case DefaultLanePriority:
    case TransitionHydrationPriority:
    case TransitionPriority:
    case SelectiveHydrationLanePriority:
    case RetryLanePriority:
      return NormalPriority;

    case IdleHydrationLanePriority:
    case IdleLanePriority:
    case OffscreenLanePriority:
      return IdlePriority;

    case NoLanePriority:
      return NoPriority;

    default:
      {
        {
          throw Error( formatProdErrorMessage(358, lanePriority));
        }
      }

  }
}
function getNextLanes(root, wipLanes) {
  // Early bailout if there's no pending work left.
  const pendingLanes = root.pendingLanes;

  if (pendingLanes === NoLanes) {
    return_highestLanePriority = NoLanePriority;
    return NoLanes;
  }

  let nextLanes = NoLanes;
  let nextLanePriority = NoLanePriority;
  const expiredLanes = root.expiredLanes;
  const suspendedLanes = root.suspendedLanes;
  const pingedLanes = root.pingedLanes; // Check if any work has expired.

  if (expiredLanes !== NoLanes) {
    nextLanes = expiredLanes;
    nextLanePriority = return_highestLanePriority = SyncLanePriority;
  } else {
    // Do not work on any idle work until all the non-idle work has finished,
    // even if the work is suspended.
    const nonIdlePendingLanes = pendingLanes & NonIdleLanes;

    if (nonIdlePendingLanes !== NoLanes) {
      const nonIdleUnblockedLanes = nonIdlePendingLanes & ~suspendedLanes;

      if (nonIdleUnblockedLanes !== NoLanes) {
        nextLanes = getHighestPriorityLanes(nonIdleUnblockedLanes);
        nextLanePriority = return_highestLanePriority;
      } else {
        const nonIdlePingedLanes = nonIdlePendingLanes & pingedLanes;

        if (nonIdlePingedLanes !== NoLanes) {
          nextLanes = getHighestPriorityLanes(nonIdlePingedLanes);
          nextLanePriority = return_highestLanePriority;
        }
      }
    } else {
      // The only remaining work is Idle.
      const unblockedLanes = pendingLanes & ~suspendedLanes;

      if (unblockedLanes !== NoLanes) {
        nextLanes = getHighestPriorityLanes(unblockedLanes);
        nextLanePriority = return_highestLanePriority;
      } else {
        if (pingedLanes !== NoLanes) {
          nextLanes = getHighestPriorityLanes(pingedLanes);
          nextLanePriority = return_highestLanePriority;
        }
      }
    }
  }

  if (nextLanes === NoLanes) {
    // This should only be reachable if we're suspended
    // TODO: Consider warning in this path if a fallback timer is not scheduled.
    return NoLanes;
  } // If there are higher priority lanes, we'll include them even if they
  // are suspended.


  nextLanes = pendingLanes & getEqualOrHigherPriorityLanes(nextLanes); // If we're already in the middle of a render, switching lanes will interrupt
  // it and we'll lose our progress. We should only do this if the new lanes are
  // higher priority.

  if (wipLanes !== NoLanes && wipLanes !== nextLanes && // If we already suspended with a delay, then interrupting is fine. Don't
  // bother waiting until the root is complete.
  (wipLanes & suspendedLanes) === NoLanes) {
    getHighestPriorityLanes(wipLanes);
    const wipLanePriority = return_highestLanePriority;

    if (nextLanePriority <= wipLanePriority) {
      return wipLanes;
    } else {
      return_highestLanePriority = nextLanePriority;
    }
  } // Check for entangled lanes and add them to the batch.
  //
  // A lane is said to be entangled with another when it's not allowed to render
  // in a batch that does not also include the other lane. Typically we do this
  // when multiple updates have the same source, and we only want to respond to
  // the most recent event from that source.
  //
  // Note that we apply entanglements *after* checking for partial work above.
  // This means that if a lane is entangled during an interleaved event while
  // it's already rendering, we won't interrupt it. This is intentional, since
  // entanglement is usually "best effort": we'll try our best to render the
  // lanes in the same batch, but it's not worth throwing out partially
  // completed work in order to do it.
  //
  // For those exceptions where entanglement is semantically important, like
  // useMutableSource, we should ensure that there is no partial work at the
  // time we apply the entanglement.


  const entangledLanes = root.entangledLanes;

  if (entangledLanes !== NoLanes) {
    const entanglements = root.entanglements;
    let lanes = nextLanes & entangledLanes;

    while (lanes > 0) {
      const index = pickArbitraryLaneIndex(lanes);
      const lane = 1 << index;
      nextLanes |= entanglements[index];
      lanes &= ~lane;
    }
  }

  return nextLanes;
}
function getMostRecentEventTime(root, lanes) {
  const eventTimes = root.eventTimes;
  let mostRecentEventTime = NoTimestamp;

  while (lanes > 0) {
    const index = pickArbitraryLaneIndex(lanes);
    const lane = 1 << index;
    const eventTime = eventTimes[index];

    if (eventTime > mostRecentEventTime) {
      mostRecentEventTime = eventTime;
    }

    lanes &= ~lane;
  }

  return mostRecentEventTime;
}

function computeExpirationTime(lane, currentTime) {
  // TODO: Expiration heuristic is constant per lane, so could use a map.
  getHighestPriorityLanes(lane);
  const priority = return_highestLanePriority;

  if (priority >= InputContinuousLanePriority) {
    // User interactions should expire slightly more quickly.
    //
    // NOTE: This is set to the corresponding constant as in Scheduler.js. When
    // we made it larger, a product metric in www regressed, suggesting there's
    // a user interaction that's being starved by a series of synchronous
    // updates. If that theory is correct, the proper solution is to fix the
    // starvation. However, this scenario supports the idea that expiration
    // times are an important safeguard when starvation does happen.
    //
    // Also note that, in the case of user input specifically, this will soon no
    // longer be an issue because we plan to make user input synchronous by
    // default (until you enter `startTransition`, of course.)
    //
    // If weren't planning to make these updates synchronous soon anyway, I
    // would probably make this number a configurable parameter.
    return currentTime + 250;
  } else if (priority >= TransitionPriority) {
    return currentTime + 5000;
  } else {
    // Anything idle priority or lower should never expire.
    return NoTimestamp;
  }
}

function markStarvedLanesAsExpired(root, currentTime) {
  // TODO: This gets called every time we yield. We can optimize by storing
  // the earliest expiration time on the root. Then use that to quickly bail out
  // of this function.
  const pendingLanes = root.pendingLanes;
  const suspendedLanes = root.suspendedLanes;
  const pingedLanes = root.pingedLanes;
  const expirationTimes = root.expirationTimes; // Iterate through the pending lanes and check if we've reached their
  // expiration time. If so, we'll assume the update is being starved and mark
  // it as expired to force it to finish.

  let lanes = pendingLanes;

  while (lanes > 0) {
    const index = pickArbitraryLaneIndex(lanes);
    const lane = 1 << index;
    const expirationTime = expirationTimes[index];

    if (expirationTime === NoTimestamp) {
      // Found a pending lane with no expiration time. If it's not suspended, or
      // if it's pinged, assume it's CPU-bound. Compute a new expiration time
      // using the current time.
      if ((lane & suspendedLanes) === NoLanes || (lane & pingedLanes) !== NoLanes) {
        // Assumes timestamps are monotonically increasing.
        expirationTimes[index] = computeExpirationTime(lane, currentTime);
      }
    } else if (expirationTime <= currentTime) {
      // This lane expired
      root.expiredLanes |= lane;
    }

    lanes &= ~lane;
  }
} // This returns the highest priority pending lanes regardless of whether they
function getLanesToRetrySynchronouslyOnError(root) {
  const everythingButOffscreen = root.pendingLanes & ~OffscreenLane;

  if (everythingButOffscreen !== NoLanes) {
    return everythingButOffscreen;
  }

  if (everythingButOffscreen & OffscreenLane) {
    return OffscreenLane;
  }

  return NoLanes;
}
function returnNextLanesPriority() {
  return return_highestLanePriority;
}
function includesNonIdleWork(lanes) {
  return (lanes & NonIdleLanes) !== NoLanes;
}
function includesOnlyRetries(lanes) {
  return (lanes & RetryLanes) === lanes;
}
function includesOnlyTransitions(lanes) {
  return (lanes & TransitionLanes) === lanes;
} // To ensure consistency across multiple updates in the same event, this should
// be a pure function, so that it always returns the same lane for given inputs.

function findUpdateLane(lanePriority, wipLanes) {
  switch (lanePriority) {
    case NoLanePriority:
      break;

    case SyncLanePriority:
      return SyncLane;

    case SyncBatchedLanePriority:
      return SyncBatchedLane;

    case InputDiscreteLanePriority:
      {
        const lane = pickArbitraryLane(InputDiscreteLanes & ~wipLanes);

        if (lane === NoLane) {
          // Shift to the next priority level
          return findUpdateLane(InputContinuousLanePriority, wipLanes);
        }

        return lane;
      }

    case InputContinuousLanePriority:
      {
        const lane = pickArbitraryLane(InputContinuousLanes & ~wipLanes);

        if (lane === NoLane) {
          // Shift to the next priority level
          return findUpdateLane(DefaultLanePriority, wipLanes);
        }

        return lane;
      }

    case DefaultLanePriority:
      {
        let lane = pickArbitraryLane(DefaultLanes & ~wipLanes);

        if (lane === NoLane) {
          // If all the default lanes are already being worked on, look for a
          // lane in the transition range.
          lane = pickArbitraryLane(TransitionLanes & ~wipLanes);

          if (lane === NoLane) {
            // All the transition lanes are taken, too. This should be very
            // rare, but as a last resort, pick a default lane. This will have
            // the effect of interrupting the current work-in-progress render.
            lane = pickArbitraryLane(DefaultLanes);
          }
        }

        return lane;
      }

    case TransitionPriority: // Should be handled by findTransitionLane instead

    case RetryLanePriority:
      // Should be handled by findRetryLane instead
      break;

    case IdleLanePriority:
      let lane = pickArbitraryLane(IdleLanes & ~wipLanes);

      if (lane === NoLane) {
        lane = pickArbitraryLane(IdleLanes);
      }

      return lane;
  }

  {
    {
      throw Error( formatProdErrorMessage(358, lanePriority));
    }
  }
} // To ensure consistency across multiple updates in the same event, this should
// be pure function, so that it always returns the same lane for given inputs.

function findTransitionLane(wipLanes, pendingLanes) {
  // First look for lanes that are completely unclaimed, i.e. have no
  // pending work.
  let lane = pickArbitraryLane(TransitionLanes & ~pendingLanes);

  if (lane === NoLane) {
    // If all lanes have pending work, look for a lane that isn't currently
    // being worked on.
    lane = pickArbitraryLane(TransitionLanes & ~wipLanes);

    if (lane === NoLane) {
      // If everything is being worked on, pick any lane. This has the
      // effect of interrupting the current work-in-progress.
      lane = pickArbitraryLane(TransitionLanes);
    }
  }

  return lane;
} // To ensure consistency across multiple updates in the same event, this should
// be pure function, so that it always returns the same lane for given inputs.

function findRetryLane(wipLanes) {
  // This is a fork of `findUpdateLane` designed specifically for Suspense
  // "retries" — a special update that attempts to flip a Suspense boundary
  // from its placeholder state to its primary/resolved state.
  let lane = pickArbitraryLane(RetryLanes & ~wipLanes);

  if (lane === NoLane) {
    lane = pickArbitraryLane(RetryLanes);
  }

  return lane;
}

function getHighestPriorityLane(lanes) {
  return lanes & -lanes;
}

function getLowestPriorityLane(lanes) {
  // This finds the most significant non-zero bit.
  const index = 31 - clz32(lanes);
  return index < 0 ? NoLanes : 1 << index;
}

function getEqualOrHigherPriorityLanes(lanes) {
  return (getLowestPriorityLane(lanes) << 1) - 1;
}

function pickArbitraryLane(lanes) {
  // This wrapper function gets inlined. Only exists so to communicate that it
  // doesn't matter which bit is selected; you can pick any bit without
  // affecting the algorithms where its used. Here I'm using
  // getHighestPriorityLane because it requires the fewest operations.
  return getHighestPriorityLane(lanes);
}

function pickArbitraryLaneIndex(lanes) {
  return 31 - clz32(lanes);
}

function laneToIndex(lane) {
  return pickArbitraryLaneIndex(lane);
}

function includesSomeLane(a, b) {
  return (a & b) !== NoLanes;
}
function isSubsetOfLanes(set, subset) {
  return (set & subset) === subset;
}
function mergeLanes(a, b) {
  return a | b;
}
function removeLanes(set, subset) {
  return set & ~subset;
} // Seems redundant, but it changes the type from a single lane (used for
// updates) to a group of lanes (used for flushing work).

function laneToLanes(lane) {
  return lane;
}
function createLaneMap(initial) {
  return new Array(TotalLanes).fill(initial);
}
function markRootUpdated(root, updateLane, eventTime) {
  root.pendingLanes |= updateLane; // TODO: Theoretically, any update to any lane can unblock any other lane. But
  // it's not practical to try every single possible combination. We need a
  // heuristic to decide which lanes to attempt to render, and in which batches.
  // For now, we use the same heuristic as in the old ExpirationTimes model:
  // retry any lane at equal or lower priority, but don't try updates at higher
  // priority without also including the lower priority updates. This works well
  // when considering updates across different priority levels, but isn't
  // sufficient for updates within the same priority, since we want to treat
  // those updates as parallel.
  // Unsuspend any update at equal or lower priority.

  const higherPriorityLanes = updateLane - 1; // Turns 0b1000 into 0b0111

  root.suspendedLanes &= higherPriorityLanes;
  root.pingedLanes &= higherPriorityLanes;
  const eventTimes = root.eventTimes;
  const index = laneToIndex(updateLane); // We can always overwrite an existing timestamp because we prefer the most
  // recent event, and we assume time is monotonically increasing.

  eventTimes[index] = eventTime;
}
function markRootSuspended(root, suspendedLanes) {
  root.suspendedLanes |= suspendedLanes;
  root.pingedLanes &= ~suspendedLanes; // The suspended lanes are no longer CPU-bound. Clear their expiration times.

  const expirationTimes = root.expirationTimes;
  let lanes = suspendedLanes;

  while (lanes > 0) {
    const index = pickArbitraryLaneIndex(lanes);
    const lane = 1 << index;
    expirationTimes[index] = NoTimestamp;
    lanes &= ~lane;
  }
}
function markRootPinged(root, pingedLanes, eventTime) {
  root.pingedLanes |= root.suspendedLanes & pingedLanes;
}
function hasDiscreteLanes(lanes) {
  return (lanes & InputDiscreteLanes) !== NoLanes;
}
function markRootMutableRead(root, updateLane) {
  root.mutableReadLanes |= updateLane & root.pendingLanes;
}
function markRootFinished(root, remainingLanes) {
  const noLongerPendingLanes = root.pendingLanes & ~remainingLanes;
  root.pendingLanes = remainingLanes; // Let's try everything again

  root.suspendedLanes = 0;
  root.pingedLanes = 0;
  root.expiredLanes &= remainingLanes;
  root.mutableReadLanes &= remainingLanes;
  root.entangledLanes &= remainingLanes;
  const entanglements = root.entanglements;
  const eventTimes = root.eventTimes;
  const expirationTimes = root.expirationTimes; // Clear the lanes that no longer have pending work

  let lanes = noLongerPendingLanes;

  while (lanes > 0) {
    const index = pickArbitraryLaneIndex(lanes);
    const lane = 1 << index;
    entanglements[index] = NoLanes;
    eventTimes[index] = NoTimestamp;
    expirationTimes[index] = NoTimestamp;
    lanes &= ~lane;
  }
}
function markRootEntangled(root, entangledLanes) {
  root.entangledLanes |= entangledLanes;
  const entanglements = root.entanglements;
  let lanes = entangledLanes;

  while (lanes > 0) {
    const index = pickArbitraryLaneIndex(lanes);
    const lane = 1 << index;
    entanglements[index] |= entangledLanes;
    lanes &= ~lane;
  }
}
function getBumpedLaneForHydration(root, renderLanes) {
  getHighestPriorityLanes(renderLanes);
  const highestLanePriority = return_highestLanePriority;
  let lane;

  switch (highestLanePriority) {
    case SyncLanePriority:
    case SyncBatchedLanePriority:
      lane = NoLane;
      break;

    case InputDiscreteHydrationLanePriority:
    case InputDiscreteLanePriority:
      lane = InputDiscreteHydrationLane;
      break;

    case InputContinuousHydrationLanePriority:
    case InputContinuousLanePriority:
      lane = InputContinuousHydrationLane;
      break;

    case DefaultHydrationLanePriority:
    case DefaultLanePriority:
      lane = DefaultHydrationLane;
      break;

    case TransitionHydrationPriority:
    case TransitionPriority:
      lane = TransitionHydrationLane;
      break;

    case RetryLanePriority:
      // Shouldn't be reachable under normal circumstances, so there's no
      // dedicated lane for retry priority. Use the one for long transitions.
      lane = TransitionHydrationLane;
      break;

    case SelectiveHydrationLanePriority:
      lane = SelectiveHydrationLane;
      break;

    case IdleHydrationLanePriority:
    case IdleLanePriority:
      lane = IdleHydrationLane;
      break;

    case OffscreenLanePriority:
    case NoLanePriority:
      lane = NoLane;
      break;

    default:
      {
        {
          throw Error( formatProdErrorMessage(360, lane));
        }
      }

  } // Check if the lane we chose is suspended. If so, that indicates that we
  // already attempted and failed to hydrate at that level. Also check if we're
  // already rendering that lane, which is rare but could happen.


  if ((lane & (root.suspendedLanes | renderLanes)) !== NoLane) {
    // Give up trying to hydrate and fall back to client render.
    return NoLane;
  }

  return lane;
}
const clz32 = Math.clz32 ? Math.clz32 : clz32Fallback; // Count leading zeros. Only used on lanes, so assume input is an integer.
// Based on:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32

const log = Math.log;
const LN2 = Math.LN2;

function clz32Fallback(lanes) {
  if (lanes === 0) {
    return 32;
  }

  return 31 - (log(lanes) / LN2 | 0) | 0;
}

const Scheduler_runWithPriority = Scheduler.unstable_runWithPriority,
      Scheduler_scheduleCallback = Scheduler.unstable_scheduleCallback,
      Scheduler_cancelCallback = Scheduler.unstable_cancelCallback,
      Scheduler_shouldYield = Scheduler.unstable_shouldYield,
      Scheduler_requestPaint = Scheduler.unstable_requestPaint,
      Scheduler_now$1 = Scheduler.unstable_now,
      Scheduler_getCurrentPriorityLevel = Scheduler.unstable_getCurrentPriorityLevel,
      Scheduler_ImmediatePriority = Scheduler.unstable_ImmediatePriority,
      Scheduler_UserBlockingPriority = Scheduler.unstable_UserBlockingPriority,
      Scheduler_NormalPriority = Scheduler.unstable_NormalPriority,
      Scheduler_LowPriority = Scheduler.unstable_LowPriority,
      Scheduler_IdlePriority = Scheduler.unstable_IdlePriority;

{
  // Provide explicit error message when production+profiling bundle of e.g.
  // react-dom is used with production (non-profiling) bundle of
  // scheduler/tracing
  if (!(tracing.__interactionsRef != null && tracing.__interactionsRef.current != null)) {
    {
      throw Error( formatProdErrorMessage(302));
    }
  }
}

const fakeCallbackNode = {}; // Except for NoPriority, these correspond to Scheduler priorities. We use
// ascending numbers so we can compare them like numbers. They start at 90 to
// avoid clashing with Scheduler's priorities.

const ImmediatePriority$1 = 99;
const UserBlockingPriority$1 = 98;
const NormalPriority$1 = 97;
const LowPriority$1 = 96;
const IdlePriority$1 = 95; // NoPriority is the absence of priority. Also React-only.

const NoPriority$1 = 90;
const shouldYield = Scheduler_shouldYield;
const requestPaint = // Fall back gracefully if we're running an older version of Scheduler.
Scheduler_requestPaint !== undefined ? Scheduler_requestPaint : () => {};
let syncQueue = null;
let immediateQueueCallbackNode = null;
let isFlushingSyncQueue = false;
const initialTimeMs$1 = Scheduler_now$1(); // If the initial timestamp is reasonably small, use Scheduler's `now` directly.
// This will be the case for modern browsers that support `performance.now`. In
// older browsers, Scheduler falls back to `Date.now`, which returns a Unix
// timestamp. In that case, subtract the module initialization time to simulate
// the behavior of performance.now and keep our times small enough to fit
// within 32 bits.
// TODO: Consider lifting this into Scheduler.

const now = initialTimeMs$1 < 10000 ? Scheduler_now$1 : () => Scheduler_now$1() - initialTimeMs$1;
function getCurrentPriorityLevel() {
  switch (Scheduler_getCurrentPriorityLevel()) {
    case Scheduler_ImmediatePriority:
      return ImmediatePriority$1;

    case Scheduler_UserBlockingPriority:
      return UserBlockingPriority$1;

    case Scheduler_NormalPriority:
      return NormalPriority$1;

    case Scheduler_LowPriority:
      return LowPriority$1;

    case Scheduler_IdlePriority:
      return IdlePriority$1;

    default:
      {
        {
          throw Error( formatProdErrorMessage(332));
        }
      }

  }
}

function reactPriorityToSchedulerPriority(reactPriorityLevel) {
  switch (reactPriorityLevel) {
    case ImmediatePriority$1:
      return Scheduler_ImmediatePriority;

    case UserBlockingPriority$1:
      return Scheduler_UserBlockingPriority;

    case NormalPriority$1:
      return Scheduler_NormalPriority;

    case LowPriority$1:
      return Scheduler_LowPriority;

    case IdlePriority$1:
      return Scheduler_IdlePriority;

    default:
      {
        {
          throw Error( formatProdErrorMessage(332));
        }
      }

  }
}

function runWithPriority(reactPriorityLevel, fn) {
  const priorityLevel = reactPriorityToSchedulerPriority(reactPriorityLevel);
  return Scheduler_runWithPriority(priorityLevel, fn);
}
function scheduleCallback(reactPriorityLevel, callback, options) {
  const priorityLevel = reactPriorityToSchedulerPriority(reactPriorityLevel);
  return Scheduler_scheduleCallback(priorityLevel, callback, options);
}
function scheduleSyncCallback(callback) {
  // Push this callback into an internal queue. We'll flush these either in
  // the next tick, or earlier if something calls `flushSyncCallbackQueue`.
  if (syncQueue === null) {
    syncQueue = [callback]; // Flush the queue in the next tick, at the earliest.

    immediateQueueCallbackNode = Scheduler_scheduleCallback(Scheduler_ImmediatePriority, flushSyncCallbackQueueImpl);
  } else {
    // Push onto existing queue. Don't need to schedule a callback because
    // we already scheduled one when we created the queue.
    syncQueue.push(callback);
  }

  return fakeCallbackNode;
}
function cancelCallback(callbackNode) {
  if (callbackNode !== fakeCallbackNode) {
    Scheduler_cancelCallback(callbackNode);
  }
}
function flushSyncCallbackQueue() {
  if (immediateQueueCallbackNode !== null) {
    const node = immediateQueueCallbackNode;
    immediateQueueCallbackNode = null;
    Scheduler_cancelCallback(node);
  }

  flushSyncCallbackQueueImpl();
}

function flushSyncCallbackQueueImpl() {
  if (!isFlushingSyncQueue && syncQueue !== null) {
    // Prevent re-entrancy.
    isFlushingSyncQueue = true;
    let i = 0;

    if (decoupleUpdatePriorityFromScheduler) {

      try {
        const isSync = true;
        const queue = syncQueue;
        setCurrentUpdateLanePriority(SyncLanePriority);
        runWithPriority(ImmediatePriority$1, () => {
          for (; i < queue.length; i++) {
            let callback = queue[i];

            do {
              callback = callback(isSync);
            } while (callback !== null);
          }
        });
        syncQueue = null;
      } catch (error) {
        // If something throws, leave the remaining callbacks on the queue.
        if (syncQueue !== null) {
          syncQueue = syncQueue.slice(i + 1);
        } // Resume flushing in the next tick


        Scheduler_scheduleCallback(Scheduler_ImmediatePriority, flushSyncCallbackQueue);
        throw error;
      } finally {
        isFlushingSyncQueue = false;
      }
    } else {
      try {
        const isSync = true;
        const queue = syncQueue;
        runWithPriority(ImmediatePriority$1, () => {
          for (; i < queue.length; i++) {
            let callback = queue[i];

            do {
              callback = callback(isSync);
            } while (callback !== null);
          }
        });
        syncQueue = null;
      } catch (error) {
        // If something throws, leave the remaining callbacks on the queue.
        if (syncQueue !== null) {
          syncQueue = syncQueue.slice(i + 1);
        } // Resume flushing in the next tick


        Scheduler_scheduleCallback(Scheduler_ImmediatePriority, flushSyncCallbackQueue);
        throw error;
      } finally {
        isFlushingSyncQueue = false;
      }
    }
  }
}

const NoMode = 0b00000;
const StrictMode = 0b00001; // TODO: Remove BlockingMode and ConcurrentMode by reading from the root
// tag instead

const BlockingMode = 0b00010;
const ConcurrentMode = 0b00100;
const ProfileMode = 0b01000;
const DebugTracingMode = 0b10000;

const ReactCurrentBatchConfig = ReactSharedInternals.ReactCurrentBatchConfig;
const NoTransition = 0;
function requestCurrentTransition() {
  return ReactCurrentBatchConfig.transition;
}

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x, y) {
  return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y // eslint-disable-line no-self-compare
  ;
}

const objectIs = typeof Object.is === 'function' ? Object.is : is;

const hasOwnProperty = Object.prototype.hasOwnProperty;
/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */

function shallowEqual(objA, objB) {
  if (objectIs(objA, objB)) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  } // Test for A's keys different from B.


  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwnProperty.call(objB, keysA[i]) || !objectIs(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}

function describeFiber(fiber) {

  switch (fiber.tag) {
    case HostComponent:
      return describeBuiltInComponentFrame(fiber.type);

    case LazyComponent:
      return describeBuiltInComponentFrame('Lazy');

    case SuspenseComponent:
      return describeBuiltInComponentFrame('Suspense');

    case SuspenseListComponent:
      return describeBuiltInComponentFrame('SuspenseList');

    case FunctionComponent:
    case IndeterminateComponent:
    case SimpleMemoComponent:
      return describeFunctionComponentFrame(fiber.type);

    case ForwardRef:
      return describeFunctionComponentFrame(fiber.type.render);

    case Block:
      return describeFunctionComponentFrame(fiber.type._render);

    case ClassComponent:
      return describeClassComponentFrame(fiber.type);

    default:
      return '';
  }
}

function getStackByFiberInDevAndProd(workInProgress) {
  try {
    let info = '';
    let node = workInProgress;

    do {
      info += describeFiber(node);
      node = node.return;
    } while (node);

    return info;
  } catch (x) {
    return '\nError generating stack: ' + x.message + '\n' + x.stack;
  }
}

const ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;

function resetCurrentFiber() {
}

function resolveDefaultProps(Component, baseProps) {
  if (Component && Component.defaultProps) {
    // Resolve default props. Taken from ReactElement
    const props = Object.assign({}, baseProps);
    const defaultProps = Component.defaultProps;

    for (const propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }

    return props;
  }

  return baseProps;
}

// Max 31 bit integer. The max integer size in V8 for 32-bit systems.
// Math.pow(2, 30) - 1
// 0b111111111111111111111111111111
const MAX_SIGNED_31_BIT_INT = 1073741823;

const valueCursor = createCursor(null);

let currentlyRenderingFiber = null;
let lastContextDependency = null;
let lastContextWithAllBitsObserved = null;
function resetContextDependencies() {
  // This is called right before React yields execution, to ensure `readContext`
  // cannot be called outside the render phase.
  currentlyRenderingFiber = null;
  lastContextDependency = null;
  lastContextWithAllBitsObserved = null;
}
function pushProvider(providerFiber, nextValue) {
  const context = providerFiber.type._context;

  {
    push(valueCursor, context._currentValue2);
    context._currentValue2 = nextValue;
  }
}
function popProvider(providerFiber) {
  const currentValue = valueCursor.current;
  pop(valueCursor);
  const context = providerFiber.type._context;

  {
    context._currentValue2 = currentValue;
  }
}
function calculateChangedBits(context, newValue, oldValue) {
  if (objectIs(oldValue, newValue)) {
    // No change
    return 0;
  } else {
    const changedBits = typeof context._calculateChangedBits === 'function' ? context._calculateChangedBits(oldValue, newValue) : MAX_SIGNED_31_BIT_INT;

    return changedBits | 0;
  }
}
function scheduleWorkOnParentPath(parent, renderLanes) {
  // Update the child lanes of all the ancestors, including the alternates.
  let node = parent;

  while (node !== null) {
    const alternate = node.alternate;

    if (!isSubsetOfLanes(node.childLanes, renderLanes)) {
      node.childLanes = mergeLanes(node.childLanes, renderLanes);

      if (alternate !== null) {
        alternate.childLanes = mergeLanes(alternate.childLanes, renderLanes);
      }
    } else if (alternate !== null && !isSubsetOfLanes(alternate.childLanes, renderLanes)) {
      alternate.childLanes = mergeLanes(alternate.childLanes, renderLanes);
    } else {
      // Neither alternate was updated, which means the rest of the
      // ancestor path already has sufficient priority.
      break;
    }

    node = node.return;
  }
}
function propagateContextChange(workInProgress, context, changedBits, renderLanes) {
  let fiber = workInProgress.child;

  if (fiber !== null) {
    // Set the return pointer of the child to the work-in-progress fiber.
    fiber.return = workInProgress;
  }

  while (fiber !== null) {
    let nextFiber; // Visit this fiber.

    const list = fiber.dependencies;

    if (list !== null) {
      nextFiber = fiber.child;
      let dependency = list.firstContext;

      while (dependency !== null) {
        // Check if the context matches.
        if (dependency.context === context && (dependency.observedBits & changedBits) !== 0) {
          // Match! Schedule an update on this fiber.
          if (fiber.tag === ClassComponent) {
            // Schedule a force update on the work-in-progress.
            const update = createUpdate(NoTimestamp, pickArbitraryLane(renderLanes));
            update.tag = ForceUpdate; // TODO: Because we don't have a work-in-progress, this will add the
            // update to the current fiber, too, which means it will persist even if
            // this render is thrown away. Since it's a race condition, not sure it's
            // worth fixing.

            enqueueUpdate(fiber, update);
          }

          fiber.lanes = mergeLanes(fiber.lanes, renderLanes);
          const alternate = fiber.alternate;

          if (alternate !== null) {
            alternate.lanes = mergeLanes(alternate.lanes, renderLanes);
          }

          scheduleWorkOnParentPath(fiber.return, renderLanes); // Mark the updated lanes on the list, too.

          list.lanes = mergeLanes(list.lanes, renderLanes); // Since we already found a match, we can stop traversing the
          // dependency list.

          break;
        }

        dependency = dependency.next;
      }
    } else if (fiber.tag === ContextProvider) {
      // Don't scan deeper if this is a matching provider
      nextFiber = fiber.type === workInProgress.type ? null : fiber.child;
    } else if ( fiber.tag === DehydratedFragment) {
      // If a dehydrated suspense boundary is in this subtree, we don't know
      // if it will have any context consumers in it. The best we can do is
      // mark it as having updates.
      const parentSuspense = fiber.return;

      if (!(parentSuspense !== null)) {
        {
          throw Error( formatProdErrorMessage(341));
        }
      }

      parentSuspense.lanes = mergeLanes(parentSuspense.lanes, renderLanes);
      const alternate = parentSuspense.alternate;

      if (alternate !== null) {
        alternate.lanes = mergeLanes(alternate.lanes, renderLanes);
      } // This is intentionally passing this fiber as the parent
      // because we want to schedule this fiber as having work
      // on its children. We'll use the childLanes on
      // this fiber to indicate that a context has changed.


      scheduleWorkOnParentPath(parentSuspense, renderLanes);
      nextFiber = fiber.sibling;
    } else {
      // Traverse down.
      nextFiber = fiber.child;
    }

    if (nextFiber !== null) {
      // Set the return pointer of the child to the work-in-progress fiber.
      nextFiber.return = fiber;
    } else {
      // No child. Traverse to next sibling.
      nextFiber = fiber;

      while (nextFiber !== null) {
        if (nextFiber === workInProgress) {
          // We're back to the root of this subtree. Exit.
          nextFiber = null;
          break;
        }

        const sibling = nextFiber.sibling;

        if (sibling !== null) {
          // Set the return pointer of the sibling to the work-in-progress fiber.
          sibling.return = nextFiber.return;
          nextFiber = sibling;
          break;
        } // No more siblings. Traverse up.


        nextFiber = nextFiber.return;
      }
    }

    fiber = nextFiber;
  }
}
function prepareToReadContext(workInProgress, renderLanes) {
  currentlyRenderingFiber = workInProgress;
  lastContextDependency = null;
  lastContextWithAllBitsObserved = null;
  const dependencies = workInProgress.dependencies;

  if (dependencies !== null) {
    const firstContext = dependencies.firstContext;

    if (firstContext !== null) {
      if (includesSomeLane(dependencies.lanes, renderLanes)) {
        // Context list has a pending update. Mark that this fiber performed work.
        markWorkInProgressReceivedUpdate();
      } // Reset the work-in-progress list


      dependencies.firstContext = null;
    }
  }
}
function readContext(context, observedBits) {

  if (lastContextWithAllBitsObserved === context) ; else if (observedBits === false || observedBits === 0) ; else {
    let resolvedObservedBits; // Avoid deopting on observable arguments or heterogeneous types.

    if (typeof observedBits !== 'number' || observedBits === MAX_SIGNED_31_BIT_INT) {
      // Observe all updates.
      lastContextWithAllBitsObserved = context;
      resolvedObservedBits = MAX_SIGNED_31_BIT_INT;
    } else {
      resolvedObservedBits = observedBits;
    }

    const contextItem = {
      context: context,
      observedBits: resolvedObservedBits,
      next: null
    };

    if (lastContextDependency === null) {
      if (!(currentlyRenderingFiber !== null)) {
        {
          throw Error( formatProdErrorMessage(308));
        }
      } // This is the first dependency for this component. Create a new list.


      lastContextDependency = contextItem;
      currentlyRenderingFiber.dependencies = {
        lanes: NoLanes,
        firstContext: contextItem,
        responders: null
      };
    } else {
      // Append a new context item.
      lastContextDependency = lastContextDependency.next = contextItem;
    }
  }

  return  context._currentValue2;
}

const UpdateState = 0;
const ReplaceState = 1;
const ForceUpdate = 2;
const CaptureUpdate = 3; // Global state that is reset at the beginning of calling `processUpdateQueue`.
// It should only be read right after calling `processUpdateQueue`, via
// `checkHasForceUpdateAfterProcessing`.

let hasForceUpdate = false;

function initializeUpdateQueue(fiber) {
  const queue = {
    baseState: fiber.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: {
      pending: null
    },
    effects: null
  };
  fiber.updateQueue = queue;
}
function cloneUpdateQueue(current, workInProgress) {
  // Clone the update queue from current. Unless it's already a clone.
  const queue = workInProgress.updateQueue;
  const currentQueue = current.updateQueue;

  if (queue === currentQueue) {
    const clone = {
      baseState: currentQueue.baseState,
      firstBaseUpdate: currentQueue.firstBaseUpdate,
      lastBaseUpdate: currentQueue.lastBaseUpdate,
      shared: currentQueue.shared,
      effects: currentQueue.effects
    };
    workInProgress.updateQueue = clone;
  }
}
function createUpdate(eventTime, lane) {
  const update = {
    eventTime,
    lane,
    tag: UpdateState,
    payload: null,
    callback: null,
    next: null
  };
  return update;
}
function enqueueUpdate(fiber, update) {
  const updateQueue = fiber.updateQueue;

  if (updateQueue === null) {
    // Only occurs if the fiber has been unmounted.
    return;
  }

  const sharedQueue = updateQueue.shared;
  const pending = sharedQueue.pending;

  if (pending === null) {
    // This is the first update. Create a circular list.
    update.next = update;
  } else {
    update.next = pending.next;
    pending.next = update;
  }

  sharedQueue.pending = update;
}
function enqueueCapturedUpdate(workInProgress, capturedUpdate) {
  // Captured updates are updates that are thrown by a child during the render
  // phase. They should be discarded if the render is aborted. Therefore,
  // we should only put them on the work-in-progress queue, not the current one.
  let queue = workInProgress.updateQueue; // Check if the work-in-progress queue is a clone.

  const current = workInProgress.alternate;

  if (current !== null) {
    const currentQueue = current.updateQueue;

    if (queue === currentQueue) {
      // The work-in-progress queue is the same as current. This happens when
      // we bail out on a parent fiber that then captures an error thrown by
      // a child. Since we want to append the update only to the work-in
      // -progress queue, we need to clone the updates. We usually clone during
      // processUpdateQueue, but that didn't happen in this case because we
      // skipped over the parent when we bailed out.
      let newFirst = null;
      let newLast = null;
      const firstBaseUpdate = queue.firstBaseUpdate;

      if (firstBaseUpdate !== null) {
        // Loop through the updates and clone them.
        let update = firstBaseUpdate;

        do {
          const clone = {
            eventTime: update.eventTime,
            lane: update.lane,
            tag: update.tag,
            payload: update.payload,
            callback: update.callback,
            next: null
          };

          if (newLast === null) {
            newFirst = newLast = clone;
          } else {
            newLast.next = clone;
            newLast = clone;
          }

          update = update.next;
        } while (update !== null); // Append the captured update the end of the cloned list.


        if (newLast === null) {
          newFirst = newLast = capturedUpdate;
        } else {
          newLast.next = capturedUpdate;
          newLast = capturedUpdate;
        }
      } else {
        // There are no base updates.
        newFirst = newLast = capturedUpdate;
      }

      queue = {
        baseState: currentQueue.baseState,
        firstBaseUpdate: newFirst,
        lastBaseUpdate: newLast,
        shared: currentQueue.shared,
        effects: currentQueue.effects
      };
      workInProgress.updateQueue = queue;
      return;
    }
  } // Append the update to the end of the list.


  const lastBaseUpdate = queue.lastBaseUpdate;

  if (lastBaseUpdate === null) {
    queue.firstBaseUpdate = capturedUpdate;
  } else {
    lastBaseUpdate.next = capturedUpdate;
  }

  queue.lastBaseUpdate = capturedUpdate;
}

function getStateFromUpdate(workInProgress, queue, update, prevState, nextProps, instance) {
  switch (update.tag) {
    case ReplaceState:
      {
        const payload = update.payload;

        if (typeof payload === 'function') {

          const nextState = payload.call(instance, prevState, nextProps);

          return nextState;
        } // State object


        return payload;
      }

    case CaptureUpdate:
      {
        workInProgress.flags = workInProgress.flags & ~ShouldCapture | DidCapture;
      }
    // Intentional fallthrough

    case UpdateState:
      {
        const payload = update.payload;
        let partialState;

        if (typeof payload === 'function') {

          partialState = payload.call(instance, prevState, nextProps);
        } else {
          // Partial state object
          partialState = payload;
        }

        if (partialState === null || partialState === undefined) {
          // Null and undefined are treated as no-ops.
          return prevState;
        } // Merge the partial state and the previous state.


        return Object.assign({}, prevState, partialState);
      }

    case ForceUpdate:
      {
        hasForceUpdate = true;
        return prevState;
      }
  }

  return prevState;
}

function processUpdateQueue(workInProgress, props, instance, renderLanes) {
  // This is always non-null on a ClassComponent or HostRoot
  const queue = workInProgress.updateQueue;
  hasForceUpdate = false;

  let firstBaseUpdate = queue.firstBaseUpdate;
  let lastBaseUpdate = queue.lastBaseUpdate; // Check if there are pending updates. If so, transfer them to the base queue.

  let pendingQueue = queue.shared.pending;

  if (pendingQueue !== null) {
    queue.shared.pending = null; // The pending queue is circular. Disconnect the pointer between first
    // and last so that it's non-circular.

    const lastPendingUpdate = pendingQueue;
    const firstPendingUpdate = lastPendingUpdate.next;
    lastPendingUpdate.next = null; // Append pending updates to base queue

    if (lastBaseUpdate === null) {
      firstBaseUpdate = firstPendingUpdate;
    } else {
      lastBaseUpdate.next = firstPendingUpdate;
    }

    lastBaseUpdate = lastPendingUpdate; // If there's a current queue, and it's different from the base queue, then
    // we need to transfer the updates to that queue, too. Because the base
    // queue is a singly-linked list with no cycles, we can append to both
    // lists and take advantage of structural sharing.
    // TODO: Pass `current` as argument

    const current = workInProgress.alternate;

    if (current !== null) {
      // This is always non-null on a ClassComponent or HostRoot
      const currentQueue = current.updateQueue;
      const currentLastBaseUpdate = currentQueue.lastBaseUpdate;

      if (currentLastBaseUpdate !== lastBaseUpdate) {
        if (currentLastBaseUpdate === null) {
          currentQueue.firstBaseUpdate = firstPendingUpdate;
        } else {
          currentLastBaseUpdate.next = firstPendingUpdate;
        }

        currentQueue.lastBaseUpdate = lastPendingUpdate;
      }
    }
  } // These values may change as we process the queue.


  if (firstBaseUpdate !== null) {
    // Iterate through the list of updates to compute the result.
    let newState = queue.baseState; // TODO: Don't need to accumulate this. Instead, we can remove renderLanes
    // from the original lanes.

    let newLanes = NoLanes;
    let newBaseState = null;
    let newFirstBaseUpdate = null;
    let newLastBaseUpdate = null;
    let update = firstBaseUpdate;

    do {
      const updateLane = update.lane;
      const updateEventTime = update.eventTime;

      if (!isSubsetOfLanes(renderLanes, updateLane)) {
        // Priority is insufficient. Skip this update. If this is the first
        // skipped update, the previous update/state is the new base
        // update/state.
        const clone = {
          eventTime: updateEventTime,
          lane: updateLane,
          tag: update.tag,
          payload: update.payload,
          callback: update.callback,
          next: null
        };

        if (newLastBaseUpdate === null) {
          newFirstBaseUpdate = newLastBaseUpdate = clone;
          newBaseState = newState;
        } else {
          newLastBaseUpdate = newLastBaseUpdate.next = clone;
        } // Update the remaining priority in the queue.


        newLanes = mergeLanes(newLanes, updateLane);
      } else {
        // This update does have sufficient priority.
        if (newLastBaseUpdate !== null) {
          const clone = {
            eventTime: updateEventTime,
            // This update is going to be committed so we never want uncommit
            // it. Using NoLane works because 0 is a subset of all bitmasks, so
            // this will never be skipped by the check above.
            lane: NoLane,
            tag: update.tag,
            payload: update.payload,
            callback: update.callback,
            next: null
          };
          newLastBaseUpdate = newLastBaseUpdate.next = clone;
        } // Process this update.


        newState = getStateFromUpdate(workInProgress, queue, update, newState, props, instance);
        const callback = update.callback;

        if (callback !== null) {
          workInProgress.flags |= Callback;
          const effects = queue.effects;

          if (effects === null) {
            queue.effects = [update];
          } else {
            effects.push(update);
          }
        }
      }

      update = update.next;

      if (update === null) {
        pendingQueue = queue.shared.pending;

        if (pendingQueue === null) {
          break;
        } else {
          // An update was scheduled from inside a reducer. Add the new
          // pending updates to the end of the list and keep processing.
          const lastPendingUpdate = pendingQueue; // Intentionally unsound. Pending updates form a circular list, but we
          // unravel them when transferring them to the base queue.

          const firstPendingUpdate = lastPendingUpdate.next;
          lastPendingUpdate.next = null;
          update = firstPendingUpdate;
          queue.lastBaseUpdate = lastPendingUpdate;
          queue.shared.pending = null;
        }
      }
    } while (true);

    if (newLastBaseUpdate === null) {
      newBaseState = newState;
    }

    queue.baseState = newBaseState;
    queue.firstBaseUpdate = newFirstBaseUpdate;
    queue.lastBaseUpdate = newLastBaseUpdate; // Set the remaining expiration time to be whatever is remaining in the queue.
    // This should be fine because the only two other things that contribute to
    // expiration time are props and context. We're already in the middle of the
    // begin phase by the time we start processing the queue, so we've already
    // dealt with the props. Context in components that specify
    // shouldComponentUpdate is tricky; but we'll have to account for
    // that regardless.

    markSkippedUpdateLanes(newLanes);
    workInProgress.lanes = newLanes;
    workInProgress.memoizedState = newState;
  }
}

function callCallback(callback, context) {
  if (!(typeof callback === 'function')) {
    {
      throw Error( formatProdErrorMessage(191, callback));
    }
  }

  callback.call(context);
}

function resetHasForceUpdateBeforeProcessing() {
  hasForceUpdate = false;
}
function checkHasForceUpdateAfterProcessing() {
  return hasForceUpdate;
}
function commitUpdateQueue(finishedWork, finishedQueue, instance) {
  // Commit the effects
  const effects = finishedQueue.effects;
  finishedQueue.effects = null;

  if (effects !== null) {
    for (let i = 0; i < effects.length; i++) {
      const effect = effects[i];
      const callback = effect.callback;

      if (callback !== null) {
        effect.callback = null;
        callCallback(callback, instance);
      }
    }
  }
}

// We'll use it to determine whether we need to initialize legacy refs.

const emptyRefsObject = new React.Component().refs;

function applyDerivedStateFromProps(workInProgress, ctor, getDerivedStateFromProps, nextProps) {
  const prevState = workInProgress.memoizedState;

  const partialState = getDerivedStateFromProps(nextProps, prevState);


  const memoizedState = partialState === null || partialState === undefined ? prevState : Object.assign({}, prevState, partialState);
  workInProgress.memoizedState = memoizedState; // Once the update queue is empty, persist the derived state onto the
  // base state.

  if (workInProgress.lanes === NoLanes) {
    // Queue is always non-null for classes
    const updateQueue = workInProgress.updateQueue;
    updateQueue.baseState = memoizedState;
  }
}
const classComponentUpdater = {
  isMounted,

  enqueueSetState(inst, payload, callback) {
    const fiber = get(inst);
    const eventTime = requestEventTime();
    const lane = requestUpdateLane(fiber);
    const update = createUpdate(eventTime, lane);
    update.payload = payload;

    if (callback !== undefined && callback !== null) {

      update.callback = callback;
    }

    enqueueUpdate(fiber, update);
    scheduleUpdateOnFiber(fiber, lane, eventTime);
  },

  enqueueReplaceState(inst, payload, callback) {
    const fiber = get(inst);
    const eventTime = requestEventTime();
    const lane = requestUpdateLane(fiber);
    const update = createUpdate(eventTime, lane);
    update.tag = ReplaceState;
    update.payload = payload;

    if (callback !== undefined && callback !== null) {

      update.callback = callback;
    }

    enqueueUpdate(fiber, update);
    scheduleUpdateOnFiber(fiber, lane, eventTime);
  },

  enqueueForceUpdate(inst, callback) {
    const fiber = get(inst);
    const eventTime = requestEventTime();
    const lane = requestUpdateLane(fiber);
    const update = createUpdate(eventTime, lane);
    update.tag = ForceUpdate;

    if (callback !== undefined && callback !== null) {

      update.callback = callback;
    }

    enqueueUpdate(fiber, update);
    scheduleUpdateOnFiber(fiber, lane, eventTime);
  }

};

function checkShouldComponentUpdate(workInProgress, ctor, oldProps, newProps, oldState, newState, nextContext) {
  const instance = workInProgress.stateNode;

  if (typeof instance.shouldComponentUpdate === 'function') {

    const shouldUpdate = instance.shouldComponentUpdate(newProps, newState, nextContext);

    return shouldUpdate;
  }

  if (ctor.prototype && ctor.prototype.isPureReactComponent) {
    return !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState);
  }

  return true;
}

function adoptClassInstance(workInProgress, instance) {
  instance.updater = classComponentUpdater;
  workInProgress.stateNode = instance; // The instance needs access to the fiber so that it can schedule updates

  set(instance, workInProgress);
}

function constructClassInstance(workInProgress, ctor, props) {
  let context = emptyContextObject;
  const contextType = ctor.contextType;

  if (typeof contextType === 'object' && contextType !== null) {
    context = readContext(contextType);
  } // Instantiate twice to help detect side-effects.

  const instance = new ctor(props, context);
  const state = workInProgress.memoizedState = instance.state !== null && instance.state !== undefined ? instance.state : null;
  adoptClassInstance(workInProgress, instance);

  return instance;
}

function callComponentWillMount(workInProgress, instance) {
  const oldState = instance.state;

  if (typeof instance.componentWillMount === 'function') {
    instance.componentWillMount();
  }

  if (typeof instance.UNSAFE_componentWillMount === 'function') {
    instance.UNSAFE_componentWillMount();
  }

  if (oldState !== instance.state) {

    classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
  }
}

function callComponentWillReceiveProps(workInProgress, instance, newProps, nextContext) {
  const oldState = instance.state;

  if (typeof instance.componentWillReceiveProps === 'function') {
    instance.componentWillReceiveProps(newProps, nextContext);
  }

  if (typeof instance.UNSAFE_componentWillReceiveProps === 'function') {
    instance.UNSAFE_componentWillReceiveProps(newProps, nextContext);
  }

  if (instance.state !== oldState) {

    classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
  }
} // Invokes the mount life-cycles on a previously never rendered instance.


function mountClassInstance(workInProgress, ctor, newProps, renderLanes) {

  const instance = workInProgress.stateNode;
  instance.props = newProps;
  instance.state = workInProgress.memoizedState;
  instance.refs = emptyRefsObject;
  initializeUpdateQueue(workInProgress);
  const contextType = ctor.contextType;

  if (typeof contextType === 'object' && contextType !== null) {
    instance.context = readContext(contextType);
  } else {
    instance.context = emptyContextObject;
  }

  processUpdateQueue(workInProgress, newProps, instance, renderLanes);
  instance.state = workInProgress.memoizedState;
  const getDerivedStateFromProps = ctor.getDerivedStateFromProps;

  if (typeof getDerivedStateFromProps === 'function') {
    applyDerivedStateFromProps(workInProgress, ctor, getDerivedStateFromProps, newProps);
    instance.state = workInProgress.memoizedState;
  } // In order to support react-lifecycles-compat polyfilled components,
  // Unsafe lifecycles should not be invoked for components using the new APIs.


  if (typeof ctor.getDerivedStateFromProps !== 'function' && typeof instance.getSnapshotBeforeUpdate !== 'function' && (typeof instance.UNSAFE_componentWillMount === 'function' || typeof instance.componentWillMount === 'function')) {
    callComponentWillMount(workInProgress, instance); // If we had additional state updates during this life-cycle, let's
    // process them now.

    processUpdateQueue(workInProgress, newProps, instance, renderLanes);
    instance.state = workInProgress.memoizedState;
  }

  if (typeof instance.componentDidMount === 'function') {
    workInProgress.flags |= Update;
  }
}

function resumeMountClassInstance(workInProgress, ctor, newProps, renderLanes) {
  const instance = workInProgress.stateNode;
  const oldProps = workInProgress.memoizedProps;
  instance.props = oldProps;
  const oldContext = instance.context;
  const contextType = ctor.contextType;
  let nextContext = emptyContextObject;

  if (typeof contextType === 'object' && contextType !== null) {
    nextContext = readContext(contextType);
  }

  const getDerivedStateFromProps = ctor.getDerivedStateFromProps;
  const hasNewLifecycles = typeof getDerivedStateFromProps === 'function' || typeof instance.getSnapshotBeforeUpdate === 'function'; // Note: During these life-cycles, instance.props/instance.state are what
  // ever the previously attempted to render - not the "current". However,
  // during componentDidUpdate we pass the "current" props.
  // In order to support react-lifecycles-compat polyfilled components,
  // Unsafe lifecycles should not be invoked for components using the new APIs.

  if (!hasNewLifecycles && (typeof instance.UNSAFE_componentWillReceiveProps === 'function' || typeof instance.componentWillReceiveProps === 'function')) {
    if (oldProps !== newProps || oldContext !== nextContext) {
      callComponentWillReceiveProps(workInProgress, instance, newProps, nextContext);
    }
  }

  resetHasForceUpdateBeforeProcessing();
  const oldState = workInProgress.memoizedState;
  let newState = instance.state = oldState;
  processUpdateQueue(workInProgress, newProps, instance, renderLanes);
  newState = workInProgress.memoizedState;

  if (oldProps === newProps && oldState === newState && !hasContextChanged() && !checkHasForceUpdateAfterProcessing()) {
    // If an update was already in progress, we should schedule an Update
    // effect even though we're bailing out, so that cWU/cDU are called.
    if (typeof instance.componentDidMount === 'function') {
      workInProgress.flags |= Update;
    }

    return false;
  }

  if (typeof getDerivedStateFromProps === 'function') {
    applyDerivedStateFromProps(workInProgress, ctor, getDerivedStateFromProps, newProps);
    newState = workInProgress.memoizedState;
  }

  const shouldUpdate = checkHasForceUpdateAfterProcessing() || checkShouldComponentUpdate(workInProgress, ctor, oldProps, newProps, oldState, newState, nextContext);

  if (shouldUpdate) {
    // In order to support react-lifecycles-compat polyfilled components,
    // Unsafe lifecycles should not be invoked for components using the new APIs.
    if (!hasNewLifecycles && (typeof instance.UNSAFE_componentWillMount === 'function' || typeof instance.componentWillMount === 'function')) {
      if (typeof instance.componentWillMount === 'function') {
        instance.componentWillMount();
      }

      if (typeof instance.UNSAFE_componentWillMount === 'function') {
        instance.UNSAFE_componentWillMount();
      }
    }

    if (typeof instance.componentDidMount === 'function') {
      workInProgress.flags |= Update;
    }
  } else {
    // If an update was already in progress, we should schedule an Update
    // effect even though we're bailing out, so that cWU/cDU are called.
    if (typeof instance.componentDidMount === 'function') {
      workInProgress.flags |= Update;
    } // If shouldComponentUpdate returned false, we should still update the
    // memoized state to indicate that this work can be reused.


    workInProgress.memoizedProps = newProps;
    workInProgress.memoizedState = newState;
  } // Update the existing instance's state, props, and context pointers even
  // if shouldComponentUpdate returns false.


  instance.props = newProps;
  instance.state = newState;
  instance.context = nextContext;
  return shouldUpdate;
} // Invokes the update life-cycles and returns false if it shouldn't rerender.


function updateClassInstance(current, workInProgress, ctor, newProps, renderLanes) {
  const instance = workInProgress.stateNode;
  cloneUpdateQueue(current, workInProgress);
  const unresolvedOldProps = workInProgress.memoizedProps;
  const oldProps = workInProgress.type === workInProgress.elementType ? unresolvedOldProps : resolveDefaultProps(workInProgress.type, unresolvedOldProps);
  instance.props = oldProps;
  const unresolvedNewProps = workInProgress.pendingProps;
  const oldContext = instance.context;
  const contextType = ctor.contextType;
  let nextContext = emptyContextObject;

  if (typeof contextType === 'object' && contextType !== null) {
    nextContext = readContext(contextType);
  }

  const getDerivedStateFromProps = ctor.getDerivedStateFromProps;
  const hasNewLifecycles = typeof getDerivedStateFromProps === 'function' || typeof instance.getSnapshotBeforeUpdate === 'function'; // Note: During these life-cycles, instance.props/instance.state are what
  // ever the previously attempted to render - not the "current". However,
  // during componentDidUpdate we pass the "current" props.
  // In order to support react-lifecycles-compat polyfilled components,
  // Unsafe lifecycles should not be invoked for components using the new APIs.

  if (!hasNewLifecycles && (typeof instance.UNSAFE_componentWillReceiveProps === 'function' || typeof instance.componentWillReceiveProps === 'function')) {
    if (unresolvedOldProps !== unresolvedNewProps || oldContext !== nextContext) {
      callComponentWillReceiveProps(workInProgress, instance, newProps, nextContext);
    }
  }

  resetHasForceUpdateBeforeProcessing();
  const oldState = workInProgress.memoizedState;
  let newState = instance.state = oldState;
  processUpdateQueue(workInProgress, newProps, instance, renderLanes);
  newState = workInProgress.memoizedState;

  if (unresolvedOldProps === unresolvedNewProps && oldState === newState && !hasContextChanged() && !checkHasForceUpdateAfterProcessing()) {
    // If an update was already in progress, we should schedule an Update
    // effect even though we're bailing out, so that cWU/cDU are called.
    if (typeof instance.componentDidUpdate === 'function') {
      if (unresolvedOldProps !== current.memoizedProps || oldState !== current.memoizedState) {
        workInProgress.flags |= Update;
      }
    }

    if (typeof instance.getSnapshotBeforeUpdate === 'function') {
      if (unresolvedOldProps !== current.memoizedProps || oldState !== current.memoizedState) {
        workInProgress.flags |= Snapshot;
      }
    }

    return false;
  }

  if (typeof getDerivedStateFromProps === 'function') {
    applyDerivedStateFromProps(workInProgress, ctor, getDerivedStateFromProps, newProps);
    newState = workInProgress.memoizedState;
  }

  const shouldUpdate = checkHasForceUpdateAfterProcessing() || checkShouldComponentUpdate(workInProgress, ctor, oldProps, newProps, oldState, newState, nextContext);

  if (shouldUpdate) {
    // In order to support react-lifecycles-compat polyfilled components,
    // Unsafe lifecycles should not be invoked for components using the new APIs.
    if (!hasNewLifecycles && (typeof instance.UNSAFE_componentWillUpdate === 'function' || typeof instance.componentWillUpdate === 'function')) {
      if (typeof instance.componentWillUpdate === 'function') {
        instance.componentWillUpdate(newProps, newState, nextContext);
      }

      if (typeof instance.UNSAFE_componentWillUpdate === 'function') {
        instance.UNSAFE_componentWillUpdate(newProps, newState, nextContext);
      }
    }

    if (typeof instance.componentDidUpdate === 'function') {
      workInProgress.flags |= Update;
    }

    if (typeof instance.getSnapshotBeforeUpdate === 'function') {
      workInProgress.flags |= Snapshot;
    }
  } else {
    // If an update was already in progress, we should schedule an Update
    // effect even though we're bailing out, so that cWU/cDU are called.
    if (typeof instance.componentDidUpdate === 'function') {
      if (unresolvedOldProps !== current.memoizedProps || oldState !== current.memoizedState) {
        workInProgress.flags |= Update;
      }
    }

    if (typeof instance.getSnapshotBeforeUpdate === 'function') {
      if (unresolvedOldProps !== current.memoizedProps || oldState !== current.memoizedState) {
        workInProgress.flags |= Snapshot;
      }
    } // If shouldComponentUpdate returned false, we should still update the
    // memoized props/state to indicate that this work can be reused.


    workInProgress.memoizedProps = newProps;
    workInProgress.memoizedState = newState;
  } // Update the existing instance's state, props, and context pointers even
  // if shouldComponentUpdate returns false.


  instance.props = newProps;
  instance.state = newState;
  instance.context = nextContext;
  return shouldUpdate;
}

const isArray = Array.isArray;

function coerceRef(returnFiber, current, element) {
  const mixedRef = element.ref;

  if (mixedRef !== null && typeof mixedRef !== 'function' && typeof mixedRef !== 'object') {

    if (element._owner) {
      const owner = element._owner;
      let inst;

      if (owner) {
        const ownerFiber = owner;

        if (!(ownerFiber.tag === ClassComponent)) {
          {
            throw Error( formatProdErrorMessage(309));
          }
        }

        inst = ownerFiber.stateNode;
      }

      if (!inst) {
        {
          throw Error( formatProdErrorMessage(147, mixedRef));
        }
      }

      const stringRef = '' + mixedRef; // Check if previous string ref matches new string ref

      if (current !== null && current.ref !== null && typeof current.ref === 'function' && current.ref._stringRef === stringRef) {
        return current.ref;
      }

      const ref = function (value) {
        let refs = inst.refs;

        if (refs === emptyRefsObject) {
          // This is a lazy pooled frozen object, so we need to initialize.
          refs = inst.refs = {};
        }

        if (value === null) {
          delete refs[stringRef];
        } else {
          refs[stringRef] = value;
        }
      };

      ref._stringRef = stringRef;
      return ref;
    } else {
      if (!(typeof mixedRef === 'string')) {
        {
          throw Error( formatProdErrorMessage(284));
        }
      }

      if (!element._owner) {
        {
          throw Error( formatProdErrorMessage(290, mixedRef));
        }
      }
    }
  }

  return mixedRef;
}

function throwOnInvalidObjectType(returnFiber, newChild) {
  if (returnFiber.type !== 'textarea') {
    {
      {
        throw Error( formatProdErrorMessage(31, Object.prototype.toString.call(newChild) === '[object Object]' ? 'object with keys {' + Object.keys(newChild).join(', ') + '}' : newChild));
      }
    }
  }
}

/** @noinline */


function resolveLazyType(lazyComponent) {
  try {
    // If we can, let's peek at the resulting type.
    const payload = lazyComponent._payload;
    const init = lazyComponent._init;
    return init(payload);
  } catch (x) {
    // Leave it in place and let it throw again in the begin phase.
    return lazyComponent;
  }
} // This wrapper function exists because I expect to clone the code in each path
// to be able to optimize each path individually by branching early. This needs
// a compiler or we can do it manually. Helpers that don't need this branching
// live outside of this function.


function ChildReconciler(shouldTrackSideEffects) {
  function deleteChild(returnFiber, childToDelete) {
    if (!shouldTrackSideEffects) {
      // Noop.
      return;
    } // Deletions are added in reversed order so we add it to the front.
    // At this point, the return fiber's effect list is empty except for
    // deletions, so we can just append the deletion to the list. The remaining
    // effects aren't added until the complete phase. Once we implement
    // resuming, this may not be true.


    const last = returnFiber.lastEffect;

    if (last !== null) {
      last.nextEffect = childToDelete;
      returnFiber.lastEffect = childToDelete;
    } else {
      returnFiber.firstEffect = returnFiber.lastEffect = childToDelete;
    }

    childToDelete.nextEffect = null;
    childToDelete.flags = Deletion;
  }

  function deleteRemainingChildren(returnFiber, currentFirstChild) {
    if (!shouldTrackSideEffects) {
      // Noop.
      return null;
    } // TODO: For the shouldClone case, this could be micro-optimized a bit by
    // assuming that after the first child we've already added everything.


    let childToDelete = currentFirstChild;

    while (childToDelete !== null) {
      deleteChild(returnFiber, childToDelete);
      childToDelete = childToDelete.sibling;
    }

    return null;
  }

  function mapRemainingChildren(returnFiber, currentFirstChild) {
    // Add the remaining children to a temporary map so that we can find them by
    // keys quickly. Implicit (null) keys get added to this set with their index
    // instead.
    const existingChildren = new Map();
    let existingChild = currentFirstChild;

    while (existingChild !== null) {
      if (existingChild.key !== null) {
        existingChildren.set(existingChild.key, existingChild);
      } else {
        existingChildren.set(existingChild.index, existingChild);
      }

      existingChild = existingChild.sibling;
    }

    return existingChildren;
  }

  function useFiber(fiber, pendingProps) {
    // We currently set sibling to null and index to 0 here because it is easy
    // to forget to do before returning it. E.g. for the single child case.
    const clone = createWorkInProgress(fiber, pendingProps);
    clone.index = 0;
    clone.sibling = null;
    return clone;
  }

  function placeChild(newFiber, lastPlacedIndex, newIndex) {
    newFiber.index = newIndex;

    if (!shouldTrackSideEffects) {
      // Noop.
      return lastPlacedIndex;
    }

    const current = newFiber.alternate;

    if (current !== null) {
      const oldIndex = current.index;

      if (oldIndex < lastPlacedIndex) {
        // This is a move.
        newFiber.flags = Placement;
        return lastPlacedIndex;
      } else {
        // This item can stay in place.
        return oldIndex;
      }
    } else {
      // This is an insertion.
      newFiber.flags = Placement;
      return lastPlacedIndex;
    }
  }

  function placeSingleChild(newFiber) {
    // This is simpler for the single child case. We only need to do a
    // placement for inserting new children.
    if (shouldTrackSideEffects && newFiber.alternate === null) {
      newFiber.flags = Placement;
    }

    return newFiber;
  }

  function updateTextNode(returnFiber, current, textContent, lanes) {
    if (current === null || current.tag !== HostText) {
      // Insert
      const created = createFiberFromText(textContent, returnFiber.mode, lanes);
      created.return = returnFiber;
      return created;
    } else {
      // Update
      const existing = useFiber(current, textContent);
      existing.return = returnFiber;
      return existing;
    }
  }

  function updateElement(returnFiber, current, element, lanes) {
    if (current !== null) {
      if (current.elementType === element.type || ( // Keep this check inline so it only runs on the false path:
       false)) {
        // Move based on index
        const existing = useFiber(current, element.props);
        existing.ref = coerceRef(returnFiber, current, element);
        existing.return = returnFiber;

        return existing;
      } else if ( current.tag === Block) {
        // The new Block might not be initialized yet. We need to initialize
        // it in case initializing it turns out it would match.
        let type = element.type;

        if (type.$$typeof === REACT_LAZY_TYPE) {
          type = resolveLazyType(type);
        }

        if (type.$$typeof === REACT_BLOCK_TYPE && type._render === current.type._render) {
          // Same as above but also update the .type field.
          const existing = useFiber(current, element.props);
          existing.return = returnFiber;
          existing.type = type;

          return existing;
        }
      }
    } // Insert


    const created = createFiberFromElement(element, returnFiber.mode, lanes);
    created.ref = coerceRef(returnFiber, current, element);
    created.return = returnFiber;
    return created;
  }

  function updatePortal(returnFiber, current, portal, lanes) {
    if (current === null || current.tag !== HostPortal || current.stateNode.containerInfo !== portal.containerInfo || current.stateNode.implementation !== portal.implementation) {
      // Insert
      const created = createFiberFromPortal(portal, returnFiber.mode, lanes);
      created.return = returnFiber;
      return created;
    } else {
      // Update
      const existing = useFiber(current, portal.children || []);
      existing.return = returnFiber;
      return existing;
    }
  }

  function updateFragment(returnFiber, current, fragment, lanes, key) {
    if (current === null || current.tag !== Fragment) {
      // Insert
      const created = createFiberFromFragment(fragment, returnFiber.mode, lanes, key);
      created.return = returnFiber;
      return created;
    } else {
      // Update
      const existing = useFiber(current, fragment);
      existing.return = returnFiber;
      return existing;
    }
  }

  function createChild(returnFiber, newChild, lanes) {
    if (typeof newChild === 'string' || typeof newChild === 'number') {
      // Text nodes don't have keys. If the previous node is implicitly keyed
      // we can continue to replace it without aborting even if it is not a text
      // node.
      const created = createFiberFromText('' + newChild, returnFiber.mode, lanes);
      created.return = returnFiber;
      return created;
    }

    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          {
            const created = createFiberFromElement(newChild, returnFiber.mode, lanes);
            created.ref = coerceRef(returnFiber, null, newChild);
            created.return = returnFiber;
            return created;
          }

        case REACT_PORTAL_TYPE:
          {
            const created = createFiberFromPortal(newChild, returnFiber.mode, lanes);
            created.return = returnFiber;
            return created;
          }

        case REACT_LAZY_TYPE:
          {
            {
              const payload = newChild._payload;
              const init = newChild._init;
              return createChild(returnFiber, init(payload), lanes);
            }
          }
      }

      if (isArray(newChild) || getIteratorFn(newChild)) {
        const created = createFiberFromFragment(newChild, returnFiber.mode, lanes, null);
        created.return = returnFiber;
        return created;
      }

      throwOnInvalidObjectType(returnFiber, newChild);
    }

    return null;
  }

  function updateSlot(returnFiber, oldFiber, newChild, lanes) {
    // Update the fiber if the keys match, otherwise return null.
    const key = oldFiber !== null ? oldFiber.key : null;

    if (typeof newChild === 'string' || typeof newChild === 'number') {
      // Text nodes don't have keys. If the previous node is implicitly keyed
      // we can continue to replace it without aborting even if it is not a text
      // node.
      if (key !== null) {
        return null;
      }

      return updateTextNode(returnFiber, oldFiber, '' + newChild, lanes);
    }

    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          {
            if (newChild.key === key) {
              if (newChild.type === REACT_FRAGMENT_TYPE) {
                return updateFragment(returnFiber, oldFiber, newChild.props.children, lanes, key);
              }

              return updateElement(returnFiber, oldFiber, newChild, lanes);
            } else {
              return null;
            }
          }

        case REACT_PORTAL_TYPE:
          {
            if (newChild.key === key) {
              return updatePortal(returnFiber, oldFiber, newChild, lanes);
            } else {
              return null;
            }
          }

        case REACT_LAZY_TYPE:
          {
            {
              const payload = newChild._payload;
              const init = newChild._init;
              return updateSlot(returnFiber, oldFiber, init(payload), lanes);
            }
          }
      }

      if (isArray(newChild) || getIteratorFn(newChild)) {
        if (key !== null) {
          return null;
        }

        return updateFragment(returnFiber, oldFiber, newChild, lanes, null);
      }

      throwOnInvalidObjectType(returnFiber, newChild);
    }

    return null;
  }

  function updateFromMap(existingChildren, returnFiber, newIdx, newChild, lanes) {
    if (typeof newChild === 'string' || typeof newChild === 'number') {
      // Text nodes don't have keys, so we neither have to check the old nor
      // new node for the key. If both are text nodes, they match.
      const matchedFiber = existingChildren.get(newIdx) || null;
      return updateTextNode(returnFiber, matchedFiber, '' + newChild, lanes);
    }

    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          {
            const matchedFiber = existingChildren.get(newChild.key === null ? newIdx : newChild.key) || null;

            if (newChild.type === REACT_FRAGMENT_TYPE) {
              return updateFragment(returnFiber, matchedFiber, newChild.props.children, lanes, newChild.key);
            }

            return updateElement(returnFiber, matchedFiber, newChild, lanes);
          }

        case REACT_PORTAL_TYPE:
          {
            const matchedFiber = existingChildren.get(newChild.key === null ? newIdx : newChild.key) || null;
            return updatePortal(returnFiber, matchedFiber, newChild, lanes);
          }

        case REACT_LAZY_TYPE:
          {
            const payload = newChild._payload;
            const init = newChild._init;
            return updateFromMap(existingChildren, returnFiber, newIdx, init(payload), lanes);
          }

      }

      if (isArray(newChild) || getIteratorFn(newChild)) {
        const matchedFiber = existingChildren.get(newIdx) || null;
        return updateFragment(returnFiber, matchedFiber, newChild, lanes, null);
      }

      throwOnInvalidObjectType(returnFiber, newChild);
    }

    return null;
  }

  function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, lanes) {

    let resultingFirstChild = null;
    let previousNewFiber = null;
    let oldFiber = currentFirstChild;
    let lastPlacedIndex = 0;
    let newIdx = 0;
    let nextOldFiber = null;

    for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
      if (oldFiber.index > newIdx) {
        nextOldFiber = oldFiber;
        oldFiber = null;
      } else {
        nextOldFiber = oldFiber.sibling;
      }

      const newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx], lanes);

      if (newFiber === null) {
        // TODO: This breaks on empty slots like null children. That's
        // unfortunate because it triggers the slow path all the time. We need
        // a better way to communicate whether this was a miss or null,
        // boolean, undefined, etc.
        if (oldFiber === null) {
          oldFiber = nextOldFiber;
        }

        break;
      }

      if (shouldTrackSideEffects) {
        if (oldFiber && newFiber.alternate === null) {
          // We matched the slot, but we didn't reuse the existing fiber, so we
          // need to delete the existing child.
          deleteChild(returnFiber, oldFiber);
        }
      }

      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);

      if (previousNewFiber === null) {
        // TODO: Move out of the loop. This only happens for the first run.
        resultingFirstChild = newFiber;
      } else {
        // TODO: Defer siblings if we're not at the right index for this slot.
        // I.e. if we had null values before, then we want to defer this
        // for each null value. However, we also don't want to call updateSlot
        // with the previous one.
        previousNewFiber.sibling = newFiber;
      }

      previousNewFiber = newFiber;
      oldFiber = nextOldFiber;
    }

    if (newIdx === newChildren.length) {
      // We've reached the end of the new children. We can delete the rest.
      deleteRemainingChildren(returnFiber, oldFiber);
      return resultingFirstChild;
    }

    if (oldFiber === null) {
      // If we don't have any more existing children we can choose a fast path
      // since the rest will all be insertions.
      for (; newIdx < newChildren.length; newIdx++) {
        const newFiber = createChild(returnFiber, newChildren[newIdx], lanes);

        if (newFiber === null) {
          continue;
        }

        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);

        if (previousNewFiber === null) {
          // TODO: Move out of the loop. This only happens for the first run.
          resultingFirstChild = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }

        previousNewFiber = newFiber;
      }

      return resultingFirstChild;
    } // Add all children to a key map for quick lookups.


    const existingChildren = mapRemainingChildren(returnFiber, oldFiber); // Keep scanning and use the map to restore deleted items as moves.

    for (; newIdx < newChildren.length; newIdx++) {
      const newFiber = updateFromMap(existingChildren, returnFiber, newIdx, newChildren[newIdx], lanes);

      if (newFiber !== null) {
        if (shouldTrackSideEffects) {
          if (newFiber.alternate !== null) {
            // The new fiber is a work in progress, but if there exists a
            // current, that means that we reused the fiber. We need to delete
            // it from the child list so that we don't add it to the deletion
            // list.
            existingChildren.delete(newFiber.key === null ? newIdx : newFiber.key);
          }
        }

        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);

        if (previousNewFiber === null) {
          resultingFirstChild = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }

        previousNewFiber = newFiber;
      }
    }

    if (shouldTrackSideEffects) {
      // Any existing children that weren't consumed above were deleted. We need
      // to add them to the deletion list.
      existingChildren.forEach(child => deleteChild(returnFiber, child));
    }

    return resultingFirstChild;
  }

  function reconcileChildrenIterator(returnFiber, currentFirstChild, newChildrenIterable, lanes) {
    // This is the same implementation as reconcileChildrenArray(),
    // but using the iterator instead.
    const iteratorFn = getIteratorFn(newChildrenIterable);

    if (!(typeof iteratorFn === 'function')) {
      {
        throw Error( formatProdErrorMessage(150));
      }
    }

    const newChildren = iteratorFn.call(newChildrenIterable);

    if (!(newChildren != null)) {
      {
        throw Error( formatProdErrorMessage(151));
      }
    }

    let resultingFirstChild = null;
    let previousNewFiber = null;
    let oldFiber = currentFirstChild;
    let lastPlacedIndex = 0;
    let newIdx = 0;
    let nextOldFiber = null;
    let step = newChildren.next();

    for (; oldFiber !== null && !step.done; newIdx++, step = newChildren.next()) {
      if (oldFiber.index > newIdx) {
        nextOldFiber = oldFiber;
        oldFiber = null;
      } else {
        nextOldFiber = oldFiber.sibling;
      }

      const newFiber = updateSlot(returnFiber, oldFiber, step.value, lanes);

      if (newFiber === null) {
        // TODO: This breaks on empty slots like null children. That's
        // unfortunate because it triggers the slow path all the time. We need
        // a better way to communicate whether this was a miss or null,
        // boolean, undefined, etc.
        if (oldFiber === null) {
          oldFiber = nextOldFiber;
        }

        break;
      }

      if (shouldTrackSideEffects) {
        if (oldFiber && newFiber.alternate === null) {
          // We matched the slot, but we didn't reuse the existing fiber, so we
          // need to delete the existing child.
          deleteChild(returnFiber, oldFiber);
        }
      }

      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);

      if (previousNewFiber === null) {
        // TODO: Move out of the loop. This only happens for the first run.
        resultingFirstChild = newFiber;
      } else {
        // TODO: Defer siblings if we're not at the right index for this slot.
        // I.e. if we had null values before, then we want to defer this
        // for each null value. However, we also don't want to call updateSlot
        // with the previous one.
        previousNewFiber.sibling = newFiber;
      }

      previousNewFiber = newFiber;
      oldFiber = nextOldFiber;
    }

    if (step.done) {
      // We've reached the end of the new children. We can delete the rest.
      deleteRemainingChildren(returnFiber, oldFiber);
      return resultingFirstChild;
    }

    if (oldFiber === null) {
      // If we don't have any more existing children we can choose a fast path
      // since the rest will all be insertions.
      for (; !step.done; newIdx++, step = newChildren.next()) {
        const newFiber = createChild(returnFiber, step.value, lanes);

        if (newFiber === null) {
          continue;
        }

        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);

        if (previousNewFiber === null) {
          // TODO: Move out of the loop. This only happens for the first run.
          resultingFirstChild = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }

        previousNewFiber = newFiber;
      }

      return resultingFirstChild;
    } // Add all children to a key map for quick lookups.


    const existingChildren = mapRemainingChildren(returnFiber, oldFiber); // Keep scanning and use the map to restore deleted items as moves.

    for (; !step.done; newIdx++, step = newChildren.next()) {
      const newFiber = updateFromMap(existingChildren, returnFiber, newIdx, step.value, lanes);

      if (newFiber !== null) {
        if (shouldTrackSideEffects) {
          if (newFiber.alternate !== null) {
            // The new fiber is a work in progress, but if there exists a
            // current, that means that we reused the fiber. We need to delete
            // it from the child list so that we don't add it to the deletion
            // list.
            existingChildren.delete(newFiber.key === null ? newIdx : newFiber.key);
          }
        }

        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);

        if (previousNewFiber === null) {
          resultingFirstChild = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }

        previousNewFiber = newFiber;
      }
    }

    if (shouldTrackSideEffects) {
      // Any existing children that weren't consumed above were deleted. We need
      // to add them to the deletion list.
      existingChildren.forEach(child => deleteChild(returnFiber, child));
    }

    return resultingFirstChild;
  }

  function reconcileSingleTextNode(returnFiber, currentFirstChild, textContent, lanes) {
    // There's no need to check for keys on text nodes since we don't have a
    // way to define them.
    if (currentFirstChild !== null && currentFirstChild.tag === HostText) {
      // We already have an existing node so let's just update it and delete
      // the rest.
      deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
      const existing = useFiber(currentFirstChild, textContent);
      existing.return = returnFiber;
      return existing;
    } // The existing first child is not a text node so we need to create one
    // and delete the existing ones.


    deleteRemainingChildren(returnFiber, currentFirstChild);
    const created = createFiberFromText(textContent, returnFiber.mode, lanes);
    created.return = returnFiber;
    return created;
  }

  function reconcileSingleElement(returnFiber, currentFirstChild, element, lanes) {
    const key = element.key;
    let child = currentFirstChild;

    while (child !== null) {
      // TODO: If key === null and child.key === null, then this only applies to
      // the first item in the list.
      if (child.key === key) {
        switch (child.tag) {
          case Fragment:
            {
              if (element.type === REACT_FRAGMENT_TYPE) {
                deleteRemainingChildren(returnFiber, child.sibling);
                const existing = useFiber(child, element.props.children);
                existing.return = returnFiber;

                return existing;
              }

              break;
            }

          case Block:
            {
              let type = element.type;

              if (type.$$typeof === REACT_LAZY_TYPE) {
                type = resolveLazyType(type);
              }

              if (type.$$typeof === REACT_BLOCK_TYPE) {
                // The new Block might not be initialized yet. We need to initialize
                // it in case initializing it turns out it would match.
                if (type._render === child.type._render) {
                  deleteRemainingChildren(returnFiber, child.sibling);
                  const existing = useFiber(child, element.props);
                  existing.type = type;
                  existing.return = returnFiber;

                  return existing;
                }
              }
            }

          // We intentionally fallthrough here if enableBlocksAPI is not on.
          // eslint-disable-next-lined no-fallthrough

          default:
            {
              if (child.elementType === element.type || ( // Keep this check inline so it only runs on the false path:
               false)) {
                deleteRemainingChildren(returnFiber, child.sibling);
                const existing = useFiber(child, element.props);
                existing.ref = coerceRef(returnFiber, child, element);
                existing.return = returnFiber;

                return existing;
              }

              break;
            }
        } // Didn't match.


        deleteRemainingChildren(returnFiber, child);
        break;
      } else {
        deleteChild(returnFiber, child);
      }

      child = child.sibling;
    }

    if (element.type === REACT_FRAGMENT_TYPE) {
      const created = createFiberFromFragment(element.props.children, returnFiber.mode, lanes, element.key);
      created.return = returnFiber;
      return created;
    } else {
      const created = createFiberFromElement(element, returnFiber.mode, lanes);
      created.ref = coerceRef(returnFiber, currentFirstChild, element);
      created.return = returnFiber;
      return created;
    }
  }

  function reconcileSinglePortal(returnFiber, currentFirstChild, portal, lanes) {
    const key = portal.key;
    let child = currentFirstChild;

    while (child !== null) {
      // TODO: If key === null and child.key === null, then this only applies to
      // the first item in the list.
      if (child.key === key) {
        if (child.tag === HostPortal && child.stateNode.containerInfo === portal.containerInfo && child.stateNode.implementation === portal.implementation) {
          deleteRemainingChildren(returnFiber, child.sibling);
          const existing = useFiber(child, portal.children || []);
          existing.return = returnFiber;
          return existing;
        } else {
          deleteRemainingChildren(returnFiber, child);
          break;
        }
      } else {
        deleteChild(returnFiber, child);
      }

      child = child.sibling;
    }

    const created = createFiberFromPortal(portal, returnFiber.mode, lanes);
    created.return = returnFiber;
    return created;
  } // This API will tag the children with the side-effect of the reconciliation
  // itself. They will be added to the side-effect list as we pass through the
  // children and the parent.


  function reconcileChildFibers(returnFiber, currentFirstChild, newChild, lanes) {
    // This function is not recursive.
    // If the top level item is an array, we treat it as a set of children,
    // not as a fragment. Nested arrays on the other hand will be treated as
    // fragment nodes. Recursion happens at the normal flow.
    // Handle top level unkeyed fragments as if they were arrays.
    // This leads to an ambiguity between <>{[...]}</> and <>...</>.
    // We treat the ambiguous cases above the same.
    const isUnkeyedTopLevelFragment = typeof newChild === 'object' && newChild !== null && newChild.type === REACT_FRAGMENT_TYPE && newChild.key === null;

    if (isUnkeyedTopLevelFragment) {
      newChild = newChild.props.children;
    } // Handle object types


    const isObject = typeof newChild === 'object' && newChild !== null;

    if (isObject) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(reconcileSingleElement(returnFiber, currentFirstChild, newChild, lanes));

        case REACT_PORTAL_TYPE:
          return placeSingleChild(reconcileSinglePortal(returnFiber, currentFirstChild, newChild, lanes));

        case REACT_LAZY_TYPE:
          {
            const payload = newChild._payload;
            const init = newChild._init; // TODO: This function is supposed to be non-recursive.

            return reconcileChildFibers(returnFiber, currentFirstChild, init(payload), lanes);
          }

      }
    }

    if (typeof newChild === 'string' || typeof newChild === 'number') {
      return placeSingleChild(reconcileSingleTextNode(returnFiber, currentFirstChild, '' + newChild, lanes));
    }

    if (isArray(newChild)) {
      return reconcileChildrenArray(returnFiber, currentFirstChild, newChild, lanes);
    }

    if (getIteratorFn(newChild)) {
      return reconcileChildrenIterator(returnFiber, currentFirstChild, newChild, lanes);
    }

    if (isObject) {
      throwOnInvalidObjectType(returnFiber, newChild);
    }

    if (typeof newChild === 'undefined' && !isUnkeyedTopLevelFragment) {
      // If the new child is undefined, and the return fiber is a composite
      // component, throw an error. If Fiber return types are disabled,
      // we already threw above.
      switch (returnFiber.tag) {
        case ClassComponent:
        // Intentionally fall through to the next case, which handles both
        // functions and classes
        // eslint-disable-next-lined no-fallthrough

        case Block:
        case FunctionComponent:
        case ForwardRef:
        case SimpleMemoComponent:
          {
            {
              {
                throw Error( formatProdErrorMessage(152, getComponentName(returnFiber.type) || 'Component'));
              }
            }
          }
      }
    } // Remaining cases are all treated as empty.


    return deleteRemainingChildren(returnFiber, currentFirstChild);
  }

  return reconcileChildFibers;
}

const reconcileChildFibers = ChildReconciler(true);
const mountChildFibers = ChildReconciler(false);
function cloneChildFibers(current, workInProgress) {
  if (!(current === null || workInProgress.child === current.child)) {
    {
      throw Error( formatProdErrorMessage(153));
    }
  }

  if (workInProgress.child === null) {
    return;
  }

  let currentChild = workInProgress.child;
  let newChild = createWorkInProgress(currentChild, currentChild.pendingProps);
  workInProgress.child = newChild;
  newChild.return = workInProgress;

  while (currentChild.sibling !== null) {
    currentChild = currentChild.sibling;
    newChild = newChild.sibling = createWorkInProgress(currentChild, currentChild.pendingProps);
    newChild.return = workInProgress;
  }

  newChild.sibling = null;
} // Reset a workInProgress child set to prepare it for a second pass.

function resetChildFibers(workInProgress, lanes) {
  let child = workInProgress.child;

  while (child !== null) {
    resetWorkInProgress(child, lanes);
    child = child.sibling;
  }
}

const NO_CONTEXT$1 = {};
const contextStackCursor = createCursor(NO_CONTEXT$1);
const contextFiberStackCursor = createCursor(NO_CONTEXT$1);
const rootInstanceStackCursor = createCursor(NO_CONTEXT$1);

function requiredContext(c) {
  if (!(c !== NO_CONTEXT$1)) {
    {
      throw Error( formatProdErrorMessage(174));
    }
  }

  return c;
}

function getRootHostContainer() {
  const rootInstance = requiredContext(rootInstanceStackCursor.current);
  return rootInstance;
}

function pushHostContainer(fiber, nextRootInstance) {
  // Push current root instance onto the stack;
  // This allows us to reset root when portals are popped.
  push(rootInstanceStackCursor, nextRootInstance); // Track the context and the Fiber that provided it.
  // This enables us to pop only Fibers that provide unique contexts.

  push(contextFiberStackCursor, fiber); // Finally, we need to push the host context to the stack.
  // However, we can't just call getRootHostContext() and push it because
  // we'd have a different number of entries on the stack depending on
  // whether getRootHostContext() throws somewhere in renderer code or not.
  // So we push an empty value first. This lets us safely unwind on errors.

  push(contextStackCursor, NO_CONTEXT$1);
  const nextRootContext = getRootHostContext(); // Now that we know this function doesn't throw, replace it.

  pop(contextStackCursor);
  push(contextStackCursor, nextRootContext);
}

function popHostContainer(fiber) {
  pop(contextStackCursor);
  pop(contextFiberStackCursor);
  pop(rootInstanceStackCursor);
}

function getHostContext() {
  const context = requiredContext(contextStackCursor.current);
  return context;
}

function pushHostContext(fiber) {
  const rootInstance = requiredContext(rootInstanceStackCursor.current);
  const context = requiredContext(contextStackCursor.current);
  const nextContext = getChildHostContext(context, fiber.type); // Don't push this Fiber's context unless it's unique.

  if (context === nextContext) {
    return;
  } // Track the context and the Fiber that provided it.
  // This enables us to pop only Fibers that provide unique contexts.


  push(contextFiberStackCursor, fiber);
  push(contextStackCursor, nextContext);
}

function popHostContext(fiber) {
  // Do not pop unless this Fiber provided the current context.
  // pushHostContext() only pushes Fibers that provide unique contexts.
  if (contextFiberStackCursor.current !== fiber) {
    return;
  }

  pop(contextStackCursor);
  pop(contextFiberStackCursor);
}

const DefaultSuspenseContext = 0b00; // The Suspense Context is split into two parts. The lower bits is
// inherited deeply down the subtree. The upper bits only affect
// this immediate suspense boundary and gets reset each new
// boundary or suspense list.

const SubtreeSuspenseContextMask = 0b01; // Subtree Flags:
// InvisibleParentSuspenseContext indicates that one of our parent Suspense
// boundaries is not currently showing visible main content.
// Either because it is already showing a fallback or is not mounted at all.
// We can use this to determine if it is desirable to trigger a fallback at
// the parent. If not, then we might need to trigger undesirable boundaries
// and/or suspend the commit to avoid hiding the parent content.

const InvisibleParentSuspenseContext = 0b01; // Shallow Flags:
// ForceSuspenseFallback can be used by SuspenseList to force newly added
// items into their fallback state during one of the render passes.

const ForceSuspenseFallback = 0b10;
const suspenseStackCursor = createCursor(DefaultSuspenseContext);
function hasSuspenseContext(parentContext, flag) {
  return (parentContext & flag) !== 0;
}
function setDefaultShallowSuspenseContext(parentContext) {
  return parentContext & SubtreeSuspenseContextMask;
}
function setShallowSuspenseContext(parentContext, shallowContext) {
  return parentContext & SubtreeSuspenseContextMask | shallowContext;
}
function addSubtreeSuspenseContext(parentContext, subtreeContext) {
  return parentContext | subtreeContext;
}
function pushSuspenseContext(fiber, newContext) {
  push(suspenseStackCursor, newContext);
}
function popSuspenseContext(fiber) {
  pop(suspenseStackCursor);
}

function shouldCaptureSuspense(workInProgress, hasInvisibleParent) {
  // If it was the primary children that just suspended, capture and render the
  // fallback. Otherwise, don't capture and bubble to the next boundary.
  const nextState = workInProgress.memoizedState;

  if (nextState !== null) {
    if (nextState.dehydrated !== null) {
      // A dehydrated boundary always captures.
      return true;
    }

    return false;
  }

  const props = workInProgress.memoizedProps; // In order to capture, the Suspense component must have a fallback prop.

  if (props.fallback === undefined) {
    return false;
  } // Regular boundaries always capture.


  if (props.unstable_avoidThisFallback !== true) {
    return true;
  } // If it's a boundary we should avoid, then we prefer to bubble up to the
  // parent boundary if it is currently invisible.


  if (hasInvisibleParent) {
    return false;
  } // If the parent is not able to handle it, we must handle it.


  return true;
}
function findFirstSuspended(row) {
  let node = row;

  while (node !== null) {
    if (node.tag === SuspenseComponent) {
      const state = node.memoizedState;

      if (state !== null) {
        const dehydrated = state.dehydrated;

        if (dehydrated === null || isSuspenseInstancePending() || isSuspenseInstanceFallback()) {
          return node;
        }
      }
    } else if (node.tag === SuspenseListComponent && // revealOrder undefined can't be trusted because it don't
    // keep track of whether it suspended or not.
    node.memoizedProps.revealOrder !== undefined) {
      const didSuspend = (node.flags & DidCapture) !== NoFlags;

      if (didSuspend) {
        return node;
      }
    } else if (node.child !== null) {
      node.child.return = node;
      node = node.child;
      continue;
    }

    if (node === row) {
      return null;
    }

    while (node.sibling === null) {
      if (node.return === null || node.return === row) {
        return null;
      }

      node = node.return;
    }

    node.sibling.return = node.return;
    node = node.sibling;
  }

  return null;
}

const NoFlags$1 =
/*  */
0b000; // Represents whether effect should fire.

const HasEffect =
/* */
0b001; // Represents the phase in which the effect (not the clean-up) fires.

const Layout =
/*    */
0b010;
const Passive$1 =
/*   */
0b100;

let isHydrating = false;

function enterHydrationState(fiber) {
  {
    return false;
  }
}

function prepareToHydrateHostInstance(fiber, rootContainerInstance, hostContext) {
  {
    {
      {
        throw Error( formatProdErrorMessage(175));
      }
    }
  }
}

function prepareToHydrateHostTextInstance(fiber) {
  {
    {
      {
        throw Error( formatProdErrorMessage(176));
      }
    }
  }
  const shouldUpdate = hydrateTextInstance();
}

function prepareToHydrateHostSuspenseInstance(fiber) {
  {
    {
      {
        throw Error( formatProdErrorMessage(344));
      }
    }
  }
}

function popHydrationState(fiber) {
  {
    return false;
  }
}

function getIsHydrating() {
  return isHydrating;
}

// and should be reset before starting a new render.
// This tracks which mutable sources need to be reset after a render.

const workInProgressSources = [];

function markSourceAsDirty(mutableSource) {
  workInProgressSources.push(mutableSource);
}
function resetWorkInProgressVersions() {
  for (let i = 0; i < workInProgressSources.length; i++) {
    const mutableSource = workInProgressSources[i];

    {
      mutableSource._workInProgressVersionSecondary = null;
    }
  }

  workInProgressSources.length = 0;
}
function getWorkInProgressVersion(mutableSource) {
  {
    return mutableSource._workInProgressVersionSecondary;
  }
}
function setWorkInProgressVersion(mutableSource, version) {
  {
    mutableSource._workInProgressVersionSecondary = version;
  }

  workInProgressSources.push(mutableSource);
}

const ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher,
      ReactCurrentBatchConfig$1 = ReactSharedInternals.ReactCurrentBatchConfig;

// These are set right before calling the component.
let renderLanes = NoLanes; // The work-in-progress fiber. I've named it differently to distinguish it from
// the work-in-progress hook.

let currentlyRenderingFiber$1 = null; // Hooks are stored as a linked list on the fiber's memoizedState field. The
// current hook list is the list that belongs to the current fiber. The
// work-in-progress hook list is a new list that will be added to the
// work-in-progress fiber.

let currentHook = null;
let workInProgressHook = null; // Whether an update was scheduled at any point during the render phase. This
// does not get reset if we do another render pass; only when we're completely
// finished evaluating this component. This is an optimization so we know
// whether we need to clear render phase updates after a throw.

let didScheduleRenderPhaseUpdate = false; // Where an update was scheduled only during the current render pass. This
// gets reset after each attempt.
// TODO: Maybe there's some way to consolidate this with
// `didScheduleRenderPhaseUpdate`. Or with `numberOfReRenders`.

let didScheduleRenderPhaseUpdateDuringThisPass = false;
const RE_RENDER_LIMIT = 25; // In DEV, this is the name of the currently executing primitive hook

function throwInvalidHookError() {
  {
    {
      throw Error( formatProdErrorMessage(321));
    }
  }
}

function areHookInputsEqual(nextDeps, prevDeps) {

  if (prevDeps === null) {

    return false;
  }

  for (let i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
    if (objectIs(nextDeps[i], prevDeps[i])) {
      continue;
    }

    return false;
  }

  return true;
}

function renderWithHooks(current, workInProgress, Component, props, secondArg, nextRenderLanes) {
  renderLanes = nextRenderLanes;
  currentlyRenderingFiber$1 = workInProgress;

  workInProgress.memoizedState = null;
  workInProgress.updateQueue = null;
  workInProgress.lanes = NoLanes; // The following should have already been reset
  // currentHook = null;
  // workInProgressHook = null;
  // didScheduleRenderPhaseUpdate = false;
  // TODO Warn if no hooks are used at all during mount, then some are used during update.
  // Currently we will identify the update render as a mount because memoizedState === null.
  // This is tricky because it's valid for certain types of components (e.g. React.lazy)
  // Using memoizedState to differentiate between mount/update only works if at least one stateful hook is used.
  // Non-stateful hooks (e.g. context) don't get added to memoizedState,
  // so memoizedState would be null during updates and mounts.

  {
    ReactCurrentDispatcher$1.current = current === null || current.memoizedState === null ? HooksDispatcherOnMount : HooksDispatcherOnUpdate;
  }

  let children = Component(props, secondArg); // Check if there was a render phase update

  if (didScheduleRenderPhaseUpdateDuringThisPass) {
    // Keep rendering in a loop for as long as render phase updates continue to
    // be scheduled. Use a counter to prevent infinite loops.
    let numberOfReRenders = 0;

    do {
      didScheduleRenderPhaseUpdateDuringThisPass = false;

      if (!(numberOfReRenders < RE_RENDER_LIMIT)) {
        {
          throw Error( formatProdErrorMessage(301));
        }
      }

      numberOfReRenders += 1;


      currentHook = null;
      workInProgressHook = null;
      workInProgress.updateQueue = null;

      ReactCurrentDispatcher$1.current =  HooksDispatcherOnRerender;
      children = Component(props, secondArg);
    } while (didScheduleRenderPhaseUpdateDuringThisPass);
  } // We can assume the previous dispatcher is always this one, since we set it
  // at the beginning of the render phase and there's no re-entrancy.


  ReactCurrentDispatcher$1.current = ContextOnlyDispatcher;
  // hookTypesDev could catch more cases (e.g. context) but only in DEV bundles.


  const didRenderTooFewHooks = currentHook !== null && currentHook.next !== null;
  renderLanes = NoLanes;
  currentlyRenderingFiber$1 = null;
  currentHook = null;
  workInProgressHook = null;

  didScheduleRenderPhaseUpdate = false;

  if (!!didRenderTooFewHooks) {
    {
      throw Error( formatProdErrorMessage(300));
    }
  }

  return children;
}
function bailoutHooks(current, workInProgress, lanes) {
  workInProgress.updateQueue = current.updateQueue;
  workInProgress.flags &= ~(Passive | Update);
  current.lanes = removeLanes(current.lanes, lanes);
}
function resetHooksAfterThrow() {
  // We can assume the previous dispatcher is always this one, since we set it
  // at the beginning of the render phase and there's no re-entrancy.
  ReactCurrentDispatcher$1.current = ContextOnlyDispatcher;

  if (didScheduleRenderPhaseUpdate) {
    // There were render phase updates. These are only valid for this render
    // phase, which we are now aborting. Remove the updates from the queues so
    // they do not persist to the next render. Do not remove updates from hooks
    // that weren't processed.
    //
    // Only reset the updates from the queue if it has a clone. If it does
    // not have a clone, that means it wasn't processed, and the updates were
    // scheduled before we entered the render phase.
    let hook = currentlyRenderingFiber$1.memoizedState;

    while (hook !== null) {
      const queue = hook.queue;

      if (queue !== null) {
        queue.pending = null;
      }

      hook = hook.next;
    }

    didScheduleRenderPhaseUpdate = false;
  }

  renderLanes = NoLanes;
  currentlyRenderingFiber$1 = null;
  currentHook = null;
  workInProgressHook = null;

  didScheduleRenderPhaseUpdateDuringThisPass = false;
}

function mountWorkInProgressHook() {
  const hook = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null
  };

  if (workInProgressHook === null) {
    // This is the first hook in the list
    currentlyRenderingFiber$1.memoizedState = workInProgressHook = hook;
  } else {
    // Append to the end of the list
    workInProgressHook = workInProgressHook.next = hook;
  }

  return workInProgressHook;
}

function updateWorkInProgressHook() {
  // This function is used both for updates and for re-renders triggered by a
  // render phase update. It assumes there is either a current hook we can
  // clone, or a work-in-progress hook from a previous render pass that we can
  // use as a base. When we reach the end of the base list, we must switch to
  // the dispatcher used for mounts.
  let nextCurrentHook;

  if (currentHook === null) {
    const current = currentlyRenderingFiber$1.alternate;

    if (current !== null) {
      nextCurrentHook = current.memoizedState;
    } else {
      nextCurrentHook = null;
    }
  } else {
    nextCurrentHook = currentHook.next;
  }

  let nextWorkInProgressHook;

  if (workInProgressHook === null) {
    nextWorkInProgressHook = currentlyRenderingFiber$1.memoizedState;
  } else {
    nextWorkInProgressHook = workInProgressHook.next;
  }

  if (nextWorkInProgressHook !== null) {
    // There's already a work-in-progress. Reuse it.
    workInProgressHook = nextWorkInProgressHook;
    nextWorkInProgressHook = workInProgressHook.next;
    currentHook = nextCurrentHook;
  } else {
    // Clone from the current hook.
    if (!(nextCurrentHook !== null)) {
      {
        throw Error( formatProdErrorMessage(310));
      }
    }

    currentHook = nextCurrentHook;
    const newHook = {
      memoizedState: currentHook.memoizedState,
      baseState: currentHook.baseState,
      baseQueue: currentHook.baseQueue,
      queue: currentHook.queue,
      next: null
    };

    if (workInProgressHook === null) {
      // This is the first hook in the list.
      currentlyRenderingFiber$1.memoizedState = workInProgressHook = newHook;
    } else {
      // Append to the end of the list.
      workInProgressHook = workInProgressHook.next = newHook;
    }
  }

  return workInProgressHook;
}

function createFunctionComponentUpdateQueue() {
  return {
    lastEffect: null
  };
}

function basicStateReducer(state, action) {
  // $FlowFixMe: Flow doesn't like mixed types
  return typeof action === 'function' ? action(state) : action;
}

function mountReducer(reducer, initialArg, init) {
  const hook = mountWorkInProgressHook();
  let initialState;

  if (init !== undefined) {
    initialState = init(initialArg);
  } else {
    initialState = initialArg;
  }

  hook.memoizedState = hook.baseState = initialState;
  const queue = hook.queue = {
    pending: null,
    dispatch: null,
    lastRenderedReducer: reducer,
    lastRenderedState: initialState
  };
  const dispatch = queue.dispatch = dispatchAction.bind(null, currentlyRenderingFiber$1, queue);
  return [hook.memoizedState, dispatch];
}

function updateReducer(reducer, initialArg, init) {
  const hook = updateWorkInProgressHook();
  const queue = hook.queue;

  if (!(queue !== null)) {
    {
      throw Error( formatProdErrorMessage(311));
    }
  }

  queue.lastRenderedReducer = reducer;
  const current = currentHook; // The last rebase update that is NOT part of the base state.

  let baseQueue = current.baseQueue; // The last pending update that hasn't been processed yet.

  const pendingQueue = queue.pending;

  if (pendingQueue !== null) {
    // We have new updates that haven't been processed yet.
    // We'll add them to the base queue.
    if (baseQueue !== null) {
      // Merge the pending queue and the base queue.
      const baseFirst = baseQueue.next;
      const pendingFirst = pendingQueue.next;
      baseQueue.next = pendingFirst;
      pendingQueue.next = baseFirst;
    }

    current.baseQueue = baseQueue = pendingQueue;
    queue.pending = null;
  }

  if (baseQueue !== null) {
    // We have a queue to process.
    const first = baseQueue.next;
    let newState = current.baseState;
    let newBaseState = null;
    let newBaseQueueFirst = null;
    let newBaseQueueLast = null;
    let update = first;

    do {
      const updateLane = update.lane;

      if (!isSubsetOfLanes(renderLanes, updateLane)) {
        // Priority is insufficient. Skip this update. If this is the first
        // skipped update, the previous update/state is the new base
        // update/state.
        const clone = {
          lane: updateLane,
          action: update.action,
          eagerReducer: update.eagerReducer,
          eagerState: update.eagerState,
          next: null
        };

        if (newBaseQueueLast === null) {
          newBaseQueueFirst = newBaseQueueLast = clone;
          newBaseState = newState;
        } else {
          newBaseQueueLast = newBaseQueueLast.next = clone;
        } // Update the remaining priority in the queue.
        // TODO: Don't need to accumulate this. Instead, we can remove
        // renderLanes from the original lanes.


        currentlyRenderingFiber$1.lanes = mergeLanes(currentlyRenderingFiber$1.lanes, updateLane);
        markSkippedUpdateLanes(updateLane);
      } else {
        // This update does have sufficient priority.
        if (newBaseQueueLast !== null) {
          const clone = {
            // This update is going to be committed so we never want uncommit
            // it. Using NoLane works because 0 is a subset of all bitmasks, so
            // this will never be skipped by the check above.
            lane: NoLane,
            action: update.action,
            eagerReducer: update.eagerReducer,
            eagerState: update.eagerState,
            next: null
          };
          newBaseQueueLast = newBaseQueueLast.next = clone;
        } // Process this update.


        if (update.eagerReducer === reducer) {
          // If this update was processed eagerly, and its reducer matches the
          // current reducer, we can use the eagerly computed state.
          newState = update.eagerState;
        } else {
          const action = update.action;
          newState = reducer(newState, action);
        }
      }

      update = update.next;
    } while (update !== null && update !== first);

    if (newBaseQueueLast === null) {
      newBaseState = newState;
    } else {
      newBaseQueueLast.next = newBaseQueueFirst;
    } // Mark that the fiber performed work, but only if the new state is
    // different from the current state.


    if (!objectIs(newState, hook.memoizedState)) {
      markWorkInProgressReceivedUpdate();
    }

    hook.memoizedState = newState;
    hook.baseState = newBaseState;
    hook.baseQueue = newBaseQueueLast;
    queue.lastRenderedState = newState;
  }

  const dispatch = queue.dispatch;
  return [hook.memoizedState, dispatch];
}

function rerenderReducer(reducer, initialArg, init) {
  const hook = updateWorkInProgressHook();
  const queue = hook.queue;

  if (!(queue !== null)) {
    {
      throw Error( formatProdErrorMessage(311));
    }
  }

  queue.lastRenderedReducer = reducer; // This is a re-render. Apply the new render phase updates to the previous
  // work-in-progress hook.

  const dispatch = queue.dispatch;
  const lastRenderPhaseUpdate = queue.pending;
  let newState = hook.memoizedState;

  if (lastRenderPhaseUpdate !== null) {
    // The queue doesn't persist past this render pass.
    queue.pending = null;
    const firstRenderPhaseUpdate = lastRenderPhaseUpdate.next;
    let update = firstRenderPhaseUpdate;

    do {
      // Process this render phase update. We don't have to check the
      // priority because it will always be the same as the current
      // render's.
      const action = update.action;
      newState = reducer(newState, action);
      update = update.next;
    } while (update !== firstRenderPhaseUpdate); // Mark that the fiber performed work, but only if the new state is
    // different from the current state.


    if (!objectIs(newState, hook.memoizedState)) {
      markWorkInProgressReceivedUpdate();
    }

    hook.memoizedState = newState; // Don't persist the state accumulated from the render phase updates to
    // the base state unless the queue is empty.
    // TODO: Not sure if this is the desired semantics, but it's what we
    // do for gDSFP. I can't remember why.

    if (hook.baseQueue === null) {
      hook.baseState = newState;
    }

    queue.lastRenderedState = newState;
  }

  return [newState, dispatch];
}

function readFromUnsubcribedMutableSource(root, source, getSnapshot) {

  const getVersion = source._getVersion;
  const version = getVersion(source._source); // Is it safe for this component to read from this source during the current render?

  let isSafeToReadFromSource = false; // Check the version first.
  // If this render has already been started with a specific version,
  // we can use it alone to determine if we can safely read from the source.

  const currentRenderVersion = getWorkInProgressVersion(source);

  if (currentRenderVersion !== null) {
    // It's safe to read if the store hasn't been mutated since the last time
    // we read something.
    isSafeToReadFromSource = currentRenderVersion === version;
  } else {
    // If there's no version, then this is the first time we've read from the
    // source during the current render pass, so we need to do a bit more work.
    // What we need to determine is if there are any hooks that already
    // subscribed to the source, and if so, whether there are any pending
    // mutations that haven't been synchronized yet.
    //
    // If there are no pending mutations, then `root.mutableReadLanes` will be
    // empty, and we know we can safely read.
    //
    // If there *are* pending mutations, we may still be able to safely read
    // if the currently rendering lanes are inclusive of the pending mutation
    // lanes, since that guarantees that the value we're about to read from
    // the source is consistent with the values that we read during the most
    // recent mutation.
    isSafeToReadFromSource = isSubsetOfLanes(renderLanes, root.mutableReadLanes);

    if (isSafeToReadFromSource) {
      // If it's safe to read from this source during the current render,
      // store the version in case other components read from it.
      // A changed version number will let those components know to throw and restart the render.
      setWorkInProgressVersion(source, version);
    }
  }

  if (isSafeToReadFromSource) {
    const snapshot = getSnapshot(source._source);

    return snapshot;
  } else {
    // This handles the special case of a mutable source being shared between renderers.
    // In that case, if the source is mutated between the first and second renderer,
    // The second renderer don't know that it needs to reset the WIP version during unwind,
    // (because the hook only marks sources as dirty if it's written to their WIP version).
    // That would cause this tear check to throw again and eventually be visible to the user.
    // We can avoid this infinite loop by explicitly marking the source as dirty.
    //
    // This can lead to tearing in the first renderer when it resumes,
    // but there's nothing we can do about that (short of throwing here and refusing to continue the render).
    markSourceAsDirty(source);

    {
      {
        throw Error( formatProdErrorMessage(350));
      }
    }
  }
}

function useMutableSource(hook, source, getSnapshot, subscribe) {
  const root = getWorkInProgressRoot();

  if (!(root !== null)) {
    {
      throw Error( formatProdErrorMessage(349));
    }
  }

  const getVersion = source._getVersion;
  const version = getVersion(source._source);
  const dispatcher = ReactCurrentDispatcher$1.current; // eslint-disable-next-line prefer-const

  let _dispatcher$useState = dispatcher.useState(() => readFromUnsubcribedMutableSource(root, source, getSnapshot)),
      currentSnapshot = _dispatcher$useState[0],
      setSnapshot = _dispatcher$useState[1];

  let snapshot = currentSnapshot; // Grab a handle to the state hook as well.
  // We use it to clear the pending update queue if we have a new source.

  const stateHook = workInProgressHook;
  const memoizedState = hook.memoizedState;
  const refs = memoizedState.refs;
  const prevGetSnapshot = refs.getSnapshot;
  const prevSource = memoizedState.source;
  const prevSubscribe = memoizedState.subscribe;
  const fiber = currentlyRenderingFiber$1;
  hook.memoizedState = {
    refs,
    source,
    subscribe
  }; // Sync the values needed by our subscription handler after each commit.

  dispatcher.useEffect(() => {
    refs.getSnapshot = getSnapshot; // Normally the dispatch function for a state hook never changes,
    // but this hook recreates the queue in certain cases  to avoid updates from stale sources.
    // handleChange() below needs to reference the dispatch function without re-subscribing,
    // so we use a ref to ensure that it always has the latest version.

    refs.setSnapshot = setSnapshot; // Check for a possible change between when we last rendered now.

    const maybeNewVersion = getVersion(source._source);

    if (!objectIs(version, maybeNewVersion)) {
      const maybeNewSnapshot = getSnapshot(source._source);

      if (!objectIs(snapshot, maybeNewSnapshot)) {
        setSnapshot(maybeNewSnapshot);
        const lane = requestUpdateLane(fiber);
        markRootMutableRead(root, lane);
      } // If the source mutated between render and now,
      // there may be state updates already scheduled from the old source.
      // Entangle the updates so that they render in the same batch.


      markRootEntangled(root, root.mutableReadLanes);
    }
  }, [getSnapshot, source, subscribe]); // If we got a new source or subscribe function, re-subscribe in a passive effect.

  dispatcher.useEffect(() => {
    const handleChange = () => {
      const latestGetSnapshot = refs.getSnapshot;
      const latestSetSnapshot = refs.setSnapshot;

      try {
        latestSetSnapshot(latestGetSnapshot(source._source)); // Record a pending mutable source update with the same expiration time.

        const lane = requestUpdateLane(fiber);
        markRootMutableRead(root, lane);
      } catch (error) {
        // A selector might throw after a source mutation.
        // e.g. it might try to read from a part of the store that no longer exists.
        // In this case we should still schedule an update with React.
        // Worst case the selector will throw again and then an error boundary will handle it.
        latestSetSnapshot(() => {
          throw error;
        });
      }
    };

    const unsubscribe = subscribe(source._source, handleChange);

    return unsubscribe;
  }, [source, subscribe]); // If any of the inputs to useMutableSource change, reading is potentially unsafe.
  //
  // If either the source or the subscription have changed we can't can't trust the update queue.
  // Maybe the source changed in a way that the old subscription ignored but the new one depends on.
  //
  // If the getSnapshot function changed, we also shouldn't rely on the update queue.
  // It's possible that the underlying source was mutated between the when the last "change" event fired,
  // and when the current render (with the new getSnapshot function) is processed.
  //
  // In both cases, we need to throw away pending updates (since they are no longer relevant)
  // and treat reading from the source as we do in the mount case.

  if (!objectIs(prevGetSnapshot, getSnapshot) || !objectIs(prevSource, source) || !objectIs(prevSubscribe, subscribe)) {
    // Create a new queue and setState method,
    // So if there are interleaved updates, they get pushed to the older queue.
    // When this becomes current, the previous queue and dispatch method will be discarded,
    // including any interleaving updates that occur.
    const newQueue = {
      pending: null,
      dispatch: null,
      lastRenderedReducer: basicStateReducer,
      lastRenderedState: snapshot
    };
    newQueue.dispatch = setSnapshot = dispatchAction.bind(null, currentlyRenderingFiber$1, newQueue);
    stateHook.queue = newQueue;
    stateHook.baseQueue = null;
    snapshot = readFromUnsubcribedMutableSource(root, source, getSnapshot);
    stateHook.memoizedState = stateHook.baseState = snapshot;
  }

  return snapshot;
}

function mountMutableSource(source, getSnapshot, subscribe) {
  const hook = mountWorkInProgressHook();
  hook.memoizedState = {
    refs: {
      getSnapshot,
      setSnapshot: null
    },
    source,
    subscribe
  };
  return useMutableSource(hook, source, getSnapshot, subscribe);
}

function updateMutableSource(source, getSnapshot, subscribe) {
  const hook = updateWorkInProgressHook();
  return useMutableSource(hook, source, getSnapshot, subscribe);
}

function mountState(initialState) {
  const hook = mountWorkInProgressHook();

  if (typeof initialState === 'function') {
    // $FlowFixMe: Flow doesn't like mixed types
    initialState = initialState();
  }

  hook.memoizedState = hook.baseState = initialState;
  const queue = hook.queue = {
    pending: null,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: initialState
  };
  const dispatch = queue.dispatch = dispatchAction.bind(null, currentlyRenderingFiber$1, queue);
  return [hook.memoizedState, dispatch];
}

function updateState(initialState) {
  return updateReducer(basicStateReducer);
}

function rerenderState(initialState) {
  return rerenderReducer(basicStateReducer);
}

function pushEffect(tag, create, destroy, deps) {
  const effect = {
    tag,
    create,
    destroy,
    deps,
    // Circular
    next: null
  };
  let componentUpdateQueue = currentlyRenderingFiber$1.updateQueue;

  if (componentUpdateQueue === null) {
    componentUpdateQueue = createFunctionComponentUpdateQueue();
    currentlyRenderingFiber$1.updateQueue = componentUpdateQueue;
    componentUpdateQueue.lastEffect = effect.next = effect;
  } else {
    const lastEffect = componentUpdateQueue.lastEffect;

    if (lastEffect === null) {
      componentUpdateQueue.lastEffect = effect.next = effect;
    } else {
      const firstEffect = lastEffect.next;
      lastEffect.next = effect;
      effect.next = firstEffect;
      componentUpdateQueue.lastEffect = effect;
    }
  }

  return effect;
}

function mountRef(initialValue) {
  const hook = mountWorkInProgressHook();
  const ref = {
    current: initialValue
  };

  hook.memoizedState = ref;
  return ref;
}

function updateRef(initialValue) {
  const hook = updateWorkInProgressHook();
  return hook.memoizedState;
}

function mountEffectImpl(fiberFlags, hookFlags, create, deps) {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  currentlyRenderingFiber$1.flags |= fiberFlags;
  hook.memoizedState = pushEffect(HasEffect | hookFlags, create, undefined, nextDeps);
}

function updateEffectImpl(fiberFlags, hookFlags, create, deps) {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  let destroy = undefined;

  if (currentHook !== null) {
    const prevEffect = currentHook.memoizedState;
    destroy = prevEffect.destroy;

    if (nextDeps !== null) {
      const prevDeps = prevEffect.deps;

      if (areHookInputsEqual(nextDeps, prevDeps)) {
        pushEffect(hookFlags, create, destroy, nextDeps);
        return;
      }
    }
  }

  currentlyRenderingFiber$1.flags |= fiberFlags;
  hook.memoizedState = pushEffect(HasEffect | hookFlags, create, destroy, nextDeps);
}

function mountEffect(create, deps) {

  return mountEffectImpl(Update | Passive, Passive$1, create, deps);
}

function updateEffect(create, deps) {

  return updateEffectImpl(Update | Passive, Passive$1, create, deps);
}

function mountLayoutEffect(create, deps) {
  return mountEffectImpl(Update, Layout, create, deps);
}

function updateLayoutEffect(create, deps) {
  return updateEffectImpl(Update, Layout, create, deps);
}

function imperativeHandleEffect(create, ref) {
  if (typeof ref === 'function') {
    const refCallback = ref;
    const inst = create();
    refCallback(inst);
    return () => {
      refCallback(null);
    };
  } else if (ref !== null && ref !== undefined) {
    const refObject = ref;

    const inst = create();
    refObject.current = inst;
    return () => {
      refObject.current = null;
    };
  }
}

function mountImperativeHandle(ref, create, deps) {


  const effectDeps = deps !== null && deps !== undefined ? deps.concat([ref]) : null;
  return mountEffectImpl(Update, Layout, imperativeHandleEffect.bind(null, create, ref), effectDeps);
}

function updateImperativeHandle(ref, create, deps) {


  const effectDeps = deps !== null && deps !== undefined ? deps.concat([ref]) : null;
  return updateEffectImpl(Update, Layout, imperativeHandleEffect.bind(null, create, ref), effectDeps);
}

function mountDebugValue(value, formatterFn) {// This hook is normally a no-op.
  // The react-debug-hooks package injects its own implementation
  // so that e.g. DevTools can display custom hook values.
}

const updateDebugValue = mountDebugValue;

function mountCallback(callback, deps) {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  hook.memoizedState = [callback, nextDeps];
  return callback;
}

function updateCallback(callback, deps) {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const prevState = hook.memoizedState;

  if (prevState !== null) {
    if (nextDeps !== null) {
      const prevDeps = prevState[1];

      if (areHookInputsEqual(nextDeps, prevDeps)) {
        return prevState[0];
      }
    }
  }

  hook.memoizedState = [callback, nextDeps];
  return callback;
}

function mountMemo(nextCreate, deps) {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}

function updateMemo(nextCreate, deps) {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const prevState = hook.memoizedState;

  if (prevState !== null) {
    // Assume these are defined. If they're not, areHookInputsEqual will warn.
    if (nextDeps !== null) {
      const prevDeps = prevState[1];

      if (areHookInputsEqual(nextDeps, prevDeps)) {
        return prevState[0];
      }
    }
  }

  const nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}

function mountDeferredValue(value) {
  const _mountState = mountState(value),
        prevValue = _mountState[0],
        setValue = _mountState[1];

  mountEffect(() => {
    const prevTransition = ReactCurrentBatchConfig$1.transition;
    ReactCurrentBatchConfig$1.transition = 1;

    try {
      setValue(value);
    } finally {
      ReactCurrentBatchConfig$1.transition = prevTransition;
    }
  }, [value]);
  return prevValue;
}

function updateDeferredValue(value) {
  const _updateState = updateState(),
        prevValue = _updateState[0],
        setValue = _updateState[1];

  updateEffect(() => {
    const prevTransition = ReactCurrentBatchConfig$1.transition;
    ReactCurrentBatchConfig$1.transition = 1;

    try {
      setValue(value);
    } finally {
      ReactCurrentBatchConfig$1.transition = prevTransition;
    }
  }, [value]);
  return prevValue;
}

function rerenderDeferredValue(value) {
  const _rerenderState = rerenderState(),
        prevValue = _rerenderState[0],
        setValue = _rerenderState[1];

  updateEffect(() => {
    const prevTransition = ReactCurrentBatchConfig$1.transition;
    ReactCurrentBatchConfig$1.transition = 1;

    try {
      setValue(value);
    } finally {
      ReactCurrentBatchConfig$1.transition = prevTransition;
    }
  }, [value]);
  return prevValue;
}

function startTransition(setPending, callback) {
  const priorityLevel = getCurrentPriorityLevel();

  if (decoupleUpdatePriorityFromScheduler) {
    runWithPriority(priorityLevel < UserBlockingPriority$1 ? UserBlockingPriority$1 : priorityLevel, () => {
      setPending(true);
    }); // TODO: Can remove this. Was only necessary because we used to give
    runWithPriority(priorityLevel > NormalPriority$1 ? NormalPriority$1 : priorityLevel, () => {
      const prevTransition = ReactCurrentBatchConfig$1.transition;
      ReactCurrentBatchConfig$1.transition = 1;

      try {
        setPending(false);
        callback();
      } finally {

        ReactCurrentBatchConfig$1.transition = prevTransition;
      }
    });
  } else {
    runWithPriority(priorityLevel < UserBlockingPriority$1 ? UserBlockingPriority$1 : priorityLevel, () => {
      setPending(true);
    });
    runWithPriority(priorityLevel > NormalPriority$1 ? NormalPriority$1 : priorityLevel, () => {
      const prevTransition = ReactCurrentBatchConfig$1.transition;
      ReactCurrentBatchConfig$1.transition = 1;

      try {
        setPending(false);
        callback();
      } finally {
        ReactCurrentBatchConfig$1.transition = prevTransition;
      }
    });
  }
}

function mountTransition() {
  const _mountState2 = mountState(false),
        isPending = _mountState2[0],
        setPending = _mountState2[1]; // The `start` method can be stored on a ref, since `setPending`
  // never changes.


  const start = startTransition.bind(null, setPending);
  mountRef(start);
  return [start, isPending];
}

function updateTransition() {
  const _updateState2 = updateState(),
        isPending = _updateState2[0];

  const startRef = updateRef();
  const start = startRef.current;
  return [start, isPending];
}

function rerenderTransition() {
  const _rerenderState2 = rerenderState(),
        isPending = _rerenderState2[0];

  const startRef = updateRef();
  const start = startRef.current;
  return [start, isPending];
}

function mountOpaqueIdentifier() {
  const makeId =  makeClientId;

  {
    const id = makeId();
    mountState(id);
    return id;
  }
}

function updateOpaqueIdentifier() {
  const id = updateState()[0];
  return id;
}

function rerenderOpaqueIdentifier() {
  const id = rerenderState()[0];
  return id;
}

function dispatchAction(fiber, queue, action) {

  const eventTime = requestEventTime();
  const lane = requestUpdateLane(fiber);
  const update = {
    lane,
    action,
    eagerReducer: null,
    eagerState: null,
    next: null
  }; // Append the update to the end of the list.

  const pending = queue.pending;

  if (pending === null) {
    // This is the first update. Create a circular list.
    update.next = update;
  } else {
    update.next = pending.next;
    pending.next = update;
  }

  queue.pending = update;
  const alternate = fiber.alternate;

  if (fiber === currentlyRenderingFiber$1 || alternate !== null && alternate === currentlyRenderingFiber$1) {
    // This is a render phase update. Stash it in a lazily-created map of
    // queue -> linked list of updates. After this render pass, we'll restart
    // and apply the stashed updates on top of the work-in-progress hook.
    didScheduleRenderPhaseUpdateDuringThisPass = didScheduleRenderPhaseUpdate = true;
  } else {
    if (fiber.lanes === NoLanes && (alternate === null || alternate.lanes === NoLanes)) {
      // The queue is currently empty, which means we can eagerly compute the
      // next state before entering the render phase. If the new state is the
      // same as the current state, we may be able to bail out entirely.
      const lastRenderedReducer = queue.lastRenderedReducer;

      if (lastRenderedReducer !== null) {

        try {
          const currentState = queue.lastRenderedState;
          const eagerState = lastRenderedReducer(currentState, action); // Stash the eagerly computed state, and the reducer used to compute
          // it, on the update object. If the reducer hasn't changed by the
          // time we enter the render phase, then the eager state can be used
          // without calling the reducer again.

          update.eagerReducer = lastRenderedReducer;
          update.eagerState = eagerState;

          if (objectIs(eagerState, currentState)) {
            // Fast path. We can bail out without scheduling React to re-render.
            // It's still possible that we'll need to rebase this update later,
            // if the component re-renders for a different reason and by that
            // time the reducer has changed.
            return;
          }
        } catch (error) {// Suppress the error. It will throw again in the render phase.
        } finally {
        }
      }
    }

    scheduleUpdateOnFiber(fiber, lane, eventTime);
  }
}

const ContextOnlyDispatcher = {
  readContext,
  useCallback: throwInvalidHookError,
  useContext: throwInvalidHookError,
  useEffect: throwInvalidHookError,
  useImperativeHandle: throwInvalidHookError,
  useLayoutEffect: throwInvalidHookError,
  useMemo: throwInvalidHookError,
  useReducer: throwInvalidHookError,
  useRef: throwInvalidHookError,
  useState: throwInvalidHookError,
  useDebugValue: throwInvalidHookError,
  useDeferredValue: throwInvalidHookError,
  useTransition: throwInvalidHookError,
  useMutableSource: throwInvalidHookError,
  useOpaqueIdentifier: throwInvalidHookError,
  unstable_isNewReconciler: enableNewReconciler
};
const HooksDispatcherOnMount = {
  readContext,
  useCallback: mountCallback,
  useContext: readContext,
  useEffect: mountEffect,
  useImperativeHandle: mountImperativeHandle,
  useLayoutEffect: mountLayoutEffect,
  useMemo: mountMemo,
  useReducer: mountReducer,
  useRef: mountRef,
  useState: mountState,
  useDebugValue: mountDebugValue,
  useDeferredValue: mountDeferredValue,
  useTransition: mountTransition,
  useMutableSource: mountMutableSource,
  useOpaqueIdentifier: mountOpaqueIdentifier,
  unstable_isNewReconciler: enableNewReconciler
};
const HooksDispatcherOnUpdate = {
  readContext,
  useCallback: updateCallback,
  useContext: readContext,
  useEffect: updateEffect,
  useImperativeHandle: updateImperativeHandle,
  useLayoutEffect: updateLayoutEffect,
  useMemo: updateMemo,
  useReducer: updateReducer,
  useRef: updateRef,
  useState: updateState,
  useDebugValue: updateDebugValue,
  useDeferredValue: updateDeferredValue,
  useTransition: updateTransition,
  useMutableSource: updateMutableSource,
  useOpaqueIdentifier: updateOpaqueIdentifier,
  unstable_isNewReconciler: enableNewReconciler
};
const HooksDispatcherOnRerender = {
  readContext,
  useCallback: updateCallback,
  useContext: readContext,
  useEffect: updateEffect,
  useImperativeHandle: updateImperativeHandle,
  useLayoutEffect: updateLayoutEffect,
  useMemo: updateMemo,
  useReducer: rerenderReducer,
  useRef: updateRef,
  useState: rerenderState,
  useDebugValue: updateDebugValue,
  useDeferredValue: rerenderDeferredValue,
  useTransition: rerenderTransition,
  useMutableSource: updateMutableSource,
  useOpaqueIdentifier: rerenderOpaqueIdentifier,
  unstable_isNewReconciler: enableNewReconciler
};

function stopProfilerTimerIfRunningAndRecordDelta(fiber, overrideBaseTime) {
  {
    return;
  }
}

function recordPassiveEffectDuration(fiber) {
  {
    return;
  }
}

function startPassiveEffectTimer() {
  {
    return;
  }
}

const ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner;
let didReceiveUpdate = false;

function reconcileChildren(current, workInProgress, nextChildren, renderLanes) {
  if (current === null) {
    // If this is a fresh new component that hasn't been rendered yet, we
    // won't update its child set by applying minimal side-effects. Instead,
    // we will add them all to the child before it gets rendered. That means
    // we can optimize this reconciliation pass by not tracking side-effects.
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren, renderLanes);
  } else {
    // If the current child is the same as the work in progress, it means that
    // we haven't yet started any work on these children. Therefore, we use
    // the clone algorithm to create a copy of all the current children.
    // If we had any progressed work already, that is invalid at this point so
    // let's throw it out.
    workInProgress.child = reconcileChildFibers(workInProgress, current.child, nextChildren, renderLanes);
  }
}

function forceUnmountCurrentAndReconcile(current, workInProgress, nextChildren, renderLanes) {
  // This function is fork of reconcileChildren. It's used in cases where we
  // want to reconcile without matching against the existing set. This has the
  // effect of all current children being unmounted; even if the type and key
  // are the same, the old child is unmounted and a new child is created.
  //
  // To do this, we're going to go through the reconcile algorithm twice. In
  // the first pass, we schedule a deletion for all the current children by
  // passing null.
  workInProgress.child = reconcileChildFibers(workInProgress, current.child, null, renderLanes); // In the second pass, we mount the new children. The trick here is that we
  // pass null in place of where we usually pass the current child set. This has
  // the effect of remounting all children regardless of whether their
  // identities match.

  workInProgress.child = reconcileChildFibers(workInProgress, null, nextChildren, renderLanes);
}

function updateForwardRef(current, workInProgress, Component, nextProps, renderLanes) {

  const render = Component.render;
  const ref = workInProgress.ref; // The rest is a fork of updateFunctionComponent

  let nextChildren;
  prepareToReadContext(workInProgress, renderLanes);

  {
    nextChildren = renderWithHooks(current, workInProgress, render, nextProps, ref, renderLanes);
  }

  if (current !== null && !didReceiveUpdate) {
    bailoutHooks(current, workInProgress, renderLanes);
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  } // React DevTools reads this flag.


  workInProgress.flags |= PerformedWork;
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}

function updateMemoComponent(current, workInProgress, Component, nextProps, updateLanes, renderLanes) {
  if (current === null) {
    const type = Component.type;

    if (isSimpleFunctionComponent(type) && Component.compare === null && // SimpleMemoComponent codepath doesn't resolve outer props either.
    Component.defaultProps === undefined) {
      let resolvedType = type;
      // and with only the default shallow comparison, we upgrade it
      // to a SimpleMemoComponent to allow fast path updates.


      workInProgress.tag = SimpleMemoComponent;
      workInProgress.type = resolvedType;

      return updateSimpleMemoComponent(current, workInProgress, resolvedType, nextProps, updateLanes, renderLanes);
    }

    const child = createFiberFromTypeAndProps(Component.type, null, nextProps, workInProgress, workInProgress.mode, renderLanes);
    child.ref = workInProgress.ref;
    child.return = workInProgress;
    workInProgress.child = child;
    return child;
  }

  const currentChild = current.child; // This is always exactly one child

  if (!includesSomeLane(updateLanes, renderLanes)) {
    // This will be the props with resolved defaultProps,
    // unlike current.memoizedProps which will be the unresolved ones.
    const prevProps = currentChild.memoizedProps; // Default to shallow comparison

    let compare = Component.compare;
    compare = compare !== null ? compare : shallowEqual;

    if (compare(prevProps, nextProps) && current.ref === workInProgress.ref) {
      return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
    }
  } // React DevTools reads this flag.


  workInProgress.flags |= PerformedWork;
  const newChild = createWorkInProgress(currentChild, nextProps);
  newChild.ref = workInProgress.ref;
  newChild.return = workInProgress;
  workInProgress.child = newChild;
  return newChild;
}

function updateSimpleMemoComponent(current, workInProgress, Component, nextProps, updateLanes, renderLanes) {

  if (current !== null) {
    const prevProps = current.memoizedProps;

    if (shallowEqual(prevProps, nextProps) && current.ref === workInProgress.ref && ( // Prevent bailout if the implementation changed due to hot reload.
     true)) {
      didReceiveUpdate = false;

      if (!includesSomeLane(renderLanes, updateLanes)) {
        // The pending lanes were cleared at the beginning of beginWork. We're
        // about to bail out, but there might be other lanes that weren't
        // included in the current render. Usually, the priority level of the
        // remaining updates is accumlated during the evaluation of the
        // component (i.e. when processing the update queue). But since since
        // we're bailing out early *without* evaluating the component, we need
        // to account for it here, too. Reset to the value of the current fiber.
        // NOTE: This only applies to SimpleMemoComponent, not MemoComponent,
        // because a MemoComponent fiber does not have hooks or an update queue;
        // rather, it wraps around an inner component, which may or may not
        // contains hooks.
        // TODO: Move the reset at in beginWork out of the common path so that
        // this is no longer necessary.
        workInProgress.lanes = current.lanes;
        return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
      } else if ((current.flags & ForceUpdateForLegacySuspense) !== NoFlags) {
        // This is a special case that only exists for legacy mode.
        // See https://github.com/facebook/react/pull/19216.
        didReceiveUpdate = true;
      }
    }
  }

  return updateFunctionComponent(current, workInProgress, Component, nextProps, renderLanes);
}

function updateOffscreenComponent(current, workInProgress, renderLanes) {
  const nextProps = workInProgress.pendingProps;
  const nextChildren = nextProps.children;
  const prevState = current !== null ? current.memoizedState : null;

  if (nextProps.mode === 'hidden' || nextProps.mode === 'unstable-defer-without-hiding') {
    if ((workInProgress.mode & ConcurrentMode) === NoMode) {
      // In legacy sync mode, don't defer the subtree. Render it now.
      // TODO: Figure out what we should do in Blocking mode.
      const nextState = {
        baseLanes: NoLanes
      };
      workInProgress.memoizedState = nextState;
      pushRenderLanes(workInProgress, renderLanes);
    } else if (!includesSomeLane(renderLanes, OffscreenLane)) {
      let nextBaseLanes;

      if (prevState !== null) {
        const prevBaseLanes = prevState.baseLanes;
        nextBaseLanes = mergeLanes(prevBaseLanes, renderLanes);
      } else {
        nextBaseLanes = renderLanes;
      } // Schedule this fiber to re-render at offscreen priority. Then bailout.


      {
        markSpawnedWork(OffscreenLane);
      }

      workInProgress.lanes = workInProgress.childLanes = laneToLanes(OffscreenLane);
      const nextState = {
        baseLanes: nextBaseLanes
      };
      workInProgress.memoizedState = nextState; // We're about to bail out, but we need to push this to the stack anyway
      // to avoid a push/pop misalignment.

      pushRenderLanes(workInProgress, nextBaseLanes);
      return null;
    } else {
      // Rendering at offscreen, so we can clear the base lanes.
      const nextState = {
        baseLanes: NoLanes
      };
      workInProgress.memoizedState = nextState; // Push the lanes that were skipped when we bailed out.

      const subtreeRenderLanes = prevState !== null ? prevState.baseLanes : renderLanes;
      pushRenderLanes(workInProgress, subtreeRenderLanes);
    }
  } else {
    let subtreeRenderLanes;

    if (prevState !== null) {
      subtreeRenderLanes = mergeLanes(prevState.baseLanes, renderLanes); // Since we're not hidden anymore, reset the state

      workInProgress.memoizedState = null;
    } else {
      // We weren't previously hidden, and we still aren't, so there's nothing
      // special to do. Need to push to the stack regardless, though, to avoid
      // a push/pop misalignment.
      subtreeRenderLanes = renderLanes;
    }

    pushRenderLanes(workInProgress, subtreeRenderLanes);
  }

  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
} // Note: These happen to have identical begin phases, for now. We shouldn't hold
// ourselves to this constraint, though. If the behavior diverges, we should
// fork the function.


const updateLegacyHiddenComponent = updateOffscreenComponent;

function updateFragment(current, workInProgress, renderLanes) {
  const nextChildren = workInProgress.pendingProps;
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}

function updateMode(current, workInProgress, renderLanes) {
  const nextChildren = workInProgress.pendingProps.children;
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}

function updateProfiler(current, workInProgress, renderLanes) {

  const nextProps = workInProgress.pendingProps;
  const nextChildren = nextProps.children;
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}

function markRef(current, workInProgress) {
  const ref = workInProgress.ref;

  if (current === null && ref !== null || current !== null && current.ref !== ref) {
    // Schedule a Ref effect
    workInProgress.flags |= Ref;
  }
}

function updateFunctionComponent(current, workInProgress, Component, nextProps, renderLanes) {

  let context;

  let nextChildren;
  prepareToReadContext(workInProgress, renderLanes);

  {
    nextChildren = renderWithHooks(current, workInProgress, Component, nextProps, context, renderLanes);
  }

  if (current !== null && !didReceiveUpdate) {
    bailoutHooks(current, workInProgress, renderLanes);
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  } // React DevTools reads this flag.


  workInProgress.flags |= PerformedWork;
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}

function updateBlock(current, workInProgress, block, nextProps, renderLanes) {
  // TODO: current can be non-null here even if the component
  // hasn't yet mounted. This happens after the first render suspends.
  // We'll need to figure out if this is fine or can cause issues.
  const render = block._render;
  const data = block._data; // The rest is a fork of updateFunctionComponent

  let nextChildren;
  prepareToReadContext(workInProgress, renderLanes);

  {
    nextChildren = renderWithHooks(current, workInProgress, render, nextProps, data, renderLanes);
  }

  if (current !== null && !didReceiveUpdate) {
    bailoutHooks(current, workInProgress, renderLanes);
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  } // React DevTools reads this flag.


  workInProgress.flags |= PerformedWork;
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}

function updateClassComponent(current, workInProgress, Component, nextProps, renderLanes) {
  // During mounting we don't know the child context yet as the instance doesn't exist.
  // We will invalidate the child context in finishClassComponent() right after rendering.


  let hasContext;

  if (isContextProvider()) {
    hasContext = true;
  } else {
    hasContext = false;
  }

  prepareToReadContext(workInProgress, renderLanes);
  const instance = workInProgress.stateNode;
  let shouldUpdate;

  if (instance === null) {
    if (current !== null) {
      // A class component without an instance only mounts if it suspended
      // inside a non-concurrent tree, in an inconsistent state. We want to
      // treat it like a new mount, even though an empty version of it already
      // committed. Disconnect the alternate pointers.
      current.alternate = null;
      workInProgress.alternate = null; // Since this is conceptually a new fiber, schedule a Placement effect

      workInProgress.flags |= Placement;
    } // In the initial pass we might need to construct the instance.


    constructClassInstance(workInProgress, Component, nextProps);
    mountClassInstance(workInProgress, Component, nextProps, renderLanes);
    shouldUpdate = true;
  } else if (current === null) {
    // In a resume, we'll already have an instance we can reuse.
    shouldUpdate = resumeMountClassInstance(workInProgress, Component, nextProps, renderLanes);
  } else {
    shouldUpdate = updateClassInstance(current, workInProgress, Component, nextProps, renderLanes);
  }

  const nextUnitOfWork = finishClassComponent(current, workInProgress, Component, shouldUpdate, hasContext, renderLanes);

  return nextUnitOfWork;
}

function finishClassComponent(current, workInProgress, Component, shouldUpdate, hasContext, renderLanes) {
  // Refs should update even if shouldComponentUpdate returns false
  markRef(current, workInProgress);
  const didCaptureError = (workInProgress.flags & DidCapture) !== NoFlags;

  if (!shouldUpdate && !didCaptureError) {

    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  }

  const instance = workInProgress.stateNode; // Rerender

  ReactCurrentOwner$1.current = workInProgress;
  let nextChildren;

  if (didCaptureError && typeof Component.getDerivedStateFromError !== 'function') {
    // If we captured an error, but getDerivedStateFromError is not defined,
    // unmount all the children. componentDidCatch will schedule an update to
    // re-render a fallback. This is temporary until we migrate everyone to
    // the new API.
    // TODO: Warn in a future release.
    nextChildren = null;
  } else {
    {
      nextChildren = instance.render();
    }
  } // React DevTools reads this flag.


  workInProgress.flags |= PerformedWork;

  if (current !== null && didCaptureError) {
    // If we're recovering from an error, reconcile without reusing any of
    // the existing children. Conceptually, the normal children and the children
    // that are shown on error are two different sets, so we shouldn't reuse
    // normal children even if their identities match.
    forceUnmountCurrentAndReconcile(current, workInProgress, nextChildren, renderLanes);
  } else {
    reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  } // Memoize state using the values we just used to render.
  // TODO: Restructure so we never read values from the instance.


  workInProgress.memoizedState = instance.state; // The context might have changed so we need to recalculate it.

  return workInProgress.child;
}

function pushHostRootContext(workInProgress) {
  const root = workInProgress.stateNode;

  if (root.pendingContext) {
    pushTopLevelContextObject(workInProgress, root.pendingContext, root.pendingContext !== root.context);
  } else if (root.context) {
    // Should always be set
    pushTopLevelContextObject(workInProgress, root.context);
  }

  pushHostContainer(workInProgress, root.containerInfo);
}

function updateHostRoot(current, workInProgress, renderLanes) {
  pushHostRootContext(workInProgress);
  const updateQueue = workInProgress.updateQueue;

  if (!(current !== null && updateQueue !== null)) {
    {
      throw Error( formatProdErrorMessage(282));
    }
  }

  const nextProps = workInProgress.pendingProps;
  const prevState = workInProgress.memoizedState;
  const prevChildren = prevState !== null ? prevState.element : null;
  cloneUpdateQueue(current, workInProgress);
  processUpdateQueue(workInProgress, nextProps, null, renderLanes);
  const nextState = workInProgress.memoizedState; // Caution: React DevTools currently depends on this property
  // being called "element".

  const nextChildren = nextState.element;

  if (nextChildren === prevChildren) {
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  }

  const root = workInProgress.stateNode;

  if (root.hydrate && enterHydrationState()) {

    const child = mountChildFibers(workInProgress, null, nextChildren, renderLanes);
    workInProgress.child = child;
    let node = child;

    while (node) {
      // Mark each child as hydrating. This is a fast path to know whether this
      // tree is part of a hydrating tree. This is used to determine if a child
      // node has fully mounted yet, and for scheduling event replaying.
      // Conceptually this is similar to Placement in that a new subtree is
      // inserted into the React tree here. It just happens to not need DOM
      // mutations because it already exists.
      node.flags = node.flags & ~Placement | Hydrating;
      node = node.sibling;
    }
  } else {
    // Otherwise reset hydration state in case we aborted and resumed another
    // root.
    reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  }

  return workInProgress.child;
}

function updateHostComponent(current, workInProgress, renderLanes) {
  pushHostContext(workInProgress);

  const type = workInProgress.type;
  const nextProps = workInProgress.pendingProps;
  const prevProps = current !== null ? current.memoizedProps : null;
  let nextChildren = nextProps.children;
  const isDirectTextChild = shouldSetTextContent(type, nextProps);

  if (isDirectTextChild) {
    // We special case a direct text child of a host node. This is a common
    // case. We won't handle it as a reified child. We will instead handle
    // this in the host environment that also has access to this prop. That
    // avoids allocating another HostText fiber and traversing it.
    nextChildren = null;
  } else if (prevProps !== null && shouldSetTextContent(type, prevProps)) {
    // If we're switching from a direct text child to a normal child, or to
    // empty, we need to schedule the text content to be reset.
    workInProgress.flags |= ContentReset;
  }

  markRef(current, workInProgress);
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}

function updateHostText(current, workInProgress) {
  // immediately after.


  return null;
}

function mountLazyComponent(_current, workInProgress, elementType, updateLanes, renderLanes) {
  if (_current !== null) {
    // A lazy component only mounts if it suspended inside a non-
    // concurrent tree, in an inconsistent state. We want to treat it like
    // a new mount, even though an empty version of it already committed.
    // Disconnect the alternate pointers.
    _current.alternate = null;
    workInProgress.alternate = null; // Since this is conceptually a new fiber, schedule a Placement effect

    workInProgress.flags |= Placement;
  }

  const props = workInProgress.pendingProps;
  const lazyComponent = elementType;
  const payload = lazyComponent._payload;
  const init = lazyComponent._init;
  let Component = init(payload); // Store the unwrapped component in the type.

  workInProgress.type = Component;
  const resolvedTag = workInProgress.tag = resolveLazyComponentTag(Component);
  const resolvedProps = resolveDefaultProps(Component, props);
  let child;

  switch (resolvedTag) {
    case FunctionComponent:
      {

        child = updateFunctionComponent(null, workInProgress, Component, resolvedProps, renderLanes);
        return child;
      }

    case ClassComponent:
      {

        child = updateClassComponent(null, workInProgress, Component, resolvedProps, renderLanes);
        return child;
      }

    case ForwardRef:
      {

        child = updateForwardRef(null, workInProgress, Component, resolvedProps, renderLanes);
        return child;
      }

    case MemoComponent:
      {

        child = updateMemoComponent(null, workInProgress, Component, resolveDefaultProps(Component.type, resolvedProps), // The inner type can have defaults too
        updateLanes, renderLanes);
        return child;
      }

    case Block:
      {
        {
          // TODO: Resolve for Hot Reloading.
          child = updateBlock(null, workInProgress, Component, props, renderLanes);
          return child;
        }
      }
  }

  let hint = '';
  // because the fact that it's a separate type of work is an
  // implementation detail.


  {
    {
      throw Error( formatProdErrorMessage(306, Component, hint));
    }
  }
}

function mountIncompleteClassComponent(_current, workInProgress, Component, nextProps, renderLanes) {
  if (_current !== null) {
    // An incomplete component only mounts if it suspended inside a non-
    // concurrent tree, in an inconsistent state. We want to treat it like
    // a new mount, even though an empty version of it already committed.
    // Disconnect the alternate pointers.
    _current.alternate = null;
    workInProgress.alternate = null; // Since this is conceptually a new fiber, schedule a Placement effect

    workInProgress.flags |= Placement;
  } // Promote the fiber to a class and try rendering again.


  workInProgress.tag = ClassComponent; // The rest of this function is a fork of `updateClassComponent`
  // Push context providers early to prevent context stack mismatches.
  // During mounting we don't know the child context yet as the instance doesn't exist.
  // We will invalidate the child context in finishClassComponent() right after rendering.

  let hasContext;

  if (isContextProvider()) {
    hasContext = true;
  } else {
    hasContext = false;
  }

  prepareToReadContext(workInProgress, renderLanes);
  constructClassInstance(workInProgress, Component, nextProps);
  mountClassInstance(workInProgress, Component, nextProps, renderLanes);
  return finishClassComponent(null, workInProgress, Component, true, hasContext, renderLanes);
}

function mountIndeterminateComponent(_current, workInProgress, Component, renderLanes) {
  if (_current !== null) {
    // An indeterminate component only mounts if it suspended inside a non-
    // concurrent tree, in an inconsistent state. We want to treat it like
    // a new mount, even though an empty version of it already committed.
    // Disconnect the alternate pointers.
    _current.alternate = null;
    workInProgress.alternate = null; // Since this is conceptually a new fiber, schedule a Placement effect

    workInProgress.flags |= Placement;
  }

  const props = workInProgress.pendingProps;
  let context;

  prepareToReadContext(workInProgress, renderLanes);
  let value;

  {
    value = renderWithHooks(null, workInProgress, Component, props, context, renderLanes);
  } // React DevTools reads this flag.


  workInProgress.flags |= PerformedWork;

  {
    // Proceed under the assumption that this is a function component
    workInProgress.tag = FunctionComponent;

    reconcileChildren(null, workInProgress, value, renderLanes);

    return workInProgress.child;
  }
}

const SUSPENDED_MARKER = {
  dehydrated: null,
  retryLane: NoLane
};

function mountSuspenseOffscreenState(renderLanes) {
  return {
    baseLanes: renderLanes
  };
}

function updateSuspenseOffscreenState(prevOffscreenState, renderLanes) {
  return {
    baseLanes: mergeLanes(prevOffscreenState.baseLanes, renderLanes)
  };
} // TODO: Probably should inline this back


function shouldRemainOnFallback(suspenseContext, current, workInProgress, renderLanes) {
  // If we're already showing a fallback, there are cases where we need to
  // remain on that fallback regardless of whether the content has resolved.
  // For example, SuspenseList coordinates when nested content appears.
  if (current !== null) {
    const suspenseState = current.memoizedState;

    if (suspenseState === null) {
      // Currently showing content. Don't hide it, even if ForceSuspenseFallack
      // is true. More precise name might be "ForceRemainSuspenseFallback".
      // Note: This is a factoring smell. Can't remain on a fallback if there's
      // no fallback to remain on.
      return false;
    }
  } // Not currently showing content. Consult the Suspense context.


  return hasSuspenseContext(suspenseContext, ForceSuspenseFallback);
}

function getRemainingWorkInPrimaryTree(current, renderLanes) {
  // TODO: Should not remove render lanes that were pinged during this render
  return removeLanes(current.childLanes, renderLanes);
}

function updateSuspenseComponent(current, workInProgress, renderLanes) {
  const nextProps = workInProgress.pendingProps; // This is used by DevTools to force a boundary to suspend.

  let suspenseContext = suspenseStackCursor.current;
  let showFallback = false;
  const didSuspend = (workInProgress.flags & DidCapture) !== NoFlags;

  if (didSuspend || shouldRemainOnFallback(suspenseContext, current)) {
    // Something in this boundary's subtree already suspended. Switch to
    // rendering the fallback children.
    showFallback = true;
    workInProgress.flags &= ~DidCapture;
  } else {
    // Attempting the main content
    if (current === null || current.memoizedState !== null) {
      // This is a new mount or this boundary is already showing a fallback state.
      // Mark this subtree context as having at least one invisible parent that could
      // handle the fallback state.
      // Boundaries without fallbacks or should be avoided are not considered since
      // they cannot handle preferred fallback states.
      if (nextProps.fallback !== undefined && nextProps.unstable_avoidThisFallback !== true) {
        suspenseContext = addSubtreeSuspenseContext(suspenseContext, InvisibleParentSuspenseContext);
      }
    }
  }

  suspenseContext = setDefaultShallowSuspenseContext(suspenseContext);
  pushSuspenseContext(workInProgress, suspenseContext); // OK, the next part is confusing. We're about to reconcile the Suspense
  // boundary's children. This involves some custom reconcilation logic. Two
  // main reasons this is so complicated.
  //
  // First, Legacy Mode has different semantics for backwards compatibility. The
  // primary tree will commit in an inconsistent state, so when we do the
  // second pass to render the fallback, we do some exceedingly, uh, clever
  // hacks to make that not totally break. Like transferring effects and
  // deletions from hidden tree. In Concurrent Mode, it's much simpler,
  // because we bailout on the primary tree completely and leave it in its old
  // state, no effects. Same as what we do for Offscreen (except that
  // Offscreen doesn't have the first render pass).
  //
  // Second is hydration. During hydration, the Suspense fiber has a slightly
  // different layout, where the child points to a dehydrated fragment, which
  // contains the DOM rendered by the server.
  //
  // Third, even if you set all that aside, Suspense is like error boundaries in
  // that we first we try to render one tree, and if that fails, we render again
  // and switch to a different tree. Like a try/catch block. So we have to track
  // which branch we're currently rendering. Ideally we would model this using
  // a stack.

  if (current === null) {
    // Initial mount
    // If we're currently hydrating, try to hydrate this boundary.
    // But only if this has a fallback.
    if (nextProps.fallback !== undefined) {

      {
        const suspenseState = workInProgress.memoizedState;

        if (suspenseState !== null) {
          const dehydrated = suspenseState.dehydrated;

          if (dehydrated !== null) {
            return mountDehydratedSuspenseComponent(workInProgress);
          }
        }
      }
    }

    const nextPrimaryChildren = nextProps.children;
    const nextFallbackChildren = nextProps.fallback;

    if (showFallback) {
      const fallbackFragment = mountSuspenseFallbackChildren(workInProgress, nextPrimaryChildren, nextFallbackChildren, renderLanes);
      const primaryChildFragment = workInProgress.child;
      primaryChildFragment.memoizedState = mountSuspenseOffscreenState(renderLanes);
      workInProgress.memoizedState = SUSPENDED_MARKER;
      return fallbackFragment;
    } else if (typeof nextProps.unstable_expectedLoadTime === 'number') {
      // This is a CPU-bound tree. Skip this tree and show a placeholder to
      // unblock the surrounding content. Then immediately retry after the
      // initial commit.
      const fallbackFragment = mountSuspenseFallbackChildren(workInProgress, nextPrimaryChildren, nextFallbackChildren, renderLanes);
      const primaryChildFragment = workInProgress.child;
      primaryChildFragment.memoizedState = mountSuspenseOffscreenState(renderLanes);
      workInProgress.memoizedState = SUSPENDED_MARKER; // Since nothing actually suspended, there will nothing to ping this to
      // get it started back up to attempt the next item. While in terms of
      // priority this work has the same priority as this current render, it's
      // not part of the same transition once the transition has committed. If
      // it's sync, we still want to yield so that it can be painted.
      // Conceptually, this is really the same as pinging. We can use any
      // RetryLane even if it's the one currently rendering since we're leaving
      // it behind on this node.

      workInProgress.lanes = SomeRetryLane;

      {
        markSpawnedWork(SomeRetryLane);
      }

      return fallbackFragment;
    } else {
      return mountSuspensePrimaryChildren(workInProgress, nextPrimaryChildren, renderLanes);
    }
  } else {
    // This is an update.
    // If the current fiber has a SuspenseState, that means it's already showing
    // a fallback.
    const prevState = current.memoizedState;

    if (prevState !== null) {
      // The current tree is already showing a fallback
      // Special path for hydration
      {
        const dehydrated = prevState.dehydrated;

        if (dehydrated !== null) {
          if (!didSuspend) {
            return updateDehydratedSuspenseComponent(current, workInProgress, dehydrated, prevState, renderLanes);
          } else if (workInProgress.memoizedState !== null) {
            // Something suspended and we should still be in dehydrated mode.
            // Leave the existing child in place.
            workInProgress.child = current.child; // The dehydrated completion pass expects this flag to be there
            // but the normal suspense pass doesn't.

            workInProgress.flags |= DidCapture;
            return null;
          } else {
            // Suspended but we should no longer be in dehydrated mode.
            // Therefore we now have to render the fallback.
            const nextPrimaryChildren = nextProps.children;
            const nextFallbackChildren = nextProps.fallback;
            const fallbackChildFragment = mountSuspenseFallbackAfterRetryWithoutHydrating(current, workInProgress, nextPrimaryChildren, nextFallbackChildren, renderLanes);
            const primaryChildFragment = workInProgress.child;
            primaryChildFragment.memoizedState = mountSuspenseOffscreenState(renderLanes);
            workInProgress.memoizedState = SUSPENDED_MARKER;
            return fallbackChildFragment;
          }
        }
      }

      if (showFallback) {
        const nextFallbackChildren = nextProps.fallback;
        const nextPrimaryChildren = nextProps.children;
        const fallbackChildFragment = updateSuspenseFallbackChildren(current, workInProgress, nextPrimaryChildren, nextFallbackChildren, renderLanes);
        const primaryChildFragment = workInProgress.child;
        const prevOffscreenState = current.child.memoizedState;
        primaryChildFragment.memoizedState = prevOffscreenState === null ? mountSuspenseOffscreenState(renderLanes) : updateSuspenseOffscreenState(prevOffscreenState, renderLanes);
        primaryChildFragment.childLanes = getRemainingWorkInPrimaryTree(current, renderLanes);
        workInProgress.memoizedState = SUSPENDED_MARKER;
        return fallbackChildFragment;
      } else {
        const nextPrimaryChildren = nextProps.children;
        const primaryChildFragment = updateSuspensePrimaryChildren(current, workInProgress, nextPrimaryChildren, renderLanes);
        workInProgress.memoizedState = null;
        return primaryChildFragment;
      }
    } else {
      // The current tree is not already showing a fallback.
      if (showFallback) {
        // Timed out.
        const nextFallbackChildren = nextProps.fallback;
        const nextPrimaryChildren = nextProps.children;
        const fallbackChildFragment = updateSuspenseFallbackChildren(current, workInProgress, nextPrimaryChildren, nextFallbackChildren, renderLanes);
        const primaryChildFragment = workInProgress.child;
        const prevOffscreenState = current.child.memoizedState;
        primaryChildFragment.memoizedState = prevOffscreenState === null ? mountSuspenseOffscreenState(renderLanes) : updateSuspenseOffscreenState(prevOffscreenState, renderLanes);
        primaryChildFragment.childLanes = getRemainingWorkInPrimaryTree(current, renderLanes); // Skip the primary children, and continue working on the
        // fallback children.

        workInProgress.memoizedState = SUSPENDED_MARKER;
        return fallbackChildFragment;
      } else {
        // Still haven't timed out. Continue rendering the children, like we
        // normally do.
        const nextPrimaryChildren = nextProps.children;
        const primaryChildFragment = updateSuspensePrimaryChildren(current, workInProgress, nextPrimaryChildren, renderLanes);
        workInProgress.memoizedState = null;
        return primaryChildFragment;
      }
    }
  }
}

function mountSuspensePrimaryChildren(workInProgress, primaryChildren, renderLanes) {
  const mode = workInProgress.mode;
  const primaryChildProps = {
    mode: 'visible',
    children: primaryChildren
  };
  const primaryChildFragment = createFiberFromOffscreen(primaryChildProps, mode, renderLanes, null);
  primaryChildFragment.return = workInProgress;
  workInProgress.child = primaryChildFragment;
  return primaryChildFragment;
}

function mountSuspenseFallbackChildren(workInProgress, primaryChildren, fallbackChildren, renderLanes) {
  const mode = workInProgress.mode;
  const progressedPrimaryFragment = workInProgress.child;
  const primaryChildProps = {
    mode: 'hidden',
    children: primaryChildren
  };
  let primaryChildFragment;
  let fallbackChildFragment;

  if ((mode & BlockingMode) === NoMode && progressedPrimaryFragment !== null) {
    // In legacy mode, we commit the primary tree as if it successfully
    // completed, even though it's in an inconsistent state.
    primaryChildFragment = progressedPrimaryFragment;
    primaryChildFragment.childLanes = NoLanes;
    primaryChildFragment.pendingProps = primaryChildProps;

    fallbackChildFragment = createFiberFromFragment(fallbackChildren, mode, renderLanes, null);
  } else {
    primaryChildFragment = createFiberFromOffscreen(primaryChildProps, mode, NoLanes, null);
    fallbackChildFragment = createFiberFromFragment(fallbackChildren, mode, renderLanes, null);
  }

  primaryChildFragment.return = workInProgress;
  fallbackChildFragment.return = workInProgress;
  primaryChildFragment.sibling = fallbackChildFragment;
  workInProgress.child = primaryChildFragment;
  return fallbackChildFragment;
}

function createWorkInProgressOffscreenFiber(current, offscreenProps) {
  // The props argument to `createWorkInProgress` is `any` typed, so we use this
  // wrapper function to constrain it.
  return createWorkInProgress(current, offscreenProps);
}

function updateSuspensePrimaryChildren(current, workInProgress, primaryChildren, renderLanes) {
  const currentPrimaryChildFragment = current.child;
  const currentFallbackChildFragment = currentPrimaryChildFragment.sibling;
  const primaryChildFragment = createWorkInProgressOffscreenFiber(currentPrimaryChildFragment, {
    mode: 'visible',
    children: primaryChildren
  });

  if ((workInProgress.mode & BlockingMode) === NoMode) {
    primaryChildFragment.lanes = renderLanes;
  }

  primaryChildFragment.return = workInProgress;
  primaryChildFragment.sibling = null;

  if (currentFallbackChildFragment !== null) {
    // Delete the fallback child fragment
    currentFallbackChildFragment.nextEffect = null;
    currentFallbackChildFragment.flags = Deletion;
    workInProgress.firstEffect = workInProgress.lastEffect = currentFallbackChildFragment;
  }

  workInProgress.child = primaryChildFragment;
  return primaryChildFragment;
}

function updateSuspenseFallbackChildren(current, workInProgress, primaryChildren, fallbackChildren, renderLanes) {
  const mode = workInProgress.mode;
  const currentPrimaryChildFragment = current.child;
  const currentFallbackChildFragment = currentPrimaryChildFragment.sibling;
  const primaryChildProps = {
    mode: 'hidden',
    children: primaryChildren
  };
  let primaryChildFragment;

  if ( // In legacy mode, we commit the primary tree as if it successfully
  // completed, even though it's in an inconsistent state.
  (mode & BlockingMode) === NoMode && // Make sure we're on the second pass, i.e. the primary child fragment was
  // already cloned. In legacy mode, the only case where this isn't true is
  // when DevTools forces us to display a fallback; we skip the first render
  // pass entirely and go straight to rendering the fallback. (In Concurrent
  // Mode, SuspenseList can also trigger this scenario, but this is a legacy-
  // only codepath.)
  workInProgress.child !== currentPrimaryChildFragment) {
    const progressedPrimaryFragment = workInProgress.child;
    primaryChildFragment = progressedPrimaryFragment;
    primaryChildFragment.childLanes = NoLanes;
    primaryChildFragment.pendingProps = primaryChildProps;
    // However, since we're going to remain on the fallback, we no longer want
    // to delete it. So we need to remove it from the list. Deletions are stored
    // on the same list as effects. We want to keep the effects from the primary
    // tree. So we copy the primary child fragment's effect list, which does not
    // include the fallback deletion effect.


    const progressedLastEffect = primaryChildFragment.lastEffect;

    if (progressedLastEffect !== null) {
      workInProgress.firstEffect = primaryChildFragment.firstEffect;
      workInProgress.lastEffect = progressedLastEffect;
      progressedLastEffect.nextEffect = null;
    } else {
      // TODO: Reset this somewhere else? Lol legacy mode is so weird.
      workInProgress.firstEffect = workInProgress.lastEffect = null;
    }
  } else {
    primaryChildFragment = createWorkInProgressOffscreenFiber(currentPrimaryChildFragment, primaryChildProps);
  }

  let fallbackChildFragment;

  if (currentFallbackChildFragment !== null) {
    fallbackChildFragment = createWorkInProgress(currentFallbackChildFragment, fallbackChildren);
  } else {
    fallbackChildFragment = createFiberFromFragment(fallbackChildren, mode, renderLanes, null); // Needs a placement effect because the parent (the Suspense boundary) already
    // mounted but this is a new fiber.

    fallbackChildFragment.flags |= Placement;
  }

  fallbackChildFragment.return = workInProgress;
  primaryChildFragment.return = workInProgress;
  primaryChildFragment.sibling = fallbackChildFragment;
  workInProgress.child = primaryChildFragment;
  return fallbackChildFragment;
}

function retrySuspenseComponentWithoutHydrating(current, workInProgress, renderLanes) {
  // This will add the old fiber to the deletion list
  reconcileChildFibers(workInProgress, current.child, null, renderLanes); // We're now not suspended nor dehydrated.

  const nextProps = workInProgress.pendingProps;
  const primaryChildren = nextProps.children;
  const primaryChildFragment = mountSuspensePrimaryChildren(workInProgress, primaryChildren, renderLanes); // Needs a placement effect because the parent (the Suspense boundary) already
  // mounted but this is a new fiber.

  primaryChildFragment.flags |= Placement;
  workInProgress.memoizedState = null;
  return primaryChildFragment;
}

function mountSuspenseFallbackAfterRetryWithoutHydrating(current, workInProgress, primaryChildren, fallbackChildren, renderLanes) {
  const mode = workInProgress.mode;
  const primaryChildFragment = createFiberFromOffscreen(primaryChildren, mode, NoLanes, null);
  const fallbackChildFragment = createFiberFromFragment(fallbackChildren, mode, renderLanes, null); // Needs a placement effect because the parent (the Suspense
  // boundary) already mounted but this is a new fiber.

  fallbackChildFragment.flags |= Placement;
  primaryChildFragment.return = workInProgress;
  fallbackChildFragment.return = workInProgress;
  primaryChildFragment.sibling = fallbackChildFragment;
  workInProgress.child = primaryChildFragment;

  if ((workInProgress.mode & BlockingMode) !== NoMode) {
    // We will have dropped the effect list which contains the
    // deletion. We need to reconcile to delete the current child.
    reconcileChildFibers(workInProgress, current.child, null, renderLanes);
  }

  return fallbackChildFragment;
}

function mountDehydratedSuspenseComponent(workInProgress, suspenseInstance, renderLanes) {
  // During the first pass, we'll bail out and not drill into the children.
  // Instead, we'll leave the content in place and try to hydrate it later.
  if ((workInProgress.mode & BlockingMode) === NoMode) {

    workInProgress.lanes = laneToLanes(SyncLane);
  } else if (isSuspenseInstanceFallback()) {
    // This is a client-only boundary. Since we won't get any content from the server
    // for this, we need to schedule that at a higher priority based on when it would
    // have timed out. In theory we could render it in this pass but it would have the
    // wrong priority associated with it and will prevent hydration of parent path.
    // Instead, we'll leave work left on it to render it in a separate commit.
    // TODO This time should be the time at which the server rendered response that is
    // a parent to this boundary was displayed. However, since we currently don't have
    // a protocol to transfer that time, we'll just estimate it by using the current
    // time. This will mean that Suspense timeouts are slightly shifted to later than
    // they should be.
    // Schedule a normal pri update to render this content.
    {
      markSpawnedWork(DefaultHydrationLane);
    }

    workInProgress.lanes = laneToLanes(DefaultHydrationLane);
  } else {
    // We'll continue hydrating the rest at offscreen priority since we'll already
    // be showing the right content coming from the server, it is no rush.
    workInProgress.lanes = laneToLanes(OffscreenLane);

    {
      markSpawnedWork(OffscreenLane);
    }
  }

  return null;
}

function updateDehydratedSuspenseComponent(current, workInProgress, suspenseInstance, suspenseState, renderLanes) {

  if ((getExecutionContext() & RetryAfterError) !== NoContext) {
    return retrySuspenseComponentWithoutHydrating(current, workInProgress, renderLanes);
  }

  if ((workInProgress.mode & BlockingMode) === NoMode) {
    return retrySuspenseComponentWithoutHydrating(current, workInProgress, renderLanes);
  }

  if (isSuspenseInstanceFallback()) {
    // This boundary is in a permanent fallback state. In this case, we'll never
    // get an update and we'll never be able to hydrate the final content. Let's just try the
    // client side render instead.
    return retrySuspenseComponentWithoutHydrating(current, workInProgress, renderLanes);
  } // We use lanes to indicate that a child might depend on context, so if
  // any context has changed, we need to treat is as if the input might have changed.


  const hasContextChanged = includesSomeLane(renderLanes, current.childLanes);

  if (didReceiveUpdate || hasContextChanged) {
    // This boundary has changed since the first render. This means that we are now unable to
    // hydrate it. We might still be able to hydrate it using a higher priority lane.
    const root = getWorkInProgressRoot();

    if (root !== null) {
      const attemptHydrationAtLane = getBumpedLaneForHydration(root, renderLanes);

      if (attemptHydrationAtLane !== NoLane && attemptHydrationAtLane !== suspenseState.retryLane) {
        // Intentionally mutating since this render will get interrupted. This
        // is one of the very rare times where we mutate the current tree
        // during the render phase.
        suspenseState.retryLane = attemptHydrationAtLane; // TODO: Ideally this would inherit the event time of the current render

        const eventTime = NoTimestamp;
        scheduleUpdateOnFiber(current, attemptHydrationAtLane, eventTime);
      }
    } // If we have scheduled higher pri work above, this will probably just abort the render
    // since we now have higher priority work, but in case it doesn't, we need to prepare to
    // render something, if we time out. Even if that requires us to delete everything and
    // skip hydration.
    // Delay having to do this as long as the suspense timeout allows us.


    renderDidSuspendDelayIfPossible();
    return retrySuspenseComponentWithoutHydrating(current, workInProgress, renderLanes);
  } else if (isSuspenseInstancePending()) {
    // This component is still pending more data from the server, so we can't hydrate its
    // content. We treat it as if this component suspended itself. It might seem as if
    // we could just try to render it client-side instead. However, this will perform a
    // lot of unnecessary work and is unlikely to complete since it often will suspend
    // on missing data anyway. Additionally, the server might be able to render more
    // than we can on the client yet. In that case we'd end up with more fallback states
    // on the client than if we just leave it alone. If the server times out or errors
    // these should update this boundary to the permanent Fallback state instead.
    // Mark it as having captured (i.e. suspended).
    workInProgress.flags |= DidCapture; // Leave the child in place. I.e. the dehydrated fragment.

    workInProgress.child = current.child; // Register a callback to retry this boundary once the server has sent the result.

    let retry = retryDehydratedSuspenseBoundary.bind(null, current);

    {
      retry = tracing.unstable_wrap(retry);
    }

    registerSuspenseInstanceRetry();
    return null;
  } else {
    const nextProps = workInProgress.pendingProps;
    const primaryChildren = nextProps.children;
    const primaryChildFragment = mountSuspensePrimaryChildren(workInProgress, primaryChildren, renderLanes); // Mark the children as hydrating. This is a fast path to know whether this
    // tree is part of a hydrating tree. This is used to determine if a child
    // node has fully mounted yet, and for scheduling event replaying.
    // Conceptually this is similar to Placement in that a new subtree is
    // inserted into the React tree here. It just happens to not need DOM
    // mutations because it already exists.

    primaryChildFragment.flags |= Hydrating;
    return primaryChildFragment;
  }
}

function scheduleWorkOnFiber(fiber, renderLanes) {
  fiber.lanes = mergeLanes(fiber.lanes, renderLanes);
  const alternate = fiber.alternate;

  if (alternate !== null) {
    alternate.lanes = mergeLanes(alternate.lanes, renderLanes);
  }

  scheduleWorkOnParentPath(fiber.return, renderLanes);
}

function propagateSuspenseContextChange(workInProgress, firstChild, renderLanes) {
  // Mark any Suspense boundaries with fallbacks as having work to do.
  // If they were previously forced into fallbacks, they may now be able
  // to unblock.
  let node = firstChild;

  while (node !== null) {
    if (node.tag === SuspenseComponent) {
      const state = node.memoizedState;

      if (state !== null) {
        scheduleWorkOnFiber(node, renderLanes);
      }
    } else if (node.tag === SuspenseListComponent) {
      // If the tail is hidden there might not be an Suspense boundaries
      // to schedule work on. In this case we have to schedule it on the
      // list itself.
      // We don't have to traverse to the children of the list since
      // the list will propagate the change when it rerenders.
      scheduleWorkOnFiber(node, renderLanes);
    } else if (node.child !== null) {
      node.child.return = node;
      node = node.child;
      continue;
    }

    if (node === workInProgress) {
      return;
    }

    while (node.sibling === null) {
      if (node.return === null || node.return === workInProgress) {
        return;
      }

      node = node.return;
    }

    node.sibling.return = node.return;
    node = node.sibling;
  }
}

function findLastContentRow(firstChild) {
  // This is going to find the last row among these children that is already
  // showing content on the screen, as opposed to being in fallback state or
  // new. If a row has multiple Suspense boundaries, any of them being in the
  // fallback state, counts as the whole row being in a fallback state.
  // Note that the "rows" will be workInProgress, but any nested children
  // will still be current since we haven't rendered them yet. The mounted
  // order may not be the same as the new order. We use the new order.
  let row = firstChild;
  let lastContentRow = null;

  while (row !== null) {
    const currentRow = row.alternate; // New rows can't be content rows.

    if (currentRow !== null && findFirstSuspended(currentRow) === null) {
      lastContentRow = row;
    }

    row = row.sibling;
  }

  return lastContentRow;
}

function initSuspenseListRenderState(workInProgress, isBackwards, tail, lastContentRow, tailMode, lastEffectBeforeRendering) {
  const renderState = workInProgress.memoizedState;

  if (renderState === null) {
    workInProgress.memoizedState = {
      isBackwards: isBackwards,
      rendering: null,
      renderingStartTime: 0,
      last: lastContentRow,
      tail: tail,
      tailMode: tailMode,
      lastEffect: lastEffectBeforeRendering
    };
  } else {
    // We can reuse the existing object from previous renders.
    renderState.isBackwards = isBackwards;
    renderState.rendering = null;
    renderState.renderingStartTime = 0;
    renderState.last = lastContentRow;
    renderState.tail = tail;
    renderState.tailMode = tailMode;
    renderState.lastEffect = lastEffectBeforeRendering;
  }
} // This can end up rendering this component multiple passes.
// The first pass splits the children fibers into two sets. A head and tail.
// We first render the head. If anything is in fallback state, we do another
// pass through beginWork to rerender all children (including the tail) with
// the force suspend context. If the first render didn't have anything in
// in fallback state. Then we render each row in the tail one-by-one.
// That happens in the completeWork phase without going back to beginWork.


function updateSuspenseListComponent(current, workInProgress, renderLanes) {
  const nextProps = workInProgress.pendingProps;
  const revealOrder = nextProps.revealOrder;
  const tailMode = nextProps.tail;
  const newChildren = nextProps.children;
  reconcileChildren(current, workInProgress, newChildren, renderLanes);
  let suspenseContext = suspenseStackCursor.current;
  const shouldForceFallback = hasSuspenseContext(suspenseContext, ForceSuspenseFallback);

  if (shouldForceFallback) {
    suspenseContext = setShallowSuspenseContext(suspenseContext, ForceSuspenseFallback);
    workInProgress.flags |= DidCapture;
  } else {
    const didSuspendBefore = current !== null && (current.flags & DidCapture) !== NoFlags;

    if (didSuspendBefore) {
      // If we previously forced a fallback, we need to schedule work
      // on any nested boundaries to let them know to try to render
      // again. This is the same as context updating.
      propagateSuspenseContextChange(workInProgress, workInProgress.child, renderLanes);
    }

    suspenseContext = setDefaultShallowSuspenseContext(suspenseContext);
  }

  pushSuspenseContext(workInProgress, suspenseContext);

  if ((workInProgress.mode & BlockingMode) === NoMode) {
    // In legacy mode, SuspenseList doesn't work so we just
    // use make it a noop by treating it as the default revealOrder.
    workInProgress.memoizedState = null;
  } else {
    switch (revealOrder) {
      case 'forwards':
        {
          const lastContentRow = findLastContentRow(workInProgress.child);
          let tail;

          if (lastContentRow === null) {
            // The whole list is part of the tail.
            // TODO: We could fast path by just rendering the tail now.
            tail = workInProgress.child;
            workInProgress.child = null;
          } else {
            // Disconnect the tail rows after the content row.
            // We're going to render them separately later.
            tail = lastContentRow.sibling;
            lastContentRow.sibling = null;
          }

          initSuspenseListRenderState(workInProgress, false, // isBackwards
          tail, lastContentRow, tailMode, workInProgress.lastEffect);
          break;
        }

      case 'backwards':
        {
          // We're going to find the first row that has existing content.
          // At the same time we're going to reverse the list of everything
          // we pass in the meantime. That's going to be our tail in reverse
          // order.
          let tail = null;
          let row = workInProgress.child;
          workInProgress.child = null;

          while (row !== null) {
            const currentRow = row.alternate; // New rows can't be content rows.

            if (currentRow !== null && findFirstSuspended(currentRow) === null) {
              // This is the beginning of the main content.
              workInProgress.child = row;
              break;
            }

            const nextRow = row.sibling;
            row.sibling = tail;
            tail = row;
            row = nextRow;
          } // TODO: If workInProgress.child is null, we can continue on the tail immediately.


          initSuspenseListRenderState(workInProgress, true, // isBackwards
          tail, null, // last
          tailMode, workInProgress.lastEffect);
          break;
        }

      case 'together':
        {
          initSuspenseListRenderState(workInProgress, false, // isBackwards
          null, // tail
          null, // last
          undefined, workInProgress.lastEffect);
          break;
        }

      default:
        {
          // The default reveal order is the same as not having
          // a boundary.
          workInProgress.memoizedState = null;
        }
    }
  }

  return workInProgress.child;
}

function updatePortalComponent(current, workInProgress, renderLanes) {
  pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);
  const nextChildren = workInProgress.pendingProps;

  if (current === null) {
    // Portals are special because we don't append the children during mount
    // but at commit. Therefore we need to track insertions which the normal
    // flow doesn't do during mount. This doesn't happen at the root because
    // the root always starts with a "current" with a null child.
    // TODO: Consider unifying this with how the root works.
    workInProgress.child = reconcileChildFibers(workInProgress, null, nextChildren, renderLanes);
  } else {
    reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  }

  return workInProgress.child;
}

function updateContextProvider(current, workInProgress, renderLanes) {
  const providerType = workInProgress.type;
  const context = providerType._context;
  const newProps = workInProgress.pendingProps;
  const oldProps = workInProgress.memoizedProps;
  const newValue = newProps.value;

  pushProvider(workInProgress, newValue);

  if (oldProps !== null) {
    const oldValue = oldProps.value;
    const changedBits = calculateChangedBits(context, newValue, oldValue);

    if (changedBits === 0) {
      // No change. Bailout early if children are the same.
      if (oldProps.children === newProps.children && !hasContextChanged()) {
        return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
      }
    } else {
      // The context value changed. Search for matching consumers and schedule
      // them to update.
      propagateContextChange(workInProgress, context, changedBits, renderLanes);
    }
  }

  const newChildren = newProps.children;
  reconcileChildren(current, workInProgress, newChildren, renderLanes);
  return workInProgress.child;
}

function updateContextConsumer(current, workInProgress, renderLanes) {
  let context = workInProgress.type; // The logic below for Context differs depending on PROD or DEV mode. In

  const newProps = workInProgress.pendingProps;
  const render = newProps.children;

  prepareToReadContext(workInProgress, renderLanes);
  const newValue = readContext(context, newProps.unstable_observedBits);
  let newChildren;

  {
    newChildren = render(newValue);
  } // React DevTools reads this flag.


  workInProgress.flags |= PerformedWork;
  reconcileChildren(current, workInProgress, newChildren, renderLanes);
  return workInProgress.child;
}

function updateScopeComponent(current, workInProgress, renderLanes) {
  const nextProps = workInProgress.pendingProps;
  const nextChildren = nextProps.children;
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}

function markWorkInProgressReceivedUpdate() {
  didReceiveUpdate = true;
}

function bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes) {
  if (current !== null) {
    // Reuse previous dependencies
    workInProgress.dependencies = current.dependencies;
  }

  markSkippedUpdateLanes(workInProgress.lanes); // Check if the children have any pending work.

  if (!includesSomeLane(renderLanes, workInProgress.childLanes)) {
    // The children don't have any work either. We can skip them.
    // TODO: Once we add back resuming, we should check if the children are
    // a work-in-progress set. If so, we need to transfer their effects.
    return null;
  } else {
    // This fiber doesn't have work, but its subtree does. Clone the child
    // fibers and continue.
    cloneChildFibers(current, workInProgress);
    return workInProgress.child;
  }
}

function beginWork(current, workInProgress, renderLanes) {
  const updateLanes = workInProgress.lanes;

  if (current !== null) {
    const oldProps = current.memoizedProps;
    const newProps = workInProgress.pendingProps;

    if (oldProps !== newProps || hasContextChanged() || ( // Force a re-render if the implementation changed due to hot reload:
     false)) {
      // If props or context changed, mark the fiber as having performed work.
      // This may be unset if the props are determined to be equal later (memo).
      didReceiveUpdate = true;
    } else if (!includesSomeLane(renderLanes, updateLanes)) {
      didReceiveUpdate = false; // This fiber does not have any pending work. Bailout without entering
      // the begin phase. There's still some bookkeeping we that needs to be done
      // in this optimized path, mostly pushing stuff onto the stack.

      switch (workInProgress.tag) {
        case HostRoot:
          pushHostRootContext(workInProgress);
          break;

        case HostComponent:
          pushHostContext(workInProgress);
          break;

        case ClassComponent:
          {
            const Component = workInProgress.type;

            break;
          }

        case HostPortal:
          pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);
          break;

        case ContextProvider:
          {
            const newValue = workInProgress.memoizedProps.value;
            pushProvider(workInProgress, newValue);
            break;
          }

        case Profiler:

          break;

        case SuspenseComponent:
          {
            const state = workInProgress.memoizedState;

            if (state !== null) {
              {
                if (state.dehydrated !== null) {
                  pushSuspenseContext(workInProgress, setDefaultShallowSuspenseContext(suspenseStackCursor.current)); // We know that this component will suspend again because if it has
                  // been unsuspended it has committed as a resolved Suspense component.
                  // If it needs to be retried, it should have work scheduled on it.

                  workInProgress.flags |= DidCapture; // We should never render the children of a dehydrated boundary until we
                  // upgrade it. We return null instead of bailoutOnAlreadyFinishedWork.

                  return null;
                }
              } // If this boundary is currently timed out, we need to decide
              // whether to retry the primary children, or to skip over it and
              // go straight to the fallback. Check the priority of the primary
              // child fragment.


              const primaryChildFragment = workInProgress.child;
              const primaryChildLanes = primaryChildFragment.childLanes;

              if (includesSomeLane(renderLanes, primaryChildLanes)) {
                // The primary children have pending work. Use the normal path
                // to attempt to render the primary children again.
                return updateSuspenseComponent(current, workInProgress, renderLanes);
              } else {
                // The primary child fragment does not have pending work marked
                // on it
                pushSuspenseContext(workInProgress, setDefaultShallowSuspenseContext(suspenseStackCursor.current)); // The primary children do not have pending work with sufficient
                // priority. Bailout.

                const child = bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);

                if (child !== null) {
                  // The fallback children have pending work. Skip over the
                  // primary children and work on the fallback.
                  return child.sibling;
                } else {
                  return null;
                }
              }
            } else {
              pushSuspenseContext(workInProgress, setDefaultShallowSuspenseContext(suspenseStackCursor.current));
            }

            break;
          }

        case SuspenseListComponent:
          {
            const didSuspendBefore = (current.flags & DidCapture) !== NoFlags;
            const hasChildWork = includesSomeLane(renderLanes, workInProgress.childLanes);

            if (didSuspendBefore) {
              if (hasChildWork) {
                // If something was in fallback state last time, and we have all the
                // same children then we're still in progressive loading state.
                // Something might get unblocked by state updates or retries in the
                // tree which will affect the tail. So we need to use the normal
                // path to compute the correct tail.
                return updateSuspenseListComponent(current, workInProgress, renderLanes);
              } // If none of the children had any work, that means that none of
              // them got retried so they'll still be blocked in the same way
              // as before. We can fast bail out.


              workInProgress.flags |= DidCapture;
            } // If nothing suspended before and we're rendering the same children,
            // then the tail doesn't matter. Anything new that suspends will work
            // in the "together" mode, so we can continue from the state we had.


            const renderState = workInProgress.memoizedState;

            if (renderState !== null) {
              // Reset to the "together" mode in case we've started a different
              // update in the past but didn't complete it.
              renderState.rendering = null;
              renderState.tail = null;
              renderState.lastEffect = null;
            }

            pushSuspenseContext(workInProgress, suspenseStackCursor.current);

            if (hasChildWork) {
              break;
            } else {
              // If none of the children had any work, that means that none of
              // them got retried so they'll still be blocked in the same way
              // as before. We can fast bail out.
              return null;
            }
          }

        case OffscreenComponent:
        case LegacyHiddenComponent:
          {
            // Need to check if the tree still needs to be deferred. This is
            // almost identical to the logic used in the normal update path,
            // so we'll just enter that. The only difference is we'll bail out
            // at the next level instead of this one, because the child props
            // have not changed. Which is fine.
            // TODO: Probably should refactor `beginWork` to split the bailout
            // path from the normal path. I'm tempted to do a labeled break here
            // but I won't :)
            workInProgress.lanes = NoLanes;
            return updateOffscreenComponent(current, workInProgress, renderLanes);
          }
      }

      return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
    } else {
      if ((current.flags & ForceUpdateForLegacySuspense) !== NoFlags) {
        // This is a special case that only exists for legacy mode.
        // See https://github.com/facebook/react/pull/19216.
        didReceiveUpdate = true;
      } else {
        // An update was scheduled on this fiber, but there are no new props
        // nor legacy context. Set this to false. If an update queue or context
        // consumer produces a changed value, it will set this to true. Otherwise,
        // the component will assume the children have not changed and bail out.
        didReceiveUpdate = false;
      }
    }
  } else {
    didReceiveUpdate = false;
  } // Before entering the begin phase, clear pending update priority.
  // TODO: This assumes that we're about to evaluate the component and process
  // the update queue. However, there's an exception: SimpleMemoComponent
  // sometimes bails out later in the begin phase. This indicates that we should
  // move this assignment out of the common path and into each branch.


  workInProgress.lanes = NoLanes;

  switch (workInProgress.tag) {
    case IndeterminateComponent:
      {
        return mountIndeterminateComponent(current, workInProgress, workInProgress.type, renderLanes);
      }

    case LazyComponent:
      {
        const elementType = workInProgress.elementType;
        return mountLazyComponent(current, workInProgress, elementType, updateLanes, renderLanes);
      }

    case FunctionComponent:
      {
        const Component = workInProgress.type;
        const unresolvedProps = workInProgress.pendingProps;
        const resolvedProps = workInProgress.elementType === Component ? unresolvedProps : resolveDefaultProps(Component, unresolvedProps);
        return updateFunctionComponent(current, workInProgress, Component, resolvedProps, renderLanes);
      }

    case ClassComponent:
      {
        const Component = workInProgress.type;
        const unresolvedProps = workInProgress.pendingProps;
        const resolvedProps = workInProgress.elementType === Component ? unresolvedProps : resolveDefaultProps(Component, unresolvedProps);
        return updateClassComponent(current, workInProgress, Component, resolvedProps, renderLanes);
      }

    case HostRoot:
      return updateHostRoot(current, workInProgress, renderLanes);

    case HostComponent:
      return updateHostComponent(current, workInProgress, renderLanes);

    case HostText:
      return updateHostText();

    case SuspenseComponent:
      return updateSuspenseComponent(current, workInProgress, renderLanes);

    case HostPortal:
      return updatePortalComponent(current, workInProgress, renderLanes);

    case ForwardRef:
      {
        const type = workInProgress.type;
        const unresolvedProps = workInProgress.pendingProps;
        const resolvedProps = workInProgress.elementType === type ? unresolvedProps : resolveDefaultProps(type, unresolvedProps);
        return updateForwardRef(current, workInProgress, type, resolvedProps, renderLanes);
      }

    case Fragment:
      return updateFragment(current, workInProgress, renderLanes);

    case Mode:
      return updateMode(current, workInProgress, renderLanes);

    case Profiler:
      return updateProfiler(current, workInProgress, renderLanes);

    case ContextProvider:
      return updateContextProvider(current, workInProgress, renderLanes);

    case ContextConsumer:
      return updateContextConsumer(current, workInProgress, renderLanes);

    case MemoComponent:
      {
        const type = workInProgress.type;
        const unresolvedProps = workInProgress.pendingProps; // Resolve outer props first, then resolve inner props.

        let resolvedProps = resolveDefaultProps(type, unresolvedProps);

        resolvedProps = resolveDefaultProps(type.type, resolvedProps);
        return updateMemoComponent(current, workInProgress, type, resolvedProps, updateLanes, renderLanes);
      }

    case SimpleMemoComponent:
      {
        return updateSimpleMemoComponent(current, workInProgress, workInProgress.type, workInProgress.pendingProps, updateLanes, renderLanes);
      }

    case IncompleteClassComponent:
      {
        const Component = workInProgress.type;
        const unresolvedProps = workInProgress.pendingProps;
        const resolvedProps = workInProgress.elementType === Component ? unresolvedProps : resolveDefaultProps(Component, unresolvedProps);
        return mountIncompleteClassComponent(current, workInProgress, Component, resolvedProps, renderLanes);
      }

    case SuspenseListComponent:
      {
        return updateSuspenseListComponent(current, workInProgress, renderLanes);
      }

    case FundamentalComponent:
      {

        break;
      }

    case ScopeComponent:
      {
        {
          return updateScopeComponent(current, workInProgress, renderLanes);
        }
      }

    case Block:
      {
        {
          const block = workInProgress.type;
          const props = workInProgress.pendingProps;
          return updateBlock(current, workInProgress, block, props, renderLanes);
        }
      }

    case OffscreenComponent:
      {
        return updateOffscreenComponent(current, workInProgress, renderLanes);
      }

    case LegacyHiddenComponent:
      {
        return updateLegacyHiddenComponent(current, workInProgress, renderLanes);
      }
  }

  {
    {
      throw Error( formatProdErrorMessage(156, workInProgress.tag));
    }
  }
}

function getSuspenseFallbackChild(fiber) {
  return fiber.child.sibling.child;
}

const emptyObject = {};

function collectScopedNodes(node, fn, scopedNodes) {
  {
    if (node.tag === HostComponent) {
      const type = node.type,
            memoizedProps = node.memoizedProps,
            stateNode = node.stateNode;
      const instance = getPublicInstance(stateNode);

      if (instance !== null && fn(type, memoizedProps || emptyObject, instance) === true) {
        scopedNodes.push(instance);
      }
    }

    let child = node.child;

    if (isFiberSuspenseAndTimedOut(node)) {
      child = getSuspenseFallbackChild(node);
    }

    if (child !== null) {
      collectScopedNodesFromChildren(child, fn, scopedNodes);
    }
  }
}

function collectFirstScopedNode(node, fn) {
  {
    if (node.tag === HostComponent) {
      const type = node.type,
            memoizedProps = node.memoizedProps,
            stateNode = node.stateNode;
      const instance = getPublicInstance(stateNode);

      if (instance !== null && fn(type, memoizedProps, instance) === true) {
        return instance;
      }
    }

    let child = node.child;

    if (isFiberSuspenseAndTimedOut(node)) {
      child = getSuspenseFallbackChild(node);
    }

    if (child !== null) {
      return collectFirstScopedNodeFromChildren(child, fn);
    }
  }

  return null;
}

function collectScopedNodesFromChildren(startingChild, fn, scopedNodes) {
  let child = startingChild;

  while (child !== null) {
    collectScopedNodes(child, fn, scopedNodes);
    child = child.sibling;
  }
}

function collectFirstScopedNodeFromChildren(startingChild, fn) {
  let child = startingChild;

  while (child !== null) {
    const scopedNode = collectFirstScopedNode(child, fn);

    if (scopedNode !== null) {
      return scopedNode;
    }

    child = child.sibling;
  }

  return null;
}

function collectNearestContextValues(node, context, childContextValues) {
  if (node.tag === ContextProvider && node.type._context === context) {
    const contextValue = node.memoizedProps.value;
    childContextValues.push(contextValue);
  } else {
    let child = node.child;

    if (isFiberSuspenseAndTimedOut(node)) {
      child = getSuspenseFallbackChild(node);
    }

    if (child !== null) {
      collectNearestChildContextValues(child, context, childContextValues);
    }
  }
}

function collectNearestChildContextValues(startingChild, context, childContextValues) {
  let child = startingChild;

  while (child !== null) {
    collectNearestContextValues(child, context, childContextValues);
    child = child.sibling;
  }
}

function DO_NOT_USE_queryAllNodes(fn) {
  const currentFiber = getInstanceFromScope();

  if (currentFiber === null) {
    return null;
  }

  const child = currentFiber.child;
  const scopedNodes = [];

  if (child !== null) {
    collectScopedNodesFromChildren(child, fn, scopedNodes);
  }

  return scopedNodes.length === 0 ? null : scopedNodes;
}

function DO_NOT_USE_queryFirstNode(fn) {
  const currentFiber = getInstanceFromScope();

  if (currentFiber === null) {
    return null;
  }

  const child = currentFiber.child;

  if (child !== null) {
    return collectFirstScopedNodeFromChildren(child, fn);
  }

  return null;
}

function containsNode(node) {
  let fiber = getInstanceFromNode();

  while (fiber !== null) {
    if (fiber.tag === ScopeComponent && fiber.stateNode === this) {
      return true;
    }

    fiber = fiber.return;
  }

  return false;
}

function getChildContextValues(context) {
  const currentFiber = getInstanceFromScope();

  if (currentFiber === null) {
    return [];
  }

  const child = currentFiber.child;
  const childContextValues = [];

  if (child !== null) {
    collectNearestChildContextValues(child, context, childContextValues);
  }

  return childContextValues;
}

function createScopeInstance() {
  return {
    DO_NOT_USE_queryAllNodes,
    DO_NOT_USE_queryFirstNode,
    containsNode,
    getChildContextValues
  };
}

function markUpdate(workInProgress) {
  // Tag the fiber with an update effect. This turns a Placement into
  // a PlacementAndUpdate.
  workInProgress.flags |= Update;
}

function markRef$1(workInProgress) {
  workInProgress.flags |= Ref;
}

let appendAllChildren;
let updateHostContainer;
let updateHostComponent$1;
let updateHostText$1;

{
  // Mutation mode
  appendAllChildren = function (parent, workInProgress, needsVisibilityToggle, isHidden) {
    // We only have the top Fiber that was created but we need recurse down its
    // children to find all the terminal nodes.
    let node = workInProgress.child;

    while (node !== null) {
      if (node.tag === HostComponent || node.tag === HostText) {
        appendInitialChild(parent, node.stateNode);
      } else if (node.tag === HostPortal) ; else if (node.child !== null) {
        node.child.return = node;
        node = node.child;
        continue;
      }

      if (node === workInProgress) {
        return;
      }

      while (node.sibling === null) {
        if (node.return === null || node.return === workInProgress) {
          return;
        }

        node = node.return;
      }

      node.sibling.return = node.return;
      node = node.sibling;
    }
  };

  updateHostContainer = function (workInProgress) {// Noop
  };

  updateHostComponent$1 = function (current, workInProgress, type, newProps, rootContainerInstance) {
    // If we have an alternate, that means this is an update and we need to
    // schedule a side-effect to do the updates.
    const oldProps = current.memoizedProps;

    if (oldProps === newProps) {
      // In mutation mode, this is sufficient for a bailout because
      // we won't touch this node even if children changed.
      return;
    } // If we get updated because one of our children updated, we don't
    // have newProps so we'll have to reuse them.
    // TODO: Split the update API as separate for the props vs. children.
    // Even better would be if children weren't special cased at all tho.


    const instance = workInProgress.stateNode;
    const currentHostContext = getHostContext(); // TODO: Experiencing an error where oldProps is null. Suggests a host
    // component is hitting the resume path. Figure out why. Possibly
    // related to `hidden`.

    const updatePayload = prepareUpdate(); // TODO: Type this specific to this type of component.

    workInProgress.updateQueue = updatePayload; // If the update payload indicates that there is a change or if there
    // is a new ref we mark this as an update. All the work is done in commitWork.

    if (updatePayload) {
      markUpdate(workInProgress);
    }
  };

  updateHostText$1 = function (current, workInProgress, oldText, newText) {
    // If the text differs, mark it as an update. All the work in done in commitWork.
    if (oldText !== newText) {
      markUpdate(workInProgress);
    }
  };
}

function cutOffTailIfNeeded(renderState, hasRenderedATailFallback) {

  switch (renderState.tailMode) {
    case 'hidden':
      {
        // Any insertions at the end of the tail list after this point
        // should be invisible. If there are already mounted boundaries
        // anything before them are not considered for collapsing.
        // Therefore we need to go through the whole tail to find if
        // there are any.
        let tailNode = renderState.tail;
        let lastTailNode = null;

        while (tailNode !== null) {
          if (tailNode.alternate !== null) {
            lastTailNode = tailNode;
          }

          tailNode = tailNode.sibling;
        } // Next we're simply going to delete all insertions after the
        // last rendered item.


        if (lastTailNode === null) {
          // All remaining items in the tail are insertions.
          renderState.tail = null;
        } else {
          // Detach the insertion after the last node that was already
          // inserted.
          lastTailNode.sibling = null;
        }

        break;
      }

    case 'collapsed':
      {
        // Any insertions at the end of the tail list after this point
        // should be invisible. If there are already mounted boundaries
        // anything before them are not considered for collapsing.
        // Therefore we need to go through the whole tail to find if
        // there are any.
        let tailNode = renderState.tail;
        let lastTailNode = null;

        while (tailNode !== null) {
          if (tailNode.alternate !== null) {
            lastTailNode = tailNode;
          }

          tailNode = tailNode.sibling;
        } // Next we're simply going to delete all insertions after the
        // last rendered item.


        if (lastTailNode === null) {
          // All remaining items in the tail are insertions.
          if (!hasRenderedATailFallback && renderState.tail !== null) {
            // We suspended during the head. We want to show at least one
            // row at the tail. So we'll keep on and cut off the rest.
            renderState.tail.sibling = null;
          } else {
            renderState.tail = null;
          }
        } else {
          // Detach the insertion after the last node that was already
          // inserted.
          lastTailNode.sibling = null;
        }

        break;
      }
  }
}

function completeWork(current, workInProgress, renderLanes) {
  const newProps = workInProgress.pendingProps;

  switch (workInProgress.tag) {
    case IndeterminateComponent:
    case LazyComponent:
    case SimpleMemoComponent:
    case FunctionComponent:
    case ForwardRef:
    case Fragment:
    case Mode:
    case Profiler:
    case ContextConsumer:
    case MemoComponent:
      return null;

    case ClassComponent:
      {
        const Component = workInProgress.type;

        return null;
      }

    case HostRoot:
      {
        popHostContainer();
        resetWorkInProgressVersions();
        const fiberRoot = workInProgress.stateNode;

        if (fiberRoot.pendingContext) {
          fiberRoot.context = fiberRoot.pendingContext;
          fiberRoot.pendingContext = null;
        }

        if (current === null || current.child === null) {
          // If we hydrated, pop so that we can delete any remaining children
          // that weren't hydrated.
          const wasHydrated = popHydrationState();

          if (wasHydrated) {
            // If we hydrated, then we'll need to schedule an update for
            // the commit side-effects on the root.
            markUpdate(workInProgress);
          } else if (!fiberRoot.hydrate) {
            // Schedule an effect to clear this container at the start of the next commit.
            // This handles the case of React rendering into a container with previous children.
            // It's also safe to do for updates too, because current.child would only be null
            // if the previous render was null (so the the container would already be empty).
            workInProgress.flags |= Snapshot;
          }
        }

        updateHostContainer(workInProgress);
        return null;
      }

    case HostComponent:
      {
        popHostContext(workInProgress);
        const rootContainerInstance = getRootHostContainer();
        const type = workInProgress.type;

        if (current !== null && workInProgress.stateNode != null) {
          updateHostComponent$1(current, workInProgress, type, newProps, rootContainerInstance);

          if (current.ref !== workInProgress.ref) {
            markRef$1(workInProgress);
          }
        } else {
          if (!newProps) {
            if (!(workInProgress.stateNode !== null)) {
              {
                throw Error( formatProdErrorMessage(166));
              }
            } // This can happen when we abort work.


            return null;
          }

          const currentHostContext = getHostContext(); // TODO: Move createInstance to beginWork and keep it on a context
          // "stack" as the parent. Then append children as we go in beginWork
          // or completeWork depending on whether we want to add them top->down or
          // bottom->up. Top->down is faster in IE11.

          const wasHydrated = popHydrationState();

          if (wasHydrated) {
            // TODO: Move this and createInstance step into the beginPhase
            // to consolidate.
            if (prepareToHydrateHostInstance()) {
              // If changes to the hydrated node need to be applied at the
              // commit-phase we mark this as such.
              markUpdate(workInProgress);
            }
          } else {
            const instance = createInstance(type, newProps);
            appendAllChildren(instance, workInProgress, false, false);
            workInProgress.stateNode = instance; // Certain renderers require commit-time effects for initial mount.
          }

          if (workInProgress.ref !== null) {
            // If there is a ref on a host node we need to schedule a callback
            markRef$1(workInProgress);
          }
        }

        return null;
      }

    case HostText:
      {
        const newText = newProps;

        if (current && workInProgress.stateNode != null) {
          const oldText = current.memoizedProps; // If we have an alternate, that means this is an update and we need
          // to schedule a side-effect to do the updates.

          updateHostText$1(current, workInProgress, oldText, newText);
        } else {
          if (typeof newText !== 'string') {
            if (!(workInProgress.stateNode !== null)) {
              {
                throw Error( formatProdErrorMessage(166));
              }
            } // This can happen when we abort work.

          }

          const rootContainerInstance = getRootHostContainer();
          const currentHostContext = getHostContext();
          const wasHydrated = popHydrationState();

          if (wasHydrated) {
            if (prepareToHydrateHostTextInstance()) {
              markUpdate(workInProgress);
            }
          } else {
            workInProgress.stateNode = createTextInstance(newText);
          }
        }

        return null;
      }

    case SuspenseComponent:
      {
        popSuspenseContext();
        const nextState = workInProgress.memoizedState;

        {
          if (nextState !== null && nextState.dehydrated !== null) {
            if (current === null) {
              const wasHydrated = popHydrationState();

              if (!wasHydrated) {
                {
                  throw Error( formatProdErrorMessage(318));
                }
              }

              prepareToHydrateHostSuspenseInstance();

              {
                markSpawnedWork(OffscreenLane);
              }

              return null;
            } else {

              if ((workInProgress.flags & DidCapture) === NoFlags) {
                // This boundary did not suspend so it's now hydrated and unsuspended.
                workInProgress.memoizedState = null;
              } // If nothing suspended, we need to schedule an effect to mark this boundary
              // as having hydrated so events know that they're free to be invoked.
              // It's also a signal to replay events and the suspense callback.
              // If something suspended, schedule an effect to attach retry listeners.
              // So we might as well always mark this.


              workInProgress.flags |= Update;
              return null;
            }
          }
        }

        if ((workInProgress.flags & DidCapture) !== NoFlags) {
          // Something suspended. Re-render with the fallback children.
          workInProgress.lanes = renderLanes; // Do not reset the effect list.

          return workInProgress;
        }

        const nextDidTimeout = nextState !== null;
        let prevDidTimeout = false;

        if (current === null) {
          if (workInProgress.memoizedProps.fallback !== undefined) ;
        } else {
          const prevState = current.memoizedState;
          prevDidTimeout = prevState !== null;
        }

        if (nextDidTimeout && !prevDidTimeout) {
          // If this subtreee is running in blocking mode we can suspend,
          // otherwise we won't suspend.
          // TODO: This will still suspend a synchronous tree if anything
          // in the concurrent tree already suspended during this render.
          // This is a known bug.
          if ((workInProgress.mode & BlockingMode) !== NoMode) {
            // TODO: Move this back to throwException because this is too late
            // if this is a large tree which is common for initial loads. We
            // don't know if we should restart a render or not until we get
            // this marker, and this is too late.
            // If this render already had a ping or lower pri updates,
            // and this is the first time we know we're going to suspend we
            // should be able to immediately restart from within throwException.
            const hasInvisibleChildContext = current === null && workInProgress.memoizedProps.unstable_avoidThisFallback !== true;

            if (hasInvisibleChildContext || hasSuspenseContext(suspenseStackCursor.current, InvisibleParentSuspenseContext)) {
              // If this was in an invisible tree or a new render, then showing
              // this boundary is ok.
              renderDidSuspend();
            } else {
              // Otherwise, we're going to have to hide content so we should
              // suspend for longer if possible.
              renderDidSuspendDelayIfPossible();
            }
          }
        }

        {
          // TODO: Only schedule updates if these values are non equal, i.e. it changed.
          if (nextDidTimeout || prevDidTimeout) {
            // If this boundary just timed out, schedule an effect to attach a
            // retry listener to the promise. This flag is also used to hide the
            // primary children. In mutation mode, we also need the flag to
            // *unhide* children that were previously hidden, so check if this
            // is currently timed out, too.
            workInProgress.flags |= Update;
          }
        }

        if ( workInProgress.updateQueue !== null && workInProgress.memoizedProps.suspenseCallback != null) {
          // Always notify the callback
          workInProgress.flags |= Update;
        }

        return null;
      }

    case HostPortal:
      popHostContainer();
      updateHostContainer(workInProgress);

      if (current === null) {
        preparePortalMount(workInProgress.stateNode.containerInfo);
      }

      return null;

    case ContextProvider:
      // Pop provider fiber
      popProvider(workInProgress);
      return null;

    case IncompleteClassComponent:
      {
        // Same as class component case. I put it down here so that the tags are
        // sequential to ensure this switch is compiled to a jump table.
        const Component = workInProgress.type;

        return null;
      }

    case SuspenseListComponent:
      {
        popSuspenseContext();
        const renderState = workInProgress.memoizedState;

        if (renderState === null) {
          // We're running in the default, "independent" mode.
          // We don't do anything in this mode.
          return null;
        }

        let didSuspendAlready = (workInProgress.flags & DidCapture) !== NoFlags;
        const renderedTail = renderState.rendering;

        if (renderedTail === null) {
          // We just rendered the head.
          if (!didSuspendAlready) {
            // This is the first pass. We need to figure out if anything is still
            // suspended in the rendered set.
            // If new content unsuspended, but there's still some content that
            // didn't. Then we need to do a second pass that forces everything
            // to keep showing their fallbacks.
            // We might be suspended if something in this render pass suspended, or
            // something in the previous committed pass suspended. Otherwise,
            // there's no chance so we can skip the expensive call to
            // findFirstSuspended.
            const cannotBeSuspended = renderHasNotSuspendedYet() && (current === null || (current.flags & DidCapture) === NoFlags);

            if (!cannotBeSuspended) {
              let row = workInProgress.child;

              while (row !== null) {
                const suspended = findFirstSuspended(row);

                if (suspended !== null) {
                  didSuspendAlready = true;
                  workInProgress.flags |= DidCapture;
                  cutOffTailIfNeeded(renderState, false); // If this is a newly suspended tree, it might not get committed as
                  // part of the second pass. In that case nothing will subscribe to
                  // its thennables. Instead, we'll transfer its thennables to the
                  // SuspenseList so that it can retry if they resolve.
                  // There might be multiple of these in the list but since we're
                  // going to wait for all of them anyway, it doesn't really matter
                  // which ones gets to ping. In theory we could get clever and keep
                  // track of how many dependencies remain but it gets tricky because
                  // in the meantime, we can add/remove/change items and dependencies.
                  // We might bail out of the loop before finding any but that
                  // doesn't matter since that means that the other boundaries that
                  // we did find already has their listeners attached.

                  const newThennables = suspended.updateQueue;

                  if (newThennables !== null) {
                    workInProgress.updateQueue = newThennables;
                    workInProgress.flags |= Update;
                  } // Rerender the whole list, but this time, we'll force fallbacks
                  // to stay in place.
                  // Reset the effect list before doing the second pass since that's now invalid.


                  if (renderState.lastEffect === null) {
                    workInProgress.firstEffect = null;
                  }

                  workInProgress.lastEffect = renderState.lastEffect; // Reset the child fibers to their original state.

                  resetChildFibers(workInProgress, renderLanes); // Set up the Suspense Context to force suspense and immediately
                  // rerender the children.

                  pushSuspenseContext(workInProgress, setShallowSuspenseContext(suspenseStackCursor.current, ForceSuspenseFallback));
                  return workInProgress.child;
                }

                row = row.sibling;
              }
            }

            if (renderState.tail !== null && now() > getRenderTargetTime()) {
              // We have already passed our CPU deadline but we still have rows
              // left in the tail. We'll just give up further attempts to render
              // the main content and only render fallbacks.
              workInProgress.flags |= DidCapture;
              didSuspendAlready = true;
              cutOffTailIfNeeded(renderState, false); // Since nothing actually suspended, there will nothing to ping this
              // to get it started back up to attempt the next item. While in terms
              // of priority this work has the same priority as this current render,
              // it's not part of the same transition once the transition has
              // committed. If it's sync, we still want to yield so that it can be
              // painted. Conceptually, this is really the same as pinging.
              // We can use any RetryLane even if it's the one currently rendering
              // since we're leaving it behind on this node.

              workInProgress.lanes = SomeRetryLane;

              {
                markSpawnedWork(SomeRetryLane);
              }
            }
          } else {
            cutOffTailIfNeeded(renderState, false);
          } // Next we're going to render the tail.

        } else {
          // Append the rendered row to the child list.
          if (!didSuspendAlready) {
            const suspended = findFirstSuspended(renderedTail);

            if (suspended !== null) {
              workInProgress.flags |= DidCapture;
              didSuspendAlready = true; // Ensure we transfer the update queue to the parent so that it doesn't
              // get lost if this row ends up dropped during a second pass.

              const newThennables = suspended.updateQueue;

              if (newThennables !== null) {
                workInProgress.updateQueue = newThennables;
                workInProgress.flags |= Update;
              }

              cutOffTailIfNeeded(renderState, true); // This might have been modified.

              if (renderState.tail === null && renderState.tailMode === 'hidden' && !renderedTail.alternate && !getIsHydrating() // We don't cut it if we're hydrating.
              ) {
                  // We need to delete the row we just rendered.
                  // Reset the effect list to what it was before we rendered this
                  // child. The nested children have already appended themselves.
                  const lastEffect = workInProgress.lastEffect = renderState.lastEffect; // Remove any effects that were appended after this point.

                  if (lastEffect !== null) {
                    lastEffect.nextEffect = null;
                  } // We're done.


                  return null;
                }
            } else if ( // The time it took to render last row is greater than the remaining
            // time we have to render. So rendering one more row would likely
            // exceed it.
            now() * 2 - renderState.renderingStartTime > getRenderTargetTime() && renderLanes !== OffscreenLane) {
              // We have now passed our CPU deadline and we'll just give up further
              // attempts to render the main content and only render fallbacks.
              // The assumption is that this is usually faster.
              workInProgress.flags |= DidCapture;
              didSuspendAlready = true;
              cutOffTailIfNeeded(renderState, false); // Since nothing actually suspended, there will nothing to ping this
              // to get it started back up to attempt the next item. While in terms
              // of priority this work has the same priority as this current render,
              // it's not part of the same transition once the transition has
              // committed. If it's sync, we still want to yield so that it can be
              // painted. Conceptually, this is really the same as pinging.
              // We can use any RetryLane even if it's the one currently rendering
              // since we're leaving it behind on this node.

              workInProgress.lanes = SomeRetryLane;

              {
                markSpawnedWork(SomeRetryLane);
              }
            }
          }

          if (renderState.isBackwards) {
            // The effect list of the backwards tail will have been added
            // to the end. This breaks the guarantee that life-cycles fire in
            // sibling order but that isn't a strong guarantee promised by React.
            // Especially since these might also just pop in during future commits.
            // Append to the beginning of the list.
            renderedTail.sibling = workInProgress.child;
            workInProgress.child = renderedTail;
          } else {
            const previousSibling = renderState.last;

            if (previousSibling !== null) {
              previousSibling.sibling = renderedTail;
            } else {
              workInProgress.child = renderedTail;
            }

            renderState.last = renderedTail;
          }
        }

        if (renderState.tail !== null) {
          // We still have tail rows to render.
          // Pop a row.
          const next = renderState.tail;
          renderState.rendering = next;
          renderState.tail = next.sibling;
          renderState.lastEffect = workInProgress.lastEffect;
          renderState.renderingStartTime = now();
          next.sibling = null; // Restore the context.
          // TODO: We can probably just avoid popping it instead and only
          // setting it the first time we go from not suspended to suspended.

          let suspenseContext = suspenseStackCursor.current;

          if (didSuspendAlready) {
            suspenseContext = setShallowSuspenseContext(suspenseContext, ForceSuspenseFallback);
          } else {
            suspenseContext = setDefaultShallowSuspenseContext(suspenseContext);
          }

          pushSuspenseContext(workInProgress, suspenseContext); // Do a pass over the next row.

          return next;
        }

        return null;
      }

    case FundamentalComponent:
      {

        break;
      }

    case ScopeComponent:
      {
        {
          if (current === null) {
            const scopeInstance = createScopeInstance();
            workInProgress.stateNode = scopeInstance;
            prepareScopeUpdate();

            if (workInProgress.ref !== null) {
              markRef$1(workInProgress);
              markUpdate(workInProgress);
            }
          } else {
            if (workInProgress.ref !== null) {
              markUpdate(workInProgress);
            }

            if (current.ref !== workInProgress.ref) {
              markRef$1(workInProgress);
            }
          }

          return null;
        }
      }

    case Block:
      {
        return null;
      }

    case OffscreenComponent:
    case LegacyHiddenComponent:
      {
        popRenderLanes();

        if (current !== null) {
          const nextState = workInProgress.memoizedState;
          const prevState = current.memoizedState;
          const prevIsHidden = prevState !== null;
          const nextIsHidden = nextState !== null;

          if (prevIsHidden !== nextIsHidden && newProps.mode !== 'unstable-defer-without-hiding') {
            workInProgress.flags |= Update;
          }
        }

        return null;
      }
  }

  {
    {
      throw Error( formatProdErrorMessage(156, workInProgress.tag));
    }
  }
}

function unwindWork(workInProgress, renderLanes) {
  switch (workInProgress.tag) {
    case ClassComponent:
      {
        const Component = workInProgress.type;

        const flags = workInProgress.flags;

        if (flags & ShouldCapture) {
          workInProgress.flags = flags & ~ShouldCapture | DidCapture;

          return workInProgress;
        }

        return null;
      }

    case HostRoot:
      {
        popHostContainer();
        resetWorkInProgressVersions();
        const flags = workInProgress.flags;

        if (!((flags & DidCapture) === NoFlags)) {
          {
            throw Error( formatProdErrorMessage(285));
          }
        }

        workInProgress.flags = flags & ~ShouldCapture | DidCapture;
        return workInProgress;
      }

    case HostComponent:
      {
        // TODO: popHydrationState
        popHostContext(workInProgress);
        return null;
      }

    case SuspenseComponent:
      {
        popSuspenseContext();

        {
          const suspenseState = workInProgress.memoizedState;

          if (suspenseState !== null && suspenseState.dehydrated !== null) {
            if (!(workInProgress.alternate !== null)) {
              {
                throw Error( formatProdErrorMessage(340));
              }
            }
          }
        }

        const flags = workInProgress.flags;

        if (flags & ShouldCapture) {
          workInProgress.flags = flags & ~ShouldCapture | DidCapture; // Captured a suspense effect. Re-render the boundary.

          return workInProgress;
        }

        return null;
      }

    case SuspenseListComponent:
      {
        popSuspenseContext(); // SuspenseList doesn't actually catch anything. It should've been
        // caught by a nested boundary. If not, it should bubble through.

        return null;
      }

    case HostPortal:
      popHostContainer();
      return null;

    case ContextProvider:
      popProvider(workInProgress);
      return null;

    case OffscreenComponent:
    case LegacyHiddenComponent:
      popRenderLanes();
      return null;

    default:
      return null;
  }
}

function unwindInterruptedWork(interruptedWork) {
  switch (interruptedWork.tag) {
    case ClassComponent:
      {
        const childContextTypes = interruptedWork.type.childContextTypes;

        break;
      }

    case HostRoot:
      {
        popHostContainer();
        resetWorkInProgressVersions();
        break;
      }

    case HostComponent:
      {
        popHostContext(interruptedWork);
        break;
      }

    case HostPortal:
      popHostContainer();
      break;

    case SuspenseComponent:
      popSuspenseContext();
      break;

    case SuspenseListComponent:
      popSuspenseContext();
      break;

    case ContextProvider:
      popProvider(interruptedWork);
      break;

    case OffscreenComponent:
    case LegacyHiddenComponent:
      popRenderLanes();
      break;
  }
}

function createCapturedValue(value, source) {
  // If the value is an error, call this function immediately after it is thrown
  // so the stack is accurate.
  return {
    value,
    source,
    stack: getStackByFiberInDevAndProd(source)
  };
}

const ReactFiberErrorDialogWWW = require('ReactFiberErrorDialog');

if (!(typeof ReactFiberErrorDialogWWW.showErrorDialog === 'function')) {
  {
    throw Error( formatProdErrorMessage(320));
  }
}

function showErrorDialog(boundary, errorInfo) {
  const capturedError = {
    componentStack: errorInfo.stack !== null ? errorInfo.stack : '',
    error: errorInfo.value,
    errorBoundary: boundary !== null && boundary.tag === ClassComponent ? boundary.stateNode : null
  };
  return ReactFiberErrorDialogWWW.showErrorDialog(capturedError);
}

function logCapturedError(boundary, errorInfo) {
  try {
    const logError = showErrorDialog(boundary, errorInfo); // Allow injected showErrorDialog() to prevent default console.error logging.
    // This enables renderers like ReactNative to better manage redbox behavior.

    if (logError === false) {
      return;
    }

    const error = errorInfo.value;

    if (false) {
      const source = errorInfo.source;
      const stack = errorInfo.stack;
      const componentStack = stack !== null ? stack : ''; // Browsers support silencing uncaught errors by calling
      // `preventDefault()` in window `error` handler.
      // We record this information as an expando on the error.

      if (error != null && error._suppressLogging) {
        if (boundary.tag === ClassComponent) {
          // The error is recoverable and was silenced.
          // Ignore it and don't print the stack addendum.
          // This is handy for testing error boundaries without noise.
          return;
        } // The error is fatal. Since the silencing might have
        // been accidental, we'll surface it anyway.
        // However, the browser would have silenced the original error
        // so we'll print it first, and then print the stack addendum.


        console['error'](error); // Don't transform to our wrapper
        // For a more detailed description of this block, see:
        // https://github.com/facebook/react/pull/13384
      }

      const componentName = source ? getComponentName(source.type) : null;
      const componentNameMessage = componentName ? "The above error occurred in the <" + componentName + "> component:" : 'The above error occurred in one of your React components:';
      let errorBoundaryMessage;
      const errorBoundaryName = getComponentName(boundary.type);

      if (errorBoundaryName) {
        errorBoundaryMessage = "React will try to recreate this component tree from scratch " + ("using the error boundary you provided, " + errorBoundaryName + ".");
      } else {
        errorBoundaryMessage = 'Consider adding an error boundary to your tree to customize error handling behavior.\n' + 'Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.';
      }

      const combinedMessage = componentNameMessage + "\n" + componentStack + "\n\n" + ("" + errorBoundaryMessage); // In development, we provide our own message with just the component stack.
      // We don't include the original error message and JS stack because the browser
      // has already printed it. Even if the application swallows the error, it is still
      // displayed by the browser thanks to the DEV-only fake event trick in ReactErrorUtils.

      console['error'](combinedMessage); // Don't transform to our wrapper
    } else {
      // In production, we print the error directly.
      // This will include the message, the JS stack, and anything the browser wants to show.
      // We pass the error object instead of custom message so that the browser displays the error natively.
      console['error'](error); // Don't transform to our wrapper
    }
  } catch (e) {
    // This method must not throw, or React internal state will get messed up.
    // If console.error is overridden, or logCapturedError() shows a dialog that throws,
    // we want to report this error outside of the normal stack as a last resort.
    // https://github.com/facebook/react/issues/13188
    setTimeout(() => {
      throw e;
    });
  }
}

const PossiblyWeakMap = typeof WeakMap === 'function' ? WeakMap : Map;

function createRootErrorUpdate(fiber, errorInfo, lane) {
  const update = createUpdate(NoTimestamp, lane); // Unmount the root by rendering null.

  update.tag = CaptureUpdate; // Caution: React DevTools currently depends on this property
  // being called "element".

  update.payload = {
    element: null
  };
  const error = errorInfo.value;

  update.callback = () => {
    onUncaughtError(error);
    logCapturedError(fiber, errorInfo);
  };

  return update;
}

function createClassErrorUpdate(fiber, errorInfo, lane) {
  const update = createUpdate(NoTimestamp, lane);
  update.tag = CaptureUpdate;
  const getDerivedStateFromError = fiber.type.getDerivedStateFromError;

  if (typeof getDerivedStateFromError === 'function') {
    const error = errorInfo.value;

    update.payload = () => {
      logCapturedError(fiber, errorInfo);
      return getDerivedStateFromError(error);
    };
  }

  const inst = fiber.stateNode;

  if (inst !== null && typeof inst.componentDidCatch === 'function') {
    update.callback = function callback() {

      if (typeof getDerivedStateFromError !== 'function') {
        // To preserve the preexisting retry behavior of error boundaries,
        // we keep track of which ones already failed during this batch.
        // This gets reset before we yield back to the browser.
        // TODO: Warn in strict mode if getDerivedStateFromError is
        // not defined.
        markLegacyErrorBoundaryAsFailed(this); // Only log here if componentDidCatch is the only error boundary method defined

        logCapturedError(fiber, errorInfo);
      }

      const error = errorInfo.value;
      const stack = errorInfo.stack;
      this.componentDidCatch(error, {
        componentStack: stack !== null ? stack : ''
      });
    };
  }

  return update;
}

function attachPingListener(root, wakeable, lanes) {
  // Attach a listener to the promise to "ping" the root and retry. But only if
  // one does not already exist for the lanes we're currently rendering (which
  // acts like a "thread ID" here).
  let pingCache = root.pingCache;
  let threadIDs;

  if (pingCache === null) {
    pingCache = root.pingCache = new PossiblyWeakMap();
    threadIDs = new Set();
    pingCache.set(wakeable, threadIDs);
  } else {
    threadIDs = pingCache.get(wakeable);

    if (threadIDs === undefined) {
      threadIDs = new Set();
      pingCache.set(wakeable, threadIDs);
    }
  }

  if (!threadIDs.has(lanes)) {
    // Memoize using the thread ID to prevent redundant listeners.
    threadIDs.add(lanes);
    const ping = pingSuspendedRoot.bind(null, root, wakeable, lanes);
    wakeable.then(ping, ping);
  }
}

function throwException(root, returnFiber, sourceFiber, value, rootRenderLanes) {
  // The source fiber did not complete.
  sourceFiber.flags |= Incomplete; // Its effect list is no longer valid.

  sourceFiber.firstEffect = sourceFiber.lastEffect = null;

  if (value !== null && typeof value === 'object' && typeof value.then === 'function') {
    // This is a wakeable.
    const wakeable = value;

    if ((sourceFiber.mode & BlockingMode) === NoMode) {
      // Reset the memoizedState to what it was before we attempted
      // to render it.
      const currentSource = sourceFiber.alternate;

      if (currentSource) {
        sourceFiber.updateQueue = currentSource.updateQueue;
        sourceFiber.memoizedState = currentSource.memoizedState;
        sourceFiber.lanes = currentSource.lanes;
      } else {
        sourceFiber.updateQueue = null;
        sourceFiber.memoizedState = null;
      }
    }

    const hasInvisibleParentBoundary = hasSuspenseContext(suspenseStackCursor.current, InvisibleParentSuspenseContext); // Schedule the nearest Suspense to re-render the timed out view.

    let workInProgress = returnFiber;

    do {
      if (workInProgress.tag === SuspenseComponent && shouldCaptureSuspense(workInProgress, hasInvisibleParentBoundary)) {
        // Found the nearest boundary.
        // Stash the promise on the boundary fiber. If the boundary times out, we'll
        // attach another listener to flip the boundary back to its normal state.
        const wakeables = workInProgress.updateQueue;

        if (wakeables === null) {
          const updateQueue = new Set();
          updateQueue.add(wakeable);
          workInProgress.updateQueue = updateQueue;
        } else {
          wakeables.add(wakeable);
        } // If the boundary is outside of blocking mode, we should *not*
        // suspend the commit. Pretend as if the suspended component rendered
        // null and keep rendering. In the commit phase, we'll schedule a
        // subsequent synchronous update to re-render the Suspense.
        //
        // Note: It doesn't matter whether the component that suspended was
        // inside a blocking mode tree. If the Suspense is outside of it, we
        // should *not* suspend the commit.


        if ((workInProgress.mode & BlockingMode) === NoMode) {
          workInProgress.flags |= DidCapture;
          sourceFiber.flags |= ForceUpdateForLegacySuspense; // We're going to commit this fiber even though it didn't complete.
          // But we shouldn't call any lifecycle methods or callbacks. Remove
          // all lifecycle effect tags.

          sourceFiber.flags &= ~(LifecycleEffectMask | Incomplete);

          if (sourceFiber.tag === ClassComponent) {
            const currentSourceFiber = sourceFiber.alternate;

            if (currentSourceFiber === null) {
              // This is a new mount. Change the tag so it's not mistaken for a
              // completed class component. For example, we should not call
              // componentWillUnmount if it is deleted.
              sourceFiber.tag = IncompleteClassComponent;
            } else {
              // When we try rendering again, we should not reuse the current fiber,
              // since it's known to be in an inconsistent state. Use a force update to
              // prevent a bail out.
              const update = createUpdate(NoTimestamp, SyncLane);
              update.tag = ForceUpdate;
              enqueueUpdate(sourceFiber, update);
            }
          } // The source fiber did not complete. Mark it with Sync priority to
          // indicate that it still has pending work.


          sourceFiber.lanes = mergeLanes(sourceFiber.lanes, SyncLane); // Exit without suspending.

          return;
        } // Confirmed that the boundary is in a concurrent mode tree. Continue
        // with the normal suspend path.
        //
        // After this we'll use a set of heuristics to determine whether this
        // render pass will run to completion or restart or "suspend" the commit.
        // The actual logic for this is spread out in different places.
        //
        // This first principle is that if we're going to suspend when we complete
        // a root, then we should also restart if we get an update or ping that
        // might unsuspend it, and vice versa. The only reason to suspend is
        // because you think you might want to restart before committing. However,
        // it doesn't make sense to restart only while in the period we're suspended.
        //
        // Restarting too aggressively is also not good because it starves out any
        // intermediate loading state. So we use heuristics to determine when.
        // Suspense Heuristics
        //
        // If nothing threw a Promise or all the same fallbacks are already showing,
        // then don't suspend/restart.
        //
        // If this is an initial render of a new tree of Suspense boundaries and
        // those trigger a fallback, then don't suspend/restart. We want to ensure
        // that we can show the initial loading state as quickly as possible.
        //
        // If we hit a "Delayed" case, such as when we'd switch from content back into
        // a fallback, then we should always suspend/restart. Transitions apply
        // to this case. If none is defined, JND is used instead.
        //
        // If we're already showing a fallback and it gets "retried", allowing us to show
        // another level, but there's still an inner boundary that would show a fallback,
        // then we suspend/restart for 500ms since the last time we showed a fallback
        // anywhere in the tree. This effectively throttles progressive loading into a
        // consistent train of commits. This also gives us an opportunity to restart to
        // get to the completed state slightly earlier.
        //
        // If there's ambiguity due to batching it's resolved in preference of:
        // 1) "delayed", 2) "initial render", 3) "retry".
        //
        // We want to ensure that a "busy" state doesn't get force committed. We want to
        // ensure that new initial loading states can commit as soon as possible.


        attachPingListener(root, wakeable, rootRenderLanes);
        workInProgress.flags |= ShouldCapture;
        workInProgress.lanes = rootRenderLanes;
        return;
      } // This boundary already captured during this render. Continue to the next
      // boundary.


      workInProgress = workInProgress.return;
    } while (workInProgress !== null); // No boundary was found. Fallthrough to error mode.
    // TODO: Use invariant so the message is stripped in prod?


    value = new Error((getComponentName(sourceFiber.type) || 'A React component') + ' suspended while rendering, but no fallback UI was specified.\n' + '\n' + 'Add a <Suspense fallback=...> component higher in the tree to ' + 'provide a loading indicator or placeholder to display.');
  } // We didn't find a boundary that could handle this type of exception. Start
  // over and traverse parent path again, this time treating the exception
  // as an error.


  renderDidError();
  value = createCapturedValue(value, sourceFiber);
  let workInProgress = returnFiber;

  do {
    switch (workInProgress.tag) {
      case HostRoot:
        {
          const errorInfo = value;
          workInProgress.flags |= ShouldCapture;
          const lane = pickArbitraryLane(rootRenderLanes);
          workInProgress.lanes = mergeLanes(workInProgress.lanes, lane);
          const update = createRootErrorUpdate(workInProgress, errorInfo, lane);
          enqueueCapturedUpdate(workInProgress, update);
          return;
        }

      case ClassComponent:
        // Capture and retry
        const errorInfo = value;
        const ctor = workInProgress.type;
        const instance = workInProgress.stateNode;

        if ((workInProgress.flags & DidCapture) === NoFlags && (typeof ctor.getDerivedStateFromError === 'function' || instance !== null && typeof instance.componentDidCatch === 'function' && !isAlreadyFailedLegacyErrorBoundary(instance))) {
          workInProgress.flags |= ShouldCapture;
          const lane = pickArbitraryLane(rootRenderLanes);
          workInProgress.lanes = mergeLanes(workInProgress.lanes, lane); // Schedule the error boundary to re-render using updated state

          const update = createClassErrorUpdate(workInProgress, errorInfo, lane);
          enqueueCapturedUpdate(workInProgress, update);
          return;
        }

        break;
    }

    workInProgress = workInProgress.return;
  } while (workInProgress !== null);
}

const ReactFbErrorUtils = require('ReactFbErrorUtils');

if (!(typeof ReactFbErrorUtils.invokeGuardedCallback === 'function')) {
  {
    throw Error( formatProdErrorMessage(255));
  }
}

const PossiblyWeakSet = typeof WeakSet === 'function' ? WeakSet : Set;

const callComponentWillUnmountWithTimer = function (current, instance) {
  instance.props = current.memoizedProps;
  instance.state = current.memoizedState;

  {
    instance.componentWillUnmount();
  }
}; // Capture errors so they don't interrupt unmounting.


function safelyCallComponentWillUnmount(current, instance) {
  {
    try {
      callComponentWillUnmountWithTimer(current, instance);
    } catch (unmountError) {
      captureCommitPhaseError(current, unmountError);
    }
  }
}

function safelyDetachRef(current) {
  const ref = current.ref;

  if (ref !== null) {
    if (typeof ref === 'function') {
      {
        try {
          ref(null);
        } catch (refError) {
          captureCommitPhaseError(current, refError);
        }
      }
    } else {
      ref.current = null;
    }
  }
}

function safelyCallDestroy(current, destroy) {
  {
    try {
      destroy();
    } catch (error) {
      captureCommitPhaseError(current, error);
    }
  }
}

function commitBeforeMutationLifeCycles(current, finishedWork) {
  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent:
    case Block:
      {
        return;
      }

    case ClassComponent:
      {
        if (finishedWork.flags & Snapshot) {
          if (current !== null) {
            const prevProps = current.memoizedProps;
            const prevState = current.memoizedState;
            const instance = finishedWork.stateNode; // We could update instance props and state here,

            const snapshot = instance.getSnapshotBeforeUpdate(finishedWork.elementType === finishedWork.type ? prevProps : resolveDefaultProps(finishedWork.type, prevProps), prevState);

            instance.__reactInternalSnapshotBeforeUpdate = snapshot;
          }
        }

        return;
      }

    case HostRoot:
      {
        {
          if (finishedWork.flags & Snapshot) {
            const root = finishedWork.stateNode;
            clearContainer(root.containerInfo);
          }
        }

        return;
      }

    case HostComponent:
    case HostText:
    case HostPortal:
    case IncompleteClassComponent:
      // Nothing to do for these component types
      return;
  }

  {
    {
      throw Error( formatProdErrorMessage(163));
    }
  }
}

function commitHookEffectListUnmount(tag, finishedWork) {
  const updateQueue = finishedWork.updateQueue;
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;

  if (lastEffect !== null) {
    const firstEffect = lastEffect.next;
    let effect = firstEffect;

    do {
      if ((effect.tag & tag) === tag) {
        // Unmount
        const destroy = effect.destroy;
        effect.destroy = undefined;

        if (destroy !== undefined) {
          destroy();
        }
      }

      effect = effect.next;
    } while (effect !== firstEffect);
  }
}

function commitHookEffectListMount(tag, finishedWork) {
  const updateQueue = finishedWork.updateQueue;
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;

  if (lastEffect !== null) {
    const firstEffect = lastEffect.next;
    let effect = firstEffect;

    do {
      if ((effect.tag & tag) === tag) {
        // Mount
        const create = effect.create;
        effect.destroy = create();
      }

      effect = effect.next;
    } while (effect !== firstEffect);
  }
}

function schedulePassiveEffects(finishedWork) {
  const updateQueue = finishedWork.updateQueue;
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;

  if (lastEffect !== null) {
    const firstEffect = lastEffect.next;
    let effect = firstEffect;

    do {
      const _effect = effect,
            next = _effect.next,
            tag = _effect.tag;

      if ((tag & Passive$1) !== NoFlags$1 && (tag & HasEffect) !== NoFlags$1) {
        enqueuePendingPassiveHookEffectUnmount(finishedWork, effect);
        enqueuePendingPassiveHookEffectMount(finishedWork, effect);
      }

      effect = next;
    } while (effect !== firstEffect);
  }
}

function commitLifeCycles(finishedRoot, current, finishedWork, committedLanes) {
  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent:
    case Block:
      {
        // At this point layout effects have already been destroyed (during mutation phase).
        // This is done to prevent sibling component effects from interfering with each other,
        // e.g. a destroy function in one component should never override a ref set
        // by a create function in another component during the same commit.
        {
          commitHookEffectListMount(Layout | HasEffect, finishedWork);
        }

        schedulePassiveEffects(finishedWork);
        return;
      }

    case ClassComponent:
      {
        const instance = finishedWork.stateNode;

        if (finishedWork.flags & Update) {
          if (current === null) {

            {
              instance.componentDidMount();
            }
          } else {
            const prevProps = finishedWork.elementType === finishedWork.type ? current.memoizedProps : resolveDefaultProps(finishedWork.type, current.memoizedProps);
            const prevState = current.memoizedState; // We could update instance props and state here,

            {
              instance.componentDidUpdate(prevProps, prevState, instance.__reactInternalSnapshotBeforeUpdate);
            }
          }
        } // TODO: I think this is now always non-null by the time it reaches the
        // commit phase. Consider removing the type check.


        const updateQueue = finishedWork.updateQueue;

        if (updateQueue !== null) {
          // but instead we rely on them being set during last render.
          // TODO: revisit this when we implement resuming.


          commitUpdateQueue(finishedWork, updateQueue, instance);
        }

        return;
      }

    case HostRoot:
      {
        // TODO: I think this is now always non-null by the time it reaches the
        // commit phase. Consider removing the type check.
        const updateQueue = finishedWork.updateQueue;

        if (updateQueue !== null) {
          let instance = null;

          if (finishedWork.child !== null) {
            switch (finishedWork.child.tag) {
              case HostComponent:
                instance = getPublicInstance(finishedWork.child.stateNode);
                break;

              case ClassComponent:
                instance = finishedWork.child.stateNode;
                break;
            }
          }

          commitUpdateQueue(finishedWork, updateQueue, instance);
        }

        return;
      }

    case HostComponent:
      {
        const instance = finishedWork.stateNode; // Renderers may schedule work to be done after host components are mounted
        // (eg DOM renderer may schedule auto-focus for inputs and form controls).
        // These effects should only be committed when components are first mounted,
        // aka when there is no current/alternate.

        if (current === null && finishedWork.flags & Update) {
          const type = finishedWork.type;
          const props = finishedWork.memoizedProps;
        }

        return;
      }

    case HostText:
      {
        // We have no life-cycles associated with text.
        return;
      }

    case HostPortal:
      {
        // We have no life-cycles associated with portals.
        return;
      }

    case Profiler:
      {

        return;
      }

    case SuspenseComponent:
      {
        return;
      }

    case SuspenseListComponent:
    case IncompleteClassComponent:
    case FundamentalComponent:
    case ScopeComponent:
    case OffscreenComponent:
    case LegacyHiddenComponent:
      return;
  }

  {
    {
      throw Error( formatProdErrorMessage(163));
    }
  }
}

function hideOrUnhideAllChildren(finishedWork, isHidden) {
  {
    // We only have the top Fiber that was inserted but we need to recurse down its
    // children to find all the terminal nodes.
    let node = finishedWork;

    while (true) {
      if (node.tag === HostComponent) {
        const instance = node.stateNode;

        if (isHidden) {
          hideInstance(instance);
        } else {
          unhideInstance(node.stateNode, node.memoizedProps);
        }
      } else if (node.tag === HostText) {
        const instance = node.stateNode;

        if (isHidden) ; else {
          unhideTextInstance(instance, node.memoizedProps);
        }
      } else if ((node.tag === OffscreenComponent || node.tag === LegacyHiddenComponent) && node.memoizedState !== null && node !== finishedWork) ; else if (node.child !== null) {
        node.child.return = node;
        node = node.child;
        continue;
      }

      if (node === finishedWork) {
        return;
      }

      while (node.sibling === null) {
        if (node.return === null || node.return === finishedWork) {
          return;
        }

        node = node.return;
      }

      node.sibling.return = node.return;
      node = node.sibling;
    }
  }
}

function commitAttachRef(finishedWork) {
  const ref = finishedWork.ref;

  if (ref !== null) {
    const instance = finishedWork.stateNode;
    let instanceToUse;

    switch (finishedWork.tag) {
      case HostComponent:
        instanceToUse = getPublicInstance(instance);
        break;

      default:
        instanceToUse = instance;
    } // Moved outside to ensure DCE works with this flag


    if ( finishedWork.tag === ScopeComponent) {
      instanceToUse = instance;
    }

    if (typeof ref === 'function') {
      ref(instanceToUse);
    } else {

      ref.current = instanceToUse;
    }
  }
}

function commitDetachRef(current) {
  const currentRef = current.ref;

  if (currentRef !== null) {
    if (typeof currentRef === 'function') {
      currentRef(null);
    } else {
      currentRef.current = null;
    }
  }
} // User-originating errors (lifecycles and refs) should not interrupt
// deletion, so don't let them throw. Host-originating errors should
// interrupt deletion, so it's okay


function commitUnmount(finishedRoot, current, renderPriorityLevel) {
  onCommitUnmount(current);

  switch (current.tag) {
    case FunctionComponent:
    case ForwardRef:
    case MemoComponent:
    case SimpleMemoComponent:
    case Block:
      {
        const updateQueue = current.updateQueue;

        if (updateQueue !== null) {
          const lastEffect = updateQueue.lastEffect;

          if (lastEffect !== null) {
            const firstEffect = lastEffect.next;
            let effect = firstEffect;

            do {
              const _effect2 = effect,
                    destroy = _effect2.destroy,
                    tag = _effect2.tag;

              if (destroy !== undefined) {
                if ((tag & Passive$1) !== NoFlags$1) {
                  enqueuePendingPassiveHookEffectUnmount(current, effect);
                } else {
                  {
                    safelyCallDestroy(current, destroy);
                  }
                }
              }

              effect = effect.next;
            } while (effect !== firstEffect);
          }
        }

        return;
      }

    case ClassComponent:
      {
        safelyDetachRef(current);
        const instance = current.stateNode;

        if (typeof instance.componentWillUnmount === 'function') {
          safelyCallComponentWillUnmount(current, instance);
        }

        return;
      }

    case HostComponent:
      {
        safelyDetachRef(current);
        return;
      }

    case HostPortal:
      {
        // TODO: this is recursive.
        // We are also not using this parent because
        // the portal will get pushed immediately.
        {
          unmountHostComponents(finishedRoot, current);
        }

        return;
      }

    case FundamentalComponent:
      {

        return;
      }

    case DehydratedFragment:
      {
        {
          const hydrationCallbacks = finishedRoot.hydrationCallbacks;

          if (hydrationCallbacks !== null) {
            const onDeleted = hydrationCallbacks.onDeleted;

            if (onDeleted) {
              onDeleted(current.stateNode);
            }
          }
        }

        return;
      }

    case ScopeComponent:
      {
        {
          safelyDetachRef(current);
        }

        return;
      }
  }
}

function commitNestedUnmounts(finishedRoot, root, renderPriorityLevel) {
  // While we're inside a removed host node we don't want to call
  // removeChild on the inner nodes because they're removed by the top
  // call anyway. We also want to call componentWillUnmount on all
  // composites before this host node is removed from the tree. Therefore
  // we do an inner loop while we're still inside the host node.
  let node = root;

  while (true) {
    commitUnmount(finishedRoot, node); // Visit children because they may contain more composite or host nodes.
    // Skip portals because commitUnmount() currently visits them recursively.

    if (node.child !== null && ( // If we use mutation we drill down into portals using commitUnmount above.
    // If we don't use mutation we drill down into portals here instead.
     node.tag !== HostPortal)) {
      node.child.return = node;
      node = node.child;
      continue;
    }

    if (node === root) {
      return;
    }

    while (node.sibling === null) {
      if (node.return === null || node.return === root) {
        return;
      }

      node = node.return;
    }

    node.sibling.return = node.return;
    node = node.sibling;
  }
}

function detachFiberMutation(fiber) {
  // Cut off the return pointers to disconnect it from the tree. Ideally, we
  // should clear the child pointer of the parent alternate to let this
  // get GC:ed but we don't know which for sure which parent is the current
  // one so we'll settle for GC:ing the subtree of this child. This child
  // itself will be GC:ed when the parent updates the next time.
  // Note: we cannot null out sibling here, otherwise it can cause issues
  // with findDOMNode and how it requires the sibling field to carry out
  // traversal in a later effect. See PR #16820. We now clear the sibling
  // field after effects, see: detachFiberAfterEffects.
  //
  // Don't disconnect stateNode now; it will be detached in detachFiberAfterEffects.
  // It may be required if the current component is an error boundary,
  // and one of its descendants throws while unmounting a passive effect.
  fiber.alternate = null;
  fiber.child = null;
  fiber.dependencies = null;
  fiber.firstEffect = null;
  fiber.lastEffect = null;
  fiber.memoizedProps = null;
  fiber.memoizedState = null;
  fiber.pendingProps = null;
  fiber.return = null;
  fiber.updateQueue = null;
}

function getHostParentFiber(fiber) {
  let parent = fiber.return;

  while (parent !== null) {
    if (isHostParent(parent)) {
      return parent;
    }

    parent = parent.return;
  }

  {
    {
      throw Error( formatProdErrorMessage(160));
    }
  }
}

function isHostParent(fiber) {
  return fiber.tag === HostComponent || fiber.tag === HostRoot || fiber.tag === HostPortal;
}

function getHostSibling(fiber) {
  // We're going to search forward into the tree until we find a sibling host
  // node. Unfortunately, if multiple insertions are done in a row we have to
  // search past them. This leads to exponential search for the next sibling.
  // TODO: Find a more efficient way to do this.
  let node = fiber;

  siblings: while (true) {
    // If we didn't find anything, let's try the next sibling.
    while (node.sibling === null) {
      if (node.return === null || isHostParent(node.return)) {
        // If we pop out of the root or hit the parent the fiber we are the
        // last sibling.
        return null;
      }

      node = node.return;
    }

    node.sibling.return = node.return;
    node = node.sibling;

    while (node.tag !== HostComponent && node.tag !== HostText && node.tag !== DehydratedFragment) {
      // If it is not host node and, we might have a host node inside it.
      // Try to search down until we find one.
      if (node.flags & Placement) {
        // If we don't have a child, try the siblings instead.
        continue siblings;
      } // If we don't have a child, try the siblings instead.
      // We also skip portals because they are not part of this host tree.


      if (node.child === null || node.tag === HostPortal) {
        continue siblings;
      } else {
        node.child.return = node;
        node = node.child;
      }
    } // Check if this host node is stable or about to be placed.


    if (!(node.flags & Placement)) {
      // Found it!
      return node.stateNode;
    }
  }
}

function commitPlacement(finishedWork) {


  const parentFiber = getHostParentFiber(finishedWork); // Note: these two variables *must* always be updated together.

  let parent;
  let isContainer;
  const parentStateNode = parentFiber.stateNode;

  switch (parentFiber.tag) {
    case HostComponent:
      parent = parentStateNode;
      isContainer = false;
      break;

    case HostRoot:
      parent = parentStateNode.containerInfo;
      isContainer = true;
      break;

    case HostPortal:
      parent = parentStateNode.containerInfo;
      isContainer = true;
      break;

    case FundamentalComponent:

    // eslint-disable-next-line-no-fallthrough

    default:
      {
        {
          throw Error( formatProdErrorMessage(161));
        }
      }

  }

  if (parentFiber.flags & ContentReset) {

    parentFiber.flags &= ~ContentReset;
  }

  const before = getHostSibling(finishedWork); // We only have the top Fiber that was inserted but we need to recurse down its
  // children to find all the terminal nodes.

  if (isContainer) {
    insertOrAppendPlacementNodeIntoContainer(finishedWork, before, parent);
  } else {
    insertOrAppendPlacementNode(finishedWork, before, parent);
  }
}

function insertOrAppendPlacementNodeIntoContainer(node, before, parent) {
  const tag = node.tag;
  const isHost = tag === HostComponent || tag === HostText;

  if (isHost || enableFundamentalAPI ) {
    const stateNode = isHost ? node.stateNode : node.stateNode.instance;

    if (before) {
      insertInContainerBefore(parent, stateNode, before);
    } else {
      appendChildToContainer(parent, stateNode);
    }
  } else if (tag === HostPortal) ; else {
    const child = node.child;

    if (child !== null) {
      insertOrAppendPlacementNodeIntoContainer(child, before, parent);
      let sibling = child.sibling;

      while (sibling !== null) {
        insertOrAppendPlacementNodeIntoContainer(sibling, before, parent);
        sibling = sibling.sibling;
      }
    }
  }
}

function insertOrAppendPlacementNode(node, before, parent) {
  const tag = node.tag;
  const isHost = tag === HostComponent || tag === HostText;

  if (isHost || enableFundamentalAPI ) {
    const stateNode = isHost ? node.stateNode : node.stateNode.instance;

    if (before) {
      insertBefore(parent, stateNode, before);
    } else {
      appendChild(parent, stateNode);
    }
  } else if (tag === HostPortal) ; else {
    const child = node.child;

    if (child !== null) {
      insertOrAppendPlacementNode(child, before, parent);
      let sibling = child.sibling;

      while (sibling !== null) {
        insertOrAppendPlacementNode(sibling, before, parent);
        sibling = sibling.sibling;
      }
    }
  }
}

function unmountHostComponents(finishedRoot, current, renderPriorityLevel) {
  // We only have the top Fiber that was deleted but we need to recurse down its
  // children to find all the terminal nodes.
  let node = current; // Each iteration, currentParent is populated with node's host parent if not
  // currentParentIsValid.

  let currentParentIsValid = false; // Note: these two variables *must* always be updated together.

  let currentParent;
  let currentParentIsContainer;

  while (true) {
    if (!currentParentIsValid) {
      let parent = node.return;

      findParent: while (true) {
        if (!(parent !== null)) {
          {
            throw Error( formatProdErrorMessage(160));
          }
        }

        const parentStateNode = parent.stateNode;

        switch (parent.tag) {
          case HostComponent:
            currentParent = parentStateNode;
            currentParentIsContainer = false;
            break findParent;

          case HostRoot:
            currentParent = parentStateNode.containerInfo;
            currentParentIsContainer = true;
            break findParent;

          case HostPortal:
            currentParent = parentStateNode.containerInfo;
            currentParentIsContainer = true;
            break findParent;

        }

        parent = parent.return;
      }

      currentParentIsValid = true;
    }

    if (node.tag === HostComponent || node.tag === HostText) {
      commitNestedUnmounts(finishedRoot, node); // After all the children have unmounted, it is now safe to remove the
      // node from the tree.

      if (currentParentIsContainer) {
        removeChildFromContainer(currentParent, node.stateNode);
      } else {
        removeChild(currentParent, node.stateNode);
      } // Don't visit children because we already visited them.

    } else if ( node.tag === DehydratedFragment) {
      {
        const hydrationCallbacks = finishedRoot.hydrationCallbacks;

        if (hydrationCallbacks !== null) {
          const onDeleted = hydrationCallbacks.onDeleted;

          if (onDeleted) {
            onDeleted(node.stateNode);
          }
        }
      } // Delete the dehydrated suspense boundary and all of its content.


      if (currentParentIsContainer) {
        clearSuspenseBoundaryFromContainer(currentParent, node.stateNode);
      } else {
        clearSuspenseBoundary(currentParent, node.stateNode);
      }
    } else if (node.tag === HostPortal) {
      if (node.child !== null) {
        // When we go into a portal, it becomes the parent to remove from.
        // We will reassign it back when we pop the portal on the way up.
        currentParent = node.stateNode.containerInfo;
        currentParentIsContainer = true; // Visit children because portals might contain host components.

        node.child.return = node;
        node = node.child;
        continue;
      }
    } else {
      commitUnmount(finishedRoot, node); // Visit children because we may find more host components below.

      if (node.child !== null) {
        node.child.return = node;
        node = node.child;
        continue;
      }
    }

    if (node === current) {
      return;
    }

    while (node.sibling === null) {
      if (node.return === null || node.return === current) {
        return;
      }

      node = node.return;

      if (node.tag === HostPortal) {
        // When we go out of the portal, we need to restore the parent.
        // Since we don't keep a stack of them, we will search for it.
        currentParentIsValid = false;
      }
    }

    node.sibling.return = node.return;
    node = node.sibling;
  }
}

function commitDeletion(finishedRoot, current, renderPriorityLevel) {
  {
    // Recursively delete all host nodes from the parent.
    // Detach refs and call componentWillUnmount() on the whole subtree.
    unmountHostComponents(finishedRoot, current);
  }

  const alternate = current.alternate;
  detachFiberMutation(current);

  if (alternate !== null) {
    detachFiberMutation(alternate);
  }
}

function commitWork(current, finishedWork) {

  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case MemoComponent:
    case SimpleMemoComponent:
    case Block:
      {
        // Layout effects are destroyed during the mutation phase so that all
        // destroy functions for all fibers are called before any create functions.
        // This prevents sibling component effects from interfering with each other,
        // e.g. a destroy function in one component should never override a ref set
        // by a create function in another component during the same commit.
        {
          commitHookEffectListUnmount(Layout | HasEffect, finishedWork);
        }

        return;
      }

    case ClassComponent:
      {
        return;
      }

    case HostComponent:
      {
        const instance = finishedWork.stateNode;

        if (instance != null) {
          // Commit the work prepared earlier.
          const newProps = finishedWork.memoizedProps; // For hydration we reuse the update path but we treat the oldProps
          // as the newProps. The updatePayload will contain the real change in
          // this case.

          const oldProps = current !== null ? current.memoizedProps : newProps;
          const type = finishedWork.type; // TODO: Type the updateQueue to be specific to host components.

          const updatePayload = finishedWork.updateQueue;
          finishedWork.updateQueue = null;

          if (updatePayload !== null) {
            commitUpdate(instance, updatePayload, type, oldProps, newProps);
          }
        }

        return;
      }

    case HostText:
      {
        if (!(finishedWork.stateNode !== null)) {
          {
            throw Error( formatProdErrorMessage(162));
          }
        }

        const textInstance = finishedWork.stateNode;
        const newText = finishedWork.memoizedProps; // For hydration we reuse the update path but we treat the oldProps
        // as the newProps. The updatePayload will contain the real change in
        // this case.

        const oldText = current !== null ? current.memoizedProps : newText;
        return;
      }

    case HostRoot:
      {

        return;
      }

    case Profiler:
      {
        return;
      }

    case SuspenseComponent:
      {
        commitSuspenseComponent(finishedWork);
        attachSuspenseRetryListeners(finishedWork);
        return;
      }

    case SuspenseListComponent:
      {
        attachSuspenseRetryListeners(finishedWork);
        return;
      }

    case IncompleteClassComponent:
      {
        return;
      }

    case FundamentalComponent:
      {

        break;
      }

    case ScopeComponent:
      {
        {
          const scopeInstance = finishedWork.stateNode;
          prepareScopeUpdate();
          return;
        }
      }

    case OffscreenComponent:
    case LegacyHiddenComponent:
      {
        const newState = finishedWork.memoizedState;
        const isHidden = newState !== null;
        hideOrUnhideAllChildren(finishedWork, isHidden);
        return;
      }
  }

  {
    {
      throw Error( formatProdErrorMessage(163));
    }
  }
}

function commitSuspenseComponent(finishedWork) {
  const newState = finishedWork.memoizedState;

  if (newState !== null) {
    markCommitTimeOfFallback();

    {
      // Hide the Offscreen component that contains the primary children. TODO:
      // Ideally, this effect would have been scheduled on the Offscreen fiber
      // itself. That's how unhiding works: the Offscreen component schedules an
      // effect on itself. However, in this case, the component didn't complete,
      // so the fiber was never added to the effect list in the normal path. We
      // could have appended it to the effect list in the Suspense component's
      // second pass, but doing it this way is less complicated. This would be
      // simpler if we got rid of the effect list and traversed the tree, like
      // we're planning to do.
      const primaryChildParent = finishedWork.child;
      hideOrUnhideAllChildren(primaryChildParent, true);
    }
  }

  if ( newState !== null) {
    const suspenseCallback = finishedWork.memoizedProps.suspenseCallback;

    if (typeof suspenseCallback === 'function') {
      const wakeables = finishedWork.updateQueue;

      if (wakeables !== null) {
        suspenseCallback(new Set(wakeables));
      }
    }
  }
}

function attachSuspenseRetryListeners(finishedWork) {
  // If this boundary just timed out, then it will have a set of wakeables.
  // For each wakeable, attach a listener so that when it resolves, React
  // attempts to re-render the boundary in the primary (pre-timeout) state.
  const wakeables = finishedWork.updateQueue;

  if (wakeables !== null) {
    finishedWork.updateQueue = null;
    let retryCache = finishedWork.stateNode;

    if (retryCache === null) {
      retryCache = finishedWork.stateNode = new PossiblyWeakSet();
    }

    wakeables.forEach(wakeable => {
      // Memoize using the boundary fiber to prevent redundant listeners.
      let retry = resolveRetryWakeable.bind(null, finishedWork, wakeable);

      if (!retryCache.has(wakeable)) {
        {
          if (wakeable.__reactDoNotTraceInteractions !== true) {
            retry = tracing.unstable_wrap(retry);
          }
        }

        retryCache.add(wakeable);
        wakeable.then(retry, retry);
      }
    });
  }
} // This function detects when a Suspense boundary goes from visible to hidden.
// It returns false if the boundary is already hidden.
// TODO: Use an effect tag.


function isSuspenseBoundaryBeingHidden(current, finishedWork) {
  if (current !== null) {
    const oldState = current.memoizedState;

    if (oldState === null || oldState.dehydrated !== null) {
      const newState = finishedWork.memoizedState;
      return newState !== null && newState.dehydrated === null;
    }
  }

  return false;
}

function commitResetTextContent(current) {

  resetTextContent(current.stateNode);
}

const ceil = Math.ceil;
const ReactCurrentDispatcher$2 = ReactSharedInternals.ReactCurrentDispatcher,
      ReactCurrentOwner$2 = ReactSharedInternals.ReactCurrentOwner,
      IsSomeRendererActing = ReactSharedInternals.IsSomeRendererActing;
const NoContext =
/*             */
0b0000000;
const DiscreteEventContext =
/*         */
0b0000100;
const LegacyUnbatchedContext =
/*       */
0b0001000;
const RenderContext =
/*                */
0b0010000;
const CommitContext =
/*                */
0b0100000;
const RetryAfterError =
/*       */
0b1000000;
const RootIncomplete = 0;
const RootFatalErrored = 1;
const RootErrored = 2;
const RootSuspended = 3;
const RootSuspendedWithDelay = 4;
const RootCompleted = 5; // Describes where we are in the React execution stack

let executionContext = NoContext; // The root we're working on

let workInProgressRoot = null; // The fiber we're working on

let workInProgress = null; // The lanes we're rendering

let workInProgressRootRenderLanes = NoLanes; // Stack that allows components to change the render lanes for its subtree
// This is a superset of the lanes we started working on at the root. The only
// case where it's different from `workInProgressRootRenderLanes` is when we
// enter a subtree that is hidden and needs to be unhidden: Suspense and
// Offscreen component.
//
// Most things in the work loop should deal with workInProgressRootRenderLanes.
// Most things in begin/complete phases should deal with subtreeRenderLanes.

let subtreeRenderLanes = NoLanes;
const subtreeRenderLanesCursor = createCursor(NoLanes); // Whether to root completed, errored, suspended, etc.

let workInProgressRootExitStatus = RootIncomplete; // A fatal error, if one is thrown

let workInProgressRootFatalError = null; // "Included" lanes refer to lanes that were worked on during this render. It's
// slightly different than `renderLanes` because `renderLanes` can change as you
// enter and exit an Offscreen tree. This value is the combination of all render
// lanes for the entire render phase.

let workInProgressRootIncludedLanes = NoLanes; // The work left over by components that were visited during this render. Only
// includes unprocessed updates, not work in bailed out children.

let workInProgressRootSkippedLanes = NoLanes; // Lanes that were updated (in an interleaved event) during this render.

let workInProgressRootUpdatedLanes = NoLanes; // Lanes that were pinged (in an interleaved event) during this render.

let workInProgressRootPingedLanes = NoLanes;
let mostRecentlyUpdatedRoot = null; // The most recent time we committed a fallback. This lets us ensure a train
// model where we don't commit new loading states in too quick succession.

let globalMostRecentFallbackTime = 0;
const FALLBACK_THROTTLE_MS = 500; // The absolute time for when we should start giving up on rendering
// more and prefer CPU suspense heuristics instead.

let workInProgressRootRenderTargetTime = Infinity; // How long a render is supposed to take before we start following CPU
// suspense heuristics and opt out of rendering more content.

const RENDER_TIMEOUT_MS = 500;

function resetRenderTimer() {
  workInProgressRootRenderTargetTime = now() + RENDER_TIMEOUT_MS;
}

function getRenderTargetTime() {
  return workInProgressRootRenderTargetTime;
}
let nextEffect = null;
let hasUncaughtError = false;
let firstUncaughtError = null;
let legacyErrorBoundariesThatAlreadyFailed = null;
let rootDoesHavePassiveEffects = false;
let rootWithPendingPassiveEffects = null;
let pendingPassiveEffectsRenderPriority = NoPriority$1;
let pendingPassiveEffectsLanes = NoLanes;
let pendingPassiveHookEffectsMount = [];
let pendingPassiveHookEffectsUnmount = [];
let rootsWithPendingDiscreteUpdates = null; // Use these to prevent an infinite loop of nested updates

const NESTED_UPDATE_LIMIT = 50;
let nestedUpdateCount = 0;
let rootWithNestedUpdates = null;
// during the commit phase. This enables them to be traced across components
// that spawn new work during render. E.g. hidden boundaries, suspended SSR
// hydration or SuspenseList.
// TODO: Can use a bitmask instead of an array

let spawnedWorkDuringRender = null; // If two updates are scheduled within the same event, we should treat their
// event times as simultaneous, even if the actual clock time has advanced
// between the first and second call.

let currentEventTime = NoTimestamp;
let currentEventWipLanes = NoLanes;
let currentEventPendingLanes = NoLanes; // Dev only flag that tracks if passive effects are currently being flushed.
let focusedInstanceHandle = null;
let shouldFireAfterActiveInstanceBlur = false;
function getWorkInProgressRoot() {
  return workInProgressRoot;
}
function requestEventTime() {
  if ((executionContext & (RenderContext | CommitContext)) !== NoContext) {
    // We're inside React, so it's fine to read the actual time.
    return now();
  } // We're not inside React, so we may be in the middle of a browser event.


  if (currentEventTime !== NoTimestamp) {
    // Use the same start time for all updates until we enter React again.
    return currentEventTime;
  } // This is the first update since React yielded. Compute a new start time.


  currentEventTime = now();
  return currentEventTime;
}
function requestUpdateLane(fiber) {
  // Special cases
  const mode = fiber.mode;

  if ((mode & BlockingMode) === NoMode) {
    return SyncLane;
  } else if ((mode & ConcurrentMode) === NoMode) {
    return getCurrentPriorityLevel() === ImmediatePriority$1 ? SyncLane : SyncBatchedLane;
  } else if (!deferRenderPhaseUpdateToNextBatch && (executionContext & RenderContext) !== NoContext && workInProgressRootRenderLanes !== NoLanes) {
    // This is a render phase update. These are not officially supported. The
    // old behavior is to give this the same "thread" (expiration time) as
    // whatever is currently rendering. So if you call `setState` on a component
    // that happens later in the same render, it will flush. Ideally, we want to
    // remove the special case and treat them as if they came from an
    // interleaved event. Regardless, this pattern is not officially supported.
    // This behavior is only a fallback. The flag only exists until we can roll
    // out the setState warning, since existing code might accidentally rely on
    // the current behavior.
    return pickArbitraryLane(workInProgressRootRenderLanes);
  } // The algorithm for assigning an update to a lane should be stable for all
  // updates at the same priority within the same event. To do this, the inputs
  // to the algorithm must be the same. For example, we use the `renderLanes`
  // to avoid choosing a lane that is already in the middle of rendering.
  //
  // However, the "included" lanes could be mutated in between updates in the
  // same event, like if you perform an update inside `flushSync`. Or any other
  // code path that might call `prepareFreshStack`.
  //
  // The trick we use is to cache the first of each of these inputs within an
  // event. Then reset the cached values once we can be sure the event is over.
  // Our heuristic for that is whenever we enter a concurrent work loop.
  //
  // We'll do the same for `currentEventPendingLanes` below.


  if (currentEventWipLanes === NoLanes) {
    currentEventWipLanes = workInProgressRootIncludedLanes;
  }

  const isTransition = requestCurrentTransition() !== NoTransition;

  if (isTransition) {
    if (currentEventPendingLanes !== NoLanes) {
      currentEventPendingLanes = mostRecentlyUpdatedRoot !== null ? mostRecentlyUpdatedRoot.pendingLanes : NoLanes;
    }

    return findTransitionLane(currentEventWipLanes, currentEventPendingLanes);
  } // TODO: Remove this dependency on the Scheduler priority.
  // To do that, we're replacing it with an update lane priority.


  const schedulerPriority = getCurrentPriorityLevel(); // The old behavior was using the priority level of the Scheduler.
  // This couples React to the Scheduler internals, so we're replacing it
  // with the currentUpdateLanePriority above. As an example of how this
  // could be problematic, if we're not inside `Scheduler.runWithPriority`,
  // then we'll get the priority of the current running Scheduler task,
  // which is probably not what we want.

  let lane;

  if ( // TODO: Temporary. We're removing the concept of discrete updates.
  (executionContext & DiscreteEventContext) !== NoContext && schedulerPriority === UserBlockingPriority$1) {
    lane = findUpdateLane(InputDiscreteLanePriority, currentEventWipLanes);
  } else {
    const schedulerLanePriority = schedulerPriorityToLanePriority(schedulerPriority);

    lane = findUpdateLane(schedulerLanePriority, currentEventWipLanes);
  }

  return lane;
}

function requestRetryLane(fiber) {
  // This is a fork of `requestUpdateLane` designed specifically for Suspense
  // "retries" — a special update that attempts to flip a Suspense boundary
  // from its placeholder state to its primary/resolved state.
  // Special cases
  const mode = fiber.mode;

  if ((mode & BlockingMode) === NoMode) {
    return SyncLane;
  } else if ((mode & ConcurrentMode) === NoMode) {
    return getCurrentPriorityLevel() === ImmediatePriority$1 ? SyncLane : SyncBatchedLane;
  } // See `requestUpdateLane` for explanation of `currentEventWipLanes`


  if (currentEventWipLanes === NoLanes) {
    currentEventWipLanes = workInProgressRootIncludedLanes;
  }

  return findRetryLane(currentEventWipLanes);
}

function scheduleUpdateOnFiber(fiber, lane, eventTime) {
  checkForNestedUpdates();
  const root = markUpdateLaneFromFiberToRoot(fiber, lane);

  if (root === null) {
    return null;
  } // Mark that the root has a pending update.


  markRootUpdated(root, lane, eventTime);

  if (root === workInProgressRoot) {
    // Received an update to a tree that's in the middle of rendering. Mark
    // that there was an interleaved update work on this root. Unless the
    // `deferRenderPhaseUpdateToNextBatch` flag is off and this is a render
    // phase update. In that case, we don't treat render phase updates as if
    // they were interleaved, for backwards compat reasons.
    if (deferRenderPhaseUpdateToNextBatch || (executionContext & RenderContext) === NoContext) {
      workInProgressRootUpdatedLanes = mergeLanes(workInProgressRootUpdatedLanes, lane);
    }

    if (workInProgressRootExitStatus === RootSuspendedWithDelay) {
      // The root already suspended with a delay, which means this render
      // definitely won't finish. Since we have a new update, let's mark it as
      // suspended now, right before marking the incoming update. This has the
      // effect of interrupting the current render and switching to the update.
      // TODO: Make sure this doesn't override pings that happen while we've
      // already started rendering.
      markRootSuspended$1(root, workInProgressRootRenderLanes);
    }
  } // TODO: requestUpdateLanePriority also reads the priority. Pass the
  // priority as an argument to that function and this one.


  const priorityLevel = getCurrentPriorityLevel();

  if (lane === SyncLane) {
    if ( // Check if we're inside unbatchedUpdates
    (executionContext & LegacyUnbatchedContext) !== NoContext && // Check if we're not already rendering
    (executionContext & (RenderContext | CommitContext)) === NoContext) {
      // Register pending interactions on the root to avoid losing traced interaction data.
      schedulePendingInteractions(root, lane); // This is a legacy edge case. The initial mount of a ReactDOM.render-ed
      // root inside of batchedUpdates should be synchronous, but layout updates
      // should be deferred until the end of the batch.

      performSyncWorkOnRoot(root);
    } else {
      ensureRootIsScheduled(root, eventTime);
      schedulePendingInteractions(root, lane);

      if (executionContext === NoContext) {
        // Flush the synchronous work now, unless we're already working or inside
        // a batch. This is intentionally inside scheduleUpdateOnFiber instead of
        // scheduleCallbackForFiber to preserve the ability to schedule a callback
        // without immediately flushing it. We only do this for user-initiated
        // updates, to preserve historical behavior of legacy mode.
        resetRenderTimer();
        flushSyncCallbackQueue();
      }
    }
  } else {
    // Schedule a discrete update but only if it's not Sync.
    if ((executionContext & DiscreteEventContext) !== NoContext && ( // Only updates at user-blocking priority or greater are considered
    // discrete, even inside a discrete event.
    priorityLevel === UserBlockingPriority$1 || priorityLevel === ImmediatePriority$1)) {
      // This is the result of a discrete event. Track the lowest priority
      // discrete update per root so we can flush them early, if needed.
      if (rootsWithPendingDiscreteUpdates === null) {
        rootsWithPendingDiscreteUpdates = new Set([root]);
      } else {
        rootsWithPendingDiscreteUpdates.add(root);
      }
    } // Schedule other updates after in case the callback is sync.


    ensureRootIsScheduled(root, eventTime);
    schedulePendingInteractions(root, lane);
  } // We use this when assigning a lane for a transition inside
  // `requestUpdateLane`. We assume it's the same as the root being updated,
  // since in the common case of a single root app it probably is. If it's not
  // the same root, then it's not a huge deal, we just might batch more stuff
  // together more than necessary.


  mostRecentlyUpdatedRoot = root;
} // This is split into a separate function so we can mark a fiber with pending
// work without treating it as a typical update that originates from an event;
// e.g. retrying a Suspense boundary isn't an update, but it does schedule work
// on a fiber.

function markUpdateLaneFromFiberToRoot(sourceFiber, lane) {
  // Update the source fiber's lanes
  sourceFiber.lanes = mergeLanes(sourceFiber.lanes, lane);
  let alternate = sourceFiber.alternate;

  if (alternate !== null) {
    alternate.lanes = mergeLanes(alternate.lanes, lane);
  }


  let node = sourceFiber;
  let parent = sourceFiber.return;

  while (parent !== null) {
    parent.childLanes = mergeLanes(parent.childLanes, lane);
    alternate = parent.alternate;

    if (alternate !== null) {
      alternate.childLanes = mergeLanes(alternate.childLanes, lane);
    }

    node = parent;
    parent = parent.return;
  }

  if (node.tag === HostRoot) {
    const root = node.stateNode;
    return root;
  } else {
    return null;
  }
} // Use this function to schedule a task for a root. There's only one task per
// root; if a task was already scheduled, we'll check to make sure the priority
// of the existing task is the same as the priority of the next level that the
// root has work on. This function is called on every update, and right before
// exiting a task.


function ensureRootIsScheduled(root, currentTime) {
  const existingCallbackNode = root.callbackNode; // Check if any lanes are being starved by other work. If so, mark them as
  // expired so we know to work on those next.

  markStarvedLanesAsExpired(root, currentTime); // Determine the next lanes to work on, and their priority.

  const nextLanes = getNextLanes(root, root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes); // This returns the priority level computed during the `getNextLanes` call.

  const newCallbackPriority = returnNextLanesPriority();

  if (nextLanes === NoLanes) {
    // Special case: There's nothing to work on.
    if (existingCallbackNode !== null) {
      cancelCallback(existingCallbackNode);
      root.callbackNode = null;
      root.callbackPriority = NoLanePriority;
    }

    return;
  } // Check if there's an existing task. We may be able to reuse it.


  if (existingCallbackNode !== null) {
    const existingCallbackPriority = root.callbackPriority;

    if (existingCallbackPriority === newCallbackPriority) {
      // The priority hasn't changed. We can reuse the existing task. Exit.
      return;
    } // The priority changed. Cancel the existing callback. We'll schedule a new
    // one below.


    cancelCallback(existingCallbackNode);
  } // Schedule a new callback.


  let newCallbackNode;

  if (newCallbackPriority === SyncLanePriority) {
    // Special case: Sync React callbacks are scheduled on a special
    // internal queue
    newCallbackNode = scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root));
  } else if (newCallbackPriority === SyncBatchedLanePriority) {
    newCallbackNode = scheduleCallback(ImmediatePriority$1, performSyncWorkOnRoot.bind(null, root));
  } else {
    const schedulerPriorityLevel = lanePriorityToSchedulerPriority(newCallbackPriority);
    newCallbackNode = scheduleCallback(schedulerPriorityLevel, performConcurrentWorkOnRoot.bind(null, root));
  }

  root.callbackPriority = newCallbackPriority;
  root.callbackNode = newCallbackNode;
} // This is the entry point for every concurrent task, i.e. anything that
// goes through Scheduler.


function performConcurrentWorkOnRoot(root) {
  // Since we know we're in a React event, we can clear the current
  // event time. The next update will compute a new event time.
  currentEventTime = NoTimestamp;
  currentEventWipLanes = NoLanes;
  currentEventPendingLanes = NoLanes;

  if (!((executionContext & (RenderContext | CommitContext)) === NoContext)) {
    {
      throw Error( formatProdErrorMessage(327));
    }
  } // Flush any pending passive effects before deciding which lanes to work on,
  // in case they schedule additional work.


  const originalCallbackNode = root.callbackNode;
  const didFlushPassiveEffects = flushPassiveEffects();

  if (didFlushPassiveEffects) {
    // Something in the passive effect phase may have canceled the current task.
    // Check if the task node for this root was changed.
    if (root.callbackNode !== originalCallbackNode) {
      // The current task was canceled. Exit. We don't need to call
      // `ensureRootIsScheduled` because the check above implies either that
      // there's a new task, or that there's no remaining work on this root.
      return null;
    }
  } // Determine the next expiration time to work on, using the fields stored
  // on the root.


  let lanes = getNextLanes(root, root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes);

  if (lanes === NoLanes) {
    // Defensive coding. This is never expected to happen.
    return null;
  }

  let exitStatus = renderRootConcurrent(root, lanes);

  if (includesSomeLane(workInProgressRootIncludedLanes, workInProgressRootUpdatedLanes)) {
    // The render included lanes that were updated during the render phase.
    // For example, when unhiding a hidden tree, we include all the lanes
    // that were previously skipped when the tree was hidden. That set of
    // lanes is a superset of the lanes we started rendering with.
    //
    // So we'll throw out the current work and restart.
    prepareFreshStack(root, NoLanes);
  } else if (exitStatus !== RootIncomplete) {
    if (exitStatus === RootErrored) {
      executionContext |= RetryAfterError; // If an error occurred during hydration,
      // discard server response and fall back to client side render.

      if (root.hydrate) {
        root.hydrate = false;
        clearContainer(root.containerInfo);
      } // If something threw an error, try rendering one more time. We'll render
      // synchronously to block concurrent data mutations, and we'll includes
      // all pending updates are included. If it still fails after the second
      // attempt, we'll give up and commit the resulting tree.


      lanes = getLanesToRetrySynchronouslyOnError(root);

      if (lanes !== NoLanes) {
        exitStatus = renderRootSync(root, lanes);
      }
    }

    if (exitStatus === RootFatalErrored) {
      const fatalError = workInProgressRootFatalError;
      prepareFreshStack(root, NoLanes);
      markRootSuspended$1(root, lanes);
      ensureRootIsScheduled(root, now());
      throw fatalError;
    } // We now have a consistent tree. The next step is either to commit it,
    // or, if something suspended, wait to commit it after a timeout.


    const finishedWork = root.current.alternate;
    root.finishedWork = finishedWork;
    root.finishedLanes = lanes;
    finishConcurrentRender(root, exitStatus, lanes);
  }

  ensureRootIsScheduled(root, now());

  if (root.callbackNode === originalCallbackNode) {
    // The task node scheduled for this root is the same one that's
    // currently executed. Need to return a continuation.
    return performConcurrentWorkOnRoot.bind(null, root);
  }

  return null;
}

function finishConcurrentRender(root, exitStatus, lanes) {
  switch (exitStatus) {
    case RootIncomplete:
    case RootFatalErrored:
      {
        {
          {
            throw Error( formatProdErrorMessage(345));
          }
        }
      }
    // Flow knows about invariant, so it complains if I add a break
    // statement, but eslint doesn't know about invariant, so it complains
    // if I do. eslint-disable-next-line no-fallthrough

    case RootErrored:
      {
        // We should have already attempted to retry this tree. If we reached
        // this point, it errored again. Commit it.
        commitRoot(root);
        break;
      }

    case RootSuspended:
      {
        markRootSuspended$1(root, lanes); // We have an acceptable loading state. We need to figure out if we
        // should immediately commit it or wait a bit.

        if (includesOnlyRetries(lanes) && // do not delay if we're inside an act() scope
        !shouldForceFlushFallbacksInDEV()) {
          // This render only included retries, no updates. Throttle committing
          // retries so that we don't show too many loading states too quickly.
          const msUntilTimeout = globalMostRecentFallbackTime + FALLBACK_THROTTLE_MS - now(); // Don't bother with a very short suspense time.

          if (msUntilTimeout > 10) {
            const nextLanes = getNextLanes(root, NoLanes);

            if (nextLanes !== NoLanes) {
              // There's additional work on this root.
              break;
            }

            const suspendedLanes = root.suspendedLanes;

            if (!isSubsetOfLanes(suspendedLanes, lanes)) {
              // We should prefer to render the fallback of at the last
              // suspended level. Ping the last suspended level to try
              // rendering it again.
              // FIXME: What if the suspended lanes are Idle? Should not restart.
              const eventTime = requestEventTime();
              markRootPinged(root, suspendedLanes);
              break;
            } // The render is suspended, it hasn't timed out, and there's no
            // lower priority work to do. Instead of committing the fallback
            // immediately, wait for more data to arrive.


            root.timeoutHandle = scheduleTimeout(commitRoot.bind(null, root), msUntilTimeout);
            break;
          }
        } // The work expired. Commit immediately.


        commitRoot(root);
        break;
      }

    case RootSuspendedWithDelay:
      {
        markRootSuspended$1(root, lanes);

        if (includesOnlyTransitions(lanes)) {
          // This is a transition, so we should exit without committing a
          // placeholder and without scheduling a timeout. Delay indefinitely
          // until we receive more data.
          break;
        }

        {
          // This is not a transition, but we did trigger an avoided state.
          // Schedule a placeholder to display after a short delay, using the Just
          // Noticeable Difference.
          // TODO: Is the JND optimization worth the added complexity? If this is
          // the only reason we track the event time, then probably not.
          // Consider removing.
          const mostRecentEventTime = getMostRecentEventTime(root, lanes);
          const eventTimeMs = mostRecentEventTime;
          const timeElapsedMs = now() - eventTimeMs;
          const msUntilTimeout = jnd(timeElapsedMs) - timeElapsedMs; // Don't bother with a very short suspense time.

          if (msUntilTimeout > 10) {
            // Instead of committing the fallback immediately, wait for more data
            // to arrive.
            root.timeoutHandle = scheduleTimeout(commitRoot.bind(null, root), msUntilTimeout);
            break;
          }
        } // Commit the placeholder.


        commitRoot(root);
        break;
      }

    case RootCompleted:
      {
        // The work completed. Ready to commit.
        commitRoot(root);
        break;
      }

    default:
      {
        {
          {
            throw Error( formatProdErrorMessage(329));
          }
        }
      }
  }
}

function markRootSuspended$1(root, suspendedLanes) {
  // When suspending, we should always exclude lanes that were pinged or (more
  // rarely, since we try to avoid it) updated during the render phase.
  // TODO: Lol maybe there's a better way to factor this besides this
  // obnoxiously named function :)
  suspendedLanes = removeLanes(suspendedLanes, workInProgressRootPingedLanes);
  suspendedLanes = removeLanes(suspendedLanes, workInProgressRootUpdatedLanes);
  markRootSuspended(root, suspendedLanes);
} // This is the entry point for synchronous tasks that don't go
// through Scheduler


function performSyncWorkOnRoot(root) {
  if (!((executionContext & (RenderContext | CommitContext)) === NoContext)) {
    {
      throw Error( formatProdErrorMessage(327));
    }
  }

  flushPassiveEffects();
  let lanes;
  let exitStatus;

  if (root === workInProgressRoot && includesSomeLane(root.expiredLanes, workInProgressRootRenderLanes)) {
    // There's a partial tree, and at least one of its lanes has expired. Finish
    // rendering it before rendering the rest of the expired work.
    lanes = workInProgressRootRenderLanes;
    exitStatus = renderRootSync(root, lanes);

    if (includesSomeLane(workInProgressRootIncludedLanes, workInProgressRootUpdatedLanes)) {
      // The render included lanes that were updated during the render phase.
      // For example, when unhiding a hidden tree, we include all the lanes
      // that were previously skipped when the tree was hidden. That set of
      // lanes is a superset of the lanes we started rendering with.
      //
      // Note that this only happens when part of the tree is rendered
      // concurrently. If the whole tree is rendered synchronously, then there
      // are no interleaved events.
      lanes = getNextLanes(root, lanes);
      exitStatus = renderRootSync(root, lanes);
    }
  } else {
    lanes = getNextLanes(root, NoLanes);
    exitStatus = renderRootSync(root, lanes);
  }

  if (root.tag !== LegacyRoot && exitStatus === RootErrored) {
    executionContext |= RetryAfterError; // If an error occurred during hydration,
    // discard server response and fall back to client side render.

    if (root.hydrate) {
      root.hydrate = false;
      clearContainer(root.containerInfo);
    } // If something threw an error, try rendering one more time. We'll render
    // synchronously to block concurrent data mutations, and we'll includes
    // all pending updates are included. If it still fails after the second
    // attempt, we'll give up and commit the resulting tree.


    lanes = getLanesToRetrySynchronouslyOnError(root);

    if (lanes !== NoLanes) {
      exitStatus = renderRootSync(root, lanes);
    }
  }

  if (exitStatus === RootFatalErrored) {
    const fatalError = workInProgressRootFatalError;
    prepareFreshStack(root, NoLanes);
    markRootSuspended$1(root, lanes);
    ensureRootIsScheduled(root, now());
    throw fatalError;
  } // We now have a consistent tree. Because this is a sync render, we
  // will commit it even if something suspended.


  const finishedWork = root.current.alternate;
  root.finishedWork = finishedWork;
  root.finishedLanes = lanes;
  commitRoot(root); // Before exiting, make sure there's a callback scheduled for the next
  // pending level.

  ensureRootIsScheduled(root, now());
  return null;
}
function getExecutionContext() {
  return executionContext;
}
function pushRenderLanes(fiber, lanes) {
  push(subtreeRenderLanesCursor, subtreeRenderLanes);
  subtreeRenderLanes = mergeLanes(subtreeRenderLanes, lanes);
  workInProgressRootIncludedLanes = mergeLanes(workInProgressRootIncludedLanes, lanes);
}
function popRenderLanes(fiber) {
  subtreeRenderLanes = subtreeRenderLanesCursor.current;
  pop(subtreeRenderLanesCursor);
}

function prepareFreshStack(root, lanes) {
  root.finishedWork = null;
  root.finishedLanes = NoLanes;
  const timeoutHandle = root.timeoutHandle;

  if (timeoutHandle !== noTimeout) {
    // The root previous suspended and scheduled a timeout to commit a fallback
    // state. Now that we have additional work, cancel the timeout.
    root.timeoutHandle = noTimeout; // $FlowFixMe Complains noTimeout is not a TimeoutID, despite the check above

    cancelTimeout(timeoutHandle);
  }

  if (workInProgress !== null) {
    let interruptedWork = workInProgress.return;

    while (interruptedWork !== null) {
      unwindInterruptedWork(interruptedWork);
      interruptedWork = interruptedWork.return;
    }
  }

  workInProgressRoot = root;
  workInProgress = createWorkInProgress(root.current, null);
  workInProgressRootRenderLanes = subtreeRenderLanes = workInProgressRootIncludedLanes = lanes;
  workInProgressRootExitStatus = RootIncomplete;
  workInProgressRootFatalError = null;
  workInProgressRootSkippedLanes = NoLanes;
  workInProgressRootUpdatedLanes = NoLanes;
  workInProgressRootPingedLanes = NoLanes;

  {
    spawnedWorkDuringRender = null;
  }
}

function handleError(root, thrownValue) {
  do {
    let erroredWork = workInProgress;

    try {
      // Reset module-level state that was set during the render phase.
      resetContextDependencies();
      resetHooksAfterThrow();
      resetCurrentFiber(); // TODO: I found and added this missing line while investigating a
      // separate issue. Write a regression test using string refs.

      ReactCurrentOwner$2.current = null;

      if (erroredWork === null || erroredWork.return === null) {
        // Expected to be working on a non-root fiber. This is a fatal error
        // because there's no ancestor that can handle it; the root is
        // supposed to capture all errors that weren't caught by an error
        // boundary.
        workInProgressRootExitStatus = RootFatalErrored;
        workInProgressRootFatalError = thrownValue; // Set `workInProgress` to null. This represents advancing to the next
        // sibling, or the parent if there are no siblings. But since the root
        // has no siblings nor a parent, we set it to null. Usually this is
        // handled by `completeUnitOfWork` or `unwindWork`, but since we're
        // intentionally not calling those, we need set it here.
        // TODO: Consider calling `unwindWork` to pop the contexts.

        workInProgress = null;
        return;
      }

      if (enableProfilerTimer && erroredWork.mode & ProfileMode) {
        // Record the time spent rendering before an error was thrown. This
        // avoids inaccurate Profiler durations in the case of a
        // suspended render.
        stopProfilerTimerIfRunningAndRecordDelta(erroredWork, true);
      }

      throwException(root, erroredWork.return, erroredWork, thrownValue, workInProgressRootRenderLanes);
      completeUnitOfWork(erroredWork);
    } catch (yetAnotherThrownValue) {
      // Something in the return path also threw.
      thrownValue = yetAnotherThrownValue;

      if (workInProgress === erroredWork && erroredWork !== null) {
        // If this boundary has already errored, then we had trouble processing
        // the error. Bubble it to the next boundary.
        erroredWork = erroredWork.return;
        workInProgress = erroredWork;
      } else {
        erroredWork = workInProgress;
      }

      continue;
    } // Return to the normal work loop.


    return;
  } while (true);
}

function pushDispatcher() {
  const prevDispatcher = ReactCurrentDispatcher$2.current;
  ReactCurrentDispatcher$2.current = ContextOnlyDispatcher;

  if (prevDispatcher === null) {
    // The React isomorphic package does not include a default dispatcher.
    // Instead the first renderer will lazily attach one, in order to give
    // nicer error messages.
    return ContextOnlyDispatcher;
  } else {
    return prevDispatcher;
  }
}

function popDispatcher(prevDispatcher) {
  ReactCurrentDispatcher$2.current = prevDispatcher;
}

function pushInteractions(root) {
  {
    const prevInteractions = tracing.__interactionsRef.current;
    tracing.__interactionsRef.current = root.memoizedInteractions;
    return prevInteractions;
  }
}

function popInteractions(prevInteractions) {
  {
    tracing.__interactionsRef.current = prevInteractions;
  }
}

function markCommitTimeOfFallback() {
  globalMostRecentFallbackTime = now();
}
function markSkippedUpdateLanes(lane) {
  workInProgressRootSkippedLanes = mergeLanes(lane, workInProgressRootSkippedLanes);
}
function renderDidSuspend() {
  if (workInProgressRootExitStatus === RootIncomplete) {
    workInProgressRootExitStatus = RootSuspended;
  }
}
function renderDidSuspendDelayIfPossible() {
  if (workInProgressRootExitStatus === RootIncomplete || workInProgressRootExitStatus === RootSuspended) {
    workInProgressRootExitStatus = RootSuspendedWithDelay;
  } // Check if there are updates that we skipped tree that might have unblocked
  // this render.


  if (workInProgressRoot !== null && (includesNonIdleWork(workInProgressRootSkippedLanes) || includesNonIdleWork(workInProgressRootUpdatedLanes))) {
    // Mark the current render as suspended so that we switch to working on
    // the updates that were skipped. Usually we only suspend at the end of
    // the render phase.
    // TODO: We should probably always mark the root as suspended immediately
    // (inside this function), since by suspending at the end of the render
    // phase introduces a potential mistake where we suspend lanes that were
    // pinged or updated while we were rendering.
    markRootSuspended$1(workInProgressRoot, workInProgressRootRenderLanes);
  }
}
function renderDidError() {
  if (workInProgressRootExitStatus !== RootCompleted) {
    workInProgressRootExitStatus = RootErrored;
  }
} // Called during render to determine if anything has suspended.
// Returns false if we're not sure.

function renderHasNotSuspendedYet() {
  // If something errored or completed, we can't really be sure,
  // so those are false.
  return workInProgressRootExitStatus === RootIncomplete;
}

function renderRootSync(root, lanes) {
  const prevExecutionContext = executionContext;
  executionContext |= RenderContext;
  const prevDispatcher = pushDispatcher(); // If the root or lanes have changed, throw out the existing stack
  // and prepare a fresh one. Otherwise we'll continue where we left off.

  if (workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes) {
    prepareFreshStack(root, lanes);
    startWorkOnPendingInteractions(root, lanes);
  }

  const prevInteractions = pushInteractions(root);

  do {
    try {
      workLoopSync();
      break;
    } catch (thrownValue) {
      handleError(root, thrownValue);
    }
  } while (true);

  resetContextDependencies();

  {
    popInteractions(prevInteractions);
  }

  executionContext = prevExecutionContext;
  popDispatcher(prevDispatcher);

  if (workInProgress !== null) {
    // This is a sync render, so we should have finished the whole tree.
    {
      {
        throw Error( formatProdErrorMessage(261));
      }
    }
  }


  workInProgressRoot = null;
  workInProgressRootRenderLanes = NoLanes;
  return workInProgressRootExitStatus;
} // The work loop is an extremely hot path. Tell Closure not to inline it.

/** @noinline */


function workLoopSync() {
  // Already timed out, so perform work without checking if we need to yield.
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function renderRootConcurrent(root, lanes) {
  const prevExecutionContext = executionContext;
  executionContext |= RenderContext;
  const prevDispatcher = pushDispatcher(); // If the root or lanes have changed, throw out the existing stack
  // and prepare a fresh one. Otherwise we'll continue where we left off.

  if (workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes) {
    resetRenderTimer();
    prepareFreshStack(root, lanes);
    startWorkOnPendingInteractions(root, lanes);
  }

  const prevInteractions = pushInteractions(root);

  do {
    try {
      workLoopConcurrent();
      break;
    } catch (thrownValue) {
      handleError(root, thrownValue);
    }
  } while (true);

  resetContextDependencies();

  {
    popInteractions(prevInteractions);
  }

  popDispatcher(prevDispatcher);
  executionContext = prevExecutionContext;


  if (workInProgress !== null) {

    return RootIncomplete;
  } else {


    workInProgressRoot = null;
    workInProgressRootRenderLanes = NoLanes; // Return the final exit status.

    return workInProgressRootExitStatus;
  }
}
/** @noinline */


function workLoopConcurrent() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(unitOfWork) {
  // The current, flushed, state of this fiber is the alternate. Ideally
  // nothing should rely on this, but relying on it here means that we don't
  // need an additional field on the work in progress.
  const current = unitOfWork.alternate;
  let next;

  {
    next = beginWork$1(current, unitOfWork, subtreeRenderLanes);
  }
  unitOfWork.memoizedProps = unitOfWork.pendingProps;

  if (next === null) {
    // If this doesn't spawn new work, complete the current work.
    completeUnitOfWork(unitOfWork);
  } else {
    workInProgress = next;
  }

  ReactCurrentOwner$2.current = null;
}

function completeUnitOfWork(unitOfWork) {
  // Attempt to complete the current unit of work, then move to the next
  // sibling. If there are no more siblings, return to the parent fiber.
  let completedWork = unitOfWork;

  do {
    // The current, flushed, state of this fiber is the alternate. Ideally
    // nothing should rely on this, but relying on it here means that we don't
    // need an additional field on the work in progress.
    const current = completedWork.alternate;
    const returnFiber = completedWork.return; // Check if the work completed or if something threw.

    if ((completedWork.flags & Incomplete) === NoFlags) {
      let next;

      {
        next = completeWork(current, completedWork, subtreeRenderLanes);
      }

      if (next !== null) {
        // Completing this fiber spawned new work. Work on that next.
        workInProgress = next;
        return;
      }

      resetChildLanes(completedWork);

      if (returnFiber !== null && // Do not append effects to parents if a sibling failed to complete
      (returnFiber.flags & Incomplete) === NoFlags) {
        // Append all the effects of the subtree and this fiber onto the effect
        // list of the parent. The completion order of the children affects the
        // side-effect order.
        if (returnFiber.firstEffect === null) {
          returnFiber.firstEffect = completedWork.firstEffect;
        }

        if (completedWork.lastEffect !== null) {
          if (returnFiber.lastEffect !== null) {
            returnFiber.lastEffect.nextEffect = completedWork.firstEffect;
          }

          returnFiber.lastEffect = completedWork.lastEffect;
        } // If this fiber had side-effects, we append it AFTER the children's
        // side-effects. We can perform certain side-effects earlier if needed,
        // by doing multiple passes over the effect list. We don't want to
        // schedule our own side-effect on our own list because if end up
        // reusing children we'll schedule this effect onto itself since we're
        // at the end.


        const flags = completedWork.flags; // Skip both NoWork and PerformedWork tags when creating the effect
        // list. PerformedWork effect is read by React DevTools but shouldn't be
        // committed.

        if (flags > PerformedWork) {
          if (returnFiber.lastEffect !== null) {
            returnFiber.lastEffect.nextEffect = completedWork;
          } else {
            returnFiber.firstEffect = completedWork;
          }

          returnFiber.lastEffect = completedWork;
        }
      }
    } else {
      // This fiber did not complete because something threw. Pop values off
      // the stack without entering the complete phase. If this is a boundary,
      // capture values if possible.
      const next = unwindWork(completedWork); // Because this fiber did not complete, don't reset its expiration time.

      if (next !== null) {
        // If completing this work spawned new work, do that next. We'll come
        // back here again.
        // Since we're restarting, remove anything that is not a host effect
        // from the effect tag.
        next.flags &= HostEffectMask;
        workInProgress = next;
        return;
      }

      if (returnFiber !== null) {
        // Mark the parent fiber as incomplete and clear its effect list.
        returnFiber.firstEffect = returnFiber.lastEffect = null;
        returnFiber.flags |= Incomplete;
      }
    }

    const siblingFiber = completedWork.sibling;

    if (siblingFiber !== null) {
      // If there is more work to do in this returnFiber, do that next.
      workInProgress = siblingFiber;
      return;
    } // Otherwise, return to the parent


    completedWork = returnFiber; // Update the next thing we're working on in case something throws.

    workInProgress = completedWork;
  } while (completedWork !== null); // We've reached the root.


  if (workInProgressRootExitStatus === RootIncomplete) {
    workInProgressRootExitStatus = RootCompleted;
  }
}

function resetChildLanes(completedWork) {
  if ( // TODO: Move this check out of the hot path by moving `resetChildLanes`
  // to switch statement in `completeWork`.
  (completedWork.tag === LegacyHiddenComponent || completedWork.tag === OffscreenComponent) && completedWork.memoizedState !== null && !includesSomeLane(subtreeRenderLanes, OffscreenLane) && (completedWork.mode & ConcurrentMode) !== NoLanes) {
    // The children of this component are hidden. Don't bubble their
    // expiration times.
    return;
  }

  let newChildLanes = NoLanes; // Bubble up the earliest expiration time.

  {
    let child = completedWork.child;

    while (child !== null) {
      newChildLanes = mergeLanes(newChildLanes, mergeLanes(child.lanes, child.childLanes));
      child = child.sibling;
    }
  }

  completedWork.childLanes = newChildLanes;
}

function commitRoot(root) {
  const renderPriorityLevel = getCurrentPriorityLevel();
  runWithPriority(ImmediatePriority$1, commitRootImpl.bind(null, root, renderPriorityLevel));
  return null;
}

function commitRootImpl(root, renderPriorityLevel) {
  do {
    // `flushPassiveEffects` will call `flushSyncUpdateQueue` at the end, which
    // means `flushPassiveEffects` will sometimes result in additional
    // passive effects. So we need to keep flushing in a loop until there are
    // no more pending effects.
    // TODO: Might be better if `flushPassiveEffects` did not automatically
    // flush synchronous work at the end, to avoid factoring hazards like this.
    flushPassiveEffects();
  } while (rootWithPendingPassiveEffects !== null);

  if (!((executionContext & (RenderContext | CommitContext)) === NoContext)) {
    {
      throw Error( formatProdErrorMessage(327));
    }
  }

  const finishedWork = root.finishedWork;
  const lanes = root.finishedLanes;

  if (finishedWork === null) {

    return null;
  }

  root.finishedWork = null;
  root.finishedLanes = NoLanes;

  if (!(finishedWork !== root.current)) {
    {
      throw Error( formatProdErrorMessage(177));
    }
  } // commitRoot never returns a continuation; it always finishes synchronously.
  // So we can clear these now to allow a new callback to be scheduled.


  root.callbackNode = null; // Update the first and last pending times on this root. The new first
  // pending time is whatever is left on the root fiber.

  let remainingLanes = mergeLanes(finishedWork.lanes, finishedWork.childLanes);
  markRootFinished(root, remainingLanes); // Clear already finished discrete updates in case that a later call of
  // `flushDiscreteUpdates` starts a useless render pass which may cancels
  // a scheduled timeout.

  if (rootsWithPendingDiscreteUpdates !== null) {
    if (!hasDiscreteLanes(remainingLanes) && rootsWithPendingDiscreteUpdates.has(root)) {
      rootsWithPendingDiscreteUpdates.delete(root);
    }
  }

  if (root === workInProgressRoot) {
    // We can reset these now that they are finished.
    workInProgressRoot = null;
    workInProgress = null;
    workInProgressRootRenderLanes = NoLanes;
  } // Get the list of effects.


  let firstEffect;

  if (finishedWork.flags > PerformedWork) {
    // A fiber's effect list consists only of its children, not itself. So if
    // the root has an effect, we need to add it to the end of the list. The
    // resulting list is the set that would belong to the root's parent, if it
    // had one; that is, all the effects in the tree including the root.
    if (finishedWork.lastEffect !== null) {
      finishedWork.lastEffect.nextEffect = finishedWork;
      firstEffect = finishedWork.firstEffect;
    } else {
      firstEffect = finishedWork;
    }
  } else {
    // There is no effect on the root.
    firstEffect = finishedWork.firstEffect;
  }

  if (firstEffect !== null) {

    const prevExecutionContext = executionContext;
    executionContext |= CommitContext;
    const prevInteractions = pushInteractions(root); // Reset this to null before calling lifecycles

    ReactCurrentOwner$2.current = null; // The commit phase is broken into several sub-phases. We do a separate pass
    // of the effect list for each phase: all mutation effects come before all
    // layout effects, and so on.
    // The first phase a "before mutation" phase. We use this phase to read the
    // state of the host tree right before we mutate it. This is where
    // getSnapshotBeforeUpdate is called.

    focusedInstanceHandle = prepareForCommit(root.containerInfo);
    shouldFireAfterActiveInstanceBlur = false;
    nextEffect = firstEffect;

    do {
      {
        try {
          commitBeforeMutationEffects();
        } catch (error) {
          if (!(nextEffect !== null)) {
            {
              throw Error( formatProdErrorMessage(330));
            }
          }

          captureCommitPhaseError(nextEffect, error);
          nextEffect = nextEffect.nextEffect;
        }
      }
    } while (nextEffect !== null); // We no longer need to track the active instance fiber


    focusedInstanceHandle = null;


    nextEffect = firstEffect;

    do {
      {
        try {
          commitMutationEffects(root, renderPriorityLevel);
        } catch (error) {
          if (!(nextEffect !== null)) {
            {
              throw Error( formatProdErrorMessage(330));
            }
          }

          captureCommitPhaseError(nextEffect, error);
          nextEffect = nextEffect.nextEffect;
        }
      }
    } while (nextEffect !== null);

    resetAfterCommit(root.containerInfo); // The work-in-progress tree is now the current tree. This must come after
    // the mutation phase, so that the previous tree is still current during
    // componentWillUnmount, but before the layout phase, so that the finished
    // work is current during componentDidMount/Update.

    root.current = finishedWork; // The next phase is the layout phase, where we call effects that read
    // the host tree after it's been mutated. The idiomatic use case for this is
    // layout, but class component lifecycles also fire here for legacy reasons.

    nextEffect = firstEffect;

    do {
      {
        try {
          commitLayoutEffects(root, lanes);
        } catch (error) {
          if (!(nextEffect !== null)) {
            {
              throw Error( formatProdErrorMessage(330));
            }
          }

          captureCommitPhaseError(nextEffect, error);
          nextEffect = nextEffect.nextEffect;
        }
      }
    } while (nextEffect !== null);

    nextEffect = null; // Tell Scheduler to yield at the end of the frame, so the browser has an
    // opportunity to paint.

    requestPaint();

    {
      popInteractions(prevInteractions);
    }

    executionContext = prevExecutionContext;
  } else {
    // No effects.
    root.current = finishedWork; // Measure these anyway so the flamegraph explicitly shows that there were
  }

  const rootDidHavePassiveEffects = rootDoesHavePassiveEffects;

  if (rootDoesHavePassiveEffects) {
    // This commit has passive effects. Stash a reference to them. But don't
    // schedule a callback until after flushing layout work.
    rootDoesHavePassiveEffects = false;
    rootWithPendingPassiveEffects = root;
    pendingPassiveEffectsLanes = lanes;
    pendingPassiveEffectsRenderPriority = renderPriorityLevel;
  } else {
    // We are done with the effect chain at this point so let's clear the
    // nextEffect pointers to assist with GC. If we have passive effects, we'll
    // clear this in flushPassiveEffects.
    nextEffect = firstEffect;

    while (nextEffect !== null) {
      const nextNextEffect = nextEffect.nextEffect;
      nextEffect.nextEffect = null;

      if (nextEffect.flags & Deletion) {
        detachFiberAfterEffects(nextEffect);
      }

      nextEffect = nextNextEffect;
    }
  } // Read this again, since an effect might have updated it


  remainingLanes = root.pendingLanes; // Check if there's remaining work on this root

  if (remainingLanes !== NoLanes) {
    {
      if (spawnedWorkDuringRender !== null) {
        const expirationTimes = spawnedWorkDuringRender;
        spawnedWorkDuringRender = null;

        for (let i = 0; i < expirationTimes.length; i++) {
          scheduleInteractions(root, expirationTimes[i], root.memoizedInteractions);
        }
      }

      schedulePendingInteractions(root, remainingLanes);
    }
  } else {
    // If there's no remaining work, we can clear the set of already failed
    // error boundaries.
    legacyErrorBoundariesThatAlreadyFailed = null;
  }

  {
    if (!rootDidHavePassiveEffects) {
      // If there are no passive effects, then we can complete the pending interactions.
      // Otherwise, we'll wait until after the passive effects are flushed.
      // Wait to do this until after remaining work has been scheduled,
      // so that we don't prematurely signal complete for interactions when there's e.g. hidden work.
      finishPendingInteractions(root, lanes);
    }
  }

  if (remainingLanes === SyncLane) {
    // Count the number of times the root synchronously re-renders without
    // finishing. If there are too many, it indicates an infinite update loop.
    if (root === rootWithNestedUpdates) {
      nestedUpdateCount++;
    } else {
      nestedUpdateCount = 0;
      rootWithNestedUpdates = root;
    }
  } else {
    nestedUpdateCount = 0;
  }

  onCommitRoot(finishedWork.stateNode, renderPriorityLevel);
  // additional work on this root is scheduled.


  ensureRootIsScheduled(root, now());

  if (hasUncaughtError) {
    hasUncaughtError = false;
    const error = firstUncaughtError;
    firstUncaughtError = null;
    throw error;
  }

  if ((executionContext & LegacyUnbatchedContext) !== NoContext) {
    // a ReactDOM.render-ed root inside of batchedUpdates. The commit fired
    // synchronously, but layout updates should be deferred until the end
    // of the batch.


    return null;
  } // If layout work was scheduled, flush it now.


  flushSyncCallbackQueue();

  return null;
}

function commitBeforeMutationEffects() {
  while (nextEffect !== null) {
    const current = nextEffect.alternate;

    if (!shouldFireAfterActiveInstanceBlur && focusedInstanceHandle !== null) {
      if ((nextEffect.flags & Deletion) !== NoFlags) {
        if (doesFiberContain(nextEffect, focusedInstanceHandle)) {
          shouldFireAfterActiveInstanceBlur = true;
        }
      } else {
        // TODO: Move this out of the hot path using a dedicated effect tag.
        if (nextEffect.tag === SuspenseComponent && isSuspenseBoundaryBeingHidden(current, nextEffect) && doesFiberContain(nextEffect, focusedInstanceHandle)) {
          shouldFireAfterActiveInstanceBlur = true;
        }
      }
    }

    const flags = nextEffect.flags;

    if ((flags & Snapshot) !== NoFlags) {
      commitBeforeMutationLifeCycles(current, nextEffect);
    }

    if ((flags & Passive) !== NoFlags) {
      // If there are passive effects, schedule a callback to flush at
      // the earliest opportunity.
      if (!rootDoesHavePassiveEffects) {
        rootDoesHavePassiveEffects = true;
        scheduleCallback(NormalPriority$1, () => {
          flushPassiveEffects();
          return null;
        });
      }
    }

    nextEffect = nextEffect.nextEffect;
  }
}

function commitMutationEffects(root, renderPriorityLevel) {
  // TODO: Should probably move the bulk of this function to commitWork.
  while (nextEffect !== null) {
    const flags = nextEffect.flags;

    if (flags & ContentReset) {
      commitResetTextContent(nextEffect);
    }

    if (flags & Ref) {
      const current = nextEffect.alternate;

      if (current !== null) {
        commitDetachRef(current);
      }

      {
        // TODO: This is a temporary solution that allowed us to transition away
        // from React Flare on www.
        if (nextEffect.tag === ScopeComponent) {
          commitAttachRef(nextEffect);
        }
      }
    } // The following switch statement is only concerned about placement,
    // updates, and deletions. To avoid needing to add a case for every possible
    // bitmap value, we remove the secondary effects from the effect tag and
    // switch on that value.


    const primaryFlags = flags & (Placement | Update | Deletion | Hydrating);

    switch (primaryFlags) {
      case Placement:
        {
          commitPlacement(nextEffect); // Clear the "placement" from effect tag so that we know that this is
          // inserted, before any life-cycles like componentDidMount gets called.
          // TODO: findDOMNode doesn't rely on this any more but isMounted does
          // and isMounted is deprecated anyway so we should be able to kill this.

          nextEffect.flags &= ~Placement;
          break;
        }

      case PlacementAndUpdate:
        {
          // Placement
          commitPlacement(nextEffect); // Clear the "placement" from effect tag so that we know that this is
          // inserted, before any life-cycles like componentDidMount gets called.

          nextEffect.flags &= ~Placement; // Update

          const current = nextEffect.alternate;
          commitWork(current, nextEffect);
          break;
        }

      case Hydrating:
        {
          nextEffect.flags &= ~Hydrating;
          break;
        }

      case HydratingAndUpdate:
        {
          nextEffect.flags &= ~Hydrating; // Update

          const current = nextEffect.alternate;
          commitWork(current, nextEffect);
          break;
        }

      case Update:
        {
          const current = nextEffect.alternate;
          commitWork(current, nextEffect);
          break;
        }

      case Deletion:
        {
          commitDeletion(root, nextEffect);
          break;
        }
    }
    nextEffect = nextEffect.nextEffect;
  }
}

function commitLayoutEffects(root, committedLanes) {


  while (nextEffect !== null) {
    const flags = nextEffect.flags;

    if (flags & (Update | Callback)) {
      const current = nextEffect.alternate;
      commitLifeCycles(root, current, nextEffect);
    }

    {
      // TODO: This is a temporary solution that allowed us to transition away
      // from React Flare on www.
      if (flags & Ref && nextEffect.tag !== ScopeComponent) {
        commitAttachRef(nextEffect);
      }
    }
    nextEffect = nextEffect.nextEffect;
  }
}

function flushPassiveEffects() {
  // Returns whether passive effects were flushed.
  if (pendingPassiveEffectsRenderPriority !== NoPriority$1) {
    const priorityLevel = pendingPassiveEffectsRenderPriority > NormalPriority$1 ? NormalPriority$1 : pendingPassiveEffectsRenderPriority;
    pendingPassiveEffectsRenderPriority = NoPriority$1;

    if (decoupleUpdatePriorityFromScheduler) {

      try {
        setCurrentUpdateLanePriority(schedulerPriorityToLanePriority(priorityLevel));
        return runWithPriority(priorityLevel, flushPassiveEffectsImpl);
      } finally {
      }
    } else {
      return runWithPriority(priorityLevel, flushPassiveEffectsImpl);
    }
  }

  return false;
}
function enqueuePendingPassiveHookEffectMount(fiber, effect) {
  pendingPassiveHookEffectsMount.push(effect, fiber);

  if (!rootDoesHavePassiveEffects) {
    rootDoesHavePassiveEffects = true;
    scheduleCallback(NormalPriority$1, () => {
      flushPassiveEffects();
      return null;
    });
  }
}
function enqueuePendingPassiveHookEffectUnmount(fiber, effect) {
  pendingPassiveHookEffectsUnmount.push(effect, fiber);

  if (!rootDoesHavePassiveEffects) {
    rootDoesHavePassiveEffects = true;
    scheduleCallback(NormalPriority$1, () => {
      flushPassiveEffects();
      return null;
    });
  }
}

function flushPassiveEffectsImpl() {
  if (rootWithPendingPassiveEffects === null) {
    return false;
  }

  const root = rootWithPendingPassiveEffects;
  const lanes = pendingPassiveEffectsLanes;
  rootWithPendingPassiveEffects = null;
  pendingPassiveEffectsLanes = NoLanes;

  if (!((executionContext & (RenderContext | CommitContext)) === NoContext)) {
    {
      throw Error( formatProdErrorMessage(331));
    }
  }

  const prevExecutionContext = executionContext;
  executionContext |= CommitContext;
  const prevInteractions = pushInteractions(root); // It's important that ALL pending passive effect destroy functions are called
  // before ANY passive effect create functions are called.
  // Otherwise effects in sibling components might interfere with each other.
  // e.g. a destroy function in one component may unintentionally override a ref
  // value set by a create function in another component.
  // Layout effects have the same constraint.
  // First pass: Destroy stale passive effects.

  const unmountEffects = pendingPassiveHookEffectsUnmount;
  pendingPassiveHookEffectsUnmount = [];

  for (let i = 0; i < unmountEffects.length; i += 2) {
    const effect = unmountEffects[i];
    const fiber = unmountEffects[i + 1];
    const destroy = effect.destroy;
    effect.destroy = undefined;

    if (typeof destroy === 'function') {
      {
        try {
          if (enableProfilerTimer && enableProfilerCommitHooks && fiber.mode & ProfileMode) {
            try {
              startPassiveEffectTimer();
              destroy();
            } finally {
              recordPassiveEffectDuration(fiber);
            }
          } else {
            destroy();
          }
        } catch (error) {
          if (!(fiber !== null)) {
            {
              throw Error( formatProdErrorMessage(330));
            }
          }

          captureCommitPhaseError(fiber, error);
        }
      }
    }
  } // Second pass: Create new passive effects.


  const mountEffects = pendingPassiveHookEffectsMount;
  pendingPassiveHookEffectsMount = [];

  for (let i = 0; i < mountEffects.length; i += 2) {
    const effect = mountEffects[i];
    const fiber = mountEffects[i + 1];

    {
      try {
        const create = effect.create;

        if (enableProfilerTimer && enableProfilerCommitHooks && fiber.mode & ProfileMode) {
          try {
            startPassiveEffectTimer();
            effect.destroy = create();
          } finally {
            recordPassiveEffectDuration(fiber);
          }
        } else {
          effect.destroy = create();
        }
      } catch (error) {
        if (!(fiber !== null)) {
          {
            throw Error( formatProdErrorMessage(330));
          }
        }

        captureCommitPhaseError(fiber, error);
      }
    }
  } // Note: This currently assumes there are no passive effects on the root fiber
  // because the root is not part of its own effect list.
  // This could change in the future.


  let effect = root.current.firstEffect;

  while (effect !== null) {
    const nextNextEffect = effect.nextEffect; // Remove nextEffect pointer to assist GC

    effect.nextEffect = null;

    if (effect.flags & Deletion) {
      detachFiberAfterEffects(effect);
    }

    effect = nextNextEffect;
  }

  {
    popInteractions(prevInteractions);
    finishPendingInteractions(root, lanes);
  }

  executionContext = prevExecutionContext;
  flushSyncCallbackQueue(); // If additional passive effects were scheduled, increment a counter. If this
  return true;
}

function isAlreadyFailedLegacyErrorBoundary(instance) {
  return legacyErrorBoundariesThatAlreadyFailed !== null && legacyErrorBoundariesThatAlreadyFailed.has(instance);
}
function markLegacyErrorBoundaryAsFailed(instance) {
  if (legacyErrorBoundariesThatAlreadyFailed === null) {
    legacyErrorBoundariesThatAlreadyFailed = new Set([instance]);
  } else {
    legacyErrorBoundariesThatAlreadyFailed.add(instance);
  }
}

function prepareToThrowUncaughtError(error) {
  if (!hasUncaughtError) {
    hasUncaughtError = true;
    firstUncaughtError = error;
  }
}

const onUncaughtError = prepareToThrowUncaughtError;

function captureCommitPhaseErrorOnRoot(rootFiber, sourceFiber, error) {
  const errorInfo = createCapturedValue(error, sourceFiber);
  const update = createRootErrorUpdate(rootFiber, errorInfo, SyncLane);
  enqueueUpdate(rootFiber, update);
  const eventTime = requestEventTime();
  const root = markUpdateLaneFromFiberToRoot(rootFiber, SyncLane);

  if (root !== null) {
    markRootUpdated(root, SyncLane, eventTime);
    ensureRootIsScheduled(root, eventTime);
    schedulePendingInteractions(root, SyncLane);
  }
}

function captureCommitPhaseError(sourceFiber, error) {
  if (sourceFiber.tag === HostRoot) {
    // Error was thrown at the root. There is no parent, so the root
    // itself should capture it.
    captureCommitPhaseErrorOnRoot(sourceFiber, sourceFiber, error);
    return;
  }

  let fiber = sourceFiber.return;

  while (fiber !== null) {
    if (fiber.tag === HostRoot) {
      captureCommitPhaseErrorOnRoot(fiber, sourceFiber, error);
      return;
    } else if (fiber.tag === ClassComponent) {
      const ctor = fiber.type;
      const instance = fiber.stateNode;

      if (typeof ctor.getDerivedStateFromError === 'function' || typeof instance.componentDidCatch === 'function' && !isAlreadyFailedLegacyErrorBoundary(instance)) {
        const errorInfo = createCapturedValue(error, sourceFiber);
        const update = createClassErrorUpdate(fiber, errorInfo, SyncLane);
        enqueueUpdate(fiber, update);
        const eventTime = requestEventTime();
        const root = markUpdateLaneFromFiberToRoot(fiber, SyncLane);

        if (root !== null) {
          markRootUpdated(root, SyncLane, eventTime);
          ensureRootIsScheduled(root, eventTime);
          schedulePendingInteractions(root, SyncLane);
        } else {
          // This component has already been unmounted.
          // We can't schedule any follow up work for the root because the fiber is already unmounted,
          // but we can still call the log-only boundary so the error isn't swallowed.
          //
          // TODO This is only a temporary bandaid for the old reconciler fork.
          // We can delete this special case once the new fork is merged.
          if (typeof instance.componentDidCatch === 'function' && !isAlreadyFailedLegacyErrorBoundary(instance)) {
            try {
              instance.componentDidCatch(error, errorInfo);
            } catch (errorToIgnore) {// TODO Ignore this error? Rethrow it?
              // This is kind of an edge case.
            }
          }
        }

        return;
      }
    }

    fiber = fiber.return;
  }
}
function pingSuspendedRoot(root, wakeable, pingedLanes) {
  const pingCache = root.pingCache;

  if (pingCache !== null) {
    // The wakeable resolved, so we no longer need to memoize, because it will
    // never be thrown again.
    pingCache.delete(wakeable);
  }

  const eventTime = requestEventTime();
  markRootPinged(root, pingedLanes);

  if (workInProgressRoot === root && isSubsetOfLanes(workInProgressRootRenderLanes, pingedLanes)) {
    // Received a ping at the same priority level at which we're currently
    // rendering. We might want to restart this render. This should mirror
    // the logic of whether or not a root suspends once it completes.
    // TODO: If we're rendering sync either due to Sync, Batched or expired,
    // we should probably never restart.
    // If we're suspended with delay, or if it's a retry, we'll always suspend
    // so we can always restart.
    if (workInProgressRootExitStatus === RootSuspendedWithDelay || workInProgressRootExitStatus === RootSuspended && includesOnlyRetries(workInProgressRootRenderLanes) && now() - globalMostRecentFallbackTime < FALLBACK_THROTTLE_MS) {
      // Restart from the root.
      prepareFreshStack(root, NoLanes);
    } else {
      // Even though we can't restart right now, we might get an
      // opportunity later. So we mark this render as having a ping.
      workInProgressRootPingedLanes = mergeLanes(workInProgressRootPingedLanes, pingedLanes);
    }
  }

  ensureRootIsScheduled(root, eventTime);
  schedulePendingInteractions(root, pingedLanes);
}

function retryTimedOutBoundary(boundaryFiber, retryLane) {
  // The boundary fiber (a Suspense component or SuspenseList component)
  // previously was rendered in its fallback state. One of the promises that
  // suspended it has resolved, which means at least part of the tree was
  // likely unblocked. Try rendering again, at a new expiration time.
  if (retryLane === NoLane) {
    retryLane = requestRetryLane(boundaryFiber);
  } // TODO: Special case idle priority?


  const eventTime = requestEventTime();
  const root = markUpdateLaneFromFiberToRoot(boundaryFiber, retryLane);

  if (root !== null) {
    markRootUpdated(root, retryLane, eventTime);
    ensureRootIsScheduled(root, eventTime);
    schedulePendingInteractions(root, retryLane);
  }
}

function retryDehydratedSuspenseBoundary(boundaryFiber) {
  const suspenseState = boundaryFiber.memoizedState;
  let retryLane = NoLane;

  if (suspenseState !== null) {
    retryLane = suspenseState.retryLane;
  }

  retryTimedOutBoundary(boundaryFiber, retryLane);
}
function resolveRetryWakeable(boundaryFiber, wakeable) {
  let retryLane = NoLane; // Default

  let retryCache;

  {
    switch (boundaryFiber.tag) {
      case SuspenseComponent:
        retryCache = boundaryFiber.stateNode;
        const suspenseState = boundaryFiber.memoizedState;

        if (suspenseState !== null) {
          retryLane = suspenseState.retryLane;
        }

        break;

      case SuspenseListComponent:
        retryCache = boundaryFiber.stateNode;
        break;

      default:
        {
          {
            throw Error( formatProdErrorMessage(314));
          }
        }

    }
  }

  if (retryCache !== null) {
    // The wakeable resolved, so we no longer need to memoize, because it will
    // never be thrown again.
    retryCache.delete(wakeable);
  }

  retryTimedOutBoundary(boundaryFiber, retryLane);
} // Computes the next Just Noticeable Difference (JND) boundary.
// The theory is that a person can't tell the difference between small differences in time.
// Therefore, if we wait a bit longer than necessary that won't translate to a noticeable
// difference in the experience. However, waiting for longer might mean that we can avoid
// showing an intermediate loading state. The longer we have already waited, the harder it
// is to tell small differences in time. Therefore, the longer we've already waited,
// the longer we can wait additionally. At some point we have to give up though.
// We pick a train model where the next boundary commits at a consistent schedule.
// These particular numbers are vague estimates. We expect to adjust them based on research.

function jnd(timeElapsed) {
  return timeElapsed < 120 ? 120 : timeElapsed < 480 ? 480 : timeElapsed < 1080 ? 1080 : timeElapsed < 1920 ? 1920 : timeElapsed < 3000 ? 3000 : timeElapsed < 4320 ? 4320 : ceil(timeElapsed / 1960) * 1960;
}

function checkForNestedUpdates() {
  if (nestedUpdateCount > NESTED_UPDATE_LIMIT) {
    nestedUpdateCount = 0;
    rootWithNestedUpdates = null;

    {
      {
        throw Error( formatProdErrorMessage(185));
      }
    }
  }
}

let beginWork$1;

{
  beginWork$1 = beginWork;
}

function computeThreadID(root, lane) {
  // Interaction threads are unique per root and expiration time.
  // NOTE: Intentionally unsound cast. All that matters is that it's a number
  // and it represents a batch of work. Could make a helper function instead,
  // but meh this is fine for now.
  return lane * 1000 + root.interactionThreadID;
}

function markSpawnedWork(lane) {

  if (spawnedWorkDuringRender === null) {
    spawnedWorkDuringRender = [lane];
  } else {
    spawnedWorkDuringRender.push(lane);
  }
}

function scheduleInteractions(root, lane, interactions) {

  if (interactions.size > 0) {
    const pendingInteractionMap = root.pendingInteractionMap;
    const pendingInteractions = pendingInteractionMap.get(lane);

    if (pendingInteractions != null) {
      interactions.forEach(interaction => {
        if (!pendingInteractions.has(interaction)) {
          // Update the pending async work count for previously unscheduled interaction.
          interaction.__count++;
        }

        pendingInteractions.add(interaction);
      });
    } else {
      pendingInteractionMap.set(lane, new Set(interactions)); // Update the pending async work count for the current interactions.

      interactions.forEach(interaction => {
        interaction.__count++;
      });
    }

    const subscriber = tracing.__subscriberRef.current;

    if (subscriber !== null) {
      const threadID = computeThreadID(root, lane);
      subscriber.onWorkScheduled(interactions, threadID);
    }
  }
}

function schedulePendingInteractions(root, lane) {

  scheduleInteractions(root, lane, tracing.__interactionsRef.current);
}

function startWorkOnPendingInteractions(root, lanes) {
  // we can accurately attribute time spent working on it, And so that cascading
  // work triggered during the render phase will be associated with it.


  const interactions = new Set();
  root.pendingInteractionMap.forEach((scheduledInteractions, scheduledLane) => {
    if (includesSomeLane(lanes, scheduledLane)) {
      scheduledInteractions.forEach(interaction => interactions.add(interaction));
    }
  }); // Store the current set of interactions on the FiberRoot for a few reasons:
  // We can re-use it in hot functions like performConcurrentWorkOnRoot()
  // without having to recalculate it. We will also use it in commitWork() to
  // pass to any Profiler onRender() hooks. This also provides DevTools with a
  // way to access it when the onCommitRoot() hook is called.

  root.memoizedInteractions = interactions;

  if (interactions.size > 0) {
    const subscriber = tracing.__subscriberRef.current;

    if (subscriber !== null) {
      const threadID = computeThreadID(root, lanes);

      try {
        subscriber.onWorkStarted(interactions, threadID);
      } catch (error) {
        // If the subscriber throws, rethrow it in a separate task
        scheduleCallback(ImmediatePriority$1, () => {
          throw error;
        });
      }
    }
  }
}

function finishPendingInteractions(root, committedLanes) {

  const remainingLanesAfterCommit = root.pendingLanes;
  let subscriber;

  try {
    subscriber = tracing.__subscriberRef.current;

    if (subscriber !== null && root.memoizedInteractions.size > 0) {
      // FIXME: More than one lane can finish in a single commit.
      const threadID = computeThreadID(root, committedLanes);
      subscriber.onWorkStopped(root.memoizedInteractions, threadID);
    }
  } catch (error) {
    // If the subscriber throws, rethrow it in a separate task
    scheduleCallback(ImmediatePriority$1, () => {
      throw error;
    });
  } finally {
    // Clear completed interactions from the pending Map.
    // Unless the render was suspended or cascading work was scheduled,
    // In which case– leave pending interactions until the subsequent render.
    const pendingInteractionMap = root.pendingInteractionMap;
    pendingInteractionMap.forEach((scheduledInteractions, lane) => {
      // Only decrement the pending interaction count if we're done.
      // If there's still work at the current priority,
      // That indicates that we are waiting for suspense data.
      if (!includesSomeLane(remainingLanesAfterCommit, lane)) {
        pendingInteractionMap.delete(lane);
        scheduledInteractions.forEach(interaction => {
          interaction.__count--;

          if (subscriber !== null && interaction.__count === 0) {
            try {
              subscriber.onInteractionScheduledWorkCompleted(interaction);
            } catch (error) {
              // If the subscriber throws, rethrow it in a separate task
              scheduleCallback(ImmediatePriority$1, () => {
                throw error;
              });
            }
          }
        });
      }
    });
  }
} // `act` testing API

function shouldForceFlushFallbacksInDEV() {
  // Never force flush in production. This function should get stripped out.
  return false ;
}

function detachFiberAfterEffects(fiber) {
  fiber.sibling = null;
  fiber.stateNode = null;
}

function FiberNode(tag, pendingProps, key, mode) {
  // Instance
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null; // Fiber

  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;
  this.mode = mode; // Effects

  this.flags = NoFlags;
  this.nextEffect = null;
  this.firstEffect = null;
  this.lastEffect = null;
  this.lanes = NoLanes;
  this.childLanes = NoLanes;
  this.alternate = null;
} // This is a constructor function, rather than a POJO constructor, still
// please ensure we do the following:
// 1) Nobody should add any instance methods on this. Instance methods can be
//    more difficult to predict when they get optimized and they are almost
//    never inlined properly in static compilers.
// 2) Nobody should rely on `instanceof Fiber` for type testing. We should
//    always know when it is a fiber.
// 3) We might want to experiment with using numeric keys since they are easier
//    to optimize in a non-JIT environment.
// 4) We can easily go from a constructor to a createFiber object literal if that
//    is faster.
// 5) It should be easy to port this to a C struct and keep a C implementation
//    compatible.


const createFiber = function (tag, pendingProps, key, mode) {
  // $FlowFixMe: the shapes are exact here but Flow doesn't like constructors
  return new FiberNode(tag, pendingProps, key, mode);
};

function shouldConstruct(Component) {
  const prototype = Component.prototype;
  return !!(prototype && prototype.isReactComponent);
}

function isSimpleFunctionComponent(type) {
  return typeof type === 'function' && !shouldConstruct(type) && type.defaultProps === undefined;
}
function resolveLazyComponentTag(Component) {
  if (typeof Component === 'function') {
    return shouldConstruct(Component) ? ClassComponent : FunctionComponent;
  } else if (Component !== undefined && Component !== null) {
    const $$typeof = Component.$$typeof;

    if ($$typeof === REACT_FORWARD_REF_TYPE) {
      return ForwardRef;
    }

    if ($$typeof === REACT_MEMO_TYPE) {
      return MemoComponent;
    }

    {
      if ($$typeof === REACT_BLOCK_TYPE) {
        return Block;
      }
    }
  }

  return IndeterminateComponent;
} // This is used to create an alternate fiber to do work on.

function createWorkInProgress(current, pendingProps) {
  let workInProgress = current.alternate;

  if (workInProgress === null) {
    // We use a double buffering pooling technique because we know that we'll
    // only ever need at most two versions of a tree. We pool the "other" unused
    // node that we're free to reuse. This is lazily created to avoid allocating
    // extra objects for things that are never updated. It also allow us to
    // reclaim the extra memory if needed.
    workInProgress = createFiber(current.tag, pendingProps, current.key, current.mode);
    workInProgress.elementType = current.elementType;
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;

    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {
    workInProgress.pendingProps = pendingProps; // Needed because Blocks store data on type.

    workInProgress.type = current.type; // We already have an alternate.
    // Reset the effect tag.

    workInProgress.flags = NoFlags; // The effect list is no longer valid.

    workInProgress.nextEffect = null;
    workInProgress.firstEffect = null;
    workInProgress.lastEffect = null;
  }

  workInProgress.childLanes = current.childLanes;
  workInProgress.lanes = current.lanes;
  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.updateQueue = current.updateQueue; // Clone the dependencies object. This is mutated during the render phase, so
  // it cannot be shared with the current fiber.

  const currentDependencies = current.dependencies;
  workInProgress.dependencies = currentDependencies === null ? null : {
    lanes: currentDependencies.lanes,
    firstContext: currentDependencies.firstContext
  }; // These will be overridden during the parent's reconciliation

  workInProgress.sibling = current.sibling;
  workInProgress.index = current.index;
  workInProgress.ref = current.ref;

  return workInProgress;
} // Used to reuse a Fiber for a second pass.

function resetWorkInProgress(workInProgress, renderLanes) {
  // This resets the Fiber to what createFiber or createWorkInProgress would
  // have set the values to before during the first pass. Ideally this wouldn't
  // be necessary but unfortunately many code paths reads from the workInProgress
  // when they should be reading from current and writing to workInProgress.
  // We assume pendingProps, index, key, ref, return are still untouched to
  // avoid doing another reconciliation.
  // Reset the effect tag but keep any Placement tags, since that's something
  // that child fiber is setting, not the reconciliation.
  workInProgress.flags &= Placement; // The effect list is no longer valid.

  workInProgress.nextEffect = null;
  workInProgress.firstEffect = null;
  workInProgress.lastEffect = null;
  const current = workInProgress.alternate;

  if (current === null) {
    // Reset to createFiber's initial values.
    workInProgress.childLanes = NoLanes;
    workInProgress.lanes = renderLanes;
    workInProgress.child = null;
    workInProgress.memoizedProps = null;
    workInProgress.memoizedState = null;
    workInProgress.updateQueue = null;
    workInProgress.dependencies = null;
    workInProgress.stateNode = null;
  } else {
    // Reset to the cloned values that createWorkInProgress would've.
    workInProgress.childLanes = current.childLanes;
    workInProgress.lanes = current.lanes;
    workInProgress.child = current.child;
    workInProgress.memoizedProps = current.memoizedProps;
    workInProgress.memoizedState = current.memoizedState;
    workInProgress.updateQueue = current.updateQueue; // Needed because Blocks store data on type.

    workInProgress.type = current.type; // Clone the dependencies object. This is mutated during the render phase, so
    // it cannot be shared with the current fiber.

    const currentDependencies = current.dependencies;
    workInProgress.dependencies = currentDependencies === null ? null : {
      lanes: currentDependencies.lanes,
      firstContext: currentDependencies.firstContext
    };
  }

  return workInProgress;
}
function createHostRootFiber(tag) {
  let mode;

  if (tag === ConcurrentRoot) {
    mode = ConcurrentMode | BlockingMode | StrictMode;
  } else if (tag === BlockingRoot) {
    mode = BlockingMode | StrictMode;
  } else {
    mode = NoMode;
  }

  return createFiber(HostRoot, null, null, mode);
}
function createFiberFromTypeAndProps(type, // React$ElementType
key, pendingProps, owner, mode, lanes) {
  let fiberTag = IndeterminateComponent; // The resolved type is set if we know what the final type will be. I.e. it's not lazy.

  let resolvedType = type;

  if (typeof type === 'function') {
    if (shouldConstruct(type)) {
      fiberTag = ClassComponent;
    }
  } else if (typeof type === 'string') {
    fiberTag = HostComponent;
  } else {
    getTag: switch (type) {
      case REACT_FRAGMENT_TYPE:
        return createFiberFromFragment(pendingProps.children, mode, lanes, key);

      case REACT_DEBUG_TRACING_MODE_TYPE:
        fiberTag = Mode;
        mode |= DebugTracingMode;
        break;

      case REACT_STRICT_MODE_TYPE:
        fiberTag = Mode;
        mode |= StrictMode;
        break;

      case REACT_PROFILER_TYPE:
        return createFiberFromProfiler(pendingProps, mode, lanes, key);

      case REACT_SUSPENSE_TYPE:
        return createFiberFromSuspense(pendingProps, mode, lanes, key);

      case REACT_SUSPENSE_LIST_TYPE:
        return createFiberFromSuspenseList(pendingProps, mode, lanes, key);

      case REACT_OFFSCREEN_TYPE:
        return createFiberFromOffscreen(pendingProps, mode, lanes, key);

      case REACT_LEGACY_HIDDEN_TYPE:
        return createFiberFromLegacyHidden(pendingProps, mode, lanes, key);

      case REACT_SCOPE_TYPE:
        {
          return createFiberFromScope(type, pendingProps, mode, lanes, key);
        }

      // eslint-disable-next-line no-fallthrough

      default:
        {
          if (typeof type === 'object' && type !== null) {
            switch (type.$$typeof) {
              case REACT_PROVIDER_TYPE:
                fiberTag = ContextProvider;
                break getTag;

              case REACT_CONTEXT_TYPE:
                // This is a consumer
                fiberTag = ContextConsumer;
                break getTag;

              case REACT_FORWARD_REF_TYPE:
                fiberTag = ForwardRef;

                break getTag;

              case REACT_MEMO_TYPE:
                fiberTag = MemoComponent;
                break getTag;

              case REACT_LAZY_TYPE:
                fiberTag = LazyComponent;
                resolvedType = null;
                break getTag;

              case REACT_BLOCK_TYPE:
                fiberTag = Block;
                break getTag;
            }
          }

          let info = '';

          {
            {
              throw Error( formatProdErrorMessage(130, type == null ? type : typeof type, info));
            }
          }
        }
    }
  }

  const fiber = createFiber(fiberTag, pendingProps, key, mode);
  fiber.elementType = type;
  fiber.type = resolvedType;
  fiber.lanes = lanes;

  return fiber;
}
function createFiberFromElement(element, mode, lanes) {
  let owner = null;

  const type = element.type;
  const key = element.key;
  const pendingProps = element.props;
  const fiber = createFiberFromTypeAndProps(type, key, pendingProps, owner, mode, lanes);

  return fiber;
}
function createFiberFromFragment(elements, mode, lanes, key) {
  const fiber = createFiber(Fragment, elements, key, mode);
  fiber.lanes = lanes;
  return fiber;
}

function createFiberFromScope(scope, pendingProps, mode, lanes, key) {
  const fiber = createFiber(ScopeComponent, pendingProps, key, mode);
  fiber.type = scope;
  fiber.elementType = scope;
  fiber.lanes = lanes;
  return fiber;
}

function createFiberFromProfiler(pendingProps, mode, lanes, key) {

  const fiber = createFiber(Profiler, pendingProps, key, mode | ProfileMode); // TODO: The Profiler fiber shouldn't have a type. It has a tag.

  fiber.elementType = REACT_PROFILER_TYPE;
  fiber.type = REACT_PROFILER_TYPE;
  fiber.lanes = lanes;

  return fiber;
}

function createFiberFromSuspense(pendingProps, mode, lanes, key) {
  const fiber = createFiber(SuspenseComponent, pendingProps, key, mode); // TODO: The SuspenseComponent fiber shouldn't have a type. It has a tag.
  // This needs to be fixed in getComponentName so that it relies on the tag
  // instead.

  fiber.type = REACT_SUSPENSE_TYPE;
  fiber.elementType = REACT_SUSPENSE_TYPE;
  fiber.lanes = lanes;
  return fiber;
}
function createFiberFromSuspenseList(pendingProps, mode, lanes, key) {
  const fiber = createFiber(SuspenseListComponent, pendingProps, key, mode);

  fiber.elementType = REACT_SUSPENSE_LIST_TYPE;
  fiber.lanes = lanes;
  return fiber;
}
function createFiberFromOffscreen(pendingProps, mode, lanes, key) {
  const fiber = createFiber(OffscreenComponent, pendingProps, key, mode); // TODO: The OffscreenComponent fiber shouldn't have a type. It has a tag.

  fiber.elementType = REACT_OFFSCREEN_TYPE;
  fiber.lanes = lanes;
  return fiber;
}
function createFiberFromLegacyHidden(pendingProps, mode, lanes, key) {
  const fiber = createFiber(LegacyHiddenComponent, pendingProps, key, mode); // TODO: The LegacyHidden fiber shouldn't have a type. It has a tag.

  fiber.elementType = REACT_LEGACY_HIDDEN_TYPE;
  fiber.lanes = lanes;
  return fiber;
}
function createFiberFromText(content, mode, lanes) {
  const fiber = createFiber(HostText, content, null, mode);
  fiber.lanes = lanes;
  return fiber;
}
function createFiberFromPortal(portal, mode, lanes) {
  const pendingProps = portal.children !== null ? portal.children : [];
  const fiber = createFiber(HostPortal, pendingProps, portal.key, mode);
  fiber.lanes = lanes;
  fiber.stateNode = {
    containerInfo: portal.containerInfo,
    pendingChildren: null,
    // Used by persistent updates
    implementation: portal.implementation
  };
  return fiber;
} // Used for stashing WIP properties to replay failed work in DEV.

function FiberRootNode(containerInfo, tag, hydrate) {
  this.tag = tag;
  this.containerInfo = containerInfo;
  this.pendingChildren = null;
  this.current = null;
  this.pingCache = null;
  this.finishedWork = null;
  this.timeoutHandle = noTimeout;
  this.context = null;
  this.pendingContext = null;
  this.hydrate = hydrate;
  this.callbackNode = null;
  this.callbackPriority = NoLanePriority;
  this.eventTimes = createLaneMap(NoLanes);
  this.expirationTimes = createLaneMap(NoTimestamp);
  this.pendingLanes = NoLanes;
  this.suspendedLanes = NoLanes;
  this.pingedLanes = NoLanes;
  this.expiredLanes = NoLanes;
  this.mutableReadLanes = NoLanes;
  this.finishedLanes = NoLanes;
  this.entangledLanes = NoLanes;
  this.entanglements = createLaneMap(NoLanes);

  {
    this.interactionThreadID = tracing.unstable_getThreadID();
    this.memoizedInteractions = new Set();
    this.pendingInteractionMap = new Map();
  }

  {
    this.hydrationCallbacks = null;
  }
}

function createFiberRoot(containerInfo, tag, hydrate, hydrationCallbacks) {
  const root = new FiberRootNode(containerInfo, tag, hydrate);

  {
    root.hydrationCallbacks = hydrationCallbacks;
  } // Cyclic construction. This cheats the type system right now because
  // stateNode is any.


  const uninitializedFiber = createHostRootFiber(tag);
  root.current = uninitializedFiber;
  uninitializedFiber.stateNode = root;
  initializeUpdateQueue(uninitializedFiber);
  return root;
}

function getContextForSubtree(parentComponent) {
  if (!parentComponent) {
    return emptyContextObject;
  }

  const fiber = get(parentComponent);
  const parentContext = findCurrentUnmaskedContext();

  if (fiber.tag === ClassComponent) {
    const Component = fiber.type;

    if (isContextProvider()) {
      return processChildContext(fiber, Component, parentContext);
    }
  }

  return parentContext;
}

function createContainer(containerInfo, tag, hydrate, hydrationCallbacks) {
  return createFiberRoot(containerInfo, tag, hydrate, hydrationCallbacks);
}
function updateContainer(element, container, parentComponent, callback) {

  const current = container.current;
  const eventTime = requestEventTime();

  const lane = requestUpdateLane(current);

  const context = getContextForSubtree(parentComponent);

  if (container.context === null) {
    container.context = context;
  } else {
    container.pendingContext = context;
  }

  const update = createUpdate(eventTime, lane); // Caution: React DevTools currently depends on this property
  // being called "element".

  update.payload = {
    element
  };
  callback = callback === undefined ? null : callback;

  if (callback !== null) {

    update.callback = callback;
  }

  enqueueUpdate(current, update);
  scheduleUpdateOnFiber(current, lane, eventTime);
  return lane;
}
let overrideHookState = null;
let overrideHookStateDeletePath = null;
let overrideHookStateRenamePath = null;
let overrideProps = null;
let overridePropsDeletePath = null;
let overridePropsRenamePath = null;
let scheduleUpdate = null;
let setSuspenseHandler = null;

function findHostInstanceByFiber(fiber) {
  const hostFiber = findCurrentHostFiber(fiber);

  if (hostFiber === null) {
    return null;
  }

  return hostFiber.stateNode;
}

function emptyFindFiberByHostInstance(instance) {
  return null;
}

function injectIntoDevTools(devToolsConfig) {
  const findFiberByHostInstance = devToolsConfig.findFiberByHostInstance;
  const ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
  return injectInternals({
    bundleType: devToolsConfig.bundleType,
    version: devToolsConfig.version,
    rendererPackageName: devToolsConfig.rendererPackageName,
    rendererConfig: devToolsConfig.rendererConfig,
    overrideHookState,
    overrideHookStateDeletePath,
    overrideHookStateRenamePath,
    overrideProps,
    overridePropsDeletePath,
    overridePropsRenamePath,
    setSuspenseHandler,
    scheduleUpdate,
    currentDispatcherRef: ReactCurrentDispatcher,
    findHostInstanceByFiber,
    findFiberByHostInstance: findFiberByHostInstance || emptyFindFiberByHostInstance,
    // React Refresh
    findHostInstancesForRefresh:  null,
    scheduleRefresh:  null,
    scheduleRoot:  null,
    setRefreshHandler:  null,
    // Enables DevTools to append owner stacks to error messages in DEV mode.
    getCurrentFiber:  null
  });
}

Mode$1.setCurrent( // Change to 'art/modes/dom' for easier debugging via SVG
FastNoSideEffects);
/** Declarative fill-type objects; API design not finalized */

const slice = Array.prototype.slice;

let LinearGradient = /*#__PURE__*/function () {
  function LinearGradient(stops, x1, y1, x2, y2) {
    this._args = slice.call(arguments);
  }

  var _proto = LinearGradient.prototype;

  _proto.applyFill = function applyFill(node) {
    node.fillLinear.apply(node, this._args);
  };

  return LinearGradient;
}();

let RadialGradient = /*#__PURE__*/function () {
  function RadialGradient(stops, fx, fy, rx, ry, cx, cy) {
    this._args = slice.call(arguments);
  }

  var _proto2 = RadialGradient.prototype;

  _proto2.applyFill = function applyFill(node) {
    node.fillRadial.apply(node, this._args);
  };

  return RadialGradient;
}();

let Pattern = /*#__PURE__*/function () {
  function Pattern(url, width, height, left, top) {
    this._args = slice.call(arguments);
  }

  var _proto3 = Pattern.prototype;

  _proto3.applyFill = function applyFill(node) {
    node.fillImage.apply(node, this._args);
  };

  return Pattern;
}();
/** React Components */


let Surface = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Surface, _React$Component);

  function Surface() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto4 = Surface.prototype;

  _proto4.componentDidMount = function componentDidMount() {
    const _this$props = this.props,
          height = _this$props.height,
          width = _this$props.width;
    this._surface = Mode$1.Surface(+width, +height, this._tagRef);
    this._mountNode = createContainer(this._surface, LegacyRoot, false, null);
    updateContainer(this.props.children, this._mountNode, this);
  };

  _proto4.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    const props = this.props;

    if (props.height !== prevProps.height || props.width !== prevProps.width) {
      this._surface.resize(+props.width, +props.height);
    }

    updateContainer(this.props.children, this._mountNode, this);

    if (this._surface.render) {
      this._surface.render();
    }
  };

  _proto4.componentWillUnmount = function componentWillUnmount() {
    updateContainer(null, this._mountNode, this);
  };

  _proto4.render = function render() {
    // This is going to be a placeholder because we don't know what it will
    // actually resolve to because ART may render canvas, vml or svg tags here.
    // We only allow a subset of properties since others might conflict with
    // ART's properties.
    const props = this.props; // TODO: ART's Canvas Mode overrides surface title and cursor

    const Tag = Mode$1.Surface.tagName;
    return /*#__PURE__*/React.createElement(Tag, {
      ref: ref => this._tagRef = ref,
      accessKey: props.accessKey,
      className: props.className,
      draggable: props.draggable,
      role: props.role,
      style: props.style,
      tabIndex: props.tabIndex,
      title: props.title
    });
  };

  return Surface;
}(React.Component);

let Text = /*#__PURE__*/function (_React$Component2) {
  _inheritsLoose(Text, _React$Component2);

  function Text(props) {
    var _this;

    _this = _React$Component2.call(this, props) || this; // We allow reading these props. Ideally we could expose the Text node as
    // ref directly.

    ['height', 'width', 'x', 'y'].forEach(key => {
      Object.defineProperty(_assertThisInitialized(_this), key, {
        get: function () {
          return this._text ? this._text[key] : undefined;
        }
      });
    });
    return _this;
  }

  var _proto5 = Text.prototype;

  _proto5.render = function render() {
    // This means you can't have children that render into strings...
    const T = TYPES.TEXT;
    return /*#__PURE__*/React.createElement(T, _extends({}, this.props, {
      ref: t => this._text = t
    }), childrenAsString(this.props.children));
  };

  return Text;
}(React.Component);

injectIntoDevTools({
  findFiberByHostInstance: () => null,
  bundleType:  0,
  version: ReactVersion,
  rendererPackageName: 'react-art'
});
/** API */

const ClippingRectangle = TYPES.CLIPPING_RECTANGLE;
const Group = TYPES.GROUP;
const Shape = TYPES.SHAPE;
const Path = Mode$1.Path;

exports.Transform = Transform;
exports.ClippingRectangle = ClippingRectangle;
exports.Group = Group;
exports.LinearGradient = LinearGradient;
exports.Path = Path;
exports.Pattern = Pattern;
exports.RadialGradient = RadialGradient;
exports.Shape = Shape;
exports.Surface = Surface;
exports.Text = Text;
//# sourceMappingURL=ReactART-prod.js.map
