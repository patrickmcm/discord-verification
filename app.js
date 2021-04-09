const express = require('express')
const request = require('request')
const app = express()
const axios = require('axios')
const bodyParser = require('body-parser');
const Discord = require('discord.js');
const config = require('./config.json')
const client = new Discord.Client();
var discordid

app.use(bodyParser.urlencoded({extended: true}));

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildMemberAdd', member => {
    const embed = new Discord.MessageEmbed()
        .setTitle("Verification")
        .setDescription(`This server uses an automated reCAPTCHA v2 verification system. [Get Verified](${config.redirect_uri})`) // make sure to replace with your endpoint
        .setColor("#2F3136")
        .setFooter("Verification systems","https://i.imgur.com/IZIKIo8.png")
    member.send(embed);
});

app.get('/verify',(req,res) => {
    var code = req.query.code
    var options = { method: 'POST',
    url: 'https://discord.com/api/oauth2/token',
    headers: 
    { 'content-type': 'application/x-www-form-urlencoded' },
    form: 
        { client_id: config.client_id,
        client_secret: config.client_secret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: config.redirect_uri,
        scope: 'identify' } };

    request(options, function (error, response, body) {
    if (error) throw new Error(error);
    var parsed = JSON.parse(body)
    var options = { method: 'GET',
    url: 'https://discord.com/api/users/@me',
    headers: 
    {authorization: `Bearer ${parsed.access_token}` } };

    request(options, function (error, response, body) {
    if (error) throw new Error(error);
    if(response.statusCode != 200){ 
        res.redirect(`https://discord.com/oauth2/authorize?client_id=${config.client_id}&redirect_uri=${config.redirect_uri}&response_type=code&scope=identify`)
        return
    }
    var parsed = JSON.parse(body)
    discordid = parsed.id
    res.sendFile('/html/captcha.html',{root: __dirname })
    });
});
})

app.post('/verify', (req,res) => {
    var options = { method: 'POST',
    url: 'https://www.google.com/recaptcha/api/siteverify',
    headers: 
    {'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
    formData: 
    { secret: config.google_secret,
        response: req.body["g-recaptcha-response"] } };

    request(options, async function (error, response, body) {
    if (error) throw new Error(error);
    const parsed = JSON.parse(body)
    if(parsed.success){
        res.send(`Verified with id ${discordid} return to the discord`)
        console.log(`user ${discordid} passed the captcha`)
        const guild = await client.guilds.fetch(config.guild_id)
        const member = await guild.members.fetch(discordid)
        member.roles.add(config.verifiedRole_id,`user is verified`)
        const embed = new Discord.MessageEmbed()
        .setTitle("Verification")
        .setDescription("Verified, roles given.")
        .setColor("#4BB543")
        .setFooter("Verification systems","https://i.imgur.com/IZIKIo8.png")
        member.send(embed);
    } else {
        res.redirect('/verify')
        console.log(`user ${discordid} failed the captcha`)
    }
});
})

app.listen(process.env.PORT || 3000)
client.login(config.bot_token);
