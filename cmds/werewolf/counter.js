module.exports = {
    usage: "`<cmd> s` : " + __("Lance un compteur de `s` secondes."),

    restricted: false,

    exec: function (Do, msg, values) {
        try {
            var self = this
            if(values[1] && !this.timer) {
                var f = parseInt(values[1])
                if(!isNaN(f) && f > 1 && f < 121) {
                    msg.target.sendMessage(`**TIMER:** ${f} ⌛`).then(m=>{
                        this.timer = setInterval(function () {
                            if(f > 0) {
                                f--
                                m.edit(`**TIMER:** ${f} ⌛`).catch(throwErr)
                            } else {
                                clearInterval(self.timer)
                                delete self.timer
                                m.edit(`***Le temps est écoulé !***`).catch(throwErr)
                            }
                        }, 1000);
                    }).catch(throwErr);
                }
            }
        } catch(e) {
            throwErr(e)
        }
        return true
    }
}
