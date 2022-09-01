import React, { useRef } from "react";
import styles from "../css/ContentEdiable.module.css";

const ContentEditable: React.VFC<{
  id: string;
  inputFor: string;
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  onBlur: () => void;
}> = ({ id, inputFor, value, onChange, onBlur }) => {
  const defaultValue: React.MutableRefObject<string> = useRef(value);

  const handleInput = (event: React.ChangeEvent<HTMLDivElement>) => {
    onChange(event.target.innerHTML);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <div
      id={id}
      className={`${
        inputFor === "comment" && styles.comment
      } w-full h-max max-h-32 px-2 overflow-y-auto border-none outline-none resize-none`}
      contentEditable
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onBlur={onBlur}
      dangerouslySetInnerHTML={{ __html: defaultValue.current }}
    />
  );
};

export default ContentEditable;
