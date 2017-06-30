const asyncRequire = require('async-require')

module.exports = {
    usage: "`<cmd> [command]` : " + __("Reload the command."),
    show: false,
    restricted: true,

    exec: function (msg, values) {
        try {
            if(values[1]) {
                if(Do.cmds[values[1]]) {
                    var cmdPath = Do.cmds[values[1]]["path"];
                    var modPath = cmdPath.split(APPDIR + "/cmds/")[1];
                    if(asyncRequire.cache[modPath])
                        delete asyncRequire.cache[modPath];
                    asyncRequire(modPath.replace(/\.[^/.]+$/, "")).then(function(module){
                        var temp = {}
                        for (var key in Do.cmds[values[1]]) {
                            if(module.hasOwnProperty(key)) {
                                temp[key] = module[key];
                            } else {
                                temp[key] = Do.cmds[values[1]][key];
                            }
                        }
                        delete Do.cmds[values[1]];
                        Do.cmds[values[1]] = temp;
                        delete temp;
                        delete module;
                    })
                    msg.channel.send({
                        embed: embMsg(":white_check_mark: : " + __("Command %s reloaded.", [values[1]]))
                    }).catch(throwErr)
                } else msg.channel.send({
                    embed: embErr(":x: : " + __("Command %s not found.", [values[1]]))
                }).catch(throwErr)
            }
        } catch(e) {
            throwErr(e)
        }
        return true;
    }
}
