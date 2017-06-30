module.exports = {
    usage: '`<cmd>` : ' + __('Logs module.'),
    show: false,

    exec: function (msg, values) {
        try {
            var self = this
            msg.channel.send({embed: embMsg(
                Config.logChannel ? `Enabled : ${self.logChn}` : `Disabled`
            )}).catch(throwErr)
        } catch(e) {
            throwErr(e)
        }
        return true
    },

    load: function () {
        try {
            var self = this
            this.logChn = null

            client.once('ready', () => {
                self.logChn = Config.logChannel ? Do.resolve('channel' , Config.logChannel) : null
            })

            client.on('guildMemberUpdate', (oldGM, newGM) => {
                if(oldGM.nickname != newGM.nickname) {
                    if(oldGM.nickname == null) {
                        var emb = embMsg(':pencil2: ' + __('**[Name]** <@%s>(`%s`) has set his nickname : `%s`', [oldGM.user.id, newGM.user.username + '#' + newGM.user.discriminator, newGM.nickname]))
                            .setColor('#eaeaea')
                    } else if(newGM.nickname == null) {
                        var emb = embMsg(':pencil2: ' + __('**[Name]** <@%s>(`%s`) removed his nickname : `%s`', [oldGM.user.id, newGM.user.username + '#' + newGM.user.discriminator, oldGM.nickname]))
                            .setColor('#eaeaea')
                    } else {
                        var emb = embMsg(':pencil2: ' + __('**[Name]** <@%s>(`%s`) changed his nickname : `%s` -> `%s`', [oldGM.user.id, newGM.user.username + '#' + newGM.user.discriminator, oldGM.nickname, newGM.nickname]))
                            .setColor('#eaeaea')
                    }
                    if(self.logChn) self.logChn.send({
                        embed: emb.setFooter(`${(new Date()).format('jj/mm/aaaa hh:ii:ss')}`, oldGM.user.avatarURL || newGM.user.avatarURL)
                    })
                }
            })

            client.on('userUpdate', (oldUser, newUser) => {
                if(oldUser.username != newUser.username){
                    if(self.logChn) self.logChn.send({
                        embed: embMsg(':pencil: ' + __('**[Name]** `%s`(<@%s>) has renamed to `%s`', [
                            oldUser.username + '#' + oldUser.discriminator, newUser.id, newUser.username + '#' + newUser.discriminator
                        ])).setColor('#eaeaea').setFooter(`${(new Date()).format('jj/mm/aaaa hh:ii:ss')}`, oldUser.avatarURL || newUser.avatarURL)
                    })
                }
            })

            client.on('guildBanAdd', (guild, user) => {
                if(self.logChn) self.logChn.send({
                    embed: embMsg(':no_entry: ' + __('**[Ban]** <@%s>(`%s`) added to ban list.', [
                        user.id, user.username + '#' + user.discriminator
                    ])).setColor('#ff2222').setFooter(`${(new Date()).format('jj/mm/aaaa hh:ii:ss')}`, user.avatarURL)
                })
            })

            client.on('guildBanRemove', (guild, user) => {
                if(self.logChn) self.logChn.send({
                    embed: embMsg(':recycle: ' + __('**[Ban]** <@%s>(`%s`) removed from ban list.', [
                        user.id, user.username + '#' + user.discriminator
                    ])).setColor('#aaff88').setFooter(`${(new Date()).format('jj/mm/aaaa hh:ii:ss')}`, user.avatarURL)
                })
            })

            client.on('guildMemberAdd', (guildMember) => {
                if(self.logChn) self.logChn.send({
                    embed: embMsg(':large_blue_circle: ' + __('**[Serv]** <@%s>(`%s`) joined the server.', [
                        guildMember.user.id, guildMember.user.username + '#' + guildMember.user.discriminator
                    ])).setColor('#88aaff').setFooter(`${(new Date()).format('jj/mm/aaaa hh:ii:ss')}`, guildMember.user.avatarURL)
                })
            })

            client.on('guildMemberRemove', (guildMember) => {
                if(self.logChn) self.logChn.send({
                    embed: embMsg(':red_circle: ' + __('**[Serv]** <@%s>(`%s`) left the server.', [
                        guildMember.user.id, guildMember.user.username + '#' + guildMember.user.discriminator
                    ])).setColor('#ff4444').setFooter(`${(new Date()).format('jj/mm/aaaa hh:ii:ss')}`, guildMember.user.avatarURL)
                })
            })

        } catch(e) {
            throwErr(e)
        }
    },
}
