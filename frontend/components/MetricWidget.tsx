import { cn } from "@/lib/utils"

type MetricWidgetProps = {
  title: string
  value: string
  subtitle?: string
  color?: string
  onClick?: () => void
  className?: string
}

export default function MetricWidget({
  title,
  value,
  subtitle,
  color = "text-white",
  onClick,
  className,
}: MetricWidgetProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 flex-1 cursor-pointer transition-transform hover:scale-110",
        className
      )}
    >
      <div className="text-xs text-gray-400 mb-1">{title}</div>
      <div className={`text-sm font-semibold ${color}`}>{value}</div>
      {subtitle && (
        <div className="text-xs text-gray-500">{subtitle}</div>
      )}
    </div>
  )
}
