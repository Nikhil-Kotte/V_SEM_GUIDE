import { useCallback, useEffect, useState } from 'react'

// localStorage can throw (private mode, blocked storage) — the guide must still work without it.
const KEY = 'mid2-guide-v1'

function readAll() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} }
}
function writeAll(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)) } catch { /* storage unavailable */ }
}

const listeners = new Set()
let state = readAll()

export function getFlag(ns, id) { return !!state[ns]?.[id] }

export function setFlag(ns, id, value) {
  state = { ...state, [ns]: { ...state[ns], [id]: value || undefined } }
  writeAll(state)
  listeners.forEach((fn) => fn(state))
}

export function getPref(key, fallback) { return state.prefs?.[key] ?? fallback }
export function setPref(key, value) {
  state = { ...state, prefs: { ...state.prefs, [key]: value } }
  writeAll(state)
  listeners.forEach((fn) => fn(state))
}

// Re-renders when any flag changes, so progress rings stay in sync across components.
export function useStore() {
  const [, force] = useState(0)
  useEffect(() => {
    const fn = () => force((n) => n + 1)
    listeners.add(fn)
    return () => listeners.delete(fn)
  }, [])
  return {
    done: (id) => getFlag('done', id),
    toggleDone: useCallback((id) => setFlag('done', id, !getFlag('done', id)), []),
    practised: (id) => getFlag('practised', id),
    togglePractised: useCallback((id) => setFlag('practised', id, !getFlag('practised', id)), []),
  }
}
