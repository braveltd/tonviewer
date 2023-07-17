import React from 'react';

const randomKey = () => (Math.random() + 1).toString(36).substring(7);

type StringUnionAutocompleteFix<T extends U, U = string> = T | (U & {});
type ShortcutKeys = StringUnionAutocompleteFix<
  | 'Control'
  | 'Meta'
  | 'Tab'
  | 'Shift'
  | 'Alt'
  | 'Escape'
  | 'Enter'
  | 'Backspace'
  | 'ArrowUp'
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
>;

interface ShortcutsProps {
  uuid: string;
  keys: ShortcutKeys[];
  callback?: (event: KeyboardEvent) => void | boolean | Promise<void>;
  disabled?: boolean;
}
const checkAlteringKeys = (ev: KeyboardEvent, key: ShortcutKeys) => {
  return (
    (key === 'Control' && ev.ctrlKey) ||
    (key === 'Meta' && ev.metaKey) ||
    (key === 'Shift' && ev.shiftKey) ||
    (key === 'Alt' && ev.altKey)
  );
};

const checkFires = (ev: KeyboardEvent, keys: ShortcutKeys[]) => {
  let fires = false;
  for (const k of keys) {
    if (k === ev.key || (k.length === 1 && 'Key' + k.toUpperCase() === ev.code) || checkAlteringKeys(ev, k)) {
      fires = true;
    } else {
      return false;
    }
  }
  return fires;
};

// store callbacks in stack to prevent cross-listeners fire
let listeners: ShortcutsProps[] = [];

let inited = false;
const init = () => {
  if (inited || typeof window === 'undefined') {
    return;
  }
  inited = true;

  window.addEventListener('keydown', async (ev) => {
    let listener: ShortcutsProps;
    for (let i = listeners.length - 1; i >= 0; i--) {
      listener = listeners[i];
      if (checkFires(ev, listener.keys)) {
        const handled = listener.callback && (await listener.callback(ev));
        if (handled === undefined || handled === true) {
          ev.preventDefault();
          return;
        }
      }
    }
  });
};

const listen = (listener: ShortcutsProps) => {
  let current = listeners.find((l) => l.uuid === listener.uuid);
  if (!current) {
    listeners.push(listener);
    current = listener;
  }
  current.disabled = false;
  // update callback function on new useEffect call
  current.callback = listener.callback;
  return () => {
    (async () => {
      const toRemove = listeners.find((l) => l.uuid === listener.uuid);
      if (toRemove) {
        // mark listener on useEffect clean up
        toRemove.disabled = true;
        // await next tick
        await null;
        //  if useEffect was not called, parent component seems to be removed - remove listener
        if (toRemove.disabled) {
          listeners = listeners.filter((l) => !l.disabled);
        }
      }
    })();
  };
};

interface ShortcutProps {
  keys: ShortcutKeys[];
  callback?: (event: KeyboardEvent) => void | boolean | Promise<void>;
}
export const useShortcuts = (shortcuts: ShortcutProps[] | ShortcutProps, deps?: any[]) => {
  const shorts = Array.isArray(shortcuts) ? shortcuts : [shortcuts];
  const uuid = React.useMemo(randomKey, deps);
  init();
  React.useEffect(() => {
    const dispose = shorts
      .map((s, i) => ({ ...s, uuid: uuid + '_' + i }))
      .map(listen)
      .filter((d) => !!d);
    return () => {
      dispose.map((d) => d!());
    };
  }, deps);
};
