import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import CopyrightIcon from "@mui/icons-material/Copyright";

function Copyright() {
  return (
    <Typography variant="body1" color="text.secondary" align="center">
      Copyright
      <CopyrightIcon
        fontSize="small"
        style={{
          verticalAlign: "middle",
          marginLeft: "3px",
        }}
      />{" "}
      {new Date().getFullYear()}{" "}
      <Link underline="none" color="#006ce5" href="/">
        Stickify
      </Link>
      {"."}
    </Typography>
  );
}

export default Copyright;
