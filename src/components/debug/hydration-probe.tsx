"use client";

import { useEffect, useRef } from "react";

const ENDPOINT =
  "http://127.0.0.1:7536/ingest/f1d1b59d-dd24-43d5-8599-1dfaa67eee90";

export function HydrationProbe() {
  const logged = useRef(false);

  useEffect(() => {
    if (logged.current) return;
    logged.current = true;

    const bodyAttrs = Array.from(document.body.attributes).map((attr) => attr.name);
    const extensionAttrs = bodyAttrs.filter(
      (name) =>
        name.startsWith("bis_") ||
        name.startsWith("__processed") ||
        name.includes("extension"),
    );

    // #region agent log
    fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "786579",
      },
      body: JSON.stringify({
        sessionId: "786579",
        runId: "pre-fix",
        hypothesisId: "A",
        location: "hydration-probe.tsx:mount",
        message: "Body attributes after mount",
        data: {
          bodyAttrCount: bodyAttrs.length,
          bodyAttrs,
          extensionAttrs,
          hasBisRegister: bodyAttrs.includes("bis_register"),
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, []);

  return null;
}
