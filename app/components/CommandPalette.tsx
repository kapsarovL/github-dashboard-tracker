"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/hooks/useTheme";
import {
  Search,
  Home,
  BarChart3,
  GitCompare,
  FileText,
  Settings,
  LayoutDashboard,
  Moon,
  Sun,
  X,
  Command,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/app/ui/Primitives/ui/Button";
import { Input } from "@/app/ui/Primitives/ui/Input";

interface CommandItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  shortcut?: string;
  action?: () => void;
  category: "navigation" | "action" | "theme";
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commandItems: CommandItem[] = [
    // Navigation
    {
      label: "Go to Home",
      href: "/",
      icon: Home,
      shortcut: "G H",
      category: "navigation",
    },
    {
      label: "Go to Analytics",
      href: "/analytics",
      icon: BarChart3,
      shortcut: "G A",
      category: "navigation",
    },
    {
      label: "Go to Compare",
      href: "/compare",
      icon: GitCompare,
      shortcut: "G C",
      category: "navigation",
    },
    {
      label: "Go to Reports",
      href: "/reports",
      icon: FileText,
      shortcut: "G R",
      category: "navigation",
    },
    {
      label: "Go to Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      shortcut: "G D",
      category: "navigation",
    },
    {
      label: "Go to Settings",
      href: "/settings",
      icon: Settings,
      shortcut: "G S",
      category: "navigation",
    },

    // Actions
    {
      label: "Search Repositories",
      icon: Search,
      action: () => console.log("Open search"),
      category: "action",
    },
    {
      label: "Advanced Search",
      icon: Search,
      action: () => console.log("Open advanced search"),
      category: "action",
    },

    // Theme
    {
      label: "Light Theme",
      icon: Sun,
      action: () => setTheme("light"),
      category: "theme",
    },
    {
      label: "Dark Theme",
      icon: Moon,
      action: () => setTheme("dark"),
      category: "theme",
    },
  ];

  const filteredItems = commandItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + filteredItems.length) % filteredItems.length,
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = filteredItems[selectedIndex];
        if (item) {
          if (item.href) {
            router.push(item.href);
          } else if (item.action) {
            item.action();
          }
          onClose();
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, router, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-start justify-center bg-neutral-950/40 pt-[20vh] backdrop-blur-xs">
      <div
        className="bg-card border-border w-full max-w-2xl overflow-hidden rounded-2xl border shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        {/* Search Input */}
        <div className="border-border flex items-center border-b p-4">
          <Search className="text-muted-foreground mr-3 h-5 w-5 opacity-50" />
          <Input
            type="text"
            placeholder="Type a command or search..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="text-foreground border-0 bg-transparent px-0 text-base font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground h-8 w-8 shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Command List */}
        <div className="max-h-100 overflow-y-auto p-2">
          {/* Navigation */}
          {filteredItems.filter((i) => i.category === "navigation").length >
            0 && (
            <div className="mb-2">
              <div className="text-muted-foreground mb-2 px-3 pt-2 text-[10px] font-bold uppercase tracking-wider">
                Navigation
              </div>
              {filteredItems
                .filter((i) => i.category === "navigation")
                .map((item) => (
                  <CommandItemRow
                    key={item.label}
                    item={item}
                    index={filteredItems.indexOf(item)}
                    selectedIndex={selectedIndex}
                    onSelect={() => {
                      if (item.href) router.push(item.href);
                      onClose();
                    }}
                  />
                ))}
            </div>
          )}

          {/* Actions */}
          {filteredItems.filter((i) => i.category === "action").length > 0 && (
            <div className="mb-2">
              <div className="text-muted-foreground mb-2 px-3 pt-2 text-[10px] font-bold uppercase tracking-wider">
                Actions
              </div>
              {filteredItems
                .filter((i) => i.category === "action")
                .map((item) => (
                  <CommandItemRow
                    key={item.label}
                    item={item}
                    index={filteredItems.indexOf(item)}
                    selectedIndex={selectedIndex}
                    onSelect={() => {
                      item.action?.();
                      onClose();
                    }}
                  />
                ))}
            </div>
          )}

          {/* Theme */}
          {filteredItems.filter((i) => i.category === "theme").length > 0 && (
            <div>
              <div className="text-muted-foreground mb-2 px-3 pt-2 text-[10px] font-bold uppercase tracking-wider">
                Theme
              </div>
              {filteredItems
                .filter((i) => i.category === "theme")
                .map((item) => (
                  <CommandItemRow
                    key={item.label}
                    item={item}
                    index={filteredItems.indexOf(item)}
                    selectedIndex={selectedIndex}
                    onSelect={() => {
                      item.action?.();
                      onClose();
                    }}
                  />
                ))}
            </div>
          )}

          {filteredItems.length === 0 && (
            <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-muted mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <Command className="h-6 w-6 opacity-30" />
              </div>
              <p className="text-sm font-medium">No commands found for &quot;{searchQuery}&quot;</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-border bg-muted/50 text-muted-foreground flex items-center justify-between gap-4 border-t px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <kbd className="bg-card border-border rounded border px-1 font-mono">↑↓</kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="bg-card border-border rounded border px-1 font-mono">↵</kbd>
              <span>Select</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="bg-card border-border rounded border px-1 font-mono">esc</kbd>
            <span>Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommandItemRow({
  item,
  index,
  selectedIndex,
  onSelect,
}: {
  item: CommandItem;
  index: number;
  selectedIndex: number;
  onSelect: () => void;
}) {
  const Icon = item.icon;
  const isSelected = index === selectedIndex;

  return (
    <button
      onClick={onSelect}
      className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-all ${
        isSelected 
          ? "bg-primary text-primary-foreground shadow-sm" 
          : "text-foreground hover:bg-muted"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`h-4 w-4 ${isSelected ? "opacity-100" : "text-muted-foreground opacity-70 group-hover:text-foreground"}`} />
        <span className="text-sm font-bold tracking-tight">{item.label}</span>
      </div>
      <div className="flex items-center gap-2">
        {item.shortcut && (
          <kbd className={`rounded border px-1.5 py-0.5 font-mono text-[9px] font-bold transition-colors ${
            isSelected 
              ? "bg-primary-foreground/20 border-primary-foreground/20 text-primary-foreground" 
              : "bg-muted text-muted-foreground border-border"
          }`}>
            {item.shortcut}
          </kbd>
        )}
        <ArrowRight className={`h-3 w-3 transition-transform ${isSelected ? "translate-x-0.5 opacity-100" : "opacity-30"}`} />
      </div>
    </button>
  );
}

// Hook to manage command palette
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };
}
