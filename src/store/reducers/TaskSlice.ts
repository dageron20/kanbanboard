import {ITask} from "../../types/ITask";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface TaskState {
    tasksi: ITask[];
    isLoading: boolean;
    error: string;
}

const initialState: TaskState = {
    tasksi: [],
    isLoading: false,
    error: '',
}

export const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        addTask: (state, action: PayloadAction<ITask>) => {
            state.tasksi.push(action.payload);
        },
        }
    }
)

export default taskSlice.reducer;
export const { addTask } = taskSlice.actions;