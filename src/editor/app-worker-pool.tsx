"use client"

import { useWorkerPool } from "@pierre/diffs/react"
import type { WorkerStats } from "@pierre/diffs/worker"
import { useEffect, useState, useSyncExternalStore } from "react"

export function WorkerPoolTest() {
  const worker = useWorkerPool()

  const [ workerStats, setWorkerStats ] = useState<WorkerStats | undefined>()
  
  useEffect(() => {
    const interval = setInterval(() => {
      const stats = worker?.getStats()
      setWorkerStats(stats)
    }, 100) 
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <pre className="text-sm font-mono">
      {JSON.stringify(workerStats, null,2)}
    </pre>
  )

}