import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { WSSAdapter } from "./infra/websocket/WebSocketServer";
import { RabbitMQAdapter } from "./infra/queue/Queue";
import BookQueue from "./infra/queue/BookQueue";
import UpdateDepth from "./application/UpdateDepth";
import GetDepth from "./application/GetDepth";

async function main () {
    const websocketServer = new WSSAdapter(3005);
    const connection = new PgPromiseAdapter();
    const queue = new RabbitMQAdapter();
    await queue.connect();
    const updateDepth = new UpdateDepth(connection);
    const getDepth = new GetDepth(connection);
    BookQueue.config(queue, websocketServer, updateDepth, getDepth);
}

main();
