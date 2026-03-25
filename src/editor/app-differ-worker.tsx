"use client"

import { WorkerPoolContextProvider } from "@pierre/diffs/react"
import { useEffect, type ReactNode } from "react"
import { useEditor } from "./app-core"
import { preloadHighlighter } from "@pierre/diffs"
import { languages } from "@/app/feature-settings"
import { darkthemes, themes } from "./app-differ-themes"
import { useAsync } from "@/app/util-async"

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


