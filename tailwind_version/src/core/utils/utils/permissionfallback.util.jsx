export function PermissionFallback({
  module,
  children,
}) {
  const allow = module?.allow ?? {};
  const hasAnyPermission = Boolean(
    allow.update || allow.delete
  );
  console.log(module.allow)
  if (!hasAnyPermission) {
    return (
      <div className="px-3 py-4 text-center text-sm text-muted-foreground">
        🚫 No permission allotted
        <div className="mt-1 text-xs font-medium">
          for this module
        </div>
      </div>
    );
  }

  return <>{children}</>;
}