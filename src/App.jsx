import { Routes, Route } from "react-router-dom";
import BookContainer from "./Component/BookContainer";
import BookPage from "./Component/BookPage";
import { SearchProvider } from "./SearchContext";
function App() {
  return (
    <SearchProvider>
      <Routes>
        <Route path="/" element={<BookContainer />} />
        <Route path="/book/:id" element={<BookPage />} />
      </Routes>
    </SearchProvider>
    
  );
}

export default App;
