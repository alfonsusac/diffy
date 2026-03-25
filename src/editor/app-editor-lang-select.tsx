import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/editor/ui-select"
import { SettingsItemGroup, SettingsItemLabel } from "./app-editor-ui"
import { useEditor } from "./app-core"
import { useMemo } from "react"
import type { EditorAorB } from "./app-constants"
import { getLangFromFilename, languages } from "./app-editor-lang"

export function SelectLanguage(props: {
  which: EditorAorB
}) {
  const editor = useEditor()
  const languageSelections = useMemo(() => {
    return [
      ...languages.toSorted((a, b) => a.label.localeCompare(b.label)),
      { label: "Unknown", id: "unknown", extensions: [] },
    ]
  }, [])
  return (
    <SettingsItemGroup>
      <SettingsItemLabel>Language</SettingsItemLabel>
      <div className="flex gap-2">
        <Select
          value={
            editor.data[ props.which ].langOverride ?? getLangFromFilename(editor.data[ props.which ].filename) ?? "unknown"
          }
          onValueChange={
            (value) => editor.setLangOverride(props.which, value === "unknown" ? null : value)
          }>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select a langauge..." />
          </SelectTrigger>
          <SelectContent>
            {languageSelections
              .map(({ label, id, extensions }) => {
                return <SelectItem key={id} value={id}>
                  {label}{' '}
                  {extensions.length !== 0 &&
                    <span className="font-mono text-xs text-foreground-muted">.{extensions[ 0 ]}</span>
                  }
                </SelectItem>
              })}
          </SelectContent>
        </Select>
        {editor.data[ props.which ].langOverride &&
          <button className="button"
            onClick={() => editor.setLangOverride(props.which, null)}
          >
            Reset
          </button>
        }
      </div>
    </SettingsItemGroup>
  )
}