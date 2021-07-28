import {ActionParams} from "actions/types";
import {uploadFile} from "apis/drive";

export const uploadToDrive = (parentId: string, endOfFileName: string) =>
    async ({
               date,
               attachment,
               index,
               messagePayload
           }: ActionParams) => {
        /* TODO This could be a filter on the actions array */
        if (!messagePayload.filename.endsWith(".pdf")) {
            return;
        }
        const fileName = `${date.toFormat("yyyy-MM")} ${endOfFileName.replace("${i}", index.toString())}`;
        await uploadFile(attachment, fileName, parentId);
    }