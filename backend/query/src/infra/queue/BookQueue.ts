import GetDepth from "../../application/GetDepth";
import UpdateDepth from "../../application/UpdateDepth";
import WebSocketServer from "../websocket/WebSocketServer";
import Queue from "./Queue";

export default class BookQueue {

    static config (queue: Queue, websocketServer: WebSocketServer, updateDepth: UpdateDepth, getDepth: GetDepth) {
        queue.consume("orderPlaced.updateDepth", async (input: any) => {
            input.event = "orderPlaced";
            await updateDepth.execute(input);
            const depth = await getDepth.execute(input.marketId);
            await websocketServer.broadcast({ service: "depth", data: depth });
        });
        queue.consume("orderFilled.updateDepth", async (input: any) => {
            input.event = "orderFilled";
            await updateDepth.execute(input);
            const depth = await getDepth.execute(input.marketId);
            await websocketServer.broadcast({ service: "depth", data: depth });
        });
    }

}
