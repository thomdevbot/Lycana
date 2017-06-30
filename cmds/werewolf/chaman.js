module.exports = {
    usage: "`<cmd> {@Pseudo}` : " + __("Si *Joueur* est renseigné, ajoute/supprime la personne comme chaman, sinon active/désactive le chaman."),

    exec: function (msg, values) {
        try {
            var cnf = Config.options.modules.lg
            var deadChn = Do.resolve('channel', {'name': cnf.channels.deads, 'type':'text' })

            if(!values[1]) {
                if(client.LG_MODULE.status.cham) {
                    if(client.LG_MODULE.player.cham.length > 0) {
                        client.LG_MODULE.player.cham.forEach(cham => {
                            cham.send({embed: embMsg("***Les morts ont mis fin à la discussion.***").setColor('#111111')}).catch(throwErr)
                        })
                        deadChn.send({embed: embMsg(
                            "***Le chaman sent sa puissance diminuer et ne vous entend plus...***"
                        ).setColor('#111111')}).catch(throwErr)
                        client.LG_MODULE.status.cham = false
                    } else {
                        msg.channel.send({embed: embErr(`:x: Aucun chaman n'a été défini.`)}).catch(throwErr)
                    }
                } else {
                    if(client.LG_MODULE.player.cham.length > 0) {
                        client.LG_MODULE.player.cham.forEach(cham => {
                            cham.send({embed: embMsg("***Vous pouvez maintenant parler avec les morts ...***").setColor('#111111')}).catch(throwErr)
                        })
                        deadChn.send({embed: embMsg(
                            "***Un chaman commence son rituel et tente de parler avec les morts.***\n" +
                            "*Pour parler au chaman utilisez `-dire Votre phrase au chaman.`*"
                        ).setColor('#111111')}).catch(throwErr)
                        client.LG_MODULE.status.cham = true
                    } else {
                        msg.channel.send({embed: embErr(`:x: Aucun chaman n'a été défini.`)}).catch(throwErr)
                    }
                }
            } else {
                var user = Do.resolve('user', values[1])
                if(user) {
                    var idx = false
                    client.LG_MODULE.player.cham.forEach((u, i) => {
                        if(u.id === user.id) idx = i
                    })
                    if(idx === false) {
                        client.LG_MODULE.player.cham.push(user)
                        msg.channel.send({embed: embMsg(`✅ ${user} a été ajouté en tant que **chaman**.`)}).catch(throwErr)
                    } else {
                        client.LG_MODULE.player.cham.splice(idx, 1)
                        msg.channel.send({embed: embMsg(`❎ ${user} était déjà **chaman** et a été supprimé.`)}).catch(throwErr)
                    }
                } else {
                    msg.channel.send({embed: embErr(":x: Utilisateur introuvable.")}).catch(throwErr)
                }
            }
        } catch(e) {
            throwErr(e)
        }
        return true
    },

    load: function() {
        client.on('message', m => {
            if(m.channel.type === 'dm') {
                var idx = false
                client.LG_MODULE.player.cham.forEach((u, i) => {
                    if(u.id === m.author.id) idx = i
                })
                if(idx !== false) {
                    if(client.LG_MODULE.status.cham) {
                        var cnf = Config.options.modules.lg
                        var deadChn = Do.resolve('channel', {'name': cnf.channels.deads, 'type':'text' })
                        if(deadChn) deadChn.send({embed:
                            embMsg(m.content).setColor('#111').setAuthor('Un chaman dit:', client.LG_MODULE.roles.Chaman.img)
                        }).catch(throwErr)
                    }
                }
            }
        })
    }
}
