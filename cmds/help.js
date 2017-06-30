module.exports = {
    usage: "`<cmd> [command]` : " + __("Display the command usage. Or the command list."),

    exec: function (msg, values) {
        try {
            if(!values[1]) {
                var txt = []
                for (var cmd in Do.cmds) {
                    if(Do.cmds[cmd].show) {
                        txt.push("`" + cmd + "`")
                    }
                }
                var emb = new Discord.RichEmbed({})
                emb = emb.setColor(Do.resolve("color", msg.author.id))
                    .setTitle(":bulb: " + __("Command list") + ":")
                    .setDescription(`${txt.join(", ")}`)
                emb = emb.addField(
                    __("Get more help on a **command**") + " ",
                    Do.cmds['help'].usage.replace(/<cmd>/, Config.prx + "help")
                )
                msg.channel.send({embed: emb}).catch(throwErr)
            } else {
                var isCmd = (Do.cmds[values[1]])
                var al = (!isCmd) ? Do.resolve("alias", values[1]) : null
                if(isCmd || al) {
                    var cname = (isCmd) ? values[1] : al
                    if(
                        (
                            Do.cmds[cname].show
                            && !(
                                Do.cmds[cname].level > 4
                                && Do.cmds[cname].restricted === true
                            )
                        )
                        || Config.owner == msg.author.id
                    ) {
                        var emb = new Discord.RichEmbed({})
                        var cnameOrAlias = (al)? " `" + values[1] + "`" + __(" alias of the command ") : ""
                        cnameOrAlias += " `" + cname + "`:";

                        var str = Do.cmds[cname].usage.replace(/<cmd>/, Config.prx + cname + "")
                        var t
                        while ((t = /<(\S+)>/g.exec(str)) !== null) {
                            str = str.replace(new RegExp(t[0], 'g'), Do.cmds[cname]["" + t[1]])
                        }

                        emb = emb.setColor(Do.resolve("color", msg.author.id))
                            .setTitle(":bulb: " + __("Usage of the command ") + "➡ " + cnameOrAlias)
                            .setDescription(`${str}`)

                        if(
                            Do.cmds[cname].alias !== undefined
                            && typeof Do.cmds[cname].alias == "object"
                            && Array.isArray(Do.cmds[cname].alias)
                        ) {
                            var txt = []
                            Do.cmds[cname].alias.forEach((a) => { txt.push("`" + a + "`") })

                            emb = emb.addField(
                                __("Alias of the command") + " : ",
                                txt.join(", ")
                            )
                        }
                        msg.channel.send({embed: emb}).catch(throwErr)
                    } else {
                        msg.channel.send(
                            {embed: embErr(":x: : " + __("Unknown command."))}
                        ).catch(throwErr)
                    }
                } else {
                    msg.channel.send(
                        {embed: embErr(":x: : " + __("Unknown command."))}
                    ).catch(throwErr)
                }
            }
        } catch(e) {
            throwErr(e)
        }
        return true
    }
}
