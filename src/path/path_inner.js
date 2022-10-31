import { twoPI } from '../util.js';

export default function pathInner(d, rx, ry, ir) {
    rx *= ir;
    ry *= ir;
    let startAngle = d.startAngle % twoPI;
    let endAngle = d.endAngle % twoPI;
    let backupStartAngle = null;
    if (startAngle > endAngle) {
        if (startAngle > Math.PI) {
            backupStartAngle = startAngle;
            startAngle = Math.PI;
        } else {
            endAngle = twoPI;
        }
    }
    startAngle = Math.max(startAngle, Math.PI);
    endAngle = Math.max(endAngle, Math.PI);
    let sx = rx * Math.cos(startAngle);
    let sy = ry * Math.sin(startAngle);
    let ex = rx * Math.cos(endAngle);
    let ey = ry * Math.sin(endAngle);
	let depth = -d.__depth;
    let arc1 = `A ${rx} ${ry} 0 0 1 ${ex} ${ey}`;
    let arc2 = `A ${rx} ${ry} 0 0 0 ${sx} ${sy + depth}`;
    let extra = '';
    if (backupStartAngle !== null) {
        let sx = rx * Math.cos(backupStartAngle);
        let sy = ry * Math.sin(backupStartAngle);
        let ex = rx;
        let ey = 0;
        let arc1 = `A ${rx} ${ry} 0 0 1 ${ex} ${ey}`;
        let arc2 = `A ${rx} ${ry} 0 0 0 ${sx} ${sy + depth}`;
        extra = `M ${sx} ${sy} ${arc1} L ${ex} ${ey + depth} ${arc2} z`;
    }
    return `M ${sx} ${sy} ${arc1} L ${ex} ${ey + depth} ${arc2} z ${extra}`;
}
