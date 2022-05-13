const crudService = require("@markab.io/node/crud-service/crud-service");
const socketService = require("@markab.io/node/socket-service/socket-service.js");
const {
  registerAction,
  isPermitted
} = require("@markab.io/node/acl-service/acl-service.js");
const uuidv1 = require("uuid/v1");

const Chat = ({ config, userModel, chatLogModel, server }) => {
  const channel = "chat";
  const onEvent = (eventData, ioServer, socket) => {
    const adminUserId = "5d77d8c6447a14a476ed0c09"; //account is called hello;
    let chat = new chatLogModel({
      text: eventData.text,
      from: eventData.from || adminUserId, //sending chats to admin for now
      to: eventData.to,
      date: new Date()
    });
    chat.save(err => {
      if (err) {
        return console.error(err);
      }
      socket.emit(channel, chat);
      return socket.broadcast.emit(channel, chat);
    });
  };
  const onUpdate = (eventData, ioServer, socket) => {
    let chat = eventData;
    chat.updated = true;
    chatLogModel.findOneAndUpdate(
      { _id: chat._id },
      chat,
      {
        upsert: false,
        new: true
      },
      function(err, chat) {
        if (err) return console.error(err);
        socket.emit(channel, chat);
        return socket.broadcast.emit(channel, chat);
      }
    );
  };
  const onDelete = (eventData, ioServer, socket) => {
    let chat = eventData;
    chat.deleted = true;
    chatLogModel.findOneAndUpdate(
      { _id: chat._id },
      chat,
      {
        upsert: false,
        new: true
      },
      function(err, chat) {
        if (err) return console.error(err);
        socket.emit(channel, chat);
        return socket.broadcast.emit(channel, chat);
      }
    );
  };
  const port = "4001";
  const chatApi = socketService({
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
        isPermitted: isPermitted({ key: "chat_create", user }),
        criteria: {}
      };
    },
    read: (user, req) => {
      return {
        isPermitted: isPermitted({ key: "chat_read", user }),
        criteria: {
          query: {
            $or: [{ from: user._id }, { to: user._id }]
          }
        }
      };
    },
    update: (user, req) => {
      return {
        isPermitted: isPermitted({ key: "chat_update", user }),
        criteria: {}
      };
    },
    del: (user, req) => {
      return {
        isPermitted: isPermitted({ key: "chat_delete", user }),
        criteria: {}
      };
    },
    search: (user, req) => {
      return {
        isPermitted: isPermitted({ key: "chat_search", user }),
        criteria: {}
      };
    }
  };

  const chatLogApi = crudService({ Model: chatLogModel, crudDomainLogic });

  chatLogApi.use("/socket", chatApi);

  return [chatLogApi];
};

module.exports = Chat;
