// JavaScript Document
/// <reference path="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js" />
/// <reference path="numeric-1.2.6.min.js" />



$(document).ready(function () {

	initEvents($("#myCanvas"));

});

function leastSquare(points) {
	var A=numeric.rep([2, 2], 0);
	var b=numeric.rep([2], 0);
	for(var i=0; i<points.length; ++i) {
		A[0][0]+=points[i][0]*points[i][0];
		A[0][1]+=points[i][0];
		A[1][0]+=points[i][0];
		A[1][1]+=1;
		b[0]+=points[i][1]*points[i][0];
		b[1]+=points[i][1];
	}
	var c=numeric.solve(A, b)
	return c;
}

function leastSquareN(points, dim) {
	if(points.length<dim) {
		return numeric.rep([dim], 0);
	}
	var A=numeric.rep([dim, dim], 0);
	var b=numeric.rep([dim], 0);
	for(var i=0; i<points.length; ++i) {
		for(var j=0; j<dim; ++j) {
			for(var k=0; k<dim; ++k) {
				A[j][k]+=Math.pow(points[i][0], 2*(dim-1)-j-k);
			}
		}
		for(var j=0; j<dim; ++j) {
			b[j]+=points[i][1]*Math.pow(points[i][0], dim-1-j);;
		}
	}
	var c=numeric.solve(A, b)
	return c;
}


function drawPoints(canvas, points) {
	var context=canvas.get(0).getContext("2d");
	var canvasWidth=canvas.width();
	var canvasHeight=canvas.height();
	context.setTransform(1, 0, 0, 1, 0, 0);
	for(var i=0; i<points.length; ++i) {
		context.beginPath();
		context.arc(points[i][0], points[i][1], 5, 0, 2*Math.PI, true);
		context.fill();
	}
}

function drawPolynomial(canvas, c) {
	var context=canvas.get(0).getContext("2d");
	var canvasWidth=canvas.width();
	var canvasHeight=canvas.height();
	var dx=5;
	var numSegments=Math.floor(canvasWidth/dx)+1;
	context.beginPath();
	var x;
	function f(val) {
		var tmp=0;
		for(var i=0; i<c.length; ++i) {
			tmp+=c[i]*Math.pow(val,c.length-1-i);
		}
		return tmp;
	}
	x=0;
	context.moveTo(x, f(x));
	for(var i=1; i<numSegments; ++i) {
		x+=dx;
		context.lineTo(x, f(x));
	}
	context.stroke();
}

function initEvents(canvas) {

	var canvasWidth=canvas.width();
	var canvasHeight=canvas.height();
	var points=[];
	var selectPoint=null;

	// mouseクリック時のイベントコールバック設定
	$(window).mousedown(function (event) {
		// 左クリック
		if(event.button==0) {
			var canvasOffset=canvas.offset();
			var canvasX=Math.floor(event.pageX-canvasOffset.left);
			var canvasY=Math.floor(event.pageY-canvasOffset.top);
			if(canvasX<0||canvasX>canvasWidth) {
				return;
			}
			if(canvasY<0||canvasY>canvasHeight) {
				return;
			}
			points.push([canvasX, canvasY]);

			draw();

		}
		// 右クリック
		else if(event.button==2){
			var canvasOffset=canvas.offset();
			var canvasX=Math.floor(event.pageX-canvasOffset.left);
			var canvasY=Math.floor(event.pageY-canvasOffset.top);
			if(canvasX<0||canvasX>canvasWidth) {
				return;
			}
			if(canvasY<0||canvasY>canvasHeight) {
				return;
			}
			var clickPos=[canvasX, canvasY];
			var dist;
			for(var i=0; i<points.length; ++i) {
				dist=numeric.norm2(numeric.sub(points[i],clickPos));
				if(dist<10) {
					selectPoint=i;
					break;
				}
			}
		}
	});

	// mouse移動時のイベントコールバック設定
	$(window).mousemove(function (event) {
		var canvasOffset=canvas.offset();
		var canvasX=Math.floor(event.pageX-canvasOffset.left);
		var canvasY=Math.floor(event.pageY-canvasOffset.top);
		if(canvasX<0||canvasX>canvasWidth) {
			return;
		}
		if(canvasY<0||canvasY>canvasHeight) {
			return;
		}
		if(selectPoint!=null) {
			points[selectPoint]=[canvasX, canvasY];
			draw();
		}
	});

	// mouseクリック解除時のイベントコールバック設定
	$(window).mouseup(function (event) {
		selectPoint=null;
		draw();
	});

	// リセットボタン
	$("#reset").click(function () {
		points=[];
		draw();
	})

	function draw() {
		var context=canvas.get(0).getContext("2d");
		context.clearRect(0, 0, canvasWidth, canvasHeight);
		drawPoints(canvas, points);
		colors=['red', 'green', 'blue', 'orange', 'cyan'];
		var c;
		var dim;
		var N=3;
		for(var i=0; i<N; ++i) {
			context.strokeStyle=colors[i%N];
			dim=i+2;
			c=leastSquareN(points, dim);
			drawPolynomial(canvas, c);
		}
	}


}