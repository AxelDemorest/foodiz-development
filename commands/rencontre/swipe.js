const { MessageEmbed } = require("discord.js");
const moment = require('moment');

module.exports = {
    name: 'swipe',
    description: 'Générer des utilisateurs pour faire des rencontres.',
    category: "<:conversation_foodiz:842900427381014569> • Rencontre",
    DMOnly: true,
    async execute(client, message, args) {

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        function filterUsers(filter_user, query) {

            filtre = `user =>`;

            const parse = JSON.parse(filter_user);

            let i = 0;

            for (const key in parse) {
                if (i > 0) filtre += ` && `;
                filtre += `user.fz_users_${key} === '${parse[key]}'`;
                i++;
            }

            return query.filter(eval(filtre));
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

        const emojiList = ['<:donotdisturb:842897531465498644>', '<:heart_like:842897531276361778>', '<:close_foodiz:842902717587259392>'];

        const emojiName = ['donotdisturb', 'heart_like', 'close_foodiz'];

        const fruits_recherche = {
            "cerise": "🍒",
            "fraise": "🍓",
            "raisin": "🍇",
            "peche": "🍑",
            "pasteque": "🍉",
            "mangue": "🥭",
        }

        let firstUser = await client.db.asyncQuery(`SELECT * FROM fz_users WHERE fz_users_id_user_discord = ${message.author.id}`).catch(console.error);

        if (firstUser.length === 0) return message.channel.send({ embed: client.util.errorMsg(message.author.tag, "Tu n'as crée aucun profil, tape la commande \`f-manage-profil\`.") });

        if (firstUser[0].fz_users_checked === 0) return message.channel.send({ embed: client.util.errorMsg(message.author.tag, "Ton profil n'a pas encore été vérifié, patiente encore un peu.") });

        let data = await client.db.asyncQuery(
            `SELECT * FROM fz_users WHERE NOT EXISTS
                    (SELECT * FROM fz_swipes 
                        WHERE fz_swipes_id_user_author = '${message.author.id}' AND fz_swipes_id_user_cible = fz_users_id_user_discord) 
                            AND fz_users_id_user_discord != '${message.author.id}' AND fz_users_checked = 1 ORDER BY RAND() LIMIT 1`
        ).catch(console.error);

        if (firstUser[0].fz_users_filters) {

            data = await client.db.asyncQuery(
                `SELECT * FROM fz_users WHERE NOT EXISTS
                        (SELECT * FROM fz_swipes 
                            WHERE fz_swipes_id_user_author = '${message.author.id}' AND fz_swipes_id_user_cible = fz_users_id_user_discord) 
                                AND fz_users_id_user_discord != '${message.author.id}' AND fz_users_checked = 1`
            ).catch(console.error);

            const filterResult = filterUsers(firstUser[0].fz_users_filters, data);

            if (filterResult.length === 0) {
                return message.channel.send({ embed: client.util.errorMsg(message.author.tag, "Il n'y a pas d'utilisateurs correspondants à ton/tes filtre(s), reviens plus tard.") })
            }

            data = [filterResult[Math.floor(Math.random() * filterResult.length)]];

        }

        if (data.length === 0) return message.channel.send({ embed: client.util.errorMsg(message.author.tag, "Il n'y a personne à swipe, reviens plus tard.") })

        const msg = await message.channel.send(
            new MessageEmbed()
                .setColor("#f87359")
                .setTitle(`Profil de ${data[0].fz_users_name} <:foodiz:835923851418140702>`)
                .addField("Prénom", data[0].fz_users_name, true)
                .addField("Âge", `${moment(Date.now()).diff(moment(data[0].fz_users_naissance_date, "DD/MM/YYYY"), 'years')} ans *(${data[0].fz_users_naissance_date})*`, true)
                .addField("Sexe", capitalizeFirstLetter(data[0].fz_users_sexe), true)
                .addField("Situation", capitalizeFirstLetter(data[0].fz_users_situation), true)
                .addField("Recherche", firstUser[0].fz_users_premium === "true" ? fruits_recherche[data[0].fz_users_recherche] : "**Fonctionnalité premium** <:diamond_premium:843067033125126175>", true)
                .addField("Orientation sexuelle", data[0].fz_users_sexual_orientation === "deux" ? "Homme/Femme" : capitalizeFirstLetter(data[0].fz_users_sexual_orientation), true)
                .addField("Localisation", capitalizeFirstLetter(data[0].fz_users_localisation), true)
                .addField("Passion(s)", data[0].fz_users_passions, true)
                .addField("Description", capitalizeFirstLetter(data[0].fz_users_description))
                .setImage(data[0].fz_users_image)
        );

        for (const emoji of emojiList) await msg.react(emoji);

        const collector = msg.createReactionCollector((reaction, user) => user.id === message.author.id && emojiName.includes(reaction.emoji.name), { idle: 180000 });

        collector.on('collect', async reaction => {

            switch (reaction.emoji.name) {
                case "heart_like":
                    const checkLike = await client.db.asyncQuery(`SELECT * FROM fz_swipes WHERE fz_swipes_id_user_author = '${message.author.id}' AND fz_swipes_id_user_cible = '${data[0].fz_users_id_user_discord}' AND fz_swipes_status_swipe = 'like'`).catch(console.error);
                    if (checkLike.length === 0) {
                        await client.db.query("INSERT INTO fz_swipes(fz_swipes_id_user_author, fz_swipes_id_user_cible, fz_swipes_status_swipe) VALUES(?,?,?)", [message.author.id, data[0].fz_users_id_user_discord, "like"], (error, rows) => {
                            if (error) throw error;
                        });
                    }

                    const queryMatch = await client.db.asyncQuery(`SELECT * FROM fz_swipes WHERE fz_swipes_id_user_author = '${data[0].fz_users_id_user_discord}' AND fz_swipes_id_user_cible = '${message.author.id}' AND fz_swipes_status_swipe = 'like'`).catch(console.error);
                    if (queryMatch.length > 0) {
                        checkMatchBetweenUsers(message, firstUser[0], data[0]);
                    } else {
                        if (data[0].fz_users_notification_like === 'on') {
                            let userCibleNotif = await client.users.fetch(data[0].fz_users_id_user_discord);
                            if (userCibleNotif) userCibleNotif.send(
                                new MessageEmbed()
                                    .setColor("#f87359")
                                    .setTitle("Nouveau like ! <:foodiz:835923851418140702>")
                                    .setDescription(`Un utilisateur t'as envoyé un like, utilise la commande \`f-swipe\` pour tenter de découvrir qui est cet utilisateur!\n\n**Premium**: Tu peux également découvrir qui t'as liké en utilisant la commande premium \`f-view-like\`.`)
                            ).catch(() => message.author.send({ embed: client.util.errorMsg(message.author.tag, "Désolé, cet utilisateur n'a plus ses messages privés ouverts. Il n'a pas pu être notifié.") }))
                            else message.author.send({ embed: client.util.errorMsg(message.author.tag, "Désolé, cet utilisateur est introuvable. Il n'a pas pu être notifié.") })
                        }
                    }
                    break;

                case "donotdisturb":
                    const checkDislike = await client.db.asyncQuery(`SELECT * FROM fz_swipes WHERE fz_swipes_id_user_author = '${message.author.id}' AND fz_swipes_id_user_cible = '${data[0].fz_users_id_user_discord}' AND fz_swipes_status_swipe = 'dislike'`).catch(console.error);
                    if (checkDislike.length === 0) {
                        await client.db.query("INSERT INTO fz_swipes(fz_swipes_id_user_author, fz_swipes_id_user_cible, fz_swipes_status_swipe) VALUES(?,?,?)", [message.author.id, data[0].fz_users_id_user_discord, "dislike"], (error, rows) => {
                            if (error) throw error;
                        });
                    }
                    break;

                case "close_foodiz":
                    collector.stop();
                    return msg.edit({ embed: client.util.successMsg(message.author.tag, "Commande quittée avec succès !") });
            }

            data = await client.db.asyncQuery(
                `SELECT * FROM fz_users WHERE NOT EXISTS
                        (SELECT * FROM fz_swipes 
                            WHERE fz_swipes_id_user_author = '${message.author.id}' AND fz_swipes_id_user_cible = fz_users_id_user_discord) 
                                AND fz_users_id_user_discord != '${message.author.id}' AND fz_users_checked = 1 ORDER BY RAND() LIMIT 1`
            ).catch(console.error);

            if (firstUser[0].fz_users_filters) {

                data = await client.db.asyncQuery(
                    `SELECT * FROM fz_users WHERE NOT EXISTS
                            (SELECT * FROM fz_swipes 
                                WHERE fz_swipes_id_user_author = '${message.author.id}' AND fz_swipes_id_user_cible = fz_users_id_user_discord) 
                                    AND fz_users_id_user_discord != '${message.author.id}' AND fz_users_checked = 1`
                ).catch(console.error);

                const filterResult = await filterUsers(firstUser[0].fz_users_filters, data);

                if (filterResult.length === 0) {
                    collector.stop();
                    return msg.edit({ embed: client.util.errorMsg(message.author.tag, "Il n'y a plus d'utilisateurs correspondants à ton/tes filtre(s).") })
                }

                data = [filterResult[Math.floor(Math.random() * filterResult.length)]];

            }

            if (data.length === 0) {
                collector.stop();
                return msg.edit({ embed: client.util.errorMsg(message.author.tag, "Il n'y a plus personne à swipe, reviens plus tard.") })
            }

            msg.edit(
                new MessageEmbed()
                    .setColor("#f87359")
                    .setTitle(`Profil de ${data[0].fz_users_name} <:foodiz:835923851418140702>`)
                    .addField("Prénom", data[0].fz_users_name, true)
                    .addField("Âge", `${moment(Date.now()).diff(moment(data[0].fz_users_naissance_date, "DD/MM/YYYY"), 'years')} ans *(${data[0].fz_users_naissance_date})*`, true)
                    .addField("Sexe", capitalizeFirstLetter(data[0].fz_users_sexe), true)
                    .addField("Situation", capitalizeFirstLetter(data[0].fz_users_situation), true)
                    .addField("Recherche", firstUser[0].fz_users_premium === "true" ? fruits_recherche[data[0].fz_users_recherche] : "**Fonctionnalité premium** <:diamond_premium:843067033125126175>", true)
                    .addField("Orientation sexuelle", data[0].fz_users_sexual_orientation === "deux" ? "Homme/Femme" : capitalizeFirstLetter(data[0].fz_users_sexual_orientation), true)
                    .addField("Localisation", capitalizeFirstLetter(data[0].fz_users_localisation), true)
                    .addField("Passion(s)", data[0].fz_users_passions, true)
                    .addField("Description", capitalizeFirstLetter(data[0].fz_users_description))
                    .setImage(data[0].fz_users_image)
            );

        });

        collector.on('end', collected => {
            message.channel.send({ embed: client.util.errorMsg(message.author.tag, "La commande a été quittée.") })
        });
    },
};