#!/usr/bin/env node
const Fs    = require('fs')

/* GLOBAL CONSTANTS */

global.APPDIR = require('path').dirname(require.main.filename)
global.ERR_COLOR = '#ff6666'
global.OK_COLOR = '#88ff88'
global.DEFAULT_STREAM = 'https://www.twitch.tv/monstercat'
global.YT_ICON = 'https://www.youtube.com/yts/img/favicon_48-vfl1s0rGh.png'
global.SC_ICON = 'http://icons.iconarchive.com/icons/danleech/simple/1024/soundcloud-icon.png'


/* GLOBAL FUNCTIONS */

global.lang = {
    local: 'EN',
    file: null,
    init: (key) => {
        var path = `${APPDIR}/res/lang/${key}.js`
        try {
            lang.file = require(path)
            lang.local = key
        } catch(e) {
            console.error(`[ERR] The config language file : '${path}' can't be found.`)
        }
    }
}

global.__ = (key, arr) => {
    var string = key
    if(lang.file !== null) {
        if(lang.file[key] !== undefined) {
            string = lang.file[key]
        }
    }
    if(
        typeof arr == 'object' &&
        Array.isArray(arr) &&
        arr.length > 0
    ) {
        string = string.replaceArray('%s', arr)
    }
    return string
}

global.throwErr = (err , tryCatch) => {
    if(err && err !== null) {
        var strErr = ''
        var more = []
        if(typeof err == 'object') {
            if(Array.isArray(err) && err.length > 0) {
                var objErr = false
                var temp = []
                err.forEach(o => {
                    if(o instanceof Error) {
                        objErr = o
                    } else {
                        temp.push(o)
                    }
                })
                strErr = objErr ? objErr.toString() : '[Custom error]'
                if(objErr && objErr.stack) {
                    more.push(objErr.stack.split('\n').splice(0, 6).join('\n'))
                }
                temp.forEach(t => { more.push(t) })
                err = objErr || err[0]
            } else {
                strErr = err.toString()
                if(err.stack) {
                    more.push(err.stack.split('\n').splice(0, 6).join('\n'))
                }
            }
            if(err.response) {
                more.push(err.response.text)
            }
        } else {
            strErr = err
        }
        niceLog('[ERR] Catched : ' + strErr)
        if(Config && Config.owner && Config.debug && client.users.get(Config.owner)) {
            var other = (more && (more !== null) && more.length > 0) ? '```\n' + more.join('``` ```') + '```' : ''
            client.users.get(Config.owner).send({
                embed: embErr(':x: Error: `' + strErr + '` ' + other)
            }).catch(throwErr)
        }
        return strErr
    } else {
        return false
    }
}

global.niceLog = (text, err) => {
    var d = (new Date()).format('jj-mm hh:ii:ss')
    var str = '[' + d + ']' + text
    if(err) console.error(str)
    else console.log(str)
    return str
}

global.not = (variable, type) => {
    if(type == 'mixed') {
        return (variable === undefined)
    }
    if(type == 'array') {
        return (variable === undefined || variable == null ||
            typeof variable != 'object' || !Array.isArray(variable)
        )
    }
    return (variable === undefined || variable == null || typeof variable != type)
}

global.dlImg = (url, path, cb) => {
    var fs = require('fs'),
        request = require('request')
    var filename = APPDIR + '/' + path
    request.head(url, (err, res, body) => {
        request(url).pipe(fs.createWriteStream(filename)).on('close', () => {
            if(cb && typeof cb == 'function') cb(filename)
        })
    })
}

global.embErr = (text) => {
    return (new Discord.RichEmbed({})).setTitle(' ').setColor(ERR_COLOR).setDescription(text)
}

global.embMsg = (text) => {
    return (new Discord.RichEmbed({})).setTitle(' ').setColor(OK_COLOR).setDescription(text)
}
