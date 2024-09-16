import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

const Home = () => {
  const location = useLocation();
  const [emailMessage, setEmailMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      setEmailMessage(location.state.message);
      setShowAlert(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleClose = () => {
    setShowAlert(false);
  };

  return (
    <div>
      {showAlert && (
        <Stack sx={{ width: "100%", marginTop: "8" }} spacing={4}>
          <Alert
            severity="success"
            onClose={handleClose}
            action={
              <Button color="inherit" size="small" onClick={handleClose}>
                Close
              </Button>
            }
          >
            {emailMessage}
          </Alert>
        </Stack>
      )}

      <h1>This is a Home Page</h1>
    </div>
  );
};

export default Home;
