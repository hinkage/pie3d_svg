function test() {
    let el = document.querySelector('.test');
    let btn = el.querySelector('button');
    btn.onclick = update;
    let inst = Pie3D(el);
    inst.render({
        data: fakeData(),
        colorArray: [
            'rgba(213, 63, 11, 1.0)',
            'rgba(89, 19, 208, 1.0)',
            'rgba(56, 140, 227, 1.0)',
            'rgba(20, 202, 156, 1.0)',
            'rgba(185, 195, 16, 1.0)',
            'rgba(210, 138, 26, 1.0)',
            'rgba(109, 175, 243, 1.0)',
            'rgba(108, 200, 243, 1.0)'
        ],
        x: 300,
        y: 250,
        width: 150,
        height: 80,
        depth: 30,
        depthRange: [20, 60],
        innerRadius: 0.6,
        startAngle: 270,
        enableTransition: true,
        enableAutoRotate: true,
        rotateDuration: 1000,
        rotateInterval: 2000,
        onRotate: function (d, i) {
            console.log('onRotate:', d, i);
        }
    });

    function update() {
        let data = fakeData();
        inst.render({
            data: data
        });
    }
}

function fakeData() {
    let i = Mock.Random.integer(10, 20);
    let j = 0;
    let data = Mock.mock({
        [`dataList|${i}`]: [
            {
                name: () => 'name' + j++,
                value: () => Mock.Random.integer(10, 100)
            }
        ]
    });
    let rst = data.dataList;
    if (!Array.isArray(rst)) {
        rst = [data.dataList];
    }
    console.log('fakeData:', JSON.stringify(rst));
    return rst;
}
