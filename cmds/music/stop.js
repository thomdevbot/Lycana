module.exports = {
    usage: "`<cmd> [Youtube url]` : " + __("Ask the bot to stop playing music."),

    exec: function (msg, values) {
        try {
            client.audio.stop()
        } catch(e) {
            throwErr(e)
        }
        return true
    }
}
