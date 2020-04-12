import { remote } from "./hosts";
const config = {
  SERVER: {
    host: remote,
    port: "",
    wikipedia: {
      host: "https://en.wikipedia.org/w/api.php",
      port: "",
    },
    wikimedia: {
      host: "https://commons.wikimedia.org/w/api.php",
    },
  },
};
export default config;
