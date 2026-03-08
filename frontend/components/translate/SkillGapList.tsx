"use client";

type Props = {
  skillGaps: string[];
};

export default function SkillGapList({ skillGaps }: Props) {
  if (skillGaps.length === 0) {
    return <p className="text-sm text-slate-600 dark:text-slate-400">No skill gaps identified yet.</p>;
  }

  return (
    <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
      {skillGaps.map((gap) => (
        <li key={gap}>{gap}</li>
      ))}
    </ul>
  );
}
