module.exports = {
    usage: "`<cmd> {clear|list}` : " + __(`Demande la parole au Maitre de Jeu, le MDJ peut faire
        \n\`-parole clear\` pour vider la file d'attente.
        \n\`-parole list\` pour afficher la file d'attente.
        \n\`-parole\` pour passer au suivant dans la file d'attente.`),
    calldelete: true,
    pmOnly: true,
    show: false,
    restricted: {"lg_le_village": false, "all":["Admin"]},

    exec: function (msg, values) {
        try {
            var cnf = Config.options.modules.lg
            if(!this.parole) this.parole = []
            if(Do.isUserInRoleList(msg.author, [cnf.roles.mdj, cnf.roles.anim])) {
                if(values[1]) {
                    if(values[1] === 'clear') {
                        this.parole = []
                        msg.channel.send({embed: embMsg(`La liste de parole a été vidée.`)}).catch(throwErr)
                    }
                    if(values[1] === 'list' || values[1] === 'liste') {
                        if(this.parole.length === 0) {
                            msg.channel.send({embed: embMsg(`Personne de veut s'exprimer.`)}).catch(throwErr)
                        } else {
                            msg.channel.send({embed: embMsg(
                                `**Liste de parole :**\n▪${this.parole.map(u => { return u.toString() }).join('\n▪')}`
                            )}).catch(throwErr)
                        }
                    }
                } else {
                    if(this.parole.length === 0) {
                        msg.channel.send({embed: embMsg(`Personne de veut s'exprimer.`)}).catch(throwErr)
                    } else {
                        var u = this.parole.shift()
                        msg.channel.send({embed: embMsg(`Au tour de ${u} de s'exprimer.`)}).catch(throwErr)
                    }
                }
            } else {
                var idx = false
                this.parole.forEach((u, i) => {
                    if(u.id === msg.author.id) idx = i
                })
                if(idx === false) {
                    this.parole.push(msg.author)
                    msg.channel.send({embed: embMsg(`${msg.author} souhaiterai s'exprimer.\n\n` +
                        `**Liste de parole :**\n▪${this.parole.map(u => { return u.toString() }).join('\n▪')}`
                    )}).catch(throwErr)
                } else {
                    msg.channel.send({embed: embErr(`${msg.author}, tu es déjà dans la liste de parole.`)}).catch(throwErr)
                }
            }
        } catch(e) {
            throwErr(e)
        }
        return true
    }
}
