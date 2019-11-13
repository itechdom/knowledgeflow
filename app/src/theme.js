import { red } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: { main: "#9a21f3" },
    secondary: {
      main: "#FFFFFF"
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
