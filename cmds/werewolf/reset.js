module.exports = {
    usage: "`<cmd>` : " + __("Rename les joueurs, retire les roles de tous les joueurs."),

    exec: function (msg, values) {
        try {
            var cnf = Config.options.modules.lg
            var vivant = Do.resolve("role", cnf.roles.alive)
            var mort = Do.resolve("role", cnf.roles.dead)
            var mdj = Do.resolve("role", cnf.roles.mdj)
            var obs = Do.resolve("role", cnf.roles.obs)
            var anim = Do.resolve("role", cnf.roles.anim)
            var cursed = Do.resolve("role", cnf.roles.cursed)

            if(mort && vivant) {
                mort.members.forEach((gm,i)=>{
                    gm.removeRole(mort).then(() => {
                        setTimeout(() => {
                            gm.addRole(vivant).catch(throwErr)
                        }, 500)
                    }).catch(throwErr)
                    gm.setNickname("").catch(throwErr)
                })
            }
            if(cursed) {
                cursed.members.forEach((gm,i)=>{
                    gm.removeRole(cursed).catch(throwErr)
                    gm.setNickname("").catch(throwErr)
                })
            }

            var chnLoup = Do.resolve('channel', {'name': cnf.channels.wolfs, 'type':'text' })
            if(chnLoup) {
                chnLoup.permissionOverwrites.forEach((po,i)=>{
                    if (po.type == "member") po.delete().catch(throwErr)
                })
            }

            var ev = Do.resolve('role', "@everyone")
            if (chnLoup && ev) {
                chnLoup.overwritePermissions(ev, {
                    'SEND_MESSAGES': false,
                }).catch(throwErr)
            }

            if(Do.cmds['add']) Do.cmds['add'].load()

        } catch(e) {
            throwErr(e)
        }
        return true
    }
};
