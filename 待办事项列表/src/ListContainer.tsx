import { useState } from "react"
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
    const handleAddItem = (itme:TodoItem) => {
        setItems(prevItems => [...prevItems, itme])
    }
    const handleDeleteItem = (id:number) => {
        setItems(prevItems => prevItems.filter(items => items.id !== id))
    }

    const handleCompletedBtn = (id:number) => {
        setItems(value => 
            value.map(items => 
                items.id === id ? {...items, completed: !items.completed} : items
            )
        )
    }

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
                        {itemsList}
                    </ListItemContainer>
                <ButtonContainer />
            </div>
    )
}