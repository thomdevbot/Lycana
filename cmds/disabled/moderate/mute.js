module.exports = {
    usage: '`<cmd> [Channel] [User] {#h#m#s | #s | #m#s ...}` : ' + __('Mute the user on the text channel.'),
    restricted: true,

    exec: function (msg, values) {
        try {
            if(values[1] && values[2]) {
                var channel = Do.resolve('channel', {'name': values[1], 'type':'text' })
                var logChn = Config.logChannel ? Do.resolve('channel', Config.logChannel) : null

                if(!channel) { msg.channel.send({embed:
                    embErr(__(':x: : Channel not found.'))
                }).catch(throwErr); return true }

                var user = Do.resolve('user', values[2])
                if(!user) { msg.channel.send({embed:
                    embErr(__(':x: : User not found.'))
                }).catch(throwErr); return true }

                var user = user.user || user;
                var time = (!not(values[3], 'string'))? values[3].jhms() : 0

                if(time > 0) {
                    var end_date = new Date( (new Date()).getTime() + (time * 1000) )
                    db_mutes.put(`${user.id}`, { ends:end_date, channel:(channel.id) })
                    client.muteUser(user, channel, () => {
                        msg.channel.send({embed:
                            embMsg(`${user} ` + __('got muted on') + ' ' + channel + ' : ' + time + 'sec')
                        })
                        if(logChn) logChn.send({embed:
                            embMsg(`:zipper_mouth: ${user} ` + __('got muted on') + ' ' + channel + ' : ' + time + 'sec')
                                .setColor('#DDDDDD').setFooter(`${(new Date()).format('jj/mm/aaaa hh:ii:ss')}`, user.avatarURL)
                        }).catch(throwErr)
                    })
                } else {
                    client.muteUser(user, channel, () => {
                        msg.channel.send({embed:
                            embMsg(`${user} ` + __('got muted on') + ' ' + channel)
                        }).catch(throwErr)
                        if(logChn) logChn.send({embed:
                            embMsg(`:zipper_mouth: ${user} ` + __('got muted on') + ' ' + channel)
                                .setColor('#DDDDDD').setFooter(`${(new Date()).format('jj/mm/aaaa hh:ii:ss')}`, user.avatarURL)
                        }).catch(throwErr)
                    })
                }
            } else {
                if(values[1] && values[1] == 'list'){
                    var bantemps = db_mutes.keys()
                    if(bantemps.length > 0) {
                        var retMsg = __('Textmute list :\n')
                        bantemps.forEach(e => {
                            var chaname = '' + Do.resolve('channel', db_mutes.get(e).channel)
                            retMsg += __('%s muted on %s to ', [`<@${e}>`, chaname]) + (new Date(db_mutes.get(e).ends)).format('jj/mm , hh:ii:ss') + '\n'
                        })
                    } else { var retMsg = __('No text mute.') }
                    msg.channel.send({embed: embMsg(retMsg).setColor('#6666ff')}).catch(throwErr)
                } else {
                    if(!values[1]) msg.channel.send({embed:
                        embErr(__(':x: : Channel and user not specified.'))
                    }).catch(throwErr)
                    else if(!values[2]) msg.channel.send({embed:
                        embErr(__(':x: : User not specified.'))
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
            if(!global.db_mutes) global.db_mutes = Flatfile.sync(APPDIR + '/res/textmutes.db')
            client.once('ready', () => {
                var logChn = Config.logChannel ? Do.resolve('channel', Config.logChannel) : null
                client.setInterval(function () {
                    db_mutes.keys().forEach((e) => {
                        if( (new Date(db_mutes.get(e).ends)).getTime() < (new Date()).getTime() ) {
                            var user = Do.resolve('user', ''+e)
                            var chn = Do.resolve('channel', db_mutes.get(e).channel)
                            db_mutes.del(e)
                            if(user && chn) {
                                var po = chn.permissionOverwrites.get(user.id)
                                if(po) {
                                    po.delete()
                                    if(logChn) logChn.send({embed:
                                        embMsg(`:confused: ${user} ` + __('got unmuted on') + ' ' + chn)
                                            .setColor('#DDDDDD').setFooter(`${(new Date()).format('jj/mm/aaaa hh:ii:ss')}`, user.avatarURL)
                                    }).catch(throwErr)
                                }
                            }
                        }
                    })
                }, 1000)
            })
        } catch(e) {
            throwErr(e)
        }
    },
}
