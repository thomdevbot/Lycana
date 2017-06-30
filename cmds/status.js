module.exports = {
    usage: "`<cmd> [status] [game]` : " + __("Change the bot status."),
    show: false,
    restricted: true,

    exec: function (msg, values) {
        try {
            var game = (values[2] !== undefined)? values.subarray(2).join(" ") : null;
            client.user.setStatus(values[1]).then(() => {
                client.user.setGame({name: game}).catch(throwErr)
            }).catch(throwErr)
        } catch(e) {
            throwErr(e)
        }
        return true;
    }
}
