module.exports = {
    usage: "`<cmd>` : " + __("Affiche le panneau de control"),


    exec: function (msg, values) {
        try {
            var emb = this.getEmbed()
            var _self = this
            if(!_self.prevState) _self.registerState()
            if(_self.timer) clearInterval(_self.timer)
            msg.channel.send({embed: emb}).then(m => {
                _self.messageId = m.id
                _self.cleanReacts(m)
                _self.timer = setInterval(() => { _self.updatePanel(m) }, 100)
            }).catch(throwErr)
        } catch(e) {
            throwErr(e)
        }
        return true
    },

    getEmbed() {
        try {
            var st = client.LG_MODULE.status
            var pl = client.LG_MODULE.player
            function plList(arr) {
                return (arr.length > 0) ? `${arr.join(', ')}` : `*Aucun*`
            }
            return embMsg(`\u200B`).setAuthor(`Panneau de control`, client.LG_MODULE.roles["Loup-garou (LG)"].img)
            .addField(`Role`, `🐺 Loups-garou \n👧 Petite Fille \n☠ Chaman\n\n⛪ Village`, true)
            .addField(`Actif`, `${st.wolfs ? '✅' : '❌'}\n${st.pf ? '✅' : '❌'}\n${st.cham ? '✅' : '❌'}\n\n${st.village ? '✅' : '❌'}`, true)
            .addField(`Joueurs`, `▪${plList(pl.wolfs)}\n▪${plList(pl.pf)}\n▪${plList(pl.cham)}`, true)
            .addField(`\u200B`, `Utilisez les réactions pour **activer/désactiver** les roles.`)
        } catch(e) {
            throwErr(e)
            return embErr(`Données non récupérables.`)
        }
    },

    updatePanel(msg) {
        var _self = this
        if(_self.hasChanged()) {
            msg.edit({embed: _self.getEmbed()}).then(() => {
                _self.registerState()
            }).catch(e => {
                if(
                    e.toString().indexOf('Unknown Message') !== -1
                    || e.toString().indexOf('Unknown Channel') !== -1
                ) {
                    clearInterval(_self.timer)
                } else {
                    throwErr(e)
                }
            })
        }
    },

    hasChanged() {
        var _self = this
        var st = (_self.prevState.status === JSON.stringify(client.LG_MODULE.status))
        if(!st) return true
        var sameUsers = true
        for (var k in _self.prevState.player) {
            if(sameUsers) {
                var p =  _self.prevState.player[k]
                var n = JSON.stringify( client.LG_MODULE.player[k].map(u => { return u.id }) )
                sameUsers = (p === n)
            }
        }
        return !sameUsers
    },

    registerState() {
        this.prevState = {
            status: JSON.stringify(client.LG_MODULE.status),
            player: {
                pf: JSON.stringify( client.LG_MODULE.player.pf.map(u => { return u.id }) ),
                wolfs: JSON.stringify( client.LG_MODULE.player.wolfs.map(u => { return u.id }) ),
                cham: JSON.stringify( client.LG_MODULE.player.cham.map(u => { return u.id }) )
            }
        }
    },

    resolveMr(mr) {
        var _self = this
        if(_self.messageId && mr.message.id === _self.messageId) {
            if(mr.emoji.name === '🐺') {
                Do.cmds.lg.exec(mr.message, ['-lg'])
            }
            if(mr.emoji.name === '👧') {
                Do.cmds.lg.exec(mr.message, ['-lg'])
            }
            if(mr.emoji.name === '☠') {
                Do.cmds.chaman.exec(mr.message, ['-chaman'])
            }
            if(mr.emoji.name === '⛪') {
                Do.cmds.village.exec(mr.message, ['-village'])
            }
            _self.cleanReacts(mr.message)
        }
    },

    cleanReacts(m) {
        m.clearReactions().then(n => {
            m.react('🐺').then(() => {
                setTimeout(() => {
                    m.react('👧').then(() => {
                        setTimeout(() => {
                            m.react('☠').then(() => {
                                setTimeout(() => {
                                    m.react('⛪').catch(throwErr)
                                }, 100)
                            }).catch(throwErr)
                        }, 100)
                    }).catch(throwErr)
                }, 100)
            }).catch(throwErr)
        }).catch(throwErr)
    },

    load() {
        var _self = this
        try {
            client.on('messageReactionAdd', (mr, u) => {
                if(u.id !== client.user.id) _self.resolveMr(mr)
            })
        } catch(e) {
            throwErr(e)
        }
    }

}
