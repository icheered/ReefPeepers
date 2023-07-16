import axios from 'axios';
import { FILEBROWSER_USERNAME, FILEBROWSER_PASSWORD, FILEBROWSER_URL, FILEBROWSER_FILEPREFIX } from '$env/static/private'

async function getToken() {
    const response = await axios.post(`${FILEBROWSER_URL}/api/login`, {
        username: FILEBROWSER_USERNAME,
        password: FILEBROWSER_PASSWORD
    });
    return response.data;
}

export async function uploadToFileBrowser(fileName: string, fileContents: any, contentType: string) {
    const token = await getToken();
    const res = await axios.post(
        `${FILEBROWSER_URL}/api/resources/${fileName}?override=true`,
        fileContents,
        {
            headers: {
                'Content-Type': contentType,
                'X-Auth': `${token}`
            }
        }
    );
    return res;
}

export async function deleteFromFileBrowser(fileName: string) {
    const token = await getToken();
    const url = `${FILEBROWSER_URL}/api/resources/${fileName}`;
    const res = await axios({
        method: 'DELETE',
        url: url,
        headers: {
            'X-Auth': `${token}`
        }
    });
    return res;
}

export function getFileBrowserFileURL(fileName: string) {
    const url = `${FILEBROWSER_URL}/api/raw/${FILEBROWSER_FILEPREFIX}/${fileName}`
    return url;
}
