export const searchParamsToQuery = (searchParams: { [key: string]: any }) => {
	const search = new URLSearchParams()
	Object.keys(searchParams)
		.filter((key) => searchParams[key] != null && searchParams[key] != undefined && searchParams[key] !== '')
		.map((key) => search.append(key, searchParams[key].toString()))
	const query = search.toString()
	return query ? `?${query}` : ``
}
