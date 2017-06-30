module.exports = {
    usage: "`<cmd> [Message]` : " + __("Envoie un message en mp au chaman."),

    exec: function (msg, values) {
        try {
            if(client.LG_MODULE.player.cham.length === 0) {
                msg.channel.send({embed: embErr("(( *Il n'y a aucun chaman dans le village* ))")}).catch(throwErr)
            } else {
                if (client.LG_MODULE.status.cham) {
                    client.LG_MODULE.player.cham.forEach(c => {
                        c.send({embed:
                            embMsg(values.subarray(1).join(" ")).setColor('#555555').setTitle('💀 Un mort dit:')
                        }).catch(throwErr)
                    })
                } else {
                    msg.channel.send({embed: embErr("(( *Aucun chaman ne vous entend en ce moment.* ))")}).catch(throwErr)
                }
            }
        } catch(e) {
            throwErr(e)
        }
        return true
    }
}
