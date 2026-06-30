export function getPagination(searchParams: { page?: unknown; limit?: unknown }) {
  const page = Math.max(Number(searchParams.page ?? 1), 1);
  const limit = Math.min(Math.max(Number(searchParams.limit ?? 20), 1), 100);
  return {
    page,
    limit,
    offset: (page - 1) * limit,
  };
}
