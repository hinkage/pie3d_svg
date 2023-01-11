import pathInner from '../path/path_inner';

export default function renderInner(dataArray, cfg, opt) {
    opt.groupInnerSlices
        .selectAll('.innerSlice')
        .data(dataArray)
        .join(
            function (enter) {
                return enter
                    .append('path')
                    .attr('class', 'innerSlice')
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
            return pathInner(d, cfg.width, cfg.height, cfg.innerRadius);
        });
        return sel;
    }
}
