import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_protected/playground")({
  component: RouteComponent,
});

function RouteComponent() {
  const [text, setText] = useState("");

  const [channel] = useState(() => {
    const channel = new MessageChannel();
    channel.port1.onmessage = (event: MessageEvent) => {
      onMessage(event.data);
    };
    return channel;
  });

  const onMessage = (message: unknown) => {
    alert(`Message from iframe: ${JSON.stringify(message, null, 2)}`);
  };

  const handleSendMessage = () => {
    channel.port1.postMessage(text);
    setText("");
  };

  return (
    <div className="p-2  h-full flex flex-col gap-y-3">
      <div className="flex space-x-2">
        <input
          className="border rounded-lg px-3 h-9 text-sm"
          placeholder="Enter a message"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <Button className="rounded-lg" onClick={handleSendMessage}>
          Send
        </Button>
      </div>
      {/* <iframe
        className="h-full w-full border rounded-lg"
        src="http://localhost:5000/"
        onLoad={(event) => {
          event.currentTarget.contentWindow?.postMessage(
            "init",
            "http://localhost:5000/",
            [channel.port2]
          );
        }}
      /> */}
    </div>
  );
}
