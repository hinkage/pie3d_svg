/*
 * @file 3D pie chart supports variable heights of diffrent slices and inner radius
 * with transition and auto rotating implemented by SVG.
 * dependencies：d3@7.6.1.min.js d3-shape@3.js
 * @author hinkage
 * @version 2.0.0
 * @see {@link https://github.com/hinkage/pie3d_svg}
 */
import * as d3 from 'd3';
import buildTransition from './build_transition.js';
import { createPieLayout } from './create_pie_layout.js';
import defaultConfig from './default_config.js';
import renderAll from './render_all.js';
import { JSONClone, twoPI } from './util.js';

import './pie3d.css';

export default function Pie3D(el) {
    el.insertAdjacentHTML(
        'afterbegin',
        `
        <div class="vanilla-lib-pie3d"
        </div>
        `
    );
    el = el.querySelector('.vanilla-lib-pie3d');

    let cfg = defaultConfig();
    let svg = d3
        .select(el)
        .append('svg')
        .attr('width', el.scrollWidth)
        .attr('height', el.scrollHeight);
    let parts = svg.append('g').attr('class', 'parts');
    let useAttr = 'fill'; // stroke fill
    let timer = null;
    let trans = null;
    let totalOffset = 0;
    let opt = null;
    let oldDataPie = [];

    function render(cfg_) {
        cfg = Object.assign(cfg, cfg_);
        opt = generateOptionFromConfig(cfg);
        if (cfg.rotateInterval <= cfg.rotateDuration) {
            cfg.rotateInterval = cfg.rotateDuration + 100;
        }
        if (timer) {
            timer.stop();
        }
        parts.attr('transform', 'translate(' + cfg.x + ',' + cfg.y + ')');
        let layoutPie = createPieLayout(cfg, opt, () => totalOffset);
        let data = JSONClone(cfg.data);
        let dataPie = layoutPie(data);
        renderPie(dataPie);
        if (cfg.enableAutoRotate && cfg.data.length > 1) {
            let fnRotate = makeRotate(cfg, dataPie);
            timer = d3.interval(fnRotate, cfg.rotateInterval);
        }
    }

    function generateOptionFromConfig(cfg) {
        let opt = {
            sum: 0,
            min: Number.MAX_VALUE,
            max: -Number.MAX_VALUE,
            useAttr
        };
        if (!cfg.depthRange) {
            cfg.depthRange = [cfg.depth, cfg.depth];
        }
        cfg.data.forEach(function (item) {
            opt.sum += item.value;
            if (item.value > opt.max) {
                opt.max = item.value;
            }
            if (item.value < opt.min) {
                opt.min = item.value;
            }
        });
        return opt;
    }

    function renderPie(dataPie) {
        dataPie = JSONClone(dataPie);
        if (!cfg.enableTransition) {
            renderAll(parts, dataPie, cfg, opt);
            return;
        }
        if (trans) {
            parts.interrupt('trans-pie-3d');
        }
        trans = buildTransition(
            parts,
            oldDataPie,
            dataPie,
            function (data) {
                renderAll(parts, data, cfg, opt);
            },
            cfg
        )
            .end()
            .then(() => {
                // let gExit = parts.selectAll('.exit');
                // gExit.remove();
                renderAll(parts, dataPie, cfg, opt);
            })
            .catch((e) => {
                console.log(e);
            });
        oldDataPie = dataPie;
    }

    function makeRotate(cfg, dataPie) {
        let idx = 0;
        return function () {
            let add = dataPie[idx].rotateAngle;
            dataPie.forEach(function (item) {
                item.startAngle -= add;
                item.endAngle -= add;
            });
            renderPie(dataPie);
            idx++;
            if (idx >= cfg.data.length) {
                idx = 0;
                totalOffset -= twoPI;
            }
            if (cfg.onRotate) {
                let dataIndex = idx;
                cfg.onRotate(cfg.data[dataIndex], dataIndex);
            }
            return idx;
        };
    }

    return {
        render: render
    };
}
