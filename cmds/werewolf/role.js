module.exports = {
    usage: "`<cmd> {Optionnel : Nom du role}` : " + __("Retourne la liste des roles / leur description."),
    pmOnly: false,
    notPm: false,
    restricted: false,

    exec: function (msg, values) {
        try {
            var cnf = Config.options.modules.lg
            var roles = client.LG_MODULE.roles
            if(values[1]) {
                if(values[1] == "*" && !Do.isUserInRoleList(msg.author, [cnf.roles.mdj, cnf.roles.anim])) return true
                for (var rolename in roles) {
                    if (Do.contains(this.normify(rolename), this.normify(values.subarray(1).join(" "))) || values[1] == "*") {
                        var role = roles[rolename]
                        msg.channel.send({
                            embed: embMsg(role.desc.join("\n"))
                                .setColor(role.color)
                                .setAuthor("[Role] : " + rolename, role.img)
                        }).catch(throwErr)
                    }
                }
            } else {
                msg.channel.send({
                    embed: embMsg("***[`Aide`] Liste des roles :*** ```md\n" + Object.keys(roles).join(", ") + ".```")
                }).catch(throwErr)
            }
        } catch(e) {
            throwErr(e)
        }
        return true
    },

    findRole: function (string) {
        for(var rolename in client.LG_MODULE.roles) {
            var r = client.LG_MODULE.roles[rolename]
            if(this.normify(rolename) === this.normify(string)) {
                r.name = rolename
                return r
            }
        }
        for(var rolename in client.LG_MODULE.roles) {
            var r = client.LG_MODULE.roles[rolename]
            if(this.normify(rolename).indexOf(this.normify(string)) !== -1) {
                r.name = rolename
                return r
            }
        }
        return null
    },

    normify(str) {
        if(!str) { return '' }
        str = str.trim().replace(/^\s+|\s+$/g, '') // trim
        str = str.toLowerCase()
        // remove accents, swap ñ for n, etc
        var from = 'ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;'
        var to = 'aaaaaeeeeeiiiiooooouuuunc------'
        for(var i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
        }
        str = str.replace(/[^a-z0-9 -]/g, '-') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-') // collapse dashes
            .replace(/^-/g, '') // Cut first -
            .replace(/-$/g, '') // Cut last -
        return str
    }
}
