import { useState, useCallback } from 'react'
import ArticleItem from "./ArticleItem"
import { useArticleList } from "./useArticleList"
import type { GitHubRepository } from "../../types/article"
import { List, type RowComponentProps } from "react-window"
import SearchBar from "../SearchBar"

type RowData = { items: GitHubRepository[] }

export default function ArticleList() {
    const [query, setQuery] = useState('')
    const { data, isLoading, isError, error, refetch } = useArticleList({ searchQuery: query })

    const handleSearch = useCallback((q: string) => setQuery(q), [])

    const Row = ({ index, style, items }: RowComponentProps<RowData>) => {
        const item = items[index]
        return (
            <div style={{ ...style, paddingBottom: 8 }}>
                <ArticleItem data={{
                    name: item.full_name,
                    url: item.html_url,
                    ownerName: item.owner.login,
                    ownerAvater: item.owner.avatar_url,
                    language: item.language ?? 'Unknown',
                    star: item.stargazers_count,
                }} />
            </div>
        )
    }

    // Loading 状态
    if (isLoading) {
        return (
            <div className="h-full flex flex-col min-h-0">
                <SearchBar onSearch={handleSearch} />
                <div className="flex-1 flex items-center justify-center text-gray-500 min-h-0">
                    加载中...
                </div>
            </div>
        )
    }

    // 错误状态
    if (isError) {
        return (
            <div className="h-full flex flex-col min-h-0">
                <SearchBar onSearch={handleSearch} />
                <div className="flex-1 flex flex-col items-center justify-center gap-4 min-h-0">
                    <p className="text-red-500">加载失败: {error?.message}</p>
                    <button onClick={() => refetch()} className="px-4 py-2 bg-blue-500 text-white rounded">
                        重试
                    </button>
                </div>
            </div>
        )
    }

    // 空状态
    if (!data?.items?.length) {
        return (
            <div className="h-full flex flex-col min-h-0">
                <SearchBar onSearch={handleSearch} />
                <div className="flex-1 flex items-center justify-center text-gray-500 min-h-0">
                    没有找到仓库
                </div>
            </div>
        )
    }

    // 正常渲染
    return (
        <div className="h-full flex flex-col bg-gray-50 min-h-0">
            <SearchBar onSearch={handleSearch} />
            <div className="flex-1 min-h-0">
                <List
                    rowComponent={Row}
                    rowCount={data.items.length}
                    rowHeight={80}
                    rowProps={{ items: data.items }}
                    style={{ height: '100%', width: '100%' }}
                />
            </div>
        </div>
    )
}