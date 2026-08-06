import app from "./app"
import { initSocket } from "./config/socket";
import http from "http";

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);   
})