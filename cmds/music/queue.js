module.exports = {
    usage: "`<cmd>` : " + __("Display the music wait list."),
    max: 10,

    exec: function (msg, values) {
        try {
            var queue = client.audio.queue.getQu()
            var mx = this.max
            var queueMsg = ""
            var embInf = (new Discord.RichEmbed({})).setTitle(' ')
            if(queue.length > 0) {
                var queueMusic = "\n\u200b"
                var totalTime = 0
                queue.forEach( (e, i) => {
                    totalTime += parseInt(e.time)
                    if(mx > i) {
                        queueMusic += `\n:arrow_forward: [\`${e.time.strToTime()}\`] **[${e.title}](${e.link})**\n`
                        queueMusic += __("Add by") + __(" %s", [Do.resolve('user', e.author)]) + `\n`
                    }
                })
                var emb = new Discord.RichEmbed({})
                emb = emb.setColor(Do.resolve("color", msg.author.id))
                    .setTitle(":musical_note: " +  __("Music wait list") + ` (${queue.length}) :`)
                    .setDescription(queueMusic)
                    .setFooter(__("Total time : %s", [(""+totalTime).strToTime()]))
                if(queue.length > mx) emb = emb
                    .addField("\u200b", "\u200b", true)
                    .addField("\u200b", "\n```md\n# " + (queue.length - mx) + " " + __("more") + " #```", true)
                    .addField("\u200b", "\u200b", true)
                msg.channel.send({embed: emb}).catch(throwErr)
            } else {
                msg.channel.send({embed:
                    embInf.setDescription(__("No music in waiting.")).setColor(Do.resolve("color", msg.author.id))
                }).catch(throwErr)
            }
        } catch(e) {
            throwErr(e)
        }
        return true
    }
}
