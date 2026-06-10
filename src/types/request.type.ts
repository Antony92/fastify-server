export type PaginationQuery = {
	skip?: number;
	limit?: number;
	search?: string;
	order?: 'desc' | 'asc';
	sort?: string;
};

export type IdParam = {
	id: string;
};
