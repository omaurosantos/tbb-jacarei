import { useState, useMemo } from "react";

interface UsePaginationOptions<T> {
  data: T[];
  itemsPerPage?: number;
  searchFields?: (keyof T)[];
  searchQuery?: string;
  dateField?: keyof T;
  filterMonth?: number | null;
  filterYear?: number | null;
}

export function usePagination<T>({
  data,
  itemsPerPage = 10,
  searchFields = [],
  searchQuery = "",
  dateField,
  filterMonth = null,
  filterYear = null,
}: UsePaginationOptions<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    let result = [...data];

    // Search filter
    if (searchQuery && searchFields.length > 0) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) =>
        searchFields.some((field) => {
          const value = item[field];
          return value && String(value).toLowerCase().includes(query);
        })
      );
    }

    // Date filter (month/year)
    if (dateField && (filterMonth !== null || filterYear !== null)) {
      result = result.filter((item) => {
        const dateValue = item[dateField];
        if (!dateValue) return false;
        const date = new Date(String(dateValue) + "T00:00:00");
        const matchMonth = filterMonth === null || date.getMonth() === filterMonth;
        const matchYear = filterYear === null || date.getFullYear() === filterYear;
        return matchMonth && matchYear;
      });
    }

    return result;
  }, [data, searchQuery, searchFields, dateField, filterMonth, filterYear]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, filterMonth, filterYear]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  return {
    currentPage,
    totalPages,
    paginatedData,
    filteredData,
    totalItems: filteredData.length,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}
