const YouTube = require('youtube-node')

module.exports = {
    usage: "`<cmd> [search words]` : " + __("Search the key words on Youtube, returns the <max> first results."),

    max: 5,
    toogled: false,

    exec: function (msg, values) {
        try {
            var self = this
            var maxRes = Do.cmds['search'].max
            if(self.toogled) return true
            self.toogled = true

            var youTube = new YouTube()
            youTube.setKey(Config.ytsearch)
            var fields = []
            youTube.search(values.subarray(1).join(" "), maxRes, function(error, result) {
                if(error) throwErr(error)
                else {
                    if(result.items.length == 0) {
                        self.toogled = false
                        msg.channel.send({
                            embed: embErr(":x: : " + __("No result for this search."))
                        }).catch(throwErr)
                    } else {
                        client.searchRes = []
                        var emb = embMsg("\n").setColor(Do.resolve("color", msg.author.id))
                            .setTitle(":mag_right: " + __("The %s first results", [Do.cmds['search'].max]) + ":")
                        var total = 0
                        result.items.forEach((res,i) => {
                            total++
                            client.searchRes[i] = {}
                            client.searchRes[i].type = res.id.kind
                            switch (res.id.kind) {
                                case 'youtube#video':
                                    var link = "https://www.youtube.com/watch?v=" + res.id.videoId
                                    fields[i] = `▶**[\`${i+1}\`]** __Music:__\t[${res.snippet.title}](${link})`
                                    break;
                                case 'youtube#channel':
                                    var link = "https://www.youtube.com/channel/" + res.id.channelId
                                    fields[i] = `🚹**[\`${i+1}\`]** __Channel:__ [${res.snippet.title}](${link})`
                                    break;
                                case 'youtube#playlist':
                                    var link = "https://www.youtube.com/playlist?list=" + res.id.playlistId
                                    fields[i] = `🔀**[\`${i+1}\`]** __Playlist:__  [${res.snippet.title}](${link})`
                                    break;
                            }
                            client.searchRes[i].link = link
                            if(result.items.length == total) {
                                emb.addField("\u200b", fields.join("\n\n"))
                                msg.channel.send({embed: emb}).catch(throwErr)
                                self.toogled = false
                            }
                        })
                    }
                }
            })
        } catch(e) {
            throwErr(e)
        }
        return true;
    },

    searchOne: function(strSearch, cb) {
        try {
            var youTube = new YouTube()
            youTube.setKey(Config.ytsearch)

            youTube.search(strSearch, 8, function(err, result){
                    if(err) throwErr(err)
                    else {
                        var best = null; var n = 0;
                        result.items.forEach((vid,i) => {
                            n++;
                            if(vid && vid.id.kind == "youtube#video" && !best) best = "https://www.youtube.com/watch?v=" + vid.id.videoId;
                            if(n == result.items.length && cb && typeof cb == "function") cb(best)
                        })
                        if(result.items.length == 0 && cb && typeof cb == "function")
                        {
                            cb({type:'err', msg:(":x: : " + __("No result for this search."))})
                        }
                    }
                }
            )
        } catch(e) {
            throwErr(e)
        }
    },

}
