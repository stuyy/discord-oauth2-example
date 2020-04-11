const router = require('express').Router();
const { getPermissions } = require('../utils/utils');

function isAuthorized(req, res, next) {
    if(req.user) {
        console.log("User is logged in.");
        console.log(req.user);
        next();
    }
    else {
        console.log("User is not logged in.");
        res.redirect('/');
    }
}

router.get('/', isAuthorized, (req, res) => {

    const { guilds } = req.user;
    const guildMemberPermissions = new Map();
    guilds.forEach(guild => {
        const perm = getPermissions(guild.permissions);
        guildMemberPermissions.set(guild.id, perm);
    });

    res.render('dashboard', {
        username: req.user.username,
        discordId: req.user.discordId,
        guilds: req.user.guilds,
        permissions: guildMemberPermissions
    });
});

router.get('/settings', isAuthorized, (req, res) => {
    res.send(200);
});

module.exports = router;