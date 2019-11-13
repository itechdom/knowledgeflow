import React from "react";
import { geolocated } from "react-geolocated";
import { Paper, AppBar, Toolbar } from "@material-ui/core";
import GoogleMapReact from "google-map-react";
import Autocomplete from "../orbital-templates/Material/_shared/Autocomplete/Autocomplete";
import { compose } from "recompose";
const Marker = ({ text }) => <>{text}</>;
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
    lat: (coords && coords.latitude) || 50,
    lng: (coords && coords.longitude) || 50
  };
  return (
    <Paper style={{ height: "50vh", width: "100%" }} elevation={2}>
      <AppBar
        className={classes.autocompleteContainer}
        position="static"
        color="default"
      >
        <Toolbar>
          <Autocomplete
            inputClassName={classes.autocomplete}
            placeholder={"Where would you like to go ..."}
            onSelect={suggestion => {
              onSearchSelect
                ? onSearchSelect(suggestion)
                : history.push(
                    `/${suggestion.resource}/view/${suggestion._id}`
                  );
            }}
            loadSuggestions={text => {
              let query = {
                [modelKey]: { $regex: event.target.value }
              };
              if (onSearch) {
                return onSearch(query);
              }
              return searchModel(query);
            }}
          />
        </Toolbar>
      </AppBar>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyDBMdHRkDHz3ARxGAxRs4ZkPRTxsiS-9fw" }}
        defaultCenter={position}
        defaultZoom={8}
      >
        <Marker lat={position.lat} lng={position.lng} text="You are here" />
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
