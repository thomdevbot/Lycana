module.exports = {
    usage: "`<cmd> [x]m` : " + __("Averti les joueurs de la tombée de la nuit dans `x` minutes."),

    pending: null,

    exec: function (msg, values) {
        try {
            var time = (!not(values[1], 'string'))? values[1].hms() : 300
            if (!values[1]) {
                msg.channel.send({
                    embed: embMsg(__(":tent:")).setColor("#7b80ee")
                    .setTitle("Le soleil va bientôt se coucher ...")
                }).catch(throwErr)
                // self.muteVillage();
                clearTimeout(this.pending)
            } else {
                if (time > 0) {
                    msg.channel.send({
                        embed: embMsg(__(":hourglass:")).setTitle(
                            "Le soleil se couche dans "
                            + ((time/60 >= 1)? Math.floor(time/60) + " minute(s) " : "")
                            + ((time%60 > 0)? (time%60) + " seconde(s) " : "")
                            + "...").setColor("#ff9966")
                    }).catch(throwErr)
                    clearTimeout(this.pending)
                    this.pending = setTimeout(function () {
                        msg.channel.send({
                            embed: embMsg(__(":tent:")).setColor("#7b80ee")
                            .setTitle("Le soleil va bientôt se coucher ...")
                        }).catch(throwErr)
                        // self.muteVillage();
                    }, (time * 1000))
                }
            }
        } catch(e) {
            throwErr(e)
        }
        return true
    },
}
