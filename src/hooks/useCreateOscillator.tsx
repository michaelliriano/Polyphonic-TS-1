import { useCallback } from "react";

/**
 * Custom hook for creating an oscillator node with distortion.
 * @param {AudioContext} audioContext - The audio context instance.
 * @param {BiquadFilterNode[]} filters - An array of filter nodes.
 * @returns {Object} - An object containing the createOscillator function.
 */
export default function useCreateOscillator(
  audioContext: AudioContext,
  filters: BiquadFilterNode[]
) {
  /**
   * Creates an oscillator node with distortion.
   * @param {number} frequency - The frequency of the oscillator.
   * @param {OscillatorType} type - The type of oscillator.
   * @param {number} detune - The detune value of the oscillator.
   * @param {number} sustain - The sustain level of the oscillator.
   * @param {number} volume - The volume level of the oscillator.
   * @param {number} octave - The octave level of the oscillator.
   * @param {number} filterIndex - The index of the filter to connect the oscillator to.
   * @param {number} distortionAmount - The amount of distortion to apply.
   * @returns {OscillatorNode} - The created oscillator node.
   */
  const createOscillator = useCallback(
    (
      frequency: number,
      type: OscillatorType,
      detune: number,
      sustain: number,
      volume: number,
      octave: number,
      filterIndex: number,
      distortionAmount: number
    ): OscillatorNode => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      // const analyzer = audioContext.createAnalyser();

      const distortionNode = audioContext.createWaveShaper();

      oscillator.type = type;

      const actualFrequency = frequency * Math.pow(2, octave);
      oscillator.frequency.setValueAtTime(
        actualFrequency,
        audioContext.currentTime
      );

      const actualDetune = detune * Math.pow(2, octave);
      oscillator.detune.setValueAtTime(actualDetune, audioContext.currentTime);

      // oscillator.connect(analyzer); // Move this line before connecting to the distortion node

      // Connect the oscillator to the distortion node, then to the gain node
      oscillator.connect(distortionNode);

      distortionNode.connect(gainNode);

      // Connect the gain node to the filter
      gainNode.connect(filters[filterIndex]);

      // Check if sustain, release, and volume are valid numbers
      const validSustain = Number.isFinite(sustain) ? sustain : 0;
      const validVolume = Number.isFinite(volume) ? volume : 0;

      // Apply fade-in effect
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        (validSustain / 100) * validVolume,
        audioContext.currentTime + 0.01
      );

      // Apply fade-out effect
      gainNode.gain.linearRampToValueAtTime(
        0,
        audioContext.currentTime + validSustain / 100
      );

      // Adjust the distortion curve
      const curve = createDistortionCurve(distortionAmount);
      distortionNode.curve = curve;

      return oscillator;
    },
    [audioContext, filters]
  );

  /**
   * Creates a distortion curve for the wave shaper node.
   * @param {number} amount - The amount of distortion.
   * @returns {Float32Array} - The distortion curve.
   */
  const createDistortionCurve = (amount: number): Float32Array => {
    const curveLength = 4096;
    const curve = new Float32Array(curveLength);
    const factor = 1 / curveLength;

    for (let i = 0; i < curveLength; i++) {
      const x = (i * 2) / curveLength - 1;
      curve[i] = ((Math.PI + amount) * x * factor) / (1 + amount * Math.abs(x));
    }

    return curve;
  };

  return { createOscillator };
}
