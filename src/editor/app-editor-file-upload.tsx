import { useRef, useState, type ReactNode } from "react"
import { IconLucideUpload } from "./ui-icons"



function validateTextFile(file: File) {
  if (file.size > 2 * 1024 * 1024) {
    alert("File is too large! Maximum 2MB")
    return
  }
  // const textMime =
  //   file.type.startsWith("text/") ||
  //   [
  //     "application/json",
  //     "application/xml",
  //     "application/javascript"
  //   ].includes(file.type)
  // const textExt = /\.(txt|md|json|js|ts|jsx|tsx|css|html|xml|yml|yaml|csv|env|toml)$/i.test(file.name)
  // const isText = textMime || textExt
  // if (!isText) {
  //   alert("Please drop a text file.")
  //   console.log("Not a text file.", file.type, file.name)
  //   return
  // }
}



export function UploadButton(props: {
  className?: string,
  id: string,
  onFileUpload: (text: string, file: File) => any,
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return <>
    <button className="button" onClick={() => inputRef.current?.click()}>
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
        validateTextFile(file)
        const text = await file.text()
        props.onFileUpload(text, file)
      }}
      hidden
    />
  </>
}




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
        validateTextFile(file)
        const text = await file.text()
        props.onTextFileDropped(text, file)
      }}
    >
      {hovering && props.dropOverlay}
      {props.children}
    </div>
  )
}


// const textMime =
//   file.type.startsWith("text/") ||
//   [
//     "application/json",
//     "application/xml",
//     "application/javascript"
//   ].includes(file.type)
// const textExt = /\.(txt|md|json|js|ts|jsx|tsx|css|html|xml|yml|yaml|csv|env|toml)$/i.test(file.name)
// const isText = textMime || textExt
// if (!isText) {
//   alert("Please drop a text file.")
//   console.log("Not a text file.", file.type, file.name)
//   return
// }