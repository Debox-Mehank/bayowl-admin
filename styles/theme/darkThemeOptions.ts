import { indigo } from "@mui/material/colors";
import green from "@mui/material/colors/green";
import { ThemeOptions } from "@mui/material/styles";

const darkThemeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: indigo[300],
    },
    background: { default: "#0B0B1D", paper: "#0B0B1D" },
  },
};

export default darkThemeOptions;
