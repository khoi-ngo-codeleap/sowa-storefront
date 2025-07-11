const useBridge = () => {
  const bridge = window.bridge;
  if (!bridge) {
    throw new Error("No bridge");
  }
  return bridge;
};

const buttonStyle = "border  px-2 py-1.5 rounded rounded-md";
function App() {
  const bridge = useBridge();

  return (
    <div className="p-3">
      <h1 className="text-2xl font-bold">Padoran 🚀</h1>
      <div className="flex items-center gap-2">
        <button
          className={buttonStyle}
          onClick={() =>
            bridge.method.call(
              "say-hello",
              "Hey, greeting message from VietNam 🇻🇳"
            )
          }
        >
          Say hi to Host
        </button>
        <button className={buttonStyle} onClick={() => bridge.method}>
          👋 Toast
        </button>
      </div>
    </div>
  );
}

export default App;
