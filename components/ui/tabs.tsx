"use client";

import React, { createContext, useContext, useState, useId } from "react";
import { cn } from "@/lib/utils";

interface TabsContextType {
  activeTab: string;
  setActiveTab: (val: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextType | null>(null);

export interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const baseId = useId();
  const activeTab = value !== undefined ? value : internalValue;

  const setActiveTab = (val: string) => {
    if (value === undefined) setInternalValue(val);
    onValueChange?.(val);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, baseId }}>
      <div className={cn("w-full space-y-4", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex border-b border-tone-rule gap-6 overflow-x-auto scrollbar-none",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Tab({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tab must be used within Tabs");

  const isSelected = ctx.activeTab === value;
  const tabId = `${ctx.baseId}-tab-${value}`;
  const panelId = `${ctx.baseId}-panel-${value}`;

  return (
    <button
      role="tab"
      id={tabId}
      aria-selected={isSelected}
      aria-controls={panelId}
      tabIndex={isSelected ? 0 : -1}
      onClick={() => ctx.setActiveTab(value)}
      className={cn(
        "pb-3 text-sm font-medium transition-colors duration-150 relative cursor-pointer select-none whitespace-nowrap",
        isSelected
          ? "text-tone-heading font-semibold"
          : "text-tone-muted hover:text-tone-body",
        className
      )}
    >
      {children}
      {isSelected && (
        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold" />
      )}
    </button>
  );
}

export function TabPanel({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("TabPanel must be used within Tabs");

  const isSelected = ctx.activeTab === value;
  const tabId = `${ctx.baseId}-tab-${value}`;
  const panelId = `${ctx.baseId}-panel-${value}`;

  if (!isSelected) return null;

  return (
    <div
      role="tabpanel"
      id={panelId}
      aria-labelledby={tabId}
      tabIndex={0}
      className={cn("focus:outline-none", className)}
    >
      {children}
    </div>
  );
}

