const mongoose = require('mongoose')

const Schema = mongoose.Schema

const guildSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  guildType: {
    type: Number, // 0 = normal server, 1 = elevated access, 2 = dev server
    required: true,
    default: 0
  }

}, {
  timestamps: true
})

const Guild = mongoose.model('Guild', guildSchema)
module.exports = Guild
