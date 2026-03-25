export const editors = [ "A", "B" ] as const
export type EditorAorB = typeof editors[ number ]

export type Updater<T> = T | ((prev: T) => T)
export function resolveUpdater<T>(updater: Updater<T>, prev: T) {
  if (typeof updater === "function") return (updater as ((prev: T) => T))(prev)
  return updater as T
}