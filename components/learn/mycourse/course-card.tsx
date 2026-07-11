// ✅ THÊM DÒNG NÀY Ở ĐẦU FILE, TRƯỚC TẤT CẢ IMPORT
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/fake-courses";
import type { Course } from "@/lib/fake-courses";

type Props = { course: Course };

// ⚙️ CỔNG TÙY CHỈNH NHANH — GIỮ NGUYÊN 100%
const SLOT_MINUTES = 5; // ✅ Mục tiêu đổi 1 lần mỗi 5 phút → F5 không đổi nữa
const LATE_NIGHT_MIN = 1;
const LATE_NIGHT_MAX = 4;
const DAY_RATIO_MIN = 0.65;
const DAY_RATIO_MAX = 0.95;
const DAY_NOISE_PERCENT = 0.12;
const VIETNAM_TIMEZONE = "Asia/Ho_Chi_Minh";

// 🆕 MỚI: CẤU HÌNH CHI TIẾT 4 GIAI ĐOẠN GIỜ TRƯA — CHỈNH Ở ĐÂY
const LUNCH = {
  // 📉 Giai đoạn 1: GIẢM DẦN 11:00 → 11:30 (30 phút)
  DECREASE_START: 11 * 60 + 0, // 11:00
  DECREASE_END: 11 * 60 + 30, // 11:30
  DECREASE_START_RATIO: 0.8, // Bắt đầu ở 80% (mức bình thường)
  DECREASE_END_RATIO: 0.15, // Kết thúc ở 15%

  // 🥣 Giai đoạn 2: ĐÁY RẤT THẤP 11:35 → 12:55 (80 phút)
  BOTTOM_START: 11 * 60 + 35, // 11:35
  BOTTOM_END: 12 * 60 + 55, // 12:55
  BOTTOM_RATIO_MIN: 0.03, // Tối thiểu 3% → maxOnline=45 → ~1-2 người
  BOTTOM_RATIO_MAX: 0.07, // Tối đa 7% → maxOnline=45 → ~3 người

  // 📈 Giai đoạn 3: TĂNG DẦN 13:05 → 13:35 (30 phút)
  INCREASE_START: 13 * 60 + 5, // 13:05
  INCREASE_END: 13 * 60 + 35, // 13:35
  INCREASE_START_RATIO: 0.15, // Bắt đầu tăng từ 15%
  INCREASE_END_RATIO: 0.8, // Hết giai đoạn về 80% = bình thường
};
const SPECIAL = {
  // 🌙 00:00 -> 01:00 giảm dần
  NIGHT_DEC_START: 0,
  NIGHT_DEC_END: 60,
  NIGHT_DEC_START_RATIO: 0.35,
  NIGHT_DEC_END_RATIO: 0.02,

  // 😴 01:00 -> 04:30 đáy
  NIGHT_BOTTOM_START: 60,
  NIGHT_BOTTOM_END: 4 * 60 + 30,
  NIGHT_BOTTOM_MIN: 0,
  NIGHT_BOTTOM_MAX: 0.03,

  // 🌅 04:30 -> 07:00 tăng nhẹ
  MORNING_START: 4 * 60 + 30,
  MORNING_END: 7 * 60,
  MORNING_START_RATIO: 0.05,
  MORNING_END_RATIO: 0.4,

  // 🌇 18:00 -> 18:30 giảm dần
  EVENING_DEC_START: 18 * 60,
  EVENING_DEC_END: 18 * 60 + 30,
  EVENING_DEC_START_RATIO: 0.6,
  EVENING_DEC_END_RATIO: 0.3,

  // 🍽 18:30 -> 18:50 duy trì mức thấp
  EVENING_BOTTOM_START: 18 * 60 + 30,
  EVENING_BOTTOM_END: 18 * 60 + 50,
  EVENING_BOTTOM_MIN: 0.25,
  EVENING_BOTTOM_MAX: 0.35,

  // 🌆 18:50 -> 19:00 tăng lại
  EVENING_INC_START: 18 * 60 + 50,
  EVENING_INC_END: 19 * 60,
  EVENING_INC_START_RATIO: 0.35,
  EVENING_INC_END_RATIO: 0.65,
};
// 🆕 MỚI: Cấu hình chuyển tiếp MƯỢT MÀ trong 5 phút
const SLOT_MS = SLOT_MINUTES * 60 * 1000; // 300.000ms = 5 phút
// Cập nhật nhỏ mỗi 2–8 giây → số tăng/giảm từ từ, không nhảy vọt
const UPDATE_INTERVALS = [2_000, 3_000, 5_000, 8_000];
function pickRandomInterval(): number {
  return UPDATE_INTERVALS[Math.floor(Math.random() * UPDATE_INTERVALS.length)];
}

// 🧠 GIỮ NGUYÊN 100%
function hashStringToNumber(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
}

// ⏰ GIỮ NGUYÊN 100%
function getVietnamTime(now: Date = new Date()): {
  hours: number;
  minutes: number;
  year: number;
  month: number;
  day: number;
  msInSlot: number;
} {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: VIETNAM_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const get = (type: string) =>
    parseInt(parts.find((p) => p.type === type)!.value, 10);

  const hours = get("hour");
  const minutes = get("minute");
  const seconds = get("second");

  const slotStartMinute = Math.floor(minutes / SLOT_MINUTES) * SLOT_MINUTES;
  const msInSlot =
    (minutes - slotStartMinute) * 60 * 1000 +
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

// 🆕 MỚI: HÀM CHÍNH TÍNH TỈ LỆ MỤC TIÊU THEO GIAI ĐOẠN GIỜ TRƯA
//     Trả về tỉ lệ 0 → 1 so với maxOnline, tại phút hiện tại
function getLunchBaseRatio(currentMinutes: number): number {
  // 📉 1) GIẢM DẦN: 11:00 → 11:30 (tuyến tính từ 80% → 15%)
  if (
    currentMinutes >= LUNCH.DECREASE_START &&
    currentMinutes < LUNCH.DECREASE_END
  ) {
    const t =
      (currentMinutes - LUNCH.DECREASE_START) /
      (LUNCH.DECREASE_END - LUNCH.DECREASE_START);
    // ease-out: giảm nhanh lúc đầu, chậm dần về cuối → tự nhiên hơn
    const eased = 1 - Math.pow(1 - t, 2);
    return (
      LUNCH.DECREASE_START_RATIO +
      (LUNCH.DECREASE_END_RATIO - LUNCH.DECREASE_START_RATIO) * eased
    );
  }

  // ⬇️ 1b) Chuyển nhanh xuống đáy: 11:30 → 11:35 (5 phút)
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

  // 🥣 2) ĐÁY RẤT THẤP: 11:35 → 12:55 (3% → 7%)
  if (
    currentMinutes >= LUNCH.BOTTOM_START &&
    currentMinutes < LUNCH.BOTTOM_END
  ) {
    // Dao động nhẹ quanh mức trung bình 5%, dùng hash để mỗi slot hơi khác
    return (LUNCH.BOTTOM_RATIO_MIN + LUNCH.BOTTOM_RATIO_MAX) / 2;
  }

  // ⬆️ 2b) Chuẩn bị tăng: 12:55 → 13:05 (10 phút)
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

  // 📈 3) TĂNG DẦN: 13:05 → 13:35 (tuyến tính từ 15% → 80%)
  if (
    currentMinutes >= LUNCH.INCREASE_START &&
    currentMinutes < LUNCH.INCREASE_END
  ) {
    const t =
      (currentMinutes - LUNCH.INCREASE_START) /
      (LUNCH.INCREASE_END - LUNCH.INCREASE_START);
    // ease-in: tăng chậm lúc đầu, nhanh dần → người vào học dần
    const eased = t * t;
    return (
      LUNCH.INCREASE_START_RATIO +
      (LUNCH.INCREASE_END_RATIO - LUNCH.INCREASE_START_RATIO) * eased
    );
  }

  // ❌ Ngoài khung trưa → trả về -1 = dùng logic ban ngày / đêm
  return -1;
}
function getSpecialTimeRatio(currentMinutes: number, r2: number): number {
  // 🌙 00:00 -> 01:00 giảm dần
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

  // 😴 01:00 -> 04:30 đáy
  if (
    currentMinutes >= SPECIAL.NIGHT_BOTTOM_START &&
    currentMinutes < SPECIAL.NIGHT_BOTTOM_END
  ) {
    return (
      SPECIAL.NIGHT_BOTTOM_MIN +
      r2 * (SPECIAL.NIGHT_BOTTOM_MAX - SPECIAL.NIGHT_BOTTOM_MIN)
    );
  }

  // 🌅 04:30 -> 07:00 tăng dần
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

  // 🌇 18:00 -> 18:30 giảm dần
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

  // 🍽 18:30 -> 18:50 dao động mức thấp
  if (
    currentMinutes >= SPECIAL.EVENING_BOTTOM_START &&
    currentMinutes < SPECIAL.EVENING_BOTTOM_END
  ) {
    return (
      SPECIAL.EVENING_BOTTOM_MIN +
      r2 * (SPECIAL.EVENING_BOTTOM_MAX - SPECIAL.EVENING_BOTTOM_MIN)
    );
  }

  // 🌆 18:50 -> 19:00 tăng trở lại
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
// 🎯 LOGIC TÍNH GIÁ TRỊ MỤC TIÊU CỦA MỖI SLOT 5 PHÚT
function getTargetAtTime(
  courseId: string,
  maxOnline: number,
  now: Date = new Date(),
): number {
  const { year, month, day, hours, minutes } = getVietnamTime(now);
  const currentMinutes = hours * 60 + minutes;

  // 1️⃣ Tạo KHÓA THỜI GIAN CỐ ĐỊNH từ giờ VN
  const slot = Math.floor(minutes / SLOT_MINUTES);
  const timeKey = `${year}-${month}-${day}-${hours}-${slot}`;
  const seed = `${courseId}__${timeKey}`;

  const r1 = hashStringToNumber(seed);
  const r2 = hashStringToNumber(seed + ":noise");

  const specialRatio = getSpecialTimeRatio(currentMinutes, r2);

  if (specialRatio >= 0) {
    return Math.round(maxOnline * specialRatio);
  }

  // 🍱 3️⃣ GIỜ TRƯA
  const lunchBaseRatio = getLunchBaseRatio(currentMinutes);
  const isLunchTime = lunchBaseRatio > 0;

  if (isLunchTime) {
    let finalRatio: number;

    // 🥣 Giai đoạn đáy: mỗi slot 5 phút sẽ có một tỉ lệ ngẫu nhiên 3% → 7%
    if (
      currentMinutes >= LUNCH.BOTTOM_START &&
      currentMinutes < LUNCH.BOTTOM_END
    ) {
      finalRatio =
        LUNCH.BOTTOM_RATIO_MIN +
        r2 * (LUNCH.BOTTOM_RATIO_MAX - LUNCH.BOTTOM_RATIO_MIN);
    } else {
      // Các giai đoạn còn lại vẫn thêm nhiễu ±10%
      const noise = (r2 * 2 - 1) * 0.1;
      finalRatio = lunchBaseRatio * (1 + noise);
    }

    const baseValue = Math.round(maxOnline * finalRatio);
    const result = Math.max(1, baseValue);

    return Math.min(result, maxOnline);
  }

  // ☀️ 4️⃣ BAN NGÀY BÌNH THƯỜNG (trước 11h / sau 13:35) — GIỮ NGUYÊN
  const baseRatio = DAY_RATIO_MIN + r1 * (DAY_RATIO_MAX - DAY_RATIO_MIN);
  const baseValue = Math.round(maxOnline * baseRatio);
  const noise = Math.round(baseValue * (r2 * 2 - 1) * DAY_NOISE_PERCENT);
  const result = Math.max(3, baseValue + noise);

  return Math.min(result, maxOnline);
}

// 🧈 HÀM MƯỢT MÀ — GIỮ NGUYÊN 100% LOGIC NỘI SUY 5 PHÚT
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
  const rounded = Math.round(smooth);

  return Math.max(0, Math.min(rounded, maxOnline));
}

// ============================================================
// 🔧 SINGLETON + CACHE GIỜ VN — GIỮ NGUYÊN 100%
// ============================================================
const TIME_API = "/api/vn-time";
const VN_TIME_CACHE_KEY = "vn_time_offset_v1";
const CACHE_TTL_MS = 10 * 60 * 1000;
const RESYNC_AFTER_MS = 30 * 60 * 1000;
const RETRY_ON_FAIL_MS = 10 * 1000;

let globalOffsetMs = 0;
let globalReady = false;
let globalFetchPromise: Promise<void> | null = null;
let globalResyncTimer: ReturnType<typeof setTimeout> | null = null;

function readCache(): number | null {
  try {
    const raw = localStorage.getItem(VN_TIME_CACHE_KEY);
    if (!raw) return null;
    const { offset, savedAt } = JSON.parse(raw);
    if (Date.now() - savedAt > CACHE_TTL_MS) return null;
    return typeof offset === "number" ? offset : null;
  } catch {
    return null;
  }
}

function writeCache(offset: number) {
  try {
    localStorage.setItem(
      VN_TIME_CACHE_KEY,
      JSON.stringify({ offset, savedAt: Date.now() }),
    );
  } catch {}
}

async function syncServerTimeSingleton() {
  if (globalFetchPromise) return globalFetchPromise;

  const cached = readCache();
  if (cached !== null) {
    globalOffsetMs = cached;
    globalReady = true;
    return;
  }

  globalFetchPromise = (async () => {
    try {
      const tSend = Date.now();
      const res = await fetch(TIME_API, { cache: "no-store" });
      const tRecv = Date.now();
      if (!res.ok) throw new Error("API lỗi");

      const data = await res.json();
      const networkLatency = (tRecv - tSend) / 2;
      const realUtc = (data.utc as number) + networkLatency;

      globalOffsetMs = realUtc - tRecv;
      globalReady = true;
      writeCache(globalOffsetMs);
    } catch {
      setTimeout(syncServerTimeSingleton, RETRY_ON_FAIL_MS);
    } finally {
      globalFetchPromise = null;
    }
  })();

  if (!globalResyncTimer) {
    globalResyncTimer = setTimeout(() => {
      globalResyncTimer = null;
      try {
        localStorage.removeItem(VN_TIME_CACHE_KEY);
      } catch {}
      syncServerTimeSingleton();
    }, RESYNC_AFTER_MS);
  }

  return globalFetchPromise;
}

// ============================================================
// 🎨 COMPONENT CHÍNH — GIỮ NGUYÊN 100% GIAO DIỆN
// ============================================================
export function CourseCard({ course }: Props) {
  const isFree = course.price === 0;
  const [online, setOnline] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getRealNow = useCallback(() => {
    return new Date(Date.now() + globalOffsetMs);
  }, []);

  const [timeReady, setTimeReady] = useState(globalReady);

  useEffect(() => {
    let alive = true;
    const run = async () => {
      await syncServerTimeSingleton();
      if (alive) setTimeReady(true);
    };
    run();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!timeReady) return;

    const update = () => {
      const newCount = getSmoothOnlineCount(
        course.id,
        course.maxOnline,
        getRealNow(),
      );
      setOnline((prev) => (prev === newCount ? prev : newCount));
      timerRef.current = setTimeout(update, pickRandomInterval());
    };

    update();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [course.id, course.maxOnline, timeReady, getRealNow]);

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
              <span
                className="text-xs sm:text-sm font-semibold text-emerald-700 tabular-nums transition-all duration-500 whitespace-nowrap"
                key={online}
              >
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
            <span className="text-base font-bold text-emerald-600 flex items-center gap-1">
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
