const errorMsg = (user_tag, description) => {
    return {
        color: "#f87359",
        author: {
            name: "Nous avons rencontré une erreur.",
            icon_url: "https://zupimages.net/up/21/19/hee5.png"
        },
        description: `> ${description}`,
        footer: {
            text: `Message d'erreur causé par ${user_tag}.`,
            icon_url: 'https://zupimages.net/up/21/20/wh7n.png',
        }
    };
}

const successMsg = (user_tag, description) => {
    return {
        color: "#FE7089",
        author: {
            name: "Succès !",
            icon_url: "https://zupimages.net/up/21/20/volt.png"
        },
        description: `> ${description}`,
        footer: {
            text: user_tag,
            icon_url: 'https://zupimages.net/up/21/20/wh7n.png',
        }
    };
}

module.exports = { errorMsg, successMsg };