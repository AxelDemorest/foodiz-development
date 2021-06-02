const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'verification',
    description: 'Vérification anti-fake du profil.',
    category: "<:account:848292297208234045> • Compte Foodiz",
    clientPermissions: ['EMBED_LINKS'],
    async execute(client, message, args) {

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

        if (!args) {

            message.channel.send(
                new MessageEmbed()
                    .setColor("#f87359")
                    .setTitle("Procédure de vérification anti-fake")
                    .setDescription("*Qu'est-ce que la vérification anti-fake ?*\n\nElle permet d'indiquer à la personne qui verra ton profil que tu es un membre vérifié et que tu n'es pas un fake. Tu accèderas également à divers modules qui seront bientôt proposés par le bot.\n\n*Comment vérifier son profil ?*\n```asciidoc\n* Envoie une photo de ta tête avec le nom du bot sur un papier et ton pseudo discord.\n* Envoie la date de naissance affichée sur ta carte d'idendité, nous te demandons de cacher toutes les autres informations de ta carte.```\nUne fois les informations envoyées, garde tes messages privés ouverts et tu recevras un message quelques temps après disant si tu as été vérifié ou non.\n\nTape la commande `f-verification new` afin de débuter la procédure de vérification.")
            )

        }

        if (args[0] === "new") {

            const { attachments: document_1 } = await awaitMessage(message, (msg => msg.author.id == message.author.id && ((msg.attachments.first() && msg.attachments.first().height) || msg.content.toLowerCase() === "cancel")), 300000, '```asciidoc\n* Envoie une photo de ta tête avec le nom du bot sur un papier et ton pseudo discord.```', "Étape 1/2 - Durée : 5 minutes • 'cancel' pour quitter l'inscription.").catch(() => { });
            if (document_1 === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "La commande a bien été arrêtée.") })
            if (!document_1.first()) return message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, commande annulée.") })

            const { attachments: document_2 } = await awaitMessage(message, (msg => msg.author.id == message.author.id && ((msg.attachments.first() && msg.attachments.first().height) || msg.content.toLowerCase() === "cancel")), 300000, "```asciidoc\n* Envoie la date de naissance affichée sur ta carte d'idendité, nous te demandons de cacher toutes les autres informations de ta carte.```", "Étape 2/2 - Durée : 5 minutes • 'cancel' pour quitter l'inscription.").catch(() => { });
            if (document_2 === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "La commande a bien été arrêtée.") })
            if (!document_2.first()) return message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, commande annulée.") })

            message.channel.send(
                new MessageEmbed()
                    .setColor("#f87359")
                    .setDescription("Tes documents vont être vérifiés par l'équipe technique, tu recevras un message de retour bientôt.")
            )

            const channel = await client.guilds.cache.get("844980247400939591").channels.create(message.author.id, { parent: "847958257603313675" });

            if (channel) {
                channel.send(
                    new MessageEmbed()
                        .setColor("#f87359")
                        .setTitle("Procédure de vérification anti-fake")
                        .addField("Utilisateur", message.author.tag, true)
                        .addField("UtilisateurID", message.author.id, true)
                )

                channel.send(
                    new MessageEmbed()
                        .setColor("#f87359")
                        .setTitle("Document 1/2")
                        .setImage(document_1.first().url)
                )

                channel.send(
                    new MessageEmbed()
                        .setColor("#f87359")
                        .setTitle("Document 2/2")
                        .setImage(document_2.first().url)
                )

                const emojiList = ['<:coche_foodiz:843499669203058688>', '<:close_foodiz:842902717587259392>'];

                const confirmMsg = await channel.send(
                    new MessageEmbed()
                        .setColor("#f87359")
                        .setAuthor("Souhaitez-vous confirmer ce profil ?")
                        .setDescription("<:coche_foodiz:843499669203058688> ・ **Confirmer la vérification**\n<:close_foodiz:842902717587259392> ・ **Refuser la vérification**")
                        .setFooter(message.author.id)
                )

                for (const emoji of emojiList) await confirmMsg.react(emoji);

            }


        }

    },
};