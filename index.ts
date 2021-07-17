'use strict';
import "dotenv/config";
import {DateTime} from "luxon";
import {Actions, ActionType} from './actions';
import {addLabels, getAttachment, getEmails, getMessage} from "./apis/gmail";

import {getFile} from "./apis/drive";

interface IActionsJson {
    [k: string]: {
        subject: string,
        actions: {
            name: ActionType
            args: string[]
        }[]
    }
};


(async () => {
    try {
        const actions : IActionsJson = await getFile(process.env.ACTIONS_FILE as string);
        const froms = Object.keys(actions).join(" OR ");
        const incomingEmails = await getEmails(`in:inbox ${froms} AND NOT label:processed`)


        if(incomingEmails.data.resultSizeEstimate == 0) {
            return;
        }

        for (const message of incomingEmails.data.messages) {
            const wholeMessage = await getMessage(message.id)
            const headers = wholeMessage.data.payload.headers.reduce((acc, {name, value}) =>
                ({
                    ...acc,
                    [name]: value
                }), {} as any);

            const from = headers.From.endsWith(">") ? headers.From.match(/\.*<(.*)>/)[1] : headers.From;
            const actionObject = actions[from];

            if (actionObject.subject && actionObject.subject !== headers.Subject) {
                continue
            }

            let i = 1;
            for (const e of wholeMessage.data.payload.parts) {
                if (!e.body.attachmentId) {
                    continue;
                }
                const date = DateTime.fromMillis(Number.parseInt(wholeMessage.data.internalDate)).minus({months: 1});
                const attachment = await getAttachment(message.id, e.body.attachmentId);

                await Promise.all(actionObject.actions.map(async ({name, args}) => {
                    const action = Actions[name](...args);
                    await action({
                        index: i,
                        messagePayload: e,
                        attachment,
                        date
                    })
                }));
                i++;
            }

            await addLabels(message.id, 'Label_101')
        }


    } catch (e) {
        console.error(e);
    }
})()


