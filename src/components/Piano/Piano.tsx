import React, {
  useState,
  useEffect,
  useRef,
  KeyboardEvent,
  useMemo,
  useContext,
} from "react";
import { keys } from "./constants";
import { ColorContext } from "../../context/ColorContext";

interface PianoProps {
  onNotePlay: (frequency: number) => void;
  onNoteStop: () => void;
}

/**
 * Piano component for playing musical notes.
 * @param {PianoProps} props - The props for the Piano component.
 * @returns {JSX.Element} - The rendered Piano component.
 */
const Piano: React.FC<PianoProps> = ({ onNotePlay, onNoteStop }) => {
  const [activeKeys, setActiveKeys] = useState<Record<string, boolean>>({});
  const [pageNumber, setPageNumber] = useState<number>(2);
  const [keysPerPage] = useState<number>(16);
  const isDraggingRef = useRef<boolean>(false);
  const pianoRef = useRef<HTMLDivElement>(null);

  const { color } = useContext(ColorContext);
  // const [isArpEnabled, setIsArpEnabled] = useState<boolean>(false);
  // const [arpPattern, setArpPattern] = useState<string>("up");
  // const [arpSpeed, setArpSpeed] = useState<number>(60);

  /**
   * Handles the key down event.
   * @param {KeyboardEvent<HTMLDivElement>} event - The key down event.
   */
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    const { key } = event;

    if (!activeKeys[key]) {
      const note = paginatedKeys.find((k) => k.key === key);

      if (note) {
        setActiveKeys({ [key]: true });
        onNotePlay(note.frequency);
      }
    }
  };

  /**
   * Handles the key up event.
   * @param {KeyboardEvent<HTMLDivElement>} event - The key up event.
   */
  const handleKeyUp = (event: KeyboardEvent<HTMLDivElement>): void => {
    const { key } = event;

    if (activeKeys[key]) {
      setActiveKeys((prevActiveKeys) => {
        const { [key]: removedKey, ...rest } = prevActiveKeys;
        return rest;
      });
      onNoteStop();
    }
  };

  /**
   * Handles the mouse down event.
   * @param {string} key - The key associated with the mouse down event.
   */
  const handleMouseDown = (key: string): void => {
    const note = paginatedKeys.find((k) => k.key === key);

    if (note) {
      setActiveKeys({ [key]: true });
      onNotePlay(note.frequency);
    }
    isDraggingRef.current = true;
  };

  /**
   * Handles the mouse up event.
   * @param {string} key - The key associated with the mouse up event.
   */
  const handleMouseUp = (key: string): void => {
    const note = paginatedKeys.find((k) => k.key === key);

    if (note) {
      setActiveKeys((prevActiveKeys) => {
        const { [key]: removedKey, ...rest } = prevActiveKeys;
        return rest;
      });
      onNoteStop();
    }
    isDraggingRef.current = false;
  };

  /**
   * Handles the mouse enter event.
   * @param {string} key - The key associated with the mouse enter event.
   */
  const handleMouseEnter = (key: string): void => {
    if (isDraggingRef.current) {
      if (!activeKeys[key]) {
        handleMouseDown(key);
      }
    }
  };

  /**
   * Handles the document mouse up event.
   */
  const handleDocumentMouseUp = (): void => {
    if (isDraggingRef.current) {
      setActiveKeys({});
      onNoteStop();
      isDraggingRef.current = false;
    }
  };

  /**
   * Returns the CSS class for a key based on its active state.
   * @param {string} key - The key associated with the CSS class.
   * @returns {string} - The CSS class for the key.
   */
  const getKeyClass = (key: string): string => {
    return `key ${activeKeys[key] ? "active" : ""}`;
  };

  // /**
  //  * Checks if a key is duplicated in the keys array.
  //  * @param {string} key - The key to check.
  //  * @returns {boolean} - Returns true if the key is duplicated, false otherwise.
  //  */
  // const isDuplicatedKey = (key: string): boolean => {
  //   const keyCount = keys.filter((k) => k.key === key).length;
  //   return keyCount > 1;
  // };

  useEffect(() => {
    document.addEventListener("mouseup", handleDocumentMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleDocumentMouseUp);
    };
  }, []);

  /**
   * Retrieves the keys for the current page.
   */
  const paginatedKeys = useMemo(() => {
    const startIndex = (pageNumber - 1) * keysPerPage;
    const endIndex = startIndex + keysPerPage;
    return keys.slice(startIndex, endIndex);
  }, [pageNumber, keysPerPage]);

  /**
   * Handles the page change event.
   * @param {number} newPage - The new page number.
   */
  const handlePageChange = (newPage: number): void => {
    setPageNumber(newPage);
  };

  // /**
  //  * Handles the keys per page change event.
  //  * @param {ChangeEvent<HTMLSelectElement>} event - The change event for the keys per page select element.
  //  */
  // const handleKeysPerPageChange = (
  //   event: ChangeEvent<HTMLSelectElement>
  // ): void => {
  //   setKeysPerPage(Number(event.target.value));
  //   setPageNumber(1); // Reset the page number when changing keys per page
  // };

  const totalPages = Math.ceil(keys.length / keysPerPage);
  const isLastPage = pageNumber === totalPages;

  // const calculateArpeggioNotes = (
  //   baseFrequency: number,
  //   pattern: string
  // ): number[] => {
  //   // Define the arpeggio pattern logic
  //   // For simplicity, let's assume a fixed pattern here
  //   switch (pattern) {
  //     case "up":
  //       return [baseFrequency, baseFrequency + 4, baseFrequency + 7];
  //     case "down":
  //       return [baseFrequency + 7, baseFrequency + 4, baseFrequency];
  //     case "up-down":
  //       return [
  //         baseFrequency,
  //         baseFrequency + 4,
  //         baseFrequency + 7,
  //         baseFrequency + 4,
  //         baseFrequency,
  //       ];
  //     default:
  //       return [];
  //   }
  // };

  // const playArpeggio = (arpNotes: number[], speed: number): void => {
  //   let index = 0;
  //   let intervalId: number | undefined;

  //   const playNote = () => {
  //     const frequency = arpNotes[index % arpNotes.length];
  //     onNotePlay(frequency);

  //     index++;

  //     if (index >= arpNotes.length && intervalId !== null) {
  //       clearInterval(intervalId);
  //       intervalId = undefined;
  //       setTimeout(onNoteStop, speed); // Delay the note stop by the same duration as the speed
  //     }
  //   };

  //   intervalId = setInterval(playNote, speed);
  // };

  return (
    <section
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      ref={pianoRef}
      style={{
        position: "relative",
        outline: "none",
        minHeight: 450,
        maxHeight: 400,
        overflow: "hidden",
        overflowX: "scroll",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div>
        {/* <select value={keysPerPage} onChange={handleKeysPerPageChange}>
          {[8, 16, 32, 64, 88].map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select> */}
        <label
          style={{
            fontSize: 20,

            marginBottom: 10,
            textAlign: "center",
          }}
          htmlFor=""
        >
          Scale
        </label>
        <button
          onClick={() => handlePageChange(pageNumber - 1)}
          disabled={pageNumber === 1}
          aria-label={"Decrease octave"}
          style={{
            marginLeft: 10,
            minWidth: 40,
            fontSize: 20,
            backgroundColor: `${pageNumber !== 1 ? color : "#333"}`,
            border: `1px solid ${color}`,
            borderRadius: 3,
            cursor: "pointer",
          }}
        >
          -
        </button>
        <button
          onClick={() => handlePageChange(pageNumber + 1)}
          disabled={isLastPage}
          aria-label={"Increase octave"}
          style={{
            minWidth: 40,
            fontSize: 20,
            marginLeft: 10,
            backgroundColor: `${!isLastPage ? color : "#333"}`,
            border: `1px solid ${color}`,
            borderRadius: 3,
            cursor: "pointer",
          }}
        >
          +
        </button>
        {/* <label>
          Arpeggiator:
          <input
            type="checkbox"
            checked={isArpEnabled}
            onChange={(e) => setIsArpEnabled(e.target.checked)}
          />
        </label>
        <label>
          Arpeggio Pattern:
          <select
            value={arpPattern}
            onChange={(e) => setArpPattern(e.target.value)}
          >
            <option value="up">Up</option>
            <option value="down">Down</option>
            <option value="up-down">Up-Down</option>
          </select>
        </label>
        <label>
          Arpeggio Speed:
          <input
            type="number"
            value={arpSpeed}
            onChange={(e) => setArpSpeed(Number(e.target.value))}
          />
        </label> */}
      </div>
      <div
        style={{
          minWidth: 1000,
          maxHeight: 425,
          border: "1px solid #ddd",
          paddingLeft: 100,
          backgroundColor: "rgba(0,0,0,0.3)",
        }}
      >
        {paginatedKeys.map(({ key, label, type, frequency }) => (
          <div
            key={String(frequency) + label}
            aria-label={`${key} ${label} ${frequency}`}
            className={getKeyClass(key)}
            style={{
              marginTop: 80,
              display: "inline-block",
              width: `${type === "natural" ? 100 : 40}px`,
              height: `${type === "natural" ? 300 : 170}px`,
              border: "1px solid black",
              textAlign: "center",
              lineHeight: 150,
              cursor: "pointer",
              background: activeKeys[key]
                ? "#ccc"
                : type === "natural"
                ? "#fff"
                : "#000",
              position: "relative",
              zIndex: type === "natural" ? 0 : 1,
              marginLeft: `${type === "sharp" ? -55 : 0}px`,
              left: type !== "natural" ? 20 : 0,
            }}
            onMouseDown={() => handleMouseDown(key)}
            onMouseUp={() => handleMouseUp(key)}
            onMouseEnter={() => handleMouseEnter(key)}
          >
            {label}
          </div>
        ))}
      </div>
    </section>
  );
};

const MemoizedPiano = React.memo(Piano);

export default MemoizedPiano;
