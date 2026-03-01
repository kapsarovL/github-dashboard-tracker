"use client";

import React, { useState } from "react";
import { Search, X, Filter } from "lucide-react";
import { Input } from "@/app/ui/Primitives/ui/Input";
import { Button } from "@/app/ui/Primitives/ui/Button";
import { motion, AnimatePresence, Variants } from "framer-motion";

export interface FilterOption {
  id: string;
  label: string;
}

export interface FilterBarProps {
  options?: FilterOption[];
  onSearchChange?: (value: string) => void;
  onFilterChange?: (activeFilters: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function FilterBar({
  options = [],
  onSearchChange,
  onFilterChange,
  placeholder = "Search...",
  className = "",
}: FilterBarProps) {
  const [searchValue, setSearchValue] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    if (onSearchChange) onSearchChange(val);
  };

  const clearSearch = () => {
    setSearchValue("");
    if (onSearchChange) onSearchChange("");
  };

  const toggleFilter = (id: string) => {
    const newFilters = selectedFilters.includes(id)
      ? selectedFilters.filter((f) => f !== id)
      : [...selectedFilters, id];
    setSelectedFilters(newFilters);
    if (onFilterChange) onFilterChange(newFilters);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className={`flex w-full flex-col gap-4 ${className}`}>
      <div className="relative flex w-full max-w-md items-center">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          type="text"
          value={searchValue}
          onChange={handleSearch}
          placeholder={placeholder}
          className="bg-muted/40 border-border/50 focus-visible:border-primary focus-visible:ring-ring w-full rounded-full py-2 pr-9 pl-9 focus-visible:ring-2"
        />
        <AnimatePresence>
          {searchValue && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-1/2 right-1 -translate-y-1/2"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={clearSearch}
                className="text-muted-foreground hover:bg-muted hover:text-foreground h-7 w-7 rounded-full"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Clear search</span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {options.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-wrap items-center gap-2"
        >
          <motion.div
            variants={itemVariants}
            className="text-muted-foreground mr-2 flex items-center gap-1.5 text-sm font-medium"
          >
            <Filter className="h-4 w-4" />
            <span>Filters:</span>
          </motion.div>
          {options.map((option) => {
            const isActive = selectedFilters.includes(option.id);
            return (
              <motion.div key={option.id} variants={itemVariants}>
                <Button
                  type="button"
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter(option.id)}
                  className={`h-8 rounded-full px-4 text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90 shadow-sm"
                      : "border-border/50 bg-background hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  {option.label}
                </Button>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
