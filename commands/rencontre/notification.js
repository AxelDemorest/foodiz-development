const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'notification',
    description: 'Gérer les notifications des likes.',
    aliases: ['commands'],
    usage: '[command name]',
    category: '<:conversation_foodiz:842900427381014569> - Rencontre',
	clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS'],
    async execute(client, message, args) {

        let data = await client.db.asyncQuery(
            `SELECT * FROM fz_users WHERE fz_users_id_user_discord = ${message.author.id}`
        ).catch(console.error);

        if(data.length === 0) return message.channel.send({ embed: client.util.errorMsg(message.author.tag, "Tu n'as crée aucun profil.") })

        message.channel.send(
            new MessageEmbed()
                .setColor('#f87359')
                .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
                .setTitle(`Réponds par une des propositions`)
                .setDescription(`**Valeur actuelle:** \`${data[0].fz_users_notification_like}\`\n\n• \`on\` : Activer les notifications de likes. \`(Par défaut)\`\n• \`off\` : Désactiver les notifications de likes.\n\nTu peux annuler en envoyant \`cancel\`.`)
        ).then(msg => {

            msg.channel.awaitMessages(m => m.author.id === message.author.id && (m.content === "on" || m.content === "off" || m.content === "cancel"), { max: 1, time: 60000, errors: ['time'] }).then(collected => {

                if (collected.first().content === "on") {

                    client.db.query("UPDATE fz_users SET fz_users_notification_like = ? WHERE fz_users_id_user_discord = ?", ["on", message.author.id], (error, rows) => {
                        if (error) throw error;

                        message.channel.send({ embed: client.util.successMsg(message.author.tag, "🔔 - Notifications activées.") })
                    });

                } else if (collected.first().content === "off") {

                    client.db.query("UPDATE fz_users SET fz_users_notification_like = ? WHERE fz_users_id_user_discord = ?", ["off", message.author.id], (error, rows) => {
                        if (error) throw error;

                        message.channel.send({ embed: client.util.successMsg(message.author.tag, "🔕 - Notifications désactivées.") })
                    });

                } else if (collected.first().content === "cancel") return message.channel.send({ embed: client.util.successMsg(message.author.tag, "La commande a été annulée.") })

            }).catch(() => {
                message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, commande annulée.") })
            });

        })

    },
};