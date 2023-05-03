import React, {useEffect, useState} from "react";
import styles from "../style.module.scss";
import "rsuite/dist/rsuite.min.css";
import "../style.colums.scss";
import { DragDropContext } from "react-beautiful-dnd";
import socketIO from "socket.io-client";
import {Colum} from "../Colum/Colum";
import {addTask} from '../../store/reducers/TaskSlice';
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {moveTask} from '../../store/reducers/TaskSlice';

//const socket = socketIO.connect("http://localhost:4000");

const Board: React.FC = (props) => {
    const [tasks, setTasks] = useState({});
    const [isOpenModal, setIsOpen] = useState(false);

    const {tasksi} = useAppSelector(state => state.taskReducer)
    const dispatch = useAppDispatch();

    const fetchID = () => Math.random().toString(36).substring(2, 10);

    const handleAddTask = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const taskName = {
            task: {
                author: {
                    module: {
                        alias: "proverka",
                    },
                    user: {
                        id: fetchID(),
                    },
                    workstation: {
                        id: fetchID(),
                    }
                },
                discus: {
                    description: {
                        meta: {
                            id: fetchID(),
                        },
                        payload: {
                            files: [],
                            value: "Test",
                        },
                        type: "Test",
                    }
                },
                id: fetchID(),
                members: [],
                name: "Test",
                state: "pending",
                timeframe: "Test",
                type: "discus"
            }
        };
        dispatch(addTask(taskName));
        event.currentTarget.reset();
    }


    // useEffect(() => {
    //     function fetchTasks() {
    //         fetch("http://localhost:4000/api")
    //             .then((res) => res.json())
    //             .then((data) => setTasks(data));
    //     }
    //     fetchTasks();
    // }, []);

    // useEffect(() => {
    //     socket.on("tasks", (data: React.SetStateAction<{}>) => {
    //         setTasks(data);
    //     });
    // }, [socket]);


    const canMove = (source: string, destination: string) => {
        if (source === 'pending' && destination === 'ongoing' || source === 'ongoing' && destination === 'pending') {
            return true;
        }
        if (source === 'ongoing' && destination === 'work' || source === 'work' && destination === 'ongoing') {
            return true;
        }
        if (source === 'work' && destination === 'completed' || source === 'completed' && destination === 'work') {
            return true;
        }
        return false;
    };

    // @ts-ignore
    const handleDragEnd = (result: DropResult) => {
        const { source, destination, draggableId } = result;
        console.log(draggableId)
        if (!destination) {
            return;
        }
        const task = document.getElementById(draggableId);
        if (canMove(source.droppableId, destination.droppableId)) {
            // задержка в 5 секунд
            task?.classList.add('waiting'); // добавляем класс
            setTimeout(() => {
                dispatch(moveTask({ source: source.droppableId, destination: destination.droppableId, taskId: draggableId }));
                task?.classList.remove('waiting'); // удаляем класс после неудачного перемещения
            }, 2000);
        } else {
            // задержка в 5 секунд
            task?.classList.add('waiting'); // добавляем класс
            setTimeout(() => {
                alert('Невозможно переместить элемент в данный столбец')
                task?.classList.remove('waiting'); // удаляем класс после неудачного перемещения
            }, 2000);

        }
        // @ts-ignore

    };

    const [draggingIndex, setDraggingIndex] = useState(-1);

    const onDragUpdate = (update: any) => {
        const { destination } = update;
        if (destination) {
            setDraggingIndex(destination.index);
        } else {
            setDraggingIndex(-1);
        }
    }


    // @ts-ignore
    return (
        <>
            <div className={styles.container}>
                <form onSubmit={handleAddTask}>
                    <input type="text" name="taskName" />
                    <button type="submit">Add Task</button>
                </form>
                <DragDropContext onDragEnd={handleDragEnd} onDragUpdate={onDragUpdate}>
                    {/*{Object.entries(tasks).map((task:any) => (*/}
                    {/*    <Colum key={task[1].title} title={task[1].title} items={task} draggingIndex={draggingIndex}/>*/}
                    {/*))}*/}
                    {tasksi.map((task: any) => (
                        Object.entries(task).map((task2: any) => (
                            <Colum id={task2[1].id} title={task2[1].title} label={task2[1].label} items={task2[1].items} draggingIndex={draggingIndex} key={task2[1].id} />
                        ))
                        // <Colum title={task2[1].title} items={task2[1].items} draggingIndex={draggingIndex} key={task.title} />
                    ))}
                </DragDropContext>
            </div>
        </>
    )
}

export {Board}