import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-indigo-500 border text-white hover:bg-indigo-600 hover:text-white dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        primary:
          "bg-blue-950 text-white hover:bg-blue-900",
        secondary:
          "bg-yellow-500 text-white hover:bg-yellow-600 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        info:
          "bg-cyan-400 text-white hover:bg-cyan-500",
      },
      size: {
        default: "h-9 px-4 py-3 has-[>svg]:px-3 cursor-pointer",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5 cursor-pointer",
        lg: "h-10 rounded-none px-6 py-6 has-[>svg]:px-4 cursor-pointer",
        icon: "size-9",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "lg",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
