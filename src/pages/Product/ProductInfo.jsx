import * as API from "../../utils/api";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import VideoDescription from "./VideoDescription";
import ImageDescription from "./ImageDescription";
import { Divider } from "@mui/material";

const ProductInfo = () => {
  const location = useLocation();
  const { product } = location.state || {};
  const [videoDescriptions, setVideoDescriptions] = useState({
    id: 8,
    title: "The Magnificent Earth: Our Blue Planet",
    body: "Earth, often referred to as the 'Blue Planet', is the only known celestial body capable of sustaining life. Covered by vast oceans, lush forests, towering mountains, and expansive deserts, Earth is a dynamic planet filled with diverse ecosystems and a rich history.",
    media_type: "video",
    active: true,
    images: [],
    video: {
      id: 101,
      url: "http://54.84.156.112//rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MTAxLCJwdXIiOiJibG9iX2lkIn19--c56f8ac52f414a25ab2a9cf7953ac57b5075693b/WhatsApp%20Video%202024-10-04%20at%2011.29.21%20AM%20(1).mp4",
    },
    created_at: "04-10-2024",
    updated_at: "04-10-2024",
  });

  const [imageInfo, setImageInfo] = useState({
    id: 14,
    title: "We Want You: Join Our Team!",
    body: "Are you passionate about innovation, creativity, and making an impact? We're looking for talented individuals like you to join our dynamic team! At Amazon, we believe in fostering a collaborative environment where your ideas matter and your skills can thrive.",
    media_type: "image",
    active: true,
    images: [
      {
        id: 111,
        url: "http://54.84.156.112//rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MTExLCJwdXIiOiJibG9iX2lkIn19--153c492ef5e3bb5af5ebba3509c0118397410892/DALL%C2%B7E%202024-10-04%2011.32.05%20-%20A%20'We%20Want%20You'%20poster%20featuring%20Uncle%20Sam%20dressed%20as%20a%20modern-day%20office%20worker,%20but%20this%20time%20without%20his%20traditional%20hat.%20Instead,%20he%20wears%20a%20headb.webp",
      },
      {
        id: 112,
        url: "http://54.84.156.112//rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MTEyLCJwdXIiOiJibG9iX2lkIn19--57bec984bf121b0ff86a23659f3dccd8d9972180/DALL%C2%B7E%202024-10-04%2011.32.05%20-%20A%20'We%20Want%20You'%20poster%20featuring%20Uncle%20Sam%20dressed%20as%20a%20modern-day%20office%20worker,%20but%20this%20time%20without%20his%20traditional%20hat.%20Instead,%20he%20wears%20a%20headb.webp",
      },
      {
        id: 113,
        url: "http://54.84.156.112//rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MTEzLCJwdXIiOiJibG9iX2lkIn19--fa47aceaf9fc525d79c3559282c3f1c6c28cd0c3/WhatsApp%20Image%202024-10-04%20at%2011.29.36%20AM%20(1).jpeg",
      },
      {
        id: 114,
        url: "http://54.84.156.112//rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MTE0LCJwdXIiOiJibG9iX2lkIn19--04cc09b1edbcaadcd84414fd028f7a169e80ab21/WhatsApp%20Image%202024-10-04%20at%2011.29.36%20AM.jpeg",
      },
      {
        id: 115,
        url: "http://54.84.156.112//rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MTE1LCJwdXIiOiJibG9iX2lkIn19--a4db0d64572bb256ff968f48b2b614d7bcb0c194/WhatsApp%20Image%202024-10-04%20at%2011.29.37%20AM.jpeg",
      },
    ],
    video: null,
    created_at: "04-10-2024",
    updated_at: "04-10-2024",
  });

  if (!product) {
    return <Typography variant="h6">Product not found</Typography>;
  }

  return (
    <>
      <Box
        sx={{
          paddingTop: 4,
          backgroundSize: "cover",
          backgroundImage: `url(https://assets.stickermule.com/image/fetch/c_lfill,fl_lossy,f_auto,q_auto:best,w_auto/https%3A%2F%2Fstorage.googleapis.com%2Fsm-content%2Fcore%2Fproducts%2Fproducts%2F317%2Fcover2x)`,
          backgroundPosition: "center",
          height: "100vh",
          display: "flex",
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
        }}
      >
        <Grid
          container
          sx={{
            width: "80%",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
          spacing={2}
        >
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              marginBottom: { xs: 2, md: 0 },
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {product.name}
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 2 }}>
              {product.description}
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 2 }}>
              <Button variant="outlined">Order Sample</Button>
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box></Box>
          </Grid>
        </Grid>
      </Box>
      <Box>
        <Box sx={{ height: "70px" }} />

        <VideoDescription videoData={videoDescriptions} />
        <Divider />
        <ImageDescription imageInfo={imageInfo} />
      </Box>
    </>
  );
};

export default ProductInfo;
