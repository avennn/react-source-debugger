'use strict';

const enableSchedulerDebugging = false;
const enableProfiling = false;

let currentTime = 0;
let scheduledCallback = null;
let scheduledTimeout = null;
let timeoutTime = -1;
let yieldedValues = null;
let expectedNumberOfYields = -1;
let didStop = false;
let isFlushing = false;
let needsPaint = false;
let shouldYieldForPaint = false;
function requestHostCallback(callback) {
  scheduledCallback = callback;
}
function requestHostTimeout(callback, ms) {
  scheduledTimeout = callback;
  timeoutTime = currentTime + ms;
}
function cancelHostTimeout() {
  scheduledTimeout = null;
  timeoutTime = -1;
}
function shouldYieldToHost() {
  if (expectedNumberOfYields !== -1 && yieldedValues !== null && yieldedValues.length >= expectedNumberOfYields || shouldYieldForPaint && needsPaint) {
    // We yielded at least as many values as expected. Stop flushing.
    didStop = true;
    return true;
  }

  return false;
}
function getCurrentTime() {
  return currentTime;
}
function forceFrameRate() {// No-op
}

function unstable_flushNumberOfYields(count) {
  if (isFlushing) {
    throw new Error('Already flushing work.');
  }

  if (scheduledCallback !== null) {
    const cb = scheduledCallback;
    expectedNumberOfYields = count;
    isFlushing = true;

    try {
      let hasMoreWork = true;

      do {
        hasMoreWork = cb(true, currentTime);
      } while (hasMoreWork && !didStop);

      if (!hasMoreWork) {
        scheduledCallback = null;
      }
    } finally {
      expectedNumberOfYields = -1;
      didStop = false;
      isFlushing = false;
    }
  }
}
function unstable_flushUntilNextPaint() {
  if (isFlushing) {
    throw new Error('Already flushing work.');
  }

  if (scheduledCallback !== null) {
    const cb = scheduledCallback;
    shouldYieldForPaint = true;
    needsPaint = false;
    isFlushing = true;

    try {
      let hasMoreWork = true;

      do {
        hasMoreWork = cb(true, currentTime);
      } while (hasMoreWork && !didStop);

      if (!hasMoreWork) {
        scheduledCallback = null;
      }
    } finally {
      shouldYieldForPaint = false;
      didStop = false;
      isFlushing = false;
    }
  }
}
function unstable_flushExpired() {
  if (isFlushing) {
    throw new Error('Already flushing work.');
  }

  if (scheduledCallback !== null) {
    isFlushing = true;

    try {
      const hasMoreWork = scheduledCallback(false, currentTime);

      if (!hasMoreWork) {
        scheduledCallback = null;
      }
    } finally {
      isFlushing = false;
    }
  }
}
function unstable_flushAllWithoutAsserting() {
  // Returns false if no work was flushed.
  if (isFlushing) {
    throw new Error('Already flushing work.');
  }

  if (scheduledCallback !== null) {
    const cb = scheduledCallback;
    isFlushing = true;

    try {
      let hasMoreWork = true;

      do {
        hasMoreWork = cb(true, currentTime);
      } while (hasMoreWork);

      if (!hasMoreWork) {
        scheduledCallback = null;
      }

      return true;
    } finally {
      isFlushing = false;
    }
  } else {
    return false;
  }
}
function unstable_clearYields() {
  if (yieldedValues === null) {
    return [];
  }

  const values = yieldedValues;
  yieldedValues = null;
  return values;
}
function unstable_flushAll() {
  if (yieldedValues !== null) {
    throw new Error('Log is not empty. Assert on the log of yielded values before ' + 'flushing additional work.');
  }

  unstable_flushAllWithoutAsserting();

  if (yieldedValues !== null) {
    throw new Error('While flushing work, something yielded a value. Use an ' + 'assertion helper to assert on the log of yielded values, e.g. ' + 'expect(Scheduler).toFlushAndYield([...])');
  }
}
function unstable_yieldValue(value) {
  // eslint-disable-next-line react-internal/no-production-logging
  if (console.log.name === 'disabledLog') {
    // If console.log has been patched, we assume we're in render
    // replaying and we ignore any values yielding in the second pass.
    return;
  }

  if (yieldedValues === null) {
    yieldedValues = [value];
  } else {
    yieldedValues.push(value);
  }
}
function unstable_advanceTime(ms) {
  // eslint-disable-next-line react-internal/no-production-logging
  if (console.log.name === 'disabledLog') {
    // If console.log has been patched, we assume we're in render
    // replaying and we ignore any time advancing in the second pass.
    return;
  }

  currentTime += ms;

  if (scheduledTimeout !== null && timeoutTime <= currentTime) {
    scheduledTimeout(currentTime);
    timeoutTime = -1;
    scheduledTimeout = null;
  }
}
function requestPaint() {
  needsPaint = true;
}

function push(heap, node) {
  const index = heap.length;
  heap.push(node);
  siftUp(heap, node, index);
}
function peek(heap) {
  const first = heap[0];
  return first === undefined ? null : first;
}
function pop(heap) {
  const first = heap[0];

  if (first !== undefined) {
    const last = heap.pop();

    if (last !== first) {
      heap[0] = last;
      siftDown(heap, last, 0);
    }

    return first;
  } else {
    return null;
  }
}

function siftUp(heap, node, i) {
  let index = i;

  while (true) {
    const parentIndex = index - 1 >>> 1;
    const parent = heap[parentIndex];

    if (parent !== undefined && compare(parent, node) > 0) {
      // The parent is larger. Swap positions.
      heap[parentIndex] = node;
      heap[index] = parent;
      index = parentIndex;
    } else {
      // The parent is smaller. Exit.
      return;
    }
  }
}

function siftDown(heap, node, i) {
  let index = i;
  const length = heap.length;

  while (index < length) {
    const leftIndex = (index + 1) * 2 - 1;
    const left = heap[leftIndex];
    const rightIndex = leftIndex + 1;
    const right = heap[rightIndex]; // If the left or right node is smaller, swap with the smaller of those.

    if (left !== undefined && compare(left, node) < 0) {
      if (right !== undefined && compare(right, left) < 0) {
        heap[index] = right;
        heap[rightIndex] = node;
        index = rightIndex;
      } else {
        heap[index] = left;
        heap[leftIndex] = node;
        index = leftIndex;
      }
    } else if (right !== undefined && compare(right, node) < 0) {
      heap[index] = right;
      heap[rightIndex] = node;
      index = rightIndex;
    } else {
      // Neither child is smaller. Exit.
      return;
    }
  }
}

function compare(a, b) {
  // Compare sort index first, then task id.
  const diff = a.sortIndex - b.sortIndex;
  return diff !== 0 ? diff : a.id - b.id;
}

// TODO: Use symbols?
const ImmediatePriority = 1;
const UserBlockingPriority = 2;
const NormalPriority = 3;
const LowPriority = 4;
const IdlePriority = 5;

function markTaskErrored(task, ms) {
}

/* eslint-disable no-var */
// Math.pow(2, 30) - 1
// 0b111111111111111111111111111111

var maxSigned31BitInt = 1073741823; // Times out immediately

var IMMEDIATE_PRIORITY_TIMEOUT = -1; // Eventually times out

var USER_BLOCKING_PRIORITY_TIMEOUT = 250;
var NORMAL_PRIORITY_TIMEOUT = 5000;
var LOW_PRIORITY_TIMEOUT = 10000; // Never times out

var IDLE_PRIORITY_TIMEOUT = maxSigned31BitInt; // Tasks are stored on a min heap

var taskQueue = [];
var timerQueue = []; // Incrementing id counter. Used to maintain insertion order.

var taskIdCounter = 1; // Pausing the scheduler is useful for debugging.
var currentTask = null;
var currentPriorityLevel = NormalPriority; // This is set while performing work, to prevent re-entrancy.

var isPerformingWork = false;
var isHostCallbackScheduled = false;
var isHostTimeoutScheduled = false;

function advanceTimers(currentTime) {
  // Check for tasks that are no longer delayed and add them to the queue.
  let timer = peek(timerQueue);

  while (timer !== null) {
    if (timer.callback === null) {
      // Timer was cancelled.
      pop(timerQueue);
    } else if (timer.startTime <= currentTime) {
      // Timer fired. Transfer to the task queue.
      pop(timerQueue);
      timer.sortIndex = timer.expirationTime;
      push(taskQueue, timer);
    } else {
      // Remaining timers are pending.
      return;
    }

    timer = peek(timerQueue);
  }
}

function handleTimeout(currentTime) {
  isHostTimeoutScheduled = false;
  advanceTimers(currentTime);

  if (!isHostCallbackScheduled) {
    if (peek(taskQueue) !== null) {
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    } else {
      const firstTimer = peek(timerQueue);

      if (firstTimer !== null) {
        requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
      }
    }
  }
}

function flushWork(hasTimeRemaining, initialTime) {


  isHostCallbackScheduled = false;

  if (isHostTimeoutScheduled) {
    // We scheduled a timeout but it's no longer needed. Cancel it.
    isHostTimeoutScheduled = false;
    cancelHostTimeout();
  }

  isPerformingWork = true;
  const previousPriorityLevel = currentPriorityLevel;

  try {
    if (enableProfiling) {
      try {
        return workLoop(hasTimeRemaining, initialTime);
      } catch (error) {
        if (currentTask !== null) {
          const currentTime = getCurrentTime();
          markTaskErrored(currentTask, currentTime);
          currentTask.isQueued = false;
        }

        throw error;
      }
    } else {
      // No catch in prod code path.
      return workLoop(hasTimeRemaining, initialTime);
    }
  } finally {
    currentTask = null;
    currentPriorityLevel = previousPriorityLevel;
    isPerformingWork = false;
  }
}

function workLoop(hasTimeRemaining, initialTime) {
  let currentTime = initialTime;
  advanceTimers(currentTime);
  currentTask = peek(taskQueue);

  while (currentTask !== null && !(enableSchedulerDebugging )) {
    if (currentTask.expirationTime > currentTime && (!hasTimeRemaining || shouldYieldToHost())) {
      // This currentTask hasn't expired, and we've reached the deadline.
      break;
    }

    const callback = currentTask.callback;

    if (typeof callback === 'function') {
      currentTask.callback = null;
      currentPriorityLevel = currentTask.priorityLevel;
      const didUserCallbackTimeout = currentTask.expirationTime <= currentTime;

      const continuationCallback = callback(didUserCallbackTimeout);
      currentTime = getCurrentTime();

      if (typeof continuationCallback === 'function') {
        currentTask.callback = continuationCallback;
      } else {

        if (currentTask === peek(taskQueue)) {
          pop(taskQueue);
        }
      }

      advanceTimers(currentTime);
    } else {
      pop(taskQueue);
    }

    currentTask = peek(taskQueue);
  } // Return whether there's additional work


  if (currentTask !== null) {
    return true;
  } else {
    const firstTimer = peek(timerQueue);

    if (firstTimer !== null) {
      requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
    }

    return false;
  }
}

function unstable_runWithPriority(priorityLevel, eventHandler) {
  switch (priorityLevel) {
    case ImmediatePriority:
    case UserBlockingPriority:
    case NormalPriority:
    case LowPriority:
    case IdlePriority:
      break;

    default:
      priorityLevel = NormalPriority;
  }

  var previousPriorityLevel = currentPriorityLevel;
  currentPriorityLevel = priorityLevel;

  try {
    return eventHandler();
  } finally {
    currentPriorityLevel = previousPriorityLevel;
  }
}

function unstable_next(eventHandler) {
  var priorityLevel;

  switch (currentPriorityLevel) {
    case ImmediatePriority:
    case UserBlockingPriority:
    case NormalPriority:
      // Shift down to normal priority
      priorityLevel = NormalPriority;
      break;

    default:
      // Anything lower than normal priority should remain at the current level.
      priorityLevel = currentPriorityLevel;
      break;
  }

  var previousPriorityLevel = currentPriorityLevel;
  currentPriorityLevel = priorityLevel;

  try {
    return eventHandler();
  } finally {
    currentPriorityLevel = previousPriorityLevel;
  }
}

function unstable_wrapCallback(callback) {
  var parentPriorityLevel = currentPriorityLevel;
  return function () {
    // This is a fork of runWithPriority, inlined for performance.
    var previousPriorityLevel = currentPriorityLevel;
    currentPriorityLevel = parentPriorityLevel;

    try {
      return callback.apply(this, arguments);
    } finally {
      currentPriorityLevel = previousPriorityLevel;
    }
  };
}

function unstable_scheduleCallback(priorityLevel, callback, options) {
  var currentTime = getCurrentTime();
  var startTime;

  if (typeof options === 'object' && options !== null) {
    var delay = options.delay;

    if (typeof delay === 'number' && delay > 0) {
      startTime = currentTime + delay;
    } else {
      startTime = currentTime;
    }
  } else {
    startTime = currentTime;
  }

  var timeout;

  switch (priorityLevel) {
    case ImmediatePriority:
      timeout = IMMEDIATE_PRIORITY_TIMEOUT;
      break;

    case UserBlockingPriority:
      timeout = USER_BLOCKING_PRIORITY_TIMEOUT;
      break;

    case IdlePriority:
      timeout = IDLE_PRIORITY_TIMEOUT;
      break;

    case LowPriority:
      timeout = LOW_PRIORITY_TIMEOUT;
      break;

    case NormalPriority:
    default:
      timeout = NORMAL_PRIORITY_TIMEOUT;
      break;
  }

  var expirationTime = startTime + timeout;
  var newTask = {
    id: taskIdCounter++,
    callback,
    priorityLevel,
    startTime,
    expirationTime,
    sortIndex: -1
  };

  if (startTime > currentTime) {
    // This is a delayed task.
    newTask.sortIndex = startTime;
    push(timerQueue, newTask);

    if (peek(taskQueue) === null && newTask === peek(timerQueue)) {
      // All tasks are delayed, and this is the task with the earliest delay.
      if (isHostTimeoutScheduled) {
        // Cancel an existing timeout.
        cancelHostTimeout();
      } else {
        isHostTimeoutScheduled = true;
      } // Schedule a timeout.


      requestHostTimeout(handleTimeout, startTime - currentTime);
    }
  } else {
    newTask.sortIndex = expirationTime;
    push(taskQueue, newTask);
    // wait until the next time we yield.


    if (!isHostCallbackScheduled && !isPerformingWork) {
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    }
  }

  return newTask;
}

function unstable_pauseExecution() {
}

function unstable_continueExecution() {

  if (!isHostCallbackScheduled && !isPerformingWork) {
    isHostCallbackScheduled = true;
    requestHostCallback(flushWork);
  }
}

function unstable_getFirstCallbackNode() {
  return peek(taskQueue);
}

function unstable_cancelCallback(task) {
  // remove from the queue because you can't remove arbitrary nodes from an
  // array based heap, only the first one.)


  task.callback = null;
}

function unstable_getCurrentPriorityLevel() {
  return currentPriorityLevel;
}

const unstable_requestPaint = requestPaint;
const unstable_Profiling =  null;

exports.unstable_IdlePriority = IdlePriority;
exports.unstable_ImmediatePriority = ImmediatePriority;
exports.unstable_LowPriority = LowPriority;
exports.unstable_NormalPriority = NormalPriority;
exports.unstable_Profiling = unstable_Profiling;
exports.unstable_UserBlockingPriority = UserBlockingPriority;
exports.unstable_advanceTime = unstable_advanceTime;
exports.unstable_cancelCallback = unstable_cancelCallback;
exports.unstable_clearYields = unstable_clearYields;
exports.unstable_continueExecution = unstable_continueExecution;
exports.unstable_flushAll = unstable_flushAll;
exports.unstable_flushAllWithoutAsserting = unstable_flushAllWithoutAsserting;
exports.unstable_flushExpired = unstable_flushExpired;
exports.unstable_flushNumberOfYields = unstable_flushNumberOfYields;
exports.unstable_flushUntilNextPaint = unstable_flushUntilNextPaint;
exports.unstable_forceFrameRate = forceFrameRate;
exports.unstable_getCurrentPriorityLevel = unstable_getCurrentPriorityLevel;
exports.unstable_getFirstCallbackNode = unstable_getFirstCallbackNode;
exports.unstable_next = unstable_next;
exports.unstable_now = getCurrentTime;
exports.unstable_pauseExecution = unstable_pauseExecution;
exports.unstable_requestPaint = unstable_requestPaint;
exports.unstable_runWithPriority = unstable_runWithPriority;
exports.unstable_scheduleCallback = unstable_scheduleCallback;
exports.unstable_shouldYield = shouldYieldToHost;
exports.unstable_wrapCallback = unstable_wrapCallback;
exports.unstable_yieldValue = unstable_yieldValue;
//# sourceMappingURL=SchedulerMock-prod.js.map
