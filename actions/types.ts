import {DateTime} from "luxon";

import {MessagePartBody, MessagePart} from "apis/gmail";

export interface ActionParams {
    index: number,
    messagePayload: MessagePart,
    attachment: MessagePartBody,
    date: DateTime
}