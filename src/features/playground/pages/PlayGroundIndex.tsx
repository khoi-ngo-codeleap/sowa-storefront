import { createHostAppBridge } from "@jtl/cloud-apps-internal-react";
import { useEffect, useRef } from "react";

const PlayGroundIndex = () => {
  const frameRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const init = async (frame: HTMLIFrameElement) => {
      console.log("createHostAppBridge");
      const bridge = await createHostAppBridge(frame);

      bridge.method.expose("say-hello", (data: any) => {
        console.log(data);
      });
      // ?? how to use???
      // bridge.method.expose<{ name: string }>("toast", {
      //   name: "toast",
      // });
    };

    frameRef.current && init(frameRef.current);
  }, []);

  return (
    <div className="absolute left-0 right-0 top-[52px] bottom-0">
      <iframe
        ref={frameRef}
        src="http://localhost:5173"
        className="h-full w-full border-t"
      />
    </div>
  );
};

export default PlayGroundIndex;
