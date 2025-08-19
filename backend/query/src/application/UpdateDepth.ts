import DatabaseConnection from "../infra/database/DatabaseConnection";
import { Mutex } from "async-mutex";

export default class UpdateDepth {
    mutexMap = new Map<string, Mutex>();

    constructor (readonly connection: DatabaseConnection) {
    }

    private getMutex (key: string) {
        if (!this.mutexMap.has(key)) {
            this.mutexMap.set(key, new Mutex());
        }
        return this.mutexMap.get(key);
    }

    async execute (input: Input): Promise<void> {
        const key = `${input.marketId}:${input.side}:${input.price}`;
        const mutex = this.getMutex(key);
        await mutex?.runExclusive(async () => {
            if (input.event === "orderPlaced") {
                const [data] = await this.connection.query("select * from ccca.depth where market_id = $1 and side = $2 and price = $3", [input.marketId, input.side, input.price]);
                if (!data) {
                    await this.connection.query("insert into ccca.depth (market_id, side, quantity, price) values ($1, $2, $3, $4)", [input.marketId, input.side, input.quantity, input.price]);
                } else {
                    const quantity = parseFloat(data.quantity) + input.quantity;
                    await this.connection.query("update ccca.depth set quantity = $1 where market_id = $2 and side = $3 and price = $4", [quantity, input.marketId, input.side, input.price]);
                }
            }
            if (input.event === "orderFilled") {
                const [data] = await this.connection.query("select * from ccca.depth where market_id = $1 and side = $2 and price = $3", [input.marketId, input.side, input.price]);
                if (!data) {
                    await this.connection.query("insert into ccca.depth (market_id, side, quantity, price) values ($1, $2, $3, $4)", [input.marketId, input.side, (input.executedQuantity * -1), input.price]);
                    return;
                };
                const quantity = parseFloat(data.quantity) - input.executedQuantity;
                if (quantity > 0) {
                    await this.connection.query("update ccca.depth set quantity = $1 where market_id = $2 and side = $3 and price = $4", [quantity, input.marketId, input.side, input.price]);
                } else {
                    await this.connection.query("delete from ccca.depth where market_id = $1 and side = $2 and price = $3", [input.marketId, input.side, input.price]);
                }
            }
        });
    }
}

type Input = {
    marketId: string,
    side: string,
    quantity: number,
    executedQuantity: number,
    price: number,
    event: string // orderPlaced, orderFilled
}

