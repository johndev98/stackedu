"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { logger } from "@/lib/logger";

const TIME_API = "https://time.now/developer/api/ip";

type TimeContextValue = {
  now: Date | null;
};

const TimeContext = createContext<TimeContextValue>({
  now: null,
});

async function getServerTime(): Promise<number> {
  try {
    const res = await fetch(TIME_API, {
      cache: "no-store",
    });

    const data = await res.json();

    logger.log(
      "[Time Sync] Server:",
      new Date(data.datetime).toLocaleString("vi-VN"),
    );

    return Date.parse(data.datetime);
  } catch {
    logger.warn("[Time Sync] Fallback local");

    return Date.now();
  }
}

export function TimeProvider({ children }: { children: React.ReactNode }) {
  const [now, setNow] = useState<Date | null>(null);

  const serverTimeRef = useRef<Date | null>(null);
  const perfStartRef = useRef(0);

  useEffect(() => {
    let alive = true;

    const sync = async () => {
      const ts = await getServerTime();

      if (!alive) return;

      serverTimeRef.current = new Date(ts);
      perfStartRef.current = performance.now();

      setNow(new Date(ts));
    };

    sync();

    const syncInterval = setInterval(sync, 30 * 60 * 1000);

    const tick = setInterval(() => {
      if (!serverTimeRef.current) return;

      const elapsed = performance.now() - perfStartRef.current;

      setNow(new Date(serverTimeRef.current.getTime() + elapsed));
    }, 1000);

    return () => {
      alive = false;
      clearInterval(syncInterval);
      clearInterval(tick);
    };
  }, []);

  return (
    <TimeContext.Provider value={{ now }}>{children}</TimeContext.Provider>
  );
}

export function useCurrentTime() {
  return useContext(TimeContext).now;
}
