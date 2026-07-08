interface ConfidenceBadgeProps {
  score: number;
}

export default function ConfidenceBadge({ score }: ConfidenceBadgeProps) {
  const pct = Math.round(score * 100);
  let color = "bg-red-500";
  if (score >= 0.7) color = "bg-green-500";
  else if (score >= 0.4) color = "bg-yellow-500";

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-500">{pct}%</span>
    </div>
  );
}
