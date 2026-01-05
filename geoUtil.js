export function travelGeo(geojson, cb) {
  geojson.features.forEach((a) => {
    if (a.geometry.type === "MultiPolygon") {
      a.geometry.coordinates.forEach((b) => {
        b.forEach((c) => {
          cb(c);
        });
      });
    } else {
      a.geometry.coordinates.forEach((c) => {
        cb(c);
      });
    }
  });
}
export function getGeojsonBound(geojson) {
  const bound = {
    minlng: Number.MAX_SAFE_INTEGER,
    minlat: Number.MAX_SAFE_INTEGER,
    maxlng: 0,
    maxlat: 0
  };
  travelGeo(geojson, (c) => {
    c.forEach((item) => {
      bound.minlng = Math.min(bound.minlng, item[0]);
      bound.minlat = Math.min(bound.minlat, item[1]);
      bound.maxlng = Math.max(bound.maxlng, item[0]);
      bound.maxlat = Math.max(bound.maxlat, item[1]);
    });
  });
  return bound;
}
