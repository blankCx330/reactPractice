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
export default function ListContainer() {
    const [items, setItems] = useState<TodoItem[]>([])
    const historyListRef = useRef<TodoItem[]>([])
    const [displayListType, setDisplayListType] = useState<'all' | 'completed' | 'incompleted' >('all')
    const handleAddItem = (itme:TodoItem) => {
        setItems(prevItems => { 
            const newItmes = [...prevItems, itme]
            historyListRef.current = newItmes
            return newItmes
        })
        setDisplayListType('all')
    }
    const handleDeleteItem = (id:number) => {
        setItems(prevItems => {
            const newItems = prevItems.filter(items => items.id !== id)
            historyListRef.current = newItems
            return newItems
        })
    }

    const handleCompletedBtn = (id:number) => {
    setItems(value => {
        const newItems = value.map(items => items.id === id ? {...items, completed: !items.completed} : items)
        historyListRef.current = newItems
        return newItems
    })

    }
    const handleCompletedTimes = () => {
        if(displayListType !== 'completed'){
            setItems(historyListRef.current)
            setItems(items => items.filter(items => items.completed === true))
            setDisplayListType('completed')
        }
    }

    const handleIncompleteTimes= () => {
        if(displayListType !== 'incompleted'){
            setItems(historyListRef.current)
            setItems(items => items.filter(items => items.completed === false))
            setDisplayListType('incompleted')
        }
    }
    const handleAllItems = () => {
        if(displayListType !== 'all'){
            setItems(historyListRef.current)
            setDisplayListType('all')
        }
    }

    const handleClearCompleted = () => {
        handleAllItems()
        setItems(items => {
            const newItems = items.filter(item => item.completed === false)
            historyListRef.current = newItems
            return newItems
        })
    }

    const listTitle = displayListType === 'all' ? '所有事项' : displayListType === 'completed' ? '已完成事项' : '未完成事项'

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
                <EventInputBox 
                    addItem={handleAddItem} 
                    deleteItem={handleDeleteItem}
                />
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