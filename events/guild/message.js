const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'message',
    execute(message, client) {

        function checkPermission(message, permissions, member) {
            const missing = message.channel.permissionsFor(member).missing(permissions);
            if (missing.length > 0) {
                return `la ou les permission(s) suivante(s): ${missing.map(perm => `**${perm}**`).join(', ')}`;
            }
            return false;
        }

        const prefix = /* message.guild?.prefix ||  */'.';

        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        if (command.ownerOnly && message.author.id !== "378617147858878465") return;

        if (command.guildOnly && message.channel.type === 'dm') return;

        if (message.channel.type === 'text') {
            if (!message.channel.permissionsFor(message.guild.me).has(["VIEW_CHANNEL", "SEND_MESSAGES"])) return;
        }

        if (command.DMOnly && message.channel.type === 'text') {
            return message.channel.send({ embed: client.util.errorMsg(message.author.tag, "La commande ne peut être exécutée que dans les messages privés du bot.") });
        }

        if (message.channel.type === 'text') {
            if (command.clientPermissions) {
                const needPerms = checkPermission(message, command.clientPermissions, message.guild.me);
                if (needPerms) return message.channel.send({ embed: client.util.errorMsg(message.author.tag, 'Il me manque ' + needPerms) });
            }

            if (command.userPermissions) {
                const needPerms = checkPermission(message, command.clientPermissions, message.member);
                if (needPerms) return message.channel.send({ embed: client.util.errorMsg(message.author.tag, 'Il te manque ' + needPerms) });
            }
        }

        if (command.args && !args.length) {
            let reply = `Tu n'as indiqué aucun argument.`;

            if (command.usage) {
                reply += `\n\n\`\`\`Usage:\n\n> ${prefix}${command.name} ${command.usage}\`\`\``;
            }

            return message.channel.send({ embed: client.util.errorMsg(message.author.tag, reply) });
        }

        try {
            command.execute(client, message, args);
        } catch (error) {
            console.error(error);
            return message.channel.send({ embed: client.util.errorMsg(message.author.tag, "J'ai rencontré une erreur lors de l'exécution de la commande.") });
        }
    },
};