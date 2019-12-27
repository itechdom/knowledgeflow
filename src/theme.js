import { red } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";

const tertiary = "#1ABCFE";

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: { main: "#000000" },
    secondary: {
      main: "#010101"
    },
    error: {
      main: red.A400
    },
    background: {
      default: "#fff"
    }
  }
});

export default theme;
