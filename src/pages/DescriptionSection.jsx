import {
  Container,
  Grid2 as Grid,
  Typography,
  CardContent,
} from "@mui/material";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

import VideoPlayer from "../utils/VideoPlayer";

const DescriptionSection = ({ descriptions, videoThumbnail }) => (
  <Container size="lg">
    <Grid container display="flex">
      {(descriptions || []).map((description) =>
        description.media_type === "image" ||
        description.media_type === "none" ? (
          <Grid
            key={description.id}
            container
            spacing={2}
            justifyContent="center"
            justifyItems="center"
          >
            <Grid px={{ xs: 2, md: 2, lg: 3, lx: 4 }}>
              <CardContent>
                <Typography
                  variant="h4"
                  component="div"
                  paddingBottom={2}
                  align="center"
                  color="primary"
                  sx={{ fontWeight: "bold" }}
                >
                  {description.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {description.body}
                </Typography>
              </CardContent>
            </Grid>
            {/* Image List with Quilted Layout */}
            <Grid justifyContent="center" px={{ xs: 2, md: 3, lg: 4, lx: 5 }}>
              <ImageList
                variant="quilted"
                cols={3} // Total 4 columns for quilted layout
                gap={10}
                sx={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "10px",
                }}
              >
                {description.images.map((image, index) => (
                  <ImageListItem
                    key={image.id}
                    cols={index === 0 ? 2 : 1} // 1st image spans 2 columns
                    rows={index === 0 ? 2 : 1} // 1st image spans 2 rows
                  >
                    <img src={image.url} alt={`${image.id}`} loading="lazy" />
                  </ImageListItem>
                ))}
              </ImageList>
            </Grid>
          </Grid>
        ) : (
          <Grid key={description.id} container spacing={1} alignItems="center">
            <Grid
              size={{ xs: 12, md: 6 }}
              paddingLeft={{ xs: 2, md: 3, lg: 4, lx: 5 }}
            >
              <VideoPlayer
                videoSrc={description.video?.url}
                videoThumbnail={videoThumbnail}
              />
            </Grid>
            <Grid
              size={{ xs: 12, md: 6 }}
              paddingRight={{ xs: 2, md: 3, lg: 4, lx: 5 }}
            >
              <CardContent>
                <Typography
                  variant="h4"
                  color="primary"
                  component="div"
                  align="center"
                  sx={{ fontWeight: "bold" }}
                  paddingBottom={2}
                >
                  {description.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {description.body}
                </Typography>
              </CardContent>
            </Grid>
          </Grid>
        )
      )}
    </Grid>
  </Container>
);

export default DescriptionSection;
