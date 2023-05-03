import {IUser} from "../../types/IUser";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ITaskMember} from "../../types/ITask";

interface UserState {
    users: ITaskMember[];
}

const initialState: UserState = {
    users: [],
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

        }
    }
)

export default userSlice.reducer;
