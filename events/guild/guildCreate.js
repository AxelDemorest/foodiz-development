const { MessageEmbed } = require("discord.js");
const moment = require('moment');
moment.locale('fr');

module.exports = {
    name: 'guildCreate',
    execute(guild, client) {

        /* const channel = client.channels.cache.get("846178103293771846");

        if (channel) {
            channel.send(
                new MessageEmbed()
                    .setColor("#f87359")
                    .setTitle("Nouveau serveur !")
                    .setDescription(`<a:B4:836174460637675570> ${client.user} a été ajouté sur un serveur. <a:B13:836174165274394655>`)
                    .addField("Nom du serveur", guild.name)
                    .addField("Nombre de membre", guild.members.cache.size)
                    .addField("Date de création", `\`${moment(guild.createdAt).format('DD MMMM YYYY')}\``)
                    .addField("Owner", client.users.fetch(guild.ownerID))
                    .setThumbnail(guild.iconURL({ dynamic: true, size: 2048, format: 'png' }))
                    .setFooter(`ID : ${guild.id}`)
            )
        } */

    },
};