import test from 'ava';
import {interceptGetFile, interceptUpdateFile, interceptUploadFile} from "@helpers/drive.helpers";
import {
    interceptAddLabels,
    interceptGetEmails,
    interceptGetMessage,
    interceptGetMessageAttachment
} from "@helpers/gmail.helpers";
import {interceptAuthentication} from "@helpers/interceptAuthentication";
import {main} from '../src/main';

const setup = (resultSizeEstimate = 1) => {
    interceptAuthentication();
    interceptGetFile("ACTIONS_FILE").reply(200,
        {
            "info@gmail.pt": {
                "subject": "EMAIL SUBJECT",
                "actions": [
                    {
                        "name": "uploadToDrive",
                        "args": [
                            "PARENT_ID",
                            "END_FILE_NAME.pdf"
                        ]
                    }
                ]
            }
        });

    const emailsResponse = {
        messages: [{
            id: "MESSAGE_ID",
        }, {
            id: "MESSAGE_ID_2"
        },
            {
                id: "MESSAGE_ID_3"
            }], resultSizeEstimate
    };
    interceptGetEmails("in:inbox info@gmail.pt AND NOT label:processed").reply(200, emailsResponse)
    interceptGetMessage("MESSAGE_ID").reply(200, {
        id: "MESSAGE_ID",
        internalDate: "1627419723919",
        payload: {
            filename: "",
            headers: [{
                name: "From",
                value: "info@gmail.pt"
            }, {
                name: "Subject",
                value: "EMAIL SUBJECT"
            }],
            mimeType: "",
            partId: "",
            parts: [{
                body: {attachmentId: "attachmentId"},
                filename: "doesntMatter.pdf",
                headers: [],
                mimeType: "",
                partId: "",
                parts: []
            }]
        }
    });
    interceptGetMessage("MESSAGE_ID_2").reply(200, {
        id: "MESSAGE_ID_2",
        internalDate: "1627419723919",
        payload: {
            filename: "",
            headers: [{
                name: "From",
                value: "Info <info@gmail.pt>"
            }, {
                name: "Subject",
                value: "ANOTHER SUBJECT TO BE IGNORED"
            }],
            mimeType: "",
            partId: "",
            parts: []
        }
    });
    interceptGetMessage("MESSAGE_ID_3").reply(200, {
        id: "MESSAGE_ID_3",
        internalDate: "1627419723919",
        payload: {
            filename: "",
            headers: [{
                name: "From",
                value: "info@gmail.pt"
            }, {
                name: "Subject",
                value: "EMAIL SUBJECT"
            }],
            mimeType: "",
            partId: "",
            parts: [{
                body: {},
                filename: "doesntMatter.pdf",
                headers: [],
                mimeType: "",
                partId: "",
                parts: []
            }]
        }
    });
    interceptGetMessageAttachment("MESSAGE_ID", "attachmentId").reply(200, {
        attachmentId: "attachmentId",
        size: 10,
        data: "TEXT"
    });


    interceptAddLabels(['Label_101'], "MESSAGE_ID").reply(200);

    interceptUploadFile("fileId");
    return interceptUpdateFile("2021-06 END_FILE_NAME.pdf", "fileId")
}


test('full on integration', async (t) => {
    const updateScope = setup()

    await main();

    t.true(updateScope.isDone())
})

test('it skips when there are no messages', async (t) => {
    const updateScope = setup(0)

    await main();

    t.false(updateScope.isDone())
})