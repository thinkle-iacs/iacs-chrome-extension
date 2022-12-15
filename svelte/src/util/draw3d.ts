/**
drawRotated3D courtesy of Seth Lupo
**/
export function Rotater3D(ctx) {
  return {
    ctx,
    drawAt(
      x: number,
      y: number,
      angleX: number = 0,
      angleY: number = 0,
      angleZ: number = 0,
      drawer
    ) {
      this.ctx.resetTransform();

      let a = Math.cos(angleZ) * Math.cos(angleY);
      let b = Math.sin(angleZ) * Math.cos(angleY);
      let c =
        Math.cos(angleZ) * Math.sin(angleY) * Math.sin(angleX) -
        Math.sin(angleZ) * Math.cos(angleX);
      let d =
        Math.sin(angleZ) * Math.sin(angleY) * Math.sin(angleX) +
        Math.cos(angleZ) * Math.cos(angleX);

      this.ctx.transform(a, b, c, d, x, y);
      drawer();
      this.ctx.resetTransform();
    },
  };
}
