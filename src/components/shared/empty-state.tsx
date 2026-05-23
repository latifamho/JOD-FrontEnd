import { AppIcons } from "@/constant/icons";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: keyof typeof AppIcons;
};

export function EmptyState({
  title,
  description,
  icon = "search",
}: EmptyStateProps) {
  const Icon = AppIcons[icon];

  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background px-6 text-center">
      <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>
      <p className="text-base font-semibold text-foreground">{title}</p>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

