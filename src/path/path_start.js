export default function pathStart(d, w, h, ir) {
    let x0 = w * Math.cos(d.startAngle);
    let y0 = h * Math.sin(d.startAngle);
    let xi0 = x0 * ir;
    let yi0 = y0 * ir;
    let depth = d.__depth;
    return `M ${x0} ${y0} L ${x0} ${y0 - depth} L ${xi0} ${
        yi0 - depth
    } L ${xi0} ${yi0} z`;
}
