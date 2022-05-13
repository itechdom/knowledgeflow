const config = require("config");
const googleMapsClient = require('@google/maps').createClient({
    key: config.get("auth.google.mapsApiKey")
});
module.exports.findPlace = function(query) {
    return new Promise((resolve, reject) => {
        googleMapsClient.places({ query: query.name }, (err, response) => {
            if (!err) {
                return resolve(response.json);
            }
            return reject(err);
        })
    })
}
module.exports.getPlaceDetails = function(placeid) {
    return new Promise((resolve, reject) => {
        googleMapsClient.place({ placeid }, (err, res) => {
            if (!err) {
                console.log("PLACE DETAILS", res);
                return resolve(res.json);
            }
            return reject(err)
        })
    })
}
