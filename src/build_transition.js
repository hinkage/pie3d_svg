export default function buildTransition(sel, oldData, newData, fnRender, cfg) {
    let trans = sel
        .transition('trans-pie-3d')
        .ease(d3.easeLinear)
        .duration(cfg.rotateDuration)
        .tween('any', function () {
            let inter = buildInterpolaterArray(oldData, newData, cfg);
            return function (t) {
                let frameData = inter(t);
                fnRender(frameData);
            };
        });
    return trans;
}

function buildInterpolaterArray(arrOld, arrNew, cfg) {
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
                    buildInitState(oldObj, 'exit', cfg)
                )
            );
        }
    }
    // enter
    for (; i < arrNew.length; i++) {
        let newObj = arrNew[i];
        interArr.push(
            buildInterpolaterObject(
                buildInitState(newObj, undefined, cfg),
                newObj
            )
        );
    }
    return function (t) {
        return interArr.map((inter) => inter(t));
    };
}

function buildInterpolaterObject(oldObj, newObj, cfg) {
    let fn = d3.interpolateObject(
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

function buildInitState(d, type, cfg) {
    let depth = 0;
    if (cfg.method === 'group3') {
        depth = cfg.depth;
    }
    let midAngle = (d.startAngle + d.endAngle) / 2;
    return {
        startAngle: midAngle,
        endAngle: midAngle,
        __depth: depth,
        __color: d.__color,
        __type: type
    };
}
