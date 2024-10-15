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

const INFO_TEXTS = [
  "Made in India",
  "Free Shipping",
  "14 Days Return and Exchange",
];

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
    </div>
  );
};

export default SampleStickers;
