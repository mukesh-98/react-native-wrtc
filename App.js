import {View, Text, Button} from 'react-native';
import React, {useEffect, useState, useCallback, useRef} from 'react';
import io from 'socket.io-client';

import {token} from './token';

import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals,
} from 'react-native-webrtc';

const configuration = {
  iceServers: [
    {urls: ['stun:bn-turn1.xirsys.com']},
    {
      username:
        'OcBSZfFTJleQqUKJOKh-6y7vHJDso4yFIIGiUPzgX4GqPTMsZYPKJ-DzMMrhHXy4AAAAAGE_QvxoaXJlbnBhdGVsaHM=',
      credential: '8a7046e8-148d-11ec-9808-0242ac140004',
      urls: [
        'turn:bn-turn1.xirsys.com:80?transport=udp',
        'turn:bn-turn1.xirsys.com:3478?transport=udp',
        'turn:bn-turn1.xirsys.com:80?transport=tcp',
        'turn:bn-turn1.xirsys.com:3478?transport=tcp',
        'turns:bn-turn1.xirsys.com:443?transport=tcp',
        'turns:bn-turn1.xirsys.com:5349?transport=tcp',
      ],
    },
  ],
};
const pc = new RTCPeerConnection(configuration);

const SOCKET_URL = 'https://message.banjee.org';

const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  forceNew: true,
  reconnection: true,
});

export default function App() {
  const [myStream, setMyStream] = useState(null);

  const goOnline = () => {
    socket.on('AUTH', sessionId => {
      console.log('Socket Session Id ', sessionId);
      socket.emit('LOGIN', {token, sessionId});
      socket.emit('ONLINE_RECEIVE', '6176b3a771748e095f9a2d2a');
    });
  };

  useEffect(() => {
    socket.on('connect', () => {
      goOnline();
    });

    socket.on('connect_error', err => {
      console.log('Connection Error ', JSON.stringify(err));
    });

    let isFront = true;
    mediaDevices.enumerateDevices().then(sourceInfos => {
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (
          sourceInfo.kind == 'videoinput' &&
          sourceInfo.facing == (isFront ? 'front' : 'environment')
        ) {
          videoSourceId = sourceInfo.deviceId;
        }
      }
      mediaDevices
        .getUserMedia({
          audio: true,
          video: {
            width: 640,
            height: 480,
            frameRate: 30,
            facingMode: isFront ? 'user' : 'environment',
            deviceId: videoSourceId,
          },
        })
        .then(stream => {
          // Got stream!
          setMyStream(stream);
          pc.addStream(stream);
        })
        .catch(error => {
          // Log error
          console.log('Media Error ', error);
        });
    });

    socket.on('READY', data => {
      console.log('READY --------------> ', data);
      console.log(data);
      pc.createOffer()
        .then(offer => {
          console.log('Offer ', offer);
          socket.emit('SIGNALLING_SERVER', {
            roomId: '619cd56c771c69696118b75f',
            fromUserId: '6176b3a771748e095f9a2d2a',
            initiator: {
              lastName: null,
              userName: null,
              mobile: null,
              mcc: null,
              type: null,
              authorities: null,
              externalReferenceId: null,
              firstName: 'jignesh13',
              domain: '208991',
              id: '6176b3a771748e095f9a2d2a',
              userType: 0,
              email: null,
              domainSsid: null,
              locale: null,
              timeZoneId: null,
              profileImageUrl: null,
              avtarImageUrl: '6152ad4063f6a40a07c65f76',
              realm: null,
            },
            toUserId: '619cd4fc3fb9cb741a6d7d8f',
            targetUser: {
              lastName: null,
              userName: null,
              mobile: null,
              mcc: null,
              type: null,
              authorities: null,
              externalReferenceId: null,
              firstName: 'vicky',
              domain: '208991',
              id: '619cd4fc3fb9cb741a6d7d8f',
              userType: 0,
              email: null,
              domainSsid: null,
              locale: null,
              timeZoneId: null,
              profileImageUrl: null,
              avtarImageUrl: null,
              realm: null,
            },
            eventType: 'OFFER',
            iceCandidate: null,
            offer: offer.sdp,
            answer: null,
            mediaStream: null,
            responseMessage: 'Room Joined',
            callDuration: '00',
            callType: 'Video',
            groupName: null,
            toAvatarSrc: null,
            groupMemberCounts: 0,
            groupCreatorId: null,
            addToCall: false,
          });
        })
        .catch(err => {
          console.log('Create Offer ', err);
        });
    });
    socket.on('ANSWER', answer => {
      console.log('Answer --------------> ', answer);
      // pc.setRemoteDescription(answer);
    });
  }, [socket]);

  console.log('Socket Connected ', socket.connected);

  const callInitate = () => {
    socket.emit('SIGNALLING_SERVER', {
      roomId: '619cd56c771c69696118b75f',
      fromUserId: '6176b3a771748e095f9a2d2a',
      initiator: {
        lastName: null,
        userName: null,
        mobile: null,
        mcc: null,
        type: null,
        authorities: null,
        externalReferenceId: null,
        firstName: 'jignesh13',
        domain: '208991',
        id: '6176b3a771748e095f9a2d2a',
        userType: 0,
        email: null,
        domainSsid: null,
        locale: null,
        timeZoneId: null,
        profileImageUrl: null,
        avtarImageUrl: '6152ad4063f6a40a07c65f76',
        realm: null,
      },
      toUserId: '619cd4fc3fb9cb741a6d7d8f',
      targetUser: {
        lastName: null,
        userName: null,
        mobile: null,
        mcc: null,
        type: null,
        authorities: null,
        externalReferenceId: null,
        firstName: 'vicky',
        domain: '208991',
        id: '619cd4fc3fb9cb741a6d7d8f',
        userType: 0,
        email: null,
        domainSsid: null,
        locale: null,
        timeZoneId: null,
        profileImageUrl: null,
        avtarImageUrl: null,
        realm: null,
      },
      eventType: 'JOIN',
      iceCandidate: null,
      offer: null,
      answer: null,
      mediaStream: null,
      responseMessage: 'Room Joined',
      callDuration: '00',
      callType: 'Video',
      groupName: null,
      toAvatarSrc: null,
      groupMemberCounts: 0,
      groupCreatorId: null,
      addToCall: false,
    });
  };

  console.log(socket.connected);

  const callDisconnect = () => {
    socket.emit('DISCONNECT', {
      roomId: '619cd56c771c69696118b75f',
      fromUserId: '6176b3a771748e095f9a2d2a',
      initiator: {
        lastName: null,
        userName: null,
        mobile: null,
        mcc: null,
        type: null,
        authorities: null,
        externalReferenceId: null,
        firstName: 'jignesh13',
        domain: '208991',
        id: '6176b3a771748e095f9a2d2a',
        userType: 0,
        email: null,
        domainSsid: null,
        locale: null,
        timeZoneId: null,
        profileImageUrl: null,
        avtarImageUrl: '6152ad4063f6a40a07c65f76',
        realm: null,
      },
      toUserId: '619cd4fc3fb9cb741a6d7d8f',
      targetUser: {
        lastName: null,
        userName: null,
        mobile: null,
        mcc: null,
        type: null,
        authorities: null,
        externalReferenceId: null,
        firstName: 'vicky',
        domain: '208991',
        id: '619cd4fc3fb9cb741a6d7d8f',
        userType: 0,
        email: null,
        domainSsid: null,
        locale: null,
        timeZoneId: null,
        profileImageUrl: null,
        avtarImageUrl: null,
        realm: null,
      },
      eventType: 'DISCONNECT',
      iceCandidate: null,
      offer: null,
      answer: null,
      mediaStream: null,
      responseMessage: 'Room Joined',
      callDuration: '00',
      callType: 'Video',
      groupName: null,
      toAvatarSrc: null,
      groupMemberCounts: 0,
      groupCreatorId: null,
      addToCall: false,
    });
  };
  return (
    <View>
      <Button title={'Call'} onPress={callInitate} />
      <Button title={'Disconnect'} onPress={callDisconnect} />

      {myStream && (
        <RTCView
          streamURL={myStream.toURL()}
          style={{
            width: '100%',
            height: '50%',
          }}
        />
      )}
    </View>
  );
}
