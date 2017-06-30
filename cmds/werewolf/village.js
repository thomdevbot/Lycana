module.exports = {
    usage: "`<cmd>` : " + __("Active/Désactive le chat et le vocal pour le village."),

    actived: true,

    exec: function (msg, values) {
        try {
            var cnf = Config.options.modules.lg
            var vivants = Do.resolve('role', cnf.roles.alive)

            if (this.actived) {
                this.actived = false
                this.muteVillage()
                if (vivants) {
                    vivants.members.array().forEach(m => {
                        m.setMute(true).catch(throwErr)
                    })
                }
            } else {
                this.actived = true
                this.unmuteVillage()
                if (vivants) {
                    vivants.members.array().forEach(m => {
                        m.setMute(false).catch(throwErr)
                    })
                }
            }
        } catch(e) {
            throwErr(e)
        }
        return true
    },

    muteVillage: function() {
        try {
            var cnf = Config.options.modules.lg
            var village = Do.resolve("channel", cnf.channels.village)
            var ev = Do.resolve('role', "@everyone")
            if (ev && village) {
                village.overwritePermissions(ev, {
                    'SEND_MESSAGES': false
                }).catch(throwErr)
            } else {
                throwErr([`${cnf.channels.village} introuvable.`])
            }
        } catch (e) {
            throwErr(e)
        }
    },

    unmuteVillage: function() {
        try {
            var cnf = Config.options.modules.lg
            var village = Do.resolve("channel", cnf.channels.village)
            var ev = Do.resolve('role', "@everyone")

            if (ev && village) {
                village.overwritePermissions(ev, {
                    'SEND_MESSAGES': null
                }).catch(throwErr)
            } else {
                throwErr([`${cnf.channels.village} introuvable.`])
            }
        } catch (e) {
            throwErr(e)
        }
    }
}
