const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'about',
    description: 'Quelques informations concernant Foodiz.',
    category: "<:information_foodiz:842899671625629767> - Information",
    clientPermissions: ['EMBED_LINKS'],
    execute(client, message, args) {
        
        message.channel.send(
            new MessageEmbed()
            .setColor("#f87359")
            .setTitle("Informations - Foodiz")
            .setDescription("<@828236990507646976> a de base été développé pour compléter le serveur communautaire de Foodiz. **Cyra**, le fondateur, a eu l'idée d'élargir la visbilité du bot afin que d'autres serveurs puissent profiter de ce système de rencontre.\n\nDepuis la création de ce bot, Cyra a divisé Foodiz en 3 serveurs, communautaire, support et développement. Foodiz est désormais devenu une petite organisation.\n\nConcernant le fonctionnement du bot, c'est une petite application de rencontre. Vous pouvez gérer votre profil, swipe des utilisateurs, matcher avec eux, filtrer vos recherches etc...")
            .addField("• Golden Pass <:goldenpass:846874967711023124>", "Ce pass est un supplément payant, grâce à lui, tu pourras voir ce que recherchent les utilisateurs et utiliser la commande pour voir les personnes qui t'ont liké.")
        )

    }, 
};