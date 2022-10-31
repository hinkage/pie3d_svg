import * as d3 from 'd3';
import renderPart from './render_part';
import { calcZIndex, normalize } from './util';

export default function renderAll(selection, dataArray, cfg, opt) {
    dataArray = dataArray.map((d) => normalize(d));
    dataArray.forEach((d) => {
        d.__zIndex = calcZIndex(d);
    });
    selection
        .selectAll('g.part')
        .data(dataArray, function (_, i) {
            return i;
        })
        .join(
            function (enter) {
                return enter.append('g').attr('class', 'part').call(fnUpdate);
            },
            function (update) {
                return update.call(fnUpdate);
            }
        )
        .sort((a, b) => {
            return a.__zIndex - b.__zIndex;
        });

    function fnUpdate(sel) {
        sel.attr('data-z-index', (d) => d.__zIndex).each(function (d) {
            renderPart(d, this, cfg, opt);
            d3.select(this).classed('exit', d.__type === 'exit');
        });
    }
}
