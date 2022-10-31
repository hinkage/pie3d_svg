export let twoPI = Math.PI * 2;

export function deg2rad(deg) {
    return (deg / 180) * Math.PI;
}

export function JSONClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export function normalize(d) {
    d = {
        startAngle: d.startAngle,
        endAngle: d.endAngle,
        __depth: d.__depth,
        __color: d.__color,
		__type: d.__type
    };
    let diff = d.endAngle - d.startAngle;
    diff %= twoPI;
    if (diff === 0) {
        diff = twoPI - 0.0001;
    }
    d.startAngle %= twoPI;
    d.endAngle = d.startAngle + diff;
    if (d.startAngle > d.endAngle) {
        let t = d.startAngle;
        d.startAngle = d.endAngle;
        d.endAngle = t;
    }
    if (d.startAngle < 0) {
        d.startAngle += twoPI;
        d.endAngle += twoPI;
    }
    d.__middleAngle = calcMiddleAngle(d);
    d.__side = calcSide(d);
    return d;
}

let halfPI = Math.PI * 0.5;
export function calcZIndex(d) {
    let z = Math.abs(d.__middleAngle - halfPI);
    if (z > Math.PI) {
        z = twoPI - z;
    }
    z = Math.PI - z;
    let deg = (z / Math.PI) * 180;
    return deg;
}

function calcMiddleAngle(d) {
    let m1 = (d.startAngle + d.endAngle) / 2;
    let m2 = m1 % twoPI;
    if (m2 < 0) {
        m2 += twoPI;
    }
    return m2;
}

function calcSide(d) {
    let t = d.__middleAngle;
    if (0 <= t && t <= halfPI) {
        return 1;
    }
    if (Math.PI * 1.5 <= t && t < twoPI) {
        return 1;
    }
    return -1;
}
