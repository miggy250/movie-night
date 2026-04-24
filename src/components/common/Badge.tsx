interface BadgeProps {
  text: string;
  className?: string;
}

export default function Badge({text, className = ''}: BadgeProps) {
  return (
    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${className}`}>
      {text}
    </span>
  );
}
