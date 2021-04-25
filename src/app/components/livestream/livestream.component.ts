import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalRecorder, Subscriber, OpenVidu, Publisher, Device, Session, SignalEvent, SignalOptions, StreamEvent, VideoElementEvent, PublisherProperties, LocalRecorderState } from 'openvidu-angular';
import { throwError as observableThrowError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Livestream } from 'src/app/interfaces/livestream';
import { DB } from 'src/app/services/database/DB';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import firebase from 'firebase';
import { User } from 'src/app/interfaces/User';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-livestream',
  templateUrl: './livestream.component.html',
  styleUrls: ['./livestream.component.css'],
})

export class LivestreamComponent implements OnInit, OnDestroy {
  saveisChecked = true;
  counter: number = 0;
  OPENVIDU_SERVER_URL = 'https://' + location.hostname + ':4443';
  OPENVIDU_SERVER_SECRET = 'MY_SECRET';
  isHost: boolean;
  recorder: LocalRecorder;
  chat: string[] = [];
  lid: string;
  livestream: Livestream;
  isFrontCamera = true;
  publisherVideoElement: HTMLVideoElement;
  @ViewChild('chatContainer') chatContainer: ElementRef;
  publisher: Publisher;
  connected: boolean;
  liked: boolean;
  disliked: boolean;
  likeState: string;
  dislikeState: string;
  micState: string = "mic"
  camState: string = "videocam"
  @ViewChild('stopDialog') stopDialog: TemplateRef<any>;
  subscriber: Subscriber;
  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private fireStorage: AngularFireStorage,
    public db: DB,
    private titleService: Title,
    public dialog: MatDialog,) { }

  OV: OpenVidu;
  session: Session;
  host: User;
  sessionName: string;
  token: string;

  ngOnInit() {
    this.lid = this.route.snapshot.params['lid'];
    this.livestream = this.db.getLivestream(this.lid)
    this.titleService.setTitle(this.livestream.title + " | Flo");
    // Check if stream is private
    if (this.livestream.isPrivate) {
      // If user is not logged in, redirect
      if (!this.db.me) {
        this.router.navigate(['home']);
        // If user is not a follower, redirect
      } else if (!this.db.me?.followingUsers?.includes(this.livestream.host)) {
        this.router.navigate(['home']);
      }
    }
    this.liked = this.livestream.likes?.includes(this.db.me?.uid) || false
    this.disliked = this.livestream.dislikes?.includes(this.db.me?.uid) || false
    this.likeState = this.liked ? 'thumb_up' : 'thumb_up_off_alt';
    this.dislikeState = this.disliked ? 'thumb_down' : 'thumb_down_off_alt';
    if (this.livestream?.isActive) {
      this.sessionName = this.livestream?.lid || 'livestream Not Found';
      this.host = this.db.getUser(this.livestream?.host)
      this.isHost = this.db.me?.uid == this.host?.uid;
      this.joinSession();
    }

    setTimeout(this.screenshot, 10000);

  }
  
  screenshot() {
    console.log("Taking screenshot")
  }

  // Open 'save stream' dialog when user clicks stop livestream
  openDialog() {
    let dialogRef = this.dialog.open(this.stopDialog,
      {
        width: '350px',
        height: '300px',
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    })
  }

  // Gracefully leave session
  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(event: Event) {
    this.session.disconnect();
    event.returnValue = true;
  }


  // Token retrieved from OpenVidu Server
  @HostListener('window:resize', ['$event'])
  onResize(event) {
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
  }

  // /**
  //  *  method that check if the livestream is yours
  //  * @param connectionId string represent the connection id
  //  * @returns true if the connection id is equal to my own connection, false otherwise
  //  */
  //   isMyOwnConnection(connectionId: string): boolean {
  //     return connectionId == this.session.connection.connectionId
  //   }

  
  joinSession() {
    this.getToken((token: string) => {
      this.token = token;

      // --- 1) Get an OpenVidu object ---
      this.OV = new OpenVidu();

      // --- 2) Init a session ---
      this.session = this.OV.initSession();

      //chat // here add to chat
      this.session.on('signal:chat', (event: SignalEvent) => {
        var data = JSON.parse(event.data)
        this.chat.push(data)
        console.log(data)
      })

      // --- 3) Specify the actions when events take place in the session ---
      // On every new Stream received...
      this.session.on('streamCreated', (event: StreamEvent) => {
        const streamConnectionID = event.stream.connection.connectionId;
        // Subscribe to the Stream to receive it
        // HTML video will be appended to element with 'video-container' id
        if (streamConnectionID == this.session.connection.connectionId) {
          return;
        }
        console.warn(streamConnectionID, this.session.connection.connectionId)
        this.subscriber = this.session.subscribe(event.stream, 'video-container');

        // When the HTML video has been appended to DOM...
        this.subscriber.on('videoElementCreated', (event: VideoElementEvent) => {
          event.element.muted = false; // Chrome's autoplay policies are simple: 1- Muted autoplay is always allowed ...etc, for more check https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
          event.element.controls = true;
          this.publisherVideoElement = event.element;

          if (window.screen.width > window.screen.height) {
            this.publisherVideoElement.height = window.innerHeight;
          } else {
            this.publisherVideoElement.width = window.innerWidth;
          }

          // Add a new HTML element for the user's name and nickname over its video
          // this.appendUserData(event.element, subscriber.stream.connection);
        });
      });
      // On every Stream destroyed...
      this.session.on('streamDestroyed', (event: StreamEvent) => {
        // const streamConnectionID = event.stream.connection.connectionId;
        // Delete the HTML element with the user's name and nickname
        if (!this.isHost) {
          setTimeout(() => {
            this.leaveSession()
          }, 500);
        }
      });
      // this.session.on('')
      // this.session.onParticipantJoined()

      // --- 4) Connect to the session passing the retrieved token and some more data from
      //        the client (in this case a JSON with the nickname chosen by the user) ---
      this.session.connect(this.token, this.db.me?.uid)
        .then(() => {
          this.connected = true;
          // --- 5) Set page layout for active call ---


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
            });

            // --- 8) Publish your stream ---
            this.session.publish(this.publisher).then(() => { this.startRecording(); });
          } else {
            if (this.db.me) {
              this.db.updateLivestream(this.lid, { views: firebase.firestore.FieldValue.arrayUnion(this.db.me.uid) })
            }
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

    this.stopRecording().then(() => {
     //Leave the session by calling 'disconnect' method over the Session object ---
      this.session?.disconnect();
      this.session = null;
      this.router.navigate(['home'])
    })
 

  }

  /* APPLICATION BROWSER METHODS */

  ngOnDestroy() { // Gracefully leave session
    this.leaveSession();
  }


  getToken(callback) {
    this.createSession(this.sessionName).then((sessionId) => {
      this.createToken(sessionId).then((token) => {
        callback(token)
      })
    });
  }
  /**
   * create new session with the given session Id
   * 
   * @param sessionId 
   * @returns session id of the created session
   */
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
  /**create token for the given session id to connect to it
   * 
   * @returns token
   */
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

  /**
   * send message to chat
   * @param message A string that represent the message
   */
  sendMessage(message) {
    // make sure that message is not null
    if (!message) {
      return;
    }
    this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    var so: SignalOptions = { type: 'chat', data: JSON.stringify({ message: message, username: this.db.me.username, photoURL: this.db.me.photoURL }) }
    this.session.signal(so)
    console.log(this.connected);
    this.chatContainer.nativeElement.scrollBy(0, 100000);
  }

  /**
   * record the livestream
   */
  startRecording() {
    this.recorder = this.OV.initLocalRecorder(this.publisher.stream);
    this.recorder.record('video/webm;codecs=vp9')
  }

  stopRecording(): Promise<void> {
  /**
   * stop the recording
   */
    if (this.recorder?.state === LocalRecorderState.RECORDING && this.saveisChecked) {
      return this.recorder.stop().then(() => {
        this.fireStorage.upload('/vid/vid' + this.livestream.lid, this.recorder.getBlob()).then((task) => {
          task.ref.getDownloadURL().then((url) => {
            this.db.updateLivestream(this.livestream.lid, { isActive: false, videoURL: url });
          })
        })
      })
    } else {
      this.db.deleteLivestream(this.lid);
      return this.recorder.stop();
    }
  }

  /**
   * Switch between front and back camera of the host
   */
  toggleCamera() {
    this.OV.getDevices().then(devices => {
      var publisherProperties: PublisherProperties;
      // Getting only the video devices
      var videoDevices = devices.filter(device => device.kind === 'videoinput');
      var frontCam = videoDevices.find((d) => d.label.includes('front'));
      var BackCam = videoDevices.find((d) => d.label.includes('back'));
      if (frontCam && BackCam) {
        publisherProperties = {
          videoSource: this.isFrontCamera ? BackCam.deviceId : frontCam.deviceId,
          publishAudio: true,
          publishVideo: true,
          mirror: !this.isFrontCamera // Setting mirror enable if front camera is selected
        }
      } else {
        this.counter = (this.counter + 1) % videoDevices.length;
        publisherProperties = {
          videoSource: videoDevices[this.counter].deviceId,
          publishAudio: true,
          publishVideo: true,
          mirror: false, // Setting mirror enable if front camera is selected
        }
      }

      if (videoDevices && videoDevices.length > 1) {
        // Creating a new publisher with specific videoSource
        // In mobile devices the default and first camera is the front one
        var newPublisher = this.OV.initPublisher('video-container', publisherProperties);
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

  /**
   * like the livestream
   */
  like() {
    if (this.db?.me == undefined) {
      return
    }
    if (this.liked) {
      this.liked = false;
      this.likeState = "thumb_up_off_alt";
      // remove like from db
      this.db.updateLivestream(this.livestream.lid, {
        likes: firebase.firestore.FieldValue.arrayRemove(this.db.me.uid)
      })
      return;
    }
    if (this.disliked) {
      this.disliked = false;
      this.dislikeState = "thumb_down_off_alt";
      // remove dislike from db
      this.db.updateLivestream(this.livestream.lid, {
        dislikes: firebase.firestore.FieldValue.arrayRemove(this.db.me.uid)
      })
    }
    this.liked = true;
    this.likeState = "thumb_up"
    // add like to db
    this.db.updateLivestream(this.livestream.lid, {
      likes: firebase.firestore.FieldValue.arrayUnion(this.db.me.uid)
    })
    let flag = true;
    this.db.getUser(this.host.uid).notifications?.forEach((notification) => {
      if (flag && notification.lid == this.livestream.lid && notification.uid == this.db.me.uid) {
        flag = false;
      }
    });
    if (flag) {
      this.db.updateUser(this.host.uid, {
        notifications: firebase.firestore.FieldValue.arrayUnion({ uid: this.db.me.uid, isItLike: true, date: new Date().getTime(), hasSeen: false, lid: this.livestream.lid })
      })
    }
  }

  /**
   * dislike the livestream
   */
  dislike() {
    if (this.db?.me == undefined) {
      return
    }
    if (this.disliked) {
      this.disliked = false;
      this.dislikeState = "thumb_down_off_alt";
      // remove dislike from db
      this.db.updateLivestream(this.livestream.lid, {
        dislikes: firebase.firestore.FieldValue.arrayRemove(this.db.me.uid)
      })
      return
    }
    if (this.liked) {
      this.liked = false;
      this.likeState = "thumb_up_off_alt";
      this.db.updateLivestream(this.livestream.lid, {
        likes: firebase.firestore.FieldValue.arrayRemove(this.db.me.uid)
      })
      this.livestream = this.db.getLivestream(this.livestream.lid);
    }
    this.dislikeState = "thumb_down";
    this.disliked = true;
    this.db.updateLivestream(this.livestream.lid, {
      dislikes: firebase.firestore.FieldValue.arrayUnion(this.db.me.uid)
    })

  }
  /**
   * Toggle the mute status of host audio
   */
  ToggleAudio() {
    if (!this.publisher) {
      return;
    }
    if (this.micState === "mic") {
      this.micState = "mic_off"
      this.publisher.publishAudio(false);
    }
    else {
      this.micState = "mic"
      this.publisher.publishAudio(true);
    }
  }

  /**
   * Enable or disable the host video
   */
  ToggleVideo() {
    if (!this.publisher) {
      return;
    }
    if (this.camState === "videocam") {
      this.camState = "videocam_off"
      this.publisher.publishVideo(false);
    }
    else {
      this.camState = "videocam"
      this.publisher.publishVideo(true);
    }
  }

}
