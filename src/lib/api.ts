export function handleApiError(error: unknown) {
  console.error(error);
  return { error: error instanceof Error ? error.message : "Unknown error" };
}
