module.exports = {
    usage: "`<cmd> [Personnage],[Personnage],[...]` : " + __(
        "Attribut à tous les utilisateur avec le role `Role` un personnage aléatoire.\n\n"
        + "Exemple : `<cmd> Sorciere,Salvateur,Loup-garou,Loup-garou,Simple Villageois,Joueur de flute`"
    ),

    exec: function (msg, values) {
        try {
            var cnf = Config.options.modules.lg
            if(values[1]) {
                var retMsg = "✅ **Liste des personnages : **\n\n"
                var vivants = Do.resolve("role", cnf.roles.alive)

                if(vivants) {
                    var ordPersos = values.subarray(1).join(" ")
                    ordPersos = ordPersos.split(",")
                    ordPersos = ordPersos.map(r => { return r.trim() })
                    var persos = ordPersos
                    persos = persos.shuffle()

                    if (vivants.members.array().length === persos.length) {
                        var count = 0
                        vivants.members.forEach(e => {
                            count++
                            var rnd = Math.floor((Math.random() * persos.length))
                            retMsg += `🔹 ${e} ** → ${persos[rnd]}**\n`
                            var r =  Do.cmds['role'] ? Do.cmds['role'].findRole(persos[rnd]) : null
                            e.send({
                                embed: embMsg(`${e} tu es : **${persos[rnd]}** !`)
                            }).catch(throwErr)
                            if(r) {
                                e.send({
                                    embed: embMsg(r.desc.join("\n"))
                                        .setColor(r.color)
                                        .setAuthor("[Role] : " + r.name, r.img)
                                }).catch(throwErr)
                            } else {
                                e.send({
                                    embed: embErr(`Aucune description trouvée, pour plus d'info demande au MDJ en mp.`)
                                }).catch(throwErr)
                            }
                            persos.splice(rnd, 1)
                            if (count === vivants.members.array().length) {
                                msg.channel.send({
                                    embed: embMsg(retMsg + `\n\n Pensez à ajouter les LG : \`${Config.prx}lg @Pseudo\``)
                                }).catch(throwErr)
                            }
                        });
                    } else {
                        msg.channel.send({
                            embed: embErr(`:x: Le nombre de personnage ne correspond pas au nombre de joueurs.`)
                        }).catch(throwErr)
                        var players = vivants.members.array().map(v => {
                            return v.displayName
                        }).join(', ')
                        msg.channel.send({
                            embed: embMsg(`ℹ Joueurs détectés : (${vivants.members.array().length})\n`+
                                `\`\`\`\n${players}\`\`\`\n` +
                                `Roles à attribuer : (${ordPersos.length})` +
                                `\`\`\`\n${ordPersos.join(', ')}\`\`\`\n`
                            ).setColor("#8888FF")
                        }).catch(throwErr)
                    }
                } else {
                    msg.channel.send({
                        embed: embErr(`:x: Le rôle "${cnf.roles.alive}" est introuvable.`)
                    }).catch(throwErr)
                }
            }
        } catch(e) {
            throwErr(e)
        }
        return true;
    }
};
