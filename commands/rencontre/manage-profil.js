const { MessageEmbed } = require("discord.js");
const moment = require('moment');

module.exports = {
    name: 'manage-profil',
    description: 'Gérer son profil Foodiz.',
    aliases: ['commands'],
    usage: '[command name]',
    category: "<:conversation_foodiz:842900427381014569> - Rencontre",
	clientPermissions: ['EMBED_LINKS', 'USE_EXTERNAL_EMOJIS'],
    execute(client, message, args) {

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        message.author.send(
            new MessageEmbed()
                .setColor("#f87359")
                .setTitle("Gestion du profil <:foodiz:835923851418140702>")
                .setDescription(`Bonjour ${message.author}, grâce à cette commande, tu as accès à la gestion de ton profil, tu as 3 options disponibles :\n\n<:user_create:843444506904231977> : **Créer ton profil** \n\n<:edit:843444506921140225> : **Modifier ton profil**\n\n<:trash_user:843445062330875914> : **Supprimer ton profil**\n\n*Choisis la réaction qui correspond.*`)
                .setFooter("Durée : 60 secondes")

        ).then(msg_choice => {

            msg_choice.react("<:user_create:843444506904231977>")
            msg_choice.react("<:edit:843444506921140225>")
            msg_choice.react("<:trash_user:843445062330875914>")

            msg_choice.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.id == '843444506904231977' || reaction.emoji.id == '843444506921140225' || reaction.emoji.id == '843445062330875914'),
                { max: 1, time: 60000, errors: ['time'] }).then(collected => {

                    if (collected.first().emoji.id === "843444506904231977") {

                        client.db.query("SELECT fz_users_id_user_discord FROM fz_users WHERE fz_users_id_user_discord = ?", [message.author.id], (error, rows) => {
                            if (error) throw error;

                            if (rows.length > 0) return message.author.send({ embed: client.util.successMsg(message.author.tag, "Tu as déjà crée ton profil.") })

                            message.author.send(
                                new MessageEmbed()
                                    .setColor("#f87359")
                                    .setTitle("Introduction <:foodiz:835923851418140702>")
                                    .setDescription(`Bonjour **${message.author.username}**, je me présente, je suis **FoodizBot**, le bot qui compte t'aider dans tes recherches de relations. Je suis heureux que tu nous aies choisi !\n\nBon ! Pour commencer nous allons te créer un profil, réponds aux questions qui vont suivre et je t'expliquerai ce que tu pourras faire avec ce profil.\n\n**Clique sur la réaction ci-dessous pour débuter ton inscription.** <:A20:836174502936576031>`)
                                    .setFooter("Durée : 60 secondes")

                            ).then(msg_intro => {

                                msg_intro.react("<a:B1:836174636592660500>")

                                msg_intro.awaitReactions((reaction, user) => user.id == message.author.id && reaction.emoji.id == '836174636592660500',
                                    { max: 1, time: 60000, errors: ['time'] }).then(() => {

                                        message.author.send(
                                            new MessageEmbed()
                                                .setColor("#f87359")
                                                .setDescription("<a:B4:836174460637675570> Quel est ton prénom ? *(50 caractères maximum)*")
                                                .setFooter("Durée : 60 secondes • 'cancel' pour quitter l'inscription.")
                                        )

                                            .then(msg_name => {

                                                msg_name.channel.awaitMessages(m => m.author.id == message.author.id && m.content.length <= 50,
                                                    { max: 1, time: 60000, errors: ['time'] }).then(name => {

                                                        if (name.first().content.toLowerCase() === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "L'inscription a bien été arrêtée.") })

                                                        message.author.send(
                                                            new MessageEmbed()
                                                                .setColor("#f87359")
                                                                .setDescription("<a:B4:836174460637675570> Quelle est ta date de naissance ?\n\n*La date de naissance doit être écrite sous la forme* \`jour/mois/année\`.")
                                                                .setFooter("Durée : 60 secondes • 'cancel' pour quitter l'inscription.")

                                                        ).then(msg_age => {

                                                            msg_age.channel.awaitMessages(m => m.author.id == message.author.id && (m.content.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/) || m.content.toLowerCase() === "cancel"),
                                                                { max: 1, time: 60000, errors: ['time'] }).then(date_naissance => {

                                                                    if (date_naissance.first().content.toLowerCase() === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "L'inscription a bien été arrêtée.") })

                                                                    message.author.send(
                                                                        new MessageEmbed()
                                                                            .setColor("#f87359")
                                                                            .setDescription("<a:B4:836174460637675570> Quelle est ton sexe ?\n\nOptions : \`homme\` | \`femme\` | \`non binaire\` | \`transgenre\`")
                                                                            .setFooter("Durée : 60 secondes • 'cancel' pour quitter l'inscription.")

                                                                    ).then(msg_sexe => {

                                                                        msg_sexe.channel.awaitMessages(m => m.author.id == message.author.id && (m.content.toLowerCase() === "homme" || m.content.toLowerCase() === "femme" || m.content.toLowerCase() === "non binaire" || m.content.toLowerCase() === "transgenre" || m.content.toLowerCase() === "cancel"),
                                                                            { max: 1, time: 60000, errors: ['time'] }).then(sexe => {

                                                                                if (sexe.first().content.toLowerCase() === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "L'inscription a bien été arrêtée.") })

                                                                                message.author.send(
                                                                                    new MessageEmbed()
                                                                                        .setColor("#f87359")
                                                                                        .setDescription("<a:B4:836174460637675570> Quel est ta situation actuelle ?\n\nOptions : \`célibataire\` | \`relation libre\` | \`crush\` | \`couple\`")
                                                                                        .setFooter("Durée : 60 secondes • 'cancel' pour quitter l'inscription.")

                                                                                ).then(msg_situation => {

                                                                                    msg_situation.channel.awaitMessages(m => m.author.id == message.author.id && (m.content.toLowerCase() === "couple" || m.content.toLowerCase() === "célibataire" || m.content.toLowerCase() === "relation libre" || m.content.toLowerCase() === "crush" || m.content.toLowerCase() === "cancel"),
                                                                                        { max: 1, time: 60000, errors: ['time'] }).then(situation => {

                                                                                            if (situation.first().content.toLowerCase() === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "L'inscription a bien été arrêtée.") })

                                                                                            message.author.send(
                                                                                                new MessageEmbed()
                                                                                                    .setColor("#f87359")
                                                                                                    .setDescription("<a:B4:836174460637675570> Quels sont tes centres d'intérêts ? *(5 centres d'intérêts maximum)*\n\n*Tu dois les lister sous forme 'football, musique, musculation'*")
                                                                                                    .setFooter("Durée : 2 minutes • 'cancel' pour quitter l'inscription.")

                                                                                            ).then(msg_centre_interet => {

                                                                                                msg_centre_interet.channel.awaitMessages(m => m.author.id == message.author.id && (m.content.match(/(\w+),*\s?/) || m.content.toLowerCase() === "cancel") && m.content.length < 200,
                                                                                                    { max: 1, time: 120000, errors: ['time'] }).then(centre_interet => {

                                                                                                        if (centre_interet.first().content.toLowerCase() === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "L'inscription a bien été arrêtée.") })

                                                                                                        message.author.send(
                                                                                                            new MessageEmbed()
                                                                                                                .setColor("#f87359")
                                                                                                                .setDescription("<a:B4:836174460637675570> Pourrais-tu te décrire ? *(1000 caractères maximum)*\n\n**Si aucun message n'est envoyé après l'envoie de ta description, diminue sa taille.**\n\n__**Attention :**__  Tu n'as pas le droit de dévoiler ton compte discord dans ta description.")
                                                                                                                .setFooter("Durée : 10 minutes • 'cancel' pour quitter l'inscription • 'skip' pour passer.")

                                                                                                        ).then(msg_description => {

                                                                                                            msg_description.channel.awaitMessages(m => m.author.id == message.author.id && m.content.length <= 1000,
                                                                                                                { max: 1, time: 600000, errors: ['time'] }).then(description => {

                                                                                                                    if (description.first().content.toLowerCase() === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "L'inscription a bien été arrêtée.") })

                                                                                                                    if (description.first().content.toLowerCase() === "skip") description.first().content = "Description non-spécifiée.";

                                                                                                                    message.author.send(
                                                                                                                        new MessageEmbed()
                                                                                                                            .setColor("#f87359")
                                                                                                                            .setDescription("<a:B4:836174460637675570> Que recherches-tu ? *(Choisis le fruit correspondant à tes recherches)*\n\n**:cherries:・Pour trouver sa moitié.** *#Sérieux*\n\n**:strawberry:・Pour simplement ramener se fraise.** *#Amitié*\n\n**:grapes:・Pour un verre de vin sans se prendre la grappe.** *#Amitié&Sérieux*\n\n**:peach:・Pour une envie de pêcher.** *#CoupDunSoir*\n\n**:watermelon:・Pour des câlins récurrents sans pépins.** *#SexFriend*\n\n**:mango:・Pour une envie d'un mélange sucré.** *#ChercheDeTout*")
                                                                                                                            .setFooter("Durée : 180 secondes • Clique sur la croix pour quitter l'inscription.")

                                                                                                                    ).then(msg_recherche => {

                                                                                                                        msg_recherche.react("🍒");
                                                                                                                        msg_recherche.react("🍓");
                                                                                                                        msg_recherche.react("🍇");
                                                                                                                        msg_recherche.react("🍑");
                                                                                                                        msg_recherche.react("🍉");
                                                                                                                        msg_recherche.react("🥭");
                                                                                                                        msg_recherche.react("<:A21:836174514819432468>");


                                                                                                                        msg_recherche.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '🍒'
                                                                                                                            || reaction.emoji.name == '🍓'
                                                                                                                            || reaction.emoji.name == '🍇'
                                                                                                                            || reaction.emoji.name == '🍑'
                                                                                                                            || reaction.emoji.name == '🍉'
                                                                                                                            || reaction.emoji.name == '🥭'
                                                                                                                            || reaction.emoji.name == '❌'
                                                                                                                        ),
                                                                                                                            { max: 1, time: 180000, errors: ['time'] }).then(recherche => {

                                                                                                                                const obj_recherche = {
                                                                                                                                    "🍒": "cerise",
                                                                                                                                    "🍓": "fraise",
                                                                                                                                    "🍇": "raisin",
                                                                                                                                    "🍑": "peche",
                                                                                                                                    "🍉": "pasteque",
                                                                                                                                    "🥭": "mangue",
                                                                                                                                }

                                                                                                                                if (recherche.first().emoji.name === "❌") return message.author.send({ embed: client.util.successMsg(message.author.tag, "L'inscription a bien été arrêtée.") })

                                                                                                                                message.author.send(
                                                                                                                                    new MessageEmbed()
                                                                                                                                        .setColor("#f87359")
                                                                                                                                        .setDescription("<a:B4:836174460637675570> Quelle est ton orientation sexuelle ?\n\nOptions : \`homme\` | \`femme\` | \`deux\`")
                                                                                                                                        .setFooter("Durée : 60 secondes • 'cancel' pour quitter l'inscription.")

                                                                                                                                ).then(msg_orientation => {

                                                                                                                                    msg_orientation.channel.awaitMessages(m => m.author.id == message.author.id && (m.content.toLowerCase() === "homme" || m.content.toLowerCase() === "femme" || m.content.toLowerCase() === "deux" || m.content.toLowerCase() === "cancel"),
                                                                                                                                        { max: 1, time: 60000, errors: ['time'] }).then(orientation => {

                                                                                                                                            if (orientation.first().content.toLowerCase() === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "L'inscription a bien été arrêtée.") })

                                                                                                                                            message.author.send(
                                                                                                                                                new MessageEmbed()
                                                                                                                                                    .setColor("#f87359")
                                                                                                                                                    .setDescription("<a:B4:836174460637675570> D'où viens-tu ?\n\n*Nous te demandons d'indiquer la région ou le département où tu vies ou le pays si tu n'habites pas en France.*")
                                                                                                                                                    .setFooter("Durée : 60 secondes • 'cancel' pour quitter l'inscription • 'skip' pour passer.")

                                                                                                                                            ).then(msg_localisation => {

                                                                                                                                                msg_localisation.channel.awaitMessages(m => m.author.id == message.author.id && m.content.length < 200,
                                                                                                                                                    { max: 1, time: 60000, errors: ['time'] }).then(localisation => {

                                                                                                                                                        if (localisation.first().content.toLowerCase() === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "L'inscription a bien été arrêtée.") })

                                                                                                                                                        if (localisation.first().content.toLowerCase() === "skip") localisation.first().content = "Localisation non-spécifiée.";

                                                                                                                                                        message.author.send(
                                                                                                                                                            new MessageEmbed()
                                                                                                                                                                .setColor("#f87359")
                                                                                                                                                                .setDescription("<a:B4:836174460637675570> Envoie ta photo meilleure photo de toi ! *Ton image doit être uploadée depuis tes fichiers*\n\n**Nous acceptons uniquement des photos, pas obligatoirement de toi tant qu'elle n'est pas malveillante ou étrange.**")
                                                                                                                                                                .setFooter("Durée : 5 minutes • 'cancel' pour quitter l'inscription.")

                                                                                                                                                        ).then(msg_image => {

                                                                                                                                                            msg_image.channel.awaitMessages(m => m.author.id == message.author.id && ((m.attachments.first() && m.attachments.first().height) || m.content.toLowerCase() === "cancel"),
                                                                                                                                                                { max: 1, time: 300000, errors: ['time'] }).then(image => {

                                                                                                                                                                    if (image.first().content.toLowerCase() === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "L'inscription a bien été arrêtée.") })

                                                                                                                                                                    client.db.query("INSERT INTO fz_users(fz_users_name, fz_users_naissance_date, fz_users_sexe, fz_users_situation, fz_users_passions, fz_users_description, fz_users_recherche, fz_users_sexual_orientation, fz_users_localisation, fz_users_image, fz_users_id_user_discord) VALUES (?,?,?,?,?,?,?,?,?,?,?)", [name.first().content, date_naissance.first().content, sexe.first().content.toLowerCase(), situation.first().content, centre_interet.first().content.replace(/\s*,\s*/g, ',').split(',').slice(0, 5).join(' - '), description.first().content, obj_recherche[recherche.first().emoji.name], orientation.first().content, localisation.first().content, image.first().attachments.first().url, message.author.id], async (error, rows) => {
                                                                                                                                                                        if (error) throw error;

                                                                                                                                                                        const check_channel = await client.guilds.cache.get("844980247400939591").channels.create(message.author.id, { parent: "844980247400939592" });

                                                                                                                                                                        check_channel.send(
                                                                                                                                                                            new MessageEmbed()
                                                                                                                                                                                .setColor("#f87359")
                                                                                                                                                                                .setTitle(`Demande de vérification - ${message.author.tag}`)
                                                                                                                                                                                .addField("Prénom", name.first().content, true)
                                                                                                                                                                                .addField("Âge", `${moment(Date.now()).diff(moment(date_naissance.first().content, "DD/MM/YYYY"), 'years')} ans *(${date_naissance.first().content})*`, true)
                                                                                                                                                                                .addField("Sexe", capitalizeFirstLetter(sexe.first().content), true)
                                                                                                                                                                                .addField("Situation", capitalizeFirstLetter(situation.first().content), true)
                                                                                                                                                                                .addField("Passion(s)", centre_interet.first().content.replace(/\s*,\s*/g, ',').split(',').slice(0, 5).join(' - '), true)
                                                                                                                                                                                .addField("Recherche", recherche.first().emoji.name, true)
                                                                                                                                                                                .addField("Orientation sexuelle", capitalizeFirstLetter(orientation.first().content), true)
                                                                                                                                                                                .addField("Localisation", capitalizeFirstLetter(localisation.first().content), true)
                                                                                                                                                                                .addField("Description", capitalizeFirstLetter(description.first().content))
                                                                                                                                                                                .setImage(image.first().attachments.first().url)
                                                                                                                                                                                .setFooter(`ID : ${message.author.id}`)
                                                                                                                                                                        )

                                                                                                                                                                        message.author.send(
                                                                                                                                                                            new MessageEmbed()
                                                                                                                                                                                .setColor("#f87359")
                                                                                                                                                                                .setDescription("Enregistrement de ton profil... <a:B20:840926788515004436>")

                                                                                                                                                                        ).then(msg_finish => {

                                                                                                                                                                            setTimeout(
                                                                                                                                                                                function () {
                                                                                                                                                                                    msg_finish.edit(
                                                                                                                                                                                        new MessageEmbed()
                                                                                                                                                                                            .setColor("#f87359")
                                                                                                                                                                                            .setDescription(`Merci ${message.author}, ton inscription est terminée, **ton profil est désormais en cours de vérification, pas de panique, tu seras vérifié sous peu !** Suite à cela, tu pourras être liké par d'autres utilisateurs.\n\nConcernant les fonctionnalités, tu pourras liker des profils, matcher avec d'autres utilisateurs, accéder aux paramètres de rencontres etc... Je te laisse découvrir les commandes disponibles.`)
                                                                                                                                                                                    )
                                                                                                                                                                                }, 5000)

                                                                                                                                                                        })

                                                                                                                                                                    })


                                                                                                                                                                }).catch(() => {
                                                                                                                                                                    message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, recommence ton inscription.") })
                                                                                                                                                                });

                                                                                                                                                        })


                                                                                                                                                    })

                                                                                                                                            })


                                                                                                                                        }).catch(() => {
                                                                                                                                            message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, recommence ton inscription.") })
                                                                                                                                        });



                                                                                                                                })



                                                                                                                            }).catch(() => {
                                                                                                                                message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, recommence ton inscription.") })
                                                                                                                            });


                                                                                                                    })


                                                                                                                }).catch(() => {
                                                                                                                    message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, recommence ton inscription.") })
                                                                                                                });

                                                                                                        })


                                                                                                    }).catch(() => {
                                                                                                        message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, recommence ton inscription.") })
                                                                                                    });

                                                                                            })

                                                                                        }).catch(() => {
                                                                                            message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, recommence ton inscription.") })
                                                                                        });


                                                                                })

                                                                            }).catch(() => {
                                                                                message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, recommence ton inscription.") })
                                                                            });

                                                                    })

                                                                }).catch(() => {
                                                                    message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, recommence ton inscription.") })
                                                                });

                                                        })

                                                    }).catch(() => {
                                                        message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, recommence ton inscription.") })
                                                    });

                                            })

                                    }).catch(() => {
                                        message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, recommence ton inscription.") })
                                    });

                            })

                        })

                    }

                    if (collected.first().emoji.id === "843444506921140225") {

                        client.db.query("SELECT fz_users_id_user_discord FROM fz_users WHERE fz_users_id_user_discord = ?", [message.author.id], async (error, rows) => {
                            if (error) throw error;

                            if (rows.length === 0) return message.author.send({ embed: client.util.errorMsg(message.author.tag, "Tu n'as crée aucun profil.") })

                            let data = await client.db.asyncQuery(
                                `SELECT * FROM fz_users WHERE fz_users_id_user_discord = ${message.author.id}`
                            ).catch(console.error);

                            message.author.send(
                                new MessageEmbed()
                                    .setColor("#f87359")
                                    .setDescription("<a:B4:836174460637675570> Quel est ton prénom ? *(50 caractères maximum)*\n\n**Envoie `skip` pour garder la valeur actuelle.**")
                                    .setFooter("Durée : 60 secondes • 'cancel' pour quitter le modifications. • 'skip' pour passer.")
                            )

                                .then(msg_name => {

                                    msg_name.channel.awaitMessages(m => m.author.id == message.author.id && m.content.length <= 50,
                                        { max: 1, time: 60000, errors: ['time'] }).then(name => {

                                            if (name.first().content.toLowerCase() === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "Les modifications ont bien été arrêtées.") })

                                            if (name.first().content.toLowerCase() === "skip") name.first().content = data[0].fz_users_name;

                                            message.author.send(
                                                new MessageEmbed()
                                                    .setColor("#f87359")
                                                    .setDescription("<a:B4:836174460637675570> Quelle est ta date de naissance ?\n\n*La date de naissance doit être écrite sous la forme* \`jour/mois/année\`.\n\n**Envoie `skip` pour garder la valeur actuelle.**")
                                                    .setFooter("Durée : 60 secondes • 'cancel' pour quitter les modifications. • 'skip' pour passer.")

                                            ).then(msg_age => {

                                                msg_age.channel.awaitMessages(m => m.author.id == message.author.id && (m.content.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/) || m.content.toLowerCase() === "cancel" || m.content.toLowerCase() === "skip"),
                                                    { max: 1, time: 60000, errors: ['time'] }).then(date_naissance => {

                                                        if (date_naissance.first().content.toLowerCase() === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "Les modifications ont bien été arrêtées.") })

                                                        if (date_naissance.first().content.toLowerCase() === "skip") {
                                                            date_naissance.first().content = data[0].fz_users_naissance_date;
                                                        }

                                                        message.author.send(
                                                            new MessageEmbed()
                                                                .setColor("#f87359")
                                                                .setDescription("<a:B4:836174460637675570> Quelle est ton sexe ?\n\nOptions : \`homme\` | \`femme\` | \`non binaire\` | \`transgenre\`\n\n**Envoie `skip` pour garder la valeur actuelle.**")
                                                                .setFooter("Durée : 60 secondes • 'cancel' pour quitter les modifications. • 'skip' pour passer.")

                                                        ).then(msg_sexe => {

                                                            msg_sexe.channel.awaitMessages(m => m.author.id == message.author.id && (m.content.toLowerCase() === "homme" || m.content.toLowerCase() === "femme" || m.content.toLowerCase() === "non binaire" || m.content.toLowerCase() === "transgenre" || m.content.toLowerCase() === "cancel" || m.content.toLowerCase() === "skip"),
                                                                { max: 1, time: 60000, errors: ['time'] }).then(sexe => {

                                                                    if (sexe.first().content.toLowerCase() === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "Les modifications ont bien été arrêtées.") })

                                                                    if (sexe.first().content.toLowerCase() === "skip") {
                                                                        sexe.first().content = data[0].fz_users_sexe;
                                                                    }

                                                                    message.author.send(
                                                                        new MessageEmbed()
                                                                            .setColor("#f87359")
                                                                            .setDescription("<a:B4:836174460637675570> Quel est ta situation actuelle ?\n\nOptions : \`célibataire\` | \`relation libre\` | \`crush\` | \`couple\`\n\n**Envoie `skip` pour garder la valeur actuelle.**")
                                                                            .setFooter("Durée : 60 secondes • 'cancel' pour quitter les modifications. • 'skip' pour passer.")

                                                                    ).then(msg_situation => {

                                                                        msg_situation.channel.awaitMessages(m => m.author.id == message.author.id && (m.content.toLowerCase() === "couple" || m.content.toLowerCase() === "célibataire" || m.content.toLowerCase() === "relation libre" || m.content.toLowerCase() === "crush" || m.content.toLowerCase() === "cancel" || m.content.toLowerCase() === "skip"),
                                                                            { max: 1, time: 60000, errors: ['time'] }).then(situation => {

                                                                                if (situation.first().content.toLowerCase() === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "Les modifications ont bien été arrêtées.") })

                                                                                if (situation.first().content.toLowerCase() === "skip") {
                                                                                    situation.first().content = data[0].fz_users_situation;
                                                                                }

                                                                                message.author.send(
                                                                                    new MessageEmbed()
                                                                                        .setColor("#f87359")
                                                                                        .setDescription("<a:B4:836174460637675570> Quels sont tes centres d'intérêts ? *(5 centres d'intérêts maximum)*\n\n*Tu dois les lister sous forme 'football, musique, musculation'*\n\n**Envoie `skip` pour garder la valeur actuelle.**")
                                                                                        .setFooter("Durée : 2 minutes • 'cancel' pour quitter les modifications. • 'skip' pour passer.")

                                                                                ).then(msg_centre_interet => {

                                                                                    msg_centre_interet.channel.awaitMessages(m => m.author.id == message.author.id && (m.content.match(/(\w+),*\s?/) || m.content.toLowerCase() === "cancel" || m.content.toLowerCase() === "skip") && m.content.length < 200,
                                                                                        { max: 1, time: 120000, errors: ['time'] }).then(centre_interet => {

                                                                                            if (centre_interet.first().content.toLowerCase() === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "Les modifications ont bien été arrêtées.") })

                                                                                            if (centre_interet.first().content.toLowerCase() === "skip") {
                                                                                                centre_interet.first().content = data[0].fz_users_passions;
                                                                                            }

                                                                                            message.author.send(
                                                                                                new MessageEmbed()
                                                                                                    .setColor("#f87359")
                                                                                                    .setDescription("<a:B4:836174460637675570> Pourrais-tu te décrire ? *(1000 caractères maximum)*\n\n**Si aucun message n'est envoyé après l'envoie de ta description, diminue sa taille.**\n\n**Envoie `skip` pour garder la valeur actuelle.**")
                                                                                                    .setFooter("Durée : 10 minutes • 'cancel' pour quitter les modifications • 'skip' pour passer.")

                                                                                            ).then(msg_description => {

                                                                                                msg_description.channel.awaitMessages(m => m.author.id == message.author.id && m.content.length <= 1000,
                                                                                                    { max: 1, time: 600000, errors: ['time'] }).then(description => {

                                                                                                        if (description.first().content.toLowerCase() === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "Les modifications ont bien été arrêtées.") })

                                                                                                        if (description.first().content.toLowerCase() === "skip") {
                                                                                                            description.first().content = data[0].fz_users_description;
                                                                                                        }

                                                                                                        message.author.send(
                                                                                                            new MessageEmbed()
                                                                                                                .setColor("#f87359")
                                                                                                                .setDescription("<a:B4:836174460637675570> Re-choisis le fruit correspondant à tes recherches.\n\n**:cherries:・Pour trouver sa moitié.** *#Sérieux*\n\n**:strawberry:・Pour simplement ramener se fraise.** *#Amitié*\n\n**:grapes:・Pour un verre de vin sans se prendre la grappe.** *#Amitié&Sérieux*\n\n**:peach:・Pour une envie de pêcher.** *#CoupDunSoir*\n\n**:watermelon:・Pour des câlins récurrents sans pépins.** *#SexFriend*\n\n**:mango:・Pour une envie d'un mélange sucré.** *#ChercheDeTout*")
                                                                                                                .setFooter("Durée : 3 minutes • Clique sur la croix pour quitter les modifications.")

                                                                                                        ).then(msg_recherche => {

                                                                                                            msg_recherche.react("🍒");
                                                                                                            msg_recherche.react("🍓");
                                                                                                            msg_recherche.react("🍇");
                                                                                                            msg_recherche.react("🍑");
                                                                                                            msg_recherche.react("🍉");
                                                                                                            msg_recherche.react("🥭");
                                                                                                            msg_recherche.react("<:A21:836174514819432468>");


                                                                                                            msg_recherche.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '🍒'
                                                                                                                || reaction.emoji.name == '🍓'
                                                                                                                || reaction.emoji.name == '🍇'
                                                                                                                || reaction.emoji.name == '🍑'
                                                                                                                || reaction.emoji.name == '🍉'
                                                                                                                || reaction.emoji.name == '🥭'
                                                                                                                || reaction.emoji.name == '❌'
                                                                                                            ),
                                                                                                                { max: 1, time: 180000, errors: ['time'] }).then(recherche => {

                                                                                                                    const obj_recherche = {
                                                                                                                        "🍒": "cerise",
                                                                                                                        "🍓": "fraise",
                                                                                                                        "🍇": "raisin",
                                                                                                                        "🍑": "peche",
                                                                                                                        "🍉": "pasteque",
                                                                                                                        "🥭": "mangue",
                                                                                                                    }

                                                                                                                    if (recherche.first().emoji.name === "❌") return message.author.send({ embed: client.util.successMsg(message.author.tag, "Les modifications ont bien été arrêtées.") })

                                                                                                                    message.author.send(
                                                                                                                        new MessageEmbed()
                                                                                                                            .setColor("#f87359")
                                                                                                                            .setDescription("<a:B4:836174460637675570> Quelle est ton orientation sexuelle ?\n\nOptions : \`homme\` | \`femme\` | \`deux\`\n\n**Envoie `skip` pour garder la valeur actuelle.**")
                                                                                                                            .setFooter("Durée : 60 secondes • 'cancel' pour quitter les modifications. • 'skip' pour passer.")

                                                                                                                    ).then(msg_orientation => {

                                                                                                                        msg_orientation.channel.awaitMessages(m => m.author.id == message.author.id && (m.content.toLowerCase() === "homme" || m.content.toLowerCase() === "femme" || m.content.toLowerCase() === "deux" || m.content.toLowerCase() === "cancel" || m.content.toLowerCase() === "skip"),
                                                                                                                            { max: 1, time: 60000, errors: ['time'] }).then(orientation => {

                                                                                                                                if (orientation.first().content.toLowerCase() === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "Les modifications ont bien été arrêtées.") })

                                                                                                                                if (orientation.first().content.toLowerCase() === "skip") {
                                                                                                                                    orientation.first().content = data[0].fz_users_sexual_orientation;
                                                                                                                                }

                                                                                                                                message.author.send(
                                                                                                                                    new MessageEmbed()
                                                                                                                                        .setColor("#f87359")
                                                                                                                                        .setDescription("<a:B4:836174460637675570> D'où viens-tu ?\n\n*Nous te demandons d'indiquer la région ou le département où tu vies ou le pays si tu n'habites pas en France.*\n\n**Envoie `skip` pour garder la valeur actuelle.**")
                                                                                                                                        .setFooter("Durée : 60 secondes • 'cancel' pour quitter les modifications • 'skip' pour passer.")

                                                                                                                                ).then(msg_localisation => {

                                                                                                                                    msg_localisation.channel.awaitMessages(m => m.author.id == message.author.id && m.content.length < 200,
                                                                                                                                        { max: 1, time: 60000, errors: ['time'] }).then(localisation => {

                                                                                                                                            if (localisation.first().content.toLowerCase() === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "Les modifications ont bien été arrêtées.") })

                                                                                                                                            if (localisation.first().content.toLowerCase() === "skip") {
                                                                                                                                                localisation.first().content = data[0].fz_users_localisation;
                                                                                                                                            }

                                                                                                                                            message.author.send(
                                                                                                                                                new MessageEmbed()
                                                                                                                                                    .setColor("#f87359")
                                                                                                                                                    .setDescription("<a:B4:836174460637675570> Envoie ta photo meilleure photo de toi ! *Ton image doit être uploadée depuis tes fichiers*\n\n**Envoie `skip` pour garder la valeur actuelle.**")
                                                                                                                                                    .setFooter("Durée : 5 minutes • 'cancel' pour quitter les modifications. • 'skip' pour passer.")

                                                                                                                                            ).then(msg_image => {

                                                                                                                                                msg_image.channel.awaitMessages(m => m.author.id == message.author.id && ((m.attachments.first() && m.attachments.first().height) || m.content.toLowerCase() === "cancel" || m.content.toLowerCase() === "skip"),
                                                                                                                                                    { max: 1, time: 300000, errors: ['time'] }).then(image => {

                                                                                                                                                        if (image.first().content.toLowerCase() === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "Les modifications ont bien été arrêtées.") })

                                                                                                                                                        client.db.query(`UPDATE fz_users SET fz_users_name = ?, fz_users_naissance_date = ?,fz_users_sexe = ?,fz_users_situation = ?,fz_users_passions = ?,fz_users_description = ?,fz_users_recherche = ?,fz_users_sexual_orientation = ?,fz_users_localisation = ?,fz_users_image = ? WHERE fz_users_id_user_discord = ?`, [name.first().content, date_naissance.first().content, sexe.first().content.toLowerCase(), situation.first().content, centre_interet.first().content.replace(/\s*,\s*/g, ',').split(',').slice(0, 5).join(' - '), description.first().content, obj_recherche[recherche.first().emoji.name], orientation.first().content, localisation.first().content, image.first().content === "skip" ? data[0].fz_users_image : image.first().attachments.first().url, message.author.id], async (error, rows) => {
                                                                                                                                                            if (error) throw error;

                                                                                                                                                            const check_channel_modif = await client.guilds.cache.get("844980247400939591").channels.create(message.author.id, { parent: "844980247400939593" });

                                                                                                                                                            check_channel_modif.send(
                                                                                                                                                                new MessageEmbed()
                                                                                                                                                                    .setColor("#f87359")
                                                                                                                                                                    .setTitle(`Demande de vérification - ${message.author.tag}`)
                                                                                                                                                                    .addField("Prénom", name.first().content, true)
                                                                                                                                                                    .addField("Âge", `${moment(Date.now()).diff(moment(date_naissance.first().content, "DD/MM/YYYY"), 'years')} ans *(${date_naissance.first().content})*`, true)
                                                                                                                                                                    .addField("Sexe", capitalizeFirstLetter(sexe.first().content), true)
                                                                                                                                                                    .addField("Situation", capitalizeFirstLetter(situation.first().content), true)
                                                                                                                                                                    .addField("Passion(s)", centre_interet.first().content.replace(/\s*,\s*/g, ',').split(',').slice(0, 5).join(' - '), true)
                                                                                                                                                                    .addField("Recherche", recherche.first().emoji.name, true)
                                                                                                                                                                    .addField("Orientation sexuelle", capitalizeFirstLetter(orientation.first().content), true)
                                                                                                                                                                    .addField("Localisation", capitalizeFirstLetter(localisation.first().content), true)
                                                                                                                                                                    .addField("Description", capitalizeFirstLetter(description.first().content))
                                                                                                                                                                    .setImage(image.first().content === "skip" ? data[0].fz_users_image : image.first().attachments.first().url)
                                                                                                                                                                    .setFooter(`ID : ${message.author.id}`)
                                                                                                                                                            )

                                                                                                                                                            client.infoModif = new Map();

                                                                                                                                                            client.infoModif.set(message.author.id, {
                                                                                                                                                                "name": data[0].fz_users_name,
                                                                                                                                                                "naissance": data[0].fz_users_naissance_date,
                                                                                                                                                                "sexe": data[0].fz_users_sexe,
                                                                                                                                                                "situation": data[0].fz_users_situation,
                                                                                                                                                                "passions": data[0].fz_users_passions,
                                                                                                                                                                "description": data[0].fz_users_description,
                                                                                                                                                                "recherche": data[0].fz_users_recherche,
                                                                                                                                                                "orientation": data[0].fz_users_sexual_orientation,
                                                                                                                                                                "localisation": data[0].fz_users_localisation,
                                                                                                                                                                "image": data[0].fz_users_image,
                                                                                                                                                            })

                                                                                                                                                            message.author.send(
                                                                                                                                                                new MessageEmbed()
                                                                                                                                                                    .setColor("#f87359")
                                                                                                                                                                    .setDescription("Modification de ton profil... <a:B20:840926788515004436>")

                                                                                                                                                            ).then(msg_finish => {

                                                                                                                                                                setTimeout(
                                                                                                                                                                    function () {
                                                                                                                                                                        msg_finish.edit(
                                                                                                                                                                            new MessageEmbed()
                                                                                                                                                                                .setColor("#f87359")
                                                                                                                                                                                .setDescription(`Merci ${message.author}, Ton profil a été mis en état de vérification. Tu devras attendre d'être vérifié afin de recommencer à swipe des utilisateurs etc..`)
                                                                                                                                                                        )
                                                                                                                                                                    }, 5000)

                                                                                                                                                            })

                                                                                                                                                        })


                                                                                                                                                    }).catch(() => {
                                                                                                                                                        message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, recommence ton inscription.") })
                                                                                                                                                    });

                                                                                                                                            })


                                                                                                                                        })

                                                                                                                                })


                                                                                                                            }).catch(() => {
                                                                                                                                message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, recommence ton inscription.") })
                                                                                                                            });



                                                                                                                    })



                                                                                                                }).catch(() => {
                                                                                                                    message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, recommence ton inscription.") })
                                                                                                                });


                                                                                                        })


                                                                                                    }).catch(() => {
                                                                                                        message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, recommence ton inscription.") })
                                                                                                    });

                                                                                            })


                                                                                        }).catch(() => {
                                                                                            message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, recommence ton inscription.") })
                                                                                        });

                                                                                })

                                                                            }).catch(() => {
                                                                                message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, recommence ton inscription.") })
                                                                            });


                                                                    })

                                                                }).catch(() => {
                                                                    message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, recommence ton inscription.") })
                                                                });

                                                        })

                                                    }).catch(() => {
                                                        message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, recommence ton inscription.") })
                                                    });

                                            })

                                        }).catch(() => {
                                            message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, recommence ton inscription.") })
                                        });

                                })
                        })

                    }

                    if (collected.first().emoji.id === "843445062330875914") {

                        client.db.query("SELECT fz_users_id_user_discord FROM fz_users WHERE fz_users_id_user_discord = ?", [message.author.id], (error, rows) => {
                            if (error) throw error;

                            if (rows.length === 0) return message.author.send({ embed: client.util.errorMsg(message.author.tag, "Tu n'as crée aucun profil.") })

                            message.author.send(
                                new MessageEmbed()
                                    .setColor("#f87359")
                                    .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
                                    .setDescription("Confirmes-tu vouloir **supprimer** ton profil ?\n\n*Tu perdras toutes les données de ton profil.*")
                            ).then(msg_confirm => {

                                msg_confirm.react("<:close_foodiz:842902717587259392>")
                                msg_confirm.react("<:coche_foodiz:843499669203058688>")

                                const collector = msg_confirm.createReactionCollector((reaction, user) => user.id === message.author.id && (reaction.emoji.id === "842902717587259392" || reaction.emoji.id === "843499669203058688"), { time: 30000 });

                                collector.on('collect', reaction => {

                                    if (reaction.emoji.id === "842902717587259392") {

                                        collector.stop();
                                        msg_confirm.edit(
                                            new MessageEmbed()
                                                .setColor("#f87359")
                                                .setTitle("Commande annulée")
                                        )

                                    }

                                    if (reaction.emoji.id === "843499669203058688") {

                                        client.db.query("DELETE FROM fz_swipes WHERE fz_swipes_id_user_author = ?", [message.author.id], (error, rows) => {
                                            if (error) throw error;

                                            client.db.query("DELETE FROM fz_swipes WHERE fz_swipes_id_user_cible = ?", [message.author.id], (error, rows) => {
                                                if (error) throw error;

                                                client.db.query("DELETE FROM fz_users WHERE fz_users_id_user_discord = ?", [message.author.id], (error, rows) => {
                                                    if (error) throw error;

                                                    collector.stop();
                                                    msg_confirm.edit(
                                                        new MessageEmbed()
                                                            .setColor("#f87359")
                                                            .setTitle("Compte supprimé avec succès !")
                                                    )

                                                });

                                            });

                                        });

                                    }

                                })

                            })


                        })
                    }

                }).catch(() => {
                    message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, commande annulée.") })
                });

            // --------------------------------------------------------------------------
            // Message d'erreur quand l'utilisateur n'a pas les messages privés ouverts
            // --------------------------------------------------------------------------

        }).catch(() =>
            message.author.send({ embed: client.util.errorMsg(message.author.tag, ":envelope: - Je ne peux malheureusement pas vous envoyer de message en privé.") })
        )

        if (message.channel.type !== "dm") return message.channel.send({ embed: client.util.successMsg(message.author.tag, ":envelope: - Message envoyé avec succès.") })

    },
};