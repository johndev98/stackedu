"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/fake-courses";
import type { Course } from "@/lib/fake-courses";

type Props = { course: Course };

// ⚙️ Cấu hình giữ nguyên
const SLOT_MINUTES = 5;
const DAY_RATIO_MIN = 0.3;
const DAY_RATIO_MAX = 0.85;
const DAY_NOISE_PERCENT = 0.1;
const VIETNAM_TIMEZONE = "Asia/Ho_Chi_Minh";
const vnFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: VIETNAM_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

// 🕒 API thời gian
const TIME_API = "https://time.now/developer/api/ip";

// 🥗 Khung giờ trưa
const LUNCH = {
  DECREASE_START: 11 * 60,
  DECREASE_END: 11 * 60 + 30,
  DECREASE_START_RATIO: 0.8,
  DECREASE_END_RATIO: 0.15,
  BOTTOM_START: 11 * 60 + 35,
  BOTTOM_END: 12 * 60 + 55,
  BOTTOM_RATIO_MIN: 0.0,
  BOTTOM_RATIO_MAX: 0.07,
  INCREASE_START: 13 * 60 + 5,
  INCREASE_END: 13 * 60 + 35,
  INCREASE_START_RATIO: 0.15,
  INCREASE_END_RATIO: 0.8,
};

// 🌙 Khung giờ đặc biệt
const SPECIAL = {
  NIGHT_DEC_START: 0,
  NIGHT_DEC_END: 60,
  NIGHT_DEC_START_RATIO: 0.35,
  NIGHT_DEC_END_RATIO: 0.02,
  NIGHT_BOTTOM_START: 60,
  NIGHT_BOTTOM_END: 4 * 60 + 30,
  NIGHT_BOTTOM_MIN: 0,
  NIGHT_BOTTOM_MAX: 0.03,
  MORNING_START: 4 * 60 + 30,
  MORNING_END: 7 * 60,
  MORNING_START_RATIO: 0.05,
  MORNING_END_RATIO: 0.4,
  EVENING_DEC_START: 18 * 60,
  EVENING_DEC_END: 18 * 60 + 30,
  EVENING_DEC_START_RATIO: 0.6,
  EVENING_DEC_END_RATIO: 0.3,
  EVENING_BOTTOM_START: 18 * 60 + 30,
  EVENING_BOTTOM_END: 18 * 60 + 50,
  EVENING_BOTTOM_MIN: 0.25,
  EVENING_BOTTOM_MAX: 0.35,
  EVENING_INC_START: 18 * 60 + 50,
  EVENING_INC_END: 19 * 60,
  EVENING_INC_START_RATIO: 0.35,
  EVENING_INC_END_RATIO: 0.65,
};

const SLOT_MS = SLOT_MINUTES * 60 * 1000;
const UPDATE_INTERVALS = [5_000, 10_000, 30_000, 60_000];

function pickRandomInterval(): number {
  return UPDATE_INTERVALS[Math.floor(Math.random() * UPDATE_INTERVALS.length)];
}

function hashStringToNumber(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
}

async function getServerTime(): Promise<number> {
  try {
    const res = await fetch(TIME_API, {
      cache: "no-store",
    });

    const data = await res.json();

    return Date.parse(data.datetime);
  } catch {
    return Date.now();
  }
}

// ⏱ Lấy chi tiết giờ phút theo múi giờ VN
function getVietnamTime(now: Date = new Date()) {
  const parts = vnFormatter.formatToParts(now);

  const get = (type: string) =>
    parseInt(parts.find((p) => p.type === type)!.value, 10);

  const hours = get("hour");
  const minutes = get("minute");
  const seconds = get("second");
  const slotStartMinute = Math.floor(minutes / SLOT_MINUTES) * SLOT_MINUTES;
  const msInSlot =
    (minutes - slotStartMinute) * 60000 +
    seconds * 1000 +
    now.getMilliseconds();

  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hours,
    minutes,
    msInSlot,
  };
}

// 📊 Tính tỉ lệ theo khung giờ
function getLunchBaseRatio(currentMinutes: number): number {
  if (
    currentMinutes >= LUNCH.DECREASE_START &&
    currentMinutes < LUNCH.DECREASE_END
  ) {
    const t =
      (currentMinutes - LUNCH.DECREASE_START) /
      (LUNCH.DECREASE_END - LUNCH.DECREASE_START);
    const eased = 1 - Math.pow(1 - t, 2);
    return (
      LUNCH.DECREASE_START_RATIO +
      (LUNCH.DECREASE_END_RATIO - LUNCH.DECREASE_START_RATIO) * eased
    );
  }
  if (
    currentMinutes >= LUNCH.DECREASE_END &&
    currentMinutes < LUNCH.BOTTOM_START
  ) {
    const t =
      (currentMinutes - LUNCH.DECREASE_END) /
      (LUNCH.BOTTOM_START - LUNCH.DECREASE_END);
    return (
      LUNCH.DECREASE_END_RATIO +
      (LUNCH.BOTTOM_RATIO_MIN - LUNCH.DECREASE_END_RATIO) * t
    );
  }
  if (
    currentMinutes >= LUNCH.BOTTOM_START &&
    currentMinutes < LUNCH.BOTTOM_END
  ) {
    return (LUNCH.BOTTOM_RATIO_MIN + LUNCH.BOTTOM_RATIO_MAX) / 2;
  }
  if (
    currentMinutes >= LUNCH.BOTTOM_END &&
    currentMinutes < LUNCH.INCREASE_START
  ) {
    const t =
      (currentMinutes - LUNCH.BOTTOM_END) /
      (LUNCH.INCREASE_START - LUNCH.BOTTOM_END);
    return (
      (LUNCH.BOTTOM_RATIO_MIN + LUNCH.BOTTOM_RATIO_MAX) / 2 +
      (LUNCH.INCREASE_START_RATIO -
        (LUNCH.BOTTOM_RATIO_MIN + LUNCH.BOTTOM_RATIO_MAX) / 2) *
        t
    );
  }
  if (
    currentMinutes >= LUNCH.INCREASE_START &&
    currentMinutes < LUNCH.INCREASE_END
  ) {
    const t =
      (currentMinutes - LUNCH.INCREASE_START) /
      (LUNCH.INCREASE_END - LUNCH.INCREASE_START);
    const eased = t * t;
    return (
      LUNCH.INCREASE_START_RATIO +
      (LUNCH.INCREASE_END_RATIO - LUNCH.INCREASE_START_RATIO) * eased
    );
  }
  return -1;
}

function getSpecialTimeRatio(currentMinutes: number, r2: number): number {
  if (
    currentMinutes >= SPECIAL.NIGHT_DEC_START &&
    currentMinutes < SPECIAL.NIGHT_DEC_END
  ) {
    const t =
      (currentMinutes - SPECIAL.NIGHT_DEC_START) /
      (SPECIAL.NIGHT_DEC_END - SPECIAL.NIGHT_DEC_START);
    const eased = 1 - Math.pow(1 - t, 2);
    const noise = (r2 * 2 - 1) * 0.08;
    return (
      (SPECIAL.NIGHT_DEC_START_RATIO +
        (SPECIAL.NIGHT_DEC_END_RATIO - SPECIAL.NIGHT_DEC_START_RATIO) * eased) *
      (1 + noise)
    );
  }
  if (
    currentMinutes >= SPECIAL.NIGHT_BOTTOM_START &&
    currentMinutes < SPECIAL.NIGHT_BOTTOM_END
  ) {
    return (
      SPECIAL.NIGHT_BOTTOM_MIN +
      r2 * (SPECIAL.NIGHT_BOTTOM_MAX - SPECIAL.NIGHT_BOTTOM_MIN)
    );
  }
  if (
    currentMinutes >= SPECIAL.MORNING_START &&
    currentMinutes < SPECIAL.MORNING_END
  ) {
    const t =
      (currentMinutes - SPECIAL.MORNING_START) /
      (SPECIAL.MORNING_END - SPECIAL.MORNING_START);
    const eased = t * t;
    const noise = (r2 * 2 - 1) * 0.08;
    return (
      (SPECIAL.MORNING_START_RATIO +
        (SPECIAL.MORNING_END_RATIO - SPECIAL.MORNING_START_RATIO) * eased) *
      (1 + noise)
    );
  }
  if (
    currentMinutes >= SPECIAL.EVENING_DEC_START &&
    currentMinutes < SPECIAL.EVENING_DEC_END
  ) {
    const t =
      (currentMinutes - SPECIAL.EVENING_DEC_START) /
      (SPECIAL.EVENING_DEC_END - SPECIAL.EVENING_DEC_START);
    const eased = 1 - Math.pow(1 - t, 2);
    const noise = (r2 * 2 - 1) * 0.06;
    return (
      (SPECIAL.EVENING_DEC_START_RATIO +
        (SPECIAL.EVENING_DEC_END_RATIO - SPECIAL.EVENING_DEC_START_RATIO) *
          eased) *
      (1 + noise)
    );
  }
  if (
    currentMinutes >= SPECIAL.EVENING_BOTTOM_START &&
    currentMinutes < SPECIAL.EVENING_BOTTOM_END
  ) {
    return (
      SPECIAL.EVENING_BOTTOM_MIN +
      r2 * (SPECIAL.EVENING_BOTTOM_MAX - SPECIAL.EVENING_BOTTOM_MIN)
    );
  }
  if (
    currentMinutes >= SPECIAL.EVENING_INC_START &&
    currentMinutes < SPECIAL.EVENING_INC_END
  ) {
    const t =
      (currentMinutes - SPECIAL.EVENING_INC_START) /
      (SPECIAL.EVENING_INC_END - SPECIAL.EVENING_INC_START);
    const eased = t * t;
    return (
      SPECIAL.EVENING_INC_START_RATIO +
      (SPECIAL.EVENING_INC_END_RATIO - SPECIAL.EVENING_INC_START_RATIO) * eased
    );
  }
  return -1;
}

function getTargetAtTime(
  courseId: string,
  maxOnline: number,
  now: Date = new Date(),
): number {
  const { year, month, day, hours, minutes } = getVietnamTime(now);
  const currentMinutes = hours * 60 + minutes;

  const slot = Math.floor(minutes / SLOT_MINUTES);
  const timeKey = `${year}-${month}-${day}-${hours}-${slot}`;
  const seed = `${courseId}__${timeKey}`;

  const r1 = hashStringToNumber(seed);
  const r2 = hashStringToNumber(seed + ":noise");

  const specialRatio = getSpecialTimeRatio(currentMinutes, r2);
  if (specialRatio >= 0) return Math.round(maxOnline * specialRatio);

  const lunchBaseRatio = getLunchBaseRatio(currentMinutes);
  if (lunchBaseRatio > 0) {
    const finalRatio =
      currentMinutes >= LUNCH.BOTTOM_START && currentMinutes < LUNCH.BOTTOM_END
        ? LUNCH.BOTTOM_RATIO_MIN +
          r2 * (LUNCH.BOTTOM_RATIO_MAX - LUNCH.BOTTOM_RATIO_MIN)
        : lunchBaseRatio * (1 + (r2 * 2 - 1) * 0.1);
    return Math.max(0, Math.min(Math.round(maxOnline * finalRatio), maxOnline));
  }

  const biased = Math.pow(r1, 0.55);
  const baseRatio = DAY_RATIO_MIN + biased * (DAY_RATIO_MAX - DAY_RATIO_MIN);
  const noise = (r2 * 2 - 1) * DAY_NOISE_PERCENT;
  const finalRatio = Math.min(
    DAY_RATIO_MAX,
    Math.max(DAY_RATIO_MIN, baseRatio + noise),
  );
  return Math.round(maxOnline * finalRatio);
}

function getSmoothOnlineCount(
  courseId: string,
  maxOnline: number,
  now: Date = new Date(),
): number {
  const { msInSlot } = getVietnamTime(now);
  const currentTarget = getTargetAtTime(courseId, maxOnline, now);
  const prevSlotTime = new Date(now.getTime() - SLOT_MS);
  const prevTarget = getTargetAtTime(courseId, maxOnline, prevSlotTime);

  const progress = Math.min(1, Math.max(0, msInSlot / SLOT_MS));
  const eased =
    progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
  const smooth = prevTarget + (currentTarget - prevTarget) * eased;
  return Math.max(0, Math.min(Math.round(smooth), maxOnline));
}

export function CourseCard({ course }: Props) {
  const isFree = course.price === 0;
  const [online, setOnline] = useState<number | null>(null);
  const serverTimeRef = useRef<Date | null>(null);
  const perfStartRef = useRef(0);
  const [ready, setReady] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    let alive = true;

    const sync = async () => {
      const serverTimestamp = await getServerTime();

      if (!alive) return;

      serverTimeRef.current = new Date(serverTimestamp);
      perfStartRef.current = performance.now();

      setReady(true);
    };

    sync();

    const interval = setInterval(sync, 30 * 60 * 1000);

    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    const update = () => {
      const server = serverTimeRef.current!;
      const elapsed = performance.now() - perfStartRef.current;

      const now = new Date(server.getTime() + elapsed);

      const newCount = getSmoothOnlineCount(course.id, course.maxOnline, now);

      setOnline((prev) => {
        if (prev === null || prev === newCount) return newCount;

        const step =
          Math.random() < 0.6
            ? Math.floor(Math.random() * 4) + 1
            : Math.floor(Math.random() * 5) + 5;

        return prev < newCount
          ? Math.min(prev + step, newCount)
          : Math.max(prev - step, newCount);
      });

      timerRef.current = setTimeout(update, pickRandomInterval());
    };

    update();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [course.id, course.maxOnline, ready]);

  const totalStudentsText = `${course.students.toLocaleString()} đã đăng ký`;

  return (
    <div className="w-full min-w-65 max-w-[320px] min-h-95 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative w-full h-44 shrink-0 overflow-hidden bg-slate-100">
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-slate-100">
          <span className="text-xl font-bold tracking-wider text-slate-400 select-none">
            StackEdu
          </span>
        </div>
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover z-10 animate-fade-in bg-transparent"
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
      <div className="p-4 flex flex-col flex-1 gap-3">
        <h3 className="text-base font-semibold text-slate-800 line-clamp-2 min-h-10 leading-5">
          {course.title}
        </h3>
        {online !== null && (
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1.5">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs sm:text-sm font-semibold text-emerald-700 tabular-nums transition-all duration-500 whitespace-nowrap">
                {online} đang học
              </span>
            </div>
            <div
              className="relative group flex items-center gap-1 text-slate-600 cursor-help select-none"
              title={totalStudentsText}
            >
              <span className="text-sm shrink-0">👥</span>
              <span className="text-sm font-semibold tabular-nums whitespace-nowrap">
                {course.students.toLocaleString()}
              </span>
              <div className="pointer-events-none absolute bottom-full right-0 mb-2 hidden group-hover:block z-30">
                <div className="relative bg-slate-800 text-white text-xs font-medium px-2.5 py-1.5 rounded-md shadow-lg whitespace-nowrap">
                  {totalStudentsText}
                  <div className="absolute top-full right-3 -mt-px border-4 border-transparent border-t-slate-800"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center justify-end pt-1">
          {isFree ? (
            <span className="text-base font-bold text-emerald-600">
              Miễn phí
            </span>
          ) : (
            <span className="text-xl font-bold text-amber-600">
              {formatPrice(course.price)}
            </span>
          )}
        </div>
        <Link
          href={`/learn/my-courses/${course.slug}`}
          className="mt-auto block w-full text-center bg-amber-500 hover:bg-amber-600 text-white font-medium py-2.5 rounded-lg transition-colors duration-200"
        >
          Học ngay
        </Link>
      </div>
    </div>
  );
}
