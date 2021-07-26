import axios from "axios";

let accesToken: string;


export const getAccessToken = async (): Promise<string> => {
    if (!accesToken) {
        accesToken = await refreshToken();
    }
    return accesToken
}


const refreshToken = async () => {
    try {
        const {
            data: {
                access_token: accessToken
            }
        } = await axios.post("https://oauth2.googleapis.com/token",
            {
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                grant_type: 'refresh_token',
                refresh_token: process.env.REFRESH_TOKEN,
            },
            {
                responseType: 'json'
            });

        return accessToken;
    } catch (e) {
        // tslint:disable-next-line:no-console
        console.error(e);
    }
};