import * as io from "socket.io-client";
import $ from "jquery";

const socket = io.connect("http://localhost:3333");

export class App {
    init() {
        $("h1").text($("h1").text() + " from NC Vision");

        $('.btn-increment').on("click", () =>{
            socket.emit("increment");
        });

        $('.btn-check').on("click", () =>{
            $.getJSON("api/v1/system", (data) => {
                $('.load').text(`${data[0]}%` );
                $('.mem').text(`${(data[1]/data[2]*100).toFixed(2)}%` );
            });
        });
        


        socket.on("connected", this.onSocketConnection);

        socket.on("counter", (d) => {
            $(".counter").text(d);
        });
    }

    private onSocketConnection = (message) => {
        console.log(message);
    };
}

const app = new App();
app.init();
