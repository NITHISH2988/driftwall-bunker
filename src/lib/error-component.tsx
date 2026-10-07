import type { ErrorComponentProps } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";

export function AppErrorComponent({ error }: ErrorComponentProps) {
  const message = error instanceof Error ? error.message : "Please refresh and try again.";
  return (
    <main className="error-screen">
      <TriangleAlert aria-hidden="true" size={28} />
      <h1>That didn’t go as planned.</h1>
      <p>{message}</p>
      <a href="/">Return to Esper Studio</a>
    </main>
  );
}
