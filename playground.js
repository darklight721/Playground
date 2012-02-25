var Particle = function(obj) {
	var x = 0;
	var y = 0;
	var xdest = -1;
	var ydest = -1;
	var xbound = 0;
	var ybound = 0;
	var size = 0;
	var isXIncrement = true;
	var step = 0;
	var m = 0;
	var b = 0;
	
	// start of public members ********************************
	var init = function() {
		xbound = obj.xbound;
		ybound = obj.ybound;
		
		x = getRandom(xbound);
		y = getRandom(ybound);
		
		size = getRandom(10) + 1;
		step = getRandom(4) + 1;
	};

	var draw = function(ctx) {
		ctx.beginPath();
		ctx.arc(x,y,size,0,Math.PI*2,true);
		ctx.fill();
	};
	
	var update = function() {
		
		if (xdest > -1 && ydest > -1)
		{
			if (isXIncrement)
			{
				x += step;
				y = m * x + b;
			}
			else
			{
				y += step;
				x = (y - b) / m;
			}
		}
		
		if (x < 0 || x > xbound || y < 0 || y > ybound)
		{
			step *= -1;
			//step *= getRandom(5) + 1;
		}
		
	};
	
	var setDest = function(obj) {
		xdest = obj.x;
		ydest = obj.y;
		
		computeLineEquation();
	};
	// end of public members ***********************************
	
	var computeLineEquation = function() {
		var xdelta = xdest-x;
		var ydelta = ydest-y;
		
		m = ydelta / xdelta; 
		b = y - m * x;
		isXIncrement = Math.abs(xdelta) > Math.abs(ydelta);
		
		if (isXIncrement)
		{
			if (xdelta < 0)
			{
				step *= -1;
			}
		}
		else
		{
			if (ydelta < 0)
			{
				step *= -1;
			}
		}
	};
	
	return {
		init: init,
		draw: draw,
		update: update,
		setDest: setDest
	};
};

var getRandom = function(n) {
	return Math.floor(Math.random()*n);
};

var getMousePos = function(ev,c) {
	var x, y;

	// get the mouse position
	if (ev.pageX || ev.pageX == 0) // for chrome/safari
	{
		x = ev.pageX - c.offsetLeft;
		y = ev.pageY - c.offsetTop;
	}
	else if (ev.layerX || ev.layerX == 0) // for firefox
	{
		x = ev.layerX;
		y = ev.layerY;
	}      
	else if (ev.offsetX || ev.offsetX == 0) // for opera
	{
		x = ev.offsetX;
		y = ev.offsetY;
	}
	
	return {
		x:x,
		y:y
	};
};

document.addEventListener("DOMContentLoaded", function(){

	var c = document.getElementsByTagName("canvas")[0];
	// set canvas size
	c.width = window.innerWidth;
	c.height = window.innerHeight;
	
	var ctx = c.getContext("2d");
	
	var ptclArray = [];
	
	for (var i = 0; i < 100; i++)
	{
		var ptcl = new Particle({xbound:c.width,ybound:c.height});
		ptcl.init();
		ptcl.draw(ctx);
		
		ptclArray.push(ptcl);
	}
	
	c.addEventListener("mouseup",function(ev){
		var mousePos = getMousePos(ev,this);
		// set dest for every partile
		for (var i = 0; i < ptclArray.length; i++)
		{
			ptclArray[i].setDest(mousePos);
		}
	},false);
	
	window.setInterval(function(){
		ctx.clearRect(0,0,c.width,c.height);
		
		for (var i = 0; i < ptclArray.length; i++)
		{
			ptclArray[i].update();
			ptclArray[i].draw(ctx);
		}
	},1000/60);
	
},false);
