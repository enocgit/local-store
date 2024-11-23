export const isAllowedPath = (path: string): boolean => {
  // Paths that we don't want users to return to
  const disallowedPaths = [
    "/auth",
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/reset",
  ];

  return !disallowedPaths.includes(path);
};

export const getCallbackUrl = (
  currentPath: string,
  userRole?: string | null,
): string => {
  // If user is on auth page, redirect to products
  if (currentPath.startsWith("/auth")) {
    return "/products";
  }

  // If user is admin, redirect to dashboard
  if (userRole === "ADMIN") {
    return "/dashboard";
  }

  // If path is allowed, return to the same page
  if (isAllowedPath(currentPath)) {
    return currentPath;
  }

  // Default fallback
  return "/products";
};
