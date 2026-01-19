/**
 * Pagination utilities for consistent pagination across the application
 */

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  startIndex: number;
  endIndex: number;
}

export interface PaginationLinks {
  first: number;
  previous: number | null;
  next: number | null;
  last: number;
}

/**
 * Calculate pagination info from total count and current page
 */
export function calculatePagination(
  total: number,
  page: number = 1,
  limit: number = 10
): PaginationInfo {
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, Math.min(100, limit)); // Cap at 100 items per page
  const totalPages = Math.ceil(total / safeLimit);
  const actualPage = Math.min(safePage, Math.max(1, totalPages));

  const startIndex = (actualPage - 1) * safeLimit;
  const endIndex = Math.min(startIndex + safeLimit, total);

  return {
    page: actualPage,
    limit: safeLimit,
    total,
    totalPages: totalPages || 1,
    hasNext: actualPage < totalPages,
    hasPrevious: actualPage > 1,
    startIndex,
    endIndex,
  };
}

/**
 * Get pagination links for navigation
 */
export function getPaginationLinks(pagination: PaginationInfo): PaginationLinks {
  return {
    first: 1,
    previous: pagination.hasPrevious ? pagination.page - 1 : null,
    next: pagination.hasNext ? pagination.page + 1 : null,
    last: pagination.totalPages,
  };
}

/**
 * Calculate skip value for database queries
 */
export function getSkipValue(page: number, limit: number): number {
  return (Math.max(1, page) - 1) * Math.max(1, limit);
}

/**
 * Parse pagination params from query string
 */
export function parsePaginationParams(params: {
  page?: string | number;
  limit?: string | number;
}): { page: number; limit: number } {
  const page = typeof params.page === 'string' ? parseInt(params.page, 10) : (params.page || 1);
  const limit = typeof params.limit === 'string' ? parseInt(params.limit, 10) : (params.limit || 10);

  return {
    page: isNaN(page) ? 1 : Math.max(1, page),
    limit: isNaN(limit) ? 10 : Math.max(1, Math.min(100, limit)),
  };
}

/**
 * Generate an array of page numbers for pagination UI
 */
export function getPageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 7
): (number | 'ellipsis')[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [];
  const halfVisible = Math.floor(maxVisible / 2);

  // Always show first page
  pages.push(1);

  let startPage: number;
  let endPage: number;

  if (currentPage <= halfVisible + 1) {
    // Near the beginning
    startPage = 2;
    endPage = maxVisible - 1;
  } else if (currentPage >= totalPages - halfVisible) {
    // Near the end
    startPage = totalPages - maxVisible + 2;
    endPage = totalPages - 1;
  } else {
    // In the middle
    startPage = currentPage - halfVisible + 1;
    endPage = currentPage + halfVisible - 1;
  }

  // Add ellipsis after first page if needed
  if (startPage > 2) {
    pages.push('ellipsis');
  }

  // Add middle pages
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  // Add ellipsis before last page if needed
  if (endPage < totalPages - 1) {
    pages.push('ellipsis');
  }

  // Always show last page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

/**
 * Validate pagination parameters
 */
export function validatePaginationParams(
  page: number,
  limit: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (page < 1) {
    errors.push('Page must be greater than 0');
  }

  if (limit < 1) {
    errors.push('Limit must be greater than 0');
  }

  if (limit > 100) {
    errors.push('Limit cannot exceed 100');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Create pagination metadata for API responses
 */
export function createPaginationMeta(
  total: number,
  page: number,
  limit: number,
  baseUrl?: string
) {
  const pagination = calculatePagination(total, page, limit);
  const links = getPaginationLinks(pagination);

  const meta = {
    pagination: {
      ...pagination,
      links: {
        first: links.first,
        previous: links.previous,
        next: links.next,
        last: links.last,
      },
    },
  };

  // Add URL links if baseUrl provided
  if (baseUrl) {
    const urlLinks = {
      first: `${baseUrl}?page=${links.first}&limit=${limit}`,
      previous: links.previous ? `${baseUrl}?page=${links.previous}&limit=${limit}` : null,
      next: links.next ? `${baseUrl}?page=${links.next}&limit=${limit}` : null,
      last: `${baseUrl}?page=${links.last}&limit=${limit}`,
    };
    (meta.pagination as any).urlLinks = urlLinks;
  }

  return meta;
}
