import * as io from "socket.io-client";
import $ from "jquery";

const socket = io.connect("http://localhost:3333");

export class App {
    init() {
        $("h1").text($("h1").text() + " from NC Vision");

        socket.on("connected", this.onSocketConnection);
    }

    private onSocketConnection = (message) => {
        console.log(message);
    };
}

const app = new App();
app.init();
