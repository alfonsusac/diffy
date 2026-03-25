"use client"

import { createContext, use, useEffect, useState } from "react"
import { getErrorMessage } from "@/app/util-async"
import { useWorkerPool } from "@pierre/diffs/react"
import type { PossibleLanguages } from "@/app/feature-settings"
import type { CodeThemes } from "./app-differ-themes"
import { resolveUpdater, type EditorAorB, type Updater } from "./app-constants"

export type DifferSettings = {
  layout: "split" | "inline",
  theme: CodeThemes,
}

export type AppEditorData = {
  [ editorName in EditorAorB ]: {
    content: string,
    filename: string | undefined,
    langOverride: PossibleLanguages
  }
}

type EditorContext = {
  data: AppEditorData
  setData: (data: Updater<AppEditorData>) => void,
  setContent: (which: EditorAorB, content: AppEditorData[ EditorAorB ][ 'content' ]) => void,
  setFilename: (which: EditorAorB, filename: AppEditorData[ EditorAorB ][ 'filename' ]) => void
  setLangOverride: (which: EditorAorB, filename: AppEditorData[ EditorAorB ][ 'langOverride' ]) => void
  setFile: (which: EditorAorB, content: string, file: File) => void
  settings: DifferSettings,
  setSettings: (data: Updater<DifferSettings>) => void,
  setLayout: (layout: DifferSettings[ 'layout' ]) => void,
  setTheme: (theme: DifferSettings[ 'theme' ]) => void,
  clearAll: () => void,
}

const editorContext = createContext<EditorContext | null>(null)

const initialData = {
  A: { content: '', filename: undefined, langOverride: null },
  B: { content: '', filename: undefined, langOverride: null },
}

export function useEditor() {
  const editor = use(editorContext)
  if (!editor) throw new Error("Editor must be used within an EditorContext")
  return editor
}

export function EditorContext(props: {
  children: React.ReactNode,
}) {
  const workerPool = useWorkerPool()

  const [ data, _setData ] = useState<AppEditorData>(initialData)
  const [ settings, _setSettings ] = useState<DifferSettings>({
    layout: "split",
    theme: "vesper"
  })

  useEffect(() => {
    try {
      const editorData = localStorage.getItem('editor-data')
      if (editorData) _setData(JSON.parse(editorData))
    } catch (error) {
      console.warn("Failed reading editor-data", getErrorMessage(error))
    }
    try {
      const editorSettings = localStorage.getItem('editor-settings')
      if (editorSettings) {
        const parsed = JSON.parse(editorSettings)
        _setSettings(parsed)
        workerPool?.setRenderOptions({ theme: parsed.theme })
      }
    } catch (error) {
      console.warn("Failed reading editor-settings", getErrorMessage(error))
    }
  }, [])

  return (
    <editorContext.Provider value={{
      data,
      settings,
      setData(data) {
        _setData(prev => {
          const newData = resolveUpdater(data, prev)
          localStorage.setItem('editor-data', JSON.stringify(newData))
          return newData
        })
      },
      setContent(which, content) {
        this.setData(data => ({ ...data, [ which ]: { ...data[ which ], content } }))
      },
      setFilename(which, filename) {
        this.setData(data => ({ ...data, [ which ]: { ...data[ which ], filename } }))
      },
      setLangOverride(which, langOverride) {
        this.setData(data => ({ ...data, [ which ]: { ...data[ which ], langOverride } }))
      },
      setSettings(data) {
        _setSettings(prev => {
          const newData = resolveUpdater(data, prev)
          localStorage.setItem('editor-settings', JSON.stringify(newData))
          return newData
        })
      },
      setLayout(layout) {
        this.setSettings(prev => ({ ...prev, layout }))
      },
      setTheme(theme) {
        this.setSettings(prev => ({ ...prev, theme }))
        console.log("worker pool?", !!workerPool)
        workerPool?.setRenderOptions({ theme })
      },
      clearAll() {
        this.setData(initialData)
      },
      setFile(which, content, file) {
        this.setContent(which, content)
        this.setFilename(which, file.name)
        this.setLangOverride(which, null)
      }
    }}>
      {props.children}
    </editorContext.Provider>
  )

}
