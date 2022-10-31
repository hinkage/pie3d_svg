(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? (module.exports = factory(require('d3')))
        : typeof define === 'function' && define.amd
        ? define(['d3'], factory)
        : ((global =
              typeof globalThis !== 'undefined' ? globalThis : global || self),
          (global.Pie3D = factory(global.d3)));
})(this, function (d3) {
    'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        const n = Object.create(null, {
            [Symbol.toStringTag]: { value: 'Module' }
        });
        if (e) {
            for (const k in e) {
                if (k !== 'default') {
                    const d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(
                        n,
                        k,
                        d.get
                            ? d
                            : {
                                  enumerable: true,
                                  get: () => e[k]
                              }
                    );
                }
            }
        }
        n.default = e;
        return Object.freeze(n);
    }

    const d3__namespace = /*#__PURE__*/ _interopNamespace(d3);

    function buildTransition(sel, oldData, newData, fnRender, cfg) {
        let trans = sel
            .transition('trans-pie-3d')
            .ease(d3__namespace.easeLinear)
            .duration(cfg.rotateDuration)
            .tween('any', function () {
                let inter = buildInterpolaterArray(oldData, newData);
                return function (t) {
                    let frameData = inter(t);
                    fnRender(frameData);
                };
            });
        return trans;
    }

    function buildInterpolaterArray(arrOld, arrNew) {
        let interArr = [];
        let i = 0;
        for (; i < arrOld.length; i++) {
            if (i < arrNew.length) {
                // update
                interArr.push(buildInterpolaterObject(arrOld[i], arrNew[i]));
            } else {
                // exit
                let oldObj = arrOld[i];
                interArr.push(
                    buildInterpolaterObject(
                        oldObj,
                        buildInitState(oldObj, 'exit')
                    )
                );
            }
        }
        // enter
        for (; i < arrNew.length; i++) {
            let newObj = arrNew[i];
            interArr.push(
                buildInterpolaterObject(buildInitState(newObj), newObj)
            );
        }
        return function (t) {
            return interArr.map((inter) => inter(t));
        };
    }

    function buildInterpolaterObject(oldObj, newObj) {
        let fn = d3__namespace.interpolateObject(
            {
                startAngle: oldObj.startAngle,
                endAngle: oldObj.endAngle,
                __depth: oldObj.__depth
            },
            {
                startAngle: newObj.startAngle,
                endAngle: newObj.endAngle,
                __depth: newObj.__depth
            }
        );
        return function (t) {
            let o = fn(t);
            o.__color = newObj.__color;
            o.__type = newObj.__type;
            return o;
        };
    }

    function buildInitState(d, type) {
        let midAngle = (d.startAngle + d.endAngle) / 2;
        return {
            startAngle: midAngle,
            endAngle: midAngle,
            __depth: 0,
            __color: d.__color,
            __type: type
        };
    }

    let twoPI = Math.PI * 2;

    function deg2rad(deg) {
        return (deg / 180) * Math.PI;
    }

    function JSONClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    function normalize(d) {
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
    function calcZIndex(d) {
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

    function createPieLayout(cfg, opt, getTotalOffset) {
        let pie = d3__namespace
            .pie()
            .sort(null)
            .value(function (d) {
                return d.value;
            })
            .startAngle(deg2rad(cfg.startAngle))
            .endAngle(deg2rad(cfg.startAngle + 360));
        let depthScale = d3__namespace
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

    function defaultConfig() {
        return {
            data: [
                {
                    name: '标签1',
                    value: 20
                },
                {
                    name: '标签2',
                    value: 50
                },
                {
                    name: '标签3',
                    value: 100
                }
            ],
            colorArray: [
                'rgb(213, 63, 11)',
                'rgb(89, 19, 208)',
                'rgb(56, 140, 227)',
                'rgb(20, 202, 156)',
                'rgb(185, 195, 16)',
                'rgb(210, 138, 26)',
                'rgb(109, 175, 243)',
                'rgb(108, 200, 243)'
            ],
            x: 150,
            y: 150,
            width: 120,
            height: 60,
            depth: 20,
            depthRange: null, // [20, 50]
            innerRadius: 0.6,
            startAngle: 270, // 0 degrees at 15 o'clock, increasing clockwise
            enableTransition: true,
            enableAutoRotate: true,
            rotateDuration: 1000,
            rotateInterval: 5000,
            onRotate: null
        };
    }

    function pathEnd(d, w, h, ir) {
        let x1 = w * Math.cos(d.endAngle);
        let y1 = h * Math.sin(d.endAngle);
        let xi1 = x1 * ir;
        let yi1 = y1 * ir;
        let depth = d.__depth;
        return `M ${x1} ${y1} L ${x1} ${y1 - depth} L ${xi1} ${yi1 - depth} L ${xi1} ${yi1} z`;
    }

    function pathInner(d, rx, ry, ir) {
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

    function pathOuter(d, rx, ry, ir) {
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

    function pathStart(d, w, h, ir) {
        let x0 = w * Math.cos(d.startAngle);
        let y0 = h * Math.sin(d.startAngle);
        let xi0 = x0 * ir;
        let yi0 = y0 * ir;
        let depth = d.__depth;
        return `M ${x0} ${y0} L ${x0} ${y0 - depth} L ${xi0} ${yi0 - depth} L ${xi0} ${yi0} z`;
    }

    function pathTop(d, w, h, ir) {
        let totalAngle = d.endAngle - d.startAngle;
        if (totalAngle === 0) {
            return 'M 0 0';
        }
        let depth = -d.__depth;
        let sx = w * Math.cos(d.startAngle);
        let sy = h * Math.sin(d.startAngle);
        let ex = w * Math.cos(d.endAngle);
        let ey = h * Math.sin(d.endAngle);
        let largeArc = totalAngle > Math.PI ? 1 : 0;
        let arc1 = `A ${w} ${h} 0 ${largeArc} 1 ${ex} ${ey + depth}`;
        let arc2 = `A ${w * ir} ${h * ir} 0 ${largeArc} 0 ${sx * ir} ${
            sy * ir + depth
        }`;
        return `M ${sx} ${sy + depth} ${arc1} L ${ex * ir} ${ey * ir + depth} ${arc2} z`;
    }

    function renderPart(d, el, cfg, opt) {
        let arr = [d];
        let sel = d3__namespace.select(el);
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
                    return slice.fnPath(
                        d,
                        cfg.width,
                        cfg.height,
                        cfg.innerRadius
                    );
                });
                sel.raise();
            }
        }
    }

    function same(color) {
        return color;
    }

    function brighter(color) {
        return d3__namespace.color(color).brighter(0.5).toString();
    }

    function darker(color) {
        return d3__namespace.color(color).darker(0.5).toString();
    }

    function renderAll(selection, dataArray, cfg, opt) {
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
                    return enter
                        .append('g')
                        .attr('class', 'part')
                        .call(fnUpdate);
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
                d3__namespace.select(this).classed('exit', d.__type === 'exit');
            });
        }
    }

    var e = [],
        t = [];
    function n(n, r) {
        if (n && 'undefined' != typeof document) {
            var a,
                s = !0 === r.prepend ? 'prepend' : 'append',
                d = !0 === r.singleTag,
                i =
                    'string' == typeof r.container
                        ? document.querySelector(r.container)
                        : document.getElementsByTagName('head')[0];
            if (d) {
                var u = e.indexOf(i);
                -1 === u && ((u = e.push(i) - 1), (t[u] = {})),
                    (a = t[u] && t[u][s] ? t[u][s] : (t[u][s] = c()));
            } else a = c();
            65279 === n.charCodeAt(0) && (n = n.substring(1)),
                a.styleSheet
                    ? (a.styleSheet.cssText += n)
                    : a.appendChild(document.createTextNode(n));
        }
        function c() {
            var e = document.createElement('style');
            if ((e.setAttribute('type', 'text/css'), r.attributes))
                for (
                    var t = Object.keys(r.attributes), n = 0;
                    n < t.length;
                    n++
                )
                    e.setAttribute(t[n], r.attributes[t[n]]);
            var a = 'prepend' === s ? 'afterbegin' : 'beforeend';
            return i.insertAdjacentElement(a, e), e;
        }
    }

    var css =
        '.vanilla-lib-pie3d {\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n  width: 100%;\r\n  height: 100%;\r\n}\r\n.vanilla-lib-pie3d * {\r\n  user-select: none;\r\n}\r\n.vanilla-lib-pie3d path {\r\n  stroke-width: 2px;\r\n  fill: none;\r\n}\r\n';
    n(css, {});

    /*
     * @file 3D pie chart with transition and auto rotating implemented by SVG.
     * dependencies：d3@7.6.1.min.js d3-shape@3.js
     * @author hinkage
     * @version 2.0.0
     * @see {@link https://github.com/hinkage/pie3d_svg}
     */

    function Pie3D(el) {
        el.insertAdjacentHTML(
            'afterbegin',
            `
        <div class="vanilla-lib-pie3d"
        </div>
        `
        );
        el = el.querySelector('.vanilla-lib-pie3d');

        let cfg = defaultConfig();
        let svg = d3__namespace
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
                timer = d3__namespace.interval(fnRotate, cfg.rotateInterval);
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

    return Pie3D;
});
