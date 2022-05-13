const i18nService = require("@markab.io/node/i18n-service/i18n-service")
const express = require("express")
const path = require("path")

/* Zee:
  what's happening here? None of the input args are used. 
  What does it mean to localize? 
 */
const Localization = ({ config, userModel }) => {
  const apiRoutes = express.Router();
  let localesPath = path.join(
    __dirname,
    "@markab.io/node/lib/",
    "/services/i18n-service/locales"
  );
  apiRoutes.use("/locales", express.static(localesPath));
  let i18nApi = i18nService();
  return [i18nApi, apiRoutes];
};

module.exports =  Localization;
