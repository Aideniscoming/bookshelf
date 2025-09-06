import { createContext, useContext, useState } from "react";

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used inside a SearchProvider");
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);
  const [category, setCategory] = useState("");
  const [options, setOptions] = useState({
    title: false,
    author: false,
    freeOnly: false,
  });
  const [startIndex, setStartIndex] = useState(0);
  const [query, setQuery] = useState("");

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        books,
        setBooks,
        category,
        setCategory,
        options,
        setOptions,
        startIndex,
        setStartIndex,
        query,
        setQuery,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
