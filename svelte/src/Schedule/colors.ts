import chroma from "chroma-js";

let colors = [
  "var(--material-color-blue-light)",
  "var(--material-color-light-green-light)",
  "var(--material-color-deep-orange-light)",
  "var(--material-color-yellow-light)",
  "var(--material-color-cyan-light)",
  "var(--material-color-brown-light)",
  "var(--material-color-blue-grey-light)",
  "var(--material-color-green-light)",
  "var(--material-color-teal-light)",
  "var(--material-color-pink-light)",
  "var(--material-color-amber-light)",
  "var(--material-color-orange-light)",
  "var(--material-color-light-green-light)",
  "var(--material-color-light-blue-light)",
];
let colorMap = {
  A: "var(--material-color-amber-light)",
  B: "var(--material-color-light-blue-light)",
  C: "var(--material-color-green-light)",
  D: "var(--material-color-deep-orange-light)",
  E: "var(--material-color-purple-light)",
  F: "var(--material-color-red-light)",
  L: "var(--material-color-grey-light)",
  Lunch: "var(--material-color-grey-light)",
  LAdv: "var(--material-color-grey-light)",
  Advisory: "var(--material-color-grey-light)",
  WINAdv: "var(--material-color-orange-light)",
  WIN: "var(--material-color-orange-light)",
  Recess: "var(--material-color-grey-light)",
};
let colorCount = 0;
export function getColor(name, colorDic) {
  if (colorDic[name]) {
    return colorDic[name];
  }
  if (!name) {
    return "white";
  }
  name = name.replace("+Proj", "");
  name = name.replace(/[+]ELA.?/, "");
  name = name.replace("9/10", "");
  name = name.replace("11/12", "");
  name = name.replace(/[5678]th/, "");
  name = name.replace(/\W+/g, "");
  name = name.replace(/[4-9]+/g, "");

  if (colorMap[name]) {
    return colorMap[name];
  } else {
    colorMap[name] = colors[colorCount % colors.length];
    colorCount += 1;
  }
}

export function getContrastingColor(
  bg: string,
  currentFG: string
): string | void {
  if (chroma.contrast(bg, currentFG) < 4.5) {
    if (chroma(bg).luminance() > 0.5) {
      console.log("Darkening for", bg, chroma(currentFG).darken(4).hex());
      return chroma(currentFG).darken(4).hex();
    } else {
      console.log("Brightneing for", bg, chroma(currentFG).brighten(4).hex());
      return chroma(currentFG).brighten(4).hex();
    }
  }
}
