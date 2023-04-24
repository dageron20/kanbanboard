import React, {useState} from "react";
import TooltipModal from "../Modal";
import styles from "../style.module.scss";
import {CheckPicker} from "rsuite";
import union from "../../asset/resourse/Union.png";
import clip from "../../asset/resourse/clip.png";
import {Draggable} from "react-beautiful-dnd";

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

const getItemStyle = (draggableStyle: any, isDragging: any) => (
    {
        background: isDragging ? '#E6F6F1' : '#FCFCFD',
        border: isDragging ?  '2px solid #B5EADD' : '1px solid #DEDFE0',
        ...draggableStyle
    }
);


const Task: React.FC<Task> = ({item, index, title}) => {
    return (
        <Draggable key={item.id} draggableId={item.id} index={index}>
            {(provided: { innerRef: React.LegacyRef<HTMLDivElement> | undefined; draggableProps: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>; dragHandleProps: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>; }, snapshot: { isDragging: any; }) => (
                <TooltipModal
                    title={'Расстановка отряда'}
                    modalBody={
                        <div className={styles.col_item_modal}>
                            <div className={styles.col_item_modal_worker}>
                                <h6>Исполнители</h6>
                                <CheckPicker data={data2} appearance="default" placeholder="Default" style={{ width: 248 }} />
                            </div>
                            <div className={`${styles.col_item_modal_datetime}`}>
                                <h6>Крайний срок</h6>
                                <input type="date" />
                            </div>
                            <div className={styles.col_item_modal_category}>
                                <h6>Категория</h6>
                                <input type="text" />
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
                    >

                        <h3 className={styles.col_item_title}>
                            {item.title}
                        </h3>
                        <div className={`${styles.col_item_time} ${title.toLowerCase()}`}>Без срока</div>
                        <div className={styles.col_item_info}>
                            <div className={styles.col_item_info_author}>Петров А.А. и еще 3</div>
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