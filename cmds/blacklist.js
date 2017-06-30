module.exports = {
    usage: '`<cmd> [cmd || \'all\'] {@User}` : ' + __('Prevent specific user to trigger [cmd] or all commands. If already in list removes him.'),
    restricted: true,

    exec: function (msg, values) {
        try {
            if (values[1] && values[2]) {
                var cmd = (values[1] === 'all') ?
                    'all' : (Do.cmds[values[1]] ?
                        values[1] : ( Do.cmds[Do.resolve('alias', values[1])] ?
                            Do.resolve('alias', values[1]) : false))
                var u = Do.resolve('user', values[2])
                if(u && cmd) {
                    if(!db_blacklist.has(values[1])) db_blacklist.put(values[1], [])
                    var list = db_blacklist.get(values[1])
                    if(list.indexOf(u.id) !== -1) {
                        var newL = list.map(i => {
                            if(i !== u.id) return i
                        })
                        db_blacklist.put(values[1], newL)
                        msg.channel.send({
                            embed: embMsg(__(`%s deleted from blacklist for %s command.`, [`${u}`, `\`${cmd}\``]))
                        }).catch(throwErr)
                    } else {
                        list.push(u.id)
                        db_blacklist.put(values[1], list)
                        msg.channel.send({
                            embed: embMsg(__(`%s added to blacklist for %s command.`, [`${u}`, `\`${cmd}\``]))
                        }).catch(throwErr)
                    }
                } else {
                    if(!u) msg.channel.send({
                        embed: embErr(__(`:x: User %s not found.`, [`\`${values[2]}\``]))
                    }).catch(throwErr)
                    if(!cmd) msg.channel.send({
                        embed: embErr(__(`:x: Command %s not found.`, [`\`${values[1]}\``]))
                    }).catch(throwErr)
                }
            } else {
                if(values[1]) {
                    var cmd = (values[1] === 'all') ?
                            'all' : (Do.cmds[values[1]] ?
                                values[1] : ( Do.cmds[Do.resolve('alias', values[1])] ?
                                    Do.resolve('alias', values[1]) : false))
                    if(cmd) {
                        if(!db_blacklist.has(cmd)) db_blacklist.put(cmd, [])
                        var usrs = []
                        db_blacklist.get(cmd).forEach(u => {
                            if(u && u !== null) usrs.push(`<@${u}>`)
                        })
                        msg.channel.send({embed:
                            embMsg(__(`Blacklist for command %s: \n%s`, [`\`${cmd}\``, `${(usrs.length > 0) ? usrs.join(', ') : __(`**None**`)}`]))
                        }).catch(throwErr)
                    }
                } else {
                    if(!db_blacklist.has('all')) db_blacklist.put('all', [])
                    var usrs = []
                    db_blacklist.get('all').forEach(u => {
                        if(u && u !== null) usrs.push(`<@${u}>`)
                    })
                    msg.channel.send({embed:
                        embMsg(__(`Blacklist for command %s: \n%s`, [`\`all\``, `${(usrs.length > 0) ? usrs.join(', ') : __(`**None**`)}`]))
                    }).catch(throwErr)
                }
            }
        } catch(e) {
            throwErr(e)
        }
        return true
    },

    load: function () {
        try {
            global.db_blacklist = Flatfile.sync(APPDIR + '/res/blacklist.db')
        } catch(e) {
            throwErr(e)
        }
    }
}
