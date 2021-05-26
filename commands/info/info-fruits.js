const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'info-fruits',
    description: 'Connaître les fruits existants.',
    category: "<:information_foodiz:842899671625629767> - Information",
    clientPermissions: ['EMBED_LINKS'],
    execute(client, message, args) {
        
        message.channel.send(
            new MessageEmbed()
            .setColor("#f87359")
            .setTitle("Les fruits")
            .setDescription("**:cherries:・Pour trouver sa moitié.** *#Sérieux*\n\n**:strawberry:・Pour simplement ramener se fraise.** *#Amitié*\n\n**:grapes:・Pour un verre de vin sans se prendre la grappe.** *#Amitié&Sérieux*\n\n**:peach:・Pour une envie de pêcher.** *#CoupDunSoir*\n\n**:watermelon:・Pour des câlins récurrents sans pépins.** *#SexFriend*\n\n**:mango:・Pour une envie d'un mélange sucré.** *#ChercheDeTout*")
        )

    }, 
};