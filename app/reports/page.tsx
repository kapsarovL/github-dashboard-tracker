"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/Primitives/ui/Card";
import { Button } from "@/app/ui/Primitives/ui/Button";
import { FileText, Download, FileJson, Sheet, Clock, Calendar } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/app/components/MotionWrappers";

export default function ReportsPage() {
  const recentReports = [
    { name: "github-dashboard-report", date: "2025-02-24", type: "PDF" },
    { name: "react-components-data", date: "2025-02-23", type: "CSV" },
    { name: "api-toolkit-report", date: "2025-02-22", type: "JSON" },
  ];

  return (
    <div className="bg-background min-h-screen pt-16">
      <StaggerContainer className="mx-auto max-w-5xl px-4 py-8">
        <StaggerItem className="mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Export Reports
            </h1>
            <p className="mt-2 text-muted-foreground">
              Download and manage your repository reports
            </p>
          </div>
        </StaggerItem>

        {/* Export Options */}
        <StaggerItem className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card className="border-border bg-card transition-all hover:shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">PDF Report</CardTitle>
                  <p className="text-muted-foreground text-xs">Professional format</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                Comprehensive report with charts, tables, and contributor insights
              </p>
              <Button className="w-full gap-2">
                <Download className="h-4 w-4" />
                Generate PDF
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border bg-card transition-all hover:shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500/10 flex h-12 w-12 items-center justify-center rounded-xl">
                  <Sheet className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">CSV Data</CardTitle>
                  <p className="text-muted-foreground text-xs">Spreadsheet format</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                Raw data export for Excel, Google Sheets, or data analysis
              </p>
              <Button variant="outline" className="w-full gap-2">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border bg-card transition-all hover:shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-purple-500/10 flex h-12 w-12 items-center justify-center rounded-xl">
                  <FileJson className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">JSON Data</CardTitle>
                  <p className="text-muted-foreground text-xs">API-ready format</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                Structured data for API integration or programmatic access
              </p>
              <Button variant="outline" className="w-full gap-2">
                <Download className="h-4 w-4" />
                Export JSON
              </Button>
            </CardContent>
          </Card>
        </StaggerItem>

        {/* Recent Reports */}
        <StaggerItem>
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Recent Exports</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    Your recently generated reports
                  </p>
                </div>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <div
                    key={report.name}
                    className="border-border hover:bg-muted flex items-center justify-between rounded-xl border p-4 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                        {report.type === "PDF" ? (
                          <FileText className="h-5 w-5 text-primary" />
                        ) : report.type === "CSV" ? (
                          <Sheet className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <FileJson className="h-5 w-5 text-purple-500" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-foreground font-medium">{report.name}</h4>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {report.date}
                          </span>
                          <span className="bg-muted rounded px-1.5 py-0.5 font-medium">
                            {report.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </StaggerItem>

        {/* Scheduled Reports */}
        <StaggerItem className="mt-8">
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Scheduled Reports</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    Automate report generation
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">Weekly Summary</p>
                  <p className="text-muted-foreground text-sm">
                    Get a PDF report every Monday at 9 AM
                  </p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
      </StaggerContainer>
    </div>
  );
}
