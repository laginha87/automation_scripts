import test from "ava";
import {interceptAuthentication} from "@helpers/interceptAuthentication";
import {uploadToDrive} from "actions/uploadToDrive";
import {interceptUpdateFile, interceptUploadFile} from "@helpers/drive.helpers";
import {DateTime} from "luxon";
import {MessagePart} from "apis/gmail";

test('uploadToDrive("PARENT_ID", "FILE_NAME")({date: {year: 2021, month: 10}})', async (t) => {
    interceptAuthentication();
    interceptUploadFile("fileId");
    const scope = interceptUpdateFile("2021-10 FILE_NAME", "fileId")
    const uploadAction = uploadToDrive("PARENT_ID", "FILE_NAME");
    await uploadAction({
        date: DateTime.fromObject({month: 10, year: 2021}),
        attachment: {data: "Attachment data", attachmentId: '12', size: 10},
        messagePayload: {filename: "report.pdf"} as MessagePart,
        index: 0
    });
    t.true(scope.isDone());
})

test('uploadToDrive("PARENT_ID", "FILE_NAME")({date: {year: 2021, month: 10}, index: 1})', async (t) => {
    interceptAuthentication();
    interceptUploadFile("fileId");
    const scope = interceptUpdateFile("2021-10 FILE_NAME 1", "fileId")
    const uploadAction = uploadToDrive("PARENT_ID", "FILE_NAME ${i}");
    await uploadAction({
        date: DateTime.fromObject({month: 10, year: 2021}),
        attachment: {data: "Attachment data", attachmentId: '12', size: 10},
        messagePayload: {filename: "report.pdf"} as MessagePart,
        index: 1
    });
    t.true(scope.isDone());
})