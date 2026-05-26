export type AttendanceStatus = "present" | "absent" | "rest" | "scheduled";

export interface AttendanceDay {
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
}

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();

function fmt(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const attendance: AttendanceDay[] = Array.from(
  { length: new Date(year, month + 1, 0).getDate() },
  (_, i) => {
    const d = new Date(year, month, i + 1);
    const dow = d.getDay();
    let status: AttendanceStatus = "present";
    if (dow === 0) status = "rest";
    else if (i % 7 === 4) status = "absent";
    else if (dow === 6 && i % 2 === 0) status = "rest";
    if (d > today) status = dow === 0 ? "rest" : "scheduled";
    return { date: fmt(d), status };
  },
);
