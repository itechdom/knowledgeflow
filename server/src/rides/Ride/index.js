const crudService = require("@markab.io/node/crud-service/crud-service");
const socketService = require("@markab.io/node/socket-service/socket-service.js");
const {
  registerAction,
  isPermitted
} = require("@markab.io/node/acl-service/acl-service.js");

const Ride = ({ config, userModel, rideLogModel, server }) => {
  const channel = "rides";
  const onEvent = (eventData, ioServer, socket) => {
    const {
      to,
      pickupLat,
      pickupLong,
      dropoffLat,
      dropoffLong,
      distance,
      price
    } = require(eventData);
    const data = {
      to,
      pickupLat,
      pickupLong,
      dropoffLat,
      dropoffLong,
      distance,
      price
    };
    let ride = new rideLogModel({
      ...data,
      date: new Date()
    });
    ride.save(err => {
      if (err) {
        console.error(err);
        return socket.emit("error", err);
      }
      socket.emit(channel, ride);
      return socket.broadcast.emit(channel, ride);
    });
  };
  const onUpdate = (eventData, ioServer, socket) => {
    let ride = eventData;
    ride.updated = true;
    rideLogModel.findOneAndUpdate(
      { _id: ride._id },
      ride,
      {
        upsert: false,
        new: true
      },
      function(err, ride) {
        if (err) return console.error(err);
        socket.emit(channel, ride);
        return socket.broadcast.emit(channel, ride);
      }
    );
  };
  const onDelete = (eventData, ioServer, socket) => {
    let ride = eventData;
    ride.deleted = true;
    rideLogModel.findOneAndUpdate(
      { _id: ride._id },
      ride,
      {
        upsert: false,
        new: true
      },
      function(err, ride) {
        if (err) return console.error(err);
        socket.emit(channel, ride);
        return socket.broadcast.emit(channel, ride);
      }
    );
  };
  const port = 4002;
  const rideApi = socketService({
    onEvent,
    onUpdate,
    onDelete,
    config,
    channel,
    port,
    server
  });

  //you can pass domain logic here that prevents the user = doing something based on some domain logic?
  //we can also include ACL (access control list) as part of that domain logic
  let crudDomainLogic = {
    create: (user, req) => {
      //we need to include is permitted in here
      return {
        isPermitted: isPermitted({ key: "ride_create", user }),
        criteria: {}
      };
    },
    read: (user, req) => {
      return {
        isPermitted: isPermitted({ key: "ride_read", user }),
        criteria: { query: req.query.query && JSON.parse(req.query.query) }
      };
    },
    update: (user, req) => {
      return {
        isPermitted: isPermitted({ key: "ride_update", user }),
        criteria: {}
      };
    },
    del: (user, req) => {
      return {
        isPermitted: isPermitted({ key: "ride_delete", user }),
        criteria: {}
      };
    },
    search: (user, req) => {
      return {
        isPermitted: isPermitted({ key: "ride_search", user }),
        criteria: {}
      };
    }
  };

  const rideLogApi = crudService({ Model: rideLogModel, crudDomainLogic });

  rideLogApi.use("/socket", rideApi);

  return [rideLogApi];
};

module.exports = Ride;
