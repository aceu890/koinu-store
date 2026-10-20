"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const id = window.setTimeout(() => {
      void navigator.serviceWorker.register("/sw.js");
    }, 4000);
    return () => window.clearTimeout(id);
  }, []);

  return null;
}
