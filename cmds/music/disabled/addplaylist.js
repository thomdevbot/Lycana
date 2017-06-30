const YTPlaylist = require('youtube-playlist-info')

module.exports = {
    usage: "`<cmd> [Url playlist youtube]` : "+ __("Ask to the bot to add a Youtube playlist"),
    max: 30,

    exec: function (msg, values) {
        try {
            if(values[1]) {
                var finlink = null
                if(Do.cmds["search"] !== undefined && !isNaN(Number(values[1]))) {
                    if(
                        client.searchRes !== undefined &&
                        Number(values[1]) > 0 &&
                        Number(values[1]) <= Do.cmds["search"].max
                    ) {
                        var link = client.searchRes[Number(values[1]) - 1].link
                        if(link && client.searchRes[Number(values[1]) - 1].type == "youtube#playlist") {
                            finlink = link
                        } else {
                            msg.channel.send({embed:
                                embErr(":x: : " + __("This type of result (%s) is not playable.", [client.searchRes[Number(values[1]) - 1].type]))
                            }).catch(throwErr)
                        }
                    }
                } else {
                    var reg = /^.*(youtu.be\/|list=)([^#\&\?]*).*/
                    var m = values[1].match(reg)
                    if(m && m[2]) finlink = m[2]
                }
                if(finlink) {
                    try {
                        YTPlaylist.playlistInfo(Config.ytsearch, finlink, (items) => {
                            var urls = []
                            items.forEach((item) => {
                                if(item && item.resourceId && item.resourceId.videoId)
                                    urls.push("https://www.youtube.com/watch?v=" + item.resourceId.videoId)
                            })
                            treat(urls, msg)
                            function treat(array, msg) {
                                if(array.length == 0) {
                                    msg.channel.send({embed:
                                        embMsg(":white_check_mark: : " + __("Playlist added."))
                                    }).catch(throwErr)
                                    msg.delete().catch(throwErr)
                                    return
                                }
                                var url = array.shift()
                                client.audio.play(msg, [null, url], (song) => {
                                    if(song === false)
                                        msg.channel.send({embed:
                                            embErr(":x: : " + __("<@%s>, the music `%s` is already in queue.", [msg.author.id, url]))
                                        }).catch(throwErr)
                                    treat(array, msg)
                                })
                            }
                        })
                    } catch(e) {
                        throwErr(e)
                    }
                } else msg.channel.send({embed:
                    embErr(__(":x: : Youtube playlist url invalid."))
                }).catch(throwErr)
            } else msg.channel.send({embed:
                embErr(__(":x: : Youtube playlist url missing."))
            }).catch(throwErr)
        } catch(e) {
            throwErr(e)
        }
        return true
    }
}
