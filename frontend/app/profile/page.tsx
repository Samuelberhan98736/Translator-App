import Card from "@/components/ui/Card";

export default function ProfilePage() {
  return (
    <Card>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        User Profile
      </h1>
      <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
        Manage learner profile details, preferences, and portfolio metadata.
      </p>
    </Card>
  );
}
