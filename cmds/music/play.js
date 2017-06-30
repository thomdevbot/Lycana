module.exports = {
    usage: "`<cmd> [Youtube url | Soundcloud url | # command !search]` : " + __("Ask the bot to play music."),

    exec: function (msg, values) {
        try {
            var self = this
            if(client.voiceConnections.array().length == 0) {
                if(client.voiceConnections.last()){
                    var chn = client.voiceConnections.last().channel
                    client.voice.joinChannel(chn).then((connection) => {
                        client.vc = connection
                        self._play(msg, values)
                    }).catch(throwErr)
                } else {
                    if(Config.options.autojoin && Config.options.autojoin != "") {
                        var channel = Do.resolve('channel', Config.options.autojoin)
                        client.voice.joinChannel(channel).then((connection) => {
                            client.vc = connection
                            self._play(msg, values)
                        }).catch(throwErr)
                    }
                }
            } else {
                self._play(msg, values)
            }
        } catch(e) {
            throwErr(e)
        }
        return true
    },

    _play: function (msg, values) {
        try {
            if(values[1]) {
                if(Do.cmds["search"] !== undefined && !isNaN(Number(values[1]))){
                    if(
                        client.searchRes !== undefined
                        && Number(values[1]) > 0
                        && Number(values[1]) <= Do.cmds["search"].max
                    ) {
                        var link = client.searchRes[Number(values[1]) - 1].link
                        if(link && client.searchRes[Number(values[1]) - 1].type == "youtube#video") {
                            client.audio.play(msg, link, (song) => {
                                if(song) {
                                    msg.channel.send({embed:
                                        embMsg(__("<@%s> added `%s` to queue.", [msg.author.id, song.title]))
                                    }).catch(throwErr)
                                } else {
                                    msg.channel.send({embed:
                                        embErr(__("Je n'ai pas accès à cette musique... (Lien privé ou protégé)"))
                                    }).catch(throwErr)
                                }
                            })                                
                        } else {
                            msg.channel.send({embed:
                                embErr(":x: : " + __("This type of result (%s) is not playable.", [client.searchRes[Number(values[1]) - 1].type]))
                            }).catch(throwErr)
                        }
                    }
                } else {
                    var qu = client.audio.queue.getQu()
                    var nb = (client.audio.playing && client.audio.playing.author == msg.author.id)? 1 : 0
                    qu.forEach(e=>{ if(e.author == msg.author.id) nb++ })
                    if(Config.options.maxInQueue && nb >= Config.options.maxInQueue){
                        msg.channel.send({embed:
                            embErr(":x: : " + __("<@%s>, Maximum adds reached.", [msg.author.id]))
                        }).catch(throwErr)
                    } else {
                        client.audio.play(msg, values, (song) => {
                            if(song && song.queued) {
                                msg.channel.send({embed:
                                    embMsg(__("<@%s> added `%s` to queue.", [msg.author.id, song.title]))
                                }).catch(throwErr)
                            } else {
                                if(song === false) {
                                    msg.channel.send({embed:
                                        embErr(":x: : " + __("<@%s>, the music `%s` is already in queue.", [msg.author.id, values[1]]))
                                    }).catch(throwErr)
                                } else if(song === null && Do.cmds["search"]) {
                                    Do.cmds["search"].searchOne(values.subarray(1).join(" "), (url) => {
                                        if(typeof url == 'object' && url.msg) {
                                            msg.channel.send({embed: embErr(url.msg)}).catch(throwErr)
                                        } else {
                                            client.audio.play(msg, ["play", url], (song2) => {
                                                if(song2 && song2.queued) {
                                                    msg.channel.send({embed:
                                                        embMsg(__("<@%s> added `%s` to queue.", [msg.author.id, song2.title]))
                                                    }).catch(throwErr)
                                                } else {
                                                    if(song2 === false) {
                                                        msg.channel.send({
                                                            embed: embErr(":x: : " + __("<@%s>, the music `%s` is already in queue.", [msg.author.id, values[1]]))
                                                        }).catch(throwErr)
                                                    }
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        })
                    }
                }
            } else {
                client.audio.resume()
            }
        } catch(e) {
            throwErr(e)
        }
        return true
    }
}
