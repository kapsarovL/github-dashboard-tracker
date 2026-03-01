"use client";

import React, { useState } from "react";
import { Button } from "@/app/ui/Primitives/ui/Button";
import { FileDown } from "lucide-react";
import { PDFPreviewModal } from "@/components/pdf-preview-modal";
import { RepoStats } from "@/lib/pdf";

export function PDFReportGenerator({
  repoName,
  stats,
}: {
  repoName: string;
  stats: RepoStats;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="border-primary/20 text-primary hover:bg-primary/10 h-9 gap-2"
        onClick={() => setIsModalOpen(true)}
      >
        <FileDown className="h-4 w-4" />
        Report
      </Button>

      <PDFPreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        repoName={repoName}
        stats={stats}
      />
    </>
  );
}
