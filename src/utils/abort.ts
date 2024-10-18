

export default function abortable<T>(promise:Promise<T>) {
    let _rej:((err:any)=>void)|undefined = undefined
    const abortable  =new Promise((res,rej)=>{
        _rej = rej
        promise.then(res).catch(rej)
    })
    const abort = ()=>_rej?.('Promise aborted')

    return [abortable,abort] as const
}