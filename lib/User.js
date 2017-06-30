'use strict';

/**
 * @class User
 * @param String id
 * @desc Class that manage user
 */
class User {
    constructor(id) {
        this.id = id
        this.nbCmds = 0
        this.badwords = 0
        this.nbMsg = 0
        this.alert = 0
    }
}
module.exports = User
