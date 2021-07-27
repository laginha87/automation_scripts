import test from 'ava';
import {interceptAuthentication} from '@helpers/interceptAuthentication';
import {getFile, uploadFile} from "apis/drive";
import {interceptGetFile, interceptUpdateFile, interceptUploadFile} from "@helpers/drive.helpers";


test('getFile', async (t) => {
    interceptAuthentication();
    const scope = interceptGetFile('fileId').reply(200);

    await getFile("fileId");
    t.true(scope.isDone());
})

test('uploadFile', async (t) => {
    interceptAuthentication();
    const scopeUpload = interceptUploadFile("fileId");
    const scopePatch =interceptUpdateFile("FILE_NAME", "fileId");

    await uploadFile({data: "FILE DATA", size: 10}, "FILE_NAME", "PARENT_ID");

    t.true(scopeUpload.isDone());
    t.true(scopePatch.isDone());
})
