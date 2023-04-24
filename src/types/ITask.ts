import {IUser} from "./IUser";

export interface ITask {
    task: {
        author: IUser,
        discus: {
            description: {
                meta: {
                    id: string
                },
                payload: {
                    files: [],
                    value: string
                },
                type: string
            }
        },
        id: string,
        members: Array<ITaskMember>,
        name: string,
        state: ITaskState,
        timeframe: ITaskTimeframe,
        type: "discus"
    };
}

export interface ITaskState {
    begin: number,
    end: number,
    status: TasksStatus,
}

export interface ITaskMember {
    endpoint: IUser,
    rights: number
}

export interface ITaskTimeframe {
    begin: number,
    duration: number,
    end: number
}

enum TasksStatus {
    Awaiting = "awaiting",
    Running = "running",
    Succeed = "succeed",
    Failed = "failed",
}