interface ProgressBarProps {
  value: number;
  maxValue?: number;
  color?: "success" | "warning" | "danger" | "primary";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ProgressBar({
  value,
  maxValue = 100,
  color = "primary",
  size = "md",
  className = "",
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / maxValue) * 100, 0), 100);
  
  const heightClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };
  
  const colorClasses = {
    success: "bg-green-500",
    warning: "bg-yellow-500", 
    danger: "bg-red-500",
    primary: "bg-blue-600",
  };

  return (
    <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heightClasses[size]} ${className}`}>
      <div
        className={`${heightClasses[size]} ${colorClasses[color]} rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
