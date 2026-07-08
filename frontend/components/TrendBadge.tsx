interface TrendBadgeProps {
  trend: "up" | "down" | "stable";
}

export default function TrendBadge({ trend }: TrendBadgeProps) {
  const config = {
    up: { label: "A subir", color: "text-red-600 bg-red-50", arrow: "↑" },
    down: { label: "A descer", color: "text-green-600 bg-green-50", arrow: "↓" },
    stable: { label: "Estável", color: "text-gray-600 bg-gray-100", arrow: "→" },
  };

  const { label, color, arrow } = config[trend];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
      <span>{arrow}</span>
      {label}
    </span>
  );
}
