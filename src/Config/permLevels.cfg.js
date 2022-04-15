const { Interaction } = require('discord.js') // eslint-disable-line no-unused-vars

exports.dev = [ // Dev Bot Permissions
  {
    level: 0, // User Level, by default you cannot run a command
    name: 'User',
    check: () => false
  },
  {
    level: 4, // Moderator level, cannot use the development bot
    name: 'Moderator',
    /**
       * @param {Interaction} interaction
       */
    check: () => false
  },
  {
    level: '5',
    name: 'Server Admin',
    /**
     * @param {Interaction} interaction
     * @returns {boolean}
     */
    check: () => false
  },
  { // For bot developers
    level: 20,
    name: 'Developer',
    /**
       * @param {Interaction} interaction
       */
    // checks if the message author is a member of the developers array.
    check: (interaction) => {
      return (interaction.client.gConfig.devs.indexOf(interaction.member.id) > -1)
    }
  }
]

exports.staging = [ // Staging Bot Permissions
  {
    level: 0, // User Level, by default you cannot run a command
    name: 'User',
    check: () => false
  },
  {
    level: 4, // Moderator level, cannot use the staging bot
    name: 'Moderator',
    /**
       * @param {Interaction} interaction
       */
    check: () => false
  },
  {
    level: '5',
    name: 'Server Admin',
    /**
     * @param {Interaction} interaction
     * @returns {boolean}
     */
    check: () => false
  },
  { // For bot developers
    level: 20,
    name: 'Developer',
    /**
       * @param {Interaction} interaction
       */
    // checks if the message author is a member of the developers array.
    check: (interaction) => {
      return (interaction.client.gConfig.devs.indexOf(interaction.member.id) > -1)
    }
  }
]

exports.prod = [ // Prod Bot Permissions
  {
    level: 0, // Basic level command; return true automatically so all users can run.
    name: 'User',
    check: () => true
  },
  {
    level: 4,
    name: 'Moderator',
    /**
     * @param {Interaction} interaction
     */
    check: (interaction) => {
      try {
        // Since different branches decide moderator differently,
        // we're going to specify a permission node as opposed to a role ID.
        const perms = interaction.user.id
        return (perms.has('KICK_MEMBERS', true))
      } catch (e) {
        return false
      }
    }
  },
  {
    level: '5',
    name: 'Server Admin',
    /**
     * @param {Interaction} interaction
     * @returns {boolean}
     */
    check: (interaction) => {
      try {
        // Since different branches decide server admin differently,
        // we're going to specify a permission node as opposed to a role ID.
        const perms = interaction.user.id
        return (perms.has('ADMINISTRATOR', true))
      } catch (e) {
        return false
      }
    }
  },
  { // For bot developers
    level: 20,
    name: 'Developer',
    /**
     * @param {Interaction} interaction
     */
    // checks if the message author is a member of the developers array.
    check: (interaction) => {
      return (interaction.client.gConfig.devs.indexOf(interaction.member.id) > -1)
    }
  }
]
