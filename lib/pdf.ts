"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface RepoStats {
  repository: {
    name: string;
    full_name: string;
    description: string | null;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    subscribers_count: number;
    watchers_count: number;
    language: string | null;
    license: { name: string } | null;
    pushed_at: string;
    html_url: string;
    owner: {
      login: string;
      avatar_url: string;
    };
    homepage?: string;
    topics?: string[];
  };
  recentIssues: {
    id: number;
    title: string;
    state: string;
    created_at: string;
    number: number;
    html_url: string;
    user: { login: string } | null;
  }[];
  recentCommits: {
    sha: string;
    html_url: string;
    author: { avatar_url: string } | null;
    commit: {
      author: { date: string; name: string } | null;
      message: string;
    };
  }[];
  recentPullRequests: {
    id: number;
    title: string;
    state: "open" | "closed";
    merged_at: string | null;
    created_at: string;
    draft: boolean;
    number: number;
    html_url: string;
    user: { login: string } | null;
  }[];
  topContributors: {
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
    contributions: number;
  }[];
  projectLanguages: { name: string; percentage: string; value: number }[];
  activityTimeline: { date: string; commits: number; issues: number }[];
}

export type ReportTemplate = "modern" | "classic" | "compact";

interface PDFGenerationOptions {
  template?: ReportTemplate;
  includeSections?: {
    overview: boolean;
    commits: boolean;
    issues: boolean;
    pullRequests: boolean;
    contributors: boolean;
    languages: boolean;
  };
}

/**
 * Generates a professional PDF report for a GitHub repository.
 */
export async function generateRepoReport(
  stats: RepoStats,
  options: PDFGenerationOptions = {},
): Promise<void> {
  const {
    template = "modern",
    includeSections = {
      overview: true,
      commits: true,
      issues: true,
      pullRequests: true,
      contributors: true,
      languages: true,
    },
  } = options;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;

  // Color schemes for different templates
  const colorSchemes = {
    modern: { primary: [59, 130, 246], secondary: [147, 51, 234] }, // Blue + Purple
    classic: { primary: [37, 99, 235], secondary: [55, 65, 81] }, // Blue + Gray
    compact: { primary: [16, 185, 129], secondary: [59, 130, 246] }, // Emerald + Blue
  };

  const colors = colorSchemes[template];

  // --- Cover Page (Modern template only) ---
  if (template === "modern") {
    // Solid color background for cover
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.rect(0, 0, pageWidth, 60, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text(stats.repository.name, margin, 25);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(stats.repository.full_name, margin, 35);

    doc.setFontSize(9);
    doc.text(
      `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
      margin,
      50,
    );
  } else {
    // Simple header for classic/compact
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.rect(0, 0, pageWidth, 30, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(stats.repository.name, margin, 18);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated ${new Date().toLocaleDateString()}`, margin, 25);
  }

  let cursorY = template === "modern" ? 70 : 40;

  // --- Repository Overview ---
  if (includeSections.overview) {
    cursorY = addSectionTitle(
      doc,
      "Repository Overview",
      cursorY,
      margin,
      colors,
    );
    cursorY = addOverviewTable(doc, stats, cursorY, margin, colors);
    cursorY += 10;
  }

  // --- Key Metrics ---
  cursorY = addSectionTitle(doc, "Key Metrics", cursorY, margin, colors);
  cursorY = addMetricsGrid(doc, stats, cursorY, margin, colors);
  cursorY += 10;

  // --- Activity Timeline Summary ---
  if (includeSections.commits && stats.activityTimeline.length > 0) {
    cursorY = addSectionTitle(
      doc,
      "Activity Summary (30 Days)",
      cursorY,
      margin,
      colors,
    );
    cursorY = addActivitySummary(doc, stats.activityTimeline, cursorY, margin);
    cursorY += 10;
  }

  // --- Recent Commits ---
  if (includeSections.commits && stats.recentCommits.length > 0) {
    cursorY = addSectionTitle(doc, "Recent Commits", cursorY, margin, colors);
    cursorY = addCommitsTable(doc, stats.recentCommits, cursorY, margin);
    cursorY += 10;
  }

  // --- Recent Issues ---
  if (includeSections.issues && stats.recentIssues.length > 0) {
    cursorY = addSectionTitle(doc, "Recent Issues", cursorY, margin, colors);
    cursorY = addIssuesTable(doc, stats.recentIssues, cursorY, margin);
    cursorY += 10;
  }

  // --- Recent Pull Requests ---
  if (includeSections.pullRequests && stats.recentPullRequests.length > 0) {
    cursorY = addSectionTitle(
      doc,
      "Recent Pull Requests",
      cursorY,
      margin,
      colors,
    );
    cursorY = addPullRequestsTable(
      doc,
      stats.recentPullRequests,
      cursorY,
      margin,
    );
    cursorY += 10;
  }

  // --- Top Contributors ---
  if (includeSections.contributors && stats.topContributors.length > 0) {
    cursorY = addSectionTitle(doc, "Top Contributors", cursorY, margin, colors);
    cursorY = addContributorsTable(doc, stats.topContributors, cursorY, margin);
    cursorY += 10;
  }

  // --- Languages ---
  if (includeSections.languages && stats.projectLanguages.length > 0) {
    cursorY = addSectionTitle(doc, "Languages", cursorY, margin, colors);
    addLanguagesTable(doc, stats.projectLanguages, cursorY, margin);
  }

  // --- Footer ---
  addFooter(doc, stats);

  // Save the PDF
  const filename = `${stats.repository.name.replace(/[^a-z0-9]/gi, "_")}-report-${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(filename);
}

function addSectionTitle(
  doc: jsPDF,
  title: string,
  y: number,
  margin: number,
  colors: { primary: number[]; secondary: number[] },
): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(margin, y, pageWidth - margin * 2, 8, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(title, margin + 3, y + 5.5);

  return y + 15;
}

function addOverviewTable(
  doc: jsPDF,
  stats: RepoStats,
  y: number,
  margin: number,
  colors: { primary: number[]; secondary: number[] },
): number {
  autoTable(doc, {
    startY: y,
    head: [["Repository", "Details"]],
    body: [
      ["Full Name", stats.repository.full_name],
      ["Description", stats.repository.description || "No description"],
      ["Language", stats.repository.language || "N/A"],
      ["License", stats.repository.license?.name || "N/A"],
      ["Homepage", stats.repository.homepage || "N/A"],
      ["Topics", stats.repository.topics?.join(", ") || "None"],
    ],
    theme: "striped",
    headStyles: { fillColor: colors.primary[0], textColor: [255, 255, 255] },
    styles: { fontSize: 9 },
    margin: { left: margin, right: margin },
  });

  return (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
    .finalY;
}

function addMetricsGrid(
  doc: jsPDF,
  stats: RepoStats,
  y: number,
  margin: number,
  colors: { primary: number[]; secondary: number[] },
): number {
  autoTable(doc, {
    startY: y,
    head: [["Metric", "Value", "Metric", "Value"]],
    body: [
      [
        "⭐ Stars",
        stats.repository.stargazers_count.toString(),
        "🔀 Forks",
        stats.repository.forks_count.toString(),
      ],
      [
        "📝 Open Issues",
        stats.repository.open_issues_count.toString(),
        "👁️ Watchers",
        stats.repository.subscribers_count.toString(),
      ],
    ],
    theme: "striped",
    headStyles: { fillColor: colors.primary[0], textColor: [255, 255, 255] },
    styles: { fontSize: 9, cellPadding: 3 },
    margin: { left: margin, right: margin },
  });

  return (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
    .finalY;
}

function addActivitySummary(
  doc: jsPDF,
  timeline: { date: string; commits: number; issues: number }[],
  y: number,
  margin: number,
): number {
  const totalCommits = timeline.reduce((sum, d) => sum + d.commits, 0);
  const totalIssues = timeline.reduce((sum, d) => sum + d.issues, 0);
  const avgCommitsPerDay = (totalCommits / timeline.length).toFixed(1);
  const mostActiveDay = timeline.reduce((max, d) =>
    d.commits + d.issues > max.commits + max.issues ? d : max,
  );

  autoTable(doc, {
    startY: y,
    head: [["Statistic", "Value"]],
    body: [
      ["Total Commits (30 days)", totalCommits.toString()],
      ["Total Issues (30 days)", totalIssues.toString()],
      ["Avg Commits/Day", avgCommitsPerDay],
      [
        "Most Active Day",
        `${new Date(mostActiveDay.date).toLocaleDateString()} (${mostActiveDay.commits} commits, ${mostActiveDay.issues} issues)`,
      ],
    ],
    theme: "striped",
    headStyles: { fillColor: [59, 130, 246] },
    styles: { fontSize: 9 },
    margin: { left: margin, right: margin },
  });

  return (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
    .finalY;
}

function addCommitsTable(
  doc: jsPDF,
  commits: RepoStats["recentCommits"],
  y: number,
  margin: number,
): number {
  const rows = commits
    .slice(0, 7)
    .map((c) => [
      c.commit.author?.date
        ? new Date(c.commit.author.date).toLocaleDateString()
        : "N/A",
      c.commit.author?.name || "Unknown",
      c.commit.message.length > 50
        ? c.commit.message.substring(0, 50) + "..."
        : c.commit.message,
    ]);

  autoTable(doc, {
    startY: y,
    head: [["Date", "Author", "Message"]],
    body: rows,
    theme: "striped",
    headStyles: { fillColor: [59, 130, 246] },
    styles: { fontSize: 8 },
    columnStyles: {
      2: { cellWidth: 90 },
    },
    margin: { left: margin, right: margin },
  });

  return (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
    .finalY;
}

function addIssuesTable(
  doc: jsPDF,
  issues: RepoStats["recentIssues"],
  y: number,
  margin: number,
): number {
  const rows = issues
    .slice(0, 7)
    .map((i) => [
      `#${i.number}`,
      i.title.length > 40 ? i.title.substring(0, 40) + "..." : i.title,
      i.state === "open" ? "🟢 Open" : "🔴 Closed",
      i.user?.login || "Unknown",
    ]);

  autoTable(doc, {
    startY: y,
    head: [["ID", "Title", "Status", "Author"]],
    body: rows,
    theme: "striped",
    headStyles: { fillColor: [34, 197, 94] },
    styles: { fontSize: 8 },
    columnStyles: {
      1: { cellWidth: 80 },
    },
    margin: { left: margin, right: margin },
  });

  return (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
    .finalY;
}

function addPullRequestsTable(
  doc: jsPDF,
  prs: RepoStats["recentPullRequests"],
  y: number,
  margin: number,
): number {
  const rows = prs.slice(0, 7).map((pr) => {
    let status = "🟡 Open";
    if (pr.merged_at) status = "🟣 Merged";
    else if (pr.state === "closed") status = "🔴 Closed";

    return [
      `#${pr.number}`,
      pr.title.length > 35 ? pr.title.substring(0, 35) + "..." : pr.title,
      status,
      pr.user?.login || "Unknown",
    ];
  });

  autoTable(doc, {
    startY: y,
    head: [["ID", "Title", "Status", "Author"]],
    body: rows,
    theme: "striped",
    headStyles: { fillColor: [139, 92, 246] },
    styles: { fontSize: 8 },
    columnStyles: {
      1: { cellWidth: 70 },
    },
    margin: { left: margin, right: margin },
  });

  return (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
    .finalY;
}

function addContributorsTable(
  doc: jsPDF,
  contributors: RepoStats["topContributors"],
  y: number,
  margin: number,
): number {
  const rows = contributors.slice(0, 10).map((c, index) => {
    let medal = "";
    if (index === 0) medal = "🥇 ";
    else if (index === 1) medal = "🥈 ";
    else if (index === 2) medal = "🥉 ";

    return [`${medal}#${index + 1}`, c.login, c.contributions.toString()];
  });

  autoTable(doc, {
    startY: y,
    head: [["Rank", "Contributor", "Contributions"]],
    body: rows,
    theme: "striped",
    headStyles: { fillColor: [245, 158, 11] },
    styles: { fontSize: 9 },
    margin: { left: margin, right: margin },
  });

  return (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
    .finalY;
}

function addLanguagesTable(
  doc: jsPDF,
  languages: RepoStats["projectLanguages"],
  y: number,
  margin: number,
): number {
  const rows = languages.map((lang) => [
    lang.name,
    lang.percentage + "%",
    lang.value.toString(),
  ]);

  autoTable(doc, {
    startY: y,
    head: [["Language", "Percentage", "Bytes"]],
    body: rows,
    theme: "striped",
    headStyles: { fillColor: [236, 72, 153] },
    styles: { fontSize: 9 },
    margin: { left: margin, right: margin },
  });

  return (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
    .finalY;
}

function addFooter(doc: jsPDF, stats: RepoStats): void {
  const pageCount = doc.getNumberOfPages();
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Footer background
    doc.setFillColor(249, 250, 251);
    doc.rect(0, pageHeight - 15, pageWidth, 15, "F");

    // Footer text
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text(
      `GitHub Dashboard Report • ${stats.repository.full_name}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: "center" },
    );
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, pageHeight - 8, {
      align: "right",
    });
  }
}

// Export to CSV
export function exportToCSV(stats: RepoStats): void {
  const headers = ["Metric", "Value", "Category"];

  const rows = [
    ["Repository Name", stats.repository.name, "Overview"],
    ["Full Name", stats.repository.full_name, "Overview"],
    ["Description", stats.repository.description || "N/A", "Overview"],
    ["Language", stats.repository.language || "N/A", "Overview"],
    ["Stars", stats.repository.stargazers_count.toString(), "Metrics"],
    ["Forks", stats.repository.forks_count.toString(), "Metrics"],
    ["Open Issues", stats.repository.open_issues_count.toString(), "Metrics"],
    ["Watchers", stats.repository.subscribers_count.toString(), "Metrics"],
  ];

  // Add commits
  stats.recentCommits.forEach((commit, index) => {
    rows.push([
      `Commit #${index + 1}`,
      `${commit.commit.message.substring(0, 50)} by ${commit.commit.author?.name || "Unknown"}`,
      "Commits",
    ]);
  });

  // Add contributors
  stats.topContributors.forEach((contributor, index) => {
    rows.push([
      `Contributor #${index + 1}`,
      `${contributor.login} - ${contributor.contributions} contributions`,
      "Contributors",
    ]);
  });

  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${stats.repository.name.replace(/[^a-z0-9]/gi, "_")}-data.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// Export to JSON
export function exportToJSON(stats: RepoStats): void {
  const jsonContent = JSON.stringify(stats, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${stats.repository.name.replace(/[^a-z0-9]/gi, "_")}-data.json`;
  link.click();
  URL.revokeObjectURL(url);
}
