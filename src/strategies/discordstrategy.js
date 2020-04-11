const DiscordStrategy = require('passport-discord').Strategy;
const passport = require('passport');
const DiscordUser = require('../models/DiscordUser');

passport.serializeUser((user, done) => {
    console.log("Serialize");
    done(null, user.id)
});

passport.deserializeUser(async (id, done) => {
    console.log("Deserializing");
    const user = await DiscordUser.findById(id);
    if(user) 
        done(null, user);
});

passport.use(new DiscordStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CLIENT_REDIRECT,
    scope: ['identify', 'guilds']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await DiscordUser.findOne({ discordId: profile.id });
        if(user)
        {
            console.log("User exists.");
            await user.updateOne({
                username: `${profile.username}#${profile.discriminator}`,
                guilds: profile.guilds
            });
            done(null, user);
        }
        else {
            console.log("User does not exist");
            const newUser = await DiscordUser.create({
                discordId: profile.id,
                username: profile.username,
                guilds: profile.guilds
            });
            const savedUser = await newUser.save();
            done(null, savedUser);
        }
    }
    catch(err) {
        console.log(err);
        done(err, null);
    }
}));