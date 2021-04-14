import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalRecorder, OpenVidu, Publisher, Device, Session, SignalEvent, SignalOptions, StreamEvent, VideoElementEvent } from 'openvidu-angular';
import { throwError as observableThrowError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Livestream } from 'src/app/interfaces/livestream';
import { DB } from 'src/app/services/database/DB';

@Component({
  selector: 'app-livestream',
  templateUrl: './livestream.component.html',
  styleUrls: ['./livestream.component.css'],
})

export class LivestreamComponent implements OnInit, OnDestroy {
  // @ViewChild("msg") msg: ElementRef;
  counter: number = 0;
  OPENVIDU_SERVER_URL = 'https://' + location.hostname + ':4443';
  OPENVIDU_SERVER_SECRET = 'MY_SECRET';
  isHost: boolean;
  recorder: LocalRecorder;
  toggle: boolean = true;
  chat: string[] = [];
  lid: string;
  livestream: Livestream;
  resolution: string;
  width: number;
  height: number;
  isFrontCamera = true;
  /*@ViewChild('vid') */
  publisherVideoElement: HTMLVideoElement;
  @ViewChild('chatContainer') chatContainer: ElementRef;
  publisher: Publisher;
  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private db: DB,) { }


  OV: OpenVidu;
  session: Session;
  cams: Device[];

  sessionName: string;	// Name of the video session the user will connect to
  token: string;
  ngOnInit() {
    // this.isHost = this.db.getLivestream('B5aWNM3gkbHnyxMcULYq').host == this.db.me?.uid;
    this.lid = this.route.snapshot.params['lid'];
    this.livestream = this.db.getLivestream(this.lid)
    this.sessionName = this.livestream?.lid || 'livestream Not Found';
    this.isHost = this.db.me?.uid == this.livestream?.host;
    console.log(this.livestream)
    this.isSessionExists(this.sessionName).then((exists) => {
      if (exists) {
        this.joinSession();
      } else {
        this.createSession(this.sessionName).then(() => { this.joinSession() })
      }
    })
    // this.chatStyle = {
    // "width": this.publisherVideoElement.width * 0.1, 
    // "height": this.publisherVideoElement.height * 0.1}
  }
  // Token retrieved from OpenVidu Server

  @HostListener('window:resize', ['$event'])
  onResize(event) {

    this.width = event.target.innerWidth
    if (!this.publisherVideoElement) {
      return;
    }
    if (window.screen.width > window.screen.height) {
      this.publisherVideoElement.height = event.target.innerHeight;
      this.publisherVideoElement.width = (4.0 / 3.0) * this.publisherVideoElement.height;

    } else {
      this.publisherVideoElement.width = event.target.innerWidth;
      this.publisherVideoElement.height = 0.75 * this.publisherVideoElement.width;
    }
    // console.log("height: " + event.target.innerHeight);
    // console.log("width: " + event.target.innerWidth);

  }



  /* OPENVIDU METHODS */
  isMyOwnConnection(connectionId: string): boolean {
    return connectionId == this.session.connection.connectionId
  }
  joinSession() {
    this.getToken((token: string) => {
      this.token = token;

      // --- 1) Get an OpenVidu object ---

      this.OV = new OpenVidu();
      // --- 2) Init a session ---
      this.OV.getDevices().then((devices) => {
        this.cams = devices.filter((d) => d.kind == "videoinput")
      })

      this.session = this.OV.initSession();

      //chat // here add to chat
      this.session.on('signal:chat', (event: SignalEvent) => {
        var message = event.data;
        this.chat.push(message)
        console.log(message)
      })


      // --- 3) Specify the actions when events take place in the session ---

      // On every new Stream received...
      this.session.on('streamCreated', (event: StreamEvent) => {
        const streamConnectionID = event.stream.connection.connectionId;
        // Subscribe to the Stream to receive it
        // HTML video will be appended to element with 'video-container' id
        if (this.isMyOwnConnection(streamConnectionID)) {
          return;
        }
        console.warn(streamConnectionID, this.session.connection.connectionId)
        var subscriber = this.session.subscribe(event.stream, 'video-container');

        // When the HTML video has been appended to DOM...
        subscriber.on('videoElementCreated', (event: VideoElementEvent) => {
          event.element.muted = true; // Chrome's autoplay policies are simple: 1- Muted autoplay is always allowed ...etc, for more check https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
          event.element.controls = true;

          // Add a new HTML element for the user's name and nickname over its video
          // this.appendUserData(event.element, subscriber.stream.connection);
        });

      });

      // On every Stream destroyed...
      this.session.on('streamDestroyed', (event: StreamEvent) => {
        // Delete the HTML element with the user's name and nickname
        // setTimeout(() => {
        //   this.leaveSession()
        // }, 500);

      });

      // --- 4) Connect to the session passing the retrieved token and some more data from
      //        the client (in this case a JSON with the nickname chosen by the user) ---
      this.session.connect(this.token, this.db.me?.uid)
        .then(() => {

          // --- 5) Set page layout for active call ---

          $('#session-title').text(this.sessionName);


          // Here we check somehow if the user has 'PUBLISHER' role before
          // trying to publish its stream. Even if someone modified the client's code and
          // published the stream, it wouldn't work if the token sent in Session.connect
          // method is not recognized as 'PUBLIHSER' role by OpenVidu Server
          if (this.isHost) {

            // --- 6) Get your own camera stream ---

            this.publisher = this.OV.initPublisher('video-container', {
              audioSource: undefined, // The source of audio. If undefined default microphone
              videoSource: undefined, // The source of video. If undefined default webcam
              publishAudio: true,  	// Whether you want to start publishing with your audio unmuted or not
              publishVideo: true,  	// Whether you want to start publishing with your video enabled or not
              // resolution: "640x480",
              //this.resolution,  // The resolution of your video
              frameRate: 30,			// The frame rate of your video
              insertMode: 'APPEND',	// How the video is inserted in the target element 'video-container'
              mirror: true,       	// Whether to mirror your local video or not
            });

            // --- 7) Specify the actions when events take place in our publisher ---

            // When our HTML video has been added to DOM...
            this.publisher.on('videoElementCreated', (event: VideoElementEvent) => {
              event.element.muted = true;// Mute local video
              this.publisherVideoElement = event.element;

              if (window.screen.width > window.screen.height) {
                this.publisherVideoElement.height = window.innerHeight;
              } else {
                this.publisherVideoElement.width = window.innerWidth;
              }

              // event.element.controls = true;
            });

            this.recorder = this.OV.initLocalRecorder(this.publisher.stream);

            // --- 8) Publish your stream ---

            this.session.publish(this.publisher);

          } else {
            console.warn('You don\'t have permissions to publish');
          }
        })
        .catch(error => {
          console.warn('There was an error connecting to the session:', error.code, error.message);
        });
    });

    return false;
  }

  leaveSession() {

    // --- 9) Leave the session by calling 'disconnect' method over the Session object ---
    // if (this.isHost) {
    //   this.removeSisson();
    // }
    this.session?.disconnect();
    this.session = null;

    this.router.navigate(['home'])

  }

  /* APPLICATION BROWSER METHODS */
  ngOnDestroy() { // Gracefully leave session
    this.leaveSession();
  }


  //   /* APPLICATION BROWSER METHODS */

  getToken(callback) {
    // if (this.isHost) {
    //   this.createSession(this.sessionName).then((sessionId) => {
    //     this.createToken(sessionId).then((token) => {
    //       callback(token)
    //     })
    //   });
    //   return;
    // }
    this.createToken(this.sessionName).then((token) => {
      callback(token);
    })
  }

  createSession(sessionId): Promise<string> {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify({ customSessionId: sessionId });
      const options = {
        headers: new HttpHeaders({
          Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + this.OPENVIDU_SERVER_SECRET),
          'Content-Type': 'application/json',
        }),
      };
      return this.httpClient
        .post(this.OPENVIDU_SERVER_URL + '/openvidu/api/sessions', body, options)
        .pipe(
          catchError((error) => {
            if (error.status === 409) {
              resolve(sessionId);
            } else {
              console.warn('No connection to OpenVidu Server. This may be a certificate error at ' + this.OPENVIDU_SERVER_URL);
              if (
                window.confirm(
                  'No connection to OpenVidu Server. This may be a certificate error at "' +
                  this.OPENVIDU_SERVER_URL +
                  '"\n\nClick OK to navigate and accept it. If no certificate warning is shown, then check that your OpenVidu Server' +
                  'is up and running at "' +
                  this.OPENVIDU_SERVER_URL +
                  '"',
                )
              ) {
                location.assign(this.OPENVIDU_SERVER_URL + '/accept-certificate');
              }
            }
            return observableThrowError(error);
          }),
        )
        .subscribe((response) => {
          console.log(response);
          resolve(response['id']);
        });
    });
  }

  createToken(sessionId): Promise<string> {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify({ role: 'PUBLISHER' });
      const options = {
        headers: new HttpHeaders({
          Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + this.OPENVIDU_SERVER_SECRET),
          'Content-Type': 'application/json',
        }),
      };
      return this.httpClient
        .post(this.OPENVIDU_SERVER_URL + '/openvidu/api/sessions/' + sessionId + '/connection', body, options)
        .pipe(
          catchError((error) => {
            return observableThrowError(error);
          }),
        )
        .subscribe((response) => {
          console.log(response);
          // localStorage.setItem(sessionId,response['token'])
          resolve(response['token']);
        });
    });
  }

  /*
  
  */
  isSessionExists(sessionId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const options = {
        headers: new HttpHeaders({
          Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + this.OPENVIDU_SERVER_SECRET)
        }),
      };
      return this.httpClient
        .get(this.OPENVIDU_SERVER_URL + '/openvidu/api/sessions/' + sessionId, options)
        .pipe(
          catchError((error) => {
            if (error.status == 404) {
              resolve(false)
            } else {
              console.warn('No connection to OpenVidu Server. This may be a certificate error at ' + this.OPENVIDU_SERVER_URL);
              if (
                window.confirm(
                  'No connection to OpenVidu Server. This may be a certificate error at "' +
                  this.OPENVIDU_SERVER_URL +
                  '"\n\nClick OK to navigate and accept it. If no certificate warning is shown, then check that your OpenVidu Server' +
                  'is up and running at "' +
                  this.OPENVIDU_SERVER_URL +
                  '"',
                )
              ) {
                location.assign(this.OPENVIDU_SERVER_URL + '/accept-certificate');
              }
            }
            // reject(error);
            return observableThrowError(error);
          }),
        )
        .subscribe((response) => {
          console.log(response);
          resolve(true);
        });
    });
  }


  sendMessage(message) {
    var so: SignalOptions = { type: 'chat', data: message }
    this.session.signal(so)
    this.chatContainer.nativeElement.scrollBy(0, -10000)

  }
  recording() {
    if (this.toggle) {
      this.recorder.record('video/webm;codecs=vp9');
    } else {
      this.recorder.stop().then(() => {
        this.recorder.download()
        // this.recorder.clean(); // they say its dismised
      })
    }
    this.toggle = !this.toggle;
  }
  removeSisson() {
    const options = {
      headers: new HttpHeaders({
        Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + this.OPENVIDU_SERVER_SECRET)
      }),
    };
    return this.httpClient
      .delete(this.OPENVIDU_SERVER_URL + '/openvidu/api/sessions/' + this.sessionName, options)
      .pipe(
        catchError((error) => {
          return observableThrowError(error);
        }),
      )

  }
  shareScreen() {
    var sessionScreen = this.OV.initSession();
    this.getToken(((token) => {
      sessionScreen.connect(token).then(() => {
        var publisher = this.OV.initPublisher("video-container", { videoSource: "screen" });

        publisher.once('accessAllowed', (event) => {
          publisher.stream.getMediaStream().getVideoTracks()[0].addEventListener('ended', () => {
            console.log('User pressed the "Stop sharing" button');
          });
          sessionScreen.publish(publisher);

        });

        publisher.once('accessDenied', (event) => {
          console.warn('ScreenShare: Access Denied');
        });

      }).catch((error => {
        console.warn('There was an error connecting to the session:', error.code, error.message);

      }));
    }));
  }


  toggleCamera() {
    this.OV.getDevices().then(devices => {
      // Getting only the video devices
      var videoDevices = devices.filter(device => device.kind === 'videoinput');

      if (videoDevices && videoDevices.length > 1) {

        // Creating a new publisher with specific videoSource
        // In mobile devices the default and first camera is the front one
        // this.counter = (this.counter + 1) % videoDevices.length;

        var newPublisher = this.OV.initPublisher('video-container', {
          videoSource: videoDevices[this.counter].deviceId,
          publishAudio: true,
          publishVideo: true,
          mirror: this.isFrontCamera // Setting mirror enable if front camera is selected
        });

        // Changing isFrontCamera value
        this.isFrontCamera = !this.isFrontCamera;

        // Unpublishing the old publisher
        this.session.unpublish(this.publisher);

        // Assigning the new publisher to our global variable 'publisher'
        this.publisher = newPublisher;

        // Publishing the new publisher
        this.session.publish(this.publisher);
      }
    });
  }
}
