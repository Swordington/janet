/**
 * Copyright (C) 2022 Quinn H. All rights reserved.
 *
 * Janet can not be copied and/or distributed without the express
 * permission of Quinn H <quinn@swordington.net>
 *
 */

 require('dotenv').config()

 const Discord = require('discord.js')
 const { promisify } = require('util')
 const readdir = promisify(require('fs').readdir)
 const { Signale } = require('signale')
 const mongoose = require('mongoose')
 const LCL = require('last-commit-log')
 const lcl = new LCL()
 
 console.log('Joe Cap is starting')
 
 // Builds our client w/ required intents, etc.
 const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILD_BANS, Discord.Intents.FLAGS.GUILD_INTEGRATIONS, Discord.Intents.FLAGS.GUILD_WEBHOOKS, Discord.Intents.FLAGS.GUILD_VOICE_STATES, Discord.Intents.FLAGS.GUILD_PRESENCES, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Discord.Intents.FLAGS.DIRECT_MESSAGES, Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING] })
 
 // Assigns gConfig to the config
 client.gConfig = require('./Config/main.cfg')
 
 client.logger = new Signale(client.gConfig.logger)
 
 client.logger.log('LAUNCHING JANET')
 client.logger.log(`(C) ${new Date().getFullYear()} - Quinn H.`)
 client.logger.log('')
 client.logger.log('================================\n')
 
 // Create command collection
 client.commands = new Discord.Collection()
 
 // Init function because async bullshit
 const init = async () => {
   mongoose.connect(process.env.MONGO_URL)
 
   client.mongooseConnection = mongoose.connection
 
   switch (process.env.MODE) {
     case 'DEV':
       client.logger.load('JANET IS STARTING IN DEV MODE')
       break
 
     case 'STAGING':
       client.logger.load('JANET IS STARTING IN STAGING MODE')
       break
     case 'PROD':
       client.logger.load('JANET IS STARTING IN PRODUCTION MODE')
       break
 
     default:
       throw new Error('THERE IS NOT A VALID MODE SET IN THE .env FILE!')
   }
 
   client.gConfig.commit = await lcl.getLastCommit()
 
   // Read all commands in the commands folder
   const cmdFiles = await readdir('./src/Commands')
   client.logger.load(`Loading a total of ${cmdFiles.length} commands.`)
 
   cmdFiles.forEach(file => {
     if (!file.endsWith('.js')) return // If it's not a js file then bad
 
     const cmd = require(`./Commands/${file}`)
     const commandName = file.split('.')[0] // Grab the command name from the file name
     client.logger.load(`Loading command: ${commandName}`)
 
     client.commands.set(commandName, cmd)
   })
 
   // Read all events in the events folder
   const evtFiles = await readdir('./src/Events')
   client.logger.load(`Loading a total of ${evtFiles.length} events.`)
 
   evtFiles.forEach(file => {
     if (!file.endsWith('.js')) return // If it's not a js file then bad
 
     const evt = require(`./Events/${file}`)
     const eventName = evt.config.event // Pull event name from config object
     client.logger.load(`Loading event: ${eventName}`)
 
     client.on(eventName, evt.event.bind(null, client))
   })

   // Builds the permission level cache, which will be used to determine if a
   // user has permission to use a command, or can override a chat filter.
   client.logger.load(`Loading permissions cache [${client.gConfig.perms.length} levels]`)
   client.levelCache = {}
   for (let i = 0; i < client.gConfig.perms.length; i++) {
     const thisLevel = client.gConfig.perms[i]
     client.levelCache[thisLevel.level] = thisLevel.level
   }
 
   // Log into the discord gateway with the token
   // If this doesn't happen last Discord fucks us over
   client.login(client.gConfig.token)
 }
 
 init()
 