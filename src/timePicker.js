const color = {minColor:'#53ef6d',hoursColor:'#a39427',hoursColor24:'#936e78'};
timePicker.prototype.drawTime = function(drawHandles){
	if(this.changed){
		this.ctx.save();
		//xoa hinh canvas cu
		this.ctx.clearRect ( 0 , 0 , this.canvas.width , this.canvas.height );
		//set background cho the canvas
		this.ctx.beginPath();
		this.ctx.rect(0,0,2*this.centerX , 2*this.centerY);
		this.ctx.closePath();
		this.ctx.fillStyle = '#EFEFEF'; //background color
		this.ctx.fill();
		
		//dịch chuyển về trung tam cua hinh canvas
		this.ctx.translate(this.centerX, this.centerY);

		//ve vong tron minus
		this.ctx.beginPath();
		this.ctx.arc(0,0, this.scale*4, 0, 2*Math.PI, false); //ve vong tron
		this.ctx.closePath();
		this.ctx.fillStyle = 'rgba(22,22,22,1)'; //set mau mac dinh cho vong tron minus
		this.ctx.fill();

		//ve vong tron hours
		this.ctx.beginPath();
		this.ctx.arc(0,0, this.scale*3, 0, 2*Math.PI, false);
		this.ctx.closePath();
		this.ctx.fillStyle = 'rgba(14,14,14,1)';
		this.ctx.fill();
		if(this.hSnd){ //neu hours > 12
			this.ctx.beginPath();
			this.ctx.arc(0,0, this.scale*3, 0, 2*Math.PI, false);
			this.ctx.closePath();
			this.ctx.fillStyle = this.hoursColor;
			this.ctx.fill();
		}
		
		//ve vong tron hien thi thoi gian
		this.ctx.beginPath();
		this.ctx.arc(0,0, this.scale*2, 0, 2*Math.PI, false);
		this.ctx.closePath();
		this.ctx.fillStyle = 'rgba(10,10,10,1)';
		this.ctx.fill();
		
		//set chieu rong cua phan hien thi time tren vong tron
		this.ctx.lineWidth = this.scale;
		//ve vong tron mau hien thi minus
		this.ctx.beginPath();
		this.ctx.strokeStyle=this.minColor;
		this.ctx.arc(0,0, this.scale*3+this.scale/2, -0.5*Math.PI, this.mA, false);
		this.ctx.stroke();
		this.ctx.closePath();
		
		//ve vong tron mau hien thi gio
		this.ctx.beginPath();
		this.ctx.strokeStyle=this.hSnd?this.hoursColor24:this.hoursColor;
		this.ctx.arc(0,0, this.scale*2+this.scale/2, -0.5*Math.PI, this.hA, false);
		this.ctx.stroke();
		this.ctx.closePath();

		//set time hien thi
		var fontSize = this.scale*4/3;
		this.ctx.font= fontSize + "px arial";
		var text = this.getTimeStr();
		this.ctx.textAlign = 'center';
		this.ctx.fillStyle = 'white';
		this.ctx.fillText(text,0,0+this.scale*2/5);

		//ve 2 diem picker giup thay doi thoi gian
		if(drawHandles){
			// handlesPos = this.getHandlers();
			//ve picker cua phut
			this.ctx.save();
			this.ctx.rotate(this.mA);
			this.ctx.translate(this.scale*3+this.scale,0); //go to handle location
			this.drawHandle('m');

			//ve picker gio
			this.ctx.restore();
			this.ctx.rotate(this.hA);
			this.ctx.translate(this.scale*2+this.scale,0); //go to handle location
			this.drawHandle('h');
			}	
		this.ctx.restore();
		const time = this.getTime();
		time.h = `0${time.h}`;
		time.m = `0${time.m}`;
		this.input.value=`${time.h.slice(-2)}:${time.m.slice(-2)}`;
	}
	this.changed = false;
}
timePicker.prototype.drawHandle =  function(handle){
	//ve tam giac
	var lw = Math.round(this.scale/6.66667,0);
	
	this.ctx.beginPath();
	this.ctx.fillStyle='#ea9f9f';
	this.ctx.moveTo(this.scale/20,-this.scale*3/20);
	this.ctx.lineTo(this.scale/20,this.scale*3/20);
	this.ctx.lineTo(-this.scale/10,0);
	this.ctx.fill();
	this.ctx.closePath();
	
	this.ctx.translate(this.scale/2,0);
	
	//ve picker
	this.ctx.lineWidth = lw;
	this.ctx.beginPath();
	this.ctx.strokeStyle='white'
	this.ctx.arc(0,0, this.scale/2-lw/2, 0, 2*Math.PI, false);
	this.ctx.closePath();
	
	
	this.ctx.stroke();
	this.ctx.fillStyle = (this.selected===handle)?'#f48989':'rgba(38,38,38,1)';
	this.ctx.fill();
}

// Ham tra ve vi tri con tro chuot so voi the canvas
timePicker.prototype.getMousePos = function(evt) {
	var rect = this.canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

//kiem tra xem co click chuot vao diem thay doi thoi gian
timePicker.prototype.contains = function(xMouse, yMouse){
	const handlersPos = this.getHandlers();
	if((Math.pow(handlersPos.xh-xMouse,2)+Math.pow(handlersPos.yh-yMouse,2))  <= this.scale/2*this.scale/2 )
		return 'h';
	if((Math.pow(handlersPos.xm-xMouse,2)+Math.pow(handlersPos.ym-yMouse,2)) <= this.scale/2*this.scale/2 )
		return 'm';
	else
		return false;
}


//trả về góc giờ và phút [0: 2PI] từ các giá trị [0:60] và [0:24]
function getAngle(h, m){
	return {
		h : ((h%12)/12*2-0.5)*Math.PI,
		m : ((m%60)/60*2-0.5)*Math.PI,
		s : h>12?true:false
	};
}
timePicker.prototype.setWidth = function(w,h,centerX,centerY,scale){
	this.canvas.width =w;
	this.canvas.heigth = h;
	this.centerX = centerX || w/2;
	this.centerY = centerY || h/2;
	this.scale = scale || Math.min(w,h)/10; 
	this.changed = true;
}
timePicker.prototype.animate = function(handler,endHours,endMinutes){
	this.tA = this[handler+'A']; 
	var endAngle;
	if((typeof endHours === 'number')&&(typeof endMinutes === 'number')){
		endAngle = getAngle(endHours,endMinutes)[handler];
	}else{
		endAngle = getAngle(this.getTime().h, this.getTime().m)[handler]; //goc mà trình xử lý đên 
	}
	if(endAngle === -1/2*Math.PI&&this.tA>Math.PI){endAngle+=Math.PI*2}
	var step = (endAngle-this.tA)/this.animationStep;
	var x = 0;
	var timePicker = this;

    var intervalID = setInterval(function () {
		timePicker[handler+'A'] += step;
		timePicker.changed = true;
        if (++x === timePicker.animationStep) {
        	clearInterval(intervalID);
        }
    }, 10);
	
}

timePicker.prototype.getHandlers = function(draw){
	return {
		xh : this.centerX+Math.cos(this.hA)*(this.scale*2+this.scale*3/2),
		yh : this.centerY+Math.sin(this.hA)*(this.scale*2+this.scale*3/2),
		xm : this.centerX+Math.cos(this.mA)*(this.scale*3+this.scale*3/2),
		ym : this.centerY+Math.sin(this.mA)*(this.scale*3+this.scale*3/2)
	};
}

//tra ve thoi gian
timePicker.prototype.getTime = function(){
	var offset = this.hSnd?12:0;
	return {
		h : (Math.round((this.hA+0.5*Math.PI)*6/Math.PI) + offset)%24,
		m : (Math.round((this.mA+0.5*Math.PI)*30/Math.PI))%60
	}
}

// tra ve chuoi thoi gian
timePicker.prototype.getTimeStr = function(){
	var t = this.getTime()
	var zero = t.m.toString().length==1?'0':'';;
	var timeStr = (t.h + ':' + zero + t.m.toString());
	return timeStr;
}

//set the timePicker to a given time
timePicker.prototype.setTime = function(hours, minutes){
	this.hSnd = hours>12?true:false;
	this.animate('h',hours,minutes);
	this.animate('m',hours,minutes);
}

//dat 12h hoac 24 sau khi di chuot
timePicker.prototype.setSnd = function(my){
	var p = this.prevH;
	var a = this.hA+0.5*Math.PI;
	if(((p>=0&&a>Math.PI&&p<Math.PI)||(a>=0&&p>Math.PI&&a<Math.PI))&&(my<this.centerY)){
		this.hSnd = !this.hSnd;
	}

	this.prevH = a;
}
function timePicker(canvas,opts, input){
	this.canvas = canvas;
	this.ctx = canvas.getContext('2d');
	var timePicker = this;
	this.hA = 0;
	this.mA = 0;
	this.tA = 0;
	this.input = input;
	this.changed = true;
	
	this.setWidth(canvas.width,canvas.height,opts.centerX || false, opts.centerY || false, opts.scale || false);
	this.drawHandles = (typeof opts.drawHandles === 'undefined' || opts.drawHandles == true)?true:false; //draw handles on the timepicker. If false, it is just a clock	
	this.animationStep =  5; 	//number of steps in handle animation
	this.onTimeChange = opts.onTimeChange || false;
	
	//set Color
	this.hoursColor = color.hoursColor;
	this.minColor = color.minColor;
	this.hoursColor24 = color.hoursColor24;

	setInterval(function() { timePicker.drawTime(timePicker.drawHandles); }, 10);
	
	//Su kien xu ly khi click vao bieu tuong de thay doi thoi gian
	canvas.addEventListener('mousedown', function(e) {
		if(timePicker.drawHandles && document.body.contains(timePicker.canvas)){
			var mouse = timePicker.getMousePos(e);
			timePicker.selected = timePicker.contains(mouse.x,mouse.y);
			timePicker.changed = true;
		}
	});
	
	// su kien xu ly khi thay doi vi tri con tro chuyen
	canvas.addEventListener('mousemove', function(e) {
		if(timePicker.selected  && document.body.contains(timePicker.canvas)){
			if(timePicker.onTimeChange){timePicker.onTimeChange();}
			var mouse = timePicker.getMousePos(e);
			var mx = mouse.x;
			var my = mouse.y;
			var angle = Math.atan((my-timePicker.centerY)/(mx-timePicker.centerX)); // tính góc lại góc xoay
			if(mx<timePicker.centerX){angle=angle+Math.PI};
			if(timePicker.selected=='h'){timePicker.setSnd(my)}
			timePicker[timePicker.selected+'A'] = angle;
			timePicker.changed = true;
		}
	});
	
	//xủ lý sự kiện bỏ click
	window.addEventListener('mouseup', function(e) { 
		if(timePicker.selected && document.body.contains(timePicker.canvas)){
			timePicker.animate(timePicker.selected,true); // xử lý chuyển về trạng thái mặc định
			timePicker.selected = false;
			timePicker.changed = true;
			}
	});
}

export default timePicker;