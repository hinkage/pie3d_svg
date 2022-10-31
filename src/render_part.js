import * as d3 from 'd3';
import pathEnd from './path/path_end.js';
import pathInner from './path/path_inner.js';
import pathOuter from './path/path_outer.js';
import pathStart from './path/path_start.js';
import pathTop from './path/path_top.js';

export default function renderPart(d, el, cfg, opt) {
    let arr = [d];
    let sel = d3.select(el);
    let slices;
    if (d.__side == -1) {
        // On left side, slices' order is end -> inner -> start
        slices = [
            {
                class: 'end',
                fnPath: pathEnd,
                fnColor: same
            },
            {
                class: 'inner',
                fnPath: pathInner,
                fnColor: darker
            },
            {
                class: 'start',
                fnPath: pathStart,
                fnColor: same
            }
        ];
    } else {
        // On right sede, slices' order is start -> inner -> end
        slices = [
            {
                class: 'start',
                fnPath: pathStart,
                fnColor: same
            },
            {
                class: 'inner',
                fnPath: pathInner,
                fnColor: darker
            },
            {
                class: 'end',
                fnPath: pathEnd,
                fnColor: same
            }
        ];
    }
    slices = slices.concat([
        {
            class: 'outer',
            fnPath: pathOuter,
            fnColor: same
        },
        {
            class: 'top',
            fnPath: pathTop,
            fnColor: brighter
        }
    ]);
    for (let i = 0; i < slices.length; i++) {
        let slice = slices[i];
        sel.selectAll(`.${slice.class}`)
            .data(arr)
            .join(
                function (enter) {
                    return enter
                        .append('path')
                        .attr('class', slice.class)
                        .call(fnUpdate);
                },
                function (update) {
                    return update.call(fnUpdate);
                }
            );

        function fnUpdate(sel) {
            sel.style(opt.useAttr, function () {
                return slice.fnColor(d.__color);
            }).attr('d', function () {
                return slice.fnPath(d, cfg.width, cfg.height, cfg.innerRadius);
            });
			sel.raise();
        }
    }
}

function same(color) {
    return color;
}

function brighter(color) {
    return d3.color(color).brighter(0.5).toString();
}

function darker(color) {
    return d3.color(color).darker(0.5).toString();
}
