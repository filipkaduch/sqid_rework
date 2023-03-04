// TODO: file cleanup & enable eslint
/* eslint-disable */
const VideoRecorder = {
	_data: null,
	_panel: null,
	_canvas: null,
	_video: null,
	_mediaStream: null,
	_videoTrack: null,
	_videoSettings: null,
	_mimeType: null,
	_recorder: null,

	_isInitialized: false,
	_isStarted: false,
	_isRecording: false,

	_frameNumber: 0,

	_browser: () => {
		const test = (regexp) => regexp.test(window.navigator.userAgent);
		if (test(/edg/i)) {
			VideoRecorder._isEdge = true;
		} else if (test(/opr/i) && (Boolean(window.opr) || Boolean(window.opera))) {
			VideoRecorder._isOpera = true;
		} else if (test(/chrome/i) && Boolean(window.chrome)) {
			VideoRecorder._isChrome = true;
		} else if (test(/trident/i)) {
			VideoRecorder._isIE = true;
		} else if (test(/firefox/i)) {
			VideoRecorder._isFirefox = true;
		} else if (test(/safari/i)) {
			VideoRecorder._isSafari = true;
		}
		// Default: return "other";
	},

	_IsChrome: false,
	_IsFirefox: false,
	_IsOpera: false,
	_IsSafari: false,
	_IsIE: false,
	_IsEdge: false,

	_GetPosition: () => {
		// Caution! development tools panel have to be closed!!!
		const borderSize = (window.outerWidth - window.innerWidth) / 2;
		const elRect = VideoRecorder._panel.getBoundingClientRect();
		const dpr = window.devicePixelRatio;
		let position = {};

		/*
		 *Chrome: tab capturing needs to be selected !!!
		 *Firefox: firefox window capturing needs to be selected !!!
		 */
		if (VideoRecorder._isFirefox) {
			position = {
				pageX: borderSize + window.screenX,
				pageY: window.outerHeight - window.innerHeight - borderSize + window.screenY,
				pageWidth: window.innerWidth,
				pageHeight: window.innerHeight,
				elX: elRect.x,
				elY: elRect.y,
				elWidth: elRect.width,
				elHeight: elRect.height
			};
			position.captureX = (position.elX + position.pageX - window.screenX) * dpr;
			position.captureY = (position.elY + position.pageY - window.screenY) * dpr;
			position.captureWidth = elRect.width * dpr;
			position.captureHeight = elRect.height * dpr;
		} else if (VideoRecorder._isChrome || VideoRecorder._isOpera || VideoRecorder._isEdge) {
			position = {
				pageX: 0,
				pageY: 0,
				pageWidth: window.innerWidth,
				pageHeight: window.innerHeight,
				elX: elRect.x,
				elY: elRect.y,
				elWidth: elRect.width,
				elHeight: elRect.height
			};
			position.captureX = elRect.x;
			position.captureY = elRect.y;
			position.captureWidth = elRect.width;
			position.captureHeight = elRect.height;
		}

		return position;
	},
	_Capture: () => {
		if (VideoRecorder._isRecording) {
			window.requestAnimationFrame(VideoRecorder._Capture);
		}

		const pos = VideoRecorder._GetPosition(VideoRecorder._panel);

		VideoRecorder._frameNumber += 1;

		VideoRecorder._canvas.getContext('2d')
			.drawImage(VideoRecorder._video, -pos.captureX, -pos.captureY);
	},

	initialize: (panel, mimeType, canvas) => {
		if (VideoRecorder._isInitialized) {
			return new Promise((resolve, reject) => {
				reject('Video recorder is already initialized!');
			});
		}

		VideoRecorder._browser();
		VideoRecorder._data = [];
		if (typeof mimeType === 'undefined') {
			mimeType = 'video/webm;codecs=vp8';
		}
		VideoRecorder._panel = panel;
		VideoRecorder._video = document.createElement('video');
		VideoRecorder._canvas = (canvas === undefined ? document.createElement('canvas') : canvas);
		VideoRecorder._mimeType = mimeType;

		return new Promise((resolve, reject) => {
			if (panel) {
				navigator.mediaDevices.getDisplayMedia({})
					.then((mediaStream) => {
						VideoRecorder._mediaStream = mediaStream;

						VideoRecorder._videoTrack = VideoRecorder._mediaStream.getVideoTracks()[0];
						VideoRecorder._videoSettings = VideoRecorder._videoTrack.getSettings();

						const pos = VideoRecorder._GetPosition(VideoRecorder._panel);

						VideoRecorder._canvas.width = pos.captureWidth;
						VideoRecorder._canvas.height = pos.captureHeight;

						// To help initialize canvas
						const ctx = VideoRecorder._canvas.getContext('2d');

						if (MediaRecorder.isTypeSupported(mimeType)) {
							VideoRecorder._recorder = new MediaRecorder(VideoRecorder._canvas.captureStream(VideoRecorder._videoSettings.frameRate), {mimeType: VideoRecorder._mimeType});
						} else {
							VideoRecorder._recorder = new MediaRecorder(VideoRecorder._canvas.captureStream(VideoRecorder._videoSettings.frameRate));
						}

						VideoRecorder._recorder.ondataavailable = (e) => VideoRecorder._data.push(e.data);
						VideoRecorder._recorder.onerror = (e) => console.error(e.name);

						VideoRecorder._isInitialized = true;

						resolve(VideoRecorder._recorder);
					})
					.catch((error) => {
						VideoRecorder._mediaStream = null;
						reject(error);
					});
			} else {
				reject('Video recorder panel element not specified.');
			}
		});
	},
	start: () => {
		VideoRecorder._data = [];

		return new Promise((resolve, reject) => {
			if (VideoRecorder._isInitialized) {
				if (!VideoRecorder._isStarted && !VideoRecorder._isRecording) {
					VideoRecorder._video.onloadedmetadata = (e) => {
						VideoRecorder._isRecording = true;
						VideoRecorder._Capture();
						VideoRecorder._frameNumber = 0;
						VideoRecorder._recorder.start();

						resolve(VideoRecorder._recorder);
					};
					VideoRecorder._video.srcObject = VideoRecorder._mediaStream;
					VideoRecorder._video.play();
					VideoRecorder._isStarted = true;
				} else {
					reject('Video recorder is already started!');
				}
			} else {
				reject('Video recorder is not initialized!');
			}
		});
	},
	stop: () => new Promise((resolve, reject) => {
		if (VideoRecorder._isInitialized) {
			if (VideoRecorder._isStarted) {
				if (VideoRecorder._isRecording) {
					VideoRecorder._recorder.stop();
					VideoRecorder._isRecording = false;
				} else {
					reject('Video recorder is not recording!');
				}

				VideoRecorder._video.pause();
				VideoRecorder._isStarted = false;

				resolve(VideoRecorder._recorder);
			} else {
				reject('Video recorder is not started!');
			}
		} else {
			reject('Video recorder is not initialized!');
		}
	}),
	download: (filename = 'video.webm') => new Promise((resolve, reject) => {
		const link = document.createElement('a');
		link.href = URL.createObjectURL(new Blob(VideoRecorder._data, {type: VideoRecorder._mimeType}));
		link.download = filename;
		link.click();

		resolve(VideoRecorder._recorder);
	})
};

export default VideoRecorder;
