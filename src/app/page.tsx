import { cn } from "lazy-cn"
import { DiffViewer, Editor, EditorContext } from "./page.client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "diffy - easily compare two text files",
  description: "Easily compare two text files and see the differences side by side powered by @pierre/diffs",

}


export default function Home() {
  return (
    <div className="min-w-screen min-h-screen">
      <EditorContext>
        <div className="min-h-screen flex flex-col gap-16 pb-20">
          <header className="max-w-3xl w-full mx-auto pt-8 sm:pt-20 flex flex-col gap-2 sm:gap-3 p-8">
            <h1 className={cn("font-mono text-4xl sm:text-5xl",
              "font-semibold tracking-tighter",
              "bg-gradient-to-t bg-clip-text text-transparent",
              "from-zinc-500 to-zinc-50"
            )}>
              diffy
            </h1>
            <div className="sm:text-xl text-foreground-muted text-pretty max-w-120">
              Easily compare two text files and see the differences side by side powered by <span className="font-mono text-foreground">@pierre/diffs</span>
            </div>
          </header>

          <section className="h-140 sm:h-80 bg-red-500- px-4 sm:px-6">
            <div className="max-w-5xl bg-blue-500- h-full mx-auto flex flex-col sm:flex-row gap-x-8 gap-y-10">
              {[ "a" as const, "b" as const ].map((which) => {
                return (<Editor key={which} which={which} />)
              })}
            </div>
          </section>

          <section className="bg-red-500- px-4 sm:px-6">
            <div className="max-w-5xl bg-blue-500- h-full mx-auto flex flex-col sm:flex-row gap-x-8 gap-y-4 ">
              <DiffViewer />
            </div>
          </section>

        </div>

        <footer className="border-t border-t-foreground/5 pb-20">
          <div className="max-w-3xl mx-auto p-8 flex flex-col gap-4">

            <div className="text-foreground-muted">
              Made by alfon ∙ {[
                { label: 'github', href: 'https://github.com/alfonsusac/diffy' },
              ].map(({ label, href }) => {
                return <a key={label} href={href}
                  className="text-foreground-muted hover:text-foreground transition-colors"
                >
                  {label}
                </a>
              })}
            </div>

          </div>
        </footer>
      </EditorContext>
    </div>
  )
}
