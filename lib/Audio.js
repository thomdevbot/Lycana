'use strict'
const YouTube       = require('youtube-node')
const Streamfile    = require('youtube-dl')
const ytdlCore      = require('ytdl-core')
const Fs            = require('fs')
const LinkRes       = require('./LinkResolver.js')

/**
 * @class Audio
 * @param Object Config
 * @param Queue queue
 * @desc Class that manage audio status of the bot
 */
class Audio {

    /**
     * @param Queue queue
     * @desc constructor of Audio class
     */
    constructor(queue) {
        this.queue = queue
        this.playing
        this.paused = false
        this.stopped = true
        this.volume = (Config.options.defaultVolume !== undefined) ? Config.options.defaultVolume : 0.2
        this.autoplay = (Config.options.autoplay !== undefined) ? Config.options.autoplay : true
        this.showPlaying = (Config.options.showPlaying !== undefined) ? Config.options.showPlaying : true

        this.youTube = new YouTube()
        this.youTube.setKey(Config.ytsearch)
        this.linkRes = new LinkRes(this)
        this.dispatcher = null
    }

    /**
     * @param Message msg
     * @param Object | String song
     * @param function cb
     * @desc Play or addtoqueue
     */
    play(msg, song, cb) {
        // Resolve song and message
        var self = this
        if(song == false) return false
        if(msg) {
            var addMsg = {channel: msg.channel.id, author: msg.author.id}
        } else {
            var addMsg = {channel: song.channel, author: song.author}
        }
        this.linkRes.mixedToSong(song, addMsg, music => {
            if(music) {
                if(self.playing || self.queue.getQu().length > 0) {
                    this.addToQueue(addMsg, music, cb)
                } else {
                    this._play(addMsg, music, cb)
                }
            } else {
                if(music === false) {
                    var errEmb = (new Discord.RichEmbed({})).setTitle(' ').setColor(ERR_COLOR)
                    Do.resolve('channel', addMsg.channel).send({
                        embed: errEmb.setDescription(':x: : ' + __('The music is too long :rolling_eyes:'))
                    }).catch(throwErr)
                } else {
                    if(cb) cb(music)
                }
            }
        })
    }

    /**
     * @param Message msg
     * @param Object | String song
     * @param function cb
     * @desc Add song to queue
     */
    addToQueue(msg, song, cb) {
        var self = this
        this.queue.push(song, queued => {
            if(typeof queued === 'object') queued.queued = true
            if(cb !== undefined && typeof cb == 'function') cb(queued)
        })
    }

    /**
     * @param Message msg
     * @param Object | String song
     * @param function cb
     * @desc Prepare song playing
     */
    _play(msg, song, cb) {
        switch(song.type) {
            case 'youtube':
                if(Config.fileOnly) this.FilePlay(song, cb)
                else this.StreamPlay(song, cb)
            break;
            case 'soundcloud':
                this.FilePlay(song, cb)
            break;
            default:
                if(cb) cb(false)
                throwErr('[ERR] Music link is not defined or is wrong.')
        }
    }

    /**
     * @param Oject song
     * @param function cb
     * @desc play a youtube link
     */
    StreamPlay(song, cb) {
        var self = this
        var plOptions = { seek: ((song.beginAt)? song.beginAt : 0), volume: self.volume }
        try {
            var currentStream = Streamfile(song.link, ['--audio-format', 'mp3', '--ignore-errors'], {maxBuffer: 4096*1024})
            currentStream.on('info', (info, format) => {
                self.playing = song
                self.readStream(currentStream, plOptions, cb)
            })
        } catch(e) {
            throwErr(e)
        }
    }

    /**
     * @param Oject song
     * @param function cb
     * @desc play a file
     */
    FilePlay(song, cb) {
        var self = this
        var plOptions = { seek: ((song.beginAt)? song.beginAt : 0), volume: self.volume }
        try {
            self.playing = song
            self.readFile(song.file, plOptions, cb)
        } catch(e) {
            throwErr(e)
        }
    }

    /**
     * @param mixed file
     * @param Object opt
     * @param function cb
     * @desc begin the song
     */
    readFile(file, opt, cb) {
        var self = this
        if(this.showPlaying) {
            client.user.setPresence({game: {
                name: self.playing.title,
                type: 1,
                url: Config.stream || DEFAULT_STREAM
            }}).catch(throwErr)
        }
        delete this.dispatcher
        this.dispatcher = client.vc.playFile(file, opt)
        this.dispatcher.on('end', () => {
            Fs.unlink(file, (e) => {
                if(e) throwErr(e)
            })
            self.songEnded()
        })

        if(this.dispatcher) {
            this.avertNowPlaying(cb)
        } else {
            throwErr('[ERR] File cannot be read !')
            if(cb) cb(false)
        }
    }

    /**
     * @param mixed stream
     * @param Object opt
     * @param function cb
     * @desc begin the song
     */
    readStream(stream, opt, cb) {
        var self = this
        if(this.showPlaying) {
            client.user.setPresence({game: {
                name: self.playing.title,
                type: 1,
                url: Config.stream || DEFAULT_STREAM
            }}).catch(throwErr)
        }
        delete this.dispatcher
        self.dispatcher = client.vc.playStream(stream, opt)
        self.dispatcher.on('end', () => {
            self.songEnded()
        })

        if(this.dispatcher) {
            this.avertNowPlaying(cb)
        } else {
            throwErr('[ERR] Stream cannot be read !')
            if(cb) cb(false)
        }
    }

    /**
     * @param function cb
     * @desc Send embed msg
     */
    avertNowPlaying(cb) {
        var self = this
        self.stopped = false

        var icn = (self.playing.type == 'youtube')? YT_ICON : SC_ICON
        var sendChn = Do.resolve('channel', self.playing.channel)
        var emb = new Discord.RichEmbed({})

        emb.setColor(Do.resolve('color', self.playing.author))
            .setAuthor(__('Playing music') + ':', icn)
            .setThumbnail(self.playing.img)
            .setDescription([
                `[\`${self.playing.time.strToTime()}\`] **[${self.playing.title}](${self.playing.link})**`,
                __('Add by') + __(' <@%s>', [self.playing.author]),
            ].join('\n'))
        if(this.showPlaying && sendChn) {
            sendChn.send({embed: emb}).then(() => {
                if(cb !== undefined && typeof cb == 'function') cb(self.playing)
            }).catch(throwErr)
        } else {
            if(cb !== undefined && typeof cb == 'function') cb(self.playing)
        }
    }

    /**
     * @desc Triggers when song ends
     */
    songEnded() {
        if(this.stopped) {
            this.stopped = false
        } else {
            if(this.autoplay) {
                this.tryPlayNext(2000)
            }
        }
    }

    /**
     * @param function temp
     * @param function cb
     * @desc Try to play the next song
     */
    tryPlayNext(temp, cb) {
        var self = this
        var time = (!isNaN(parseInt(temp)))? parseInt(temp) : 3000;
        setTimeout(() => {
            var next = self.queue.next()
            if(next !== false) {
                self.stop(() => {
                    self._play(null, next, cb)
                }, true)
            } else {
                self.stop(() => {}, false)
            }
        },time)
    }

    /**
     * @desc Force next song to be played
     */
    next() {
        if(this.dispatcher) {
            this.dispatcher.end()
            if(!this.autoplay) this.tryPlayNext(0)
        } else {
            this.tryPlayNext(0)
        }
    }

    /**
     * @param function cb
     * @param boolean soft
     * @desc Stop softly or hardly the song
     */
    stop(cb, soft) {
        if(soft) {
            this.playing = null
            if(cb !== undefined && typeof cb == 'function') cb()
        } else {
            if(client.vc) {
                this.playing = null
                this.stopped = true
                if(this.dispatcher) this.dispatcher.end()
            }
            client.user.setStatus('online').then(() => {
                client.user.setGame({}).then(() => {
                    if(cb !== undefined && typeof cb == 'function') cb()
                }).catch(throwErr)
            }).catch(throwErr)
        }
    }

    /**
     * @param float volume
     * @param function cb
     * @desc Changes the output volume
     */
    setVolume(volume, cb) {
        var self = this
        var vol = parseFloat(volume)
        if(vol >= 0 && vol <= 2.0) {
            self.volume = vol
            if(client.vc && self.dispatcher){
                self.dispatcher.setVolume(self.volume)
                if(cb && typeof cb == 'function') cb(null, self.volume)
            } else {
                if(cb && typeof cb == 'function') cb('Not connected or not talking.', self.volume)
            }
        } else {
            if(cb && typeof cb == 'function') cb('Wrong value for volume.', self.volume)
        }
    }

    /**
     * @param function cb
     * @desc Pause the vocal output
     */
    pause(cb) {
        var self = this
        if(client.vc && self.dispatcher){
            if(self.playing && !self.paused) {
                self.dispatcher.pause()
                self.paused = true
                if(this.showPlaying) {
                    client.user.setStatus('online').then(() => {
                        client.user.setGame('[▮▮] ' + self.playing.title).then(() => {
                            if(cb !== undefined && typeof cb == 'function') cb()
                        }).catch(throwErr)
                    }).catch(throwErr)
                } else {
                    if(cb !== undefined && typeof cb == 'function') cb()
                }
            }
        }
    }


    /**
     * @param function cb
     * @desc Resume the vocal output
     */
    resume(cb) {
        var self = this
        if(client.vc && self.dispatcher){
            if(self.playing && self.paused) {
                self.dispatcher.resume()
                self.paused = false
                if(this.showPlaying) {
                    client.user.setPresence(
                        {
                            game: {
                                name: self.playing.title,
                                type:1,
                                url: Config.stream || DEFAULT_STREAM
                            }
                        }
                    ).then(() => {
                        client.user.setGame(self.playing.title).then(() => {
                            if(cb !== undefined && typeof cb == 'function') cb()
                        }).catch(throwErr)
                    }).catch(throwErr)
                } else {
                    if(cb !== undefined && typeof cb == 'function') cb()
                }
            }
        }
    }

}
module.exports = Audio
