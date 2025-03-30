// components/SystemUI.tsx
function SystemUI() {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center">
        <h1 className="text-neon-pink font-mono text-2xl tracking-widest">
          AI_HAVEN_LABS<span className="text-neon-cyan animate-pulse">_</span>
        </h1>
        <div className="text-neon-green font-mono text-sm">
          SYSTEM_STATUS: <span className="text-neon-blue">ONLINE</span>
        </div>
      </div>

      <div className="fixed bottom-6 left-6 text-neon-purple font-mono text-xs">
        <div>{`// ACCESS_GRANTED`}</div>
        <div>{`// USER: GUEST`}</div>
        <div>{`// TERMINAL_READY`}</div>
      </div>

      <div className="fixed bottom-6 right-6 text-neon-yellow font-mono text-xs text-right">
        <div>{`// NAVIGATION_NODES_ACTIVE`}</div>
        <div>{`// CLICK_TO_ACCESS`}</div>
        <div>{`// SERVER_TIME: ${new Date().toLocaleTimeString()}`}</div>
      </div>
    </>
  );
}

export default SystemUI;