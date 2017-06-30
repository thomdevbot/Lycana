module.exports = {
    usage: "`<cmd> [command] [json]` : " + __("Change the value of the bot/command attribute."),
    show: false,
    restricted: true,

    exec: function (msg, values) {
        try {
            if(values.length == 3) {
                try {
                    if(Do.cmds[values[1]]) {
                        var str = values.subarray(2).join(" ")
                        try {
                            var cmdObj = JSON.parse(str)
                            for (var key in cmdObj) {
                                if(Do.cmds[values[1]].hasOwnProperty(key)) {
                                    Do.cmds[values[1]] = cmdObj[key]
                                }
                            }
                            msg.channel.send({embed:
                                embMsg(`:white_check_mark: : Command successfully updated.`)
                            }).catch(throwErr)
                        } catch(e) {
                            msg.channel.send({embed:
                                embErr(`:x: : Json invalid.`)
                            }).catch(throwErr)
                        }
                    } else msg.channel.send({embed:
                        embErr(`:x: : Command not found.`)
                    }).catch(throwErr)
                } catch(e) {
                    throwErr(e)
                }
            } else msg.channel.send({embed:
                embErr(`:x: : Missing arguments.`)
            }).catch(throwErr)
        } catch(e) {
            throwErr(e)
        }
        return true
    },

    load: function () {
        try {
            client.on("message", (message) => {
                if(!message.isCmd) {
                    if(message.channel.type == "dm") {
                        var owner = Do.resolve('user', Config.owner)
                        if(
                            owner
                            && Config.options.redirectPM
                            && (
                                [Config.owner, client.user.id].indexOf(message.author.id) == -1
                            )
                        ) {
                            owner.send(__(`[:closed_lock_with_key:] <@${message.author.id}> : ${message.content}`))
                        }
                    }
                }
            })
        } catch(e) {
            throwErr(e)
        }
    },
}
