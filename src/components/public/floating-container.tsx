import { cn } from "@/lib/utils";

type FloatingContainerProps = {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const FloatingContainer = ({
  children,
  className,
  ...props
}: FloatingContainerProps) => {
  return (
    <div
      className={cn(
        "absolute top-1/2 left-1/2 -translate-1/2 w-xl bg-white rounded-2xl shadow-lg p-8 border-gray-300 border-3 min-h-64 max-h-8/12 overflow-y-auto z-50",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default FloatingContainer;
