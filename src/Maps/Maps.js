import React from "react";
import { geolocated } from "react-geolocated";
import { Paper, AppBar, Toolbar } from "@material-ui/core";
import GoogleMapReact from "google-map-react";
import Autocomplete from "../orbital-templates/Material/_shared/Autocomplete/Autocomplete";
import { compose } from "recompose";
const Marker = () => <i class="material-icons">store_mall_directory</i>;
const ModelList = ({
  users,
  model,
  rides,
  incoming_rides,
  rides_update,
  rides_delete,
  getModel,
  deleteModel,
  updateModel,
  searchModel,
  rides_media_upload,
  rides_gallery_upload,
  rides_gallery,
  rides_media,
  onDelete,
  user,
  classes,
  form,
  notifications,
  saveNotification,
  removeNotification,
  subscribe,
  channel,
  rides_query,
  publish,
  match,
  history,
  location,
  coords,
  isGeolocationAvailable, // boolean flag indicating that the browser supports the Geolocation API
  isGeolocationEnabled, // boolean flag indicating that the user has allowed the use of the Geolocation API
  positionError, // object with the error returned from the Geolocation API call
  ...rest
}) => {
  const position = {
    lat: (coords && coords.latitude) || "40.4418",
    lng: (coords && coords.longitude) || "80.0004"
  };
  return (
    <Paper style={{ height: "50vh", width: "100%" }} elevation={2}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyDBMdHRkDHz3ARxGAxRs4ZkPRTxsiS-9fw" }}
        defaultCenter={position}
        defaultZoom={8}
      >
        <Marker lat={position.lat} lng={position.lng} />
      </GoogleMapReact>
      {/* <RidePreview
        onCancel={() => console.log("cancelled")}
        onDelete={model => {
          onDelete(model);
        }}
        onMount={() => {
          getModel(rides_query);
        }}
        rides={
          rides &&
          rides
            .filter(({ from, to, deleted }) => {
              return (
                (from === match.params.id && to === user._id && !deleted) ||
                (to === match.params.id && from === user._id && !deleted)
              );
            })
            .sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            )
        }
        form={form}
        to={model}
        incomingChat={
          incoming_rides &&
          incoming_rides.filter(({ from, to, deleted }) => {
            return (
              (from === match.params.id && to === user._id && !deleted) ||
              (to === match.params.id && from === user._id && !deleted)
            );
          })
        }
        subscribe={subscribe}
        publish={publish}
        channel={channel}
        user={user}
        {...rest}
      /> */}
    </Paper>
  );
};

export default compose(
  geolocated({
    positionOptions: {
      enableHighAccuracy: true
    },
    userDecisionTimeout: 5000
  })
)(ModelList);
