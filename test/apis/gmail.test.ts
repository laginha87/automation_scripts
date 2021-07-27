import test from 'ava';
import {addLabels, getAttachment, getEmails, getMessage} from "apis/gmail";

import {interceptAuthentication} from '@helpers/interceptAuthentication';
import {
    interceptAddLabels,
    interceptGetEmails,
    interceptGetMessage,
    interceptGetMessageAttachment
} from "@helpers/gmail.helpers";

test('addLabels', async (t) => {
    interceptAuthentication();
    const scope = interceptAddLabels(['label101', 'label102']).reply(200);

    await addLabels("messageId", "label101", "label102");

    t.true(scope.isDone());
})


test('getEmails', async (t) => {
    interceptAuthentication();
    const scope = interceptGetEmails("QUERY").reply(200);

    await getEmails("QUERY");

    t.true(scope.isDone());
})


test('getEmail', async (t) => {
    interceptAuthentication();
    const scope = interceptGetMessage('messageId')
        .reply(200);

    await getMessage("messageId");

    t.true(scope.isDone());
})

test('getAttachment', async (t) => {
    interceptAuthentication();
    const scope = interceptGetMessageAttachment('messageId', 'attachmentId')
        .reply(200, {attachmentInfo: "BLAH"});

    await getAttachment("messageId", "attachmentId");
    t.true(scope.isDone());
})