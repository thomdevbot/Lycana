#!/usr/bin/env node
'use strict';
const Util          = require('util')
const fs            = require('fs')
const User          = require('./User.js')
const Resolver      = require('./Resolver.js')
const Restriction   = require('./Restriction.js')

class Do {

    constructor() {
        this.resolver = new Resolver()
        this.restricter = new Restriction()

        this.cmds = {}
        this.users = {}
        var nbd = Config.options.noBadWords
        this.capsLimit = (nbd && nbd.actived && nbd.capsLimit && !isNaN(nbd.capsLimit))? nbd.capsLimit : 11
        this.floodLimit = (nbd && nbd.actived && nbd.floodLimit && !isNaN(nbd.floodLimit))? nbd.floodLimit : 11

        this.moreFunctions()

        this.initCmds()
    }


    initCmds() {
        this.initFolderCmds(`${APPDIR}/cmds`, (r, s) => {})
        if(!not(Config.options.noBadWords, 'object')){
            if(
                !not(Config.options.noBadWords.actived, 'boolean')
                && Config.options.noBadWords.actived
            )
            this.badwords = require(APPDIR + '/res/badwords.json')
        }
    }


    initFolderCmds(folderPath, done) {
        var results = []
        var self = this
        fs.readdir(folderPath, (err, list) => {
            if(err) return done(err)
            var i = 0;
            (function next() {
                var file = list[i++]
                if(!file) return done(null, results)
                file = folderPath + '/' + file
                fs.stat(file, (err, stat) => {
                    var sections = file.split('/')
                    var filename = sections[sections.length - 1]
                    if(stat && stat.isDirectory()) {
                        if(filename != 'disabled') {
                            self.initFolderCmds(file, (err, res) => {
                                results = results.concat(res)
                                next()
                            })
                        } else next()
                    } else {
                        results.push(file)
                        self.initCommand(filename, file)
                        next()
                    }
                })
            })()
        })
    }


    initCommand(file, path) {
        try {
            if(this.contains(file, '.js')) {
                var filename = file.replace(/\.[^/.]+$/, '')
                this.cmds[filename] = require(path)
                var command = this.cmds[filename]
                command.Do = this
                command.cmd = filename
                var cmdConf = not(Config.options.cmds, 'object')? false : Config.options.cmds
                var init = {
                    'usage':      ['string',  '`<cmd>` : ' + __('No description.')],
                    'show':       ['boolean', true  ],
                    'restricted': ['mixed',   false ],
                    'calldelete': ['boolean', false ],
                    'requireVC':  ['boolean', false ],
                    'alias':      ['array',   null  ]
                }
                for (var attr in init) {
                    if(cmdConf && !not(cmdConf[filename],'object')) {
                        if(!not(cmdConf[filename][attr], 'mixed')) {
                            command[attr] = cmdConf[filename][attr]
                        }
                    }
                    if(not(command[attr], init[attr][0])){
                        command[attr] = init[attr][1];
                    }
                }
                command.path = path
                if(command['load'] && typeof command['load'] == 'function') command.load()
                return command
            }
        } catch(e) {
            throwErr(e)
        }
    }

    contains(text, mixed) {
        var type = typeof mixed
        var found = false
        if(text !== undefined && mixed !== undefined) {
            if(type == 'object' && Array.isArray(mixed)) {
                mixed.forEach(e => {
                    if( this.pos(text, e) > -1) found = true
                })
            } else if(type == 'string') {
                found = (this.pos(text, mixed) > -1)
            }
        }
        return found
    }


    containsWord(text, mixed) {
        var type = typeof mixed
        var found = false
        if(text !== undefined && mixed !== undefined) {
            if(type == 'object' && Array.isArray(mixed)) {
                mixed.forEach(e => {
                    var regex = new RegExp('\\b' + e.toUpperCase() + 'S?\\b')
                    if(text.toUpperCase().search(regex) > -1) found = true
                })
            } else if(type == 'string') {
                var regex = new RegExp('\\b' + mixed.toUpperCase() + 'S?\\b')
                if(text.toUpperCase().search(regex) > -1) found = true
            }
        }
        return found
    }

    commandBegins(text, mixed) {
        var type = typeof mixed
        var found = false
        if(text !== undefined && mixed !== undefined) {
            if(type == 'object' && Array.isArray(mixed)) {
                mixed.forEach(e => {
                    if( this.pos(text, e + ' ') == 0) found = true
                    if( text.toUpperCase() === e.toUpperCase()) found = true
                })
            } else if(type == 'string') {
                if(this.pos(text, mixed + ' ') == 0) found = true
                if(text.toUpperCase() === mixed.toUpperCase()) found = true
            }
        }
        return found
    }

    pos(text, subtext) {
        return text.toUpperCase().indexOf(subtext.toUpperCase())
    }


    msgCmd(msg) {
        var trigged = false
        var values = msg.content.split(' ')
        try {
            if(msg.author.id == client.user.id) return

            for (var name in this.cmds) {
                var e = this.cmds[name]
                var cmdsTriggers = []
                cmdsTriggers.push((e.prx || Config.prx) + '' + e.cmd)
                if(!not(e.alias, 'array')) {
                    e.alias.forEach(a => {
                        cmdsTriggers.push((e.prx || Config.prx) + '' + a)
                    })
                }
                if(this.commandBegins(msg.content, cmdsTriggers) && !trigged) {
                    var command = e.cmd
                    try {
                        this.exec(command, msg, values)
                        trigged = true
                    } catch(e) {
                        throwErr(e)
                    }
                }
            }
        } catch(e) {
            throwErr(e)
        }
        return trigged
    }


    exec( command, msg, array ) {
        var self = this
        try {
            var authorized = { checkVC: false, cmdAuth: false }

            if(this.cmds[command] !== undefined) {
                authorized.checkVC = (this.cmds[command].requireVC) ?
                    this.isUserInBotVoiceChannel(msg) : true
                authorized.cmdAuth = (this.cmds[command].restricted !== undefined) ?
                    this.isRestricted(msg, this.cmds[command].restricted) : true

                if(db_blacklist) {
                    if(db_blacklist.has(command)) {
                        if(db_blacklist.get(command).indexOf(msg.author.id) !== -1) authorized.cmdAuth = false
                    }
                    if(db_blacklist.has('all')) {
                        if(db_blacklist.get('all').indexOf(msg.author.id) !== -1) authorized.cmdAuth = false
                    }
                }

                var auth = false;

                if( authorized.checkVC && authorized.cmdAuth ) {
                    auth = true
                } else {
                    auth = (msg.author.id == Config.owner)
                }

                niceLog(
                    '[' + msg.author.username + '] : [' + command + '] command on channel [' + msg.channel.name + ']'
                    + ((auth)? ' allowed.' : ' not allowed : \n' + JSON.stringify(authorized))
                )

                var gm = this.resolve('user', msg.author.id)

                if(Config.displayAuthErrors && !auth && gm) {
                    var errEmb = (new Discord.RichEmbed({})).setTitle(' ').setColor(ERR_COLOR)
                    if(!authorized.checkVC) gm.send({embed: errEmb.setDescription(':x: : ' + __('`You need to be connected to the same vocal channel for this command.`'))})
                    if(!authorized.cmdAuth) gm.send({embed: errEmb.setDescription(':x: : ' + __('`You do not have access to this command here.`'))})
                }

                if(this.cmds[command].calldelete && msg.channel.type !== 'dm') msg.delete().catch(throwErr)

                if(auth && typeof this.cmds[command].exec === 'function') {
                    this.cmds[command].executed = false
                    setTimeout(() => {
                        if(!self.cmds[command].executed){
                            throwErr(`[ CRITICAL ] Command '${command}' is time out. Bot will shutdown.`)
                            client.destroy().then(() => {process.exit()})
                        }
                    }, 30000)
                    this.cmds[command].executed = this.cmds[command].exec(msg, array)
                }
            }
        } catch(e) {
            throwErr(e)
        }
    }


    isRestricted(msg, restricted) {
        var res = false
        try {
            switch(typeof restricted) {
                case 'boolean':
                    res = (restricted)? (msg.author.id == Config.owner) : true
                break;
                case 'object':
                    for(var strRef in restricted) {
                        if(
                            msg.channel.name === strRef ||
                            msg.channel.id == strRef ||
                            strRef === 'all' ||
                            (strRef === 'dm' && msg.channel.type == 'dm')
                        ) {
                            if(
                                typeof restricted[strRef] == 'object' &&
                                Array.isArray(restricted[strRef]) &&
                                (
                                    this.isUserInRoleList(msg.author, restricted[strRef]) ||
                                    (restricted[strRef].indexOf(''+msg.author.id) > -1)
                                )
                            ) {
                                res = true
                            } else if(typeof restricted[strRef] == 'boolean') {
                                res = this.isRestricted(msg, restricted[strRef])
                            }
                        }
                    }
                break;
            }
        } catch(e) {
            throwErr(e)
        }
        return res
    }


    isUserInRoleList(user, roles) {
        var isOk = false
        var self = this
        try {
            if(roles.indexOf('all') > -1) return true
            var gm = this.resolve('user', user.id)
            roles.forEach(r => {
                var rl = self.resolve('role', r)
                if(rl && gm.roles.get(rl.id) != null) isOk = true
            })
        } catch(e) {
            throwErr(e)
        }
        return isOk
    }


    isUserInBotVoiceChannel(obj) {
        try {
            var self = this
            var mixed = (obj.author) ? obj.author.id : obj
            var usr = self.resolve('user', mixed)

            var doNotRequireVC = Config.options.doNotRequireVC
            if(!not(doNotRequireVC, 'object') && Array.isArray(doNotRequireVC)) {
                if(this.isUserInRoleList(usr, doNotRequireVC)) return true
            }
            return (
                !not(usr.voiceChannel, 'object')
                && usr.voiceChannel.members.get(client.user.id) !== undefined
            )
        } catch(e) {
            throwErr(e)
        }
    }

    niceSpeak(msg) {
        try {
            if(msg.author.id == client.user.id) return
            if(msg.channel.type == 'dm') return

            if(!not(this.badwords, 'array')) {
                var user = this.users.getUser(msg.author.id)
                var bdw = Config.options.noBadWords
                if(!not(bdw.ignore, 'array')) {
                    if(bdw.ignore.indexOf(''+msg.author.id) > -1 || this.isUserInRoleList(''+msg.author.id, bdw.ignore)) return
                }
                if(
                    this.containsWord(msg.content, this.badwords)
                    && this.restricter.channelRestriction(msg.channel.name, bdw.notChannels, 'badwords')
                ) {
                    this.restricter.stopBadwords(user, bdw, msg)
                } else {
                    var match = msg.content.match(/[A-Z]/g)
                    var match2 = msg.content.match(/[^A-Z]/g)
                    var capsChars = (!match)? 1 : match.length
                    var otherChars = (!match2)? 1 : match2.length
                    if(
                        bdw.noCaps &&
                        (capsChars >= this.capsLimit) &&
                        this.restricter.channelRestriction(msg.channel.name, bdw.notChannels, 'caps')
                    ) {
                        if( (capsChars/otherChars) >= 1.5 )
                            this.restricter.stopCaps(user, bdw, msg)
                    } else {
                        if(
                            bdw.noFlood &&
                            (msg.content.search(new RegExp('(.)\\1{' + this.floodLimit + ',}', 'i')) > -1) &&
                            this.restricter.channelRestriction(msg.channel.name, bdw.notChannels, 'flood')
                        ) {
                            this.restricter.stopFlood(user, bdw, msg)
                        }
                    }
                    if(
                        bdw.noSpam &&
                        this.restricter.channelRestriction(msg.channel.name, bdw.notChannels, 'spam')
                    ) {
                        this.restricter.stopSpam(user, bdw, msg)
                    }
                }
            }
        } catch(e) {
            throwErr(e)
        }
    }

    resolve(type, mixed) {
        var ret = null;
        switch(type) {
            case 'server':
                ret = this.resolver.getServer(mixed)
            break;

            case 'channel':
                ret = this.resolver.getChannel(mixed)
            break;

            case 'alias':
                ret = this.resolver.getAlias(mixed)
            break;

            case 'role':
                ret = this.resolver.getRole(mixed)
            break;

            case 'user':
                ret = this.resolver.getMember(mixed)
                if(!ret) ret = this.resolver.getUser(mixed)
            break;

            case 'color':
                ret = this.resolver.getColor(mixed)
            break;

            default:
                throwErr('Can not resolve nothing...')
            break;
        }
        return ret
    }

    moreFunctions() {
        var self = this

        this.users.getUser = (id) => {
            if(self.users[id] === undefined) self.users[id] = new User(id)
            return self.users[id]
        }

        client.muteUser = (user, channel, callback) => {
            channel.overwritePermissions(user, {
                SEND_MESSAGES: false
            }).then(() => {
                if(!not(callback, 'function')) callback()
            }).catch(throwErr)
        }

        client.unmuteUser = (user, channel, callback) => {
            var po = channel.permissionOverwrites.get(user.id)
            if(po) po.delete().catch(throwErr)
            if(!not(callback, 'function')) callback(po != undefined)
        }

        client.muteUserFor = (user, channel, time, cbmute, cbunmute) => {
            var time = (!isNaN(Number(time)))? Number(time) : 100
            client.muteUser(user, channel, () => {
                setTimeout(() => {
                    if(!not(cbmute, 'function')) cbmute()
                    client.unmuteUser(user, channel, cbunmute)
                }, time)
            })
        }

        client.getVc = () => { return client.voiceConnections.last() }
    }

}
module.exports = Do
