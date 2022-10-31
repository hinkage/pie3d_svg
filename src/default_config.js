export default function defaultConfig() {
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
