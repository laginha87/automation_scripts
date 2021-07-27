import nock from "nock";

const driveNock = () => nock("https://www.googleapis.com/drive/v3");

export const interceptUploadFile = (fileId: string) =>
    nock("https://www.googleapis.com/upload/drive/v3")
        .post("/files")
        .query({uploadType: 'media', access_token: "ACCESS_TOKEN"})
        .matchHeader("content-type", "application/pdf")
        .reply(200, {id: fileId});

export const interceptUpdateFile = (fileName: string, fileId: string, parentId = "PARENT_ID") =>
    driveNock()
        .patch(`/files/${fileId}`, {name: fileName})
        .query({
            access_token: "ACCESS_TOKEN",
            addParents: parentId,
            supportsAllDrives: true,
            enforceSingleParent: true
        })
        .reply(200);

export const interceptGetFile = (fileId: string) => {
    return driveNock()
        .get(`/files/${fileId}`)
        .query({alt: 'media'})
        .matchHeader("authorization", "Bearer ACCESS_TOKEN")
}