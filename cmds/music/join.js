module.exports = {
    usage: "`<cmd> [VoiceChannel]` : " + __("Ask to the bot to join the vocal channel."),

    exec: function (msg, values) {
        try {
            if(values[1]) {
                var channel = Do.resolve('channel', {'name': values[1], 'type':'voice' })
                if(channel) channel.join().then((connection) => {
                    client.vc = connection
                }).catch(throwErr)
                else msg.channel.send({embed:
                    embErr(":x: : " + __("Voice channel not found."))
                }).catch(throwErr)
            } else {
                var gm = Do.resolve('user', msg.author.id)
                if(gm && gm.voiceChannel) {
                    gm.voiceChannel.join().then((connection) => {
                        client.vc = connection;
                    }).catch(throwErr)
                }
            }
        } catch(e) {
            throwErr(e)
        }
        return true
    }
}
