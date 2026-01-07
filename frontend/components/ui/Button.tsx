import React, { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
        const variants = {
            primary:
                "bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 text-white shadow-[0_0_20px_rgba(139,92,246,0.5)] border-none",
            secondary:
                "bg-surface border border-white/10 hover:bg-white/5 text-text",
            outline:
                "bg-transparent border border-primary/50 text-primary hover:bg-primary/10 hover:shadow-[0_0_10px_rgba(139,92,246,0.3)]",
            ghost: "bg-transparent hover:bg-white/5 text-text-muted hover:text-text",
        };

        const sizes = {
            sm: "px-4 py-2 text-sm",
            md: "px-6 py-3 text-base",
            lg: "px-8 py-4 text-lg",
        };

        return (
            <button
                ref={ref}
                className={cn(
                    "relative inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button };
