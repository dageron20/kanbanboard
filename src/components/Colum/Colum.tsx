import React, {useState} from "react";
import styles from "../style.module.scss";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {ColumHeader} from "../ColumHeader/ColumHeader";
import {Task} from "../Task/Task";
import styled from "styled-components";

interface ColumnProps {
    title: string;
    items: any[];
    draggingIndex: any;
}

const Colum: React.FC<ColumnProps> = ({title, items}) => {
    return (
        <div className={styles.col}>
            <ColumHeader title={title} />
            <Droppable droppableId={title}>
                {(provided: { innerRef: React.LegacyRef<HTMLDivElement> | undefined; droppableProps: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>; placeholder: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }, snapshot: any) => (
                    <div
                        className="dropbox"
                        ref={provided.innerRef}
                        {...provided.droppableProps}

                    >
                        {items[1].items.map((item: any, index: any) => (
                            <Task item={item} index={index} title={title}/>
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