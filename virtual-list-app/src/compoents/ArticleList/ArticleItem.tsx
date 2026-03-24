type props = {
    name: string,
    url: string,
    ownerName: string,
    ownerAvater: string,
    language: string | null,
    star: number
}

type Data = {
    data: props
}

export default function ArticleItem({data}:Data){

    return (
        <div className="
            flex items-center gap-3
            h-full px-4 py-3
            bg-yellow-100 border border-gray-200 rounded-lg
            hover:border-gray-300 hover:shadow-sm
            transition-all duration-200
        ">
            {/* 头像 */}
            <img 
                src={data.ownerAvater} 
                alt={data.ownerName}
                className="w-8 h-8 rounded-md flex-shrink-0"
            />
            
            {/* 主要内容区 */}
            <div className="flex-1 min-w-0">
                {/* 仓库名称 */}
                <h1 className="text-base font-semibold text-blue-600 hover:underline truncate">
                    <a href={data.url} target="_blank" rel="noopener noreferrer">
                        {data.name}
                    </a>
                </h1>
                
                {/* 用户名 + 编程语言 */}
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                    <span>{data.ownerName}</span>
                    {data.language && (
                        <>
                            <span className="text-gray-300">•</span>
                            <span>{data.language}</span>
                        </>
                    )}
                </div>
            </div>
            
            {/* Star 数 */}
            <div className="flex items-center gap-1 text-sm text-gray-600 flex-shrink-0">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span>{data.star.toLocaleString()}</span>
            </div>
        </div>
    )
}