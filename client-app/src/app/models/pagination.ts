export interface pagination{
    currentPage : number;
    itemPerPage: number;
    totalItems: number;
    totalPages: number;
}

export class PaginatedResult<T> {
    data : T ; 
    pagination : pagination;

    constructor(data : T , pagination : pagination)
    {
        this.data = data;
        this.pagination = pagination;
    }
}

export class PagingPrams {
    pageNumber ;
    pageSize ;
    constructor (pageNumber = 1 , pageSize = 2)
    {
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
    }
}