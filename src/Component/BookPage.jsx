import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  CircularProgress,
  Chip,
  Stack,
  Button,
  Link
} from "@mui/material";

const BookPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

  const fetchBookDetails = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes/${id}?key=${API_KEY}`
      );
      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      setBook(data);
    } catch (error) {
      console.error('Error fetching book details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchBookDetails(id);
  }, [id]);

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (!book) return <Typography variant="h6" mt={4} textAlign="center">Book not found</Typography>;

  const volumeInfo = book.volumeInfo;
  const saleInfo = book.saleInfo;

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4, px: 2 }}>
      <Card sx={{ display: "flex", flexDirection: "column", gap: 4, p: 3 }}>
        
        {/* Book Cover */}
        {volumeInfo.imageLinks?.thumbnail ? (
          <CardMedia
            component="img"
            image={volumeInfo.imageLinks.thumbnail}
            alt={volumeInfo.title}
            sx={{
              width: { xs: "100%", md: 300 },
              height: 450,
              objectFit: "cover",
              borderRadius: 2,
              boxShadow: 5
            }}
          />
        ) : (
          <Box
            sx={{
              width: { xs: "100%", md: 300 },
              height: 450,
              bgcolor: "grey.300",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 2
            }}
          >
            <Typography>No Image</Typography>
          </Box>
        )}

        {/* Book Details */}
        <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h4" fontWeight="bold">{volumeInfo.title}</Typography>
          
          {volumeInfo.authors && (
            <Typography variant="h6" color="text.secondary">
              Author{volumeInfo.authors.length > 1 ? "s" : ""}: {volumeInfo.authors.join(", ")}
            </Typography>
          )}

          {volumeInfo.publisher && <Typography>Publisher: {volumeInfo.publisher}</Typography>}
          {volumeInfo.publishedDate && <Typography>Published: {volumeInfo.publishedDate}</Typography>}

          {volumeInfo.categories && (
            <Stack direction="row" gap={1} justifyContent={'flex-start'} flexWrap="wrap">
              {volumeInfo.categories.map((cat) => (
                <Chip key={cat} label={cat} size="small" color="primary" />
              ))}
            </Stack>
          )}

          {volumeInfo.pageCount && <Typography>Pages: {volumeInfo.pageCount}</Typography>}
          {volumeInfo.language && <Typography>Language: {volumeInfo.language.toUpperCase()}</Typography>}

          {/* Sale Info */}
          {saleInfo && (
            <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="h6">Sale Info:</Typography>
              <Typography>Saleability: {saleInfo.saleability}</Typography>
              {saleInfo.listPrice && (
                <Typography>Price: {saleInfo.listPrice.amount} {saleInfo.listPrice.currencyCode}</Typography>
              )}
              {saleInfo.isEbook !== undefined && (
                <Typography>eBook: {saleInfo.isEbook ? "Available" : "Not Available"}</Typography>
              )}
              {saleInfo.buyLink && (
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  href={saleInfo.buyLink}
                  target="_blank"
                  rel="noopener"
                >
                  Buy / Preview
                </Button>
              )}
            </Box>
          )}

          {/* Full Description */}
          {volumeInfo.description && (
            <Box
              sx={{
                mt: 2,
                maxHeight: 300,
                overflowY: "auto",
                p: 2,
                border: "1px solid",
                borderColor: "grey.300",
                borderRadius: 1,
                bgcolor: "grey.50"
              }}
              dangerouslySetInnerHTML={{ __html: volumeInfo.description }}
            />
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default BookPage;
