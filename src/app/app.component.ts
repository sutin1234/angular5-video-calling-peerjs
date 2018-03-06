import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as peerjs from 'peerjs';

declare var Peer;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  peer: any;
  myId: any;
  anotherId: any;
  @ViewChild('myVideo') myVideo: any;


  ngOnInit() {
    const video = this.myVideo.nativeElement;

     this.peer = new Peer({key: 'cmjdx0cgqmc2fbt9'});
     setTimeout(() => {
       this.myId =  this.peer.id;
       console.log('myId generated: ' + this.myId);
     }, 3000);

     this.peer.on('connection', function(conn) {
        conn.on('data', function(data) {
          console.log('data connected: ', data);
        });
        conn.send('connected!');
      });

      this.peer.on('call', function(call3) {
        navigator.getUserMedia({ audio: true, video: true }, function(stream) {
          call3.answer(stream); // Answer the call with an A/V stream.
          call3.on('stream', function(remoteStream) {
            console.log('remoteStream ', remoteStream);
            video.src = URL.createObjectURL(remoteStream);
              video.play();
          });
        }, (err) => {
             console.log('The following error occurred: ' + err);
        });
      });
  }
  connect() {
    const conn = this.peer.connect(this.anotherId);
      conn.on('open', function() {
        conn.send({
          connectID: this.anotherId,
          connectDate: Date.now(),
          data: {
            status: 200,
            message: 'connected Success!'
          }
        });
      });
  }
  videoConnect() {
    const video = this.myVideo.nativeElement;
    const localVar = this.peer;
    const fName = this.anotherId;
    if (navigator.getUserMedia) {
     navigator.getUserMedia({ audio: true, video: true }, function(stream) {
           const call2 = localVar.call(fName, stream);
            call2.on('stream', function(remoteStream) {
              video.src = URL.createObjectURL(remoteStream);
              video.play();
            }, (err) => {
                console.log('not stream ', err);
            });
        }, function(err) {
           console.log('The following error occurred: ' + err.name);
        }
     );
  } else {
     console.log('getUserMedia not supported');
  }

  }
}
