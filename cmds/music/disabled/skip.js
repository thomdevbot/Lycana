module.exports = {
    usage: "`<cmd>` : " + __("Start a vote to skip the current music."),
    skippers: [],

    exec: function (msg, values) {
        try {
            if(!client.audio.playing) {
                msg.channel.send({
                    embed: embErr(":x: : " + __("No music to skip."))
                }).catch(throwErr)
            } else {
                if(this.skippers.indexOf(msg.author.id) == -1){
                    if(Do.cmds["woot"] && client.audio.playing.woots &&  client.audio.playing.woots.indexOf(msg.author.id) != -1) {
                        msg.channel.send({
                            embed: embErr(":x: : " + __("You can not `skip` a song that you has `woot`..."))
                        }).catch(throwErr)
                    } else {
                        if(!client.audio.playing.skipping){
                            client.audio.playing.skipping = true
                            this.skippers = []
                        }
                        this.skippers.push(msg.author.id)
                        var maxVoicers = client.getVc().channel.members.array().length -1
                        var skipnum = this.skippers.length
                        var skip = false
                        if( maxVoicers < 3 ) skip = true
                        if(!skip) {
                            if(skipnum > (maxVoicers / 2)) {
                                skip = true;
                            }
                        }
                        if(skip) {
                            msg.channel.send({
                                embed: embMsg(__("Vote successfull."))
                            }).catch(throwErr)
                            this.skippers = []
                            client.audio.playing.skipping = false
                            client.audio.next()
                        } else {
                            msg.channel.send({
                                embed: embMsg(__("**[%s%]** *(+50% required)* Vote to change music : %s/%s", [Math.round(skipnum / maxVoicers * 100), skipnum, maxVoicers])).setColor("#6666ff")
                            }).catch(throwErr)
                        }
                    }
                }
            }
        } catch(e) {
            throwErr(e)
        }
        return true;
    },
};
