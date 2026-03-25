import { EXTENSION_TO_FILE_FORMAT, getFiletypeFromFileName } from "@pierre/diffs"
import { grammars } from 'tm-grammars'

// console.log(grammars.map(g => {
//   return {
//     id: g.name,
//     label: g.displayName,
//   }
// }))
// Grammar.name = the id of the grammar
// Grammar.displayName = the label of the grammar

export const languages = Object
  .entries(EXTENSION_TO_FILE_FORMAT as Record<string, string>)
  .reduce(
    (acc, [ file_ext, grammar_id ]) => {
      const existing = acc.find(l => l.id === grammar_id)
      if (!existing) {
        const label = grammars.find(gr => gr.name === grammar_id || gr.aliases?.some(al => al === grammar_id))?.displayName
        if (!label) return acc
        // if (!label) throw new Error(`The language from EXTENSION_TO_FILE_FORMAT's value: ${value} is not found in Shiki's keyof bundledLanguagesInfo.`)
        acc.push({
          id: grammar_id,
          extensions: [ file_ext ],
          label: label,
        })
      } else {
        existing.extensions.push(file_ext)
      }
      return acc
    },
    [] as {
      label: string,
      id: string,
      extensions: string[],
    }[]
  )

export type PossibleLanguages = typeof languages[ number ][ "id" ] | null

export function getLangFromTwoFileNames(filenameA: string | undefined, filenameB: string | undefined) {
  const langIdA = getFiletypeFromFileName(filenameA ?? "")
  const langA = languages.find(l => l.id === langIdA)

  const langIdB = getFiletypeFromFileName(filenameB ?? "") // falls back to "text"
  const langB = languages.find(l => l.id === langIdB)

  if (langA !== langB) return {
    label: "Mixed",
    id: "mixed",
    extensions: []
  }
  return langA
}

export function getLangFromFilename(filename: string | undefined) {
  const langId = getFiletypeFromFileName(filename ?? "")
  const lang = languages.find(l => l.id === langId)?.id ?? "unknown"
  return lang
}

