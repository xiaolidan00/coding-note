function letterCasePermutation(str) {
  function isLetter(ch) {
    return (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z");
  }
  const ans = new Array();
  const n = str.length;
  let m = 0;
  for (let i = 0; i < n; i++) m += isLetter(str[i]) ? 1 : 0;
  for (let s = 0; s < 1 << m; s++) {
    let cur = "";
    for (let i = 0, j = 0; i < n; i++) {
      if (!isLetter(str[i]) || ((s >> j) & 1) == 0) cur += str[i];
      else cur += String.fromCharCode(str.charCodeAt(i) ^ 32);
      if (isLetter(str[i])) j++;
    }
    ans.push(cur);
  }
  return ans;
}
console.log(letterCasePermutation("a1b2"));
