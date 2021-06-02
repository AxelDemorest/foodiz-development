const { MessageEmbed } = require("discord.js");
const cooldowns = require('quick.db');
const moment = require('moment');

module.exports = {
    name: 'new-date',
    description: 'Trouve des dates en partagant ton profil.',
    category: "<:conversation_foodiz:842900427381014569> • Rencontre",
    clientPermissions: ['EMBED_LINKS'],
    DMOnly: true,
    async execute(client, message, args) {

        const isCooldown = cooldown(message.author, 'get');

        if (isCooldown) {
            return message.channel.send({ embed: client.util.errorMsg(message.author.tag, `Tu dois attendre **${isCooldown.days}** jour(s), **${isCooldown.hours}** heure(s), **${isCooldown.minutes}** minute(s) et **${isCooldown.seconds}** seconde(s) avant de ré-utiliser la commande.`) });
        } else {
            message.channel.send("Tu n'es pas sous cooldown.");
            cooldown(message.author, 'set');
        }


        function cooldown(user, action) {
            if (!cooldowns instanceof Map) return false;
        
            switch (action) {
                case 'get':
                    const cd = cooldowns.get(user.id);
                    if (!cd || (432000000 - (Date.now() - cd.start) <= 0)) return false;
        
                    const distance = 432000000 - (Date.now() - cd.start),
                            days = Math.floor((distance % (1000 * 60 * 60 * 60 * 24)) / (1000 * 60 * 60 * 24)),
                            hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                            minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                            seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
                    return { days, hours, minutes, seconds }
        
                case 'set':
                    return cooldowns.set(user.id, { start: Date.now() });
            }
        }

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        async function awaitMessage(message, filter, time, text, footer) {
            return new Promise(async (resolve) => {
                const msg = await message.author.send(
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

        let author = await client.db.asyncQuery(`SELECT * FROM fz_users WHERE fz_users_id_user_discord = ${message.author.id}`).catch(console.error);
        if (author.length === 0) return message.channel.send({ embed: client.util.errorMsg(message.author.tag, "Tu n'as crée aucun profil, tape la commande \`f-manage-profil\`.") });
        if (author[0].fz_users_checked === 0) return message.channel.send({ embed: client.util.errorMsg(message.author.tag, "Ton profil n'a pas encore été vérifié, patiente encore un peu.") });
        if (author[0].fz_users_anti_fake === 0) return message.channel.send({ embed: client.util.errorMsg(message.author.tag, "Tu dois être un membre vérifié afin de partager ton profil. Tu peux taper la commande `f-verification`.") });

        if (!args[0]) {
            const { content: continueProfil } = await awaitMessage(message, (msg => msg.author.id == message.author.id && (msg.content.toLowerCase() === "continuer" || msg.content.toLowerCase() === "cancel")), 120000, "En continuant, tu acceptes de partager ton profil dans divers serveurs du bot. Beaucoup d'utilisateurs verront ton profil et choisiront s'ils souhaitent ou non te rencontrer lors d'un date.\n\nLes utilisateurs pourront cliquer sur une réaction si ton profil est intéressant à leurs yeux, si cela arrive, tu recevras un message privé du bot en disant que tel profil souhaite te rencontrer. Tu pourras voir si cette personne a un profil Foodiz ou non.\n\n**Informations partagées:** `Prénom`, `Sexe`, `Localisation`, `Âge`, `Description`, `Image` *(Si souhaité)*.\n\n*Envoie `continuer` si tu souhaites continuer.*", "Durée : 2 minutes • 'cancel' pour quitter la commande.").catch(() => { });
            if (continueProfil === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "La commande a bien été annulée.") })
            if (!continueProfil) return message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, la commande a été quittée.") })

            const arrayShareImage = ["oui", "non", "cancel"]
            const { content: shareImage } = await awaitMessage(message, (msg => msg.author.id == message.author.id && arrayShareImage.includes(msg.content.toLowerCase())), 120000, "Désires-tu ou non partager la photo liée à ton profil ?\n\n`oui` ou `non`", "Durée : 2 minutes • 'cancel' pour quitter la commande.").catch(() => { });
            if (shareImage === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "La commande a bien été annulée.") })
            if (!shareImage) return message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, la commande a été quittée.") })

            const { content: localisation } = await awaitMessage(message, (msg => msg.author.id == message.author.id && msg.content.length < 200), 120000, "Souhaites-tu préciser ta localisation ? Afin que les utilisateurs puissent savoir s'ils sont proche de chez toi\n\n*`skip` pour passer.*", "Durée : 2 minutes • 'cancel' pour quitter la commande.").catch(() => { });
            if (localisation === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "La commande a bien été annulée.") })
            if (!localisation) return message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, la commande a été quittée.") })

            let channelGuilds = await client.db.asyncQuery(`SELECT moduleDate FROM fz_guilds WHERE moduleDate != 'disable'`).catch(console.error);
            let channel;
            for (const value of channelGuilds) {
                channel = client.channels.cache.get(value.moduleDate);

                if (channel) channel.send(
                    new MessageEmbed()
                        .setColor("#f87359")
                        .setTitle(`Profil de ${author[0].fz_users_name} <:foodiz:835923851418140702>`)
                        .addField("Prénom", author[0].fz_users_name, true)
                        .addField("Âge", `${moment(Date.now()).diff(moment(author[0].fz_users_naissance_date, "DD/MM/YYYY"), 'years')} ans *(${author[0].fz_users_naissance_date})*`, true)
                        .addField("Sexe", capitalizeFirstLetter(author[0].fz_users_sexe), true)
                        .addField("Localisation", localisation.toLowerCase() !== "skip" ? capitalizeFirstLetter(localisation) : capitalizeFirstLetter(author[0].fz_users_localisation), true)
                        .addField("Description", capitalizeFirstLetter(author[0].fz_users_description))
                        .setDescription("```diff\n- Attention\nNous vous demandons de réagir aux profils près de chez vous. Si vous ne pouvez pas vous déplacer jusqu'à cette eprsonne, inutile de tenter.```")
                        .setImage(shareImage === "oui" ? author[0].fz_users_image : null)
                        .setFooter(message.author.id)

                ).then(msg => {
                    msg.react("<:notification_heart:842897531301134356>");
                })
            }

            message.channel.send({ embed: client.util.successMsg(message.author.tag, "Ton profil a été partagé avec succès dans les serveurs du bot.") })
        }
    },
};