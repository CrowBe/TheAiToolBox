const tails = new Map<string, Promise<void>>();

/**
 * Runs `task` after earlier tasks for the same key have settled.
 * The queue lives in this Node process. Another process has its own queue.
 */
export function withUserLock<T>(userId: string, task: () => Promise<T>): Promise<T> {
  const previous = tails.get(userId) ?? Promise.resolve();
  const run = previous.then(task, task);
  const settled = run.then(
    () => undefined,
    () => undefined,
  );
  tails.set(userId, settled);
  void settled.then(() => {
    if (tails.get(userId) === settled) tails.delete(userId);
  });
  return run;
}
