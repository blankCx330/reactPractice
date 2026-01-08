import { useRef, useState} from "react"
import EventInputBox from './EventInputBox'
import ListItemContainer from './ListItemContainer'
import ListOfItems from './ListOfItems'
import ButtonContainer from './ButtonContainer'

interface TodoItem {
  inputValue: string;
  id: number;
  completed: boolean;
}
/**
 * ListContainer 组件，用于管理待办事项列表的显示和操作
 * 包含添加、删除、标记完成、筛选等功能
 */
export default function ListContainer() {
    // 使用 useState 管理待办事项列表
    const [items, setItems] = useState<TodoItem[]>([])
    // 使用 useRef 保存历史列表，用于筛选功能
    const historyListRef = useRef<TodoItem[]>([])
    // 使用 useState 管理当前显示的列表类型：全部、已完成、未完成
    const [displayListType, setDisplayListType] = useState<'all' | 'completed' | 'incompleted' >('all')
    /**
     * 处理添加新待办事项
     * @param itme - 要添加的待办事项对象
     */
    const handleAddItem = (itme:TodoItem) => {
        setItems(prevItems => { 
            const newItmes = [itme, ...prevItems] // 将新项添加到列表开头
            historyListRef.current = newItmes // 更新历史记录
            return newItmes
        })
        setDisplayListType('all') // 添加后显示全部事项
    }
    /**
     * 处理删除待办事项
     * @param id - 要删除的事项的ID
     */
    const handleDeleteItem = (id:number) => {
        setItems(prevItems => {
            const newItems = prevItems.filter(items => items.id !== id) // 过滤掉指定ID的事项
            historyListRef.current = newItems // 更新历史记录
            return newItems
        })
    }

    /**
     * 处理切换待办事项的完成状态
     * @param id - 要切换状态的事项的ID
     */
    const handleCompletedBtn = (id:number) => {
    setItems(value => {
        const newItems = value.map(items => items.id === id ? {...items, completed: !items.completed} : items) // 切换指定ID事项的完成状态
        historyListRef.current = newItems // 更新历史记录
        return newItems
    })

    }
    /**
     * 显示所有已完成事项
     */
    const handleCompletedTimes = () => {
        if(displayListType !== 'completed'){
            setItems(historyListRef.current) // 先恢复完整列表
            setItems(items => items.filter(items => items.completed === true)) // 筛选出已完成事项
            setDisplayListType('completed') // 更新显示类型
        }
    }

    /**
     * 显示所有未完成事项
     */
    const handleIncompleteTimes= () => {
        if(displayListType !== 'incompleted'){
            setItems(historyListRef.current) // 先恢复完整列表
            setItems(items => items.filter(items => items.completed === false)) // 筛选出未完成事项
            setDisplayListType('incompleted') // 更新显示类型
        }
    }
    /**
     * 显示所有事项
     */
    const handleAllItems = () => {
        if(displayListType !== 'all'){
            setItems(historyListRef.current) // 恢复完整列表
            setDisplayListType('all') // 更新显示类型
        }
    }

    /**
     * 清除所有已完成事项
     */
    const handleClearCompleted = () => {
        handleAllItems() // 先显示所有事项
        setItems(items => {
            const newItems = items.filter(item => item.completed === false) // 过滤掉已完成事项
            historyListRef.current = newItems // 更新历史记录
            return newItems
        })
    }

    // 根据当前显示类型设置列表标题
    const listTitle = displayListType === 'all' ? '所有事项' : displayListType === 'completed' ? '已完成事项' : '未完成事项'

    // 将事项列表转换为ListOfItems组件
    const itemsList = items.map((itemsValue) =>{
        return <ListOfItems 
                    key={itemsValue.id} 
                    text={itemsValue.inputValue}
                    completed={itemsValue.completed}
                    deleteItem={() => handleDeleteItem(itemsValue.id)}
                    completedBtn={() => handleCompletedBtn(itemsValue.id)}
                />
            }
        )

    return (
            <div className="list-container">
                <h1>待办事项列表</h1>
                {/* 事件输入框组件，用于添加和删除事项 */}
                <EventInputBox 
                    addItem={handleAddItem} 
                    deleteItem={handleDeleteItem}
                />
                {/* 列表容器组件，显示标题和事项列表 */}
                    <ListItemContainer>
                        <span className="list-title">{listTitle}</span>
                        {itemsList}
                    </ListItemContainer>
                <ButtonContainer
                    handleCompletedTimes={() => handleCompletedTimes}
                    handleAllItems={() => handleAllItems}
                    handleIncompleteTimes={() => handleIncompleteTimes}
                    handleClearCompleted={() => handleClearCompleted}
                />
            </div>
    )
}