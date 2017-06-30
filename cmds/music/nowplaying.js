module.exports = {
    usage: "`<cmd>` : " + __("Now playing music name."),

    exec: function (msg, values) {
        try {
            if(client.audio.showPlaying) {
                var np = client.audio.playing
                if(np) {
                    var icn = (np.type == 'youtube')? YT_ICON : SC_ICON
                    var time = client.audio.dispatcher ? client.audio.dispatcher.time : 0
                    var embNp = new Discord.RichEmbed({})
                    embNp.setColor(Do.resolve("color", msg.author.id))
                        .setAuthor(__("Playing music") + ":", icn)
                        .setThumbnail(np.img)
                        .setDescription([
                            `[\`${(parseInt(time/1000)+'').strToTime()}\`/\`${np.time.strToTime()}\`] **[${np.title}](${np.link})**`,
                            __("Add by") + __(" <@%s>", [np.author]),
                        ].join("\n"))
                    msg.channel.send({embed: embNp}).catch(throwErr)
                } else {
                    msg.channel.send({embed:
                        embErr(":x: : " + __("Currently not playing."))
                    }).catch(throwErr)
                }
            } else {
                msg.channel.send({embed:
                    embMsg(__("Find it alone :smirk:"))
                }).catch(throwErr)
            }
        } catch(e) {
            throwErr(e)
        }
        return true
    }
}
