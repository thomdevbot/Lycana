module.exports = {
    usage: "`<cmd> [n]` : " + __("Lance un dés de **n** faces."),
    calldelete: true,
    pmOnly: false,
    notPm: false,
    show: true,
    restricted: {"lg_le_village": false, "lg_les_morts": false, "lg_les_loups": false, "lg_mdj": false, "all":["Admin"]},

    exec: function (msg, values) {
        try {
            if (values[1]) {
                var f = parseInt(values[1])
                if (!isNaN(f) && f > 1 && f < 2049) {
                    var num = Math.floor((Math.random() * f) + 1)
                }
                var r = (Math.round(255 * (num/f))).toString(16)
                var v = (255 - Math.round(255 * (num/f))).toString(16)
                msg.channel.send({embed:
                    embMsg(`:four_leaf_clover: *<@${msg.author.id}> a obtenu un **${num}** sur **${f}**.*`).setColor(`#${r}${v}00`)
                }).catch(throwErr)
            }
        } catch(e) {
            throwErr(e)
        }
        return true
    }
}
