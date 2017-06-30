module.exports = {
    usage: "`<cmd>` : " + __("Initialise les roles et salons pour le LG"),

    exec: function (msg, values) {
        try {
            var cnf = Config.options.modules.lg

            var roles = [ {
                    data: {
                        name: cnf.roles.mdj,
                        color: '#7f60a0',
                        hoist: false,
                        permissions: [
                            'MANAGE_ROLES',
                            'CHANGE_NICKNAME',
                            'MANAGE_NICKNAMES',
                            'MUTE_MEMBERS',
                            'MOVE_MEMBERS',
                            'USE_VAD'
                        ],
                        mentionable: true
                    }
                },
                {
                    data: {
                        name: cnf.roles.anim,
                        color: '#ff3300',
                        hoist: false,
                        permissions: [
                            'MANAGE_ROLES',
                            'CHANGE_NICKNAME',
                            'MANAGE_NICKNAMES',
                            'MUTE_MEMBERS',
                            'MOVE_MEMBERS',
                            'USE_VAD'
                        ],
                        mentionable: true
                    }
                },
                {
                    data: {
                        name: cnf.roles.alive,
                        color: '#f0b678',
                        hoist: false,
                        mentionable: true
                    }
                },
                {
                    data: {
                        name: cnf.roles.dead,
                        color: '#444343',
                        hoist: false,
                        mentionable: true
                    }
                },
                {
                    data: {
                        name: cnf.roles.cursed,
                        color: '#8fbb67',
                        hoist: false,
                        mentionable: false
                    }
                },
                {
                    data: {
                        name: cnf.roles.obs,
                        color: '#9c9c9c',
                        hoist: false,
                        mentionable: false
                    }
                },
            ]

            this.tempRoles = {}
            var _self = this

            function createRoles(roles, cb, display) {
                var r = roles.shift()
                if(r) {
                    var s = Do.resolve('server')
                    if(s) {
                        var o = Do.resolve('role', r.data.name)
                        if(o) {
                            setTimeout(() => {
                                if(display) display(null, o)
                                createRoles(roles, cb, display)
                            }, 1000)
                        } else {
                            s.createRole(r.data).then(n => {
                                _self.tempRoles[r.data.name] = n
                                setTimeout(() => {
                                    if(display) display(n, null)
                                    createRoles(roles, cb, display)
                                }, 1000)
                            }).catch(throwErr)
                        }
                    } else throwErr('Serveur introuvable')
                } else {
                    if(cb) cb()
                }
            }

            function createChannels(channels, cb, display) {
                var c = channels.shift()
                if(c) {
                    var s = Do.resolve('server')
                    if(s) {
                        var o = Do.resolve('channel', c.name)
                        if(o) {
                            setTimeout(() => {
                                if(display) display(null, o)
                                createChannels(channels, cb, display)
                            }, 1000)
                        } else {
                            s.createChannel(c.name, 'text', c.options).then(n => {
                                setTimeout(() => {
                                    if(display) display(n, null)
                                    createChannels(channels, cb, display)
                                }, 1000)
                            }).catch(throwErr)
                        }
                    } else throwErr('Serveur introuvable')
                } else {
                    if(cb) cb()
                }
            }

            createRoles(roles, () => {

                var mdj = _self.tempRoles[cnf.roles.mdj] || Do.resolve('role', cnf.roles.mdj)
                var dead = _self.tempRoles[cnf.roles.dead] || Do.resolve('role', cnf.roles.dead)
                var obs = _self.tempRoles[cnf.roles.obs] || Do.resolve('role', cnf.roles.obs)
                var alive = _self.tempRoles[cnf.roles.alive] || Do.resolve('role', cnf.roles.alive)
                var anim = _self.tempRoles[cnf.roles.anim] || Do.resolve('role', cnf.roles.anim)
                var ev = Do.resolve('role', "@everyone")

                var channels = [{
                    name: cnf.channels.village,
                    options: [
                        {id: `${mdj.id}`, type: 'role', allow: 0x00000C00, deny: 0x00000000 },
                        {id: `${anim.id}`, type: 'role', allow: 0x00000C00, deny: 0x00000000 },
                        {id: `${dead.id}`, type: 'role', allow: 0x00000400, deny: 0x00000800 },
                        {id: `${alive.id}`, type: 'role', allow: 0x00000400, deny: 0x00000000 },
                        {id: `${obs.id}`, type: 'role', allow: 0x00000400, deny: 0x00000800 },
                        {id: `${ev.id}`, type: 'role', allow: 0x00010000, deny: 0x0006CC00 }
                    ]
                },{
                    name: cnf.channels.wolfs,
                    options: [
                        {id: `${mdj.id}`, type: 'role', allow: 0x00000C00, deny: 0x00000000 },
                        {id: `${anim.id}`, type: 'role', allow: 0x00000C00, deny: 0x00000000 },
                        {id: `${dead.id}`, type: 'role', allow: 0x00000000, deny: 0x00000800 },
                        {id: `${obs.id}`, type: 'role', allow: 0x00000400, deny: 0x00000800 },
                        {id: `${ev.id}`, type: 'role', allow: 0x00000800, deny: 0x0006C400 }
                    ]
                },{
                    name: cnf.channels.deads,
                    options: [
                        {id: `${mdj.id}`, type: 'role', allow: 0x00000400, deny: 0x00000000 },
                        {id: `${anim.id}`, type: 'role', allow: 0x00000400, deny: 0x00000000 },
                        {id: `${dead.id}`, type: 'role', allow: 0x00000400, deny: 0x00000000 },
                        {id: `${obs.id}`, type: 'role', allow: 0x00000400, deny: 0x00000800 },
                        {id: `${ev.id}`, type: 'role', allow: 0x00000000, deny: 0x00000400 }
                    ]
                }, {
                    name: cnf.channels.mdj,
                    options: [
                        {id: `${mdj.id}`, type: 'role', allow: 0x00000400, deny: 0x00000000 },
                        {id: `${anim.id}`, type: 'role', allow: 0x00000400, deny: 0x00000000 },
                        {id: `${ev.id}`, type: 'role', allow: 0x00000800, deny: 0x00000400 }
                    ]
                }]

                setTimeout(()=>{
                    createChannels(channels, () => {
                        msg.channel.send({embed: embMsg([
                            `Les roles et salons sont prêt pour une partie de LG.`,
                            `N'oubliez pas de vérifier dans les paramètres du serveur la position des roles.`
                        ].join('\n'))})
                    }, (c, e) => {
                        if(c) msg.channel.send({embed: embMsg(`Le salon : ${c} a été créé.`)})
                        if(e) msg.channel.send({embed: embMsg(`Le salon : ${e} existe déjà.`)})
                    })
                }, 3000)
            }, (r, e) => {
                if(r) msg.channel.send({embed: embMsg(`Le role : ${r} a été créé.`)})
                if(e) msg.channel.send({embed: embMsg(`Le role : ${e} existe déjà.`)})
            })
        } catch(e) {
            throwErr(e)
        }
        return true
    },

    load: function () {
        try {

        } catch(e) {
            throwErr(e)
        }
    }
}
