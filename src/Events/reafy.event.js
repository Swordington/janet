const { Client } = require('discord.js') // eslint-disable-line no-unused-vars
const { fetchGuild } = require('../Controllers/guild.ctl')
const { refreshCache } = require('../Controllers/uuidCache.ctl')

exports.config = {
  event: 'ready'
}

/**
 *
 * @param {Client} client
 */
exports.event = async client => {
  // Log that the bot is online and sets the status.
  client.logger.ready(`${client.user.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers with ${client.commands.size} commands.`)

  switch (process.env.MODE) {
    case 'DEV':
      client.user.setActivity(`Joe Cap Dev | v.${client.gConfig.commit.shortHash}`, { type: 'PLAYING' })
      break
    case 'STAGING':
      client.user.setActivity(`Capollo Media | ${client.gConfig.commit.shortHash}`, { type: 'WATCHING' })
      break
    case 'PROD':
      client.user.setActivity('Capollo Media', { type: 'WATCHING' })
      break
    default:
      throw new Error('I don\'t how we got here, but something is very very wrong.')
  }

  // Slash command refresh code
  const { REST } = require('@discordjs/rest')
  const { Routes } = require('discord-api-types/v9')

  const rest = new REST({ version: '9' }).setToken(client.gConfig.token);

  (async () => {
    try {
      client.logger.load('Started refreshing application (/) commands.')

      client.guilds.cache.forEach(async g => {
        g.jcs = await fetchGuild(g.id)
        const commandData = []

        client.commands.forEach(c => {
          if (c.config.restricted === true && g.jcs.guildType === 0) return
          commandData.push(c.cmdData.toJSON())
        })
        try {
          await rest.put(
            Routes.applicationGuildCommands(client.user.id, g.id),
            { body: commandData }
          )
          client.logger.load(`Loaded ${commandData.map(g => g.name).join(', ')} for ${g.name} [${g.id}]`)
        } catch (err) {
          client.logger.error(`Failed to reload commands for ${g.name} [${g.id}]`)
          client.logger.error(err)
        }
      })

      client.logger.load('Successfully reloaded application (/) commands.')
    } catch (error) {
      console.error(error)
    }
  })()
  await refreshCache(client)
}
