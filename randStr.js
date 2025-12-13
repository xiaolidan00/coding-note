const NUM_LETTER = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLOMNOPQRSTUVWXYZ";
export function getRandStr(len = 6) {
  const s = [];
  for (let i = 0; i < len; i++) {
    s.push(NUM_LETTER[Math.round(Math.random() * 999) % NUM_LETTER.length]);
  }
  return s.join("");
}
