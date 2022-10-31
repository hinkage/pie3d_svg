export default function pathTop(d, w, h, ir) {
    let totalAngle = d.endAngle - d.startAngle;
    if (totalAngle === 0) {
        return 'M 0 0';
    }
    let depth = -d.__depth;
    let sx = w * Math.cos(d.startAngle);
    let sy = h * Math.sin(d.startAngle);
    let ex = w * Math.cos(d.endAngle);
    let ey = h * Math.sin(d.endAngle);
    let largeArc = totalAngle > Math.PI ? 1 : 0;
    let arc1 = `A ${w} ${h} 0 ${largeArc} 1 ${ex} ${ey + depth}`;
    let arc2 = `A ${w * ir} ${h * ir} 0 ${largeArc} 0 ${sx * ir} ${
        sy * ir + depth
    }`;
    return `M ${sx} ${sy + depth} ${arc1} L ${ex * ir} ${
        ey * ir + depth
    } ${arc2} z`;
}
