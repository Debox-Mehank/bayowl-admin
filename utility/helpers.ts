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
