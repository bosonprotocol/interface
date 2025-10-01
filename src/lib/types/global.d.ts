declare global {
  namespace dayjs {
    type Dayjs = import("dayjs").Dayjs;
  }
}

export {}; // This makes it a module
