import express from "express";
import * as path from "path";
import * as http from "http";
import * as socket from "socket.io";
import os from "os";

const app = express();
const PORT = 3333;
const server = http.createServer(app);
const publicPath = path.join(__dirname, "../client");

export class App {
    private clientsMap: Map<string, socket.Socket> = new Map();

    private counter:number = 0;
    private cpuLoad: number;
    
    constructor() {
        this.initSocket();
        this.registerRoutes();
        this.runServer();
        this.monitorCpu();
    }

    private runServer() {
        server.listen(PORT, () => {
            console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
        });
    }

    private monitorCpu() {
                //Grab first CPU Measure
        var startMeasure = this.cpuAverage();

        //Set delay for second Measure
        setTimeout(()  =>{ 

            //Grab second Measure
            var endMeasure = this.cpuAverage(); 

            //Calculate the difference in idle and total time between the measures
            var idleDifference = endMeasure.idle - startMeasure.idle;
            var totalDifference = endMeasure.total - startMeasure.total;

            //Calculate the average percentage CPU usage
            this.cpuLoad = 100 - ~~(100 * idleDifference / totalDifference);

            this.monitorCpu();

        }, 1000);
    }

    private cpuAverage() {

        //Initialise sum of idle and time of cores and fetch CPU info
        var totalIdle = 0, totalTick = 0;
        var cpus = os.cpus();
      
        //Loop through CPU cores
        for(var i = 0, len = cpus.length; i < len; i++) {
      
          //Select CPU core
          var cpu:any = cpus[i];

          let type:string;

          //Total up the time in the cores tick
          for(type in cpu.times) {
            totalTick += cpu.times[type];
         }     
      
          //Total up the idle time of the core
          totalIdle += cpu.times.idle;
        }
      
        //Return the average Idle and Tick times
        return {idle: totalIdle / cpus.length,  total: totalTick / cpus.length};
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

            socket.on("increment", () => {
                this.counter++;
                io.emit("counter",this.counter);
            });

        });
    }

    private registerRoutes() {
        app.use("/", express.static(publicPath));
        // app.get("/2", (req, res) => res.sendFile(path.join(publicPath + "/index.html")));
        app.get("/1", (req, res) => res.send("Express + TypeScript Server 1"));

        app.get("/api/v1/system", (req, res) => {
            
            res.json([this.cpuLoad,os.freemem(),os.totalmem()]);
        });

    }
}

new App();
