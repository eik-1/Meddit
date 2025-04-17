import React from "react";

export default function Loader() {
  const dotColor = "bg-emerald-500 dark:bg-emerald-400";

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-stone-50 dark:bg-slate-950">
      <div className="flex space-x-2">
        <span className="sr-only">Loading...</span>
        <div
          className={`h-3 w-3 ${dotColor} rounded-full animate-bounce [animation-delay:-0.3s]`}
        ></div>
        <div
          className={`h-3 w-3 ${dotColor} rounded-full animate-bounce [animation-delay:-0.15s]`}
        ></div>
        <div
          className={`h-3 w-3 ${dotColor} rounded-full animate-bounce`}
        ></div>
      </div>
    </div>
  );
}
