module.exports = {
    usage: "`<cmd> [Channel] [User]` : " + __("Unmute the user for the text channel."),
    restricted: true,

    exec: function (msg, values) {
        try {
            if(!values[1]) {
                msg.channel.send({embed:
                   embErr(__(":x: : Channel and user not specified."))
               }).catch(throwErr)
                return true
            }
            if(!values[2]) {
                msg.channel.send({embed:
                    embErr(__(":x: : User not specified."))
                }).catch(throwErr)
                return true
            }
            var channel = Do.resolve('channel', values[1])
            var user = Do.resolve('user', values[2])
            var user = user.user || user;
            if(user != null && channel != null && channel.type == "text") {
                client.unmuteUser(user, channel, function(wasMute){
                    if(wasMute){
                        msg.channel.send({embed:
                            embMsg(`${user} ` + __("got unmuted on") + " " + channel)
                        }).catch(throwErr)
                        if(db_mutes.has(user.id)) db_mutes.del(user.id)
                    }
                })
            } else {
                if(!user) msg.channel.send({embed:
                    embErr(__(":x: : User not found."))
                }).catch(throwErr)
                if(!channel) msg.channel.send({embed:
                    embErr(__(":x: : Channel not found."))
                }).catch(throwErr)
            }
        } catch(e) {
            throwErr(e)
        }
        return true
    }
}
