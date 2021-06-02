const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'date',
    description: 'Configurer le module de dating sur le serveur.',
    category: "<:settings:849565785709871104> • Administration",
    clientPermissions: ['EMBED_LINKS'],
    guildOnly: true,
    async execute(client, message, args) {

        let array0 = ["set", "disable"];
        if (!args[0] || !array0.includes(args[0])) return message.channel.send({ embed: client.util.errorMsg(message.author.tag, `Premier argument incorrect.\n\n**Exemples:**\n\`\`\`date set #channel\ndate enable\ndate disable\`\`\``) });

        let data = await client.db.asyncQuery(`SELECT * FROM fz_guilds WHERE idGuild = '${message.guild.id}'`).catch(console.error);

        const channel = message.guild.channels.cache.get(args[1]) || message.mentions.channels.first();
        if (args[0] === "set") {
            if (channel) {
                message.channel.send({ embed: client.util.successMsg(message.author.tag, `Le module date a été activé avec succès dans le salon ${channel}.`) });

                if (data.length === 0) {
                    await client.db.query("INSERT INTO fz_guilds(idGuild, moduleDate) VALUES(?,?)", [message.guild.id, channel.id], (error, rows) => {
                        if (error) throw error;
                    });
                } else {
                    await client.db.query("UPDATE fz_guilds SET moduleDate = ? WHERE idGuild = ?", [channel.id, message.guild.id], (error, rows) => {
                        if (error) throw error;
                    });
                }
            } else return message.channel.send({ embed: client.util.errorMsg(message.author.tag, `Tu dois indiquer le channel à utiliser pour ce module.\n\n**Exemples:**\n\`\`\`date set #channel\ndate enable\ndate disable\`\`\``) });
        }

        if (args[0] === "disable") {

            if (data.length === 0) {
                await client.db.query("INSERT INTO fz_guilds(idGuild, moduleDate) VALUES(?,?)", [message.guild.id, "disable"], (error, rows) => {
                    if (error) throw error;
                });
            } else {
                await client.db.query("UPDATE fz_guilds SET moduleDate = ? WHERE idGuild = ?", ["disable", message.guild.id], (error, rows) => {
                    if (error) throw error;
                });
            }
            message.channel.send({ embed: client.util.successMsg(message.author.tag, "Le module date a été désactivé avec succès.") });
        }

    },
};