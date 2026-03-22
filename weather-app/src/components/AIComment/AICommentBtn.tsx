import { useState } from "react"
import { createPortal } from "react-dom"
import AIComment from "./AIcomment"
import { useAIStream } from '../../hooks/useAIStream'

export default function AICommentBtn(){
    const [show, setShow] = useState(false)
    const {canel} = useAIStream()
    return(<>
        <button className="ai-comment-btn text-2xl border border-2 rounded-full px-2 h-4/5
                    text-black dark:text-white/80
                    bg-yellow-400 dark:bg-blue-600/80
                    dark:border-blue-300
                    hover:bg-yellow-500 dark:hover:bg-blue-500
                    hover:scale-110 transition-all
                    active:scale-90
                "
                onClick={()=>setShow(true)}
        >
            AI点评
        </button>
        { show && 
            createPortal(
                <div className="
                        fixed inset-0
                        z-50
                        flex items-center justify-center
                        bg-black/50
                     "       
                     onClick={()=>{
                            canel()
                            setShow(false)
                        }}
                >
                    <AIComment />
                </div>
            ,document.body
            )}
    </>)
}