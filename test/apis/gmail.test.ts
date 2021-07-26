import {config} from "dotenv";

config({path: ".env.test"})

import _ from 'lodash';
import test from 'ava';
import nock from 'nock';
import {addLabels, getAttachment, getEmails, getMessage} from "apis/gmail";

const interceptAuthentication = () => {
    nock("https://oauth2.googleapis.com").post("/token", {
        client_id: "CLIENT_ID",
        client_secret: "CLIENT_SECRET",
        grant_type: 'refresh_token',
        refresh_token: "REFRESH_TOKEN",
    }).reply(200, {
        access_token: "ACCESS_TOKEN"
    });
}

const gmailNock = () => nock("https://gmail.googleapis.com/gmail/v1");
test('addLabels', async (t) => {
    interceptAuthentication();
    const scope = gmailNock()
        .post("/users/me/messages/messageId/modify", _.matches({addLabelIds: ['label101', 'label102']}))
        .query({access_token: "ACCESS_TOKEN"})
        .reply(200);

    await addLabels("messageId", "label101", "label102");

    t.true(scope.isDone());
})

test('getEmails', async (t) => {
    interceptAuthentication();
    const scope = gmailNock()
        .get("/users/me/messages").query({q: "QUERY", access_token: "ACCESS_TOKEN"})
        .reply(200);

    await getEmails("QUERY");

    t.true(scope.isDone());
})

test('getEmail', async (t) => {
    interceptAuthentication();
    const scope = gmailNock()
        .get("/users/me/messages/messageId").query({access_token: "ACCESS_TOKEN"})
        .reply(200);

    await getMessage("messageId");

    t.true(scope.isDone());
})

test('getAttachment', async (t) => {
    interceptAuthentication();
    const scope = gmailNock()
        .get("/users/me/messages/messageId/attachments/attachmentId").query({access_token: "ACCESS_TOKEN"})
        .reply(200, {attachmentInfo: "BLAH"});

    await getAttachment("messageId", "attachmentId");
    t.true(scope.isDone());
})