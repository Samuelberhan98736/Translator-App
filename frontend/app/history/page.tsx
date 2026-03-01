import Card from "@/components/ui/Card";

export default function HistoryPage() {
  return (
    <Card>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        Resume Version History
      </h1>
      <p className="text-sm leading-6 text-slate-700">
        This page will show previous translation outputs and timestamps for each
        saved resume version.
      </p>
    </Card>
  );
}
