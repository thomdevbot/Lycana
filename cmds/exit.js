module.exports = {
    usage: "`<cmd>` : " + __("Makes the bot exit."),
    show: false,
    restricted: true,

    exec: function (msg, values) {
        try {
            msg.channel.send({embed:
                (new Discord.RichEmbed({})).setTitle(' ').setColor("#fef86c")
                    .setDescription(__(":warning: Bot will exit soon."))
            }).catch(throwErr)
            setTimeout(function () {
                client.destroy().then(() => {
                    process.exit()
                }).catch(throwErr)
            }, 2000)
        } catch(e) {
            throwErr(e)
        }
        return true;
    }
}
