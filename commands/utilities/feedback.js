const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'feedback',
    description: 'Partager son avis concernant le bot.',
    usage: '<feedback>',
    aliases: ['note'],
    args: true,
    category: "<:shield_foodiz:842900862333616150> - Utilitaire",
    clientPermissions: ['EMBED_LINKS', 'USE_EXTERNAL_EMOJIS'],
    execute(client, message, args) {

        client.channels.cache.get("846799120319512666").send(
            new MessageEmbed()
                .setColor("#f87359")
                .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
                .setTitle('Nouvel avis')
                .setDescription(`${args.join(" ")}\n\n<a:B4:836174460637675570> **Serveur:** ${message.guild.name}`)
                .setFooter(`ID: ${message.author.id}`)
                .setTimestamp()
        )

            message.channel.send({ embed: client.util.successMsg(message.author.tag, "Merci de nous avoir fait part de ton avis, nous le prenons en compte!") })
    },
};