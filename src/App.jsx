import React, { useRef, useEffect } from "react";
import * as faceapi from "face-api.js";

function App() {
	const videoRef = useRef();
	const canvasRef = useRef();

	//LOAD FROM USE EFFECT
	useEffect(() => {
		startVideo();
		videoRef && loadModels();
	}, []);

	// OPEN YOUR WEB CAM FACE
	const startVideo = () => {
		navigator.mediaDevices
			.getUserMedia({ video: true })
			.then((currentStream) => {
				videoRef.current.srcObject = currentStream;
			})
			.catch((err) => {
				console.log(err);
			});
	};
	//  LOAD MODELS FROM FACE API
	const loadModels = () => {
		Promise.all([
			faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
			faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
			faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
			faceapi.nets.faceExpressionNet.loadFromUri("/models"),
		]).then(() => {
			faceMyDetect();
		});
	};

	const faceMyDetect = () => {
		setInterval(async () => {
			const detections = await faceapi
				.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
				.withFaceLandmarks()
				.withFaceExpressions();
			//DRAW YOU FACE IN WEBCAM
			canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
				videoRef.current
			);
			faceapi.matchDimensions(canvasRef.current, {
				width: 940,
				height: 650,
			});
			const resized = faceapi.resizeResults(detections, {
				width: 940,
				height: 650,
			});

			faceapi.draw.drawDetections(canvasRef.current, resized);
			faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
			faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
		}, 1000);
	};

	return (
		<div className="my-app">
			<h1>Face Detection </h1>
			<div className="appvide">
				<video crossOrigin="anonymous" ref={videoRef} autoPlay></video>
			</div>
			<canvas ref={canvasRef} width="940" height="650" className="appcanvas" />
		</div>
	);
}
export default App;
