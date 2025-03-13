import { useNavigate } from 'react-router-dom';

import {
  Box,
  Container,
  Grid2 as Grid,
  Rating,
  Typography,
  Breadcrumbs,
  Link,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const CategoryHeader = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = (event, routeTo) => {
    event.preventDefault();
    navigate(routeTo);
  };

  return (
    <Box
      py={3}
      sx={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        bgcolor: 'primary.main',
      }}
    >
      <Container>
        <Box role="presentation" sx={{ mb: 2 }} px={3}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              underline="hover"
              href="/"
              onClick={(e) => handleClick(e, '/')}
              sx={{ color: 'rgb(143, 217, 251) !important' }}
            >
              Home
            </Link>
            <Typography
              color="text.primary"
              sx={{ color: `rgb(255, 255, 255)` }}
            >
              {category.name}
            </Typography>
          </Breadcrumbs>
        </Box>
      </Container>

      <Container size="lg">
        <Grid container spacing={2} alignItems="center" px={3}>
          <Grid item size={{ xs: 12, sm: 9, md: 8 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                color: '#fff',
              }}
            >
              {category.name}
            </Typography>
            <Typography
              sx={{
                color: '#fff',
              }}
            >
              {category.description}
            </Typography>
          </Grid>
          <Grid item size={{ xs: 12, sm: 3, md: 4 }}>
            <Grid
              container
              justifyContent={{ xs: 'center', sm: 'flex-end' }}
              spacing={{ xs: 2, sm: 0, md: 1, lg: 2 }}
            >
              <Grid item>
                <Rating
                  name="text-feedback"
                  value={category.average_rating}
                  readOnly
                  precision={0.5}
                  emptyIcon={
                    <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                  }
                />
              </Grid>
              <Grid item>
                <Typography sx={{ marginBottom: 0.5, color: '#fff' }}>
                  {category.reviews_count} Reviews
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
