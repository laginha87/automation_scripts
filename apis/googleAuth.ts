import axios from "axios";

let access_token: string;


export const getAccessToken = async (): Promise<string> => {
    if (!access_token) {
        access_token = await refreshToken();
    }
    return access_token
}


const refreshToken = async () => {
    try {
        const {
            data: {
                access_token
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

        return access_token;
    } catch (e) {
        console.error(e);
    }
};