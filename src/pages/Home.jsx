import React from "react";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import Notification from "../utils/notification";

const Home = () => {
  const location = useLocation();
  const [alert, setAlert] = useState({
    message: location.state?.alert?.message,
    type: location.state?.alert?.type,
  });

  return (
    <div>
      <Notification alert={alert} setAlert={setAlert} />

      <h1>This is a Home Page</h1>
    </div>
  );
};

export default Home;
