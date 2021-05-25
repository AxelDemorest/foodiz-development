const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'suggestion',
    description: 'Envoyer une suggestion à l\'équipe technique.',
    usage: '<suggestion>',
    args: true,
    category: "<:shield_foodiz:842900862333616150> - Utilitaire",
    clientPermissions: ['EMBED_LINKS', 'USE_EXTERNAL_EMOJIS'],
    async execute(client, message, args) {

        const msg = await client.channels.cache.get("844207071737675858").send(
            new MessageEmbed()
                .setColor("#f87359")
                .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
                .setTitle('Nouvelle suggestion')
                .setDescription(`${args.join(" ")}\n\n<a:B4:836174460637675570> **Serveur:** ${message.guild.name}`)
                .setFooter(`ID: ${message.author.id}`)
                .setTimestamp()
        )

        message.channel.send({ embed: client.util.successMsg(message.author.tag, "Ta suggestion a bien été envoyée!") })

        msg.react("<a:B19:836173992162754580>")
        msg.react("<a:B16:836174140033204254>")
        msg.react("<a:B18:836174002778669067>")
    },
};