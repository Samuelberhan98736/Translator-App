import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function HomePage() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-cyan-300/20 via-transparent to-blue-400/15 dark:from-cyan-500/20 dark:to-cyan-900/20" />
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Translator App Dashboard
        </h1>
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
          Build role-targeted resumes faster with translation and skills gap insights.
        </p>
        <Badge>MVP Active</Badge>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Quick Navigation
        </h2>
        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>
            <Link className="font-medium text-cyan-700 hover:underline dark:text-cyan-300" href="/translate">
              Open Translator Workspace
            </Link>
          </li>
          <li>
            <Link className="font-medium text-cyan-700 hover:underline dark:text-cyan-300" href="/history">
              Review Resume History
            </Link>
          </li>
          <li>
            <Link className="font-medium text-cyan-700 hover:underline dark:text-cyan-300" href="/profile">
              Manage Profile
            </Link>
          </li>
        </ul>
      </Card>
    </div>
  );
}
