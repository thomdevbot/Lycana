module.exports = {
    usage: "`<cmd>` : " + __("Ask the bot to play the next music."),

    exec: function (msg, values) {
        try {
            client.audio.next()
        } catch(e) {
            throwErr(e)
        }
        return true
    }
}
