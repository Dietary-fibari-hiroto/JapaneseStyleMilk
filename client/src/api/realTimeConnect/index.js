import React from 'react';
import { Button, Grid, Card, CardMedia, CardActions } from '@mui/material';
import socketClient from 'socket.io-client';

const SERVER = "http://localhost:5001";
const socket = socketClient(SERVER);


const constraints = {
  video: false,
  audio: true,
};

const config = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

export default function CallConnect() {
  const room = React.useMemo(() => Math.random().toString(36).substring(2, 10), []);

  const localVideoRef = React.useRef(null);
  const remoteVideoRef = React.useRef(null);

  const [remoteStreamState, setRemoteStreamState] = React.useState(null);
  const [canCalling, setCanCalling] = React.useState(false);

  const localStream = React.useRef(null);
  const peerConnection = React.useRef(null);
  const isStarted = React.useRef(false);

  //初期化
  React.useEffect(() => {
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      localStream.current = stream;
      localVideoRef.current.srcObject = stream;
      setCanCalling(true);
    });
  //WebRTC
    const adapterScript = document.createElement('script');
    adapterScript.src = 'https://webrtc.github.io/adapter/adapter-latest.js';
    adapterScript.async = true;
    document.body.appendChild(adapterScript);
    return () => document.body.removeChild(adapterScript);
  }, []);

  React.useEffect(() => {
    //ルーム人数を確認、入室の判断
    socket.on('knocked response', (numClients, room) => {
      if (numClients === 0) {
        socket.emit('create', room);
      } else if (numClients === 1) {
        socket.emit('join', room);
      } else {
        console.log(`Room [${room}] is full`);
      }
    });

    socket.on('created', () => {
      if (!isStarted.current) startConnect();
    });

    socket.on('joined', () => {
      if (!isStarted.current) startConnect();
    });

    //接続要求
    socket.on('offer', async (desc) => {
      if (!isStarted.current) startConnect();
      await peerConnection.current.setRemoteDescription(desc);
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit('message', peerConnection.current.localDescription);
    });

    socket.on('answer', async (desc) => {
      await peerConnection.current.setRemoteDescription(desc);
    });

    //P2P通信を確立するためICEを追加
    socket.on('candidate', async (desc) => {
      try {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(desc));
      } catch (e) {
        console.error('ICE Error:', e);
      }
    });

    return () => {
      socket.off();
    };
  }, []);

  //接続
  const startConnect = async () => {
    createPeerConnection();
    localStream.current.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, localStream.current);
    });
    isStarted.current = true;
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.emit('message', peerConnection.current.localDescription);
  };



  const createPeerConnection = () => {
    peerConnection.current = new RTCPeerConnection(config);
    peerConnection.current.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit('message', {
          type: 'candidate',
          candidate: e.candidate.candidate,
          sdpMLineIndex: e.candidate.sdpMLineIndex,
        });
      }
    };
    peerConnection.current.ontrack = (e) => {
      const [stream] = e.streams;
      setRemoteStreamState(stream);
    };
  };

  React.useEffect(() => {
    if (remoteStreamState && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStreamState;
    }
  }, [remoteStreamState]);

  const handleCall = () => {
    socket.emit('knock', room);
  };

  return (
    <div style={{ padding: 20 }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <Card sx={{ width: 400 }}>
            <CardMedia
              component="video"
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              sx={{ height: 225 }}
            />
            <CardActions>
              <Button variant="contained" onClick={handleCall} disabled={!canCalling}>
                CALL
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item>
          <Card sx={{ width: 400 }}>
            <CardMedia
              component="video"
              ref={remoteVideoRef}
              autoPlay
              playsInline
              sx={{ height: 225 }}
            />
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}