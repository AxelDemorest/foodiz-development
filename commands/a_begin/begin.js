const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'begin',
    description: 'Quelques informations pour bien débuter.',
    category: "<:playbutton:846833632999243797> - Débuter avec Foodiz",
    clientPermissions: ['EMBED_LINKS'],
    execute(client, message, args) {
        
        message.channel.send(
            new MessageEmbed()
            .setColor("#f87359")
            .setTitle("Bien débuter avec Foodiz <:foodiz:835923851418140702>")
            .setDescription("Tu découvres **Foodiz** et tu aimerais savoir comment l'utiliser ? Je te propose ces quelques explications afin que tu puisses bien débuter.")
            .addField("• Étape 1 : Inscription", "Avant toute chose, tu dois concevoir ton profil afin que tu puisses découvrir d'autres utilisateurs. Je t'invite à envoyer la commande `f-manage-profil` puis suis les instructions en privé.")
            .addField("• Étape 2 : Swipes", "Maintenant que ton profil est crée et vérifié, tu peux désormais découvrir d'autres utilisateurs. En envoyant la commande `f-swipe` en message privé, tu peux choisir d'aimer ou non un utilisateur selon tes recherches. Si tu aimes un utilisateur et que c'est réciproque, il y aura un match et tu découvriras le pseudo discord de la personne pour l'ajouter en ami pour discuter.")
            .addField("• Étape 3 : Autres commandes", "Tu connais maintenant le fonctionnement principal du bot. Nous avons ajouté quelques options supplémentaires afin que l'immersion soit totale ! Pour découvrir ces commandes, je t'invite à taper la commande `f-help`.")
            .addField("• Attention :", "95% des commandes du bot s'exécutent en message privé, si tu as fermé tes messages privés, le bot sera inutilisable.")
        )

    }, 
};