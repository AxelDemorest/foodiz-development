const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'foodiz-info',
    description: 'Afficher les statistiques totales de foodiz.',
    category: "<:information_foodiz:842899671625629767> - Information",
    clientPermissions: ['EMBED_LINKS'],
    async execute(client, message, args) {

        let users = await client.db.asyncQuery(`SELECT COUNT(*) AS all_users FROM fz_users`).catch(console.error);

        let likes = await client.db.asyncQuery(`SELECT COUNT(*) AS total_likes FROM fz_swipes WHERE fz_swipes_status_swipe  = 'like'`).catch(console.error);

        let dislikes = await client.db.asyncQuery(`SELECT COUNT(*) AS total_dislikes FROM fz_swipes WHERE fz_swipes_status_swipe  = 'dislike'`).catch(console.error);

        let premium = await client.db.asyncQuery(`SELECT COUNT(*) AS total_premium FROM fz_users WHERE fz_users_premium = 'true'`).catch(console.error);

        message.channel.send(
            new MessageEmbed()
                .setColor("#f87359")
                .setAuthor("Statistiques - Foodiz", client.user.avatarURL())
                .setDescription(`
\`\`\`js
Utilisateurs inscrits       ～ ${users[0].all_users}
Nombres de likes envoyés    ～ ${likes[0].total_likes}
Nombres de dislikes envoyés ～ ${dislikes[0].total_dislikes}
Utilisateurs premium        ～ ${premium[0].total_premium}
\`\`\`
`)
                .setThumbnail(client.user.avatarURL({ size: 2048, format: "png" }))
        );

    },
};