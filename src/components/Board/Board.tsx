import React, {useState} from "react";
import styles from "../style.module.scss";
import "rsuite/dist/rsuite.min.css";
import "../style.colums.scss";
import { DragDropContext } from "react-beautiful-dnd";
import {Colum} from "../Colum/Colum";
import {addTask, setDateTime} from '../../store/reducers/TaskSlice';
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {moveTask} from '../../store/reducers/TaskSlice';
import {RightPanel} from "../RightPanel";
import HeaderPanel from "../HeaderPanel/HeaderPanel";
import {PanelContentLayout} from "../PanelContent";
import {Footer} from "../FooterPanel";
import newTask from "../../asset/resourse/addTask.svg";
import clsx from "clsx";
import {CheckPicker} from "rsuite";


const Board: React.FC = (props) => {
    const {allTasks} = useAppSelector(state => state.taskReducer)
    const dispatch = useAppDispatch();
    const fetchID = () => Math.random().toString(36).substring(2, 10);

    const [nameNewTask, setNameNewTask] = useState<string>();

    const handleTaskNameChange = (event: { target: { value: React.SetStateAction<string | undefined>; }; }) => {
        setNameNewTask(event.target.value);
    };

    const handleFileChange = (event: { target: { files: any[]; }; }) => {
        const newFile = event.target.files[0];
        setFile(newFile);

    }

    const [updatedDatetimeNewTask, setUpdatedDatetimeNewTask] = useState<number>()
    const [formattedDateTimeNewTask, setFormattedDateTimeNewTask] = useState<string>()
    const [file, setFile] = useState(null);
    const setDatetimeOnTask = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputDate = event.target.value;
        const date = new Date(inputDate);
        const milliseconds = date.getTime();
        if (isNaN(date.getTime())) {
            console.log('Ошибка даты')
        }
        const formattedDate = new Date(milliseconds).toISOString().slice(0, 10);
        setFormattedDateTimeNewTask(formattedDate);
        setUpdatedDatetimeNewTask(milliseconds);;
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

    const handleAddTask = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData();
        // @ts-ignore
        formData.append('file', file);




        const taskName = {
            task: {
                author: {
                    module: {
                        alias: "Application",
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
                            files: [formData.get('file')],
                            value: "No values",
                        },
                        type: "Application",
                    }
                },
                id: fetchID(),
                members: updatedUsersAdd,
                name: nameNewTask,
                state: "failed",
                timeframe: updatedDatetimeNewTask,
                type: "discus"
            }
        };
        dispatch(addTask(taskName));
        event.currentTarget.reset();
        setNameNewTask('');
    }

    const canMove = (source: string, destination: string) => {
        if (source === 'failed' && destination === 'awaiting' || source === 'awaiting' && destination === 'failed') {
            return true;
        }
        if (source === 'awaiting' && destination === 'running' || source === 'running' && destination === 'awaiting') {
            return true;
        }
        if (source === 'running' && destination === 'succeed' || source === 'succeed' && destination === 'running') {
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
    const [updatedUsersAdd, setUpdatedUsersAdd] = useState<string[]>([])
    return (
        <>
            <div className={styles.container}>
                <DragDropContext onDragEnd={handleDragEnd} onDragUpdate={onDragUpdate}>
                    {allTasks.map((task: any) => (
                        Object.entries(task).map((tasks: any) => (
                            <Colum id={tasks[1].id}
                                   title={tasks[1].title}
                                   label={tasks[1].label}
                                   items={tasks[1].items}
                                   draggingIndex={draggingIndex}
                                   key={tasks[1].id}
                            />
                        ))
                    ))}
                </DragDropContext>
            </div>
            <RightPanel>
                <HeaderPanel
                    name="Новая задача"
                />
                <PanelContentLayout>
                    <div className={styles.PanelTaskName}>
                        <div>Название</div>
                        <input
                            type="text"
                            onChange={handleTaskNameChange}
                            value={nameNewTask}
                            placeholder="Название задачи"/>
                    </div>
                    <div>
                        <div>Исполнители</div>
                        <CheckPicker
                            value={updatedUsersAdd}
                            data={data2}
                            onChange={(e) => setUpdatedUsersAdd(e)}
                            appearance="default"
                            placeholder="Выберите пользователей"
                            block
                        />
                    </div>
                    <div className={styles.PanelTaskName}>
                        <div>Крайний срок</div>
                        <input
                            type="date"
                            value={formattedDateTimeNewTask ? formattedDateTimeNewTask : ''}
                            onChange={(e) => setDatetimeOnTask(e)}
                        />
                    </div>
                    <div className={styles.PanelTaskName}>
                        <div>Добавить файл</div>
                        <input
                            type="file"
                            onChange={handleFileChange}
                        />
                    </div>
                </PanelContentLayout>
                <div
                    className={clsx('Footer')}
                >
                    <form onSubmit={handleAddTask}>
                        <button
                            className={clsx('Button')}
                        >
                            Поставить задачу
                        </button>
                    </form>
                </div>
            </RightPanel>
        </>
    )
}
export {Board}