import { SelectContent, SelectTrigger, SelectValue, SelectGroup, SelectLabel, SelectItem, Select } from "@/app/ui-select"
import { useEditor } from "./app-core"
import { useWorkerPool } from "@pierre/diffs/react"

export function CodeThemeSelect() {
  const editor = useEditor()

  return (
    <Select
      value={
        editor.settings.theme
      } onValueChange={
        (value) => editor.setTheme(value as CodeThemes)
      }>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Select a theme..." className="capitalize" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Dark Themes</SelectLabel>
          {darkthemes
            .toSorted((a, b) => a.localeCompare(b))
            .map((value) => {
              return <SelectItem
                className="capitalize"
                key={value}
                value={value}
              >
                {value.replaceAll('-', ' ')}
              </SelectItem>
            })}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Light Themes</SelectLabel>
          {lightthemes
            .toSorted((a, b) => a.localeCompare(b))
            .map((value) => {
              return <SelectItem
                className="capitalize"
                key={value}
                value={value}
              >
                {value.replaceAll('-', ' ')}
              </SelectItem>
            })}
        </SelectGroup>

      </SelectContent>
    </Select>
  )
}


export const darkthemes = [
  "pierre-dark",
  "andromeeda",
  "aurora-x",
  "ayu-dark",
  "catppuccin-frappe",
  "catppuccin-macchiato",
  "catppuccin-mocha",
  "dark-plus",
  "dracula",
  "dracula-soft",
  "everforest-dark",
  "github-dark",
  "github-dark-default",
  "github-dark-dimmed",
  "github-dark-high-contrast",
  "gruvbox-dark-hard",
  "gruvbox-dark-medium",
  "gruvbox-dark-soft",
  "houston",
  "kanagawa-dragon",
  "kanagawa-wave",
  "laserwave",
  "material-theme",
  "material-theme-darker",
  "material-theme-ocean",
  "material-theme-palenight",
  "min-dark",
  "monokai",
  "night-owl",
  "nord",
  "one-dark-pro",
  "plastic",
  "poimandres",
  "red",
  "rose-pine",
  "rose-pine-moon",
  "slack-dark",
  "solarized-dark",
  "synthwave-84",
  "tokyo-night",
  "vesper",
  "vitesse-black",
  "vitesse-dark"
] as const

export const lightthemes = [
  "pierre-light",
  "catppuccin-latte",
  "everforest-light",
  "github-light",
  "github-light-default",
  "github-light-high-contrast",
  "gruvbox-light-hard",
  "gruvbox-light-medium",
  "gruvbox-light-soft",
  "kanagawa-lotus",
  "light-plus",
  "material-theme-lighter",
  "min-light",
  "one-light",
  "rose-pine-dawn",
  "slack-ochin",
  "snazzy-light",
  "solarized-light",
  "vitesse-light"
] as const

export const themes = [ ...darkthemes, ...lightthemes ] as string[]

export type CodeThemes = typeof darkthemes[ number ] | typeof lightthemes[ number ]
