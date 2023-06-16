import dayjs from "dayjs";
import relativetime from "dayjs/plugin/relativeTime";
import { BurnStatus, BurnTimeFrame } from "./types.ts";

dayjs.extend(relativetime);

export const getBurnValueLabel = (burnValue: number) => {
  // 0 - 7
  switch (burnValue) {
    case 0:
      return "30 Minutes";
    case 1:
      return "1 Hour";
    case 2:
      return "2 Hours";
    case 3:
      return "6 Hours";
    case 4:
      return "12 Hours";
    case 5:
      return "1 Day";
    case 6:
      return "2 Days";
    case 7:
      return "1 Week";
  }
};

export const getBurnTimeFrame = (burnValue: number): BurnTimeFrame => {
  if (burnValue < 0) {
    return { count: 30, unit: "minutes" };
  }

  switch (burnValue) {
    case 0:
      return { count: 30, unit: "minutes" };
    case 1:
      return { count: 1, unit: "hour" };
    case 2:
      return { count: 2, unit: "hours" };
    case 3:
      return { count: 6, unit: "hours" };
    case 4:
      return { count: 12, unit: "hours" };
    case 5:
      return { count: 1, unit: "day" };
    case 6:
      return { count: 2, unit: "days" };
    case 7:
      return { count: 7, unit: "days" };
  }

  return { count: 7, unit: "days" };
};

export const getBurnStatus = (
  createdAt: string,
  burnAfter: BurnTimeFrame,
): BurnStatus => {
  const parsed = dayjs(createdAt);
  const burnDate = parsed.add(burnAfter.count, burnAfter.unit);

  const now = dayjs();
  const burned = now.isAfter(burnDate);

  return {
    burned,
    burnWithin: burned ? "EXPIRED" : burnDate.fromNow(),
  };
};
