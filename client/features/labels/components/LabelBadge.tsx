"use client";

import { Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LabelBadgeProps {
  name: string;
  color?: string | null;
  className?: string;
  showIcon?: boolean;
}

export const PRESET_LABEL_COLORS = [
  { name: "Slate", value: "#64748b" },
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Emerald", value: "#10b981" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Pink", value: "#ec4899" },
];

export function LabelBadge({
  name,
  color,
  className,
  showIcon = true,
}: LabelBadgeProps) {
  const customColorStyle = color
    ? {
        backgroundColor: `${color}18`, // 10% opacity in hex
        color: color,
        borderColor: `${color}35`,
      }
    : undefined;

  return (
    <Badge
      variant="secondary"
      style={customColorStyle}
      className={cn(
        "h-5 rounded-md px-1.5 text-[10px] font-normal transition-colors",
        !color && "bg-muted text-muted-foreground border-border/40",
        className
      )}
    >
      {showIcon && (
        <Tag
          className="size-2.5 mr-1 shrink-0"
          style={color ? { color } : undefined}
        />
      )}
      <span className="truncate">{name}</span>
    </Badge>
  );
}
