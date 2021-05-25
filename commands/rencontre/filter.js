const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'filter',
    description: 'Ajouter des filtres pour les swipes.',
    aliases: ['commands'],
    usage: '[filter 1] [filter 2] / ["delete"] [filter 1 | "all"]',
    category: '<:conversation_foodiz:842900427381014569> - Rencontre',
    DMOnly: true,
    async execute(client, message, args) {

        let data = await client.db.asyncQuery(`SELECT * FROM fz_users WHERE fz_users_id_user_discord = '${message.author.id}'`).catch(console.error);

        if (data.length === 0) return message.channel.send({ embed: client.util.errorMsg(message.author.tag, "Tu dois d'abord créer ton profil avant de pouvoir l'afficher.") });

        const filterObj = JSON.parse(data[0].fz_users_filters) || {};

        let array_args_1 = ["sexe", "recherche"];

        let array_sexe = ["homme", "femme"];

        const obj_recherche = {
            "🍒": "cerise",
            "🍓": "fraise",
            "🍇": "raisin",
            "🍑": "peche",
            "🍉": "pasteque",
            "🥭": "mangue",
        }

        let array_recherche = ["🍒", "🍓", "🍇", "🍑", "🍉", "🥭"];

        if (args.length === 0) return message.channel.send(
            new MessageEmbed()
                .setColor("#f87359")
                .setTitle("Options de filtres")
                .setDescription("Configure tes filtres afin de cibler les résultats dans les swipes.\n\n<:diamond_premium:843067033125126175>・Fonctionnalité premium.\n\n**Options:**\n`Sexe`・[`homme`,`femme`]\n`Recherche`・[`🍓`,`🍇`,`🍑`,`🍉`,`🥭`]  <:diamond_premium:843067033125126175>\n\n**Usage:**```filter filtre1 filtre2```\n**Exemples:**```filter sexe femme\nfilter recherche 🍓\nfilter delete sexe // Supprimer le filtre sexe\nfilter delete all // Supprimer tous les filtres```\n*D'autres filtres seront disponibles ultérieurement.*")
        )

        if (args[0] === "delete" && args[1].toLowerCase() !== 'all' && !array_args_1.includes(args[1].toLowerCase())) {

            return message.channel.send({ embed: client.util.errorMsg(message.author.tag, "Mauvaise catégorie de filtre.") });

        } else if (args[0] === "delete" && array_args_1.includes(args[1].toLowerCase())) {

            delete filterObj[args[1].toLowerCase()];

            return client.db.query("UPDATE fz_users SET fz_users_filters = ? WHERE fz_users_id_user_discord = ?", [Object.keys(filterObj).length === 0 ? null : JSON.stringify(filterObj), message.author.id], (error, rows) => {
                if (error) throw error;

                message.channel.send({ embed: client.util.successMsg(message.author.tag, `Le filtre \`${args[1].toLowerCase()}\` a été supprimé avec succès!`) });
            })

        }

        if (args[0] === "delete" && args[1].toLowerCase() === "all") {

            return client.db.query("UPDATE fz_users SET fz_users_filters = ? WHERE fz_users_id_user_discord = ?", [null, message.author.id], (error, rows) => {
                if (error) throw error;

                message.channel.send({ embed: client.util.successMsg(message.author.tag, "Tous les filtres ont été supprimés avec succès!") });
            })

        }

        if (!array_args_1.includes(args[0].toLowerCase())) return message.channel.send({ embed: client.util.errorMsg(message.author.tag, "Mauvaise catégorie de filtre.") });

        if (!array_sexe.includes(args[1].toLowerCase()) && !array_recherche.includes(args[1].toLowerCase())) return message.channel.send({ embed: client.util.errorMsg(message.author.tag, "Le filtre est introuvable.") });

        if (args[0].toLowerCase() === "recherche" && data[0].fz_users_premium === "false") return message.channel.send({ embed: client.util.errorMsg(message.author.tag, "Tu dois posséder la version premium afin de filtrer avec recherche.") });

        if (args[0].toLowerCase() === "sexe" && !array_sexe.includes(args[1].toLowerCase())) return message.channel.send({ embed: client.util.errorMsg(message.author.tag, "Le filtre est introuvable.") });

        if (args[0].toLowerCase() === "recherche" && !array_recherche.includes(args[1])) return message.channel.send({ embed: client.util.errorMsg(message.author.tag, "Le filtre est introuvable.") });

        filterObj[args[0].toLowerCase()] = args[0].toLowerCase() === "recherche" ? obj_recherche[args[1]] : args[1].toLowerCase();

        client.db.query("UPDATE fz_users SET fz_users_filters = ? WHERE fz_users_id_user_discord = ?", [JSON.stringify(filterObj), message.author.id], (error, rows) => {
            if (error) throw error;

            message.channel.send({ embed: client.util.successMsg(message.author.tag, "Le filtre a été sauvegardé avec succès!") });
        })

    },
};