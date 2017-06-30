'use strict';

/**
* @class Restriction
* @param String id
* @desc Class that manage Restrictions
*/
class Restriction {

    constructor() { }

    getLogChannel() {
        if(this.logChn)
            return this.logChn
        else
            this.logChn = Do.resolve('channel' , Config.logChannel)
        return this.logChn
    }


    stopBadwords(user, bdw, msg) {
        var me = this
        if(!user.badwords) user.badwords = 0
        user.badwords++
        if((user.badwords + 1) >= bdw.banAt && bdw.banAt > 0) {
            if(bdw.banAt == 1 || user.badwords >= bdw.banAt) {
                msg.reply(__('Offensive language is not approved here.'))
            } else
            msg.reply(__('Thanks to moderate your language, next time is ban.'))
        } else {
            msg.reply(__('Thanks to moderate your language.'))
        }
        niceLog(__('[###][BADW][%s] said : << %s >>', [msg.author.username, msg.content]))
        var logchn = me.getLogChannel()
        var emb = (new Discord.RichEmbed({})).setTitle(' ').setColor('#ff8800')
        if(logchn) {
            emb.setDescription(':interrobang: ' + __('**[BadW]** (%s) <@%s> : ```\n%s \n```', [msg.channel, msg.author.id, msg.content]))
                .setFooter(`${(new Date()).format('jj/mm/aaaa hh:ii:ss')}`, msg.author.avatarURL)
            logchn.send({embed: emb}).catch(throwErr)
        }
        if(bdw.deleteMessage) msg.delete()
        setTimeout(function () {
            var guildUser = Do.resolve('user', msg.author)
            if(bdw.banAt > 0 && user.badwords >= bdw.banAt) {
                niceLog(__('[BAN] User [%s] has been banned.', [msg.author.username]))
                if(logchn) {
                    emb.setDescription(':hammer: ' + __('**[AutoBan]** <@%s>', [msg.author.id]))
                        .setFooter(`${(new Date()).format('jj/mm/aaaa hh:ii:ss')}`, msg.author.avatarURL)
                    logchn.send({embed: emb}).catch(throwErr)
                }
                guildUser.ban().catch(throwErr)
            } else {
                if(bdw.kick){
                    niceLog(__('[KICK] User [%s] has been kicked.', [msg.author.username]))
                    if(logchn) {
                        emb.setDescription(':athletic_shoe: ' + __('**[AutoKick]** <@%s>', [msg.author.id]))
                            .setFooter(`${(new Date()).format('jj/mm/aaaa hh:ii:ss')}`, msg.author.avatarURL)
                        logchn.send({embed: emb}).catch(throwErr)
                    }
                    guildUser.kick().catch(throwErr)
                }
            }
            if(bdw.kickAt > 0 && user.badwords >= bdw.kickAt) {
                niceLog(__('[KICK] [%s] has been kicked.', [msg.author.username]))
                if(logchn) {
                    emb.setDescription(':athletic_shoe: ' + __('**[AutoKick]** <@%s>, avertissements : **%s**', [msg.author.id, user.badwords]))
                        .setFooter(`${(new Date()).format('jj/mm/aaaa hh:ii:ss')}`, msg.author.avatarURL)
                    logchn.send({embed: emb}).catch(throwErr)
                }
                guildUser.kick().catch(throwErr)
            }
        }, 100)
    }


    stopCaps(user, bdw, msg, callback) {
        var me = this;
        var emb = (new Discord.RichEmbed({})).setTitle(' ').setColor('#ff8800')
        var logchn = me.getLogChannel()
        msg.reply(__('No caps lock thanks you :smiley:'))
        niceLog(__('[###][CAPS][%s] said : << %s >>', [msg.author.username, msg.content]))
        if(logchn) {
            emb.setDescription(':anger: ' + __('**[CAPS]** (%s) <@%s> : ```\n%s \n```', [msg.channel, msg.author.id, msg.content]))
                .setFooter(`${(new Date()).format('jj/mm/aaaa hh:ii:ss')}`, msg.author.avatarURL)
            logchn.send({embed: emb}).catch(throwErr)
        }
        msg.delete()
        if(!not(callback, 'function')) callback()
    }


    stopFlood(user, bdw, msg, callback) {
        var me = this
        var emb = (new Discord.RichEmbed({})).setTitle(' ').setColor('#ff8800')
        var logchn = me.getLogChannel()
        msg.reply(__('Do not flood thanks you :smiley:'))
        niceLog(__('[###][FLOOD][%s] said : << %s >>', [msg.author.username, msg.content]))
        if(logchn) {
            emb.setDescription(':cyclone: ' + __('**[Flood]** (%s) <@%s> : ```\n%s \n```', [msg.channel, msg.author.id, msg.content]))
                .setFooter(`${(new Date()).format('jj/mm/aaaa hh:ii:ss')}`, msg.author.avatarURL)
            logchn.send({embed: emb}).catch(throwErr)
        }
        msg.delete()
        if(!not(callback, 'function')) callback()
    }


    stopSpam(user, bdw, msg, callback) {
        var me = this
        var emb = (new Discord.RichEmbed({})).setTitle(' ').setColor('#ff8800')
        var logchn = me.getLogChannel()
        user.nbMsg++
        if(user.nbMsg > 4) {
            var gm = Do.resolve('user', msg.author.id)
            client.muteUserFor(gm, msg.channel, 10000, () => {
                niceLog(msg.author.username + ' ' + __('no longer muted on') + ' #' + msg.channel.name)
            })
            niceLog(__('[###][SPAM][%s] said : << %s >>', [msg.author.username, msg.content]))
            if(logchn) {
                emb.setDescription(':speech_balloon: ' + __('**[Spam]** (%s) <@%s> mute 10s.', [msg.channel, msg.author.id]))
                    .setFooter(`${(new Date()).format('jj/mm/aaaa hh:ii:ss')}`, msg.author.avatarURL)
                logchn.send({embed: emb}).catch(throwErr)
            }
            niceLog(msg.author.username + ' ' + __('got muted on') + ' #' + msg.channel.name + ' for ' + 10 + 'sec')
        }
        setTimeout(function () {
            user.nbMsg--
            if(!not(callback, 'function')) callback()
        }, 5000)
    }


    cmdLimits(msg) {
        var me = this
        var limit = Config.options.limitCmds

        var maxByMinute = (not(limit.maxByMinute, 'number')) ? 100 : limit.maxByMinute
        var maxByMinuteByUser = (not(limit.maxByMinuteByUser, 'number')) ? 50 : limit.maxByMinuteByUser
        var user = Do.users.getUser(msg.author.id)

        if(Do.nbCmds > maxByMinute) return false

        Do.nbCmds++
        setTimeout(function () {
            Do.nbCmds--
        }, 60000)

        if(Do.nbCmds > maxByMinute) return false

        if(user.nbCmds > maxByMinuteByUser) return false

        user.nbCmds++
        setTimeout(function () {
            user.nbCmds--
        }, 60000)

        if(user.nbCmds > maxByMinuteByUser) return false
        return true
    }

    channelRestriction(name, mixed, index) {
        var me = this
        if(Array.isArray(mixed)) {
            if(mixed.length == 0) return true;
            else {
                var ret = true;
                mixed.forEach(c => {
                    var chn = Do.resolve('channel',''+c)
                    if(chn && chn.name == name) ret = false
                })
                return ret
            }
        } else {
            if(not(index, 'string')) {
                return true
            } else {
                return me.channelRestriction(name, mixed[index])
            }
        }
    }
}
module.exports = Restriction
