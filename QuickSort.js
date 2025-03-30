function quickSort(s, l, r) {
  if (l < r) {
    let i = l,
      j = r,
      x = s[l];
    while (i < j) {
      while (i < j && s[j] >= x) {
        j--;
      }
      if (i < j) {
        s[i++] = s[j];
      }
      while (i < j && s[i] < x) {
        i++;
      }
      if (i < j) {
        s[j--] = s[i];
      }
    }
    s[i] = x;
    quickSort(s, l, i - 1);
    quickSort(s, i + 1, r);
  }
}
const list = [3, 5, 2, 6, 1, 4, 7];
quickSort(list, 0, list.length - 1);
console.log(list);
