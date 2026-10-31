"use client";

import React, { useState } from "react";

export function ShareLinks({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(url || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  return (
    <div className="flex items-center gap-4 type-small text-tone-muted py-4 border-y border-tone-rule my-6">
      <span className="font-medium text-tone-body">Share:</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-tone-heading transition-colors duration-150"
      >
        Twitter
      </a>
      <span className="text-rule">/</span>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-tone-heading transition-colors duration-150"
      >
        LinkedIn
      </a>
      <span className="text-rule">/</span>
      <button
        type="button"
        onClick={copyLink}
        className="hover:text-tone-heading transition-colors duration-150 cursor-pointer"
      >
        {copied ? "Link copied" : "Copy link"}
      </button>
    </div>
  );
}

