import { RepoSelector } from "@/app/components/RepoSelector";
import {
  StaggerContainer,
  StaggerItem,
} from "@/app/components/MotionWrappers";

export function InvalidFormatScreen() {
  return (
    <StaggerContainer className="bg-background mx-auto flex h-full min-h-[70vh] flex-col items-center justify-center p-8 text-center xl:max-w-7xl">
      <StaggerItem className="mb-8 space-y-4">
        <h2 className="text-destructive text-3xl font-extrabold tracking-tight sm:text-4xl">
          Invalid Format
        </h2>
        <p className="text-muted-foreground mx-auto max-w-lg text-lg">
          Please search using the exact format <strong>owner/repository</strong>{" "}
          (e.g., facebook/react).
        </p>
      </StaggerItem>
      <StaggerItem className="flex w-full max-w-md justify-center">
        <RepoSelector />
      </StaggerItem>
    </StaggerContainer>
  );
}
