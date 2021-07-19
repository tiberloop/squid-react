let immediateEvents: any = {}
let eventUID: number = 0

export default class Dispatcher {
    __callbacks__: any;
    __uids__: any;

    static registerImmediate(event: any) {
        immediateEvents[event] = true
    }

    constructor() {
        this.__callbacks__ = {}
        this.__uids__ = {}
    }

    on(event: any, callback: any, generateUID: boolean = false) {
        let uid

        if (!this.__callbacks__[event]) {
            this.__callbacks__[event] = []
        }

        this.__callbacks__[event].push(callback)

        if (immediateEvents[event]) {
            delete (immediateEvents[event])
            this.emit(event)
        }

        if (generateUID) {
            uid = `event${eventUID++}`
            this.__uids__[uid] = callback
        }

        return callback
    }

    off(event: any, callback: any) {
        let index
        let arr = this.__callbacks__[event] || []
        let fn = this.__uids__[callback]

        delete (this.__uids__[callback])
        callback = fn || callback
        index = arr.findIndex((f: any) => f === callback)

        if (index > -1) {
            arr.splice(index, 1)
        }

        return this
    }

    offAll(event: any) {
        if (event) {
            delete (this.__callbacks__[event])
        } else {
            this.__callbacks__ = {}
        }

        return this
    }

    emit(event: any, ...params: any) {
        setTimeout(() => {
            let arr = this.__callbacks__[event] || []

            arr.forEach((callback: any) => {
                callback.apply(null, params)
            })            
        }, 0);

        return this
    }
}
