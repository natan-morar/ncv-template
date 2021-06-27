import * as io from "socket.io-client";
import $ from "jquery";

const socket = io.connect("http://localhost:3333");

export interface IAddress {
    id:number;
    city:string;
    street:string;
    number:string;
}

export class App {
    init() {
        $("h1").text($("h1").text() + " from NC Vision");

        $('.btn-increment').on("click", () =>{
            socket.emit("increment");
        });

        // document.querySelectorAll(".btn-check")[0].addEventListener("click", (e) => {
        // $('.btn-check').on("click", () =>{

        $('.btn-check').on("click", () =>{
            $.getJSON("api/v1/system", (data) => {
                $('.load').text(`${data[0]}%` );
                $('.mem').text(`${(data[1]/data[2]*100).toFixed(2)}%` );

                this.renderTable([
                    {
                        id: 1,
                        city: "Arad",
                        number: "11A",
                        street: "Coposu",
                    },                    {
                        id: 2,
                        city: "Ineu",
                        number: "77",
                        street: "Revolutiei",
                    }

                ]);
            });

            
        });

        socket.on("connected", this.onSocketConnection);

        socket.on("counter", (d) => {
            $(".counter").text(d);
        });
    }

    private renderTable(data:IAddress[]) {
        const $rightCol = $(".right");

        $rightCol.append("<table></table>");

        const $table = $rightCol.find("table");

        for(const address of data ) {
            $table.append(`<tr data-id="${address.id}"><td>${address.city}</td><td>${address.number}</td><td>${address.street}</td></tr>`)
        }

    }

    private onSocketConnection = (message) => {
        console.log(message);
    };
}

const app = new App();
app.init();
