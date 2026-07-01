import ResultsClient from "@/components/ui/resultsClient";
import { Suspense } from "react";

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Loading results...</div>}>
      <ResultsClient />
    </Suspense>
  );
}