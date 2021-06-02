const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'check-modif',
    description: 'Vérifier la modification des profils',
    category: "<:pinkcrown:843967542472474624> • Propriétaire",
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
                            .setDescription("Nous te remercions d'avoir patienté ! <:foodiz:835923851418140702>")
                    ).catch(() => message.channel.send({ embed: client.util.errorMsg(message.author.tag, "Désolé, cet utilisateur n'a plus ses messages privés ouverts. Il n'a pas pu être notifié.") }))
                    else message.channel.send({ embed: client.util.errorMsg(message.author.tag, "Désolé, cet utilisateur est introuvable. Il n'a pas pu être notifié.") })

                    client.infoModif.delete(message.channel.name);

                    message.channel.send({ embed: client.util.successMsg(message.author.tag, "Le profil a été vérifié avec succès !") });
                })

            } else if (args[0] === "no") {

                if (args[0] && !args[1]) return message.channel.send({ embed: client.util.errorMsg(message.author.tag, "Tu dois inscrire une raison.") });

                let data_user = client.infoModif.get(message.channel.name);

                client.db.query("UPDATE fz_users SET fz_users_name = ?, fz_users_naissance_date = ?,fz_users_sexe = ?,fz_users_situation = ?,fz_users_passions = ?,fz_users_description = ?,fz_users_recherche = ?,fz_users_sexual_orientation = ?,fz_users_localisation = ?,fz_users_image = ? WHERE fz_users_id_user_discord = ?", [data_user.name, data_user.naissance, data_user.sexe, data_user.situation, data_user.passions, data_user.description, data_user.recherche, data_user.orientation, data_user.localisation, data_user.image, message.channel.name], (error, rows) => {
                    if (error) throw error;

                    args.shift();

                    if (mentionUser) mentionUser.send(
                        new MessageEmbed()
                            .setColor("#f87359")
                            .setTitle("Tes modifications ont malheureusement été refusés.")
                            .setDescription(`**Raison:** ${args.join(" ")}\n\n**Les informations de ton profil avant la modification ont été remises dessus.**`)
                    ).catch(() => message.channel.send({ embed: client.util.errorMsg(message.author.tag, "Désolé, cet utilisateur n'a plus ses messages privés ouverts. Il n'a pas pu être notifié.") }))
                    else message.channel.send({ embed: client.util.errorMsg(message.author.tag, "Désolé, cet utilisateur est introuvable. Il n'a pas pu être notifié.") })

                    client.infoModif.delete(message.channel.name);

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