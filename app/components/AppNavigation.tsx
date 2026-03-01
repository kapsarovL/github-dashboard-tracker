"use client";

import React, { useEffect, useState } from "react";
import {
  Home,
  BarChart3,
  GitCompare,
  FileText,
  Settings,
  Menu,
  X,
  GitBranch,
  Search,
} from "lucide-react";
import { Button } from "@/app/ui/Primitives/ui/Button";
import { CommandPalette, useCommandPalette } from "./CommandPalette";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  shortcut?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", icon: Home, shortcut: "G H" },
  { label: "Analytics", href: "/analytics", icon: BarChart3, shortcut: "G A" },
  { label: "Compare", href: "/compare", icon: GitCompare, shortcut: "G C" },
  { label: "Reports", href: "/reports", icon: FileText, shortcut: "G R" },
  { label: "Settings", href: "/settings", icon: Settings, shortcut: "G S" },
];

export function AppNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const {
    isOpen: isCommandOpen,
    open: openCommand,
    close: closeCommand,
  } = useCommandPalette();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K / Ctrl+K opens command palette
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openCommand();
        return;
      }

      // G + letter navigation shortcuts
      if (e.key === "g" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const handleGShortcut = (event: KeyboardEvent) => {
          const item = NAV_ITEMS.find(
            (i) => i.shortcut === `G ${event.key.toUpperCase()}`,
          );
          if (item) window.location.href = item.href;
          window.removeEventListener("keydown", handleGShortcut);
        };
        window.addEventListener("keydown", handleGShortcut, { once: true });
      }

      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, openCommand]);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="sticky top-0 z-40 hidden border-b border-border bg-card lg:block">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="group flex shrink-0 items-center gap-2.5">
            <div className="bg-primary/5 group-hover:bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg transition-colors">
              <GitBranch className="text-primary h-4 w-4" />
            </div>
            <span className="text-foreground text-sm font-bold tracking-tight">
              GitHub Dashboard
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={`h-8 gap-1.5 px-3 text-[11px] font-bold uppercase tracking-wider transition-all ${
                      isActive
                        ? "shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Search trigger */}
          <button
            onClick={openCommand}
            className="bg-muted/50 border-border text-muted-foreground hover:bg-muted hover:text-foreground flex h-9 w-64 items-center gap-3 rounded-lg border px-3 text-[11px] font-bold uppercase tracking-wider transition-all"
          >
            <Search className="h-3.5 w-3.5 shrink-0 opacity-50" />
            <span className="flex-1 text-left">Quick Search…</span>
            <kbd className="bg-card border-border text-muted-foreground inline-flex h-5 items-center rounded border px-1.5 font-mono text-[9px] font-bold">
              ⌘K
            </kbd>
          </button>
        </div>
      </nav>

      {/* Command Palette */}
      <CommandPalette isOpen={isCommandOpen} onClose={closeCommand} />

      {/* Mobile Navigation */}
      <nav className="sticky top-0 z-40 border-b border-border bg-card lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="bg-primary/5 flex h-8 w-8 items-center justify-center rounded-lg">
              <GitBranch className="text-primary h-4 w-4" />
            </div>
            <span className="text-foreground text-sm font-bold tracking-tight">
              GitHub Dashboard
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={openCommand}
              className="text-muted-foreground h-9 w-9 hover:bg-muted"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-muted-foreground h-9 w-9 hover:bg-muted"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="bg-card border-border absolute inset-x-0 top-14 border-b shadow-xl">
            <div className="space-y-1 p-3">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                  >
                    <div
                      className={`flex items-center justify-between rounded-lg px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 shrink-0" />
                        {item.label}
                      </div>
                      {item.shortcut && (
                        <kbd className="bg-background/20 rounded border border-current/20 px-1.5 font-mono text-[9px] opacity-80">
                          {item.shortcut}
                        </kbd>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
