const { MessageEmbed } = require("discord.js");
const functionPage = require("../../function.js");

module.exports = {
    name: 'view-match',
    description: 'Lister tous les utilisateurs avec qui tu as matché.',
    category: "<:conversation_foodiz:842900427381014569> - Rencontre",
    DMOnly: true,
    async execute(client, message, args) {

        let user_author = await client.db.asyncQuery(
            `SELECT * FROM fz_users WHERE fz_users_id_user_discord = ${message.author.id}`
        ).catch(console.error);

        if (user_author.length === 0) return message.channel.send({ embed: client.util.errorMsg(message.author.tag, "Tu n'as crée aucun profil, tape la commande \`f-manage-profil\`.") })

        if(!user_author[0].fz_users_match) return message.channel.send({ embed: client.util.errorMsg(message.author.tag, "Tu n'as matché avec personne pour le moment.") })

        const descr = JSON.parse(user_author[0].fz_users_match);
        const pages = [];

        for (let i = 0; i < descr.length; i += 10) {
            pages.push(
                new MessageEmbed()
                    .setColor("#f87359")
                    .setTitle("Tous les utilisateurs avec qui tu as matché")
                    .setDescription(descr.slice(i, i + 10).map((line, index) => `${index + (i + 1)} - <@${line}>`).join('\n'))
            );
        }

        let footer = `${descr.length} matchs`;

        functionPage.pagination(message, pages, footer);

    },
};