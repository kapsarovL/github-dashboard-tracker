"use client";

import React from "react";
import { Button } from "@/app/ui/Primitives/ui/Button";
import { Download, X, Loader2, FileJson, Sheet } from "lucide-react";
import {
  StaggerContainer,
  StaggerItem,
} from "@/app/components/MotionWrappers";
import {
  generateRepoReport,
  exportToCSV,
  exportToJSON,
  RepoStats,
  ReportTemplate,
} from "@/lib/pdf";

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  repoName: string;
  stats: RepoStats;
}

export function PDFPreviewModal({
  isOpen,
  onClose,
  repoName,
  stats,
}: PDFPreviewModalProps) {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    React.useState<ReportTemplate>("modern");

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await generateRepoReport(stats, { template: selectedTemplate });
      onClose();
    } catch (error) {
      console.error("PDF Generation Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportCSV = () => {
    exportToCSV(stats);
    onClose();
  };

  const handleExportJSON = () => {
    exportToJSON(stats);
    onClose();
  };

  return (
    <div className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <StaggerContainer className="bg-card text-card-foreground w-full max-w-2xl overflow-hidden rounded-2xl border p-6 shadow-2xl sm:p-8">
        <StaggerItem className="flex items-start justify-between">
          <div className="space-y-2">
            <h2 className="text-foreground text-2xl font-bold tracking-tight">
              Export Report
            </h2>
            <p className="text-muted-foreground text-sm">
              Export comprehensive data for{" "}
              <strong className="text-primary">{repoName}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md p-1 transition-colors"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
        </StaggerItem>

        {/* Template Selection */}
        <StaggerItem className="mt-6">
          <div className="space-y-3">
            <h3 className="text-foreground text-sm font-semibold">
              PDF Template
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setSelectedTemplate("modern")}
                className={`rounded-xl border-2 p-4 text-left transition-all ${
                  selectedTemplate === "modern"
                    ? "border-primary bg-primary/5"
                    : "border-border/50 hover:border-primary/50"
                }`}
              >
                <div className="text-foreground text-sm font-bold">Modern</div>
                <div className="text-muted-foreground text-xs">
                  Cover page + colors
                </div>
              </button>
              <button
                onClick={() => setSelectedTemplate("classic")}
                className={`rounded-xl border-2 p-4 text-left transition-all ${
                  selectedTemplate === "classic"
                    ? "border-primary bg-primary/5"
                    : "border-border/50 hover:border-primary/50"
                }`}
              >
                <div className="text-foreground text-sm font-bold">Classic</div>
                <div className="text-muted-foreground text-xs">
                  Professional B&W
                </div>
              </button>
              <button
                onClick={() => setSelectedTemplate("compact")}
                className={`rounded-xl border-2 p-4 text-left transition-all ${
                  selectedTemplate === "compact"
                    ? "border-primary bg-primary/5"
                    : "border-border/50 hover:border-primary/50"
                }`}
              >
                <div className="text-foreground text-sm font-bold">Compact</div>
                <div className="text-muted-foreground text-xs">
                  Minimal, 1 page
                </div>
              </button>
            </div>
          </div>
        </StaggerItem>

        {/* Export Options */}
        <StaggerItem className="mt-6 space-y-4">
          <h3 className="text-foreground text-sm font-semibold">
            Export Format
          </h3>

          <div className="grid grid-cols-3 gap-3">
            <Button
              onClick={handleDownload}
              disabled={isGenerating}
              variant="default"
              className="h-20 flex-col gap-2"
            >
              {isGenerating ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Download className="h-6 w-6" />
              )}
              <span className="text-xs">
                {isGenerating ? "Generating..." : "PDF Report"}
              </span>
            </Button>

            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="h-20 flex-col gap-2"
            >
              <Sheet className="h-6 w-6" />
              <span className="text-xs">CSV Data</span>
            </Button>

            <Button
              onClick={handleExportJSON}
              variant="outline"
              className="h-20 flex-col gap-2"
            >
              <FileJson className="h-6 w-6" />
              <span className="text-xs">JSON Data</span>
            </Button>
          </div>
        </StaggerItem>

        <StaggerItem className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={isGenerating}>
            Cancel
          </Button>
        </StaggerItem>
      </StaggerContainer>
    </div>
  );
}
