'use strict';
const Fs = require('fs')

/**
 * @class Queue
 * @desc Class that manage the list of songs to play
 */
class Queue {
    constructor(db) {
        this.datas = db
        if(!this.datas.has('qu')) {
            this.setQu([])
        }
    }

    /**
     * @param Object link
     * @desc Add link to queue
     * @return Boolean
     */
     push(link, cb) {
         if(!link) {
             if(cb && typeof cb == 'function') cb(null)
             return false
         }
         var qu = this.datas.get('qu')
         for(var i = 0; i < qu.length; i++) {
             if(qu[i].link == link.link) {
                 if(cb && typeof cb == 'function') cb(false)
                 return false
             }
         }
         qu.push(link)
         this.datas.put('qu', qu, () => {
             if(cb && typeof cb == 'function') cb(link)
             return true
         })
     }

    /**
     * @desc return the position 0 song
     * @return Object
     */
    next() {
        var qu = this.datas.get('qu')
        if(qu.length == 0) return false
        var returned = qu[0]
        this.shift(true)
        return returned
    }

    /**
     * @desc Shift the position 0 song
     */
    shift(noDelete) {
        var qu = this.datas.get('qu')
        var el = qu.shift()
        if(el && el.file && !noDelete) {
            Fs.unlink(el.file, (e) => {
                if(e) throwErr(e)
            })
        }
        this.datas.put('qu', qu)
    }

    /**
     * @desc queue getter
     */
    getQu() {
        return this.datas.get('qu')
    }

    /**
     * @desc queue setter
     */
    setQu(val) {
        this.datas.put('qu', val)
    }
}

module.exports = Queue
