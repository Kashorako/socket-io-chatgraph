import {Component} from '@angular/core';
import {ChatService} from "./chat.service";

//para grafico
import Chart from 'chart.js/auto';
import { io } from "socket.io-client";
const socket = io('http://localhost:3000');
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  //Para grafico
  public chart: any;
  chart_data1 = ['10','20', '30', '40', '50',
    '60', '70', '80'];
  chart_data2 = ['80','70', '60', '50', '40',
    '30', '20', '10'];

  newMessage: string = '';
  messageList: string[] = [];

  constructor(private chatService: ChatService) {
    this.newMessage = ''
  }

  ngOnInit() {
    this.chatService.getNewMessage().subscribe((message: string) => {
      this.messageList.push(message);
    })
    //PARA GRAFICO
    //Creamos el grafico
    this.createChart(this.chart_data1, this.chart_data2);
    //Escuchamos cualquier cambio del char
    socket.on('data1', (res)=>{
      this.updateChartData(this.chart, res, Math.round(Math.random()))
    })

  }

  sendMessage() {
    this.chatService.sendMessage(this.newMessage);
    this.newMessage = '';
  }



  //PARA GRAFICO
  createChart(values1: string[], values2: string[]){

    this.chart = new Chart("MyChart", {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['2023-05-10', '2023-05-11', '2023-05-12','2023-05-13',
          '2023-05-14', '2023-05-15', '2023-05-16','2023-05-17', ],
        datasets: [
          {
            label: "Ventas",
            data: values1,
            backgroundColor: 'orange'
          },
          {
            label: "Ganancia",
            data: values2,
            backgroundColor: 'purple'
          }
        ]
      },
      options: {
        aspectRatio:2.5
      }

    });
  }

  updateChartData(chart:any, data:any, dataSetIndex:number){
    chart.data.datasets[dataSetIndex].data = data;
    chart.update();
  }

  emitChartData() {
    socket.emit('data1', this.newMessage);
  }
}
