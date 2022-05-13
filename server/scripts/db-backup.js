const config = require("config");
const { exec } = require("child_process");

exec(
  `mongodump --host Cluster0-shard-0/cluster0-shard-00-00-a3c8j.mongodb.net:27017,cluster0-shard-00-01-a3c8j.mongodb.net:27017,cluster0-shard-00-02-a3c8j.mongodb.net:27017 --ssl --username ${config.get(
    "auth.atlas.user"
  )} --password ${config.get(
    "auth.atlas.pass"
  )} --authenticationDatabase admin --db orbital`,
  (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      console.error(err);
      return;
    }

    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  }
);
