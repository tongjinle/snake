(function() {

	function Render(ctx,width,height) {
		this.ctx = ctx;
		this.width = width;
		this.height = height;
	}

	var handler = Render.prototype;

	handler.clear = function(){
		this.ctx.clearRect(0,0,this.width,this.height);
	};


	handler.rect = function(x,y,width,height,color){
		this.ctx.fillStyle = color;
		this.ctx.fillRect (x,y,width,height);
	};


	this.Render = Render;
}).call(this)