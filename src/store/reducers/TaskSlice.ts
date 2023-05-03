import {ITask, ITaskMember, ITasks, ITaskState} from "../../types/ITask";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const fetchID = () => Math.random().toString(36).substring(2, 10);

interface TaskState {
    tasksi: ITasks[];
    isLoading: boolean;
    error: string;
}

const initialState: TaskState = {
    tasksi: [
        {
            pending: { id: fetchID(), title: 'pending', label: 'Неразобранные задачи', items: [] },
            ongoing: { id: fetchID(), title: 'ongoing', label: 'В планах', items: [] },
            work: { id: fetchID(), title: 'work', label: 'В работе', items: [] },
            completed: { id: fetchID(), title: 'completed', label: 'Выполнено', items: [] },
        },
    ],
    isLoading: false,
    error: '',
}

export const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        addTask: (state, action: PayloadAction<ITask>) => {
            state.tasksi[0].pending.items.push(action.payload)
        },
        setMembers:(state, action: PayloadAction<{ taskId: string, columnId: string, member: string[],  }>) => {
            const { taskId, member, columnId } = action.payload;
            const columnToUpdate = state.tasksi[0][columnId];
            const taskIndex = columnToUpdate.items.findIndex((task) => task.task.id === taskId);

            if (taskIndex !== null ) {
                const task = columnToUpdate.items[taskIndex];
                task.task.members.push(member);
            }
        },
        setDateTime:(state, action: PayloadAction<{taskId: string, columnId: string, dateTime: number}>) => {
            const { taskId, columnId, dateTime } = action.payload;
            const columnToUpdate = state.tasksi[0][columnId];
            const taskIndex = columnToUpdate.items.findIndex((task) => task.task.id === taskId);
            if (taskIndex !== null ) {
                const task = columnToUpdate.items[taskIndex];
                task.task.timeframe = dateTime;
            }
        },
        setCategory:(state, action: PayloadAction<{taskId: string, columnId: string, category: string}>) => {
            const { taskId, columnId, category } = action.payload;
            const columnToUpdate = state.tasksi[0][columnId];
            const taskIndex = columnToUpdate.items.findIndex((task) => task.task.id === taskId);
            if (taskIndex !== null ) {
                const task = columnToUpdate.items[taskIndex];
                task.task.state = category;
            }

        },
        moveTask: (state, action: PayloadAction<{source: string, destination: string, taskId: string}>) => {
            const { source, destination, taskId } = action.payload;
            const sourceColumn = state.tasksi[0][source];
            const destinationColumn = state.tasksi[0][destination];
            const taskIndex = sourceColumn.items.findIndex((task) => task.task.id === taskId);

            if (taskIndex !== -1) {
                const task = sourceColumn.items.splice(taskIndex, 1)[0];
                destinationColumn.items.push(task);
            }
        }
        }
    }
)

export default taskSlice.reducer;
export const { addTask, moveTask, setMembers, setCategory, setDateTime  } = taskSlice.actions;