import { cn } from "lazy-cn";
import { useLayoutEffect, useRef, type ComponentProps, type MouseEvent, type ReactNode } from "react";

function px(int: number) {
  return `${ int }px`
}

export function TabList({ tabs, tabNum, className, onTabChange, ...props }: ComponentProps<"div"> & {
  tabs: {
    key?: string
    label: ReactNode
  }[],
  tabNum?: number,
  onTabChange?: (
    label: {
      key?: string;
      label: ReactNode;
    },
    index: number,
    e: MouseEvent<HTMLDivElement>
  ) => void,
}) {

  const {
    indicatorRef,
    saveIndicatorRect,
  } = useMovingIndicator(tabNum ?? 0)

  return (
    <div className={cn('tab', className)} {...props} >
      {tabs.map((label, index) => (
        <div
          key={index}
          data-active={tabNum === index ? "" : undefined}
          onClick={(e) => {
            saveIndicatorRect()
            onTabChange?.(label, index, e)
          }}
          className={"relative group tab-item"}
        >
          {label.label}
          {tabNum === index && <div ref={indicatorRef} className={cn("tab-background")} />}
        </div>
      ))}
    </div>
  )
}



function useMovingIndicator(tabNum: number /**Dependencies */) {
  const indicatorRef = useRef<HTMLDivElement>(null)
  const indicatorRectRef = useRef<DOMRect>(null)

  useLayoutEffect(() => {
    if (!indicatorRef.current) return

    const
      indicator = indicatorRef.current,
      currRect = indicator.getBoundingClientRect(),
      prevX = indicatorRectRef.current?.x,
      currX = currRect.left,
      prevW = indicatorRectRef.current?.width,
      currW = currRect.width

    if (!prevX || !currX || !prevW || !currW) return

    const a = indicator.animate([
      { translate: px(prevX - currX), width: px(prevW) },
      { translate: px(0), width: px(currW) }
    ], {
      duration: 150,
      fill: "forwards",
      easing: "ease-in-out",
    })

    a.onfinish = () => a.cancel()
  }, [tabNum])

  function saveIndicatorRect() {
    indicatorRectRef.current = indicatorRef.current?.getBoundingClientRect() ?? null
  }

  return { indicatorRef, saveIndicatorRect }
}
