"use client"

import { tab } from "@/editor/ui-tab-primitives"
import { TabList } from "@/editor/ui-tab-root"
import { MultiFileDiff } from "@pierre/diffs/react"
import { cn } from "lazy-cn"
import { useEditor } from "./app-core"
import { SettingsItemGroup, SettingsItemLabel } from "./app-editor-ui"
import { CodeThemeSelect, darkthemes, lightthemes, type CodeThemes } from "./app-differ-themes"



export function DiffViewer() {
  const editor = useEditor()

  return (
    <div className="w-full">
      {JSON.stringify(editor.settings.theme)}
      <header className="px-2 py-2">
        <h2 className="h2">Result Diff Viewer</h2>
      </header>
      <MultiFileDiff
        className="border border-foreground/10 rounded-xl overflow-clip"
        oldFile={{
          name: editor.data.A.filename || `file.txt`,
          contents: editor.data.A.content,
        }}
        newFile={{
          name: editor.data.B.filename || `file.txt`,
          contents: editor.data.B.content,
        }}
        options={{
          theme: editor.settings.theme, 
          // theme: { dark: editor.settings.theme, light: 'pierre-light' },
          diffStyle: editor.settings.layout === "split" ? "split" : "unified",
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
            id="footer"
            className="p-1 tab-item:p-1 tab-item:px-3 tab-item:grow tab-item:text-center [&_svg]:w-4 [&_svg]:h-4"
            tabs={[
              tab(<div>Split</div>),
              tab(<div>Inline</div>),
            ]}
            onTabChange={(label, index) => {
              const layout = index === 0 ? "split" : "inline"
              editor.setSettings({
                ...editor.settings,
                layout
              })
            }}
            tabNum={editor.settings.layout === "split" ? 0 : 1}
          />
        </SettingsItemGroup>
        <SettingsItemGroup>
          <SettingsItemLabel>Theme</SettingsItemLabel>
          <CodeThemeSelect />
      
        </SettingsItemGroup>

      </div>
    </div>
  )
}


