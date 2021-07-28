import axios from "axios";

let accesToken: string;


export const getAccessToken = async (): Promise<string> => {
    if (!accesToken) {
        accesToken = await refreshToken();
    }
    return accesToken
}


const refreshToken = async () => {
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
};