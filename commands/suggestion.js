const { createEmbed, colors, capitalize, sendEmbed, editEmbed } = require("pixel-pizza");
const { query } = require("../dbfunctions");

module.exports = {
    name: "suggestion",
    description: "show a single suggestion",
    args: true,
    minArgs: 1,
    maxArgs: 1,
    usage: "<suggestion id>",
    cooldown: 0,
    userType: "staff",
    neededPerms: [],
    pponly: false,
    removeExp: false,
    async execute(message, args, client) {
        const embedMsg = createEmbed({
            color: colors.red.hex,
            title: `**${capitalize(this.name)}**`
        });
        const results = await query("SELECT * FROM suggestion WHERE suggestionId = ?", [args[0]]);
        if(!results.length){
            return sendEmbed(editEmbed(embedMsg, {
                description: `Suggestion ${args[0]} could not be found`
            }), message);
        }
        const result = results[0];
        const suggestUser = client.users.cache.get(result.userId);
        let staffMember = "none";
        if(result.staffId) staffMember = client.guildMembers.get(result.staffId) || "Deleted Staff Member";
        sendEmbed(editEmbed(embedMsg, {
            color: colors.blue.hex,
            author: {
                name: suggestUser?.tag || "unknown",
                icon: suggestUser?.displayAvatarURL() || ""
            },
            description: result.suggestion,
            footer: {
                text: `id: ${args[0]} | handled: ${result.handled == 1 ? "yes" : "no"} | staff: ${staffMember.displayName || staffMember}`
            }
        }), message);
    }
}