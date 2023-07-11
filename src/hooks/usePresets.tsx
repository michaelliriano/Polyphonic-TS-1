import { useEffect, SetStateAction, useState } from "react";
import { CustomOsc } from "../types";

export interface Preset {
  name: string;
  data: CustomOsc[];
}

/**
 * Custom hook for managing presets.
 * @param {React.Dispatch<SetStateAction<CustomOsc[]>>} setCustomOsc - Setter function for custom oscillator data.
 * @returns {Object} - An object containing presets and preset-related functions.
 */
const usePresets = (
  setCustomOsc: React.Dispatch<SetStateAction<CustomOsc[]>>
) => {
  const [presets, setPresets] = useState<Preset[]>([
    {
      name: "Standard",
      data: [],
    },
    {
      name: "808",
      data: [
        {
          sort: 1,
          type: "sine",
          enabled: true,
          detune: 0,
          sustain: 0,
          bend: 0,
          resonance: 59,
          volume: 1,
          release: 0,
          octave: 0,
        },
        {
          sort: 2,
          type: "sawtooth",
          enabled: true,
          detune: -12,
          sustain: 0,
          bend: 0,
          resonance: 10,
          volume: 1,
          release: 0,
          octave: 0,
        },
        {
          sort: 3,
          type: "square",
          enabled: false,
          detune: 0,
          sustain: 0,
          bend: 0,
          resonance: 1000,
          volume: .1,
          release: 0,
          octave: 0,
        },
        {
          sort: 4,
          type: "triangle",
          enabled: false,
          detune: 0,
          sustain: 0,
          bend: 0,
          resonance: 1000,
          volume: .1,
          release: 0,
          octave: 0,
        },
      ],
    },
    {
      name: "Dubstep Wobble",
      data: [
        {
          sort: 1,
          type: "sine",
          enabled: true,
          detune: 96,
          sustain: 0,
          bend: 0,
          resonance: 442,
          volume: .5,
          release: 0,
          octave: 0,
        },
        {
          sort: 2,
          type: "square",
          enabled: true,
          detune: 1,
          sustain: 0,
          bend: 0,
          resonance: 98,
          volume: .5,
          release: 0,
          octave: 0,
        },
        {
          sort: 3,
          type: "square",
          enabled: false,
          detune: 0,
          sustain: 0,
          bend: 0,
          resonance: 1000,
          volume: .1,
          release: 0,
          octave: 0,
        },
        {
          sort: 4,
          type: "triangle",
          enabled: false,
          detune: 0,
          sustain: 0,
          bend: 0,
          resonance: 1000,
          volume: .1,
          release: 0,
          octave: 0,
        },
      ],
    },
    {
      name: "Laser",
      data: [
        {
          sort: 1,
          type: "sine",
          enabled: true,
          detune: 96,
          sustain: 0,
          bend: 0.14,
          resonance: 442,
          volume: .1,
          release: 0,
          octave: 0,
        },
        {
          sort: 2,
          type: "square",
          enabled: false,
          detune: 1,
          sustain: 0,
          bend: 0,
          resonance: 98,
          volume: .1,
          release: 0,
          octave: 0,
        },
        {
          sort: 3,
          type: "square",
          enabled: false,
          detune: 0,
          sustain: 0,
          bend: 0,
          resonance: 1000,
          volume: .1,
          release: 0,
          octave: 0,
        },
        {
          sort: 4,
          type: "triangle",
          enabled: false,
          detune: 0,
          sustain: 0,
          bend: 0,
          resonance: 1000,
          volume: .1,
          release: 0,
          octave: 0,
        },
      ],
    },
    {
      name: "Lead",
      data: [
        {
          sort: 1,
          type: "sine",
          enabled: true,
          detune: 0,
          sustain: 0,
          bend: 0,
          resonance: 59,
          volume: .1,
          release: 0,
          octave: 0,
        },
        {
          sort: 2,
          type: "sawtooth",
          enabled: true,
          detune: -12,
          sustain: 0,
          bend: 0,
          resonance: 87,
          volume: .1,
          release: 0,
          octave: 0,
        },
        {
          sort: 3,
          type: "square",
          enabled: false,
          detune: 0,
          sustain: 0,
          bend: 0,
          resonance: 1000,
          volume: .1,
          release: 0,
          octave: 0,
        },
        {
          sort: 4,
          type: "triangle",
          enabled: false,
          detune: 0,
          sustain: 0,
          bend: 0,
          resonance: 1000,
          volume: .1,
          release: 0,
          octave: 0,
        },
      ],
    },
  ]);
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);

  // Load presets from local storage on app load
  useEffect(() => {
    const storedPresets = localStorage.getItem("presets");
    if (storedPresets) {
      setPresets(JSON.parse(storedPresets) as Preset[]);
    }
  }, []);

  // Save presets to local storage whenever presets change
  useEffect(() => {
    localStorage.setItem("presets", JSON.stringify(presets));
  }, [presets]);

  /**
   * Handle saving a preset.
   * @param {Preset} preset - The preset to save.
   */
  const handleSavePreset = (preset: Preset): void => {
    setPresets((prevPresets: Preset[]) => {
      const index = prevPresets.findIndex(
        (p: Preset) => p.name === preset.name
      );
      if (index !== -1) {
        const updatedPresets = [...prevPresets];
        updatedPresets[index] = preset;
        return updatedPresets;
      } else {
        return [...prevPresets, preset];
      }
    });
  };

  /**
   * Handle selecting a preset.
   * @param {Preset} preset - The preset to select.
   */
  const handleSelectPreset = (preset: Preset): void => {
    setSelectedPreset(preset);
    setCustomOsc(preset.data);
  };

  /**
   * Handle deleting a preset.
   * @param {Preset} preset - The preset to delete.
   */
  const handleDeletePreset = (preset: Preset): void => {
    setPresets((prevPresets: Preset[]) => {
      const updatedPresets = prevPresets.filter(
        (p: Preset) => p.name !== preset.name
      );
      return updatedPresets;
    });
    if (selectedPreset?.name === preset.name) {
      setSelectedPreset(null);
      setCustomOsc([]);
    }
  };

  return {
    presets,
    selectedPreset,
    setPresets,
    handleSavePreset,
    handleSelectPreset,
    handleDeletePreset,
  };
};

export default usePresets;
