const { MessageEmbed } = require("discord.js");
const moment = require('moment');

module.exports = {
    name: 'manage-profil',
    description: 'Gérer son profil Foodiz.',
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

        async function createProfil(message) {
            let { content: prenom } = await awaitMessage(message, (msg => msg.author.id == message.author.id && msg.content.length <= 50), 60000, '<a:B4:836174460637675570> Quel est ton prénom ? *(50 caractères maximum)*', "Inscription : étape 1/10 - Durée : 60 secondes • 'cancel' pour quitter l'inscription.").catch(() => { });
            if (prenom === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "L'inscription a bien été arrêtée.") })
            if (!prenom) return message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, recommence ton inscription.") })

            let { content: date_naissance } = await awaitMessage(message, (msg => msg.author.id == message.author.id && (msg.content.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/) || msg.content.toLowerCase() === "cancel")), 60000, '<a:B4:836174460637675570> Quelle est ta date de naissance ?\n\n*La date de naissance doit être écrite sous la forme* \`jour/mois/année\`.', "Inscription : étape 2/10 - Durée : 60 secondes • 'cancel' pour quitter l'inscription.").catch(() => { });
            if (date_naissance === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "L'inscription a bien été arrêtée.") })
            if (!date_naissance) return message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, recommence ton inscription.") })

            let array_sexe = ["homme", "femme", "non binaire", "transgenre"]

            let { content: sexe } = await awaitMessage(message, (msg => msg.author.id == message.author.id && (array_sexe.includes(msg.content.toLowerCase()) || msg.content.toLowerCase() === "cancel")), 60000, '<a:B4:836174460637675570> Quelle est ton sexe ?\n\nOptions : \`homme\` | \`femme\` | \`non binaire\` | \`transgenre\`', "Inscription : étape 3/10 - Durée : 60 secondes • 'cancel' pour quitter l'inscription.").catch(() => { });
            if (sexe === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "L'inscription a bien été arrêtée.") })
            if (!sexe) return message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, recommence ton inscription.") })

            let array_situation = ["couple", "célibataire", "relation libre", "crush", "compliqué"]

            let { content: situation } = await awaitMessage(message, (msg => msg.author.id == message.author.id && (array_situation.includes(msg.content.toLowerCase()) || msg.content.toLowerCase() === "cancel")), 60000, '<a:B4:836174460637675570> Quel est ta situation actuelle ?\n\nOptions : \`célibataire\` | \`relation libre\` | \`crush\` | \`couple\` | \`compliqué\`', "Inscription : étape 4/10 - Durée : 60 secondes • 'cancel' pour quitter l'inscription.").catch(() => { });
            if (situation === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "L'inscription a bien été arrêtée.") })
            if (!situation) return message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, recommence ton inscription.") })

            let { content: passions } = await awaitMessage(message, (msg => msg.author.id == message.author.id && (msg.content.match(/(\w+),*\s?/) || msg.content.toLowerCase() === "cancel") && msg.content.length < 200), 300000, "<a:B4:836174460637675570> Quels sont tes centres d'intérêts ? *(5 centres d'intérêts maximum)*\n\n*Tu dois les lister sous forme 'football, musique, musculation'*", "Inscription : étape 5/10 - Durée : 5 minutes • 'cancel' pour quitter l'inscription.").catch(() => { });
            if (passions === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "L'inscription a bien été arrêtée.") })
            if (!passions) return message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, recommence ton inscription.") })

            let { content: description } = await awaitMessage(message, (msg => msg.author.id == message.author.id && msg.content.length <= 1000), 900000, '<a:B4:836174460637675570> Pourrais-tu te décrire ? *(1000 caractères maximum)*\n\n**Si aucun message n\'est envoyé après l\'envoie de ta description, diminue sa taille.**\n\n__**Attention :**__  Tu n\'as pas le droit de dévoiler ton compte discord dans ta description.', "Inscription : étape 6/10 - Durée : 15 minutes • 'cancel' pour quitter l'inscription • 'skip' pour passer").catch(() => { });
            if (description === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "L'inscription a bien été arrêtée.") })
            if (description === "skip") description = "Description non-spécifiée.";
            if (!description) return message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, recommence ton inscription.") })

            let array_recherche = ["🍒", "🍓", "🍇", "🍑", "🍉", "🥭"];

            let { content: recherche } = await awaitMessage(message, (msg => msg.author.id == message.author.id && (array_recherche.includes(msg.content.toLowerCase()) || msg.content.toLowerCase() === "cancel")), 300000, "Que recherches-tu ? *(Choisis le fruit correspondant à tes recherches)*\n\n**:cherries:・Pour trouver sa moitié.** *#Sérieux*\n\n**:strawberry:・Pour simplement ramener se fraise.** *#Amitié*\n\n**:grapes:・Pour un verre de vin sans se prendre la grappe.** *#Amitié&Sérieux*\n\n**:peach:・Pour une envie de pêcher.** *#CoupDunSoir*\n\n**:watermelon:・Pour des câlins récurrents sans pépins.** *#SexFriend*\n\n**:mango:・Pour une envie d'un mélange sucré.** *#ChercheDeTout*", "Inscription : étape 7/10 - Durée : 5 minutes • 'cancel' pour quitter l'inscription.").catch(() => { });
            if (recherche === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "L'inscription a bien été arrêtée.") })
            if (!recherche) return message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, recommence ton inscription.") })

            let array_sexualOrientation = ["homme", "femme", "deux"];

            let { content: sexualOrientation } = await awaitMessage(message, (msg => msg.author.id == message.author.id && (array_sexualOrientation.includes(msg.content.toLowerCase()) || msg.content.toLowerCase() === "cancel")), 60000, "<a:B4:836174460637675570> Quelle est ton orientation sexuelle ?\n\nOptions : \`homme\` | \`femme\` | \`deux\`", "Inscription : étape 8/10 - Durée : 60 secondes • 'cancel' pour quitter l'inscription.").catch(() => { });
            if (sexualOrientation === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "L'inscription a bien été arrêtée.") })
            if (!sexualOrientation) return message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, recommence ton inscription.") })

            let { content: localisation } = await awaitMessage(message, (msg => msg.author.id == message.author.id && msg.content.length < 200), 120000, "<a:B4:836174460637675570> D'où viens-tu ?\n\n*Nous te demandons d'indiquer la région ou le département où tu vies ou le pays si tu n'habites pas en France.*", "Inscription : étape 9/10 - Durée : 2 minutes • 'cancel' pour quitter l'inscription. • 'skip' pour passer").catch(() => { });
            if (localisation === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "L'inscription a bien été arrêtée.") })
            if (localisation === "skip") localisation = "Localisation non-spécifiée.";
            if (!localisation) return message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, recommence ton inscription.") })

            let { attachments: image, content } = await awaitMessage(message, (msg => msg.author.id == message.author.id && ((msg.attachments.first() && msg.attachments.first().height) || msg.content.toLowerCase() === "cancel")), 300000, "<a:B4:836174460637675570> Envoie ta photo meilleure photo de toi ! *Ton image doit être uploadée depuis tes fichiers*\n\n**Nous acceptons uniquement des photos, pas obligatoirement de toi tant qu'elle n'est pas malveillante ou étrange.**", "Inscription : étape 10/10 - Durée : 5 minutes • 'cancel' pour quitter l'inscription.").catch(() => { });
            if (content === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "L'inscription a bien été arrêtée.") })
            if (!image.first()) return message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, recommence ton inscription.") })

            return {
                "prenom": prenom,
                "age": date_naissance,
                "sexe": sexe,
                "situation": situation,
                "passions": passions.replace(/\s*,\s*/g, ',').split(',').slice(0, 5).join(' - '),
                "description": description,
                "recherche": recherche,
                "sexualOrientation": sexualOrientation,
                "localisation": localisation,
                "image": image.first().url
            }
        }

        async function editProfil(message, data) {
            const obj_recherche_inverse = {
                "cerise": "🍒",
                "fraise": "🍓",
                "raisin": "🍇",
                "peche": "🍑",
                "pasteque": "🍉",
                "mangue": "🥭",
            }

            let { content: prenom } = await awaitMessage(message, (msg => msg.author.id == message.author.id && msg.content.length <= 50), 60000, '<a:B4:836174460637675570> Quel est ton prénom ? *(50 caractères maximum)*\n\n**Envoie `skip` pour garder la valeur actuelle.**', "Modifications : étape 1/10 - Durée : 60 secondes • 'cancel' pour quitter le modifications.").catch(() => { });
            if (prenom === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "Les modifications ont bien été arrêtées.") })
            if (prenom === "skip") prenom = data.fz_users_name;
            if (!prenom) return message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, commande annulée.") })

            let { content: date_naissance } = await awaitMessage(message, (msg => msg.author.id == message.author.id && (msg.content.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/) || msg.content.toLowerCase() === "cancel" || msg.content.toLowerCase() === "skip")), 60000, '<a:B4:836174460637675570> Quelle est ta date de naissance ?\n\n*La date de naissance doit être écrite sous la forme* \`jour/mois/année\`.\n\n**Envoie `skip` pour garder la valeur actuelle.**', "Modifications : étape 2/10 - Durée : 60 secondes • 'cancel' pour quitter les modifications.").catch(() => { });
            if (date_naissance === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "Les modifications ont bien été arrêtées.") })
            if (date_naissance === "skip") date_naissance = data.fz_users_naissance_date;
            if (!date_naissance) return message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, commande annulée.") })

            let array_sexe = ["homme", "femme", "non binaire", "transgenre"]

            let { content: sexe } = await awaitMessage(message, (msg => msg.author.id == message.author.id && (array_sexe.includes(msg.content.toLowerCase()) || msg.content.toLowerCase() === "cancel" || msg.content.toLowerCase() === "skip")), 60000, '<a:B4:836174460637675570> Quelle est ton sexe ?\n\nOptions : \`homme\` | \`femme\` | \`non binaire\` | \`transgenre\`\n\n**Envoie `skip` pour garder la valeur actuelle.**', "Modifications : étape 3/10 - Durée : 60 secondes • 'cancel' pour quitter les modifications.").catch(() => { });
            if (sexe === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "Les modifications ont bien été arrêtées.") })
            if (sexe === "skip") sexe = data.fz_users_sexe;
            if (!sexe) return message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, commande annulée.") })

            let array_situation = ["couple", "célibataire", "relation libre", "crush", "compliqué"]

            let { content: situation } = await awaitMessage(message, (msg => msg.author.id == message.author.id && (array_situation.includes(msg.content.toLowerCase()) || msg.content.toLowerCase() === "cancel" || msg.content.toLowerCase() === "skip")), 60000, '<a:B4:836174460637675570> Quel est ta situation actuelle ?\n\nOptions : \`célibataire\` | \`relation libre\` | \`crush\` | \`couple\` | \`compliqué\`\n\n**Envoie `skip` pour garder la valeur actuelle.**', "Modifications : étape 4/10 - Durée : 60 secondes • 'cancel' pour quitter les modifications.").catch(() => { });
            if (situation === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "Les modifications ont bien été arrêtées.") })
            if (situation === "skip") situation = data.fz_users_situation;
            if (!situation) return message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, commande annulée.") })

            let { content: passions } = await awaitMessage(message, (msg => msg.author.id == message.author.id && (msg.content.match(/(\w+),*\s?/) || msg.content.toLowerCase() === "cancel" || msg.content.toLowerCase() === "skip") && msg.content.length < 200), 300000, "<a:B4:836174460637675570> Quels sont tes centres d'intérêts ? *(5 centres d'intérêts maximum)*\n\n*Tu dois les lister sous forme 'football, musique, musculation'*\n\n**Envoie `skip` pour garder la valeur actuelle.**", "Modifications : étape 5/10 - Durée : 5 minutes • 'cancel' pour quitter les modifications.").catch(() => { });
            if (passions === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "Les modifications ont bien été arrêtées.") })
            if (passions === "skip") passions = data.fz_users_passions;
            if (!passions) return message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, commande annulée.") })

            let { content: description } = await awaitMessage(message, (msg => msg.author.id == message.author.id && msg.content.length <= 1000), 900000, '<a:B4:836174460637675570> Pourrais-tu te décrire ? *(1000 caractères maximum)*\n\n**Si aucun message n\'est envoyé après l\'envoie de ta description, diminue sa taille.**\n\n__**Attention :**__  Tu n\'as pas le droit de dévoiler ton compte discord dans ta description.\n\n**Envoie `skip` pour garder la valeur actuelle.**', "Modifications : étape 6/10 - Durée : 15 minutes • 'cancel' pour quitter les modifications.").catch(() => { });
            if (description === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "Les modifications ont bien été arrêtées.") })
            if (description === "skip") description = data.fz_users_description;
            if (!description) return message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, commande annulée.") })

            let array_recherche = ["🍒", "🍓", "🍇", "🍑", "🍉", "🥭"];

            let { content: recherche } = await awaitMessage(message, (msg => msg.author.id == message.author.id && (array_recherche.includes(msg.content.toLowerCase()) || msg.content.toLowerCase() === "cancel" || msg.content.toLowerCase() === "skip")), 300000, "Que recherches-tu ? *(Choisis le fruit correspondant à tes recherches)*\n\n**:cherries:・Pour trouver sa moitié.** *#Sérieux*\n\n**:strawberry:・Pour simplement ramener se fraise.** *#Amitié*\n\n**:grapes:・Pour un verre de vin sans se prendre la grappe.** *#Amitié&Sérieux*\n\n**:peach:・Pour une envie de pêcher.** *#CoupDunSoir*\n\n**:watermelon:・Pour des câlins récurrents sans pépins.** *#SexFriend*\n\n**:mango:・Pour une envie d'un mélange sucré.** *#ChercheDeTout*\n\n**Envoie `skip` pour garder la valeur actuelle.**", "Modifications : étape 7/10 - Durée : 5 minutes • 'cancel' pour quitter les modifications.").catch(() => { });
            if (recherche === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "Les modifications ont bien été arrêtées.") })
            if (recherche === "skip") recherche = obj_recherche_inverse[data.fz_users_recherche];
            if (!recherche) return message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, commande annulée.") })

            let array_sexualOrientation = ["homme", "femme", "deux"];

            let { content: sexualOrientation } = await awaitMessage(message, (msg => msg.author.id == message.author.id && (array_sexualOrientation.includes(msg.content.toLowerCase()) || msg.content.toLowerCase() === "cancel" || msg.content.toLowerCase() === "skip")), 60000, "<a:B4:836174460637675570> Quelle est ton orientation sexuelle ?\n\nOptions : \`homme\` | \`femme\` | \`deux\`\n\n**Envoie `skip` pour garder la valeur actuelle.**", "Modifications : étape 8/10 - Durée : 60 secondes • 'cancel' pour quitter les modifications.").catch(() => { });
            if (sexualOrientation === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "Les modifications ont bien été arrêtées.") })
            if (sexualOrientation === "skip") sexualOrientation = data.fz_users_sexual_orientation;
            if (!sexualOrientation) return message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, commande annulée.") })

            let { content: localisation } = await awaitMessage(message, (msg => msg.author.id == message.author.id && msg.content.length < 200), 120000, "<a:B4:836174460637675570> D'où viens-tu ?\n\n*Nous te demandons d'indiquer la région ou le département où tu vies ou le pays si tu n'habites pas en France.*\n\n**Envoie `skip` pour garder la valeur actuelle.**", "Modifications : étape 9/10 - Durée : 2 minutes • 'cancel' pour quitter les modifications.").catch(() => { });
            if (localisation === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "Les modifications ont bien été arrêtées.") })
            if (localisation === "skip") localisation = data.fz_users_localisation;
            if (!localisation) return message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, commande annulée.") })

            let { attachments: image, content } = await awaitMessage(message, (msg => msg.author.id == message.author.id && ((msg.attachments.first() && msg.attachments.first().height) || msg.content.toLowerCase() === "cancel" || msg.content.toLowerCase() === "skip")), 300000, "<a:B4:836174460637675570> Envoie ta photo meilleure photo de toi ! *Ton image doit être uploadée depuis tes fichiers*\n\n**Nous acceptons uniquement des photos, pas obligatoirement de toi tant qu'elle n'est pas malveillante ou étrange.**\n\n**Envoie `skip` pour garder la valeur actuelle.**", "Modifications : étape 10/10 - Durée : 5 minutes • 'cancel' pour quitter les modifications.").catch(() => { });
            if (content === "cancel") return message.author.send({ embed: client.util.successMsg(message.author.tag, "Les modifications ont bien été arrêtées.") })
            if (!image.first() && content !== "skip") return message.author.send({ embed: client.util.errorMsg(message.author.tag, "Temps écoulé, commande annulée.") })

            return {
                "prenom": prenom,
                "age": date_naissance,
                "sexe": sexe,
                "situation": situation,
                "passions": passions.replace(/\s*,\s*/g, ',').split(',').slice(0, 5).join(' - '),
                "description": description,
                "recherche": recherche,
                "sexualOrientation": sexualOrientation,
                "localisation": localisation,
                "image": content === "skip" ? data.fz_users_image : image.first().url
            }
        }

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        const obj_recherche = {
            "🍒": "cerise",
            "🍓": "fraise",
            "🍇": "raisin",
            "🍑": "peche",
            "🍉": "pasteque",
            "🥭": "mangue",
        }

        const author = await client.db.asyncQuery(`SELECT * FROM fz_users WHERE fz_users_id_user_discord = ${message.author.id}`).catch(console.error);
        const emojiList = ['<:user_create:843444506904231977>', '<:edit:843444506921140225>', '<:trash_user:843445062330875914>'];
        const emojiName = ['user_create', 'edit', 'trash_user'];
        const msg = await message.author.send(
            new MessageEmbed()
                .setColor("#f87359")
                .setTitle("Gestion de ton profil <:foodiz:835923851418140702>")
                .setDescription(`Bonjour ${message.author}, tu es dans l'interface de gestion de ton profil. Ce profil te permet d'utiliser la totalité des commandes, il est très important de le créer ! Je peux donc te proposer 3 options,\n\n<:user_create:843444506904231977> ・ **Créer ton profil**\n<:edit:843444506921140225> ・ **Modifier ton profil**\n<:trash_user:843445062330875914> ・ **Supprimer ton profil**\n\nTu peux cliquer sur la réaction que tu souhaites.`)
                .setFooter("Durée : 60 secondes")
        )

        for (const emoji of emojiList) await msg.react(emoji);
        const collector = msg.createReactionCollector((reaction, user) => user.id === message.author.id && emojiName.includes(reaction.emoji.name), { time: 60000 });

        collector.on('collect', async reaction => {
            switch (reaction.emoji.name) {
                case "user_create":
                    if (author.length > 0) return message.author.send({ embed: client.util.errorMsg(message.author.tag, "Tu as déjà crée un profil.") });

                    const msgIntro = await message.author.send(
                        new MessageEmbed()
                            .setColor("#f87359")
                            .setTitle("Introduction <:foodiz:835923851418140702>")
                            .setDescription(`Bonjour **${message.author.username}**, je me présente, je suis **FoodizBot**, le bot qui compte t'aider dans tes recherches de relations. Je suis heureux que tu nous aies choisi !\n\nBon ! Pour commencer nous allons te créer un profil, réponds aux questions qui vont suivre et je t'expliquerai ce que tu pourras faire avec ce profil.\n\n\`\`\`diff\n- Attention\nIl est inutile de créer un profil avec des informations malveillantes, tous les profils sont vérifiés.\`\`\`\n**Clique sur la réaction ci-dessous pour débuter ton inscription.** <:A20:836174502936576031>`)
                            .setFooter("Durée : 60 secondes")
                    );
                    await msgIntro.react("<a:B1:836174636592660500>");

                    const collectorIntro = msgIntro.createReactionCollector((reaction, user) => user.id === message.author.id && reaction.emoji.id === "836174636592660500", { time: 60000 });
                    collectorIntro.on('collect', async reaction => {

                        const dataUser = await createProfil(message);
                        if (!dataUser.prenom) return;

                        await client.db.query("INSERT INTO fz_users(fz_users_name, fz_users_naissance_date, fz_users_sexe, fz_users_situation, fz_users_passions, fz_users_description, fz_users_recherche, fz_users_sexual_orientation, fz_users_localisation, fz_users_image, fz_users_id_user_discord) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                            [
                                dataUser.prenom,
                                dataUser.age,
                                dataUser.sexe,
                                dataUser.situation,
                                dataUser.passions,
                                dataUser.description,
                                obj_recherche[dataUser.recherche],
                                dataUser.sexualOrientation,
                                dataUser.localisation,
                                dataUser.image,
                                message.author.id
                            ], async (error, rows) => {
                                if (error) throw error;
                            });

                        message.author.send(
                            new MessageEmbed()
                                .setColor("#f87359")
                                .setTitle("Inscription terminée ! <:coche_foodiz:843499669203058688>")
                                .setDescription(`Merci ${message.author}, ton inscription est terminée, **ton profil est désormais en cours de vérification, pas de panique, tu seras vérifié sous peu !** Suite à cela, tu pourras être liké par d'autres utilisateurs.\n\nConcernant les fonctionnalités, tu pourras liker des profils, matcher avec d'autres utilisateurs, accéder aux paramètres de rencontres etc... Je te laisse découvrir les commandes disponibles.`)
                        )

                        const check_channel = await client.guilds.cache.get("844980247400939591").channels.create(message.author.id, { parent: "844980247400939592" });
                        check_channel.send(
                            new MessageEmbed()
                                .setColor("#f87359")
                                .setTitle(`Demande de vérification - ${message.author.tag}`)
                                .addField("Prénom", dataUser.prenom, true)
                                .addField("Âge", `${moment(Date.now()).diff(moment(dataUser.age, "DD/MM/YYYY"), 'years')} ans *(${dataUser.age})*`, true)
                                .addField("Sexe", capitalizeFirstLetter(dataUser.sexe), true)
                                .addField("Situation", capitalizeFirstLetter(dataUser.situation), true)
                                .addField("Passion(s)", dataUser.passions, true)
                                .addField("Recherche", dataUser.recherche, true)
                                .addField("Orientation sexuelle", dataUser.sexualOrientation === "deux" ? "Homme/Femme" : capitalizeFirstLetter(dataUser.sexualOrientation), true)
                                .addField("Localisation", capitalizeFirstLetter(dataUser.localisation), true)
                                .addField("Description", capitalizeFirstLetter(dataUser.description))
                                .setImage(dataUser.image)
                                .setFooter(message.author.id)
                        ).then(msg => {
                            msg.react("🚫")
                            msg.react("✅")
                        })
                    });

                    collectorIntro.on('end', reaction => {
                        if (reaction.size === 0) return message.author.send({ embed: client.util.errorMsg(message.author.tag, "temps écoulé, commande annulée.") });
                    });
                    break;
                case "edit":
                    if (author.length === 0) return message.author.send({ embed: client.util.errorMsg(message.author.tag, "Tu n'as crée aucun profil.") });

                    const newDataUser = await editProfil(message, author[0]);
                    if (!newDataUser.prenom) return;

                    client.db.query("UPDATE fz_users SET fz_users_name = ?, fz_users_naissance_date = ?,fz_users_sexe = ?,fz_users_situation = ?,fz_users_passions = ?,fz_users_description = ?,fz_users_recherche = ?,fz_users_sexual_orientation = ?,fz_users_localisation = ?,fz_users_image = ? WHERE fz_users_id_user_discord = ?",
                        [
                            newDataUser.prenom,
                            newDataUser.age,
                            newDataUser.sexe,
                            newDataUser.situation,
                            newDataUser.passions,
                            newDataUser.description,
                            obj_recherche[newDataUser.recherche],
                            newDataUser.sexualOrientation,
                            newDataUser.localisation,
                            newDataUser.image,
                            message.author.id
                        ], async (error, rows) => {
                            if (error) throw error;

                            message.author.send(
                                new MessageEmbed()
                                    .setColor("#f87359")
                                    .setTitle("Modifications terminées ! <:coche_foodiz:843499669203058688>")
                                    .setDescription(`Merci ${message.author}, Ton profil a été mis en état de vérification. Tu devras attendre d'être vérifié afin de recommencer à swipe des utilisateurs etc..`)
                            )

                            const editChannel = await client.guilds.cache.get("844980247400939591").channels.create(message.author.id, { parent: "844980247400939593" });
                            editChannel.send(
                                new MessageEmbed()
                                    .setColor("#f87359")
                                    .setTitle(`Demande de modifications - ${message.author.tag}`)
                                    .addField("Prénom", newDataUser.prenom, true)
                                    .addField("Âge", `${moment(Date.now()).diff(moment(newDataUser.age, "DD/MM/YYYY"), 'years')} ans *(${newDataUser.age})*`, true)
                                    .addField("Sexe", capitalizeFirstLetter(newDataUser.sexe), true)
                                    .addField("Situation", capitalizeFirstLetter(newDataUser.situation), true)
                                    .addField("Passion(s)", newDataUser.passions, true)
                                    .addField("Recherche", newDataUser.recherche, true)
                                    .addField("Orientation sexuelle", newDataUser.sexualOrientation === "deux" ? "Homme/Femme" : capitalizeFirstLetter(newDataUser.sexualOrientation), true)
                                    .addField("Localisation", capitalizeFirstLetter(newDataUser.localisation), true)
                                    .addField("Description", capitalizeFirstLetter(newDataUser.description))
                                    .setImage(newDataUser.image)
                                    .setFooter(message.author.id)
                            ).then(msg => {
                                msg.react("🚫")
                                msg.react("✅")
                            })

                            client.infoModif = new Map();

                            client.infoModif.set(message.author.id, {
                                "name": author[0].fz_users_name,
                                "naissance": author[0].fz_users_naissance_date,
                                "sexe": author[0].fz_users_sexe,
                                "situation": author[0].fz_users_situation,
                                "passions": author[0].fz_users_passions,
                                "description": author[0].fz_users_description,
                                "recherche": author[0].fz_users_recherche,
                                "orientation": author[0].fz_users_sexual_orientation,
                                "localisation": author[0].fz_users_localisation,
                                "image": author[0].fz_users_image,
                            })

                        });
                    break;
                case "trash_user":
                    if (author.length === 0) return message.author.send({ embed: client.util.errorMsg(message.author.tag, "Tu n'as crée aucun profil.") });

                    const suppMsg = await message.author.send(
                        new MessageEmbed()
                            .setColor("#f87359")
                            .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
                            .setDescription("Confirmes-tu vouloir **supprimer** ton profil ?\n\n*Tu perdras toutes les données de ton profil.*")
                    )

                    await suppMsg.react("<:close_foodiz:842902717587259392>");
                    await suppMsg.react("<:coche_foodiz:843499669203058688>");

                    const collector = msg_confirm.createReactionCollector((reaction, user) => user.id === message.author.id && (reaction.emoji.id === "842902717587259392" || reaction.emoji.id === "843499669203058688"), { time: 30000 });

                    collector.on('collect', async reaction => {
                        switch (reaction.emoji.name) {
                            case "close_foodiz":
                                collector.stop();
                                suppMsg.edit({ embed: client.util.successMsg(message.author.tag, "Commande annulée.") })
                                break;
                            case "<:coche_foodiz:843499669203058688>":
                                await client.db.query("DELETE FROM fz_swipes WHERE fz_swipes_id_user_author = ?", [message.author.id], (error, rows) => {
                                    if (error) throw error;
                                });

                                await client.db.query("DELETE FROM fz_swipes WHERE fz_swipes_id_user_cible = ?", [message.author.id], (error, rows) => {
                                    if (error) throw error;
                                });

                                await client.db.query("DELETE FROM fz_users WHERE fz_users_id_user_discord = ?", [message.author.id], (error, rows) => {
                                    if (error) throw error;
                                });

                                message.author.send({ embed: client.util.successMsg(message.author.tag, "Compte supprimé avec succès !") })
                                break;
                        }
                    });

                    collector.on('end', reaction => {
                        if (reaction.size === 0) return message.author.send({ embed: client.util.errorMsg(message.author.tag, "temps écoulé, commande annulée.") });
                    });
                    break;
            }

        });

        collector.on('end', reaction => {
            if (reaction.size === 0) return message.author.send({ embed: client.util.errorMsg(message.author.tag, "temps écoulé, commande annulée.") });
        });

    },
};