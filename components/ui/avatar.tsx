import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface AvatarProps {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const sizeStyles = {
    sm: "h-7 w-7 text-[10px]",
    md: "h-9 w-9 text-xs",
    lg: "h-12 w-12 text-sm",
  };

  const getInitials = (fullName: string): string => {
    if (!fullName) return "GE";
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden bg-navy text-white font-serif font-medium flex items-center justify-center border border-tone-rule rounded-[2px] select-none",
        sizeStyles[size],
        className
      )}
      title={name}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes="48px"
          className="object-cover"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
}

