import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function HomePage() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Educational Sandbox Dashboard
        </h1>
        <p className="text-sm leading-6 text-slate-700">
          Start with the Translator Agent to rewrite resumes into target-job
          language and identify capability gaps.
        </p>
        <Badge>Phase: MVP</Badge>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-slate-900">Quick Navigation</h2>
        <ul className="space-y-2 text-sm text-slate-700">
          <li>
            <Link className="font-medium text-accent hover:underline" href="/translate">
              Go to Translator
            </Link>
          </li>
          <li>
            <Link className="font-medium text-accent hover:underline" href="/history">
              View Resume History
            </Link>
          </li>
          <li>
            <Link className="font-medium text-accent hover:underline" href="/profile">
              Open Profile
            </Link>
          </li>
        </ul>
      </Card>
    </div>
  );
}
