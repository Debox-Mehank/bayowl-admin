export const durationSeconds = (timeExpr: string) => {
  var units = { h: 3600, m: 60, s: 1 };
  var regex = /(\d+)([hms])/g;

  let seconds = 0;
  var match: "h" | "m" | "s" | null | RegExpExecArray;
  while ((match = regex.exec(timeExpr))) {
    seconds += parseInt(match[1]) * units[match[2] as "h" | "s" | "m"];
  }

  return seconds;
};

export const secondsToTime = (d: number) => {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return hDisplay + mDisplay + sDisplay;
};
