module.exports = {
    usage: "`<cmd> [@Joueur] [Nom du role]` : " + __("Enlève le rôle `%s`, rajoute le rôle `%s` et renomme l'utilisateur.", [
        Config.options.modules.lg.roles.alive, Config.options.modules.lg.roles.dead
    ]),

    exec: function (msg, values) {
        try {
            var cnf = Config.options.modules.lg
            if (values[1] && values[2]) {
                var gm = Do.resolve("user", values[1])
                var rp = values.subarray(2).join(" ")

                var vivant = Do.resolve("role", cnf.roles.alive)
                var mort = Do.resolve("role", cnf.roles.dead)

                gm.removeRole(vivant).then(ngm=>{
                    setTimeout(() => {
                        ngm.addRole(mort).catch(throwErr)
                    }, 500)
                }).catch(throwErr)
                gm.setNickname("💀" + rp.slice(0,10) + "|" + gm.displayName.slice(0,14)).catch(throwErr)

                msg.channel.send({embed: embMsg(`***${gm} a été tué(e) ... il/elle était : ${rp}***`).setColor("#111111")})
            } else {
                if (!values[1]) msg.channel.send({
                    embed: embErr(":x: Le nom du joueur mort n'est pas spécifié.")
                }).catch(throwErr)
                if (!values[2]) msg.channel.send({
                    embed: embErr(":x: Le joueur et/ou son personnage ne sont pas spécifiés.")
                }).catch(throwErr)
            }
        } catch(e) {
            throwErr(e)
        }
        return true
    }
};
