module.exports = {
    usage: "`<cmd>` : " + __("Averti les joueurs que le jour se lève."),

    pending: null,

    exec: function (msg, values) {
        try {
            msg.channel.send({
                embed: embMsg(`:sunrise_over_mountains:`)
                    .setTitle("Le soleil se lève ...")
                    .setColor("#ff9966")
            }).catch(throwErr)
            // unmuteVillage()
        } catch(e) {
            throwErr(e)
        }
        return true
    },
}
