// const { parentPort, workerData } = require('worker_threads');

// console.log(`[WORKER] Started at ${new Date().toISOString()}`);

// let result = 0;

// for (let i = 0; i < workerData.iterations; i++) {
//   result += i;
// }

// console.log(`[WORKER] Completed at ${new Date().toISOString()}`);

// parentPort.postMessage(result);



const { parentPort, workerData } = require("worker_threads");

console.log(`[WORKER] Started at ${new Date().toISOString()}`);

/*
|--------------------------------------------------------------------------
| Heavy CPU Task (Fibonacci)
|--------------------------------------------------------------------------
*/

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

try {
  const result = fibonacci(workerData);

  console.log(`[WORKER] Completed at ${new Date().toISOString()}`);

  parentPort.postMessage({
    success: true,
    input: workerData,
    result,
  });

} catch (error) {
  parentPort.postMessage({
    success: false,
    error: error.message,
  });
}