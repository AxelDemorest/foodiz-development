const { MessageEmbed } = require("discord.js");
const moment = require('moment');

module.exports = {
    name: 'view-like',
    description: 'Afficher un utilisateur qui t\'as liké.',
    aliases: ['vl'],
    category: '<:conversation_foodiz:842900427381014569> - Rencontre',
    DMOnly: true,
    premium: true,
    async execute(client, message, args) {

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        async function checkMatchBetweenUsers(message, userAuthor, userCible) {

            let userCibleUser = await client.users.fetch(userCible.fz_users_id_user_discord);

            userCibleId = userCibleUser.id;

            message.author.send(
                new MessageEmbed()
                    .setColor("#f87359")
                    .setTitle("Nouveau match ! <:foodiz:835923851418140702>")
                    .setDescription(`Bravo ${message.author}, tu as matché avec **${userCibleUser.tag}**, tu peux demander en ami cet utilisateur sur discord et aller discuter.`)
            )

            let objMatchUserAuthor = JSON.parse(userAuthor.fz_users_match) || [];

            objMatchUserAuthor.push(userCibleId);

            let objMatchUserCible = JSON.parse(userCible.fz_users_match) || [];

            objMatchUserCible.push(message.author.id);

            client.db.query("UPDATE fz_users SET fz_users_match = ? WHERE fz_users_id_user_discord = ?", [JSON.stringify(objMatchUserAuthor), message.author.id], (error, rows) => {
                if (error) throw error;

                client.db.query("UPDATE fz_users SET fz_users_match = ? WHERE fz_users_id_user_discord = ?", [JSON.stringify(objMatchUserCible), userCibleId], (error, rows) => {
                    if (error) throw error;
                });
            });

            if (userCibleUser) userCibleUser.send(
                new MessageEmbed()
                    .setColor("#f87359")
                    .setTitle("Nouveau match ! <:foodiz:835923851418140702>")
                    .setDescription(`Bravo ${userCibleUser}, tu as matché avec **${message.author.tag}**, tu peux demander en ami cet utilisateur sur discord et aller discuter.`)
            ).catch(() => message.author.send({ embed: client.util.errorMsg(message.author.tag, "Désolé, cet utilisateur n'a plus ses messages privés ouverts. Il n'a pas pu être notifié.") }))
            else message.author.send({ embed: client.util.errorMsg(message.author.tag, "Désolé, cet utilisateur est introuvable. Il n'a pas pu être notifié.") })
        }

        const fruits_recherche = {
            "cerise": "🍒",
            "fraise": "🍓",
            "raisin": "🍇",
            "peche": "🍑",
            "pasteque": "🍉",
            "mangue": "🥭",
        }

        let user_author = await client.db.asyncQuery(
            `SELECT * FROM fz_users WHERE fz_users_id_user_discord = ${message.author.id}`
        ).catch(console.error);

        if (user_author.length === 0) return message.channel.send({ embed: client.util.errorMsg(message.author.tag, "Tu n'as crée aucun profil, tape la commande \`f-manage-profil\`.") })

        if (user_author[0].fz_users_checked === 0) return message.channel.send({ embed: client.util.errorMsg(message.author.tag, "Ton profil n'a pas encore été vérifié, patiente encore un peu.") })

        let data = await client.db.asyncQuery(
            `SELECT * FROM fz_users WHERE EXISTS
            (SELECT * FROM fz_swipes AS s
                WHERE fz_swipes_id_user_author = fz_users_id_user_discord AND fz_swipes_id_user_cible = '378617147858878465' AND fz_swipes_id_user_author != '378617147858878465' AND fz_swipes_status_swipe = 'like' AND NOT EXISTS 
                 (SELECT * FROM fz_swipes AS sw WHERE fz_swipes_id_user_author = '378617147858878465' AND sw.fz_swipes_id_user_cible = fz_users_id_user_discord
                )) AND fz_users_id_user_discord != '378617147858878465' LIMIT 1`
        ).catch(console.error);

        if (data.length === 0) return message.author.send({ embed: client.util.errorMsg(message.author.tag, "Aucune personne n'a aimé ton profil, réessaye ultérieurement.") })

        if (user_author[0].fz_users_premium === "false" && message.author.id !== "378617147858878465") return message.author.send({ embed: client.util.errorMsg(message.author.tag, "Tu dois avoir acheté la version premium afin d'utiliser cette commande.") })

        const msg = await message.channel.send(
            new MessageEmbed()
                .setColor("#f87359")
                .setTitle(`Profil de ${data[0].fz_users_name} <:foodiz:835923851418140702>`)
                .addField("Prénom", data[0].fz_users_name, true)
                .addField("Âge", `${moment(Date.now()).diff(moment(data[0].fz_users_naissance_date, "DD/MM/YYYY"), 'years')} ans *(${data[0].fz_users_naissance_date})*`, true)
                .addField("Sexe", capitalizeFirstLetter(data[0].fz_users_sexe), true)
                .addField("Situation", capitalizeFirstLetter(data[0].fz_users_situation), true)
                .addField("Recherche", fruits_recherche[data[0].fz_users_recherche], true)
                .addField("Orientation sexuelle", capitalizeFirstLetter(data[0].fz_users_sexual_orientation), true)
                .addField("Localisation", capitalizeFirstLetter(data[0].fz_users_localisation), true)
                .addField("Passion(s)", data[0].fz_users_passions)
                .addField("Description", capitalizeFirstLetter(data[0].fz_users_description))
                .setImage(data[0].fz_users_image)
        );

        await msg.react("<:donotdisturb:842897531465498644>")
        await msg.react("<:heart_like:842897531276361778>")
        await msg.react("<:close_foodiz:842902717587259392>")

        const collector = msg.createReactionCollector((reaction, user) => user.id === message.author.id && (reaction.emoji.id === "842897531465498644" || reaction.emoji.id === "842897531276361778" || reaction.emoji.id === "842902717587259392"), { idle: 180000 });

        collector.on('collect', async reaction => {

            if (reaction.emoji.id === "842902717587259392") {
                collector.stop();
                return msg.edit({ embed: client.util.successMsg(message.author.tag, "Commande quittée avec succès !") })
            }

            if (reaction.emoji.id === "842897531276361778") {

                client.db.query("INSERT INTO fz_swipes(fz_swipes_id_user_author, fz_swipes_id_user_cible, fz_swipes_status_swipe) VALUES(?,?,?)", [message.author.id, data[0].fz_users_id_user_discord, "like"], async (error, rows) => {
                    if (error) throw error;
                });

                checkMatchBetweenUsers(message, user_author[0], data[0]);

                data = await client.db.asyncQuery(
                    `SELECT * FROM fz_users WHERE EXISTS
            (SELECT * FROM fz_swipes AS s
                WHERE fz_swipes_id_user_author = fz_users_id_user_discord AND fz_swipes_id_user_cible = '378617147858878465' AND fz_swipes_id_user_author != '378617147858878465' AND fz_swipes_status_swipe = 'like' AND NOT EXISTS 
                 (SELECT * FROM fz_swipes AS sw WHERE fz_swipes_id_user_author = '378617147858878465' AND sw.fz_swipes_id_user_cible = fz_users_id_user_discord
                )) AND fz_users_id_user_discord != '378617147858878465' LIMIT 1`
                ).catch(console.error);

                if (data.length === 0) {
                    collector.stop();
                    return msg.edit({ embed: client.util.errorMsg(message.author.tag, "Plus aucune personne n'a aimé ton profil, réessaye ultérieurement.") })
                }

                msg.edit(
                    new MessageEmbed()
                        .setColor("#f87359")
                        .setTitle(`Profil de ${data[0].fz_users_name} <:foodiz:835923851418140702>`)
                        .addField("Prénom", data[0].fz_users_name, true)
                        .addField("Âge", `${moment(Date.now()).diff(moment(data[0].fz_users_naissance_date, "DD/MM/YYYY"), 'years')} ans *(${data[0].fz_users_naissance_date})*`, true)
                        .addField("Sexe", capitalizeFirstLetter(data[0].fz_users_sexe), true)
                        .addField("Situation", capitalizeFirstLetter(data[0].fz_users_situation), true)
                        .addField("Recherche", fruits_recherche[data[0].fz_users_recherche], true)
                        .addField("Orientation sexuelle", capitalizeFirstLetter(data[0].fz_users_sexual_orientation), true)
                        .addField("Localisation", capitalizeFirstLetter(data[0].fz_users_localisation), true)
                        .addField("Passion(s)", data[0].fz_users_passions)
                        .addField("Description", capitalizeFirstLetter(data[0].fz_users_description))
                        .setImage(data[0].fz_users_image)
                );
            }
        })

    },
};


/*

SELECT * FROM fz_swipes LEFT JOIN fz_users ON fz_swipes_id_user_author = fz_users_id_user_discord WHERE fz_swipes_id_user_cible = '${message.author.id}' AND fz_swipes_status_swipe = 'like' LIMIT 1

*/