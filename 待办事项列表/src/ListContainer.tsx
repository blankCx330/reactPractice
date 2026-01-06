import { useState } from "react"
import EventInputBox from './EventInputBox'
import ListItemContainer from './ListItemContainer'
import ListOfItems from './ListOfItems'
import ButtonContainer from './ButtonContainer'
export default function ListContainer() {
    const [items, setItems] = useState<string[]>([])
    return (
            <div className="list-container">
                <h1>待办事项列表</h1>{items}
                <EventInputBox getItem={setItems} />
                    <ListItemContainer>
                        <ListOfItems text="学习React" />
                    </ListItemContainer>
                <ButtonContainer />
            </div>
    )
}