import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

dayjs.extend(relativeTime);

export enum SupportedFormats {
  DATE_AT_TIME = "MMMM D, YYYY [at] h:mm a",
  TIME_SHORT = "h:mm A"
}

export default dayjs;
