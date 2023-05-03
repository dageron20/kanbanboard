import React, {useState} from "react";
import TooltipModal from "../Modal";
import styles from "../style.module.scss";
import {CheckPicker, InputPicker} from "rsuite";
import union from "../../asset/resourse/Union.png";
import clip from "../../asset/resourse/clip.png";
import {Draggable} from "react-beautiful-dnd";
import {ITaskState} from "../../types/ITask";
import {useAppDispatch} from "../../hooks/redux";
import {setCategory, setDateTime, setMembers} from "../../store/reducers/TaskSlice";

interface Task {
    item: any;
    index: any;
    title: string;
}

const data2 = [{
    id: 1,
    name: "Petr",
    label: "Петров В.А.",
    value: "val1",
}, {
    id: 2,
    name: "Den",
    label: "Иванов В.В.",
    value: "val2",
},{
    id: 3,
    name: "a",
    label: "Кузнецов В.А.",
    value: "val3"
},]

const dataCategory = [
    {
      id: 1,
      name: 'failed',
      label: 'Наразобранные задачи',
      value: 'failed'
    }, {
        id: 2,
        name: 'awaiting',
        label: 'В планах',
        value: 'awaiting'
    }, {
        id: 3,
        name: 'running',
        label: 'В работе',
        value: 'running'
    }, {
        id: 4,
        name: 'succeed',
        label: 'Выполнено',
        value: 'succeed'
    }
]

const getItemStyle = (draggableStyle: any, isDragging: any) => (
    {
        background: isDragging ? '#E6F6F1' : '#FCFCFD',
        border: isDragging ?  '2px solid #B5EADD' : '1px solid #DEDFE0',
        ...draggableStyle
    }
);

const Task: React.FC<Task> = ({item, index, title}) => {
    const [updatedUsers, setUpdatedUsers] = useState<string[]>()
    const [updatedCategory, setUpdatedCategory] = useState<string>()
    const [updatedDatetime, setUpdatedDatetime] = useState<number>()
    const [formattedDateTime, setFormattedDateTime] = useState<string>()
    const dispatch = useAppDispatch();

    console.log(updatedUsers);

    const setMembersOnTask = (id: string, state: string, value: string[]) => {
        setUpdatedUsers(value);
        dispatch(setMembers(
            {taskId: id,
            columnId: state,
            member: value}
        ));
    }

    const setCategoryOnTask = (id: string, state: string, value: string) => {
        setUpdatedCategory(value);
        dispatch(setCategory(
            {taskId: id,
                columnId: state,
                category: value}
        ));
    }

    const setDatetimeOnTask = (id: string, state: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const inputDate = event.target.value;
        const date = new Date(inputDate);
        const milliseconds = date.getTime();

        if (isNaN(date.getTime())) {
            console.log('Ошибка даты')
        }

        const formattedDate = new Date(milliseconds).toISOString().slice(0, 10);
        setFormattedDateTime(formattedDate);
        setUpdatedDatetime(milliseconds);
        dispatch(setDateTime(
            {taskId: id,
                columnId: state,
                dateTime: milliseconds}
        ));
    }



    return (
        <Draggable  key={item.id} draggableId={item.id} index={index}>
            {(provided: { innerRef: React.LegacyRef<HTMLDivElement> | undefined; draggableProps: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>; dragHandleProps: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>; }, snapshot: { isDragging: any; }) => (
                <TooltipModal
                    title={'Расстановка отряда'}
                    modalBody={
                        <div className={styles.col_item_modal}>
                            <div className={styles.col_item_modal_worker}>
                                <h6>Исполнители</h6>
                                <CheckPicker
                                    value={updatedUsers}
                                    data={data2}
                                    onChange={(e) => setMembersOnTask(item.id, item.state, e)}
                                    appearance="default"
                                    placeholder="Выберите пользователей"
                                    block
                                />
                            </div>
                            <div className={`${styles.col_item_modal_datetime}`}>
                                <h6>Крайний срок</h6>
                                <input
                                    type="date"
                                    value={formattedDateTime ? formattedDateTime : ''}
                                    onChange={(e) => setDatetimeOnTask(item.id, item.state, e)}
                                />
                            </div>
                            <div className={styles.col_item_modal_category}>
                                <h6>Категория</h6>
                                <InputPicker
                                    value={updatedCategory}
                                    data={dataCategory}
                                    placeholder="Выберите категорию"
                                    onChange={(e) => setCategoryOnTask(item.id, item.state, e)}
                                    style={{  }}
                                    block />
                            </div>
                        </div>
                    }
                >
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                            provided.draggableProps.style,
                            snapshot.isDragging
                        )}
                        className={styles.col_item}
                        id={item.id}
                    >

                        <h3 className={styles.col_item_title}>
                            {item.name}
                        </h3>
                        <div className={`${styles.col_item_time} ${title.toLowerCase()}`}>{item.timeframe == 'Test' ? 'Без срока' : new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(item.timeframe)}</div>
                        <div className={styles.col_item_info}>
                            <div className={styles.col_item_info_author}>{item.members.length > 0 && (
                                <>
                                    {data2.find((user) => user.value === item.members[0])?.label}
                                    {item.members.length > 1 && (
                                        <>
                                            {" "}
                                            и еще {item.members.length - 1}
                                        </>
                                    )}
                                </>
                            )}</div>
                            <div className={styles.col_item_info_description}>
                                <div className={styles.col_item_info_description_info}>
                                    <img src={union} alt="" />
                                    <span>2</span>
                                </div>
                                <div className={styles.col_item_info_description_info}>
                                    <img src={clip} alt="" />
                                    <span>6</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </TooltipModal>
            )}
        </Draggable>
    )
}

export {Task}