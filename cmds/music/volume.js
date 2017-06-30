module.exports = {
    usage: "`<cmd> [0 - 200]` : " + __("Change the music volume."),

    exec: function (msg, values) {
        try {
            if(values[1] !== undefined) {
                var n = parseInt(values[1])
                if(!isNaN(n) && n >= 0 && n <= 200) {
                    client.audio.setVolume((n / 100), (err, newVolume) => {
                        msg.channel.send({ embed:
                            embMsg(`${msg.author}, ` + __("volume changed to :") + ` ${parseInt(newVolume * 100)}%`)
                        }).catch(throwErr)
                    })
                }
            } else {
                var v = client.audio.dispatcher ? client.audio.dispatcher.volume :
                    client.audio.volume
                msg.channel.send({ embed:
                    embMsg(`${msg.author}, ` + __("actual volume :") + ` ${parseInt(v * 100)}%`)
                }).catch(throwErr)
            }
        } catch(e) {
            throwErr(e)
        }
        return true
    }
}
