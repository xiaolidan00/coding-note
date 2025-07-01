function kthGrammar(n, k) {
  function dfs(r, c, cur) {
    if (r == 1) return cur;
    if ((c % 2 == 0 && cur == 0) || (c % 2 == 1 && cur == 1)) return dfs(r - 1, Math.floor((c - 1) / 2) + 1, 1);
    else return dfs(r - 1, Math.floor((c - 1) / 2) + 1, 0);
  }
  return dfs(n, k, 1) == 0 ? 1 : 0;
}
console.log(kthGrammar(2, 2));
console.log(kthGrammar(2, 1));
