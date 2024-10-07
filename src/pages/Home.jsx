import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Notification from "../utils/notification";

const Home = () => {
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
    // removing persisted state to remove alert on page refresh
    window.history.replaceState({}, "");
  }, []);

  return (
    <div>
      <Notification alert={alert} setAlert={setAlert} />

      <h1>This is a Home Page</h1>
    </div>
  );
};

export default Home;
