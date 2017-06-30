module.exports = {
    usage: "`<cmd>` : " + __("Ask to the bot to leave the vocal channel."),

    exec: function (msg, values) {
        try {
            if(client.vc) {
                client.vc.channel.leave()
            }
        } catch(e) {
            throwErr(e)
        }
        return true
    }
}
