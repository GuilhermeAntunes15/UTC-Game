let call, videoStream, myId;

const peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "3001",
});

const peers = {};

var { getUserMedia } = navigator;

getUserMedia({ video: true, audio: true }, function (stream) {
  videoStream = stream;
  createNewVideo(stream, true, 1); /// Video da pessoa 1
});

peer.on("call", function (call) {
  getUserMedia({ video: true, audio: true }, function (stream) {
    call.answer(stream); // Answer the call with an A/V stream.
    call.on("stream", function (remoteStream) {
      console.log("AAA");
      createNewVideo(remoteStream, true, 2); /// Video da pessoa 1 pra pessoa 2
    });
  });
});

peer.on("open", (id) => {
  myId = id;
  socket.emit("join-room", ROOM_ID, id);
});

socket.on("user-connected", (userId) => {
  console.log({ userId, myId });
  if (userId === myId) return;
  connectToNewUser(userId, videoStream);
  window.jog1 = myId;
  window.jog2 = userId;
  window.gameStart();
});

async function connectToNewUser(userId, stream) {
  call = await peer.call(userId, stream);
  call.on("stream", (remoteStream) => {
    console.log(remoteStream);
    createNewVideo(remoteStream, true, 3);
  });
}

function createNewVideo(remoteStream, mute, index) {
  console.log(index);
  if (peers[remoteStream.id]) return;

  peers[remoteStream.id] = remoteStream.id;

  const newVideo = document.createElement("video");

  newVideo.srcObject = remoteStream;
  newVideo.muted = mute;
  newVideo.height = "500";
  newVideo.width = "700";

  const p1 = document.querySelector("#player1");
  const p2 = document.querySelector("#player2");
  const bt = document.querySelector("#btn");

  if (index === 1) {
    IA(newVideo, myId);
    p1.innerHTML = `<img class="load" src="img/load.png" style="width: 100px; height: 100px">`;
  } else {
    p2.innerHTML = `<img class="load" src="img/load.png" style="width: 100px; height: 100px">`;
  }

  if (window.jog1 == myId) {
    bt.innerHTML = `<button
        class="btn btn-primary"
        role="button"
        style="background: rgb(243,165,81) !important;font-size: 21px;"
      >
        Play
      </button>`;
  }

  newVideo.addEventListener("loadedmetadata", () => {
    newVideo.play();
    if (index === 1) {
      p1.innerHTML = "";
      p1.appendChild(newVideo);
    } else {
      p2.innerHTML = "";
      p2.appendChild(newVideo);
    }
  });
}
