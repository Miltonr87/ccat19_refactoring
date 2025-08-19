export default interface AccountGateway {
    signup (input: any): Promise<any>;
}

export class AccountGatewayHttp implements AccountGateway {

    constructor (readonly httpClient: AccountGatewayHttpClient) {
    }

    async signup(input: any): Promise<any> {
        const output = await this.httpClient.post("http://localhost:3000/signup", input);
        return output;
    }

}

export class AccountGatewayFake implements AccountGateway {

    async signup(input: any): Promise<any> {
        return {
            accountId: "9ad91c3b-d31f-463a-b773-02c64897db73"
        }
    }

}

export interface AccountGatewayHttpClient {
    post (url: string, body: any): Promise<any>;
}
