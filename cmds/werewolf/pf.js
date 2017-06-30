module.exports = {
    usage: "`<cmd> {@Pseudo}` : " + __("Si *Joueur* est renseigné, ajoute/supprime la personne comme petite fille, sinon active/désactive la petite fille."),

    exec: function (msg, values) {
        try {
            if(!values[1]) {
                if(client.LG_MODULE.status.pf) {
                    if(client.LG_MODULE.player.pf.length > 0) {
                        client.LG_MODULE.player.pf.forEach(pf => {
                            pf.send({embed: embMsg("***Les loups se fondent dans la pénombre...***").setColor('#87591A')}).catch(throwErr)
                        })
                        client.LG_MODULE.status.pf = false
                    } else {
                        msg.channel.send({embed: embErr(`:x: Aucune petite fille n'a été défini.`)}).catch(throwErr)
                    }
                } else {
                    if(client.LG_MODULE.player.pf.length > 0) {
                        client.LG_MODULE.player.pf.forEach(pf => {
                            pf.send({embed: embMsg("***Vous entendez les loups parler entre eux...***").setColor('#87591A')}).catch(throwErr)
                        })
                        client.LG_MODULE.status.pf = true
                    } else {
                        msg.channel.send({embed: embErr(`:x: Aucune petite fille n'a été défini.`)}).catch(throwErr)
                    }
                }
            } else {
                var user = Do.resolve('user', values[1])
                if(user) {
                    var idx = false
                    client.LG_MODULE.player.pf.forEach((u, i) => {
                        if(u.id === user.id) idx = i
                    })
                    if(idx === false) {
                        client.LG_MODULE.player.pf.push(user)
                        msg.channel.send({embed: embMsg(`✅ ${user} a été ajouté en tant que **petite fille**.`)}).catch(throwErr)
                    } else {
                        client.LG_MODULE.player.pf.splice(idx, 1)
                        msg.channel.send({embed: embMsg(`❎ ${user} était déjà **petite fille** et a été supprimé.`)}).catch(throwErr)
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
        client.once('ready', () => {
            client.on('message', m => {
                var cnf = Config.options.modules.lg
                var wchn = Do.resolve('channel', cnf.channels.wolfs)
                if(wchn && m.channel.id === wchn.id) {
                    client.LG_MODULE.player.pf.forEach(pf => {
                        pf.send(m.content).catch(throwErr)
                    })
                }
            })
        })
    }
}
