import Card from "@/components/ui/Card";

export default function HistoryPage() {
  return (
    <Card>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        Resume Version History
      </h1>
      <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
        Review previous translations, compare language changes, and restore older versions.
      </p>
    </Card>
  );
}
