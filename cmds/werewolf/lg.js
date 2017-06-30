module.exports = {
    usage: "`<cmd> [Identifiant du joueur]` : " + __("Ajoute le joueur au salon de loups-garous."),

    exec: function (msg, values) {
        try {
            var cnf = Config.options.modules.lg
            var lgChn = Do.resolve('channel', {'name': cnf.channels.wolfs, 'type':'text' })

            if(values[1]) {
                // Ajout d'un loup-garou
                var user = Do.resolve('user', values[1])
                if (user && lgChn) {
                    var idx = false
                    client.LG_MODULE.player.wolfs.forEach((u, i) => {
                        if(u.id === user.id) idx = i
                    })
                    if(idx === false) {
                        lgChn.overwritePermissions(user, {
                            READ_MESSAGES: true,
                        }).then(() => {
                            msg.channel.send({embed: embMsg(`✅ ${user} a été ajouté en tant que **Loup-Garou**`)}).catch(throwErr)
                            client.LG_MODULE.player.wolfs.push(user)
                            lgChn.send(`${user} est un loup-garou :wolf:`).catch(throwErr)
                        }).catch(throwErr)
                    } else {
                        lgChn.permissionOverwrites.get(user.id).delete().then(() => {
                            msg.channel.send({embed: embMsg(`❎ ${user} était déjà **Loup-garou** et a été supprimé.`)}).catch(throwErr)
                            client.LG_MODULE.player.wolfs.splice(idx, 1)
                            lgChn.send(`${user} n'est plus un loup-garou :man:`).catch(throwErr)
                        }).catch(throwErr)
                    }
                } else {
                    if (!user) msg.channel.send({embed: embErr(":x: : Utilisateur introuvable.")}).catch(throwErr)
                    if (!lgChn) msg.channel.send({embed: embErr(":x: : Salon des loups introuvable.")}).catch(throwErr)
                }
            } else {
                // Activation ou désactivation du salon de loups
                var ev = Do.resolve('role', "@everyone")

                if (!client.LG_MODULE.status.wolfs) {
                    lgChn.overwritePermissions(ev, {
                        SEND_MESSAGES: true,
                    }).catch(throwErr)
                    lgChn.send("***Les loups sortent de la pénombre et s'apprêtent à choisir une cible...***").catch(throwErr)
                    client.LG_MODULE.status.wolfs = true

                } else {
                    lgChn.overwritePermissions(ev, {
                        SEND_MESSAGES: false,
                    }).catch(throwErr)
                    lgChn.send("***Les loups se fondent dans la pénombre...***").catch(throwErr)
                    client.LG_MODULE.status.wolfs = false
                }
            }
        } catch(e) {
            throwErr(e)
        }
        return true
    },

    load: function () {
        try {
            var cnf = Config.options.modules.lg
            client.once('ready', () => {
                var chnLoup = Do.resolve('channel', {'name': cnf.channels.wolfs, 'type':'text' });
                if(chnLoup) {
                    chnLoup.permissionOverwrites.forEach((po)=>{
                        if (po.type == "member") po.delete().catch(throwErr)
                    })
                }
            })
        } catch(e) {
            throwErr(e)
        }
    }
};
