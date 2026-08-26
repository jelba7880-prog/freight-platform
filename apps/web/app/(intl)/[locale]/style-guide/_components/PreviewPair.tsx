import type { ReactNode } from "react";
import { ModePreview } from "./ModePreview";

/**
 * Every component below renders once against apps/web's real light
 * background and once against a simulated apps/portal/apps/admin dark
 * background, side by side, so a reviewer can see both without leaving
 * this (always-light) route.
 */
export function PreviewPair({ light, dark }: { light: ReactNode; dark: ReactNode }) {
  return (
    <div className="flex flex-col gap-cozy md:flex-row">
      <ModePreview mode="light" label="apps/web — light">
        {light}
      </ModePreview>
      <ModePreview mode="dark" label="apps/portal & apps/admin — dark">
        {dark}
      </ModePreview>
    </div>
  );
}
