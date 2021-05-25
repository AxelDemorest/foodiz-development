const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'support',
    description: 'Rejoindre le serveur support du bot.',
    category: "<:information_foodiz:842899671625629767> - Information",
    clientPermissions: ['EMBED_LINKS'],
    execute(client, message, args) {
        
        message.channel.send(
            new MessageEmbed()
            .setColor("#f87359")
            .setTitle("Informations - support")
            .addField("Serveur Support", "https://discord.gg/vFPXvY9mYR")
            .addField("Ajoute le bot", "[Clique ici](https://discord.com/api/oauth2/authorize?client_id=828236990507646976&permissions=388177&scope=bot)")
        )

    }, 
};