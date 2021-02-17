const IA = (video, id) => {
  const happyContainer = document.getElementById("happy");
  const happyCounter = document.getElementById("happy-counter");
  let predictedAges = [];

  Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    faceapi.nets.ageGenderNet.loadFromUri("/models"),
  ]).then(main);

  function main() {
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(video, displaySize);

    setInterval(async () => {
      const detections = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender()
        .withFaceDescriptor();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      const happy = Math.round(detections.expressions.happy * 100 * 100) / 100;
      console.log(detections.expressions.happy);

      if (detections.expressions.happy === 1) {
        console.log(detections.expressions.happy);
        window.loser(id);
      }

      // happyContainer.style.height = `${detections.expressions.happy * 100}px`;
      // happyCounter.textContent = `${happy}%`;

      // if (detections.expressions.happy >= 1)
      //   happyContainer.style.backgroundColor = "green";

      // faceapi.drawDetection(canvas, detections, { withScore: false });
      /// faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      /// faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
      // const age = resizedDetections[0].age;
      // const interpolatedAge = interpolateAgePredictions(age);
      // const bottomRight = {
      //   x: resizedDetections[0].detection.box.bottomRight.x - 50,
      //   y: resizedDetections[0].detection.box.bottomRight.y,
      // };

      // new faceapi.draw.DrawTextField(
      //   [`${faceapi.utils.round(interpolatedAge, 0)} years`],
      //   bottomRight
      // ).draw(canvas);
    }, 1000);
  }

  // function interpolateAgePredictions(age) {
  //   predictedAges = [age].concat(predictedAges).slice(0, 30);
  //   const avgPredictedAge =
  //     predictedAges.reduce((total, a) => total + a) / predictedAges.length;
  //   return avgPredictedAge;
  // }
};
