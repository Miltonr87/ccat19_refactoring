import axios from "axios";
import { AccountGatewayHttpClient } from "../gateway/AccountGateway";

export default interface HttpClient extends AccountGatewayHttpClient {
    get (url: string): Promise<any>;
    post (url: string, body: any): Promise<any>;
}

export class FetchAdapter implements HttpClient {

    async get(url: string): Promise<any> {
        const response = await fetch(url);
        const output = await response.json();
        return output;
    }

    async post(url: string, body: any): Promise<any> {
        const response = await fetch(url, {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(body)
        });
        const output = await response.json();
        return output;
    }

}

export class AxiosAdapter implements HttpClient {

    async get(url: string): Promise<any> {
        const response = await axios(url);
        const output = response.data;
        return output;
    }

    async post(url: string, body: any): Promise<any> {
        const response = await axios.post(url, body);
        return response.data;
    }

}
