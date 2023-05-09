import React from "react";
import styles from "../style.module.scss";
import {Droppable } from "react-beautiful-dnd";
import {ColumHeader} from "../ColumHeader/ColumHeader";
import {Task} from "../Task/Task";
import {ITask} from "../../types/ITask";

interface ColumnProps {
    id: string;
    title: string;
    label: string;
    items: ITask[];
    draggingIndex: any;
}

const Colum: React.FC<ColumnProps> = ({id, title, label, items}) => {
    return (
        <div className={styles.col}>
            <ColumHeader title={title} items={items} label={label} />
            <Droppable droppableId={title}>
                {(provided: {
                    innerRef: React.LegacyRef<HTMLDivElement> |
                        undefined; droppableProps: JSX.IntrinsicAttributes
                        & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>;
                        placeholder: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> |
                            React.ReactFragment | React.ReactPortal | null | undefined; }, snapshot: any) => (
                    <div
                        className="dropbox"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {items.map((item: any, index: any) => (
                             <Task item={item.task} index={index} title={title} key={item.task.id}/>
                        ))}
                        {snapshot.isDraggingOver && (
                            <div style={{ height: '4px', backgroundColor: '#50BFA8' }} />
                        )}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};
export {Colum};