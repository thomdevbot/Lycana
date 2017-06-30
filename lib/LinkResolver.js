'use strict'
const Fs            = require('fs')
const Streamfile    = require('youtube-dl')

/**
 * @class LinkResolver
 * @desc Class that manage links and music items
 */
class LinkResolver {

    constructor(audio) {
        this.audio = audio
    }

    /**
     * @param String url
     * @param function callback
     * @desc returns the song infos on a Youtube url
     */
    mixedToSong(url, addMsg, callback) {
        var self = this
        var urlString = null
        var alreadyDL = false
        switch (typeof url) {
            case 'object':
                if(Array.isArray(url)) {
                    urlString = url[1]
                } else {
                    urlString = url.link
                    alreadyDL = true
                }
            break;
            case 'string':
                urlString = url
            break;
        }

        function baseDL(urlString, urlInfos, addMsg, callback) {
            try {
                var dlComplete = true
                var file = APPDIR + '/res/' + (new Date()).getTime() + '.mp3'
                var obj = {
                    'link': urlString,
                    'file': file,
                    'type': urlInfos.type,
                    'channel': addMsg.channel,
                    'author': addMsg.author
                }
                // if(!self.audio.playing) self.audio.playing = obj
                var currentStream = Streamfile(urlString, ['--audio-format', 'mp3', '--ignore-errors'], {maxBuffer: 4096*1024})
                var songFile = Fs.createWriteStream(file)

                currentStream.on('error', err => {
                    throwErr(err, true)
                    if(callback && typeof callback == 'function') callback(false)
                })
                var dlMsg = null;
                currentStream.on('info', info => {
                    if(self.isLengthOk(info.duration.hmsToSecondsOnly())) {
                        var c = Do.resolve('channel', addMsg.channel)
                        if(c) c.send({embed: embMsg(__(`Downloading the song ...`))}).then(m => {
                            dlMsg = m
                        }).catch(throwErr)
                        currentStream.pipe(songFile)
                        obj.title = info.uploader + ' - ' + info.title
                        obj.img = info.thumbnail
                        obj.time = ''+info.duration.hmsToSecondsOnly()
                    } else {
                        if(callback && typeof callback == 'function') {
                            callback(false)
                        }
                    }
                })
                currentStream.on('end', () => {
                    if(dlMsg) dlMsg.delete()
                    if(callback && typeof callback == 'function') {
                        callback((dlComplete) ? obj : false)
                    }
                })
            } catch(err) {
                throwErr(err, true)
            }
        }

        if(urlString && !alreadyDL) {
            var urlInfos = this.resolveUrlType(urlString)
            var addMsg = addMsg
            if(urlInfos) {
                switch (urlInfos.type) {
                    case 'youtube':
                        if(Config.fileOnly) {
                            baseDL(urlString, urlInfos, addMsg, callback)
                        } else {
                            this.audio.youTube.getById(urlInfos.code, (error, result) => {
                                if(error) throwErr(error)
                                else {
                                    var s = result.items[0]
                                    if(callback && typeof callback == 'function') callback({
                                        'title':s.snippet.title,
                                        'link':('https://www.youtube.com/watch?v='+s.id),
                                        'img': s.snippet.thumbnails.default.url,
                                        'time':''+s.contentDetails.duration.substr(2).toLowerCase().jhms() ,
                                        'type':urlInfos.type,
                                        'channel': addMsg.channel,
                                        'author': addMsg.author
                                    })
                                }
                            })
                        }
                    break;
                    case 'soundcloud':
                        baseDL(urlString, urlInfos, addMsg, callback)
                        //  throwErr('soundcloud not working for moment.')
                        //  callback(null)
                    break;
                    case false:
                        throwErr('Url can not be resolved.')
                        callback(null)
                    break;
                }
            } else {
                callback(null)
            }
        } else callback(url)
    }

    /**
     * @param String url
     * @desc Parse the string url and return link and type
     * @return Object
     */
    resolveUrlType(url) {
        var y = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
        if(url.match(y)) return { code:('' +url.match(y)[1]), type:'youtube' }
        var s = /^https?:\/\/(soundcloud\.com|snd\.sc)\/(.*)$/
        if(url.match(s)) return { code:('' +url.match(s)[2]), type:'soundcloud' }
        return false
    }

    isLengthOk(time) {
        var lengthOk = true
        if(Config.options.maxMusicLength) {
            lengthOk = (
                (Config.options.maxMusicLength > 0) &&
                (Number(Config.options.maxMusicLength) > Number(time))
            )
        }
        return lengthOk
    }
}
module.exports = LinkResolver
