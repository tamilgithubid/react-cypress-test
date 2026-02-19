import { cn } from "@/lib/utils";

function Button({ className, disabled, children, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
        "bg-gray-900 text-white hover:bg-gray-800",
        "h-10 px-4 py-2",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export { Button };
