// Chat.tsx
import { useRef } from 'react';

import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
// Chat.tsx に追記


const socket: Socket = io('http://localhost:5500');//接続するサーバー

const Chat: React.FC = () => {
  const [myId, setMyId] = useState('');
  const [peerId, setPeerId] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  const [matchFound, setMatchFound] = useState<boolean>(false);
  const [matchedUser, setMatchedUser] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);


  const handleFindMatch = () => {
    if(socket) {
      socket.emit('findMatch');
    }
  };

  useEffect(() => {
    if(socket) {
        socket.on('matchFound', (matchedUser: string) => {
          setMatchFound(true);
          setMatchedUser(matchedUser);
          setPeerId(matchedUser); //即チャットできるようになる

          startCall(matchedUser);
        });
      }
    const startCall = async (targetPeerId: string) => {
  const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  setStream(localStream);

  const peer = new RTCPeerConnection();
  peerRef.current = peer;

  localStream.getTracks().forEach((track) => {
    peer.addTrack(track, localStream);
  });

  peer.ontrack = (event) => {
    setRemoteStream(new MediaStream(event.streams[0].getTracks()));
  };

  peer.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('ice-candidate', {
        to: peerId,
        candidate: event.candidate,
      });
    }
  };

  // offer を作る
  const offer = await peer.createOffer();
  await peer.setLocalDescription(offer);

  socket.emit('offer', {
    to: peerId,
    offer,
  });
};

    //自分のsocketIdを受け取る
    socket.on('connect', () => {
      if (socket.id) {
        setMyId(socket.id);
      }
    });
    socket.on('offer', async ({ from, offer }) => {
  const peer = new RTCPeerConnection();
  peerRef.current = peer;

  const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  setStream(localStream);
  localStream.getTracks().forEach((track) => {
    peer.addTrack(track, localStream);
  });

  peer.ontrack = (event) => {
    setRemoteStream(new MediaStream(event.streams[0].getTracks()));
  };

  peer.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('ice-candidate', {
        to: from,
        candidate: event.candidate,
      });
    }
  };

  await peer.setRemoteDescription(offer);
  const answer = await peer.createAnswer();
  await peer.setLocalDescription(answer);

  socket.emit('answer', {
    to: from,
    answer,
  });
});

socket.on('answer', async ({ answer }) => {
  await peerRef.current?.setRemoteDescription(answer);
});

socket.on('ice-candidate', async ({ candidate }) => {
  await peerRef.current?.addIceCandidate(candidate);
});



    socket.on('private-message', ({ from, message }) => {
      setMessages((prev) => [...prev, `From ${from}: ${message}`]);
    });

    return () => {
      socket.off('connect');
      socket.off('private-message');
    };

  }, []);

  const sendMessage = () => {
    socket.emit('private-message', { to: peerId.trim(), message });
    setMessages((prev) => [...prev, `To ${peerId}: ${message}`]);
    setMessage('');
  };

  return (
    <div style={{ padding: 20 }}>
      <div>
      {!matchFound ? (
        <button onClick={handleFindMatch}>Find Match</button>
      ) : (
        <p>Match Found with: {matchedUser}</p>
      )}
    </div>
    <div>
  <h4>Local Video</h4>
  <video autoPlay playsInline muted ref={video => {
    if (video && stream) {
      video.srcObject = stream;
    }
  }} width={200} height={150} />

  <h4>Remote Video</h4>
  <video autoPlay playsInline ref={video => {
    if (video && remoteStream) {
      video.srcObject = remoteStream;
    }
  }} width={200} height={150} />
</div>

    
      <h3>My Socket ID: {myId}</h3>

      <br />

      <input
        type="text"
        placeholder="メッセージを入力"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: 300, marginRight: 10 }}
      />
      <button onClick={sendMessage}>送信</button>

      <div style={{ marginTop: 20 }}>
        <h4>チャットログ</h4>
        <div
          style={{
            border: '1px solid #ccc',
            padding: 10,
            width: 400,
            height: 200,
            overflowY: 'scroll',
            whiteSpace: 'pre-wrap',
          }}
        >
          {messages.length === 0 ? (
            <p>メッセージはありません</p>
          ) : (
            messages.map((msg, idx) => <div key={idx}>{msg}</div>)
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
