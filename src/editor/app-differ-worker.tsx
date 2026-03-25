"use client"

import { WorkerPoolContextProvider } from "@pierre/diffs/react"
import { type ReactNode } from "react"

export function workerFactory(): Worker {
  return new Worker(
    new URL(
      '@pierre/diffs/worker/worker.js',
      import.meta.url
    )
  )
}

export function HighlightProvider({ children }: { children: ReactNode }) {
  return (
    <WorkerPoolContextProvider
      poolOptions={{ workerFactory }}
      highlighterOptions={{}}
    >
      {children}
    </WorkerPoolContextProvider>
  )
}


