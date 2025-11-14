interface PaginationParams {
  page: number;
  pageSize: number;
  total: number;
}

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

export const calculateTotalPages = ({ total, pageSize }: PaginationParams) =>
  Math.max(1, Math.ceil(total / pageSize));

export const buildPaginationMeta = ({
  page,
  pageSize,
  total,
}: PaginationParams) => {
  const totalPages = calculateTotalPages({ total, pageSize, page });

  return {
    page: clamp(page, 1, totalPages),
    pageSize,
    total,
    totalPages,
  };
};

export const buildPaginationRange = (current: number, totalPages: number) => {
  const delta = 1;
  const pages: number[] = [];
  for (
    let page = Math.max(1, current - delta);
    page <= Math.min(totalPages, current + delta);
    page += 1
  ) {
    pages.push(page);
  }
  return pages;
};
