# pie3d_svg
3D pie chart with transition and auto rotating implemented by SVG.

## Example
[![pie3d_svg.png](http://124.221.54.220:23400/file/pie3d_svg.png)](http://124.221.54.220:23400/file/pie3d_svg.mp4)

[example video](http://124.221.54.220:23400/file/pie3d_svg.mp4)

### example/test.js
```
let el = document.querySelector('.test');
let inst = Pie3D(el);
inst.render({
	data: fakeData(),
	colorArray: [
		'rgba(213, 63, 11, 0.9)',
		'rgba(89, 19, 208, 0.9)',
		'rgba(56, 140, 227, 0.9)',
		'rgba(20, 202, 156, 0.9)',
		'rgba(185, 195, 16, 0.9)',
		'rgba(210, 138, 26, 0.9)',
		'rgba(109, 175, 243, 0.9)',
		'rgba(108, 200, 243, 0.9)'
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
```
