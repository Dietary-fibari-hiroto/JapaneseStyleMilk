import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Button, Grid, Card, CardMedia, CardActions } from '@mui/material';
import { io, Socket } from 'socket.io-client';

const SERVER = "http://localhost:3000";
const socket: Socket = io(SERVER);

const constraints: MediaStreamConstraints = {
  video: true,
  audio: true,
};

const config: RTCConfiguration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

export default function CallConnect() {
  const room = useMemo(() => Math.random().toString(36).substring(2, 10), []);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const [remoteStreamState, setRemoteStreamState] = useState<MediaStream | null>(null);
  const [canCalling, setCanCalling] = useState<boolean>(false);

  const localStream = useRef<MediaStream | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const isStarted = useRef<boolean>(false);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      localStream.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setCanCalling(true);
    });

    const adapterScript = document.createElement('script');
    adapterScript.src = 'https://webrtc.github.io/adapter/adapter-latest.js';
    adapterScript.async = true;
    document.body.appendChild(adapterScript);
    return () => {
      document.body.removeChild(adapterScript);
    };
  }, []);

  useEffect(() => {
    socket.emit("knock", room);

    socket.on("knocked response", (numClients: number, room: string) => {
      if (numClients === 0) socket.emit("create", room);
      else if (numClients === 1) socket.emit("join", room);
    });

    socket.on("created", () => {
      if (!isStarted.current) startConnect();
    });

    socket.on("joined", () => {
      if (!isStarted.current) startConnect();
    });

    socket.on("offer", async (desc: RTCSessionDescriptionInit) => {
      if (!isStarted.current) await startConnect();
      if (!peerConnection.current) return;
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(desc));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit("message", peerConnection.current.localDescription);
    });

    socket.on("answer", async (desc: RTCSessionDescriptionInit) => {
      if (!peerConnection.current) return;
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(desc));
    });

    socket.on("candidate", async (desc: RTCIceCandidateInit) => {
      if (!peerConnection.current) return;
      await peerConnection.current.addIceCandidate(new RTCIceCandidate(desc));
    });

    return () => {
      socket.off();
    };
  }, [room]);

  const startConnect = async () => {
    createPeerConnection();
    if (!peerConnection.current || !localStream.current) return;
    localStream.current.getTracks().forEach((track) => {
      peerConnection.current!.addTrack(track, localStream.current!);
    });
    isStarted.current = true;
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.emit("message", peerConnection.current.localDescription);
  };

  const createPeerConnection = () => {
    peerConnection.current = new RTCPeerConnection(config);

    peerConnection.current.onicecandidate = (e: RTCPeerConnectionIceEvent) => {
      if (e.candidate) {
        socket.emit("message", {
          type: "candidate",
          candidate: e.candidate,
        });
      }
    };

    peerConnection.current.ontrack = (e: RTCTrackEvent) => {
      const [stream] = e.streams;
      setRemoteStreamState(stream);
    };
  };

  useEffect(() => {
    if (remoteStreamState && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStreamState;
    }
  }, [remoteStreamState]);

  const handleCall = () => {
    socket.emit("knock", room);
  };

  return (
    <div style={{ padding: 20 }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6}>
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
        <Grid item xs={12} sm={6}>
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
