import React from "react";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Notification from "../utils/notification";

const Home = () => {
  const location = useLocation();
  const [alert, setAlert] = useState({
    message: location.state?.alert?.message,
    type: location.state?.alert?.type,
  });

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
