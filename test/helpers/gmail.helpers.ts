import _ from "lodash";
import nock from "nock";

const gmailNock = () => nock("https://gmail.googleapis.com/gmail/v1");

export const interceptAddLabels = (labels: string[], messageId= "messageId") => gmailNock()
    .post(`/users/me/messages/${messageId}/modify`, _.matches({addLabelIds: labels}))
    .query({access_token: "ACCESS_TOKEN"});

export const interceptGetEmails = (q: string) => gmailNock()
    .get("/users/me/messages").query({q, access_token: "ACCESS_TOKEN"});

export const interceptGetMessage = (messageId: string) => gmailNock()
    .get(`/users/me/messages/${messageId}`).query({access_token: "ACCESS_TOKEN"});

export function interceptGetMessageAttachment(messageId: string, attachmentId: string) {
    return gmailNock()
        .get(`/users/me/messages/${messageId}/attachments/${attachmentId}`).query({access_token: "ACCESS_TOKEN"});
}