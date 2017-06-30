const Fs = require('fs')

module.exports = {
    usage: "`<cmd> {nb}` : " + __('Stop your currently playing music, if "nb" is specified delete your "nb" first songs in the queue'),

    exec: function (msg, values) {
        try {
            if(values[1]) {
                var nb = parseInt(values[1])
                var quMusics = client.audio.queue.getQu()
                var newQu = []
                if(!isNaN(nb) && nb > 0 && quMusics.length > 0) {
                    var nbDel = (quMusics.length > nb)? nb : quMusics.length
                    var final = 0
                    quMusics.forEach(elem => {
                        if(nbDel > 0 && elem.author == msg.author.id) {
                            final++
                            nbDel--
                            if(elem.file) {
                                Fs.unlink(elem.file, (e) => {
                                    if(e) throwErr(e)
                                })
                            }
                        } else newQu.push(elem)
                    })
                    if(final > 0) {
                        client.audio.queue.setQu(newQu)
                        if(final == 1) msg.channel.send({embed:
                            embMsg(":white_check_mark: : " + __("<@%s> decided to remove his music from queue.", [msg.author.id]))
                        }).catch(throwErr)
                        else msg.channel.send({embed:
                            embMsg(":white_check_mark: : " + __("<@%s> decided to remove  %s of his musics from queue.", [msg.author.id, final]))
                        }).catch(throwErr)
                    } else msg.channel.send({embed:
                        embErr(":x: : " + __("No music added by you."))
                    }).catch(throwErr)
                } else msg.channel.send({embed:
                    embErr(":x: : " + __("Number of music to remove invalid."))
                }).catch(throwErr)
            } else {
                if(client.audio.playing) {
                    if(client.audio.playing.author == msg.author.id) {
                        client.audio.next()
                        msg.channel.send({embed:
                            embMsg(`:white_check_mark: : ` + __("<@%s> decided to skip his song.", [msg.author.id]))
                        }).catch(throwErr)
                    } else msg.channel.send({embed:
                        embErr(":x: : " + __("This music was not add by you :/"))
                    }).catch(throwErr)
                } else msg.channel.send({embed:
                    embErr(":x: : " + __("Currently not playing."))
                }).catch(throwErr)
            }
        } catch(e) {
            throwErr(e)
        }
        return true
    }
}
