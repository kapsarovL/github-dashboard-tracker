"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/ui/Primitives/ui/Card";
import { Button } from "@/app/ui/Primitives/ui/Button";
import { Input } from "@/app/ui/Primitives/ui/Input";
import { Switch } from "@/app/ui/Primitives/ui/Switch";
import {
  StaggerContainer,
  StaggerItem,
} from "@/app/components/MotionWrappers";
import { useTheme } from "@/app/hooks/useTheme";
import {
  User,
  Bell,
  Palette,
  Key,
  Database,
  Trash2,
  Save,
  Moon,
  Sun,
  Monitor,
  GitBranch,
  Mail,
  Shield,
} from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="bg-background min-h-screen pt-16">
      <StaggerContainer className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <StaggerItem className="mb-8">
          <div>
            <h1 className="text-foreground text-3xl font-bold tracking-tight">
              Settings
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your account preferences and application settings
            </p>
          </div>
        </StaggerItem>

        {/* Profile Settings */}
        <StaggerItem className="mb-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
                  <User className="text-primary h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Profile</CardTitle>
                  <CardDescription className="text-sm">
                    Update your personal information
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-foreground text-sm font-medium">
                    Name
                  </label>
                  <Input placeholder="Your name" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-foreground text-sm font-medium">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    defaultValue="john@example.com"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>

        {/* Appearance */}
        <StaggerItem className="mb-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
                  <Palette className="text-primary h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Appearance</CardTitle>
                  <CardDescription className="text-sm">
                    Customize how the dashboard looks
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <ThemeOption icon={Sun} label="Light" value="light" active={theme === "light"} onSelect={() => setTheme("light")} />
                <ThemeOption icon={Moon} label="Dark" value="dark" active={theme === "dark"} onSelect={() => setTheme("dark")} />
              </div>
            </CardContent>
          </Card>
        </StaggerItem>

        {/* Notifications */}
        <StaggerItem className="mb-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
                  <Bell className="text-primary h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Notifications</CardTitle>
                  <CardDescription className="text-sm">
                    Manage your notification preferences
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ToggleRow
                label="Email Notifications"
                description="Receive updates via email"
                defaultChecked
              />
              <ToggleRow
                label="Push Notifications"
                description="Get browser notifications"
                defaultChecked
              />
              <ToggleRow
                label="Weekly Digest"
                description="Summary of repository activity"
                defaultChecked={false}
              />
            </CardContent>
          </Card>
        </StaggerItem>

        {/* API & Integrations */}
        <StaggerItem className="mb-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
                  <Key className="text-primary h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">API & Integrations</CardTitle>
                  <CardDescription className="text-sm">
                    Manage API keys and connected services
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-foreground text-sm font-medium">
                  GitHub Personal Access Token
                </label>
                <Input
                  type="password"
                  placeholder="ghp_..."
                  className="font-mono"
                />
                <p className="text-muted-foreground text-xs">
                  Required for accessing private repositories
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <GitBranch className="h-4 w-4" />
                  <span>Connected as @username</span>
                </div>
                <Button variant="outline" size="sm">
                  Disconnect
                </Button>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>

        {/* Data Management */}
        <StaggerItem className="mb-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
                  <Database className="text-primary h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Data Management</CardTitle>
                  <CardDescription className="text-sm">
                    Export or delete your data
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">Export Data</p>
                  <p className="text-muted-foreground text-sm">
                    Download all your saved repositories and settings
                  </p>
                </div>
                <Button variant="outline" className="gap-2">
                  <Mail className="h-4 w-4" />
                  Export
                </Button>
              </div>
              <div className="border-border border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-destructive font-medium">
                      Delete Account
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button variant="destructive" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>

        {/* Security */}
        <StaggerItem>
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
                  <Shield className="text-primary h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Security</CardTitle>
                  <CardDescription className="text-sm">
                    Manage your security settings
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ToggleRow
                label="Two-Factor Authentication"
                description="Add an extra layer of security"
                defaultChecked={false}
              />
              <div className="flex justify-end">
                <Button variant="outline">Change Password</Button>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
      </StaggerContainer>
    </div>
  );
}

function ThemeOption({
  icon: Icon,
  label,
  active,
  onSelect,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border hover:bg-accent hover:text-accent-foreground"
      }`}
      aria-pressed={active}
    >
      <Icon className="h-6 w-6" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function ToggleRow({
  label,
  description,
  defaultChecked = false,
}: {
  label: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <p className="text-foreground text-sm font-medium">{label}</p>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
