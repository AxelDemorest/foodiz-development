const { MessageEmbed } = require("discord.js");
const cooldowns = require('quick.db');


module.exports = {
    name: 'test',
    description: 'Rejoindre le serveur support du bot.',
    category: "<:information_foodiz:842899671625629767> - Information",
    clientPermissions: ['EMBED_LINKS'],
    async execute(client, message, args) {

        const isCooldown = cooldown(message.author, 'get');

        if (isCooldown) {
            return message.channel.send(`Veuillez attendre ${isCooldown.days} jour(s), ${isCooldown.hours} heure(s), ${isCooldown.minutes} minute(s) et ${isCooldown.seconds} seconde(s).`);
        } else {
            message.channel.send("Tu n'es pas sous cooldown.");
            cooldown(message.author, 'set');
        }

        function cooldown(user, action) {
            if (!cooldowns instanceof Map) return false;
        
            switch (action) {
                case 'get':
                    const cd = cooldowns.get(user.id);
                    if (!cd || (432000000 - (Date.now() - cd.start) <= 0)) return false;
        
                    const distance = 432000000 - (Date.now() - cd.start),
                            days = Math.floor((distance % (1000 * 60 * 60 * 60 * 24)) / (1000 * 60 * 60 * 24)),
                            hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                            minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                            seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
                    return { days, hours, minutes, seconds }
        
                case 'set':
                    return cooldowns.set(user.id, { start: Date.now() });
            }
        }

    },
};