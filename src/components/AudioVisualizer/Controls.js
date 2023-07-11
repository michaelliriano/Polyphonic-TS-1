let oscillator, isPlaying, pixelRatio, sizeOnScreen, segmentWidth;

const canvas = document.getElementById("canvas"),
	c = canvas.getContext("2d"),
	ac = new AudioContext(),
	powerBtn = document.getElementById("on-off"),
	oscType = document.getElementById("osc-type"),
	freqSlider = document.getElementById("frequency"),
	gainSlider = document.getElementById("gain"),
	gainNode = new GainNode(ac, {
		gain: 0.5
	}),
	analyser = new AnalyserNode(ac, {
		smoothingTimeConstant: 1,
		fftSize: 2048
	}),
	dataArray = new Uint8Array(analyser.frequencyBinCount);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
pixelRatio = window.devicePixelRatio;
sizeOnScreen = canvas.getBoundingClientRect();
canvas.width = sizeOnScreen.width * pixelRatio;
canvas.height = sizeOnScreen.height * pixelRatio;
canvas.style.width = canvas.width / pixelRatio + "px";
canvas.style.height = canvas.height / pixelRatio + "px";
c.fillStyle = "#181818";
c.fillRect(0, 0, canvas.width, canvas.height);
c.strokeStyle = "#33ee55";
c.beginPath();
c.moveTo(0, canvas.height / 2);
c.lineTo(canvas.width, canvas.height / 2);
c.stroke();

powerBtn.addEventListener("click", () => {
	if (isPlaying) {
		if (oscillator) oscillator.stop();
		powerBtn.innerHTML = "Turn On";
	} else {
		oscillator = new OscillatorNode(ac, {
			type: oscType.value,
			frequency: freqSlider.value
		});
		oscillator.connect(gainNode);
		gainNode.connect(analyser);
		analyser.connect(ac.destination);
		oscillator.start();
		draw();
		powerBtn.innerHTML = "Turn Off";
	}
	document.getElementById("led").classList.toggle("on");
	isPlaying = !isPlaying;
});

freqSlider.addEventListener("input", (event) => {
	let freq = event.target.value;
	document.getElementById("frequencyValue").innerHTML = freq;
	if (oscillator && isPlaying) {
		oscillator.frequency.value = freq;
	}
});

oscType.addEventListener("change", (event) => {
	if (oscillator && isPlaying) {
		oscillator.type = event.target.value;
	}
});

gainSlider.addEventListener("input", (event) => {
	let gain = event.target.value;
	document.getElementById("gainValue").innerHTML = gain;
	if (oscillator && isPlaying) {
		gainNode.gain.value = gain;
	}
});

const draw = () => {
	analyser.getByteTimeDomainData(dataArray);
	segmentWidth = canvas.width / analyser.frequencyBinCount;
	c.fillRect(0, 0, canvas.width, canvas.height);
	c.beginPath();
	c.moveTo(-100, canvas.height / 2);
	if (isPlaying) {
		for (let i = 1; i < analyser.frequencyBinCount; i += 1) {
			let x = i * segmentWidth;
			let v = dataArray[i] / 128.0;
			let y = (v * canvas.height) / 2;
			c.lineTo(x, y);
		}
	}
	c.lineTo(canvas.width + 100, canvas.height / 2);
	c.stroke();
	requestAnimationFrame(draw);
};
