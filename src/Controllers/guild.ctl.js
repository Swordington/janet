const Guild = require('../Models/guild.model')
const _ = require('lodash')
/**
 * Create & activate a new guild.
 * @param {String} guildID The guild ID to create
 * @param {Number} guildType The type of guild
 * @param {String} activatedBy The user ID of the user who activated the guild.
 * @returns Guild
 */
exports.activateGuild = async (guildID, guildType, activatedBy) => {
  const existGuild = await Guild.findById(guildID)
  if (existGuild !== null) return existGuild
  try {
    const newGuild = new Guild({ _id: guildID })
    newGuild.guildType = guildType
    newGuild.rolloutSpeed = 0
    newGuild.activation.activated = true
    newGuild.activation.activatedBy = activatedBy
    newGuild.activation.activationDate = new Date()
    newGuild.save()
    return newGuild
  } catch (err) {
    throw new Error(err)
  }
}

/**
 * Fetch a guild by ID
 * @param {String} guildID The guild ID to check.
 * @returns Guild
 */
exports.fetchGuild = async (guildID) => {
  const existGuild = await Guild.findById(guildID)
  if (existGuild !== null) return existGuild
  return null
}

/**
 * Update a guild's settings.
 * @param {String} guildID The guild ID to update.
 * @param {Object} node The setting node to update.
 * @param {String} content The content of the settings node to update
 * @returns Guild
 */
exports.updateGuildSettings = async (guildID, node, content) => {
  const guild = await Guild.findById(guildID)
  _.set(guild.settings, node, content)
  await guild.save()
  return guild
}

/**
 * Add a channel to the auto thread settings node
 * This is such an edge case but I'm tired and JS
 * has forced my hand to this BS.
 * @param {String} guildId The guild ID to update.
 * @param {String} id The channel ID to add.
 * @param {Object} threadName The thread name to go with that channel ID
*/
exports.addAutoThreadChannel = async (guildId, id, threadName) => {
  const guild = await Guild.findById(guildId)
  guild.settings.autoThread.channels.push({ id, name: threadName })
  await guild.save()
  return guild
}

/**
 * Remove a channel from the auto thread settings node
 * @param {String} guildId The guild ID to update.
 * @param {String} id The channel ID to remove.
*/
exports.removeAutoThreadChannel = async (guildId, id) => {
  const guild = await Guild.findById(guildId)
  guild.settings.autoThread.channels = guild.settings.autoThread.channels.filter(c => c.id !== id)
  await guild.save()
  return guild
}
