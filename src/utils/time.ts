import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export function formatSeconds(seconds?: number) {
  if (seconds === undefined) return;
  const timeDuration = dayjs.duration(seconds, "seconds");

  const hours = timeDuration.hours();
  const minutes = timeDuration.minutes();
  const secs = timeDuration.seconds();

  return [hours, minutes, secs]
    .filter((v, i) => {
      // 移除为0的单位
      if (i === 0) return v !== 0;
      return true;
    })
    .map((v) => String(v).padStart(2, "0"))
    .join(":");
}
