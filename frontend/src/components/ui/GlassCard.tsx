import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, HTMLMotionProps } from "framer-motion"

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode
  variant?: "default" | "panel"
}

export function GlassCard({ className, children, variant = "default", ...props }: GlassCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        variant === "default" ? "glass-card" : "glass-panel",
        "p-6 rounded-2xl relative overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Optional decorative gradient orb in the background for extra premium feel */}
      {variant === "panel" && (
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      )}
      <div className="relative z-10 h-full flex flex-col">
        {children}
      </div>
    </motion.div>
  )
}
