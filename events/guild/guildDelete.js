const { MessageEmbed } = require("discord.js");
const moment = require('moment');
moment.locale('fr');

module.exports = {
    name: 'guildDelete',
    execute(guild, client) {

        /* const channel = client.channels.cache.get("846178183716012053");

        if (channel) {
            channel.send(
                new MessageEmbed()
                    .setColor("#f87359")
                    .setTitle("Serveur perdu.")
                    .setDescription(`<a:B4:836174460637675570> ${client.user} a été retiré d'un serveur. <a:B13:836174165274394655>`)
                    .addField("Nom du serveur", guild.name)
                    .addField("Nombre de membre", guild.members.cache.size)
                    .addField("Date de création", `\`${moment(guild.createdAt).format('DD MMMM YYYY')}\``)
                    .addField("Owner", client.user.fetch(guild.ownerID))
                    .setThumbnail(guild.iconURL({ dynamic: true, size: 2048, format: 'png' }))
                    .setFooter(`ID : ${guild.id}`)
            )
        } */

    },
};