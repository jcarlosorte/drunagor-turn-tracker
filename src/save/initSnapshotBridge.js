/**
 * Minimal bridge so InitTracker can register/restore turn-local state
 * without refactoring game logic.
 */

let getter = null;
let setter = null;
let pendingRestore = null;

export function registerInitSnapshotHandlers(handlers) {
  getter = handlers?.get ?? null;
  setter = handlers?.set ?? null;
  return () => {
    if (getter === handlers?.get) getter = null;
    if (setter === handlers?.set) setter = null;
  };
}

export function getInitSnapshot() {
  return getter ? getter() : null;
}

export function setInitSnapshot(data) {
  if (setter && data) setter(data);
}

/** Queue init-local restore until InitTracker mounts and registers handlers. */
export function queueInitRestore(data) {
  pendingRestore = data || null;
}

export function consumeInitRestore() {
  const data = pendingRestore;
  pendingRestore = null;
  return data;
}
