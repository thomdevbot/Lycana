module.exports = {
    usage: "`<cmd>` : " + __("Ask the bot to pause the music."),

    exec: function (msg, values) {
        try {
            client.audio.pause()
        } catch(e) {
            throwErr(e)
        }
        return true
    }
}
