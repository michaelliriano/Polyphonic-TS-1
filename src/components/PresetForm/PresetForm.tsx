import React, { useState, useEffect, useContext } from "react";
import { Preset } from "../../hooks/usePresets";
import { CustomOscillatorContext } from "../../context/CustomOscillatorContext";

interface PresetFormProps {
  onSavePreset: (preset: Preset) => void;
  onDeletePreset: (preset: Preset) => void; // New prop for deleting presets
  selectedPreset: Preset | null;
  types: string[];
}

const PresetForm: React.FC<PresetFormProps> = ({
  onSavePreset,
  onDeletePreset,
  selectedPreset,
}) => {
  const [presetName, setPresetName] = useState("");

  const customOsc = useContext(CustomOscillatorContext);

  useEffect(() => {
    if (selectedPreset) {
      setPresetName(selectedPreset.name);
    } else {
      setPresetName("");
    }
  }, [selectedPreset]);

  const handleSave = () => {
    if (presetName) {
      const preset: Preset = {
        name: presetName,
        data: customOsc,
      };

      onSavePreset(preset);
      setPresetName("");
    }
  };
  const handleDelete = () => {
    if (selectedPreset) {
      onDeletePreset(selectedPreset);
    }
  };

  return (
    <form>
      <input
        type="text"
        placeholder="Preset Name"
        aria-label={"The preset name for custom oscillators "}
        value={presetName}
        onChange={(e) => setPresetName(e.target.value)}
        style={{
          minHeight: 30,
        }}
      />

      <button
        style={{
          minHeight: 36,
          padding: 9,
        }}
        onClick={handleSave}
        aria-label={"Save the preset"}
        disabled={presetName.length === 0}
      >
        Save Preset
      </button>
      {selectedPreset && (
        <button
          style={{
            minHeight: 36,
            backgroundColor: "#E15141",
            border: "none",
          }}
          aria-label={"Delete the preset "}
          onClick={handleDelete}
        >
          Delete
        </button>
      )}
    </form>
  );
};

const MemoizedPresetForm = React.memo(PresetForm);

export default MemoizedPresetForm;
