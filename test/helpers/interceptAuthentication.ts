import nock = require("nock");

export const interceptAuthentication = () => {
    nock("https://oauth2.googleapis.com").post("/token", {
        client_id: "CLIENT_ID",
        client_secret: "CLIENT_SECRET",
        grant_type: 'refresh_token',
        refresh_token: "REFRESH_TOKEN",
    }).reply(200, {
        access_token: "ACCESS_TOKEN"
    });
}