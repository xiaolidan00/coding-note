import { type AxiosPromise } from 'axios';
import apidoc from './api-doc.ts';
import request from '@/utils/axios.js';
type ApiType = {
  [n in keyof typeof apidoc]: (c?: any) => AxiosPromise;
};
const API = {} as ApiType;
for (let k in apidoc) {
  const set = apidoc[k as keyof typeof apidoc];
  API[k as keyof typeof apidoc] = (config: any = {}) => {
    let url = set.url;
    if (set.isPath) {
      url = url.replace(/\/\{([a-zA-Z]+)\}/g, (str: string, match: string) => {
        return '/' + config.pathData[match];
      });
    }

    return request({ ...set, url, ...config });
  };
}
console.log('API', apidoc, API);
export default API;
