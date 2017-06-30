module.exports = {
    usage: "`<cmd>` : " + __("Show the version."),
    calldelete: true,

    exec: function (msg, values) {
        try {
            var pjson = require(APPDIR + '/package.json')
            var emb = new Discord.RichEmbed({
                author: { name: `Version : ${pjson.version}`, icon_url: "http://ml-dev.io/images/icon.png"},
                description: `Github : **[discord-nodebot](https://github.com/dayxhep/discord-nodebot)**`,
                footer: {text: "Created by dayxhep"},
            }).setColor(Do.resolve("color", msg.author.id))

            msg.channel.send({embed: emb}).catch(throwErr)
        } catch(e) {
            throwErr(e)
        }
        return true;
    }
}
