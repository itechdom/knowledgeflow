const crudService = require("@markab.io/node/crud-service/crud-service");
const socketService = require("@markab.io/node/socket-service/socket-service.js");
const {
  registerAction,
  isPermitted
} = require("@markab.io/node/acl-service/acl-service.js");
const uuidv1 = require("uuid/v1");

const Game = ({ config, userModel, gameLogModel, server }) => {
  const channel = "game";
  const onEvent = (eventData, ioServer, socket) => {
    let game = new gameLogModel({
      text: eventData.text,
      from: eventData.from || uuidv1(),
      to: eventData.to,
      date: new Date()
    });
    game.save(err => {
      if (err) {
        return console.error(err);
      }
      socket.emit(channel, game);
      return socket.broadcast.emit(channel, game);
    });
  };
  const onUpdate = (eventData, ioServer, socket) => {
    let game = eventData;
    game.updated = true;
    gameLogModel.findOneAndUpdate(
      { _id: game._id },
      game,
      {
        upsert: false,
        new: true
      },
      function(err, game) {
        if (err) return console.error(err);
        socket.emit(channel, game);
        return socket.broadcast.emit(channel, game);
      }
    );
  };
  const onDelete = (eventData, ioServer, socket) => {
    let game = eventData;
    game.deleted = true;
    gameLogModel.findOneAndUpdate(
      { _id: game._id },
      game,
      {
        upsert: false,
        new: true
      },
      function(err, game) {
        if (err) return console.error(err);
        socket.emit(channel, game);
        return socket.broadcast.emit(channel, game);
      }
    );
  };
  // const port = "4003";
  // const gameApi = socketService({
  //   onEvent,
  //   onUpdate,
  //   onDelete,
  //   config,
  //   channel,
  //   port,
  //   server
  // });

  //you can pass domain logic here that prevents the user = doing something based on some domain logic?
  //we can also include ACL (access control list) as part of that domain logic
  let crudDomainLogic = {
    create: (user, req) => {
      //we need to include is permitted in here
      return {
        isPermitted: isPermitted({ key: "game_create", user }),
        criteria: {}
      };
    },
    read: (user, req) => {
      return {
        isPermitted: isPermitted({ key: "game_read", user }),
        criteria: { query: req.query.query && JSON.parse(req.query.query) }
      };
    },
    update: (user, req) => {
      return {
        isPermitted: isPermitted({ key: "game_update", user }),
        criteria: {}
      };
    },
    del: (user, req) => {
      return {
        isPermitted: isPermitted({ key: "game_delete", user }),
        criteria: {}
      };
    },
    search: (user, req) => {
      return {
        isPermitted: isPermitted({ key: "game_search", user }),
        criteria: {}
      };
    }
  };

  const gameLogApi = crudService({ Model: gameLogModel, crudDomainLogic });

  // gameLogApi.use("/socket", gameApi);

  return [gameLogApi];
};

module.exports = Game;
