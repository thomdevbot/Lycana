module.exports = {
    usage: "`<cmd> {info|list}` : " + __('Show them that you like this song ! \n(If you specify "info" this will display your stats instead)\n(If you specify "list" this will display your woot list instead)'),

    listSize: 10,

    exec: function (msg, values) {
        try {
            if(!this.woots) this.woots = Flatfile.sync(APPDIR + '/res/woots.db')
            this.getWooter(msg.author.id, (objPlayer) => {
                objPlayer = this.recalculate(objPlayer)
                this.woots.put(msg.author.id, objPlayer)
            })
            if(values[1]) {
                if(values[1] == "info") {
                    var gm = Do.resolve("user", msg.author.id)
                    this.getWooter(msg.author.id, wooter => {
                        var emb = new Discord.RichEmbed({})
                        var titre = this.titles[wooter.level - 1] ? this.titles[wooter.level - 1] : "Music God";
                        emb = emb.setColor(Do.resolve("color", msg.author.id))
                            .setTitle(" ")
                            .setAuthor(gm.displayName, gm.user.avatarURL)
                            .setDescription([
                                `**Level : ** ${wooter.level} - ${titre}`,
                                `**Points : ** ${wooter.points}`,
                                `**Exp : ** ${wooter.xp}`,
                            ].join("\n"))
                        msg.channel.send({embed: emb}).catch(throwErr)
                    })
                } else if(values[1] == "list") {
                    var gm = Do.resolve("user", msg.author.id)
                    var emb = embMsg()
                    emb.setColor(Do.resolve("color", msg.author.id))
                        .setAuthor(gm.displayName, gm.user.avatarURL)
                    var wootSongs = [];
                    this.getWooter(msg.author.id, wooter=>{
                        if(wooter.musics.length == 0) {
                            wootSongs.push(__("No music in memory."))
                        } else {
                            wootSongs.push(__("List of music that you liked :"))
                            wooter.musics.forEach((m,i) => {
                                wootSongs.push(`[\`${(i+1)}\`] **[${m.title}](${m.link})**`)
                            })
                        }
                        emb.setDescription(wootSongs.join(`\n`))
                        if(gm) gm.send({embed: emb}).catch(throwErr)
                    })
                }
            } else {
                if(client.audio.playing) {
                    if(!client.audio.playing.woots) client.audio.playing.woots = [];
                    if(Do.isUserInBotVoiceChannel(msg)) {
                        if(client.audio.playing.woots.indexOf(msg.author.id) == -1 && client.audio.playing.author != msg.author.id) {
                            if(Do.cmds["skip"] && !client.audio.playing.skipping) Do.cmds["skip"].skippers = [];
                            if(Do.cmds["skip"] && Do.cmds["skip"].skippers && Do.cmds["skip"].skippers.indexOf(msg.author.id) != -1) {
                                msg.channel.send({embed:
                                    embErr(":x: : " + __("You can not `woot` a song that you has `skip`..."))
                                }).catch(throwErr)
                            } else {
                                client.audio.playing.woots.push(msg.author.id)
                                this.oneUp(client.audio.playing.author, msg.author.id)
                                msg.channel.send({embed:
                                    embMsg(`<@${msg.author.id}> : ***WOOT !! WOOT !!*** :man_dancing:`)
                                }).catch(throwErr)
                            }
                        }
                    } else {
                        var gm = Do.resolve("user", msg.author.id)
                        gm.send({embed:
                            embErr(":x: : " + __("`You need to be connected to the same vocal channel for this command.`"))
                        }).catch(throwErr)
                    }
                }
            }
        } catch(e) {
            throwErr(e)
        }
        return true;
    },

    load: function () {
        var self = this
        if(!self.woots) self.woots = Flatfile.sync(APPDIR + '/res/woots.db')
    },

    oneUp: function (player, wooter) {
        var self = this
        try {
            self.getWooter(player, (objPlayer) => {
                objPlayer.points++
                objPlayer = self.recalculate(objPlayer)
                self.woots.put(player, objPlayer)
            })
            self.getWooter(wooter, (objWooter) => {
                objWooter.points++
                self.addWootMusic(objWooter, client.audio.playing)
                objWooter = self.recalculate(objWooter)
                self.woots.put(wooter, objWooter)
            })
        } catch(e) {
            throwErr(e)
        }
    },

    addWootMusic: function (wooter, songObj) {
        var self = this
        var a = []
        if(songObj && typeof songObj == 'object') a.push(songObj)
        wooter.musics.forEach(e => { if(a.length < self.listSize) a.push(e) })
        wooter.musics = a
        self.woots.put(wooter.id, wooter)
    },

    getWooter: function (id, cb) {
        var self = this
        if(!self.woots) self.woots = Flatfile.sync(APPDIR + '/res/woots.db')
        try {
            if(!self.woots.has(id)) {
                self.woots.put(id, self.newWooter(id), () => {
                    if(cb && typeof cb == "function") cb(self.woots.get(id))
                })
            } else {
                self.woots.put(id, self.updWooter(id), () => {
                    if(cb && typeof cb == "function") cb(self.woots.get(id))
                })
            }
        } catch(e) {
            throwErr(e)
        }
    },

    newWooter: function (id) {
        return {
            id: ""+id,
            points: 0,
            xp: "",
            level: 1,
            musics:[],
        }
    },

    updWooter: function (id) {
        var self = this
        var w = self.woots.get(id)
        if(!w.musics) w.musics = []
        return w
    },

    recalculate: function (obj) {
        try {
            var pool = obj.points
            var levels = 1
            var nextLevelPoints = 5
            if(pool >= nextLevelPoints) {
                do {
                    pool -= nextLevelPoints
                    nextLevelPoints += Math.ceil(nextLevelPoints * 0.1)
                    levels++
                } while (pool > nextLevelPoints)
            }
            if(obj.level < levels) {
                obj.level = levels
                this.levelUp(obj.id)
            }
            var percent = (pool/nextLevelPoints*100).toFixed(1)
            obj.xp = ((percent == 100.0)? (0).toFixed(1) : percent)
                + `% *(${pool}/${nextLevelPoints})*`
            return obj
        } catch(e) {
            throwErr(e)
        }
    },

    levelUp: function (id) {
        var self = this
        try {
            var chn = (client.audio.playing)? Do.resolve("channel", client.audio.playing.channel) : null
            var infos = self.woots.get(id)
            if(chn) chn.send({embed:
                embMsg(__("<@%s> leveled up to %s ! ***Woot woot !!***", [id, infos.level])).setColor("#6666ff")
            }).catch(throwErr)
        } catch(e) {
            throwErr(e)
        }
    },

    titles: [
        "Beginner", "Beginner", "Beginner", "Casual", "Casual", "Casual", "Expert", "Expert", "Expert",
    ],
}
