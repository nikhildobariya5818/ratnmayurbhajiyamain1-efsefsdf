"use client"

import type * as React from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { detectTextScript, getMultilingualStyles, type DetectedScript } from "@/lib/language-detection"

interface MultilingualInputProps extends React.ComponentProps<"input"> {
  onScriptChange?: (script: DetectedScript) => void
}

function MultilingualInput({ className, type, value, onChange, onScriptChange, ...props }: MultilingualInputProps) {
  const [detectedScript, setDetectedScript] = useState<DetectedScript>("latin")

  useEffect(() => {
    if (value && typeof value === "string") {
      const script = detectTextScript(value)
      setDetectedScript(script)
      onScriptChange?.(script)
    }
  }, [value, onScriptChange])

  const multilingualStyles = getMultilingualStyles(detectedScript)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    const script = detectTextScript(newValue)
    setDetectedScript(script)
    onScriptChange?.(script)
    onChange?.(e)
  }

  return (
    <input
      type={type}
      value={value}
      onChange={handleChange}
      data-slot="input"
      dir={multilingualStyles.direction}
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        multilingualStyles.fontFamily,
        className,
      )}
      {...props}
    />
  )
}

export { MultilingualInput }
