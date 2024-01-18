import { Platform, PermissionsAndroid } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { RNCallKeep } from 'react-native-callkeep';
import InCallManager from 'react-native-incall-manager';
import { RTCPeerConnection, RTCSessionDescription } from 'react-native-webrtc';

let peerConnection;
let isFront = true;

const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

const createPeerConnection = () => {
  peerConnection = new RTCPeerConnection(configuration);

  // Add event listeners for signaling

  peerConnection.onicecandidate = (event) => {
    // Send the local ICE candidate to the remote peer
    if (event.candidate) {
      // Send the ICE candidate using your preferred signaling method
      console.log('Local ICE candidate:', event.candidate);
    }
  };

  peerConnection.oniceconnectionstatechange = (event) => {
    console.log('ICE connection state change:', event.target.iceConnectionState);
  };

  peerConnection.onaddstream = (event) => {
    // Handle the remote stream (e.g., play it in the UI)
    console.log('Remote stream added:', event.stream);
  };

  // Add your other event listeners as needed

  return peerConnection;
};

export const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    await requestAndroidPermissions();
  } else {
    await requestIOSPermissions();
  }
};

const requestAndroidPermissions = async () => {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);

    if (
      granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
      granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log('Camera and audio permissions granted');
    } else {
      console.log('Camera and audio permissions denied');
    }
  } catch (error) {
    console.error('Error requesting Android permissions:', error.message);
  }
};

const requestIOSPermissions = async () => {
  try {
    const videoPermission = await request(PERMISSIONS.IOS.CAMERA);
    const audioPermission = await request(PERMISSIONS.IOS.MICROPHONE);

    if (videoPermission === RESULTS.GRANTED && audioPermission === RESULTS.GRANTED) {
      console.log('Camera and audio permissions granted');
    } else {
      console.log('Camera and audio permissions denied');
    }
  } catch (error) {
    console.error('Error requesting iOS permissions:', error.message);
  }
};

export const startCall = async (calleeUsername) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

    // Handle the local stream (e.g., display it in the UI)
    console.log('Local stream:', stream);

    // Create a new peer connection
    peerConnection = createPeerConnection();

    // Add the local stream to the peer connection
    peerConnection.addStream(stream);

    // Create an offer and set it as the local description
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

    // Send the offer to the remote peer using your preferred signaling method
    console.log('Local offer:', offer);

    // Display the call UI
    RNCallKeep.displayIncomingCall('1', calleeUsername, 'Generic', 'number', true);

    // Start the in-call manager
    InCallManager.start({ media: 'audio', auto: true });

    // Set the call active
    RNCallKeep.setCurrentCallActive('1');
  } catch (error) {
    console.error('Error starting call:', error.message);
  }
};

export const endCall = () => {
  try {
    // Close the peer connection
    if (peerConnection) {
      peerConnection.close();
      peerConnection = null;
    }

    // Stop the in-call manager
    InCallManager.stop();

    // End the call using your preferred signaling method
    console.log('Call ended');

    // Set the call inactive
    RNCallKeep.endCall('1');
  } catch (error) {
    console.error('Error ending call:', error.message);
  }
};
