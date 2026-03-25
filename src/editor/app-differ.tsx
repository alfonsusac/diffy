"use client"

import { tab } from "@/editor/ui-tab-primitives"
import { TabList } from "@/editor/ui-tab-root"
import { MultiFileDiff } from "@pierre/diffs/react"
import { cn } from "lazy-cn"
import { useEditor } from "./app-core"
import { SettingsItemGroup, SettingsItemLabel } from "./app-editor-ui"
import { CodeThemeSelect } from "./app-differ-themes"
import { getExtFromLang, getLangFromFilename } from "./app-editor-lang"
import { MdiArrowDownRight } from "./ui-icons"


function getResolvedFilename(filename: string | undefined, langid: string | null) {
  if (langid) return `File.${ getExtFromLang(langid) }`
  const lang = getLangFromFilename(filename)
  if (lang === "unknown") return `file.md`
  // <MultiFileDiff> broke if language is not supported... hence it falls back to file.md
  return filename
}


export function DiffViewer() {
  const editor = useEditor()

  return (
    <div className="w-full">
      <header className="px-2 py-2">
        <h3 className="h3">Result Diff Viewer
          <MdiArrowDownRight className="inline ml-1.5 translate-y-0.5" />
        </h3>
      </header>
      <MultiFileDiff
        className="border border-foreground/10 rounded-xl overflow-clip"
        oldFile={{
          name: getResolvedFilename(editor.data.A.filename, editor.data.A.langOverride) || `fileA.md`,
          contents: editor.data.A.content,
        }}
        newFile={{
          name: getResolvedFilename(editor.data.B.filename, editor.data.B.langOverride) || `fileB.md`,
          contents: editor.data.B.content,
        }}
        options={{
          theme: editor.settings.theme,
          diffStyle: editor.settings.layout === "split" ? "split" : "unified",
          overflow: editor.settings.overflow
        }}
      />

      {/* Settings */}
      <div className={cn(
        "w-full bg-background sticky bottom-0 mt-4 flex flex-wrap gap-8",
        "border-t border-foreground/10 p-4 px-0 pb-10",
        "z-5",
        "transition-[opacity,translate] duration-500 delay-600",
        "starting:opacity-0 starting:translate-y-10"
      )}>
        <SettingsItemGroup>
          <SettingsItemLabel>Layout</SettingsItemLabel>
          <TabList
            className="tab-item:p-1 tab-item:px-3 tab-item:grow"
            tabs={[ tab(<div>Split</div>), tab(<div>Inline</div>), ]}
            onTabChange={(_, index) => {
              const layout = index === 0 ? "split" : "inline"
              editor.setLayout(layout)
            }}
            tabNum={editor.settings.layout === "split" ? 0 : 1}
          />
        </SettingsItemGroup>
        <SettingsItemGroup>
          <SettingsItemLabel>Theme</SettingsItemLabel>
          <CodeThemeSelect />
        </SettingsItemGroup>
        <SettingsItemGroup>
          <SettingsItemLabel>Overflow</SettingsItemLabel>
          <TabList
            className="tab-item:p-1 tab-item:px-3 tab-item:grow"
            tabs={[ tab(<div>Scroll</div>), tab(<div>Wrap</div>), ]}
            onTabChange={(_, index) => {
              const overflow = index === 0 ? "scroll" : "wrap"
              editor.setOverflow(overflow)
            }}
            tabNum={editor.settings.overflow === "scroll" ? 0 : 1}
          />
        </SettingsItemGroup>

      </div>
    </div>
  )
}




function DifferArgsDebug() {
  const editor = useEditor()
  return (
    <pre>
      {JSON.stringify({
        oldFile: {
          name: getResolvedFilename(editor.data.A.filename, editor.data.A.langOverride) || `fileA.md`,
          contents: editor.data.A.content,
        },
        newFile: {
          name: getResolvedFilename(editor.data.B.filename, editor.data.B.langOverride) || `fileB.md`,
          contents: editor.data.B.content,
        }
      }, null, 2)}
    </pre>
  )
}