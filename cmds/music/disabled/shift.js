module.exports = {
    usage: "`<cmd> [all | n]` : " + __("Delete the musics in queue. With no param : first one, all : all, n : the n first ones."),

    exec: function (msg, values) {
        try {
            if (values[1] !== undefined) {
                if (values[1] === "all") {
                    var num = client.audio.queue.getQu().length
                    if (num) {
                        for (var i = 0; i < num; i++) {
                            client.audio.queue.shift()
                        }
                    }
                } else {
                    var num = Number(values[1])
                    if (num !== undefined) {
                        for (var i = 0; i < num; i++) {
                            client.audio.queue.shift()
                        }
                    }
                }
            } else {
                client.audio.queue.shift()
            }
        } catch (e) {
            throwErr(e)
        }
        return true
    }
}
