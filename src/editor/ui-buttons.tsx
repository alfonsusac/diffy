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

export function UploadButton(props: {
  className?: string,
  id: string,
  onFileUpload: (text: string, file: File) => any,
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return <>
    <button className={props.className}
      onClick={() => inputRef.current?.click()}
    >
      <IconLucideUpload />
      Open File
    </button>
    <input
      ref={inputRef}
      id={`file-input-${ props.id }`}
      type="file"
      className="hidden"
      onChange={async (event) => {
        const file = event.target.files?.[ 0 ]
        if (!file) return
        if (file.size > 2 * 1024 * 1024) {
          alert("File is too large! Maximum 2MB")
          return
        }
        const text = await file.text()
        props.onFileUpload(text, file)
      }}
      hidden
    />
  </>
}