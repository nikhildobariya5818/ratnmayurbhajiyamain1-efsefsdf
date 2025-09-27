"use client"

import type * as React from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { detectTextScript, getMultilingualStyles, type DetectedScript } from "@/lib/language-detection"

interface MultilingualTextareaProps extends React.ComponentProps<"textarea"> {
  onScriptChange?: (script: DetectedScript) => void
}

function MultilingualTextarea({ className, value, onChange, onScriptChange, ...props }: MultilingualTextareaProps) {
  const [detectedScript, setDetectedScript] = useState<DetectedScript>("latin")

  useEffect(() => {
    if (value && typeof value === "string") {
      const script = detectTextScript(value)
      setDetectedScript(script)
      onScriptChange?.(script)
    }
  }, [value, onScriptChange])

  const multilingualStyles = getMultilingualStyles(detectedScript)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    const script = detectTextScript(newValue)
    setDetectedScript(script)
    onScriptChange?.(script)
    onChange?.(e)
  }

  return (
    <textarea
      value={value}
      onChange={handleChange}
      data-slot="textarea"
      dir={multilingualStyles.direction}
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        multilingualStyles.fontFamily,
        className,
      )}
      {...props}
    />
  )
}

export { MultilingualTextarea }
