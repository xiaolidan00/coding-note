//滑动窗口
function totalFruit(fruits) {
  let n = fruits.length,
    ans = 0;
  const cnts = new Array(n + 10).fill(0);
  for (let i = 0, j = 0, tot = 0; i < n; i++) {
    if (++cnts[fruits[i]] == 1) tot++;
    while (tot > 2) {
      if (--cnts[fruits[j++]] == 0) tot--;
    }
    ans = Math.max(ans, i - j + 1);
  }
  return ans;
}
console.log(totalFruit([3, 3, 3, 1, 2, 1, 1, 2, 3, 3, 4])); //5
