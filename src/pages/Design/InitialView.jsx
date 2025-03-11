import { Typography, Button, Divider, Grid2 as Grid, Stack } from '@mui/material';

const InitialView = ({ imageUrl, finalArtwork, handleApprove, handleSuggestChanges }) => {
  return (
    <Grid container spacing={2}>
      <Grid item size={{xs:12}}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item size={{xs:12, sm:6}}>
            <Typography variant="h6" align="center" gutterBottom>
              User Uploaded Image
            </Typography>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="User Uploaded"
                style={{
                  width: '100%',
                  maxWidth: '200px',
                  height: 'auto',
                  objectFit: 'cover',
                  display: 'block',
                  margin: '0 auto',
                }}
              />
            )}
          </Grid>
          <Grid item size={{xs:12, sm:6}}>
            <Typography variant="h6" align="center" gutterBottom>
              Final Artwork
            </Typography>
            {finalArtwork && (
              <img
                src={finalArtwork}
                alt="Final Artwork"
                style={{
                  width: '100%',
                  maxWidth: '200px',
                  height: 'auto',
                  objectFit: 'cover',
                  display: 'block',
                  margin: '0 auto',
                }}
              />
            )}
          </Grid>
        </Grid>
      </Grid>

      {/* Divider */}
      <Grid item size={{xs:12}}>
        <Divider />
      </Grid>

      {/* Buttons Section */}
      <Grid item size={{xs:12}}>
        <Grid container justifyContent="flex-end" spacing={2}>
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleApprove}>
              Approve
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="secondary" onClick={handleSuggestChanges}>
              Suggest Changes
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default InitialView;