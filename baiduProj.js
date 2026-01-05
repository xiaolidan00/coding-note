import proj4 from "proj4";
const projection = "baiduProj";
proj4.defs(
  projection,
  `+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs +type=crs`
);
const imageWidth = 512;
const getScale = (zoom) => {
  return imageWidth * Math.pow(2, 18 - zoom);
};
//该像素大小的缩放等级
const getZoom = (scale) => {
  return Math.log(scale / imageWidth) / Math.LN2;
};
const lnglat2px = (a, zoom) => {
  const s = getScale(zoom);
  const xy = proj4(projection)
    .forward(a)
    .map((t) => t / s);

  return xy;
};

const px2lnglat = (a, zoom) => {
  const s = getScale(zoom);
  const p = a.map((t) => t * s);
  return proj4(projection).inverse(p);
};

const zzz = 11;
const aaa = lnglat2px([114.103482, 22.636422], zzz);
const top = px2lnglat([aaa[0] - 960, aaa[1] - 460], zzz);
const bottom = px2lnglat([aaa[0] + 960, aaa[1] + 460], zzz);
console.log(aaa, top, bottom);
