// Theo doi tien do "da nghe" luu o localStorage — khong can backend/dang
// nhap. Key rieng theo tung chu de (section) de tinh % hoan thanh.
// Dung useSyncExternalStore de doc dung chuan (localStorage la external
// store), tranh goi setState dong bo trong useEffect.

import { useSyncExternalStore } from "react";

const KEY_PREFIX = "korean-learning:listened:";
const EVENT_NAME = "korean-learning:progress-changed";
const EMPTY_SET = new Set<number>();

function keyFor(section: string) {
  return `${KEY_PREFIX}${section}`;
}

function readFromStorage(section: string): Set<number> {
  try {
    const raw = window.localStorage.getItem(keyFor(section));
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

const cache = new Map<string, Set<number>>();

function getSnapshot(section: string): Set<number> {
  if (typeof window === "undefined") return EMPTY_SET;
  if (!cache.has(section)) {
    cache.set(section, readFromStorage(section));
  }
  return cache.get(section)!;
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT_NAME, callback);
  return () => window.removeEventListener(EVENT_NAME, callback);
}

export function markListened(section: string, globalOrder: number) {
  if (typeof window === "undefined") return;
  const current = readFromStorage(section);
  if (current.has(globalOrder)) return;
  current.add(globalOrder);
  window.localStorage.setItem(
    keyFor(section),
    JSON.stringify(Array.from(current)),
  );
  cache.set(section, current);
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function useListenedSet(section: string): Set<number> {
  return useSyncExternalStore(
    subscribe,
    () => getSnapshot(section),
    () => EMPTY_SET,
  );
}
