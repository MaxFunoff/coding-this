import { FC } from "react";
import CSS from "csstype";

type VRProps = CSS.Properties

export const VR: FC<VRProps> = (props) => {
  return (
    <div
      style={{
        height: props.height,
        width: "1px",
        marginTop: "20px",
        marginBottom: "20px",
        marginLeft: "auto",
        marginRight: "auto",
        borderLeft: `${props.color || 'transparent'} dotted 6px`,
        transform: "translateX(-3px)",
      }}
    ></div>
  );
};
