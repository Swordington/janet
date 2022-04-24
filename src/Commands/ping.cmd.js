const { MessageEmbed, Client, Interaction } = require('discord.js') // eslint-disable-line no-unused-vars
const { SlashCommandBuilder } = require('@discordjs/builders')

/**
 * @param {Client} client
 * @param {Interaction} interaction
 */
exports.cmd = async (client, interaction) => {
  // This looks better than if its Ephemeral
  // Fuck you javascript
  await interaction.deferReply()

  const embed = new MessageEmbed()
    .setTitle('<a:loading:847920635622719559> Ping?')
    .setDescription('Look ma! I\'m loading something!')
    .setColor(interaction.guild.me.displayColor)
    .setFooter({ text: `${client.gConfig.name}` })
    .setTimestamp()

  const reply = await interaction.editReply({ embeds: [embed] })

  embed
    .setColor('GREEN')
    .setTitle('Pong!')
    .setDescription('')
    .addField('Latency', `\`${reply.createdTimestamp - interaction.createdTimestamp}ms\``, true)
    .addField('Discord Latency', `\`${Math.round(client.ws.ping)}ms\``, true)
    .setFooter({ text: `${client.gConfig.name} | ${client.gConfig.description}` })
    .setTimestamp()
  interaction.editReply({ embeds: [embed] })
}

exports.config = {
  permLevel: 0,
  restricted: false
}

exports.cmdData = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Checks the latency of the bot and connected services.')
