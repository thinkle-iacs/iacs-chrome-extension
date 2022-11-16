let defaultURL = `https://script.google.com/macros/s/AKfycbwMbmd-9KnPDPyK3F-ziSLSSulwIpmvD0bja_s7N-trdiqAZLqgpsSocIAPHirLZb67/exec?mode=MODE`;
let baseURL = "process.env.GASURL?mode=MODE" || defaultURL;

export let GASURL = baseURL;
export default { GASURL };
