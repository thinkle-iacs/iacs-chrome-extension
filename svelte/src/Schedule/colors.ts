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

function resolveCssVar(color: string, depth = 0): string {
  if (!color || depth > 4) {
    return color;
  }

  const trimmed = color.trim();
  const match = trimmed.match(/^var\((--[^,\s)]+)(?:,\s*([^)]+))?\)$/);
  if (!match || typeof window === "undefined") {
    return trimmed;
  }

  const [, variableName, fallback] = match;
  const resolved = getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();

  if (resolved) {
    return resolveCssVar(resolved, depth + 1);
  }
  if (fallback) {
    return resolveCssVar(fallback, depth + 1);
  }
  return trimmed;
}

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
  const resolvedBG = resolveCssVar(bg);
  const resolvedFG = resolveCssVar(currentFG);

  try {
    if (chroma.contrast(resolvedBG, resolvedFG) < 4.5) {
      if (chroma(resolvedBG).luminance() > 0.5) {
        return chroma(resolvedFG).darken(4).hex();
      } else {
        return chroma(resolvedFG).brighten(4).hex();
      }
    }
  } catch (error) {
    return;
  }
}
