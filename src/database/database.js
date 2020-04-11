const mongoose = require('mongoose');
module.exports = mongoose.connect('mongodb://localhost:27017/discordauth', { useNewUrlParser: true, useUnifiedTopology: true });