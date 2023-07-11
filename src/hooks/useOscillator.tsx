import { useCallback, useState, useEffect } from "react";
import { CustomOsc } from "../types";
import useInitialOscillator from "./useInitialOscillator";
import useCreateOscillator from "./useCreateOscillator";
import useUpdateOscillator from "./useUpdateOscillator";

/**
 * Custom hook for managing oscillators.
 * @param {Object} props - The props object.
 * @param {AudioContext} props.audioContext - The audio context.
 * @param {BiquadFilterNode[]} props.filters - The filter nodes.
 * @returns {Object} - An object containing oscillator-related state and functions.
 */
export function useOscillators({
  audioContext,
  filters,
}: {
  audioContext: AudioContext;
  filters: BiquadFilterNode[];
}) {
  const { initialOsc } = useInitialOscillator();
  const [customOsc, setCustomOsc] = useState<CustomOsc[]>(initialOsc);

  const [activeOscillators, setActiveOscillators] = useState<
    Map<number, OscillatorNode>
  >(new Map());
  const [oscillatorCount, setOscillatorCount] = useState<number>(0);
  const [currentFrequency, setCurrentFrequency] = useState<number | null>(null);
  const [oscillators, setOscillators] = useState<OscillatorNode[]>([]);

  // Create a master gain node
  const masterGain = audioContext?.createGain();
  if (masterGain) {
    masterGain.gain.value = .1;
    masterGain.connect(audioContext?.destination);
  }

  const { createOscillator } = useCreateOscillator(audioContext, filters);

  const { updateOscillators } = useUpdateOscillator(
    audioContext,
    filters,
    oscillators,
    currentFrequency,
    customOsc
  );

  /**
   * Handle playing a note.
   * @param {number} frequency - The frequency of the note to play.
   */
  const handleNotePlay = useCallback(
    (frequency: number): void => {
      setCurrentFrequency(frequency);

      const newOscillators: OscillatorNode[] = [];

      customOsc.forEach((osc) => {
        if (!osc.enabled) {
          return; // Skip disabled oscillators
        }

        const oscillatorIndex = newOscillators.length; // Use the index of newOscillators

        const oscillator = createOscillator(
          frequency,
          osc.type,
          osc.detune,
          osc.sustain,
          osc.volume,
          osc.octave,
          oscillatorIndex, // Use the oscillatorIndex instead of `index`,
          1
        );

        // Connect the oscillator to the master gain
        oscillator.connect(masterGain);

        oscillator.start();

        newOscillators.push(oscillator);

        // Store the oscillator with a unique identifier
        const oscillatorId = oscillatorCount + oscillatorIndex;
        setActiveOscillators((prevActiveOscillators) => {
          const newActiveOscillators = new Map(prevActiveOscillators);
          newActiveOscillators.set(oscillatorId, oscillator);
          return newActiveOscillators;
        });
      });

      setOscillatorCount(oscillatorCount + newOscillators.length);
      setOscillators(newOscillators);
    },
    [createOscillator, customOsc, masterGain, oscillatorCount]
  );

  /**
   * Handle stopping a note.
   */
  const handleNoteStop = useCallback((): void => {
    setCurrentFrequency(null);

    // Stop and disconnect all active oscillators
    activeOscillators.forEach((oscillator) => {
      oscillator.stop();
      oscillator.disconnect();
    });

    setActiveOscillators(new Map());
    setOscillators([]);
  }, [activeOscillators]);

  useEffect(() => {
    if (audioContext) {
      updateOscillators();
    }
  }, [audioContext, updateOscillators]);

  useEffect(() => {
    if (customOsc.length === 0) {
      setCustomOsc(initialOsc);
    }
  }, [customOsc, initialOsc]);

  /**
   * Handle the change of oscillator type.
   * @param {number} index - The index of the oscillator.
   * @param {string} type - The new oscillator type.
   */
  const onOscillatorTypeChange = useCallback(
    (index: number, type: "sine" | "triangle" | "square" | "sawtooth") => {
      setCustomOsc((prevCustomOsc) => [
        ...prevCustomOsc.slice(0, index),
        { ...prevCustomOsc[index], type },
        ...prevCustomOsc.slice(index + 1),
      ]);
    },
    [setCustomOsc]
  );

  /**
   * Handle toggling the enabled state of an oscillator.
   * @param {number} index - The index of the oscillator.
   */
  const onOscillatorToggleEnabled = useCallback(
    (index: number) => {
      setCustomOsc((prevCustomOsc) => [
        ...prevCustomOsc.slice(0, index),
        { ...prevCustomOsc[index], enabled: !prevCustomOsc[index].enabled },
        ...prevCustomOsc.slice(index + 1),
      ]);
    },
    [setCustomOsc]
  );

  /**
   * Handle the change of oscillator detune.
   * @param {number} index - The index of the oscillator.
   * @param {number} value - The new detune value.
   */
  const onOscillatorDetuneChange = useCallback(
    (index: number, value: number) => {
      setCustomOsc((prevCustomOsc) => [
        ...prevCustomOsc.slice(0, index),
        { ...prevCustomOsc[index], detune: value },
        ...prevCustomOsc.slice(index + 1),
      ]);
    },
    [setCustomOsc]
  );

  /**
   * Handle the change of oscillator sustain.
   * @param {number} index - The index of the oscillator.
   * @param {number} value - The new sustain value.
   */
  const onOscillatorSustainChange = useCallback(
    (index: number, value: number) => {
      setCustomOsc((prevCustomOsc) => [
        ...prevCustomOsc.slice(0, index),
        { ...prevCustomOsc[index], sustain: value },
        ...prevCustomOsc.slice(index + 1),
      ]);
    },
    [setCustomOsc]
  );

  /**
   * Handle the change of oscillator resonance.
   * @param {number} index - The index of the oscillator.
   * @param {number} value - The new resonance value.
   */
  const onOscillatorResonanceChange = useCallback(
    (index: number, value: number) => {
      setCustomOsc((prevCustomOsc) => [
        ...prevCustomOsc.slice(0, index),
        { ...prevCustomOsc[index], resonance: value },
        ...prevCustomOsc.slice(index + 1),
      ]);
    },
    [setCustomOsc]
  );

  /**
   * Handle the change of oscillator volume.
   * @param {number} index - The index of the oscillator.
   * @param {number} value - The new volume value.
   */
  const onOscillatorVolumeChange = useCallback(
    (index: number, value: number) => {
      setCustomOsc((prevCustomOsc) => [
        ...prevCustomOsc.slice(0, index),
        { ...prevCustomOsc[index], volume: value },
        ...prevCustomOsc.slice(index + 1),
      ]);
    },
    [setCustomOsc]
  );

  /**
   * Handle the change of oscillator release.
   * @param {number} index - The index of the oscillator.
   * @param {number} value - The new release value.
   */
  const onOscillatorReleaseChange = useCallback(
    (index: number, value: number) => {
      setCustomOsc((prevCustomOsc) => [
        ...prevCustomOsc.slice(0, index),
        { ...prevCustomOsc[index], release: value },
        ...prevCustomOsc.slice(index + 1),
      ]);
    },
    [setCustomOsc]
  );

  /**
   * Handle the change of oscillator octave.
   * @param {number} index - The index of the oscillator.
   * @param {number} value - The new octave value.
   */
  const handleOscillatorOctaveChange = useCallback(
    (index: number, value: number) => {
      setCustomOsc((prevCustomOsc) => [
        ...prevCustomOsc.slice(0, index),
        { ...prevCustomOsc[index], octave: value },
        ...prevCustomOsc.slice(index + 1),
      ]);
    },
    [setCustomOsc]
  );

  /**
   * Handle the change of oscillator delay.
   * @param {number} index - The index of the oscillator.
   * @param {number} value - The new delay value.
   */
  const onOscillatorDelayChange = useCallback(
    (index: number, value: number) => {
      setCustomOsc((prevCustomOsc) => [
        ...prevCustomOsc.slice(0, index),
        { ...prevCustomOsc[index], bend: value },
        ...prevCustomOsc.slice(index + 1),
      ]);
    },
    [setCustomOsc]
  );

  return {
    customOsc,
    oscillators,
    initialOsc,
    setCustomOsc,
    handleNotePlay,
    handleNoteStop,
    onOscillatorDelayChange,
    handleOscillatorOctaveChange,
    onOscillatorDetuneChange,
    onOscillatorReleaseChange,
    onOscillatorResonanceChange,
    onOscillatorVolumeChange,
    onOscillatorSustainChange,
    onOscillatorTypeChange,
    onOscillatorToggleEnabled,
  };
}

export default useOscillators;
