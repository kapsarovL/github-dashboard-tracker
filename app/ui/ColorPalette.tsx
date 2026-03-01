"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./Primitives/ui/Card";
import { Button } from "./Primitives/ui/Button";

/**
 * Color Palette Display Component
 *
 * Demonstrates the professional color system with all available tokens.
 * Use for reference, testing, or design documentation.
 *
 * @example
 * <ColorPalette />
 */
export function ColorPalette() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Color System</h2>
        <p className="text-muted-foreground mt-1">
          Professional office-appropriate color tokens
        </p>
      </div>

      {/* Core UI Colors */}
      <section>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Core UI Colors
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ColorSwatch name="background" />
          <ColorSwatch name="foreground" />
          <ColorSwatch name="card" />
          <ColorSwatch name="border" />
          <ColorSwatch name="primary" />
          <ColorSwatch name="secondary" />
          <ColorSwatch name="accent" />
          <ColorSwatch name="muted" />
        </div>
      </section>

      {/* Semantic Colors */}
      <section>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Semantic Colors
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ColorSwatch name="success" />
          <ColorSwatch name="warning" />
          <ColorSwatch name="info" />
          <ColorSwatch name="destructive" />
        </div>
      </section>

      {/* Neutral Scale */}
      <section>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Neutral Scale
        </h3>
        <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-11 gap-4">
          <ColorSwatch name="neutral-50" />
          <ColorSwatch name="neutral-100" />
          <ColorSwatch name="neutral-200" />
          <ColorSwatch name="neutral-300" />
          <ColorSwatch name="neutral-400" />
          <ColorSwatch name="neutral-500" />
          <ColorSwatch name="neutral-600" />
          <ColorSwatch name="neutral-700" />
          <ColorSwatch name="neutral-800" />
          <ColorSwatch name="neutral-900" />
          <ColorSwatch name="neutral-950" />
        </div>
      </section>

      {/* Button Variants */}
      <section>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Button Variants
        </h3>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Interactive States */}
      <section>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Interactive States
        </h3>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Default
                </p>
                <div className="h-12 w-full bg-primary rounded-lg" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Hover
                </p>
                <div className="h-12 w-full bg-primary-hover rounded-lg" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Active
                </p>
                <div className="h-12 w-full bg-primary-active rounded-lg" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Text Colors */}
      <section>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Text Hierarchy
        </h3>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <p className="text-foreground text-lg">
              <span className="font-semibold">Foreground:</span> Primary text
              color
            </p>
            <p className="text-muted-foreground text-lg">
              <span className="font-semibold">Muted:</span> Secondary/subtle text
            </p>
            <p className="text-primary text-lg">
              <span className="font-semibold">Primary:</span> Important links &
              actions
            </p>
            <p className="text-destructive text-lg">
              <span className="font-semibold">Destructive:</span> Errors &
              warnings
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

interface ColorSwatchProps {
  name: string;
}

function ColorSwatch({ name }: ColorSwatchProps) {
  return (
    <div className="space-y-2">
      <div
        className="h-16 w-full rounded-lg border shadow-sm"
        style={{
          backgroundColor: `var(--${name})`,
          borderColor:
            name === "background" || name.startsWith("neutral-")
              ? "var(--border)"
              : "transparent",
        }}
      />
      <div className="text-xs">
        <p className="font-medium text-foreground truncate">{name}</p>
        <p className="text-muted-foreground font-mono text-[10px]">
          var(--{name})
        </p>
      </div>
    </div>
  );
}

export default ColorPalette;
