import React, {useEffect, useState} from "react";
import styles from "../style.module.scss";
import "rsuite/dist/rsuite.min.css";
import "../style.colums.scss";
import { DragDropContext } from "react-beautiful-dnd";
import socketIO from "socket.io-client";
import {Colum} from "../Colum/Colum";
import {addTask} from '../../store/reducers/TaskSlice';
import {useAppDispatch, useAppSelector} from "../../hooks/redux";

const socket = socketIO.connect("http://localhost:4000");

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
                state: "Test",
                timeframe: "Test",
                type: "discus"
            }
        };
        dispatch(addTask(taskName));
        event.currentTarget.reset();
        console.log(tasksi);
    }


    useEffect(() => {
        function fetchTasks() {
            fetch("http://localhost:4000/api")
                .then((res) => res.json())
                .then((data) => setTasks(data));
        }
        fetchTasks();
    }, []);

    useEffect(() => {
        socket.on("tasks", (data: React.SetStateAction<{}>) => {
            setTasks(data);
        });
    }, [socket]);

    useEffect(() => {
        socket.on("tasks", (data: React.SetStateAction<{}>) => {
            setTasks(data);
        });
    }, [socket]);

    // @ts-ignore
    const handleDragEnd = ({ destination, source }) => {
        if (!destination) return;
        if (
            destination.index === source.index &&
            destination.droppableId === source.droppableId
        )
            return;

        socket.emit("taskDragged", {
            source,
            destination,
        });
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
                    {Object.entries(tasks).map((task:any) => (
                        <Colum key={task[1].title} title={task[1].title} items={task} draggingIndex={draggingIndex}/>
                    ))}
                </DragDropContext>
            </div>
        </>
    )
}

export {Board}