const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'check-user',
    description: 'Vérifier un utilisateur.',
    category: "<:pinkcrown:843967542472474624> - Propriétaire",
    clientPermissions: ['EMBED_LINKS'],
    args: true,
    guildOnly: true,
    async execute(client, message, args) {

        staff_id = ["378617147858878465", "174076898601598976"];

        if (message.guild.id === "844980247400939591" && staff_id.includes(message.author.id)) {

            let data = await client.db.asyncQuery(`SELECT * FROM fz_users WHERE fz_users_id_user_discord = '${message.channel.name}'`).catch(console.error);

            if (data.length === 0) return message.channel.send({ embed: client.util.errorMsg(message.author.tag, "Profil introuvable.") });

            const mentionUser = await client.users.fetch(message.channel.name);

            if (args[0] === "yes") {

                client.db.query("UPDATE fz_users SET fz_users_checked = ? WHERE fz_users_id_user_discord = ?", [1, message.channel.name], (error, rows) => {
                    if (error) throw error;

                    if (mentionUser) mentionUser.send(
                        new MessageEmbed()
                            .setColor("#f87359")
                            .setTitle("Ton profil a été vérifié avec succès !")
                            .setDescription("Nous te remercions d'avoir patienté et nous espérons que tu te feras des amis ! <:foodiz:835923851418140702>")
                    ).catch(() => message.channel.send({ embed: client.util.errorMsg(message.author.tag, "Désolé, cet utilisateur n'a plus ses messages privés ouverts. Il n'a pas pu être notifié.") }))
                    else message.channel.send({ embed: client.util.errorMsg(message.author.tag, "Désolé, cet utilisateur est introuvable. Il n'a pas pu être notifié.") })

                    message.channel.send({ embed: client.util.successMsg(message.author.tag, "Le profil a été vérifié avec succès !") });
                })

            } else if (args[0] === "no") {

                if (args[0] && !args[1]) return message.channel.send({ embed: client.util.errorMsg(message.author.tag, "Tu dois inscrire une raison.") });

                client.db.query("DELETE FROM fz_users WHERE fz_users_id_user_discord = ?", [message.channel.name], (error, rows) => {
                    if (error) throw error;

                    args.shift();

                    if (mentionUser) mentionUser.send(
                        new MessageEmbed()
                            .setColor("#f87359")
                            .setTitle("Ton profil a malheureusement été refusé.")
                            .setDescription(`**Raison:** ${args.join(" ")}\n\n**Tu peux tout de même tenter de re-créer un profil.**`)
                    ).catch(() => message.channel.send({ embed: client.util.errorMsg(message.author.tag, "Désolé, cet utilisateur n'a plus ses messages privés ouverts. Il n'a pas pu être notifié.") }))
                    else message.channel.send({ embed: client.util.errorMsg(message.author.tag, "Désolé, cet utilisateur est introuvable. Il n'a pas pu être notifié.") })

                    message.channel.send({ embed: client.util.successMsg(message.author.tag, "Le profil a été refusé avec succès !") });
                })

            }


            setTimeout(
                function () {
                    message.channel.delete();
                }, 10000)

        }

    },
};