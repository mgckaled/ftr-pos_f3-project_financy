import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { AppRouter } from "@/router";

export default function App() {
  return (
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  );
}
