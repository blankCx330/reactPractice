import { useState, useEffect } from 'react'
import useDebouncedValue from '../../hooks/useDebouncedValue'

interface SearchBarProps {
    onSearch: (query: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [input, setInput] = useState('')
    const debounced = useDebouncedValue(input, 300)

    useEffect(() => {
        onSearch(debounced)
    }, [debounced, onSearch])

    return (
        <div className="w-full p-4 bg-white border-b">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="搜索仓库..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    )
}