import React from "react";
import { Preset } from "../../hooks/usePresets";

interface PresetListProps {
  presets: Preset[];
  onSelectPreset: (preset: Preset) => void;
}

const PresetList: React.FC<PresetListProps> = ({ presets, onSelectPreset }) => {
  return (
    <section
      style={{
        marginLeft: 20,
      }}
    >
      {presets.length === 0 ? (
        <></>
      ) : (
        <select
          aria-label="View list of all default and custom presets"
          style={{
            minHeight: 36,
            minWidth: 150,
          }}
          onChange={(e) =>
            onSelectPreset(
              presets.find((preset) => preset.name === e.target.value) as Preset
            )
          }
        >
          {presets.map((preset, index) => (
            <option key={index} value={preset.name}>
              {preset.name}
            </option>
          ))}
        </select>
      )}
    </section>
  );
};

const MemoizedPPresetList = React.memo(PresetList);

export default MemoizedPPresetList;
