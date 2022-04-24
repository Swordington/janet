// Interaction creation event

const { Client, Interaction } = require('discord.js') // eslint-disable-line no-unused-vars
const { fetchGuild } = require('../Controllers/guild.ctl')

exports.config = {
  event: 'interactionCreate'
}

/**
 *
 * @param {Client} client
 * @param {Interaction} interaction
 */
exports.event = async (client, interaction) => {
  interaction.guild.jcs = await fetchGuild(interaction.guild.id)

  // If it's not a command, stop.
  if (!interaction.isCommand()) return

  let level = 0
  const permOrder = client.gConfig.perms.slice(0).sort((p, c) => p.level < c.level ? 1 : -1)
  while (permOrder.length) {
    const currentLevel = permOrder.shift()
    if (currentLevel.check(interaction)) {
      level = currentLevel.level
      break
    }
  }

  // Grab the command data from the client.container.slashcmds Collection
  const command = client.commands.get(interaction.commandName)

  // If that command doesn't exist, silently exit and do nothing
  if (!command) {
    return await interaction.reply({
      content: 'That command doesn\'t exist!',
      ephemeral: true
    })
  }

  // Since the permission system from Discord is rather limited in regarding to
  // Slash Commands, we'll just utilise our permission checker.
  if (level < client.levelCache[command.config.permLevel]) {
    // Due to the nature of interactions we **must** respond to them otherwise
    // they will error out because we didn't respond to them.
    return await interaction.reply({
      content: 'You do not have permission to perform this action',
      ephemeral: true
    })
  }

  // If everything checks out, run the command
  try {
    client.logger.cmd(`${client.gConfig.perms.find(l => l.level === level).level} | ${interaction.user.tag} [${interaction.user.id}] ran slash command ${interaction.commandName}`)
    await command.cmd(client, interaction, level)
  } catch (e) {
    console.error(e)
    if (interaction.replied) {
      interaction.followUp({ content: `There was a problem with your request.\n\`\`\`${e.message}\`\`\``, ephemeral: true })
        .catch(e => console.error('An error occurred following up on an error', e))
    } else
    if (interaction.deferred) {
      interaction.editReply({ content: `There was a problem with your request.\n\`\`\`${e.message}\`\`\``, ephemeral: true })
        .catch(e => console.error('An error occurred following up on an error', e))
    } else {
      interaction.reply({ content: `There was a problem with your request.\n\`\`\`${e.message}\`\`\``, ephemeral: true })
        .catch(e => console.error('An error occurred replying on an error', e))
    }
  }
}
