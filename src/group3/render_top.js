import pathTop from '../path/path_top.js';

export default function renderTop(dataArray, cfg, opt) {
    opt.groupTopSlices
        .selectAll('.topSlice')
        .data(dataArray)
        .join(
            function (enter) {
                return enter
                    .append('path')
                    .attr('class', 'topSlice')
                    .call(fnUpdate);
            },
            function (update) {
                return update.call(fnUpdate);
            }
        );

    function fnUpdate(sel) {
        return sel.style(opt.useAttr, function (d) {
            return d.__color;
        }).attr('d', function (d) {
            return pathTop(d, cfg.width, cfg.height, cfg.innerRadius);
        });
    }
}
