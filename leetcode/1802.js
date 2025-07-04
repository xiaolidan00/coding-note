function maxValue(n, index, maxSum) {
  function check(n, x, idx, maxSum) {
    let sum = x;
    if (idx > x - 1) {
      let an = x - 1,
        a1 = 1,
        cnt = x - 1;
      sum += (cnt * (a1 + an)) / 2;
      sum += idx - cnt;
    } else {
      let cnt = idx,
        an = x - 1,
        a1 = an - cnt - 1;
      sum += (cnt * (a1 + an)) / 2;
    }
    if (n - idx - 1 > x - 1) {
      let an = x - 1,
        a1 = 1,
        cnt = x - 1;
      sum += (cnt * (a1 + an)) / 2;
      sum += n - idx - 1 - cnt;
    } else {
      let cnt = n - idx,
        an = x - 1,
        a1 = an - cnt + 1;
      sum += (cnt * (a1 + an)) / 2;
    }
    return sum < maxSum;
  }
  let l = 1,
    r = maxSum;
  //贪心+二分法
  while (l < r) {
    let mid = (l + r + 1) >> 1;
    if (check(n, mid, index, maxSum)) l = mid;
    else r = mid - 1;
  }
  return r;
}
console.log(maxValue(4, 2, 6)); //2
console.log(maxValue(6, 1, 10)); //3
