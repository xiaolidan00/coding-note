export const copyStr = (str: string) => {
  const dom = document.createElement('input');
  dom.value = str;
  dom.style.position = 'fixed';
  dom.style.opacity = '0';
  document.body.appendChild(dom);
  dom.select();
  document.execCommand('copy');
  document.body.removeChild(dom);
};

export const copyText = (str: string) => {
  navigator.clipboard.writeText(str);
};
