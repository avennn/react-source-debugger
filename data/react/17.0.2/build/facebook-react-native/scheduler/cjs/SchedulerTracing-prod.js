'use strict';

let threadIDCounter = 0; // Set of currently traced interactions.
// Interactions "stack"–
// Meaning that newly traced interactions are appended to the previously active set.
// When an interaction goes out of scope, the previous set (if any) is restored.

let interactionsRef = null; // Listener(s) to notify when interactions begin and end.

let subscriberRef = null;
function unstable_clear(callback) {
  {
    return callback();
  }
}
function unstable_getCurrent() {
  {
    return null;
  }
}
function unstable_getThreadID() {
  return ++threadIDCounter;
}
function unstable_trace(name, timestamp, callback) {

  {
    return callback();
  }
}
function unstable_wrap(callback) {

  {
    return callback;
  }
}

function unstable_subscribe(subscriber) {
}
function unstable_unsubscribe(subscriber) {
}

exports.__interactionsRef = interactionsRef;
exports.__subscriberRef = subscriberRef;
exports.unstable_clear = unstable_clear;
exports.unstable_getCurrent = unstable_getCurrent;
exports.unstable_getThreadID = unstable_getThreadID;
exports.unstable_subscribe = unstable_subscribe;
exports.unstable_trace = unstable_trace;
exports.unstable_unsubscribe = unstable_unsubscribe;
exports.unstable_wrap = unstable_wrap;
//# sourceMappingURL=SchedulerTracing-prod.js.map
