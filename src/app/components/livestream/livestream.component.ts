// /**
//  * --------------------------
//  * SERVER-SIDE RESPONSIBILITY
//  * --------------------------
//  * This method retrieve the mandatory user token from OpenVidu Server,
//  * in this case making use Angular http API.
//  * This behavior MUST BE IN YOUR SERVER-SIDE IN PRODUCTION. In this case:
//  *   1) Initialize a Session in OpenVidu Server	(POST /openvidu/api/sessions)
//  *   2) Create a Connection in OpenVidu Server (POST /openvidu/api/sessions/<SESSION_ID>/connection)
//  *   3) The Connection.token must be consumed in Session.connect() method
//  */

// import { Component, OnInit, ViewChild } from '@angular/core';
// import { throwError as observableThrowError } from 'rxjs';
// import { catchError } from 'rxjs/operators';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import {OpenviduSessionComponent, StreamEvent, Session, UserModel, OpenViduLayout, OvSettings, OpenViduLayoutOptions, SessionDisconnectedEvent, Publisher} from 'openvidu-angular';

// @Component({
//   selector: 'app-livestream',
//   templateUrl: './livestream.component.html',
//   styleUrls: ['./livestream.component.css'],
// })
// export class LivestreamComponent implements OnInit {



//   // Join form
//   mySessionId = 'SessionA';
//   myUserName = 'Participant' + Math.floor(Math.random() * 100);
//   tokens: string[] = [];
//   session = false;

//   ovSession: Session;
//   ovLocalUsers: UserModel[];
//   ovLayout: OpenViduLayout;
//   ovLayoutOptions: OpenViduLayoutOptions;

//   @ViewChild('ovSessionComponent')
//   public ovSessionComponent: OpenviduSessionComponent;

//   constructor(private httpClient: HttpClient) { 

//   }


//   async joinSession() {
//     const token1 = await this.getToken();
//     const token2 = await this.getToken();
//     this.tokens.push(token1, token2);
//     this.session = true;
//   }
//   ngOnInit(): void {
//     this.joinSession()
//   }

//   handlerSessionCreatedEvent(session: Session): void {

//     // You can see the session documentation here
//     // https://docs.openvidu.io/en/stable/api/openvidu-browser/classes/session.html

//     console.log('SESSION CREATED EVENT', session);

//     session.on('streamCreated', (event: StreamEvent) => {
//       // Do something
//     });

//     session.on('streamDestroyed', (event: StreamEvent) => {
//       // Do something
//     });

//     session.on('sessionDisconnected', (event: SessionDisconnectedEvent) => {
//       this.session = false;
//       this.tokens = [];
//     });

//     this.myMethod();

//   }

//   handlerPublisherCreatedEvent(publisher: Publisher) {

//     // You can see the publisher documentation here
//     // https://docs.openvidu.io/en/stable/api/openvidu-browser/classes/publisher.html

//     publisher.on('streamCreated', (e) => {
//       console.log('Publisher streamCreated', e);
//     });

//   }

//   handlerErrorEvent(event): void {
//     // Do something
//   }

//   myMethod() {
//     this.ovLocalUsers = this.ovSessionComponent.getLocalUsers();
//     this.ovLayout = this.ovSessionComponent.getOpenviduLayout();
//     this.ovLayoutOptions = this.ovSessionComponent.getOpenviduLayoutOptions();
//   }

//   /**
//    * --------------------------
//    * SERVER-SIDE RESPONSIBILITY
//    * --------------------------
//    * This method retrieve the mandatory user token from OpenVidu Server,
//    * in this case making use Angular http API.
//    * This behavior MUST BE IN YOUR SERVER-SIDE IN PRODUCTION. In this case:
//    *   1) Initialize a Session in OpenVidu Server	(POST /openvidu/api/sessions)
//    *   2) Create a Connection in OpenVidu Server (POST /openvidu/api/sessions/<SESSION_ID>/connection)
//    *   3) The Connection.token must be consumed in Session.connect() method
//    */

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { OpenVidu, Session, SignalOptions } from 'openvidu-angular';
import { throwError as observableThrowError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-livestream',
  templateUrl: './livestream.component.html',
  styleUrls: ['./livestream.component.css'],
})

export class LivestreamComponent implements OnInit {
  OPENVIDU_SERVER_URL = 'https://' + location.hostname + ':4443';
  OPENVIDU_SERVER_SECRET = 'MY_SECRET';
  constructor(private httpClient: HttpClient) { }
  OV: OpenVidu;
  session: Session;

  sessionName: string = 's3';	// Name of the video session the user will connect to
  token: string;
  ngOnInit() { }
  // Token retrieved from OpenVidu Server


  /* OPENVIDU METHODS */

  joinSession() {
    this.getToken((token) => {

      // --- 1) Get an OpenVidu object ---

      this.OV = new OpenVidu();

      // --- 2) Init a session ---

      this.session = this.OV.initSession();

      //chat 
      this.session.on('signal:chat', (event: any) => {
        console.log(event.data)
      })


      // --- 3) Specify the actions when events take place in the session ---

      // On every new Stream received...
      this.session.on('streamCreated', (event: any) => {

        // Subscribe to the Stream to receive it
        // HTML video will be appended to element with 'video-container' id
        var subscriber = this.session.subscribe(event.stream, 'video-container');

        // When the HTML video has been appended to DOM...
        subscriber.on('videoElementCreated', (event: any) => {

          // Add a new HTML element for the user's name and nickname over its video

          this.appendUserData(event.element, subscriber.stream.connection);
        });
      });

      // On every Stream destroyed...
      this.session.on('streamDestroyed', (event: any) => {
        // Delete the HTML element with the user's name and nickname
        this.removeUserData(event.stream.connection);
      });

      // --- 4) Connect to the session passing the retrieved token and some more data from
      //        the client (in this case a JSON with the nickname chosen by the user) ---

      var nickName = $("#nickName").val();
      this.session.connect(token, { clientData: nickName })
        .then(() => {

          // --- 5) Set page layout for active call ---

          var userName = $("#user").val();
          $('#session-title').text(this.sessionName);
          $('#join').hide();
          $('#session').show();


          // Here we check somehow if the user has 'PUBLISHER' role before
          // trying to publish its stream. Even if someone modified the client's code and
          // published the stream, it wouldn't work if the token sent in Session.connect
          // method is not recognized as 'PUBLIHSER' role by OpenVidu Server
          if (this.isPublisher(userName)) {

            // --- 6) Get your own camera stream ---

            var publisher = this.OV.initPublisher('video-container', {
              audioSource: undefined, // The source of audio. If undefined default microphone
              videoSource: undefined, // The source of video. If undefined default webcam
              publishAudio: true,  	// Whether you want to start publishing with your audio unmuted or not
              publishVideo: true,  	// Whether you want to start publishing with your video enabled or not
              resolution: '640x480',  // The resolution of your video
              frameRate: 30,			// The frame rate of your video
              insertMode: 'APPEND',	// How the video is inserted in the target element 'video-container'
              mirror: false       	// Whether to mirror your local video or not
            });

            // --- 7) Specify the actions when events take place in our publisher ---

            // When our HTML video has been added to DOM...
            publisher.on('videoElementCreated', (event: any) => {
              // Init the main video with ours and append our data
              var userData = {
                nickName: nickName,
                userName: userName
              };
              this.initMainVideo(event.element, userData);
              this.appendUserData(event.element, userData);
              $(event.element).prop('muted', true); // Mute local video
            });


            // --- 8) Publish your stream ---

            this.session.publish(publisher);

          } else {
            console.warn('You don\'t have permissions to publish');
            this.initMainVideoThumbnail(); // Show SUBSCRIBER message in main video
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

    this.session.disconnect();
    this.session = null;

    // Removing all HTML elements with the user's nicknames
    this.cleanSessionView();

    $('#join').show();
    $('#session').hide();
  }

  /* OPENVIDU METHODS */



  /* APPLICATION REST METHODS */

  logIn() {
    var user: string = $("#user").val().toString(); // Username
    var pass = $("#pass").val(); // Password

    // httpPostRequest(
    //   'api-login/login',
    //   { user: user, pass: pass },
    //   'Login WRONG',
    //   (response) => {
    $("#name-user").text(user);
    $("#not-logged").hide();
    $("#logged").show();
    // Random nickName and session
    $("#sessionName").val("Session " + Math.floor(Math.random() * 10));
    $("#nickName").val("Participant " + Math.floor(Math.random() * 100));
    //   }
    // );
  }

  logOut() {
    this.httpPostRequest(
      'api-login/logout',
      {},
      'Logout WRONG',
      (response) => {
        $("#not-logged").show();
        $("#logged").hide();
      }
    );
  }

  //  getToken(callback) {
  //   this.sessionName = $("#sessionName").val().toString(); // Video-call chosen by the user

  //   this.httpPostRequest(
  //     'api-sessions/get-token',
  //     { sessionName: this.sessionName },
  //     'Request of TOKEN gone WRONG:',
  //     (response) => {
  //       this.token = response[0]; // Get token from response
  //       console.warn('Request of TOKEN gone WELL (TOKEN:' +this.token + ')');
  //       callback(this.token); // Continue the join operation
  //     }
  //   );
  // }

  removeUser() {
    this.httpPostRequest(
      'api-sessions/remove-user',
      { sessionName: this.sessionName, token: this.token },
      'User couldn\'t be removed from session',
      (response) => {
        console.warn("You have been removed from session " + this.sessionName);
      }
    );
  }

  httpPostRequest(url, body, errorMsg, callback) {
    var http = new XMLHttpRequest();
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/json');
    http.addEventListener('readystatechange', processRequest, false);
    http.send(JSON.stringify(body));

    function processRequest() {
      if (http.readyState == 4) {
        if (http.status == 200) {
          try {
            callback(JSON.parse(http.responseText));
          } catch (e) {
            callback();
          }
        } else {
          console.warn(errorMsg);
          console.warn(http.responseText);
        }
      }
    }
  }

  /* APPLICATION REST METHODS */



  /* APPLICATION BROWSER METHODS */
  @HostListener('window:onbeforeunload', ['$event'])
  onUnloadHandeler() { // Gracefully leave session
    if (this.session) {
      this.removeUser();
      this.leaveSession();
    }
    this.logOut();
  }

  appendUserData(videoElement, connection) {
    var clientData;// = 'CD ' + Math.floor(Math.random() * 100);
    var serverData;// = 'SD ' + Math.floor(Math.random() * 100);
    var nodeId;// = 'NI' + Math.floor(Math.random() * 100);
    if (connection.nickName) { // Appending local video data
      clientData = connection.nickName;
      serverData = connection.userName;
      nodeId = 'main-videodata';
    } else {
      try{
      nodeId = connection.connectionId;
      clientData =JSON.parse(connection.data.split('%/%')[0]).clientData;
      serverData =JSON.parse(connection.data.split('%/%')[1]).serverData;
    }catch(e){
      console.error(e);
    }
    }
    var dataNode = document.createElement('div');
    dataNode.className = "data-node";
    dataNode.id = "data-" + nodeId;
    dataNode.innerHTML = "<p class='nickName'>" + clientData + "</p><p class='userName'>" + serverData + "</p>";
    videoElement.parentNode.insertBefore(dataNode, videoElement.nextSibling);
    this.addClickListener(videoElement, clientData, serverData);
  }

  removeUserData(connection) {
    var userNameRemoved = $("#data-" + connection.connectionId);
    if ($(userNameRemoved).find('p.userName').html() === $('#main-video p.userName').html()) {
      this.cleanMainVideo(); // The participant focused in the main video has left
    }
    $("#data-" + connection.connectionId).remove();
  }

  removeAllUserData() {
    $(".data-node").remove();
  }

  cleanMainVideo() {
    (<HTMLVideoElement>$('#main-video video').get(0)).srcObject = null;
    $('#main-video p').each(function () {
      $(this).html('');
    });
  }

  addClickListener(videoElement, clientData, serverData) {
    videoElement.addEventListener('click', function () {
      var mainVideo = <HTMLVideoElement>$('#main-video video').get(0);
      if (mainVideo.srcObject !== videoElement.srcObject) {
        $('#main-video').fadeOut("fast", () => {
          $('#main-video p.nickName').html(clientData);
          $('#main-video p.userName').html(serverData);
          mainVideo.srcObject = videoElement.srcObject;
          $('#main-video').fadeIn("fast");
        });
      }
    });
  }

  initMainVideo(videoElement, userData) {
    (<HTMLVideoElement>$('#main-video video').get(0)).srcObject = videoElement.srcObject;
    $('#main-video p.nickName').html(userData.nickName);
    $('#main-video p.userName').html(userData.userName);
    $('#main-video video').prop('muted', true);
  }

  initMainVideoThumbnail() {
    $('#main-video video').css("background", "url('images/subscriber-msg.jpg') round");
  }

  isPublisher(userName) {
    return userName.includes('publisher');
  }

  cleanSessionView() {
    this.removeAllUserData();
    this.cleanMainVideo();
    $('#main-video video').css("background", "");
  }

  //   /* APPLICATION BROWSER METHODS */

  getToken(callback) {
    return this.createSession(this.sessionName).then((sessionId) => {
      this.createToken(sessionId).then((token) => {
        callback(token)
      })
    });
  }

  createSession(sessionId) {
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
            reject(error);
            return observableThrowError(error);
          }),
        )
        .subscribe((response) => {
          console.log(response);
          resolve(response['token']);
        });
    });
  }

  sendMessage(message) {
    var so: SignalOptions = { type: 'chat', data: message }
    this.session.signal(so)
  }
}