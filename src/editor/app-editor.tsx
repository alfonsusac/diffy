"use client"

import { CopyButton } from "./ui-copy-buttons"
import { cn } from "lazy-cn"
import { IconLucideCopy, LucideDownload, MdiArrowDownRight } from "@/editor/ui-icons"
import { useEditor } from "./app-core"
import { SelectLanguage } from "./app-editor-lang-select"
import { exampleA, exampleB } from "./app-examples"
import type { EditorAorB } from "./app-constants"
import { getLangFromFilename } from "./app-editor-lang"
import { DropzoneDiv, UploadButton } from "./app-editor-file-upload"

export function Editor(props: {
  which: EditorAorB,
}) {
  const editor = useEditor()
  const { which } = props

  return (
    <div className="bg-background h-full w-full flex flex-col gap-2">
      <div className="flex items-center px-3">
        <h3 className="h3">Edit {editor.data[ which ].filename}
          <MdiArrowDownRight className="inline ml-1.5 translate-y-0.5" />
        </h3>
        <CopyButton className="button" text={editor.data[ which ].content} />
        <UploadButton className="button" id={which} onFileUpload={(text, file) => {
          editor.setContent(which, text)
          const lang = getLangFromFilename(file.name)
          editor.setLangOverride(which, lang)
          editor.setFilename(which, file.name)
        }} />
      </div>
      <DropzoneDiv
        className={cn(
          "relative h-full rounded-md border border-foreground/10 overflow-hidden",
          "focus-within:outline-active-outline",
          "focus-within:outline-1",
        )}
        onTextFileDropped={(text, file) => {
          editor.setFile(which, text, file)
        }}
        dropOverlay={<>
          <div className={cn(
            "absolute inset-0 bg-background-input backdrop-blur-sm starting:opacity-0 transition-opacity",
            "flex items-center justify-center flex-col gap-2",
          )}>
            <LucideDownload className="text-foreground-muted/75" />
            <div className="text-sm text-foreground-muted">
              Drop a file here to load content
            </div>
          </div>
        </>}
      >
        <textarea
          value={editor.data[ props.which ].content}
          onChange={(e) => editor.setContent(props.which, e.target.value)}
          className={cn(
            "bg-background-input/50",
            "focus-visible:outline-active-outline",
            "focus-visible:outline-1",
            "rounded p-3 w-full resize-none font-mono text-sm",
            "h-full",
          )}
          placeholder={`Paste content here...`}
        />
      </DropzoneDiv>
      <div className="flex gap-2">
        <SelectLanguage which={props.which} />
      </div>
    </div>
  )
}



export function LoadExampleButton() {
  const editor = useEditor()
  return (
    <button className={cn("button-primary")}
      onClick={() => {
        editor.setContent("A", exampleA.content)
        editor.setContent("B", exampleB.content)
        editor.setFilename("A", exampleA.filename)
        editor.setFilename("B", exampleB.filename)
      }}
    >
      <IconLucideCopy />
      <span>
        Load Example
      </span>
    </button >
  )
}


export function ClearAllButton() {
  const editor = useEditor()
  return (
    <button className={cn("button-primary")}
      onClick={() => editor.clearAll()}
    >
      <IconLucideCopy />
      <span>
        Clear All
      </span>
    </button >
  )
}