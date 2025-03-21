
export interface ParamsPayload {
  page?: number;
  limit?: number;
  search?: string;
}

export interface QueryParams<T> {
  page?: number;
  limit?: number;
  search?: string;
  searchFields?: (keyof T)[];
}

export class QueryHelper<T> {
  private data: T[];

  constructor(data: T[]) {
    this.data = data;
  }

  applyQuery(params: QueryParams<T>) {
    let result = [...this.data];

    if (params.search && params.searchFields?.length) {
      result = result.filter((item) =>
        params.searchFields!.some((field) =>
          String(item[field])
            .toLowerCase()
            .includes(params.search!.toLowerCase())
        )
      );
    }

    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const totalCount = result.length;
    const totalPages = Math.ceil(totalCount / limit);
    const adjustedPage = Math.min(page, totalPages);

    return {
      data: result.slice(startIndex, endIndex),
      currentPage: adjustedPage,
      totalPages,
      limit,
      totalCount,
    };
  }
}

