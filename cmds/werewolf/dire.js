module.exports = {
    usage: "`<cmd> [Message]` : " + __("Envoie un message en mp au chaman."),

    exec: function (Do, msg, values) {
        try {
            if(client.LG_MODULE.player.cham.length === 0) {
                msg.channel.send("(( *Il n'y a aucun chaman dans le village* ))")
            } else {
                if (client.LG_MODULE.status.cham) {
                    client.LG_MODULE.player.cham.forEach(c => {
                        var cham = Do.resolve('user', c)
                        if(cham) cham.send("Un mort dit : `" + values.subarray(1).join(" ") + "`").catch(throwErr)
                    })
                } else {
                    msg.channel.send("(( *Aucun chaman ne vous entend en ce moment.* ))");
                }
            }
        } catch(e) {
            throwErr(e)
        }
        return true
    }
};
