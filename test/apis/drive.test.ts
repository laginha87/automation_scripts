import test from 'ava';
import nock from 'nock';

import {interceptAuthentication} from '@helpers/interceptAuthentication';
import {getFile, uploadFile} from "apis/drive";

const driveNock = () => nock("https://www.googleapis.com/drive/v3");
test('getFile', async (t) => {
    interceptAuthentication();
    const scope = driveNock()
        .get("/files/fileId")
        .query({alt: 'media'})
        .matchHeader("authorization", "Bearer ACCESS_TOKEN")
        .reply(200);

    await getFile("fileId");

    t.true(scope.isDone());
})

test('uploadFile', async (t) => {
    interceptAuthentication();
    const scopeUpload = nock("https://www.googleapis.com/upload/drive/v3")
        .post("/files")
        .query({uploadType: 'media', access_token: "ACCESS_TOKEN"})
        .matchHeader("content-type", "application/pdf")
        .matchHeader("content-length", "6")
        .reply(200, {id: 'fileId'});

    const scopePatch = nock("https://www.googleapis.com/drive/v3")
        .patch("/files/fileId", {name: 'FILE_NAME'})
        .query({
            access_token: "ACCESS_TOKEN",
            addParents: "PARENT_ID",
            supportsAllDrives: true,
            enforceSingleParent: true
        })
        .reply(200);

    await uploadFile({data: "FILE DATA", size: 10}, "FILE_NAME", "PARENT_ID");

    t.true(scopeUpload.isDone());
    t.true(scopePatch.isDone());
})
