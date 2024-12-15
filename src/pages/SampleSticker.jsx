import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Notification from "../utils/notification";
import { Box, Button, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import HeroBanner from "./HeroBanner";

const TruncatedText = ({ text }) => {
  const maxLength = 100;

  return (
    <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
      {text.length > maxLength ? `${text.slice(0, maxLength)}.....` : text}
    </Typography>
  );
};

const ReviewCard = React.memo(({ name, title, company, review }) => (
  <Card sx={{ height: "335px", padding: 2 }}>
    <CardContent>
      <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
        <TruncatedText text={review} />
      </Typography>
    </CardContent>
    <CardActions
      sx={{
        justifyContent: "center",
        alignItems: "center",
        margin: 2,
        flexDirection: "column",
      }}
    >
      <Typography sx={{ fontWeight: "bold" }}>{name}</Typography>
      <Divider sx={{ width: "100%", marginY: 1 }} />
      <Typography sx={{ textAlign: "center", fontWeight: "medium" }}>
        {title}
      </Typography>
      <Typography sx={{ textAlign: "center", color: "text.secondary" }}>
        {company}
      </Typography>
    </CardActions>
  </Card>
));

const SampleStickers = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getQueryParams = (search) => {
    return new URLSearchParams(search);
  };

  const queryParams = getQueryParams(location.search);
  const accountConfirmationSuccess = queryParams.get(
    "account_confirmation_success"
  );

  const [alert, setAlert] = useState({
    message: location.state?.alert?.message,
    type: location.state?.alert?.type,
  });

  useEffect(() => {
    if (accountConfirmationSuccess) {
      navigate("/sign_in", {
        replace: true,
        state: {
          alert: {
            message:
              "Your email has been successfully confirmed! You can now log in to your account.",
            type: "success",
          },
        },
      });
    }
  }, [accountConfirmationSuccess, navigate]);

  useEffect(() => {
    window.history.replaceState({}, "");
  }, []);

  return (
    <div>
      <Notification alert={alert} setAlert={setAlert} />
      <HeroBanner />
      <Box
        sx={{
          display: "flex",
          padding: 3,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={process.env.PUBLIC_URL + "/review.png"}
          alt="Review"
          style={{ height: "auto", width: "auto" }}
        />
        <Typography sx={{ fontWeight: "light", paddingBottom: 3 }}>
          Reviews
        </Typography>
        <Typography variant="h7" sx={{ fontWeight: "bold", paddingBottom: 3 }}>
          MORE THAN 3 LAKH НАРРУ CUSTOMERS
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          padding: 3,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography sx={{ paddingBottom: 4 }}>
          <Button
            variant="contained"
            sx={{
              borderRadius: "12px 12px 0 0",
              fontSize: "15px",
            }}
          >
            Trusted By
          </Button>
        </Typography>
        <Grid container spacing={2}>
          <img
            src={process.env.PUBLIC_URL + "/logo.png"}
            alt="Review"
            style={{ height: "30px", width: "auto" }}
          />
          <img
            src={process.env.PUBLIC_URL + "/logo.png"}
            alt="Review"
            style={{ height: "30px", width: "auto" }}
          />
          <img
            src={process.env.PUBLIC_URL + "/logo.png"}
            alt="Review"
            style={{ height: "30px", width: "auto" }}
          />
        </Grid>
      </Box>

      <Box
        sx={{
          padding: 3,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "primary.main",
          height: "auto",
          display: "flex",
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", paddingBottom: 3 }}>
          What our customers has to say
        </Typography>
        <Grid
          container
          spacing={4}
          sx={{ justifyContent: "center", maxWidth: "1200px" }}
        >
          {/* size={{ lg: 3, md: 6, sm: 12 }} */}
          <Grid item size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card sx={{ height: "335px", padding: 2 }}>
              <CardContent>
                <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                  <TruncatedText
                    text={
                      "The concept is great, but I faced some connectivity issues. Hoping for a firmware update to fix this."
                    }
                  />
                </Typography>
              </CardContent>
              <CardActions
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  margin: 2,
                  flexDirection: "column", // Stack items vertically
                }}
              >
                <Typography sx={{ fontWeight: "bold" }}>
                  Ganesh Navale
                </Typography>
                <Divider sx={{ width: "100%", marginY: 1 }} />{" "}
                {/* Divider below the name */}
                <Typography sx={{ textAlign: "center", fontWeight: "medium" }}>
                  Software Engineer
                </Typography>
                <Typography
                  sx={{ textAlign: "center", color: "text.secondary" }}
                >
                  Google
                </Typography>
              </CardActions>
            </Card>
          </Grid>
          <Grid item size={{ xs: 12, sm: 6, lg: 3 }}>
            <ReviewCard
              name="Full Name"
              title="Software Engineer"
              company="Abc, Inc"
              review="The concept is great, but I faced some connectivity issues. Hoping for a firmware update to fix this."
            />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6, lg: 3 }}>
            <ReviewCard
              name="Full Name"
              title="Frontend Developer"
              company="Xyz Pvt Ltd"
              review="Steacker is a fantastic product that really delivers on its promises. The build quality is excellent, and it has made my daily tasks so much easier. However, I wish it had a few more customization options. Overall, I'm satisfied!"
            />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6, lg: 3 }}>
            <ReviewCard
              name="Full Name"
              title="Network Engineer"
              company="Info tech."
              review="I've been using Steacker for a month now, and I absolutely love it! The design is sleek, and it performs flawlessly. Highly recommend!"
            />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default SampleStickers;
