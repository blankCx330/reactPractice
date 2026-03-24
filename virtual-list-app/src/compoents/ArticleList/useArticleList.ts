import { useQuery } from "@tanstack/react-query"
import type { GitHubSearchResponse } from "../../types/article"

interface Params {
    searchQuery?: string
}

export const useArticleList = ({ searchQuery = '' }: Params = {}) => {
    const q = searchQuery || 'stars:>100'
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=30`

    return useQuery<GitHubSearchResponse>({
        queryKey: ['repositories', searchQuery],
        queryFn: async () => {
            const res = await fetch(url)
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            return res.json()
        },
        staleTime: 5 * 60 * 1000,
    })
}