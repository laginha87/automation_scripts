import {ActionParams} from "./types";
import {uploadFile} from "../apis/drive";

export const uploadToDrive = (parentId: string, endOfFileName: string) =>
    async ({
               date,
               attachment,
               index,
               messagePayload
           }: ActionParams) => {
        try {
            /*This could be a filter on the actions array*/
            if (!messagePayload.filename.endsWith(".pdf")) {
                return;
            }
            const file_name = `${date.toFormat("yyyy-MM")} ${endOfFileName.replace("${i}", index.toString())}`;
            await uploadFile(attachment, file_name, parentId);
        } catch
            (e) {
            console.error(e)
        }
    }