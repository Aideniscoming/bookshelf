import { useState, useEffect } from 'react'
import BookCard from './BookCard';
import styles from './BookCard.module.css'
import { 
  Select, 
  MenuItem,
  Checkbox,
  TextField,
  FormControlLabel,
  FormGroup,
  InputLabel,
  FormControl,
  Button,
  Box,
  IconButton,
  CircularProgress
} from '@mui/material';
import { Search, ChevronLeft, ChevronRight } from '@mui/icons-material';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { useSearch } from "../SearchContext";
import { useLocation } from "react-router-dom";

const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

const BookContainer = () => {
  const {
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
  } = useSearch();
  const navigate = useNavigate();
  const maxResults = 12;
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setOptions({
      ...options,
      [e.target.name]: e.target.checked,
    });
  };

  const searchOptions = () => {
    let q = "";
    if (options.title && searchTerm) q += `intitle:${searchTerm}+`;
    if (options.author && searchTerm) q += `inauthor:${searchTerm}+`;
    if (category) q += `subject:${category}+`;
    if (options.freeOnly) q += `filter=free-ebooks+`;
    if (q.endsWith("+")) q = q.slice(0, -1);

    setQuery(q);
  };

  useEffect(() => {
    if (query) fetchBook(query, startIndex);
  }, [query]);

  const fetchBook = async (query, index = 0) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${index}&maxResults=${maxResults}&key=${import.meta.env.VITE_GOOGLE_BOOKS_API_KEY}`
      );
      const data = await response.json();
      setStartIndex(index);

      const fetchedBooks = data.items?.map((item) => ({
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors,
        description: item.volumeInfo.description || "",
        thumbnail: item.volumeInfo.imageLinks?.thumbnail || "",
        publish: item.volumeInfo.publishedDate,
      })) || [];

      setBooks(fetchedBooks.filter((b) => b.thumbnail && b.description));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const goForward = () => fetchBook(query, startIndex + maxResults);
  const goBackward = () => {
    if (startIndex >= maxResults) fetchBook(query, startIndex - maxResults);
  };

  const BookPageNavigate = (id) => navigate(`/book/${id}`);

  return (
    <Box sx={{ margin: 2, padding: 2, gap: 2 }}>
      {/* Search Section */}
      <Header />
      <Box sx={{ marginBottom: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Enter book name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
        />

        <FormGroup row>
          <FormControlLabel
            control={<Checkbox name="title" checked={options.title} onChange={handleChange} />}
            label="Search by Title"
          />
          <FormControlLabel
            control={<Checkbox name="author" checked={options.author} onChange={handleChange} />}
            label="Search by Author"
          />
          <FormControlLabel
            control={<Checkbox name="freeOnly" checked={options.freeOnly} onChange={handleChange} />}
            label="Free eBooks Only"
          />

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="">Any</MenuItem>
              <MenuItem value="fiction">Fiction</MenuItem>
              <MenuItem value="nonfiction">Non-Fiction</MenuItem>
              <MenuItem value="science">Science</MenuItem>
              <MenuItem value="history">History</MenuItem>
              <MenuItem value="biography">Biography</MenuItem>
              <MenuItem value="fantasy">Fantasy</MenuItem>
              <MenuItem value="mystery">Mystery</MenuItem>
              <MenuItem value="romance">Romance</MenuItem>
              <MenuItem value="horror">Horror</MenuItem>
              <MenuItem value="selfhelp">Self-Help</MenuItem>
              <MenuItem value="health">Health</MenuItem>
              <MenuItem value="travel">Travel</MenuItem>
            </Select>
          </FormControl>
        </FormGroup>

        <Button variant="contained" color="primary" onClick={searchOptions} startIcon={<Search />}>
          Search
        </Button>
      </Box>

      {/* Books Section */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box className={styles.container}>
          {books.map((book) => (
            <BookCard
              onClick={() => BookPageNavigate(book.id)}
              key={book.id}
              title={book.title || "No title available"}
              authors={book.authors || ["Unknown author"]}
              publishedDate={book.publish || "N/A"}
              description={book.description || "No description"}
              image={book.thumbnail || ""}
            />
          ))}
        </Box>
      )}

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, marginTop: 2 }}>
        <IconButton onClick={goBackward} disabled={startIndex === 0}>
          <ChevronLeft />
        </IconButton>
        <IconButton onClick={goForward}>
          <ChevronRight />
        </IconButton>
      </Box>
    </Box>
  );
};

export default BookContainer;

