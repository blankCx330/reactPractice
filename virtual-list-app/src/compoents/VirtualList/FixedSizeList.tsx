import { useState, useMemo } from "react";

interface FixedSizeListProps {
    height: number,
    itemHeight: number,
    itemCount: number,
    overscan?: number,
    children: (props:{index: number, style: React.CSSProperties}) => React.ReactNode
}

export function FixedSizeList({height,itemCount,itemHeight,overscan=3,children}:FixedSizeListProps){
    const [scrollTop, setScrollTop] = useState(0)
    const {startIndex, endIndex} = useMemo(()=>{
        const start = Math.floor(scrollTop / itemHeight)
        const visible = Math.ceil(height / itemHeight)
        return {
            startIndex: Math.max(0 , start - overscan),
            endIndex: Math.min(itemCount - 1, start + visible + overscan)
        }
    },[scrollTop, itemHeight, itemCount, height, overscan])
    const totalHeight = itemHeight * itemCount

    const items = []
    for(let i = startIndex; i <= endIndex; i++){
        items.push(
            <div key={i}>
                {children({
                    index:i, 
                    style:{
                        height:itemHeight, 
                        position:'absolute', 
                        top:i * itemHeight, 
                        width:'100%'}
                })}
            </div>
        )
    }

    return (
        <div 
            style={{height: height, position:'relative', overflow:'auto'}}
            onScroll={(e)=>setScrollTop(e.currentTarget.scrollTop)}
        >
            <div style={{height:totalHeight, position:'relative'}}>
                {items}
            </div>
        </div>
    )
}