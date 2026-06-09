import "./index.css";
import { Composition } from "remotion";
import { ForensicOpening } from "./ForensicOpening";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ForensicOpening"
        component={ForensicOpening}
        durationInFrames={120}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
