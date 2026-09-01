import app from "./app";
import { initSocket } from "./config/socket";
import http from "http";
import { startReminderJob } from "./cron/reminderJob";

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);   
    
    startReminderJob();
});