export default function pathEnd(d, w, h, ir) {
    let x1 = w * Math.cos(d.endAngle);
    let y1 = h * Math.sin(d.endAngle);
    let xi1 = x1 * ir;
    let yi1 = y1 * ir;
    let depth = d.__depth;
    return `M ${x1} ${y1} L ${x1} ${y1 - depth} L ${xi1} ${
        yi1 - depth
    } L ${xi1} ${yi1} z`;
}
