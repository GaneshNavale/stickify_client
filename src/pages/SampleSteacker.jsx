import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Notification from "../utils/notification";
import { Box, Button, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
// import background from "/Images/HomeBackground.jpg";
import Divider from "@mui/material/Divider";

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
          backgroundImage: "url('images/HomeBackground.jpg')",
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
    </div>
  );
};

export default SampleSteackers;
