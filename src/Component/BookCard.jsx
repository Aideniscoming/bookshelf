import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
} from "@mui/material";

const BookCard = ({ image, title, authors, publishedDate, description, onClick }) => {
  return (
    <Card sx={{ width: 345, height: 500 }}>
      <CardActionArea onClick={onClick}
                      sx={{ "&:hover": {
                              cursor: "pointer",   // pointer cursor on hover
                              bgcolor: "grey.50"        // optional: add hover shadow
                            } }}>  
        {/* Image */}
        {image ? (
          <CardMedia
            component="img"
            image={image}
            alt={title}
            sx={{
              maxHeight: 300,    // optional: limit height
              width: "100%",     // make it fill horizontally
              objectFit: "contain", // show full image without cropping
              boxShadow: 3,    // add shadow
              py: 2,
                    

            }}
          />
        ) : (
          <Box
            sx={{
              height: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "grey.300",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No Image
            </Typography>
          </Box>
        )}

        {/* Content */}
        <CardContent sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
          <Typography variant="h6" component="div" gutterBottom>
            <strong>{title}</strong>
          </Typography>

          <Typography variant="subtitle2" color="text.secondary">
            by <strong>{authors?.join(", ") || "Unknown Author"}</strong>
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            gutterBottom
          >
            Published: {publishedDate || "N/A"}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {description || "No description available"}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default BookCard;
