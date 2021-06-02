const { MessageEmbed } = require("discord.js");
const moment = require('moment');

module.exports = {
    name: 'display-profil',
    description: 'Afficher son profil.',
    aliases: ['dp'],
    DMOnly: true,
    category: '<:account:848292297208234045> • Compte Foodiz',
    async execute(client, message, args) {

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        const fruits_recherche = {
            "cerise": "🍒",
            "fraise": "🍓",
            "raisin": "🍇",
            "peche": "🍑",
            "pasteque": "🍉",
            "mangue": "🥭",
        }

        let data = await client.db.asyncQuery(`SELECT * FROM fz_users WHERE fz_users_id_user_discord = '${message.author.id}'`).catch(console.error);

        let data_nb_likes = await client.db.asyncQuery(`SELECT COUNT(*) AS nb_likes FROM fz_swipes WHERE fz_swipes_id_user_cible = '${message.author.id}' AND fz_swipes_status_swipe = 'like'`).catch(console.error);

        if(data.length === 0) return message.channel.send({ embed: client.util.errorMsg(message.author.tag, "Tu dois d'abord créer ton profil avant de pouvoir l'afficher.") });

        message.channel.send(
            new MessageEmbed()
            .setColor("#f87359")
            .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
            .setTitle("Ton profil Foodiz <:foodiz:835923851418140702>")
            .setDescription(`Voici toutes les informations liées à ton profil. Elles sont modifiables via la commande \`f-manage-profil\`.\n\n**Nombre de likes :** \`${data_nb_likes[0].nb_likes}\` `)
            .addField("Prénom", data[0].fz_users_name, true)
            .addField("Âge", `${moment(Date.now()).diff(moment(data[0].fz_users_naissance_date, "DD/MM/YYYY"), 'years')} ans *(${data[0].fz_users_naissance_date})*`, true)
            .addField("Sexe", capitalizeFirstLetter(data[0].fz_users_sexe), true)
            .addField("Situation", capitalizeFirstLetter(data[0].fz_users_situation), true)
            .addField("Recherche", fruits_recherche[data[0].fz_users_recherche], true)
            .addField("Orientation sexuelle", data[0].fz_users_sexual_orientation === "deux" ? "Homme/Femme" : capitalizeFirstLetter(data[0].fz_users_sexual_orientation), true)
            .addField("Localisation", capitalizeFirstLetter(data[0].fz_users_localisation), true)
            .addField("Passion(s)", data[0].fz_users_passions)
            .addField("Description", capitalizeFirstLetter(data[0].fz_users_description))
            .setImage(data[0].fz_users_image)
        )
        
    },
};