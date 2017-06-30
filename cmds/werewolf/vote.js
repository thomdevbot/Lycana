module.exports = {
    usage: "`<cmd> [@Joueur|list]` : " + __([
        "Vote pour un joueur. Le MDJ démarre et stoppe le vote.",
        "Démarrer / stopper un vote: \`-vote\` (Et être %s ou %s)",
        "Voter pour quelqu'un: \`-vote @Pseudo\` (utilisez la mention)",
        "Voter blanc: \`-vote\`",
        "Afficher vote en cours: \`-vote list\` (Et être %s ou %s)",
    ].join('\n'), [Config.options.modules.lg.roles.mdj, Config.options.modules.lg.roles.anim]),
    calldelete: true,
    pmOnly: false,
    notPm: true,
    restricted: {"lg_le_village": false, "all":["Admin", "LG-Anim"]},

    started: false,

    exec: function (msg, values) {
        try {
            var cnf = Config.options.modules.lg

            var _self = this
            if(!this.votes) {
                this.initVote()
            }

            if(Do.isUserInRoleList(msg.author, [cnf.roles.mdj, cnf.roles.anim])) {
                if(values[1]) {
                    if(values[1] === 'list') {
                        if(this.started) {
                            msg.channel.send({
                                embed: _self.getVoteList()
                            }).catch(throwErr)
                        } else {
                            msg.channel.send({embed:
                                embErr(`${msg.author}, aucun vote n'a été lancé`)
                            }).catch(throwErr)
                        }
                    }
                } else {
                    if(this.started) {
                        this.started = false
                        msg.channel.send({
                            embed: _self.getVoteList()
                        }).catch(throwErr)
                        this.votes = null
                    } else {
                        this.started = true
                        msg.channel.send({
                            embed: embMsg("Un vote du village a été lancé")
                            .setTitle(":pencil: [:white_check_mark:] Les votes sont ouverts")
                        }).catch(throwErr)
                    }
                }
            } else {
                if(this.started) {
                    if(values[1]) {
                        var target = Do.resolve("user", values[1])
                        if(target && Do.isUserInRoleList(target, [cnf.roles.alive])) {
                            this.votes[`${msg.author.id}`].target = target
                            msg.channel.send({
                                embed: embMsg(`${msg.author} vote pour ${target}`)
                            }).catch(throwErr)
                        } else {
                            msg.channel.send({embed:
                                embErr(`${msg.author}, l'utilisateur "${values[1]}" est introuvable ou ne fait pas partie du vote.`)
                            }).catch(throwErr)
                        }
                    } else {
                        this.votes[`${msg.author.id}`].target = false
                        msg.channel.send({
                            embed: embMsg(`${msg.author} vote **blanc**`)
                        }).catch(throwErr)
                    }
                    if(this.update()) msg.channel.send({
                        embed: _self.getVoteList().setColor('#ff8844')
                            .setTitle(":pencil: [:ok_hand:] Tout le monde a voté:")
                    }).catch(throwErr)
                } else {
                    msg.channel.send({embed:
                        embErr(`${msg.author}, ce n'est pas l'heure de voter`)
                    }).catch(throwErr)
                }
            }
        } catch(e) {
            throwErr(e)
        }
        return true
    },

    getVoteList: function () {
        try {
            var votes = []
            var novotes = []
            for (var voter in this.votes) {
                var v = this.votes[`${voter}`]
                if(v.target === null) {
                    novotes.push(`${v.puce}[\`${v.count}\`] <@${voter}>`)
                } else {
                    votes.push(`${v.puce} [\`${v.count}\`] <@${voter}> vote ${v.target ? 'pour ' + v.target : '**blanc**' }`)
                }
            }
            if(this.started) {
                var e = embMsg( votes.join(`\n`) +
                    ((novotes.length > 0) ? (`\n\nN'ont pas encore voté:\n` + novotes.join(`, `)) : '') )
                return e.setTitle(":pencil: [:envelope_with_arrow:] Vote en cours...")
            } else {
                var e = embMsg( votes.join(`\n`) )
                return e.setColor(ERR_COLOR).setTitle(":pencil: [:x:] Vote clos, résultats du vote:")
            }
        } catch(e) {
            throwErr(e)
        }
    },

    initVote: function() {
        try {
            var cnf = Config.options.modules.lg
            var vivants = Do.resolve("role", cnf.roles.alive)
            this.votes = {}
            if(!this.malus) this.malus = {}
            vivants.members.forEach(m => {
                this.votes[`${m.id}`] = {
                    target: null,
                    count: 0,
                    puce: '▪'
                }
            })
        } catch(e) {
            throwErr(e)
        }
    },

    update: function() {
        try {
            var max = 0
            var highRes = []
            var counts = {}
            var tot = 0
            for (var id in this.votes) {
                var v = this.votes[id]
                if(!counts[`${id}`]) counts[`${id}`] = 0
                if(v.target !== null) {
                    tot++
                    if(v.target !== false && v.target.id) {
                       if(!counts[`${v.target.id}`]) counts[`${v.target.id}`] = 0
                       counts[`${v.target.id}`]++
                    }
                }
            }
            for (var voter in this.votes) {
                this.votes[`${voter}`].count = counts[`${voter}`]
                if(this.malus[`${voter}`]) this.votes[`${voter}`].count += this.malus[`${voter}`]
            }
            for (var id in this.votes) {
                var v = this.votes[id]
                if(v.count > max) {
                    max = v.count
                    highRes = [`${id}`]
                } else {
                    if(v.count === max) {
                        highRes.push(`${id}`)
                    }
                }
            }
            for (var voter in this.votes) {
                if(highRes.indexOf(`${voter}`) !== -1) {
                    this.votes[`${voter}`].puce = (highRes.length === 1) ? '🔺' : '🔸'
                }
            }
            return tot === Object.keys(this.votes).length
        } catch(e) {
            throwErr(e)
        }
    }

}
