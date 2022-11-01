# pie3d_svg
3D pie chart supports variable heights of diffrent slices and inner radius with transition and auto rotating implemented by SVG.

## npm package
npm i @hinkage/pie3d_svg

## Example
[![pie3d_svg.png](https://mnkjg.gq:81/file/pie3d_svg.png?)](https://mnkjg.gq:81/file/pie3d_svg.mp4)

[example video](https://mnkjg.gq:81/file/pie3d_svg.mp4)

### example/test.js
```
let el = document.querySelector('.test');
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
```

## Config
Look at src/default_config.js.

The default config will be overridden by the object passed to function render.
Try to change the value of each property to see what will happend to
understand what the property means.

## Caution
**startAngle can only be set to 270 degrees**, because of the limitation of SVG.
SVG is designed for 2D graphic, not for 3D graphic like this.

You can try to set startAngle to 0 degrees, then only provide two items of
data, click on update button several times, then you can find the problem.
No matter which order that two parts are placed, the overlapping result is
wrong.

In 3D graphic, each single pixel's distance to camera must be calculated to
decide we can see that pixel or not, this is not possible in SVG. This is
the biggest limitation of this implementation. The perfect implemetation
can only be done by WebGL, which is the real 3D graphic interface.

There is another library:
[amcharts variable-height-3d-pie-chart-v4](https://www.amcharts.com/demos-v4/variable-height-3d-pie-chart-v4/).

As I test, It has the same problem as this repository, when the startAngle is
set to 0, and endAngle is set 360, and only provide two items of data, it
produces the same problem.

