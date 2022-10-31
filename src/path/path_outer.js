import { twoPI } from '../util.js';

export default function pathOuter(d, rx, ry, ir) {
    let startAngle = d.startAngle % twoPI;
    let endAngle = d.endAngle % twoPI;

    let extra = '';
    let backupEndAngle = null;
    if (startAngle > endAngle) {
        if (startAngle > Math.PI) {
            startAngle = 0;
        } else {
            backupEndAngle = endAngle;
            endAngle = Math.PI;
        }
    }

    startAngle = Math.min(startAngle, Math.PI);
    endAngle = Math.min(endAngle, Math.PI);

    let sx = rx * Math.cos(startAngle),
        sy = ry * Math.sin(startAngle),
        ex = rx * Math.cos(endAngle),
        ey = ry * Math.sin(endAngle);
    let depth = -d.__depth;

    let arc1 = `A ${rx} ${ry} 0 0 1 ${ex} ${ey + depth}`;
    let arc2 = `A ${rx} ${ry} 0 0 0 ${sx} ${sy}`;

    if (backupEndAngle !== null) {
        let sx = rx;
        let sy = 0;
        let ex = rx * Math.cos(backupEndAngle);
        let ey = ry * Math.sin(backupEndAngle);
        let arc1 = `A ${rx} ${ry} 0 0 1 ${ex} ${ey + depth}`;
        let arc2 = `A ${rx} ${ry} 0 0 0 ${sx} ${sy}`;
        extra = `M ${sx} ${sy + depth} ${arc1} L ${ex} ${ey} ${arc2} z`;
    }

    return `M ${sx} ${sy + depth} ${arc1} L ${ex} ${ey} ${arc2} z ${extra}`;
}
