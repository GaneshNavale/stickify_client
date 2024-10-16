import React from "react";
import {
  Box,
  Button,
  Container,
  Grid2 as Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const HeroBanner = () => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        position: "relative",
        height: "84.5vh",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Container
        maxWidth="xl"
        display="flex"
        sx={{
          display: { sm: "block", md: "none" }, // Hide on small screens
          background: "#ecdfdf",
        }}
      >
        <HeroContaint alignCenter />
      </Container>
      <img
        src={
          isXs
            ? process.env.PUBLIC_URL + "/images/hero_banner.webp"
            : process.env.PUBLIC_URL + "/images/background/HomeBackground.jpg"
        }
        alt="Custom Stickers Background"
        style={{
          position: "absolute",
          width: "100%",
          height: "auto",
          objectFit: "cover",
          zIndex: -1,
        }}
      />
      <Container
        maxWidth="xl"
        sx={{
          display: { xs: "none", sm: "none", md: "block" }, // Hide on small screens
        }}
      >
        <HeroContaint />
      </Container>
    </Box>
  );
};

const HeroContaint = ({ alignCenter }) => (
  <Grid
    container
    spacing={1}
    sx={{
      paddingBottom: { xs: 2, md: 0 },
      paddingTop: { xs: 0, md: 4, lg: 10 },
    }}
  >
    <Grid
      container
      size={{ xs: 12, md: 6 }}
      direction="column"
      sx={{
        alignItems: alignCenter ? "center" : "left",
      }}
    >
      <Grid>
        <Typography
          variant="h1"
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "40px", sm: "45px", md: "70px", lg: "90px" },
          }}
        >
          CUSTOM STICKERS
        </Typography>
      </Grid>
      <Grid>
        <Typography variant="body1" sx={{ fontSize: 18 }}>
          Easy online ordering, 4 day turnaround
        </Typography>
        <Typography variant="body1" sx={{ fontSize: 18 }}>
          and free online proofs. Free shipping
        </Typography>
      </Grid>
      <Grid>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          FOR YOUR CUSTOM NEEDS
        </Typography>
      </Grid>
      <Grid>
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          <Button size="large" variant="contained" sx={{ marginRight: 2 }}>
            Show Now
          </Button>
          <Button
            size="large"
            variant="contained"
            sx={{ backgroundColor: "black" }}
          >
            Get Sample
          </Button>
        </Typography>
      </Grid>
    </Grid>
  </Grid>
);

export default HeroBanner;
