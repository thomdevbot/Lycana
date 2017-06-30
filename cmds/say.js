module.exports = {
    usage: "`<cmd> [target] [text]` : " + __("Send text to the target."),
    show: false,
    restricted: true,

    exec: function (msg, values) {
        try {
            var chn = Do.resolve('channel' ,values[1])
            if(chn) chn.send(values.subarray(2).join(" ")).catch(throwErr)
        } catch(e) {
            throwErr(e)
        }
        return true;
    }
}
