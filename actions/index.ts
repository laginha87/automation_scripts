import { ActionParams } from "actions/types";
import { uploadToDrive } from "actions/uploadToDrive";


export const Actions: {
    [k: string]: (...args: any[]) => (a: ActionParams) => Promise<void>
} = {
    uploadToDrive
};

export type ActionType = keyof typeof Actions;