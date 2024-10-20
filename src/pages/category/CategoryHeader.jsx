import {
  Box,
  Container,
  Grid2 as Grid,
  Rating,
  Typography,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

const CategoryHeader = ({ category }) => {
  return (
    <Box
      py={3}
      sx={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        bgcolor: "primary.main",
      }}
    >
      <Container size="lg">
        <Grid container spacing={2} alignItems="center" px={3}>
          <Grid size={{ xs: 12, sm: 9, md: 8 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              {category.name}
            </Typography>

            <Typography
              sx={{
                color: "#fff",
              }}
            >
              {category.description}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 3, md: 4 }}>
            <Grid
              container
              justifyContent={{ xs: "center", sm: "flex-end" }}
              spacing={{ xs: 2, sm: 0, md: 1, lg: 2 }}
            >
              <Grid>
                <Rating
                  name="text-feedback"
                  value={4.5}
                  readOnly
                  precision={0.5}
                  emptyIcon={
                    <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                  }
                />
              </Grid>
              <Grid>
                <Typography sx={{ marginBottom: 0.5, color: "#fff" }}>
                  567 Reviews
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CategoryHeader;
