import { Box, Typography, ImageList, ImageListItem } from "@mui/material";
import { useEffect, useState } from "react";

function srcset(image, size, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format&dpr=2 2x`,
  };
}

const ImageDescription = (props) => {
  const { imageInfo } = props;
  const [displayImages, setDisplayImages] = useState([]);

  useEffect(() => {
    if (imageInfo && imageInfo.images) {
      const images = Object.values(imageInfo.images);
      if (images.length > 3) {
        const shuffledImages = images.sort(() => Math.random() - 0.5);
        setDisplayImages(shuffledImages.slice(0, 3));
      } else {
        setDisplayImages(images);
      }
    }
  }, [imageInfo]);

  if (!imageInfo || !imageInfo.images) {
    return null;
  }

  return (
    <Box
      sx={{
        textAlign: "center",
        alignItems: "center",
        margin: 4,
        marginTop: 2,
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        {imageInfo.title}
      </Typography>

      <Typography variant="body1" sx={{ marginBottom: 4 }}>
        {imageInfo.body}
      </Typography>

      {displayImages.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ImageList
            sx={{
              width: "auto",
              height: "auto",
            }}
            variant="quilted"
            cols={3}
            rowHeight={121}
          >
            {displayImages.map((imgSrc, index) => (
              <ImageListItem key={imgSrc.url} cols={1} rows={1}>
                <img
                  {...srcset(imgSrc.url, 121)}
                  alt={`Image ${index + 1}`}
                  loading="lazy"
                  style={{ borderRadius: 8 }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      )}
    </Box>
  );
};

export default ImageDescription;
