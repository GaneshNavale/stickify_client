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
      setDisplayImages(images);
    }
  }, [imageInfo, props]);

  if (!imageInfo || !imageInfo.images || imageInfo.images.length === 0) {
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
            variant="quilted"
            cols={3}
            gap={8}
            sx={{
              width: { xs: "100%", sm: "80%", md: "60%" },
              height: "auto",
              borderRadius: "8px",
            }}
          >
            {displayImages.map((imgSrc, index) => (
              <ImageListItem
                key={imgSrc.url}
                cols={index === 0 ? 2 : 1}
                rows={index === 0 ? 2 : 1}
              >
                <img
                  {...srcset(imgSrc.url, 250)}
                  alt={`Image ${index + 1}`}
                  loading="lazy"
                  style={{
                    borderRadius: 8,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
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
