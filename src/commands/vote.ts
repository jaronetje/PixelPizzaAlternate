import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { stripIndents } from "common-tags";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Command } from "../lib/commands/Command";

@ApplyOptions<Command.Options>({
	description: "Vote for the bot",
	cooldownDelay: Time.Minute * 5
})
export class VoteCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(this.defaultChatInputCommand, {
			idHints: ["992383767018749952", "946548302621605970"]
		});
	}

	public override chatInputRun(interaction: CommandInteraction) {
		const { client } = this.container;
		return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor("BLUE")
					.setTitle("Vote links")
					.setDescription(
						stripIndents`
							[Top.GG](https://top.gg/bot/${client.user?.id}/vote)
							[Discord Bot List](https://discordbotlist.com/bots/pixel-pizza/upvote)
							[Discord Bot Labs](https://bots.discordlabs.org/bot/${client.user?.id}/vote)
						`
					)
					.addField(
						"Reward",
						`${
							client.emojis.cache.get(this.container.env.string("ECO_EMOJI"))?.toString() ?? ""
						} ${this.container.env.string("VOTE_REWARD")}`
					)
			]
		});
	}
}
