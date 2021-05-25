const Discord = require('discord.js');
const { MessageEmbed } = require("discord.js");
const util = require("util");
const tags = require('common-tags');

const ms = require('ms');
const moment = require('moment');

const nl = '!!NL!!';
const nlPattern = new RegExp(nl, 'g');

module.exports = {
    name: 'eval',
    description: 'Commande pour exécuter un code.',
    aliases: ['commands'],
    usage: '[command name]',
    category: "<:pinkcrown:843967542472474624> - Propriétaire",
    clientPermissions: ['EMBED_LINKS'],
    ownerOnly: true,
    execute(client, msg, args) {
        const code = args.join(" ");
        if (!code) return msg.channel.send("Aucune Eval indiqué !").then(message => message.delete({ timeout: 3000 }));

        let hrStart = process.hrtime();
        const message = msg;

        const prm = val => {
            if (val instanceof Error) {
                msg.channel.send(
                    new MessageEmbed().setDescription(`Callback error: \`${val}\``)
                );
            } else {
                const result = makeResultMessages(val, process.hrtime(hrStart));
                if (Array.isArray(result)) {
                    msg.channel.send(
                        new MessageEmbed().setDescription(`${result.map(item => (item))}`)
                    );
                } else {
                    msg.channel.send(
                        new MessageEmbed().setDescription(`${result}`)
                    );
                }
            }
        };

        let hrDiff;
        try {
            const hrStart = process.hrtime();
            lastResult = code.match(/await/gmi) ? eval(`(async () => {${code}})()`) : eval(code);
            hrDiff = process.hrtime(hrStart);
        } catch (err) {
            return msg.channel.send(
                new MessageEmbed()
                    .setDescription(`**Evaluating error**\n   ${err}`)
            );
        }

        hrStart = process.hrtime();
        const result = makeResultMessages(lastResult, hrDiff, code);
        if (Array.isArray(result)) {
            return message.channel.send(
                new MessageEmbed()
                    .setDescription(`**Evaluating result**\n   ${result.map(item => (item))}`)
            );
        } else {
            return message.channel.send(
                new MessageEmbed()
                    .setDescription(`**Evaluating result**\n   ${result}`)
            );
        }

        function makeResultMessages(result, hrDiff, input = null) {
            const inspected = util.inspect(result, { depth: 0 }).replace(nlPattern, '\n').replace(sensitivePattern(), '--bahah--');
            const split = inspected.split('\n');
            const last = inspected.length - 1;
            const prependPart = inspected[0] !== '{' && inspected[0] !== '[' && inspected[0] !== "'" ? split[0] : inspected[0];
            const appendPart = inspected[last] !== '}' && inspected[last] !== ']' && inspected[last] !== "'" ? split[split.length - 1] : inspected[last];
            const prepend = `\`\`\`javascript\n${prependPart}\n`;
            const append = `\n${appendPart}\n\`\`\``;

            if (input) {
                return Discord.splitMessage(tags.stripIndent`*Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.*\n\`\`\`javascript\n${inspected}\n\`\`\``, { maxLength: 1900, prepend, append });
            } else {
                return Discord.splitMessage(tags.stripIndent`
                    *Callback executed after ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.*
                    \`\`\`javascript
                    ${inspected}
                    \`\`\`
                `, { maxLength: 1900, prepend, append });
            }
        }

        function sensitivePattern() {
            let pattern = '';
            if (client.token) pattern += escapeRegex(client.token);
            return new RegExp(pattern, 'gi');
        }

        function escapeRegex(str) {
            return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
        }

    }
}
