async function pagination(msg, pages, footer, timeout = 120000) {
    if (!msg && !msg.channel) throw new Error('Channel is inaccessible.');
    const emojiList = ['<:leftarrow:845035422199316491>', '<:rightarrow:845035422484660285>', '<:close_foodiz:842902717587259392>'];
    const emojiName = ['leftarrow', 'rightarrow', 'close_foodiz'];

    let page = 0;
    const curPage = await msg.channel.send(pages[page].setFooter(`Page ${page + 1} / ${pages.length}${footer ? `\n${footer}` : ''}`));

    for (const emoji of emojiList) await curPage.react(emoji);
    const removeReact = function(reaction, type) {
        switch(type) {
            case 'all':
                if (msg.channel.type !== 'dm') curPage.reactions.removeAll().catch(()=>{});
                break;

            case 'one':
                if (msg.channel.type !== 'dm') reaction.users.remove(msg.author).catch(()=>{});
        }
    }
    const reactionCollector = curPage.createReactionCollector((reaction, user) => emojiName.includes(reaction.emoji.name) && !user.bot && user.id === msg.author.id, { idle: timeout });
    reactionCollector.on('collect', reaction => {
        switch (reaction.emoji.name) {
            case emojiName[0]:
                page = page > 0 ? --page : pages.length - 1;
                removeReact(reaction, 'one');
                break;
            case emojiName[1]:
                page = page + 1 < pages.length ? ++page : 0;
                removeReact(reaction, 'one');
                break;

            case emojiName[2]:
                reactionCollector.stop();
                break;

            default:
                break;
        }
        curPage.edit(pages[page].setFooter(`Page ${page + 1} / ${pages.length}${footer ? `\n${footer}` : ''}`));
    });
    reactionCollector.on('end', () => removeReact(null, 'all'));
    return curPage;
}

module.exports = { pagination };