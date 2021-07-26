import {getAccessToken} from "apis/googleAuth";
import axios from "axios";

export async function uploadFile({data, size}: { data: string, size: number }, fileName: string, parentId: string) {
    const accessToken = await getAccessToken();
    const {data: {id}} = await axios.post("https://www.googleapis.com/upload/drive/v3/files", Buffer.from(data, "base64"), {
        params: {
            uploadType: 'media',
            access_token: accessToken
        },
        headers: {
            "Content-Type": "application/pdf",
            "Content-Length": size,
        }
    });

    await axios.patch(`https://www.googleapis.com/drive/v3/files/${id}`, {
        name: fileName
    }, {
        params: {
            access_token: accessToken,
            addParents: parentId,
            supportsAllDrives: true,
            enforceSingleParent: true,
        }
    })
}

export const getFile = async (key: string) => {
    const accessToken = await getAccessToken();
    const {data} = await axios.get("https://www.googleapis.com/drive/v3/files/" + key, {
        params: {alt: 'media'},
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });
    return data;
}