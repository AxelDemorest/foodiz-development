const { MessageEmbed } = require("discord.js");
const chalk = require('chalk');
const moment = require('moment');
moment.locale('fr');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {

        /* 		client.guilds.cache.forEach(guild => {
                    client.db.query("SELECT * FROM guilds WHERE identifiant_guild = ?", [guild.id], async (error, rows) => {
                        if (error) throw error;
                    	
                        guild.prefix = rows[0].prefix_guild;
                    })
                }); */

        client.user.setActivity(`ajouter des commandes`, { type: 'PLAYING' })
/* 
        const channel = client.channels.cache.get("840693678510047243");

        await channel.messages.fetch('840699425482473474'); */

        console.log(chalk.red(`Ready! Le bot ${client.user.tag} est connecté.`));
    },
};