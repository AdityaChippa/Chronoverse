import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-cosmic focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-cream focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-cosmic-cream text-cosmic-black hover:bg-cosmic-skin-light",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border cosmic-border bg-transparent hover:bg-cosmic-grey-900 hover:text-cosmic-cream",
        secondary: "bg-cosmic-grey-800 text-cosmic-grey-100 hover:bg-cosmic-grey-700",
        ghost: "hover:bg-cosmic-grey-900 hover:text-cosmic-cream",
        link: "text-cosmic-cream underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? "span" : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }