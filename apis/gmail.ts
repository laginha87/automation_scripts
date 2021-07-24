import {getAccessToken} from "apis/googleAuth";
import axios, {AxiosInstance, AxiosResponse} from "axios";

interface MessageHeader {
    name: "To" | "From" | "Subject",
    value: string
}

export interface MessagePart {
    partId: string,
    headers: MessageHeader[],
    mimeType: string,
    filename: string,
    body: MessagePartBody,
    parts: MessagePart[],
}

export interface MessagePartBody {
    attachmentId: string,
    data: string,
    size: number
}

export interface GmailMessage {
    id: string,
    payload: MessagePart,
    internalDate: string,
}

export interface GmailList {
    messages: GmailMessage[],
    resultSizeEstimate: number
}

const generateGmailClient = async <T>(b: (a: AxiosInstance) => Promise<AxiosResponse<T>>) => {
    const accessToken = await getAccessToken();

    const gmail = axios.create({
        baseURL: "https://gmail.googleapis.com/gmail/v1/",
        params: {
            access_token: accessToken
        },
        responseType: 'json'
    })
    return b(gmail);
};

export const getEmails = (q: string) => generateGmailClient<GmailList>((a) => a.get<GmailList>(
    "users/me/messages",
    {
        params: {
            q
        }
    }
))

export const getMessage = (id: string) => generateGmailClient<GmailMessage>((a) => a.get<GmailMessage>(
    `users/me/messages/${id}`
))

export const getAttachment = async (messageId: string, attachmentId: string) => {
    const {data: attachment} = await generateGmailClient<MessagePartBody>(a => a.get<MessagePartBody>(`users/me/messages/${messageId}/attachments/${attachmentId}`));
    return attachment;
};

export const addLabels = (messageId: string, ...labels: string[]) => generateGmailClient(a => a.post(`users/me/messages/${messageId}/modify`, {addLabelIds: labels}));