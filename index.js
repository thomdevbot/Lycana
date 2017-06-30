#!/usr/bin/env node

global.Discord  = require('discord.js')
global.Flatfile = require('flat-file-db')
global.Config   = require('./config.json')
const ProtoFunc = require('./lib/functions.js')
const Global    = require('./lib/global.js')
const Audio     = require('./lib/Audio.js')
const DoLib     = require('./lib/Do.js')
const Queue     = require('./lib/Queue.js')

console.log('### Starting the application ###')

global.db       = Flatfile.sync(APPDIR + '/res/queue.db')
global.client   = new Discord.Client({
    fetchAllMembers: true,
})
var queue       = new Queue(db)
client.audio    = new Audio(queue)
global.Do       = new DoLib()

// #############################################################################
//                              Discord.js event
// #############################################################################

var execute     = function(command, callback) {
    exec(command, {maxBuffer: 1024 * 2048},
        function(error, stdout, stderr){ callback(error, stdout) }
    )
}

client.once('ready', () => {
    try {
        niceLog(`>>>> Bot is now ready with ID : ${client.user.id}`)
        if(Config.options.autojoin && Config.options.autojoin) {
            var channel = Do.resolve('channel', Config.options.autojoin)
            if(channel) {
                client.voice.joinChannel(channel).then((connection) => {
                    client.vc = connection
                    niceLog(__(`Bot successfully joined "%s"`, [channel.name]))
                    if(client.audio.queue.getQu().length > 0) {
                        if(Config.options.autoplay == null || Config.options.autoplay == true) {
                            client.audio.tryPlayNext(0)
                        }
                    }
                }).catch(e => {
                    niceLog('Please make sure you installed ffmpeg.')
                    throwErr(e)
                })
            } else {
                niceLog('Autojoin channel cannot be found. Please check the autojoin channel config.')
            }
        }
    } catch(e) {
        throwErr(e)
    }
})

client.on('message', (message) => {
    message.prx = Config.prx
    Do.niceSpeak(message)
    message.isCmd = Do.msgCmd(message)
})

client.on('messageUpdate', (old, message) => {
    message.prx = Config.prx
    Do.niceSpeak(message)
    if(!old.isCmd) message.isCmd = Do.msgCmd(message)
})

// #############################################################################
//                                   SCRIPT
// #############################################################################

try {
    if(Config.token) {
        niceLog('Try to connecting with token ...')
        client.login(Config.token).then(() => {
            niceLog(__('Logged succefully with token : %s', [Config.token]))
        }).catch(throwErr)
    } else {
        niceLog('[ERR] No credentials given.')
        process.exit(-2)
    }
    if(Config.lang) {
        if(/^[a-zA-Z]+$/.test(Config.lang)) {
            niceLog(__('Loading lang : %s.js', [Config.lang]))
            lang.init(Config.lang)
        }
    }
} catch(e) {
    throwErr(e)
}
