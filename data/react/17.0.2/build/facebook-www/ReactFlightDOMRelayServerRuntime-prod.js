'use strict';

// ATTENTION
let REACT_SERVER_BLOCK_TYPE = 0xeada;

if (typeof Symbol === 'function' && Symbol.for) {
  const symbolFor = Symbol.for;
  REACT_SERVER_BLOCK_TYPE = symbolFor('react.server.block');
}

function serverBlock(moduleReference, loadData) {
  const blockComponent = [REACT_SERVER_BLOCK_TYPE, moduleReference, loadData]; // $FlowFixMe: Upstream BlockComponent to Flow as a valid Node.

  return blockComponent;
}
function serverBlockNoData(moduleReference) {
  const blockComponent = [REACT_SERVER_BLOCK_TYPE, moduleReference]; // $FlowFixMe: Upstream BlockComponent to Flow as a valid Node.

  return blockComponent;
}

exports.serverBlock = serverBlock;
exports.serverBlockNoData = serverBlockNoData;
//# sourceMappingURL=ReactFlightDOMRelayServerRuntime-prod.js.map
