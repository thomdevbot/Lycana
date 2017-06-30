module.exports = {
    usage: "`<cmd>` : " + __("Test d'un panel de control"),


    exec: function (msg, values) {
        try {
            var emb = this.getEmbed()
            var self = this
            if(self.timer) clearInterval(self.timer)
            msg.channel.send({embed: emb}).then(m => {
                self.timer = setInterval(() => {
                    m.edit({embed: self.getEmbed()}).catch(e => {
                        if(e.toString().indexOf('Unknown Message') !== -1) {
                            clearInterval(self.timer)
                        } else {
                            throwErr(e)
                        }
                    })
                }, 2000)
            }).catch(throwErr)
        } catch(e) {
            throwErr(e)
        }
        return true
    },

    getEmbed: function () {
        try {
            var st = client.LG_MODULE.status
            var pl = client.LG_MODULE.player
            function plList(arr) {
                return (arr.length > 0) ? `${arr.join(', ')}` : `*Aucun*`
            }
            return embMsg([
                `Panneau de control`
            ].join("\n")).setAuthor(``,`http://www.loups-garous-en-ligne.com/stuff/facebook/carte2.png`)
            .addField(`Role`, `🐺 Loups-garou \n👧 Petite Fille \n☠ Chaman`, true)
            .addField(`Actif`, `${st.wolfs ? '✅' : '❌'}\n${st.pf ? '✅' : '❌'}\n${st.cham ? '✅' : '❌'}`, true)
            .addField(`Joueurs`, `▪${plList(pl.wolfs)}\n▪${plList(pl.pf)}\n▪${plList(pl.cham)}`, true)
        } catch(e) {
            throwErr(e)
            return embErr(`Données non récupérables.`)
        }
    }
}
