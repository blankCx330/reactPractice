import { useState, useEffect } from "react";

export default function useDebouncedValue(data:string, time:number){
    //如果设置为''那么第一次输入会使输入的内容为空，
    //简单来说设置为''会使内容延迟变化
    //设置为data的用户体验更好
    const [debounced, setDebounce] = useState(data) 

    useEffect(()=>{
        const timer = setTimeout(()=>setDebounce(data), time)
        return () => {
            clearTimeout(timer)
        }
    },[data, time])

    return debounced
}