import { useState, type ReactNode } from "react"

export function DropzoneDiv(props: {
  className?: string,
  onTextFileDropped: (text: string, file: File) => void,
  dropOverlay?: ReactNode,
  children?: ReactNode
}) {
  const [ hovering, setHovering ] = useState(false)

  return (
    <div
      className={props.className}
      onDragOver={(e) => {
        e.preventDefault()
        setHovering(true)
      }}
      onDragLeave={(e) => {
        e.preventDefault()
        setHovering(false)
      }}
      onDragEnd={(e) => {
        e.preventDefault()
        setHovering(false)
      }}
      onDrop={async (e) => {
        e.preventDefault()
        setHovering(false)
        const file = e.dataTransfer.files?.[ 0 ]
        if (!file) return
        const textMime =
          file.type.startsWith("text/") ||
          [
            "application/json",
            "application/xml",
            "application/javascript"
          ].includes(file.type)
        const textExt = /\.(txt|md|json|js|ts|jsx|tsx|css|html|xml|yml|yaml|csv|env|toml)$/i.test(file.name)
        const isText = textMime || textExt
        if (!isText) {
          alert("Please drop a text file.")
          console.log("Not a text file.", file.type, file.name)
          return
        }
        const text = await file.text()
        props.onTextFileDropped(text, file)
      }}
    >
      {hovering && props.dropOverlay}
      {props.children}
    </div>
  )
}
