import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Notification from "../utils/notification";
import { Box, Button, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
// import background from "/Images/HomeBackground.jpg";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";

const TruncatedText = ({ text }) => {
  const maxLength = 100;

  return (
    <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
      {text.length > maxLength ? `${text.slice(0, maxLength)}.....` : text}
    </Typography>
  );
};

const SampleSteackers = () => {
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
      <Box
        sx={{
          paddingTop: 4,
          backgroundSize: "cover",
          backgroundImage: "url('images/background/HomeBackground.jpg')",
          backgroundPosition: "center",
          height: "98vh",
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
            // justifyContent: "center",
            // alignItems: "center",
          }}
          spacing={2}
        >
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              marginBottom: { xs: 2, md: 0 },
              marginTop: 4,
            }}
          >
            <Typography
              variant="h1"
              sx={{ fontWeight: "bold", fontSize: "80px" }}
            >
              CUSTOM STICKERS
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              FOR YOUR CUSTOM NEEDS
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 2, fontSize: 18 }}>
              Easy online ordering, 4 day turnaround and free online proots.
              Free shipping
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 2 }}>
              <Button variant="contained" sx={{ marginRight: 2 }}>
                Show Now
              </Button>
              <Button variant="contained" sx={{ backgroundColor: "black" }}>
                Get Sample
              </Button>
            </Typography>
          </Grid>
        </Grid>
      </Box>
      {/* Scrolling Bar */}
      <Box
        sx={{
          overflow: "hidden",
          width: "100%",
          position: "relative",
          height: "50px",
        }}
      >
        <style>{`
        .sliding-bar {
          display: flex;
          animation: slide 30s linear infinite;
          white-space: nowrap;
        }
        @keyframes slide {
          0% {
            transform: translateX(100%); /* Start off the right side */
          }
          90% {
            transform: translateX(-100%); /* Move smoothly to the left */
          }
          91% {
            transform: translateX(100%); /* Jump back to right side quickly */
          }
          100% {
            transform: translateX(100%); /* Hold the position for a brief moment */
          }
        }
      `}</style>
        <Box className="sliding-bar">
          <Divider />
          <Typography sx={{ padding: "0 50px" }}>Made in India</Typography>
          <Typography sx={{ padding: "0 50px" }}>Free Shipping</Typography>
          <Typography sx={{ padding: "0 50px" }}>
            14 Days Return and Exchange
          </Typography>
          <Typography sx={{ padding: "0 50px" }}>Made in India</Typography>
          <Typography sx={{ padding: "0 50px" }}>Free Shipping</Typography>
          <Typography sx={{ padding: "0 50px" }}>
            14 Days Return and Exchange
          </Typography>
        </Box>
      </Box>
      <Divider />

      {/* Video Component Present in SP-29 */}

      {/* Rating Component */}
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
          src="images/review.png"
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

      {/* Movable Trusted By Compony Component */}
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
            src="images/stickitupLogo.png"
            alt="Review"
            style={{ height: "30px", width: "auto" }}
          />
          <img
            src="images/stickitupLogo.png"
            alt="Review"
            style={{ height: "30px", width: "auto" }}
          />
          <img
            src="images/stickitupLogo.png"
            alt="Review"
            style={{ height: "30px", width: "auto" }}
          />
        </Grid>
      </Box>

      {/* Customer Review */}
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
                  Prasad Shelke
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
                  Prasad Shelke
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
            <Card sx={{ height: "335px", padding: 2 }}>
              <CardContent>
                <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                  <TruncatedText
                    text={
                      "Steacker is a fantastic product that really delivers on its promises. The build quality is excellent, and it has made my daily tasks so much easier. However, I wish it had a few more customization options. Overall, I'm satisfied!"
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
                <Typography sx={{ fontWeight: "bold" }}>Ram Kote</Typography>
                <Divider sx={{ width: "100%", marginY: 1 }} />{" "}
                {/* Divider below the name */}
                <Typography sx={{ textAlign: "center", fontWeight: "medium" }}>
                  Frontend Developer
                </Typography>
                <Typography
                  sx={{ textAlign: "center", color: "text.secondary" }}
                >
                  Tech Mahindra
                </Typography>
              </CardActions>
            </Card>
          </Grid>
          <Grid item size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card sx={{ height: "335px", padding: 2 }}>
              <CardContent>
                <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                  <TruncatedText
                    text={
                      "I've been using Steacker for a month now, and I absolutely love it! The design is sleek, and it performs flawlessly. Highly recommend!"
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
                <Typography sx={{ fontWeight: "bold" }}>Mamta</Typography>
                <Divider sx={{ width: "100%", marginY: 1 }} />{" "}
                {/* Divider below the name */}
                <Typography sx={{ textAlign: "center", fontWeight: "medium" }}>
                  Network Engineer
                </Typography>
                <Typography
                  sx={{ textAlign: "center", color: "text.secondary" }}
                >
                  Cisco
                </Typography>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default SampleSteackers;
