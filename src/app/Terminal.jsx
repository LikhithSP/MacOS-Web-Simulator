import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Terminals() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [activeCommand, setActiveCommand] = useState(null);
  const terminalRef = useRef(null);

  const runCommand = (cmd) => {
    const clean = cmd.trim().toLowerCase();
    // Fake macOS commands
    if (clean === "help") {
      return (
        <div className="space-y-1">
          <div className="text-white/70 font-semibold">Available Commands:</div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-white/90">
            <div>- <b className="text-yellow-400">whoami</b></div>
            <div>- <b className="text-yellow-400">uname -a</b></div>
            <div>- <b className="text-yellow-400">sw_vers</b></div>
            <div>- <b className="text-yellow-400">pwd</b></div>
            <div>- <b className="text-yellow-400">ls</b></div>
            <div>- <b className="text-yellow-400">date</b></div>
            <div>- <b className="text-yellow-400">uptime</b></div>
            <div>- <b className="text-yellow-400">echo [text]</b></div>
            <div>- <b className="text-yellow-400">cal</b></div>
            <div>- <b className="text-yellow-400">clear</b></div>
          </div>
        </div>
      );
    }
    if (clean === "whoami") {
      return <span className="text-green-300">guest</span>;
    }
    if (clean === "uname -a") {
      return <span className="text-white/80">Darwin MacBook-Pro.local 23.2.0 Darwin Kernel Version 23.2.0: root:xnu-8792.61.2~1/RELEASE_X86_64 x86_64</span>;
    }
    if (clean === "sw_vers") {
      return <pre className="text-white/80">{`ProductName:    macOS\nProductVersion: 15.2.0\nBuildVersion:   24C101`}</pre>;
    }
    if (clean === "pwd") {
      return <span className="text-white/80">/Users/guest</span>;
    }
    if (clean === "ls") {
      return <pre className="text-green-300">Desktop   Documents   Downloads   Music   Pictures   Public</pre>;
    }
    if (clean === "date") {
      return <span className="text-white/80">Wed Feb  6 12:34:56 IST 2026</span>;
    }
    if (clean === "uptime") {
      return <span className="text-white/80">12:34  up 3 days,  4:12, 2 users, load averages: 2.08 2.15 2.10</span>;
    }
    if (clean.startsWith("echo ")) {
      return <span className="text-white/80">{cmd.slice(5)}</span>;
    }
    if (clean === "cal") {
      return <pre className="text-white/80">{`   February 2026\nSu Mo Tu We Th Fr Sa\n                   1  2  3  4  5  6  7\n 8  9 10 11 12 13 14\n15 16 17 18 19 20 21\n22 23 24 25 26 27 28`}</pre>;
    }
    if (clean === "clear") {
      return "CLEAR_SCREEN";
    }
    // Default playful message
    return (
      <div className="text-blue-400">
        <span className="font-semibold">Hey! This is a MacOS Simulator bro 😆</span><br />
        Don&apos;t try real commands here, just explore!<br />
        <span className="text-green-400">Check out more cool stuff at <a href="https://github.com/likhithsp" target="_blank" rel="noopener noreferrer" className="underline">github.com/likhithsp</a></span>
      </div>
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanInput = input.trim();
    const output = runCommand(cleanInput);

    // Update the active command display
    setActiveCommand(cleanInput);

    if (output === "CLEAR_SCREEN") {
      setHistory([]);
      setInput("");
      return;
    }

    setHistory((prev) => [...prev, { command: cleanInput, result: output }]);
    setInput("");
  };

  useEffect(() => {
    // Scroll to the bottom of the terminal on new history update
    terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight);
  }, [history]);

  return (
    <div className="w-full h-full bg-black/50 border border-white/10 flex flex-col font-mono text-white relative p-4">


      {/* Terminal Body */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-green-500/40 scrollbar-track-black/20 z-10"
      >
        <AnimatePresence>
          {history.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <div className="flex items-center gap-2">
                <span className="text-green-500">@macos</span>:${" "}
                <span className="text-white/80">{line.command}</span>
              </div>
              <div className="pl-4">{line.result}</div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Current Input */}
        <motion.div
          key="current-input"
          className="flex items-center gap-2 mt-1 text-green-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="text-green-500">@macos</span>:$
          <input
            autoFocus
            value={input}
            placeholder="Type 'help' to begin..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
            className="bg-transparent flex-1 outline-none text-white/80 placeholder:text-white/40"
          />
        </motion.div>
      </div>
    </div>
  );
}
