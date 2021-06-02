const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'help',
	description: 'S\'informer sur toutes les commandes disponibles.',
	usage: '[commande]',
	aliases: ['h'],
	category: "<:info:848295171304325160> • Information",
	clientPermissions: ['EMBED_LINKS', 'USE_EXTERNAL_EMOJIS'],
	execute(client, message, args) {
		const { commands } = client;

		const prefix = /* message.guild?.prefix ||  */'f-';

		const embed = new MessageEmbed()
			.setColor("#f87359")
			.setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
			.setTitle(`Besoin d'aide ?`)
			.setDescription(`Utilise \`${prefix}help <command>\` pour plus d'informations.\n\n**Important**: La presque totalité des commandes doit s'utiliser dans les messages privés du bot. Si les tiens sont fermés, le bot sera inutilisable.\n\n**À noter:** Les commandes possédants une fonctionnalité premium sont accompagnées de l'emoji "<:diamond_premium:843067033125126175>".`)
		client.categories.filter(category => message.author.id !== "378617147858878465" ? category !== "<:pinkcrown:843967542472474624> - Propriétaire" : category).map(cat => {
			embed.addField(`• ${cat}`, client.commands.filter(cmd => cmd.category === cat).map(cmd => `> \`${cmd.name}\` : ${cmd.description} ${cmd.premium ? "<:diamond_premium:843067033125126175>" : ""}`).join('\n'))
		});
		embed.setThumbnail(client.user.avatarURL({ size: 2048, format: "png" }))

		if (!args.length) {
			return message.channel.send(embed);
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) return message.channel.send({ embed: client.util.errorMsg(message.author.tag, "La commande est introuvable.") });

		/* data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`); */

		message.channel.send(
			new MessageEmbed()
				.setColor("#f87359")
				.setAuthor("Information de la commande", "https://zupimages.net/up/21/20/eg9f.png")
				.setTitle(`Commande - ${command.name}`)
				.setDescription(`
__**Alias :**__ ${command.aliases ? command.aliases.join(', ') : "Aucun alias"}
__**Description :**__ ${command.description ? command.description : "Aucune description"}
__**Usage :**__ \`${command.usage ? command.usage : "Aucun usage"}\`
__**Catégorie :**__ ${command.category}
`)
				.setFooter("<> = Obligatoire, [] = Facultatif")
		);
	},
};