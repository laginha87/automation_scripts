import { ActionParams } from "./types";
import { uploadToDrive } from "./uploadToDrive";


export const Actions: {
    [k: string]: (...args: any[]) => (a: ActionParams) => Promise<void>
} = {
    uploadToDrive
};

export type ActionType = keyof typeof Actions;