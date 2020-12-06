const discord = require("discord.js");
const PixelPizza = require("pixel-pizza");
const { createEmbed, sendEmbed, editEmbed, capitalize, config } = PixelPizza; 
const { red, blue } = PixelPizza.colors; 
const { query } = require("../dbfunctions"); 

module.exports = {
    name: "balancetop",
    description: "look at the balance leaderboard",
    aliases: ["baltop"],
    minArgs: 0, 
    maxArgs: 1, 
    usage: "[page]", 
    cooldown: 60,
    userType: "all",
    neededPerms: [],
    pponly: false,
    removeExp: false,
    /**
     * Execute this command
     * @param {discord.Message} message
     * @param {string[]} args
     * @param {PixelPizza.PPClient} client
     * @returns {Promise<void>}
     */
    async execute(message, args, client) {
        const reactions = ['⬅️', '➡️']; 
        let embedMsg = createEmbed({
            color: red.hex,
            title: `Not a number`,
            description: `${args[0]} is not a number`
        });
        if (args.length && isNaN(parseInt(args[0]))) return sendEmbed(embedMsg, client, message); 
        const pages = []; 
        let page = 0; 
        let name = this.name; 
        const addPage = () => { 
            const embedMsg = createEmbed({
                color: blue.hex,
                title: `**${name}**`,
                description: "```md\n",
                footer: {
                    text: `Page ${page + 1}`
                }
            });
            pages.push(embedMsg); 
        } 
        addPage(); 
        let rank = 0; 
        let itemNumber = 0; 
        const results = await query("SELECT balance, userId FROM `user` ORDER BY balance DESC, userId"); 
        if (!results.length) {
            return sendEmbed(editEmbed(embedMsg, {
                color: blue.hex,
                title: `**${capitalize(this.name)}**`,
                description: `There are no users in the leaderboard`
            }), client, message); 
        }
        for (let result of results) { 
            itemNumber++; 
            let member = client.guildMembers.get(result.userId); 
            if (!member) {
                if(itemNumber == results.length) pages[page].description += "```";
                continue;
            }
            rank++; 
            let user = member.user; 
            let rankString = `#${rank} • ${user.username} • ${config.currency}${result.balance}\n`; 
            if (rank % 10 == 0 || itemNumber == results.length) rankString += "```"; 
            pages[page].description += rankString; 
            if (rank % 10 == 0 && itemNumber != results.length) { 
                page++; 
                addPage(); 
            } 
        }
        page = args.length ? args[0] : 1;
        embedMsg = editEmbed(embedMsg, {
            color: red.hex,
            title: "Page not found"
        });
        if (page < 1) { 
            return sendEmbed(editEmbed(embedMsg, {
                description: `Please use a page number higher than 0`
            }), client, message);
        } 
        if (pages.length < page) { 
            return sendEmbed(editEmbed(embedMsg, {
                description: `page ${page} doesn't exist\nThere are ${pages.length} pages`
            }), client, message);
        } 
        sendEmbed(pages[page - 1], client, message).then(msg => { 
            msg.react(reactions[0]).then(() => msg.react(reactions[1]).then(() => { 
                msg.createReactionCollector((reaction, user) => user.id === message.author.id && reactions.includes(reaction.emoji.name)).on('collect', r => { 
                    switch (r.emoji.name) { 
                        case reactions[0]: 
                            if (page == 1) page = pages.length; 
                            else page--; 
                        break; 
                        case reactions[1]: 
                            if (page == pages.length) page = 1; 
                            else page++; 
                        break; 
                        default: return; 
                    }
                    let newPage = pages[page - 1]; 
                    if (!client.canSendEmbeds) newPage = newPage.description; 
                    msg.edit(newPage); 
                    msg.reactions.removeAll(); 
                    msg.react(reactions[0]).then(() => msg.react(reactions[1])); 
                }); 
            })); 
        }); 
    }
}