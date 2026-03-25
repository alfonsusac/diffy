import { cn } from "lazy-cn"
import type { Metadata } from "next"
import { ThemeSwitcher } from "../editor/app-themes"
import type { ComponentProps } from "react"
import { ClearAllButton, Editor, LoadExampleButton } from "@/editor/app-editor"
import { EditorContext } from "@/editor/app-core"
import { DiffViewer } from "@/editor/app-differ"
import { HighlightProvider } from "@/editor/app-differ-worker"



export const metadata: Metadata = {
  title: "diffy - easily compare two text files",
  description: "Easily compare two text files and see the differences side by side powered by @pierre/diffs",
  metadataBase: new URL("https://diffy.alfon.dev"),
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <HighlightProvider>
        <EditorContext>
          <div className="min-h-screen flex flex-col gap-16 pb-20">
            <header className="max-w-3xl w-full mx-auto pt-8 sm:pt-20 flex flex-col gap-2 sm:gap-3 p-8">
              <h1 className={cn("font-mono text-4xl sm:text-5xl",
                "font-semibold tracking-tighter",
                "bg-gradient-to-t bg-clip-text text-transparent",
                "from-[light-dark(var(--color-slate-500),var(--color-zinc-500))]",
                "to-[light-dark(var(--color-slate-800),var(--color-zinc-50))]",
                "transition-[opacity,translate] duration-500",
                "starting:opacity-0 starting:translate-y-4"
              )}>
                diffy
              </h1>
              <div className={cn("sm:text-xl text-foreground-muted text-pretty max-w-120",
                "transition-[opacity,translate] duration-500 delay-100",
                "starting:opacity-0 starting:translate-y-4",
              )}>
                Easily compare two text files and see the differences
                side by side powered
                by{' '}<a className="font-mono text-foreground underline underline-offset-8 decoration-foreground/5 hover:decoration-foreground-muted" href="https://diffs.com/" target="_blank">@pierre/diffs</a>
                <div className="mt-6 flex gap-2">
                  <LoadExampleButton />
                  <ClearAllButton />
                </div>
              </div>
            </header>

            <section className={cn(
              "h-140 sm:h-80 bg-red-500- px-4 sm:px-6",
              "transition-[opacity,translate] duration-500 delay-250",
              "starting:opacity-0 starting:translate-y-4"
            )}>
              <div className="max-w-5xl bg-blue-500- h-full mx-auto flex flex-col sm:flex-row gap-x-8 gap-y-10">
                {([ "A", "B" ] as const).map((which) => {
                  return (<Editor key={which} which={which} />)
                })}
              </div>
            </section>

            <section className={cn(
              "bg-red-500- px-4 sm:px-6",
              "transition-[opacity,translate] duration-500 delay-400",
              "starting:opacity-0 starting:translate-y-4"
            )}>
              <div className="max-w-5xl bg-blue-500- h-full mx-auto flex flex-col sm:flex-row gap-x-8 gap-y-4 ">
                <DiffViewer />
              </div>
            </section>

          </div>

          <footer className="border-t border-t-foreground/5 pb-20">
            <div className="max-w-3xl mx-auto p-8 flex gap-4">

              <div className="text-foreground-muted grow">
                Made by
                {' '}
                <FooterLink href="https://alfon.dev/" target="_blank">
                  alfon.dev
                </FooterLink>
                {' ∙ '}
                <FooterLink href="https://github.com/alfonsusac/diffy" target="_blank">
                  sauce code
                </FooterLink>
              </div>
              <div>
                <ThemeSwitcher />
              </div>
            </div>
          </footer>
        </EditorContext>
      </HighlightProvider>
    </div>
  )
}

function FooterLink(props: ComponentProps<"a">) {
  return <a {...props} className={cn("text-foreground-muted hover:text-foreground transition-colors underline underline-offset-4 decoration-transparent hover:decoration-foreground/50", props.className)} />
}
