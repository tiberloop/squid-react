import { useState, useEffect } from 'react'
import Dispatcher from './dispatcher'

let store: any = {}
const dispatcher = new Dispatcher()

function createStore(value: any) {
    store = value
}

function getStore(key: any) {
    return store[key]
}

function setStore(key: any, value: any) {
    store[key] = value
    dispatcher.emit('data', store)
}

function useStore(key: any) {
    const [value, setData] = useState(store[key])

    useEffect(() => {
        const fn = dispatcher.on('data', (data: any)=>{
            let value = data[key]

            if (Array.isArray(value)){
                setData(value)
            } else if (typeof(value) == 'object') {
                setData({...value})
            } else {
                setData(value)
            }
        })

        return ()=>{
            setImmediate(()=>{
                dispatcher.off('data', fn)
            })
        }
    })

    return [value, (v: any)=>{setStore(key, v)}]
}

export {
    getStore,
    useStore,
    setStore,
    createStore
}
