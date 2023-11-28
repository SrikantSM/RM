export type Task<T> = () => Promise<T>;

const isWin = process.platform === 'win32';

/**
 * On windows, the HANA driver has some bugs with concurrency. This class provides a util that, on windows, offers a sequential execution of tasks (defined as functions returning promises) that run parallel on all other systems.
 * It is used in the DatabaseClient to ensure that prepare, execute, ... can be called in parallel by test code without causing problems.
 */
export class AsyncQueue {
  private queueTail: Promise<any> = Promise.resolve();

  executeQueuedIfNecessary<T>(fn: Task<T>): Promise<T> {
    if (isWin) {
      const awaitUpToNow = this.queueTail;
      const executionResult = awaitUpToNow.then(fn); // execute fn after the queue
      this.queueTail = executionResult.catch(() => {}); // new queue: execution result + catch errors
      return executionResult; // return execution result, errors uncaught
    }
    return fn();
  }
}
