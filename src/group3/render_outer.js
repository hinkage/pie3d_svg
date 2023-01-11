import pathOuter from '../path/path_outer';

export default function renderOuter(dataArray, cfg, opt) {
    opt.groupOuterSlices
        .selectAll('.outerSlice')
        .data(dataArray)
        .join(
            function (enter) {
                return enter
                    .append('path')
                    .attr('class', 'outerSlice')
                    .call(fnUpdate);
            },
            function (update) {
                return update.call(fnUpdate);
            }
        );

    function fnUpdate(sel) {
        sel.style(opt.useAttr, function (d) {
            return d3.color(d.__color).darker(0.5).toString();
        }).attr('d', function (d) {
            return pathOuter(d, cfg.width, cfg.height, cfg.innerRadius);
        });
    }
}
