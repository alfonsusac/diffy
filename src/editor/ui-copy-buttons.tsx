import { IconLucideCopy, IconLucideUpload } from "@/editor/ui-icons"
import { useRef, type ComponentProps } from "react"

export function CopyButton(props: {
  text: string,
  className?: string,
}) {
  const text = useRef<HTMLButtonElement>(null)
  return (
    <button className={props.className}
      onClick={() => {
        navigator.clipboard.writeText(props.text)
        if (!text.current) return
        text.current.textContent = "Copied!"
        setTimeout(() => {
          if (!text.current) return
          text.current.textContent = "Copy"
        }, 1000)
      }}
    >
      <IconLucideCopy />
      <span ref={text}>
        Copy
      </span>
    </button>
  )
}

