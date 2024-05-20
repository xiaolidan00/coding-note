export function formatDate(value, f) {
  let time = 0;
  if (value instanceof Date) time = value.getTime();
  else if (typeof value === "number") time = value;
  else if (typeof value === "string") time = getDateTime(value);
  if (f && time) {
    let format = f;

    let d = new Date(time);
    var o = {
      "M+": d.getMonth() + 1, // month
      "d+": d.getDate(), // day
      "H+": d.getHours(), // hour
      "m+": d.getMinutes(), // minute
      "s+": d.getSeconds(), // second
      "q+": Math.floor((d.getMonth() + 3) / 3), // quarter
      // S: this.getMilliseconds()
      // millisecond
    };
    if (/(y+)/.test(format)) {
      format = format.replace(
        RegExp.$1,
        (d.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? o[k]
            : ("00" + o[k]).substr(("" + o[k]).length)
        );
      }
    }

    return format;
  }
  return new Date(time).toString();
}

export function getDate(d) {
  let time = new Date(d + " 00:00:00").getTime();
  if (Number.isNaN(time)) {
    let s = d.replace(/[\/.-]+/g, "");
    let dd = "";
    if (s.indexOf("年") > -1) {
      s = s.split("年");
      let h = s[0];
      dd += h;
      s = s[1];
    }
    if (s.indexOf("月") > -1) {
      s = s.split("月");
      let h = s[0];
      if (dd) {
        dd += "-" + h;
      } else {
        dd = "1970-" + h;
      }
      s = s[1];
    }
    if (s.indexOf("日") > -1) {
      let h = s.split("日")[0];
      if (dd) {
        dd += "-" + h;
      } else {
        dd = "1970-01-" + h;
      }
    }
    return new Date(dd + " 00:00:00").getTime();
  } else {
    return time;
  }
}
const hour = 3600000;
export function getTime(s) {
  let time = 0;
  if (s.indexOf(":") > -1) {
    s = s.split[":"];
    if (s.length === 3) {
      time = parseInt(s[0]) * hour;
      time += parseInt(s[1]) * 60000;
      time += parseInt(s[2]) * 1000;
    } else if (s.length === 2) {
      time = parseInt(s[0]) * hour;
      time += parseInt(s[1]) * 60000;
    } else if (s.length === 1) {
      time = parseInt(s[0]) * hour;
    }
  } else if (s) {
    if (s.indexOf("时") > -1) {
      s = s.split("时");
      let h = s[0];
      time = parseInt(h) * hour;
      s = s[1];
    }
    if (s.indexOf("分") > -1) {
      s = s.split("分");
      let h = s[0];
      time += parseInt(h) * 60000;
      s = s[1];
    }
    if (s.indexOf("秒") > -1) {
      s = s.split("秒");
      let h = s[0];
      time += parseInt(h) * 1000;
    }
  }
  return time;
}
export function getDateTime(str) {
  if (!Number.isNaN(new Date(str).getTime()) && !/[时分秒年月日]+/.test(str)) {
    return new Date(str).getTime();
  }
  let ss = str.split(" ");
  let d = ss[0];
  let date = getDate(d);
  let s = ss[1];
  let time = getTime(s);
  return date + time;
}
