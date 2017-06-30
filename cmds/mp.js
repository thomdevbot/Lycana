module.exports = {
    usage: "`<cmd> [target] [text]` : " + __("Send text to the target."),
    show: false,
    restricted: true,

    exec: function (msg, values) {
        try {
            var chn = Do.resolve('user', values[1].toString())

            if(chn) chn.send(values.subarray(2).join(" ")).then(() => {
                msg.channel.send({embed:
                    embMsg(__(":white_check_mark: : Private message sent."))
                }).catch(throwErr)
            }).catch(throwErr)
            else
                msg.channel.send({embed:
                    embErr(__(":x: : Can not find the user."))
                }).catch(throwErr)
        } catch(e) {
            throwErr(e)
        }
        return true;
    }
}
