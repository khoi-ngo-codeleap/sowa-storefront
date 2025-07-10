import dayjs, { SupportedFormats } from "@/lib/dayjs";

export default function FormattedTime({ time }: { time: string }) {
  return (
    <span className="min-w-fit">
      {dayjs(time).local().format(SupportedFormats.TIME_SHORT)}
    </span>
  );
}
