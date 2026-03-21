"use client"

import { cn } from "lazy-cn"
import { createContext, use, useEffect, useRef, useState, type ComponentProps } from "react"
import { IconLucideCopy, IconLucideUpload } from "./ui"
import { MultiFileDiff } from "@pierre/diffs/react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui-select"
import { languages, themes } from "./feature-settings"


type EditorSetting = {
  lang: typeof languages[ number ][ "value" ],
  layout: "split" | "inline",
  theme: typeof themes[ number ]
}

const editorContext = createContext<
  null | {
    valueA: string,
    valueB: string,
    setValue: (which: "a" | "b", value: string) => void,
    settings: EditorSetting,
    setSettings: (settings: EditorSetting) => void
  }
>(null)


export function EditorContext(props: {
  children: React.ReactNode
}) {
  const [ valueA, setValueA ] = useState(`use std::io;

fn main() {
    println!("What is your name?");
    let mut name = String::new();
    io::stdin().read_line(&mut name).unwrap();
    println!("Hello, {}", name.trim());
}

fn add(x: i32, y: i32) -> i32 {
    return x + y;
}`)
  const [ valueB, setValueB ] = useState(`use std::io;

fn main() {
    println!("Enter your name:");
    let mut name = String::new();
    io::stdin().read_line(&mut name).expect("read error");
    println!("Hello, {}!", name.trim());
}

fn add(a: i32, b: i32) -> i32 {
    a + b
}`)

  const setValue = (which: "a" | "b", value: string) => {
    if (which === "a") setValueA(value)
    else setValueB(value)
  }

  const [ settings, _setSettings ] = useState<EditorSetting>({
    lang: "tsx",
    layout: "split",
    theme: "vesper"
  })

  useEffect(() => {
    if (typeof window === "undefined") return
    const savedSettings = localStorage.getItem("editor-settings")
    if (savedSettings) {
      _setSettings(JSON.parse(savedSettings))
    }
  }, [])

  function setSettings(settings: EditorSetting) {
    _setSettings(settings)
    localStorage.setItem("editor-settings", JSON.stringify(settings))
  }

  return (
    <editorContext.Provider value={{
      valueA,
      valueB,
      setValue,
      settings,
      setSettings,
    }}>
      {props.children}
    </editorContext.Provider>
  )
}


const editors = {
  a: { label: "Original" },
  b: { label: "Changed" }
}

export function Editor(props: {
  which: "a" | "b"
}) {
  const editor = use(editorContext)
  if (!editor) throw new Error("Editor must be used within an EditorContext")

  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (!inputRef.current) return
    const input = inputRef.current
    const onChange = async () => {
      const file = input.files?.[ 0 ]
      if (!file) return
      const text = await file.text()
      editor.setValue(props.which, text)
    }
    input.addEventListener("change", onChange)
    return () => input.removeEventListener("change", onChange)
  }, [])

  return (
    <div
      className="bg-background h-full w-full flex flex-col gap-2"
    >

      <div className="flex items-center px-3">
        <H2>{editors[ props.which ].label}</H2>
        <button className={cn("button")}
          onClick={() => {
            const value = props.which === "a" ? editor.valueA : editor.valueB
            navigator.clipboard.writeText(value)
          }}
        >
          <IconLucideCopy />
          Copy
        </button>
        <button className={cn("button")}
          onClick={() => inputRef.current?.click()}
        >
          <IconLucideUpload />
          Open File
        </button>
        <input
          ref={inputRef}
          id={`file-input-${ props.which }.ts`}
          type="file"
          className="hidden"
          hidden
          accept=".txt,.md,.json,.js,.ts,.css,.html,.xml"
        />
      </div>
      <textarea
        value={props.which === "a" ? editor.valueA : editor.valueB}
        onChange={(e) => editor.setValue(props.which, e.target.value)}
        className={cn(
          "bg-background-input",
          "border border-foreground/5",
          "focus-visible:outline-active-outline",
          "focus-visible:outline-1",
          "rounded p-3 h-full w-full resize-none font-mono text-sm"
        )}
        placeholder={`Paste ${ editors[ props.which ].label.toLowerCase() } content here...`}
      />
    </div>
  )
}


export function DiffViewer() {
  const editor = use(editorContext)
  if (!editor) throw new Error("DiffViewer must be used within an EditorContext")

  return (
    <div className="w-full min-h-[80vh]">
      <header className="px-2 py-2">
        <H2>Diff Viewer</H2>
      </header>
      <MultiFileDiff
        className="border border-foreground/10 rounded-xl overflow-clip"
        oldFile={{
          name: `file.${ editor.settings.lang }`,
          contents: editor.valueA
        }}
        newFile={{
          name: `file.${ editor.settings.lang }`,
          contents: editor.valueB
        }}
        options={{
          theme: { dark: editor.settings.theme, light: 'pierre-light' },
          diffStyle: editor.settings.layout === "split" ? "split" : "unified",
        }}
      />

      {/* Settings */}
      <div className={cn(
        "w-full bg-background sticky bottom-0 mt-4 flex flex-wrap gap-8",
        "border-t border-foreground/10 p-4 px-0 pb-10",
        "z-5",
      )}>
        <SettingsItemGroup>
          <SettingsItemLabel>Language</SettingsItemLabel>
          <Select value={
            editor.settings.lang
          } onValueChange={
            (value) => editor.setSettings({
              ...editor.settings,
              lang: value as EditorSetting[ "lang" ]
            })
          }>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select a langauge..." />
            </SelectTrigger>
            <SelectContent>
              {languages.toSorted(
                (a, b) => a.label.localeCompare(b.label)
              ).map(({ label, value }) => {
                return <SelectItem
                  key={value}
                  value={value}
                >
                  {label}
                </SelectItem>
              })}
            </SelectContent>
          </Select>
        </SettingsItemGroup>
        <SettingsItemGroup>
          <SettingsItemLabel>Layout</SettingsItemLabel>
          <TabBlock
          >
            {[ "split", "inline" ].map((layout) => {
              return <TabItem
                key={layout}
                active={editor.settings.layout === layout}
                onClick={() => editor.setSettings({
                  ...editor.settings,
                  layout: layout as EditorSetting[ "layout" ]
                })}
              >
                {layout[ 0 ].toUpperCase() + layout.slice(1)}
              </TabItem>
            })}
          </TabBlock>
        </SettingsItemGroup>
        <SettingsItemGroup>
          <SettingsItemLabel>Theme</SettingsItemLabel>
          <Select value={
            editor.settings.theme
          } onValueChange={
            (value) => editor.setSettings({
              ...editor.settings,
              theme: value as EditorSetting[ "theme" ]
            })
          }>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select a theme..." />
            </SelectTrigger>
            <SelectContent>
              {themes.toSorted(
                (a, b) => a.localeCompare(b)
              ).map((value) => {
                return <SelectItem
                  key={value}
                  value={value}
                >
                  {value}
                </SelectItem>
              })}
            </SelectContent>
          </Select>
        </SettingsItemGroup>

      </div>
    </div>
  )
}

function SettingsItemGroup(props: ComponentProps<"div">) {
  return <div {...props} className={cn("flex flex-col gap-1")} />
}
function SettingsItemLabel(props: ComponentProps<"label">) {
  return <label {...props} className={cn("text-2xs text-foreground-muted")} />
}
{/* function Select(props: ComponentProps<"select">) {
  return <select {...props} className={cn(
    "bg-background-input text-sm text-foreground-muted hover:text-foreground",
    "border border-foreground/5",
    "focus-visible:outline-foreground-muted/50",
    "focus-visible:outline-1",
    "rounded p-2 h-full w-40 resize-none",
    props.className
  )} />
} */}
function TabBlock(props: ComponentProps<"div">) {
  return <div {...props} className={cn(
    "bg-background-input rounded-xl text-sm p-1",
    props.className
  )} />
}
function TabItem({ active, ...props }: ComponentProps<"button"> & {
  active: boolean
}) {
  return <button {...props} className={cn(
    "p-1 px-4 rounded-lg",
    active && "bg-background",
    props.className,
  )} />
}


function H2(props: ComponentProps<'h2'>) {
  return (
    <h2 {...props} className={cn(
      "font-medium text-sm grow text-foreground-muted",
      props.className
    )} />
  )
}