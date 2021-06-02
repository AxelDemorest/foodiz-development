const { MessageEmbed } = require("discord.js");
const moment = require('moment');

module.exports = {
    name: 'messageReactionAdd',
    async execute(reaction, user, client) {

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        async function awaitMessage(message, filter, time, text, footer) {
            return new Promise(async (resolve) => {
                const msg = await message.channel.send(
                    new MessageEmbed()
                        .setColor("#f87359")
                        .setDescription(text)
                        .setFooter(footer)
                );

                try {
                    const thisMsg = await msg.channel.awaitMessages(filter, { max: 1, time: time }).catch(() => { });
                    if (!thisMsg || !thisMsg.first()) resolve({ content: null });

                    resolve(thisMsg.first());
                } catch (err) {
                    resolve({ content: null });
                }
            });
        }

        if (user.bot) return;

        if (reaction.partial) await reaction.fetch().catch(() => { });
        if (reaction.message.partial) await reaction.message.fetch().catch(() => { });

        const message = reaction.message;
        if (message.author.id !== client.user.id) return;
        if (message.channel.type === "dm") return;

        if (message.guild.id === "844980247400939591" && message.channel.id !== "846414743379116072") {

            const { author = null } = message.embeds[0] || null;
            const { footer = null } = message.embeds[0] || null;

            // Vérification anti-fake
            if (footer && message.channel.parentID === "847958257603313675" && author.name === "Souhaitez-vous confirmer ce profil ?") {

                const fetchUser = await client.users.fetch(footer.text);

                message.delete();

                if (reaction.emoji.name === "coche_foodiz") {
                    message.channel.send({ embed: client.util.successMsg(user.tag, "La vérification a été acceptée avec succès !") })

                    if (fetchUser) fetchUser.send(
                        new MessageEmbed()
                            .setColor("#f87359")
                            .setTitle("Vérification anti-fake acceptée.")
                            .setDescription("Tu as passé la vérification anti-fake et ton profil est désormais vérifié. Merci pour ta patience.")
                    ).catch(() => { })

                    client.db.query("UPDATE fz_users SET fz_users_anti_fake = ? WHERE fz_users_id_user_discord = ?", [1, footer.text], (error, rows) => {
                        if (error) throw error;
                    });
                }

                if (reaction.emoji.name === "close_foodiz") {

                    const { content: reason } = await awaitMessage(message, (msg => msg.author.id == user.id), 300000, 'Indique la raison du refus', "Durée : 5 minutes • 'cancel' pour quitter l'inscription.").catch(() => { });
                    if (reason === "cancel") return message.channel.send({ embed: client.util.successMsg(user.tag, "La commande a bien été arrêtée.") })
                    if (!reason) return message.channel.send({ embed: client.util.errorMsg(user.tag, "Temps écoulé, commande annulée.") })

                    message.channel.send({ embed: client.util.successMsg(user.tag, "La vérification a été refusée avec succès !") })

                    if (fetchUser) fetchUser.send(
                        new MessageEmbed()
                            .setColor("#f87359")
                            .setTitle("Vérification anti-fake refusé.")
                            .setDescription(`Tu n'as malheureusement pas passé la vérification anti-fake pour la raison suivante:\n\`\`\`${reason}\`\`\``)
                    ).catch(() => message.channel.send({ embed: client.util.errorMsg(user.tag, "Désolé, cet utilisateur n'a plus ses messages privés ouverts. Il n'a pas pu être notifié.") }))
                    else message.channel.send({ embed: client.util.errorMsg(user.tag, "Désolé, cet utilisateur est introuvable. Il n'a pas pu être notifié.") })
                }

                setTimeout(
                    function () {
                        message.channel.delete();
                    }, 10000)
            }

            // Vérification créations de profils
            if (footer && message.channel.parentID === "844980247400939592") {
                let user = await client.users.fetch(footer.text);
                reaction.users.remove(user.id);

                if (reaction.emoji.name === "🚫") {

                    let { content: reason } = await awaitMessage(message, (msg => msg.author.id == user.id && msg.content.length <= 200), 180000, 'Veuillez indiquer la raison du refus.', '3 minutes').catch(() => { });
                    if (reason === "cancel") return message.channel.send({ embed: client.util.successMsg(user.tag, "Commande annulée.") })
                    if (!reason) return message.channel.send({ embed: client.util.errorMsg(user.tag, "Temps écoulé, commande annulée.") })

                    await client.db.query("DELETE FROM fz_users WHERE fz_users_id_user_discord = ?", [message.channel.name], (error, rows) => {
                        if (error) throw error;
                    });

                    if (user) user.send(
                        new MessageEmbed()
                            .setColor("#f87359")
                            .setTitle("Ton profil a malheureusement été refusé.")
                            .setDescription(`**Raison:** ${reason}\n\n**Tu peux tout de même tenter de re-créer un profil.**`)
                    ).catch(() => { })
                }

                if (reaction.emoji.name === "✅") {
                    client.db.query("UPDATE fz_users SET fz_users_checked = ? WHERE fz_users_id_user_discord = ?", [1, footer.text], (error, rows) => {
                        if (error) throw error;

                        if (user) user.send(
                            new MessageEmbed()
                                .setColor("#f87359")
                                .setTitle("Ton profil a été vérifié avec succès !")
                                .setDescription("Nous te remercions d'avoir patienté et nous espérons que tu te feras des amis ! <:foodiz:835923851418140702>")
                        ).catch(() => { })

                    })
                }

                setTimeout(
                    function () {
                        message.channel.delete();
                    }, 10000)

            }

            // Vérification modifications de profils
            if (footer && message.channel.parentID === "844980247400939593") {
                let user = await client.users.fetch(footer.text);
                reaction.users.remove(user.id);

                if (reaction.emoji.name === "🚫") {

                    let data_user = client.infoModif.get(footer.text);

                    let { content: reason } = await awaitMessage(message, (msg => msg.author.id == user.id && msg.content.length <= 200), 180000, 'Veuillez indiquer la raison du refus.', '3 minutes').catch(() => { });
                    if (reason === "cancel") return message.channel.send({ embed: client.util.successMsg(user.tag, "Commande annulée.") })
                    if (!reason) return message.channel.send({ embed: client.util.errorMsg(user.tag, "Temps écoulé, commande annulée.") })

                    await client.db.query("UPDATE fz_users SET fz_users_name = ?, fz_users_naissance_date = ?,fz_users_sexe = ?,fz_users_situation = ?,fz_users_passions = ?,fz_users_description = ?,fz_users_recherche = ?,fz_users_sexual_orientation = ?,fz_users_localisation = ?,fz_users_image = ? WHERE fz_users_id_user_discord = ?", [data_user.name, data_user.naissance, data_user.sexe, data_user.situation, data_user.passions, data_user.description, data_user.recherche, data_user.orientation, data_user.localisation, data_user.image, message.channel.name], (error, rows) => {
                        if (error) throw error;
                    });

                    if (user) user.send(
                        new MessageEmbed()
                            .setColor("#f87359")
                            .setTitle("Ton profil a malheureusement été refusé.")
                            .setDescription(`**Raison:** ${reason}\n\n**Tes modifications ont été annulées.**`)
                    ).catch(() => { })

                    client.infoModif.delete(footer.text);
                }

                if (reaction.emoji.name === "✅") {

                    client.db.query("UPDATE fz_users SET fz_users_checked = ? WHERE fz_users_id_user_discord = ?", [1, footer.text], (error, rows) => {
                        if (error) throw error;

                        if (user) user.send(
                            new MessageEmbed()
                                .setColor("#f87359")
                                .setTitle("Ton profil a été vérifié avec succès !")
                                .setDescription("Nous te remercions d'avoir patienté ! <:foodiz:835923851418140702>")
                        ).catch(() => { });

                        client.infoModif.delete(footer.text);
                    })
                }

                setTimeout(
                    function () {
                        message.channel.delete();
                    }, 10000)
            }
        }

        let channelGuilds = await client.db.asyncQuery(`SELECT moduleDate FROM fz_guilds WHERE moduleDate != 'disable'`).catch(console.error);
        const { footer = null } = message.embeds[0] || null;

        for (const value of channelGuilds) {
            if (value.moduleDate === message.channel.id) {
                if (reaction.emoji.id === "842897531301134356") {
                    reaction.users.remove(user.id);

                    let author = await client.db.asyncQuery(`SELECT * FROM fz_users WHERE fz_users_id_user_discord = ${footer.text}`).catch(console.error);
                    let userReaction = await client.db.asyncQuery(`SELECT * FROM fz_users WHERE fz_users_id_user_discord = ${user.id}`).catch(console.error);
                    if (userReaction.length === 0) return user.send({ embed: client.util.successMsg(user.tag, "Tu dois créer ton profil Foodiz avec la commande `f-manage-profil`.") }).catch(() => { });
                    if (author.length === 0) return user.send({ embed: client.util.successMsg(user.tag, "Cet utilisateur a supprimé son profil.") }).catch(() => { });

                    const parseDates = JSON.parse(author[0].fz_users_dates) || [];
                    if (!parseDates.includes(user.id) && user.id !== footer.text) {
                        parseDates.push(user.id);
                        await client.db.query("UPDATE fz_users SET fz_users_dates = ? WHERE fz_users_id_user_discord = ?", [JSON.stringify(parseDates), footer.text], (error, rows) => {
                            if (error) throw error;
                        });

                        let userAuthor = await client.users.fetch(footer.text);
                        if (userAuthor) {
                            userAuthor.send(
                                new MessageEmbed()
                                    .setColor("#f87359")
                                    .setTitle("Nouvelle demande de date ! <:foodiz:835923851418140702>")
                                    .setDescription(`**${user.tag}** est intéressé par ton profil et souhaite un date, tu peux demander en ami cette personne si tu souhaites poursuivre avec elle.`)
                            ).catch(() => { });

                            userAuthor.send(
                                new MessageEmbed()
                                    .setColor("#f87359")
                                    .setTitle(`Profil Foodiz de ${user.tag}`)
                                    .setColor("#f87359")
                                    .addField("Prénom", userReaction[0].fz_users_name, true)
                                    .addField("Âge", `${moment(Date.now()).diff(moment(userReaction[0].fz_users_naissance_date, "DD/MM/YYYY"), 'years')} ans *(${userReaction[0].fz_users_naissance_date})*`, true)
                                    .addField("Sexe", capitalizeFirstLetter(userReaction[0].fz_users_sexe), true)
                                    .addField("Orientation sexuelle", userReaction[0].fz_users_sexual_orientation === "deux" ? "Homme/Femme" : capitalizeFirstLetter(userReaction[0].fz_users_sexual_orientation), true)
                                    .addField("Localisation", capitalizeFirstLetter(userReaction[0].fz_users_localisation), true)
                                    .addField("Description", capitalizeFirstLetter(userReaction[0].fz_users_description))
                                    .setImage(userReaction[0].fz_users_image)
                            ).catch(() => { });
                        }
                    }
                }
                break;
            }
        }



    },
};