import React from "react";

interface Props {
  message: string;
  yes: string;
  no: string;
}

const Modal: React.VFC<Props> = (props: Props) => {
  return (
    <div>
      <p>{props.message}</p>
      <div>
        <button
          onClick={(event) => {
            event.preventDefault();
            console.log("しょうきょしました")
          }}
        >
          {props.yes}
        </button>
        <button>{props.no}</button>
      </div>
    </div>
  );
};

export default Modal;
