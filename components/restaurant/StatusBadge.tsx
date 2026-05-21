import { RestaurantStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: RestaurantStatus;
  size?: "sm" | "md";
}

const config = {
  visited: {
    label: "Déjà visité",
    dot: "bg-green-500",
    className: "badge-visited",
  },
  "to-visit": {
    label: "À visiter",
    dot: "bg-red-500",
    className: "badge-to-visit",
  },
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const { label, dot, className } = config[status];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-body font-medium rounded-full
        ${className}
        ${size === "sm" ? "text-xs px-2.5 py-1" : "text-sm px-3 py-1.5"}
      `}
    >
      <span className={`inline-block rounded-full ${dot} ${size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
      {label}
    </span>
  );
}