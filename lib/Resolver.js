'use strict';

/**
* @class Resolver
* @param Do Do
* @desc Class to resolve things
*/
class Resolver {

    constructor() { }

    /**
     * @param string|Object|null mixed
     * @desc resolve the server
     * @return Guild
     */
     getServer(mixed) {
        var ret = (!mixed) ? client.guilds.get(Config.server) : null
        if(ret) return ret
        if(typeof mixed == 'object' && !Array.isArray(mixed)) {
            for(var key in mixed) {
                if(key == 'id')
                    ret = client.guilds.get(mixed[''+key])
                else
                    ret = client.guilds.find(''+key, mixed[''+key])
                if(ret) return ret
            }
        } else {
            if(!mixed) return null
            ret = client.guilds.get(mixed)
            if(!ret) ret = client.guilds.find('name', mixed)
        }
        return ret
    }

    /**
     * @param string|Object|null mixed
     * @desc resolve the channel
     * @return GuildChannel
     */
    getChannel(mixed) {
        var me = this
        var ret = null
        if(!mixed) return null
        var serv = me.getServer()
        if(mixed && typeof mixed == 'object') {
            if(mixed.server)
                serv = me.getServer(mixed.server)
            for(var key in mixed) {
                if(key == 'id')
                    ret = serv.channels.get(mixed[''+key])
                else if(key !== 'type') {
                    ret = serv.channels.find(''+key, mixed[''+key])
                    if(ret) return ret
                }
            }
            if(!ret &&  mixed['name']) {
                return me.getChannel(mixed['name'])
            } else return null
        } else {
            if(!serv) return null
            ret = serv.channels.get(mixed)
            if(!ret) ret = serv.channels.find('name', mixed)
            if(!ret) ret = serv.channels.find('name', mixed.substr(1))
            var matches = mixed.match(new RegExp(/<#(.*)>/))
            if(!ret && matches && matches[1])
                ret = serv.channels.get(matches[1])
        }
        return ret
    }

    /**
     * @param string|Object mixed
     * @desc resolve the command name
     * @return String
     */
    getAlias(mixed) {
        var ret = null
        if(!mixed) return null
        if(typeof mixed == 'string') {
            for(var cname in Do.cmds) {
                var cd = Do.cmds[cname]
                var cmdsTriggers = []
                if(cd.alias !== undefined && typeof cd.alias == 'object' && Array.isArray(cd.alias)) {
                    cd.alias.forEach(a => {
                        cmdsTriggers.push('' + a)
                    })
                }
                if(cmdsTriggers.indexOf(mixed) > -1) ret = cd.cmd
            }
        }
        return ret
    }

    /**
     * @param string|Object mixed
     * @desc resolve the role
     * @return Role
     */
    getRole(mixed) {
        var me = this
        var ret = null
        if(!mixed) return null
        var serv = me.getServer()
        if(mixed && typeof mixed == 'object') {
            if(mixed.server)
                serv = me.getServer(mixed.server)
            for(var key in mixed) {
                if(key == 'id')
                    ret = serv.roles.get(mixed[''+key])
                else
                    ret = serv.roles.find(''+key, mixed[''+key])
                if(ret) return ret
            }
        } else {
            ret = serv.roles.get(mixed)
            var matches = mixed.match(new RegExp(/<@&(.*)>/))
            if(!ret && matches && matches[1])
                ret = serv.roles.get(matches[1])
            if(!ret) ret = serv.roles.find('name', mixed)
        }
        return ret
    }

    /**
     * @param string|Object mixed
     * @desc resolve the member
     * @return GuildMember
     */
    getMember(mixed, reindex) {
        var me = this
        var ret = null
        if(!mixed) return null
        var serv = me.getServer()
        if(mixed && typeof mixed == 'object') {
            if(mixed.server)
                serv = me.getServer(mixed.server)
        }
        if(reindex && typeof reindex == 'function') {
            serv.fetchMembers().then(guild => {
                var gm = _searchMember(guild, mixed)
                reindex(gm)
                return gm
            }).catch(throwErr)
        } else {
            return _searchMember(serv, mixed)
        }

        function _searchMember(guild, mixed) {
            var ret = null
            if(mixed && typeof mixed == 'object') {
                for(var key in mixed) {
                    if(key == 'id')
                        ret = guild.members.get(mixed[''+key])
                    else
                        ret = guild.members.find(''+key, mixed[''+key])
                    if(ret) return ret
                }
            } else {
                if(!mixed) return null
                ret = guild.members.get(mixed)
                if(!ret) ret = guild.members.find(gm => gm.user.id == mixed)
                var matches = mixed.match(new RegExp(/<@!?(.*)>/))
                if(!ret && matches && matches[1]) {
                    ret = guild.members.get(matches[1])
                    if(!ret) ret = guild.members.find(gm => gm.user.id == matches[1])
                }
                if(!ret) ret = guild.members.find(gm => gm.user.name === mixed)
                if(!ret) ret = guild.members.find('nickname', mixed)
            }
            return ret
        }
    }

    /**
     * @param string|Object mixed
     * @desc resolve the user
     * @return User
     */
    getUser(mixed) {
        var ret = null
        if(!mixed) return null
        if(mixed && typeof mixed == 'object') {
            for(var key in mixed) {
                if(key == 'id')
                    ret = client.users.get(mixed[''+key])
                else
                    ret = client.users.find(''+key, mixed[''+key])
                if(ret) return ret
            }
        } else {
            ret = client.users.get(mixed)
            var matches = mixed.match(new RegExp(/<@!?(.*)>/))
            if(!ret && matches && matches[1]){
                ret = client.users.get(matches[1])
            }
            if(!ret) ret = client.users.find('username', mixed)
        }
        return ret
    }

    /**
     * @param string|Object mixed
     * @desc resolve the color of user
     * @return hexColor
     */
    getColor(mixed) {
        var me = this;
        var ret = '#000000'
        var gm = me.getMember(mixed)
        var hRole = null
        if(gm) {
            gm.roles.array().forEach(r => {
                if(!hRole || (r.hexColor != '#000000' && hRole.position < r.position)) hRole = r
            })
            return (hRole)? hRole.hexColor : ret
        } else return ret
    }
}
module.exports = Resolver
