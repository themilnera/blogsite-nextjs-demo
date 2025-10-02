"use client";
import * as React from "react"

import ReactTextareaAutosize from "react-textarea-autosize"

// -- Hooks --
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect"

export function TextareaAutosize({
  ...props
}) {
  const [isRerendered, setIsRerendered] = React.useState(false)

  useIsomorphicLayoutEffect(() => setIsRerendered(true), [])

  return isRerendered ? <ReactTextareaAutosize {...props} /> : null;
}

TextareaAutosize.displayName = "TextareaAutosize"
