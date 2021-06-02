const { MessageEmbed } = require("discord.js");
var osu = require('node-os-utils')
var cpu = osu.cpu
const moment = require('moment');
require("moment-duration-format");
moment.locale('fr');

module.exports = {
    name: 'bot-info',
    description: 'Afficher les informations concernant le bot.',
    category: "<:info:848295171304325160> • Information",
    clientPermissions: ['EMBED_LINKS'],
    async execute(client, message, args) {
        const { commands } = client;

        const cpuPercentage = await cpu.usage();

        const embed_info_bot = new MessageEmbed()
            .setColor("#f87359")
            .setAuthor("Information - Foodiz", client.user.avatarURL())
            .setDescription(`**Fondateur et Développeur** ・ <@378617147858878465>
**Date de création** ・ \`${moment(client.user.createdAt).format('DD MMMM YYYY')}\`
**Version** ・ \`1.0.0\`
**Librairie** ・ [Discord.js](https://discord.js.org/#/docs/main/stable/general/welcome)

―――――――――――――――――――――――――――

\`\`\`js
╭
|  Serveurs     ～ ${client.guilds.cache.size}
|  Utilisateurs ～ ${client.users.cache.size}
|  Salons       ～ ${client.channels.cache.size}
|  Commandes    ～ ${commands.map(command => command.name).length}
|  Mémoire      ～ ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
|  Uptime       ～ ${moment.duration(client.uptime).format("D [d], H [h], m [m], s [s]")}
|  Usage CPU    ～ ${Math.round(cpuPercentage)} %
╰
\`\`\`
*s/o <@240826488557928449> pour avoir contribué au développement du bot.*
`)
            .setThumbnail(client.user.avatarURL({ size: 2048, format: "png" }))
        message.channel.send(embed_info_bot);
    },
};