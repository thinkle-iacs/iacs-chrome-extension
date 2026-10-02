let defaultURL = `https://script.google.com/macros/s/AKfycbwMbmd-9KnPDPyK3F-ziSLSSulwIpmvD0bja_s7N-trdiqAZLqgpsSocIAPHirLZb67/exec`;
let baseURL = process.env.GASURL || defaultURL;

export let GASURL = `${baseURL}?mode=${process.env.MODE}`;
export default { GASURL };
