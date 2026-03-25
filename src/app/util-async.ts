import { useEffect, useState } from "react"

type MaybePromise<D> = D | Promise<D>

type UseAsyncReturn<D> = {
  status: "ok",
  result: D,
} | {
  status: "error",
  error: string,
} | {
  status: "loading"
} | {
  status: "idle"
}

export function useAsync<D>(
  fn: (signal: { aborted: boolean }) => MaybePromise<D>,
  deps: any[] = []
) {
  const [ state, setState ] = useState<UseAsyncReturn<D>>({ status: "idle" })

  useEffect(() => {
    let signal = { aborted: false }
    setState({ status: "loading" });
    //
    (async () => {
      try {
        const result = await fn(signal)
        if (!signal.aborted) setState({ status: "ok", result })
      } catch (error) {
        if (!signal.aborted) setState({ status: "error", error: getErrorMessage(error) })
      }
    })()
    return () => {
      signal.aborted = true
    }
  }, deps)

  const isLoading = state.status === "loading"
  const reset = () => setState({ status: "idle" })

  return [ state, isLoading, reset ] as [
    state: UseAsyncReturn<D>,
    isLoading: boolean,
    reset: () => void
  ]
}

export function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message
  if (typeof e === "string") return e
  if (typeof e === "object" && e !== null)
    if ("message" in e && typeof e.message === "string") return e.message
    else return JSON.stringify(e)
  return String(e) // fallback for numbers, null, undefined, booleans
}

export function getErrorCode(e: unknown): string | undefined {
  if (typeof e === "object" && e !== null)
    if ("code" in e && typeof e.code === "string") return e.code
  return undefined
}