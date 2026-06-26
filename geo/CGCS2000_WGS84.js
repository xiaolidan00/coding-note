import proj4 from "proj4";

/**
 * 将CGCS2000坐标转换为WGS84坐标
 * @param {number} lon_cgcs - CGCS2000经度 (X)
 * @param {number} lat_cgcs - CGCS2000纬度 (Y)
 * @returns {{lon: number, lat: number}} WGS84的经度和纬度
 */
function transformCgcs2000ToWgs84(lon_cgcs, lat_cgcs) {
  // CGCS2000 3度带 第38带 (中央经线 114°E, EPSG:4526)
  const cgcs2000 = "+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs";

  // WGS84 地理坐标系 (EPSG:4326)
  const wgs84 = "+proj=longlat +datum=WGS84 +no_defs";

  // 执行转换
  const [lon, lat] = proj4(cgcs2000, wgs84, [lon_cgcs, lat_cgcs]);

  return {lon, lat};
}
// 示例用法
const wgs84Point = transformCgcs2000ToWgs84(485829.369, 2514263.379);

console.log(`WGS84 经度: ${wgs84Point.lon}, 纬度: ${wgs84Point.lat}`);
