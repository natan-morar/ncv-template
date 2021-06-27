import express from "express";
import * as path from "path";
import * as http from "http";
import * as socket from "socket.io";

const app = express();
const PORT = 3333;
const server = http.createServer(app);
const publicPath = path.join(__dirname, "../client");

export class App {
    private clientsMap: Map<string, socket.Socket> = new Map();

    constructor() {
        this.initSocket();
        this.registerRoutes();
        this.runServer();
    }

    private runServer() {
        server.listen(PORT, () => {
            console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
        });
    }

    private initSocket() {
        const io = socket.listen(server);
        // Handle connection
        io.on("connection", (socket) => {
            this.clientsMap.set(socket.id, socket);

            console.log(`Connected succesfully to the socket ... ${socket.id}`);
            socket.emit("connected", `You're connected and your id is ${socket.id}`);

            socket.on("disconnect", () => {
                this.clientsMap.delete(socket.id);
                console.log(`Socket ${socket.id} disconnected`);
            });
        });
    }

    private registerRoutes() {
        app.use("/", express.static(publicPath));
        // app.get("/2", (req, res) => res.sendFile(path.join(publicPath + "/index.html")));
        app.get("/1", (req, res) => res.send("Express + TypeScript Server 1"));
    }
}

new App();
