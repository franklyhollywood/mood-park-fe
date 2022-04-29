import { createContext, useState, useContext } from 'react';

const PaginationContext = createContext();

export const PaginationContextProvider = ({ children }) => {
	const [page, setPage] = useState(0);
	return (
		<PaginationContext.Provider value={{ page, setPage }}>
			{children}
		</PaginationContext.Provider>
	);
};

export const usePagination = () => {
	const context = useContext(PaginationContext);
	if (!context)
		throw new Error(
			'You need to wrap this component in <PaginationContextProvider>'
		);
	return context;
};
