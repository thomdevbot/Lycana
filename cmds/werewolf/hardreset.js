module.exports = {
    usage: "`<cmd>` : " + __("Rename tout le monde, retire tous les roles et salons."),

    exec: function (msg, values) {
        try {
            var cnf = Config.options.modules.lg
            var vivant = Do.resolve("role", cnf.roles.alive)
            var mort = Do.resolve("role", cnf.roles.dead)
            var mdj = Do.resolve("role", cnf.roles.mdj)
            var obs = Do.resolve("role", cnf.roles.obs)
            var anim = Do.resolve("role", cnf.roles.anim)
            var cursed = Do.resolve("role", cnf.roles.cursed)

            var renames = [
                ...vivant.members.array(),
                ...mort.members.array(),
                ...mdj.members.array(),
                ...obs.members.array(),
                ...anim.members.array(),
                ...cursed.members.array(),
            ]

            function removeNN(gms, cb) {
                var g = gms.shift()
                if(g) {
                    g.setNickname("").then(() => {
                        setTimeout(() => {
                            removeNN(gms, cb)
                        }, 500)
                    }).catch(e => {
                        setTimeout(() => {
                            removeNN(gms, cb)
                        }, 500)
                        throwErr(e)
                    })
                } else {
                    if(cb) cb()
                }
            }

            removeNN(renames, () => {
                vivant.delete()
                mort.delete()
                mdj.delete()
                obs.delete()
                anim.delete()
                cursed.delete()
                Object.keys(cnf.channels).forEach(n => {
                    var chn = Do.resolve('channel', {'name': cnf.channels[n], 'type':'text' })
                    chn.delete()
                })
            })

            if(Do.cmds['add']) Do.cmds['add'].load()

        } catch(e) {
            throwErr(e)
        }
        return true;
    }
};
