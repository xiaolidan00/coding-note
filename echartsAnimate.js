export const echartsAnimate = (chart, options) => {
  let preCount = 0,
    count = 0;
  const sNum = options.series.length;

  const sLen = sNum ? options.series[0].data.length : 1;
  let dataLen = 0;
  options.series.forEach((s, idx) => {
    dataLen += s.data.length;
  });
  setInterval(() => {
    if (count >= dataLen) {
      count = 0;
    }

    chart.dispatchAction({
      type: "downplay",
      seriesIndex: parseInt(preCount / sLen) % sNum,
      dataIndex: preCount % sLen
    });
    chart.dispatchAction({
      type: "hideTip",
      seriesIndex: parseInt(preCount / sLen) % sNum,
      dataIndex: preCount % sLen
    });

    chart.dispatchAction({
      type: "highlight",
      seriesIndex: parseInt(count / sLen) % sNum,
      dataIndex: count % sLen
    });
    chart.dispatchAction({
      type: "showTip",
      seriesIndex: parseInt(count / sLen) % sNum,
      dataIndex: count % sLen
    });

    preCount = count;

    count++;
  }, 2000);
};
