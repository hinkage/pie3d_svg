import { deg2rad, twoPI } from './util.js';

export function createPieLayout(cfg, opt, getTotalOffset) {
    let pie = d3
        .pie()
        .sort(null)
        .value(function (d) {
            return d.value;
        })
        .startAngle(deg2rad(cfg.startAngle))
        .endAngle(deg2rad(cfg.startAngle + 360));
    let depthScale = d3
        .scaleLinear()
        .domain([opt.min, opt.max])
        .range(cfg.depthRange);

    return function (data) {
        let arr = pie(data);
        let offset = (arr[0].endAngle - arr[0].startAngle) / 2;
        arr.forEach(function (item, idx) {
            item.totalAngle = item.endAngle - item.startAngle;
            item.halfAngle = item.totalAngle / 2;
            item.startAngle -= offset;
            item.endAngle -= offset;
            if (item.startAngle < 0) {
                item.startAngle += twoPI;
                item.endAngle += twoPI;
            }
            item.startAngle += getTotalOffset();
            item.endAngle += getTotalOffset();
            item.__depth = depthScale(item.value);
			item.__id = item.data.name;
            item.__color = cfg.colorArray[idx % cfg.colorArray.length];
        });
        arr.forEach(function (item, idx) {
            let idx_next = idx + 1;
            if (idx_next >= arr.length) {
                idx_next = 0;
            }
            let next = arr[idx_next];
            item.rotateAngle = item.halfAngle + next.halfAngle;
        });
        return arr;
    };
}
