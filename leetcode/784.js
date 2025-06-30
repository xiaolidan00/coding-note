function letterCasePermutation(s) {
  const ans = new Array();
  const n = s.length;
  function dfs(idx, cur) {
    if (idx == n) {
      ans.push(cur);
      return;
    }
    //添加原字符
    dfs(idx + 1, cur + s[idx]);
    //转换大小写
    if ((s[idx] >= "a" && s[idx] <= "z") || (s[idx] >= "A" && s[idx] <= "Z")) {
      dfs(idx + 1, cur + String.fromCharCode(s.charCodeAt(idx) ^ 32));
    }
  }
  dfs(0, "");
  return ans;
}
console.log(letterCasePermutation("a1b2"));
