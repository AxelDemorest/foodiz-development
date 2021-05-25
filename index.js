const fs = require("fs");
const Discord = require("discord.js");
const { token } = require("./config/config.json");
const mysql = require('mysql');
const chalk = require('chalk');
const util = require('./templateMsg.js');

/* const { Structures } = require('discord.js');

Structures.extend('Guild', function(Guild) {
    class BotGuild extends Guild { //on extend la class guild
        constructor(...args) {
            super(...args);

            this.prefix = "d/"; //une propriété que tu ajoute à guild
        }
    }

    return BotGuild;
}); */

const client = new Discord.Client({ ws: { intents: new Discord.Intents(Discord.Intents.ALL) } });
client.commands = new Discord.Collection();
const commandFolders = fs.readdirSync("./commands");
const eventFolders = fs.readdirSync("./events");

client.categories = new Array();

for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.name, command);

    if (command.category) {
      if (!client.categories.includes(command.category)) client.categories.push(command.category)
    }
  }
}
for (const folder of eventFolders) {
  const eventFiles = fs.readdirSync(`./events/${folder}`).filter(file => file.endsWith('.js'));
  for (const file of eventFiles) {
    const event = require(`./events/${folder}/${file}`);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }
}

const db = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "snow",
  password: "nikzebi",
  database: "foodiz",
});

client.db = db;
client.util = util;

db.getConnection(async function (err, con) {
  if (err) {
    console.log(chalk.red('[CLIENT] Unable to connnect to the database'), err);
    process.exit(0);
  }

  const start = Date.now();
  con.ping(function (err) {
    if (err) throw err;
    console.log(chalk.magenta(`[CLIENT] Database connected | latency: ${Math.round(Date.now() - start)}ms`));
  });

  db.asyncQuery = function (query) {
    return new Promise(function (resolve, reject) {
      client.db.query(query, (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  // QUERY : let data = await db.asyncQuery(`requete`).catch(console.error); //
});

db.on('enqueue', function () { console.log(chalk.yellow(`[DB] Waiting for available connection slot`)); });

client.login(token);
