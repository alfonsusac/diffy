import type { ReactNode } from "react";

export function tab(label: ReactNode, content?: ReactNode) {
  return {label, content }
}
