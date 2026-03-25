import { cn } from "lazy-cn"
import type { ComponentProps } from "react"

export function SettingsItemGroup(props: ComponentProps<"div">) {
  return <div {...props} className={cn("flex flex-col gap-1")} />
}
export function SettingsItemLabel(props: ComponentProps<"label">) {
  return <label {...props} className={cn("text-2xs text-foreground-muted")} />
}