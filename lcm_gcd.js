function gcd(a, b) {
  // 计算最大公约数（GCD）
  while (b !== 0) {
    let temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function lcm(a, b) {
  // 计算最小公倍数（LCM）
  if (a === 0 || b === 0) {
    return 0; // 特殊情况：如果任一数为0，LCM为0
  }
  return Math.abs(a * b) / gcd(a, b);
}

// 示例使用
console.log(lcm(12, 18)); // 输出：36
console.log(lcm(5, 7)); // 输出：35
