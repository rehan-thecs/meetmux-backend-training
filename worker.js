const { parentPort, workerData } = require('worker_threads');

console.log(`[WORKER] Started at ${new Date().toISOString()}`);

let result = 0;

for (let i = 0; i < workerData.iterations; i++) {
  result += i;
}

console.log(`[WORKER] Completed at ${new Date().toISOString()}`);

parentPort.postMessage(result);