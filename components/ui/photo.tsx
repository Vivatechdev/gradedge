"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type PhotoAspectRatio = "1:1" | "4:5" | "4:3" | "3:2" | "16:9" | "21:9";

export interface PhotoProps {
  src: string;
  alt: string;
  aspectRatio?: PhotoAspectRatio;
  caption?: string;
  navyWash?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
  imageClassName?: string;
  placeholderText?: string;
}

const ASPECT_RATIO_CLASSES: Record<PhotoAspectRatio, string> = {
  "1:1": "aspect-square",
  "4:5": "aspect-[4/5]",
  "4:3": "aspect-[4/3]",
  "3:2": "aspect-[3/2]",
  "16:9": "aspect-[16/9]",
  "21:9": "aspect-[21/9]",
};

const DEFAULT_SIZES: Record<PhotoAspectRatio, string> = {
  "1:1": "(max-width: 768px) 100vw, 400px",
  "4:5": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px",
  "4:3": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px",
  "3:2": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 720px",
  "16:9": "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px",
  "21:9": "100vw",
};

// Subtle warm-grey placeholder blur data URL
const WARM_BLUR_DATA_URL =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'%3E%3Crect width='4' height='3' fill='%23E4DFD5'/%3E%3C/svg%3E";

export function Photo({
  src,
  alt,
  aspectRatio = "3:2",
  caption,
  navyWash = false,
  priority = false,
  sizes,
  className,
  imageClassName,
  placeholderText,
}: PhotoProps) {
  const [loadError, setLoadError] = useState(false);

  const aspectClass = ASPECT_RATIO_CLASSES[aspectRatio] || "aspect-[3/2]";
  const computedSizes = sizes || DEFAULT_SIZES[aspectRatio] || "100vw";
  const labelText = placeholderText || caption || alt || src;

  return (
    <figure className={cn("block w-full overflow-hidden", className)}>
      <div
        className={cn(
          "relative w-full overflow-hidden bg-[#E4DFD5] rounded-[2px]",
          aspectClass
        )}
      >
        {!loadError ? (
          <>
            <Image
              src={src}
              alt={alt}
              fill
              priority={priority}
              sizes={computedSizes}
              placeholder="blur"
              blurDataURL={WARM_BLUR_DATA_URL}
              onError={() => setLoadError(true)}
              className={cn(
                "object-cover transition-opacity duration-300",
                imageClassName
              )}
            />
            {navyWash && (
              <div
                className="absolute inset-0 bg-[#1F3A5F] opacity-[0.18] mix-blend-multiply pointer-events-none"
                aria-hidden="true"
              />
            )}
          </>
        ) : (
          /* Neutral flat warm-grey frame fallback (#E4DFD5) with editorial placeholder caption */
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#E4DFD5] border border-tone-rule/80 select-none"
            role="img"
            aria-label={alt || "Image placeholder"}
          >
            <div className="flex items-center justify-center w-9 h-9 mb-2.5 rounded-full bg-white/70 text-[#1F3A5F]">
              <svg
                className="w-4 h-4 opacity-70"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            </div>
            <p className="type-micro text-[#14263F] opacity-90 max-w-xs leading-snug">
              {labelText}
            </p>
            <span className="text-[10px] uppercase tracking-wider text-[#555555] mt-1 opacity-75 font-mono">
              [{aspectRatio}] editorial photography
            </span>
          </div>
        )}
      </div>

      {caption && (
        <figcaption className="mt-2 text-xs text-tone-muted italic leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * PhotoFrame: Editorial variant with a subtle gold offset rule behind the image
 */
export function PhotoFrame({
  children,
  className,
  offset = 8,
}: {
  children: React.ReactNode;
  className?: string;
  offset?: number;
}) {
  return (
    <div className={cn("relative", className)}>
      {/* Decorative gold rule offset behind */}
      <div
        className="absolute inset-0 border border-gold/70 rounded-[2px] pointer-events-none"
        style={{
          transform: `translate(${offset}px, ${offset}px)`,
        }}
        aria-hidden="true"
      />
      {/* Main photo container */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

