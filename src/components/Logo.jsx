import { Box } from "@mui/material";

const Logo = () => (
  <Box sx={{ my: 2, display: "flex", alignItems: "center" }}>
    <img
      src={process.env.PUBLIC_URL + "logo.png"}
      alt="Logo"
      style={{ height: "30px", width: "auto" }}
    />
  </Box>
);

export default Logo;
