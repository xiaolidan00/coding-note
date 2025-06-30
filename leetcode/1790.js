function areAlmostEqual(s1, s2) {
  const n = s1.length;
  //记录需要交换的字符串索引
  let a = -1,
    b = -1;
  for (let i = 0; i < n; i++) {
    //字符相同则跳过
    if (s1[i] == s2[i]) continue;
    //字符串不同，记录前后索引
    if (a == -1) a = i;
    else if (b == -1) b = i;
    //字符不同的数量超过两个，则不符合，返回false
    else return false;
  }
  //没有不同的字符，代表字符串完全一样，返回true
  if (a == -1) return true;
  //有一个不同的字符，不符合，返回false
  if (b == -1) return false;
  //要交换的前后索引字符交换后一样，返回true
  return s1[a] === s2[b] && s1[b] == s2[a];
}

console.log(areAlmostEqual("bank", "kanb"));
console.log(areAlmostEqual("abcd", "dcba"));
