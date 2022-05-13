//request any endpoint (for testing)
const axios = require("axios");
const config = require("config");
const makeARequest = (modelName, criteria, model) => {
  let checkedCriteria = criteria ? criteria : {};
  const { query } = checkedCriteria;
  const adminToken = "1234";
  const userToken = "1234";
  const url = `${config.get("server.media")}/${modelName}`;
  let requests = {
    get: query => axios.get(url, { params: { query } }),
    post: query => axios.post(url + "/create", { query, model }),
    put: query => axios.put(url, { query, model }),
    deleteRequest: query =>
      axios.delete(url + `/${model._id}`, { params: { query } })
  };
  Object.keys(requests).map(key => {
    requests[key]()
      .then(data => {
        // console.log("request returned", data);
      })
      .catch(err => console.log(err.response.data));
  });
};

module.exports = makeARequest;
