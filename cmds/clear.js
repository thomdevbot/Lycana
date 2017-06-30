module.exports = {
    usage: "`<cmd> [n]` : " + __("Delete messages. With no param : 50, `n` : the n last ones"),
    restricted: true,

    exec: function (msg, values) {
        try {
            var num = Number(values[1]) + 1
            num = (!isNaN(num))? num : 50
            msg.channel.fetchMessages({limit: num}).then(messages => {
                msg.channel.bulkDelete(messages).catch(throwErr)
            }).catch(throwErr)
        } catch(e) {
            throwErr(e)
        }
        return true
    }
}
