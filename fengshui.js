var	mountains = ['子','癸','丑','艮','寅','甲','卯','乙','辰','巽','巳','丙','午','丁','未','坤','申','庚','酉','辛','戌','乾','亥','壬'];
var	yang = ['甲','庚','壬','丙','乾','坤','艮','巽','寅','申','巳','亥'];
var	yin = ['辰','戌','丑','未','子','午','卯','酉','癸','丁','乙','辛'];
var	tianyuanlong = ['乾','坤','艮','巽','子','午','卯','酉'];
var	diyuanlong = ['甲','庚','壬','丙','辰','戌','丑','未'];
var	renyuanlong = ['寅','申','巳','亥','癸','丁','乙','辛'];
var	number = ['一','二','三','四','五','六','七','八','九'];
var	base_pan = [7,2,3,0,4,8,5,6,1];
var	mountain_direction = {
		'壬':7,'子':7,'癸':7,
		'丑':6,'艮':6,'寅':6,
		'甲':3,'卯':3,'乙':3,
		'辰':0,'巽':0,'巳':0,
		'丙':1,'午':1,'丁':1,
		'未':2,'坤':2,'申':2,
		'庚':5,'酉':5,'辛':5,
		'戌':8,'乾':8,'亥':8
		};
var	direction_mountain = [['辰','巽','巳'],
						['丙','午','丁'],
						['未','坤','申'],
						['甲','卯','乙'],
						[],
						['庚','酉','辛'],
						['丑','艮','寅'],
						['壬','子','癸'],
						['戌','乾','亥']];
module.exports = {
	getMountain: function(degree){
		var index = Math.floor((degree + 7.5) % 360 / 15);
		return mountains[index];
	},

	getOppositeMountain: function(mountain){
		var index = mountains.indexOf(mountain);
		return mountains[(index+12) % 24];
	},

	getYun: function(year) {
		var yun = Math.floor((year - 64) % 180 / 20) + 1;
		return yun;
	},

	getDragon: function(mountain) {
		if(tianyuanlong.indexOf(mountain) >= 0){
			return 'tian';
		}else if(diyuanlong.indexOf(mountain) >= 0){
			return 'di';
		}else if(renyuanlong.indexOf(mountain) >= 0){
			return 'ren';
		}
	},

	getMountainFromDirection: function(direction, dragon){
		var mountain = direction_mountain[direction];
		for (var index = 0 ; index < mountain.length; index++){
			if(module.exports.getDragon(mountain[index]) == dragon){
				return mountain[index];
			}
		}
	},

	getShunNi: function(mountain, star) {
		var dragon = module.exports.getDragon(mountain);
		var direction = base_pan[star - 1];
		var newMountain = module.exports.getMountainFromDirection(direction, dragon);
		if(yang.indexOf(newMountain) >= 0){
			return true;
		}else{
			return false;
		}
	},

	getPan: function(yun, shun_ni) {
		var shift = yun - 5;
		var pan = base_pan.slice(0);
		if(!shun_ni){
			pan = pan.reverse();
		}
		if( shift == 0){
			return pan;
		}else if(shift < 0) {
			var firsthalf = pan.slice(0, Math.abs(shift));
			var secondhalf = pan.slice(Math.abs(shift), pan.length);
			return secondhalf.concat(firsthalf);
		}else {
			var firsthalf = pan.slice(0, pan.length - Math.abs(shift));
			var secondhalf = pan.slice(pan.length - Math.abs(shift), pan.length);
			return secondhalf.concat(firsthalf);
		}
	},

	drawFeiXing: function(svgContainer, yun, shan, xiang) {
		var pan = module.exports.getPan(yun, true);

        for(var x = 0; x<=450; x+= 150){
        	for(var y =0; y<=450; y+= 150){
        		svgContainer.append("rect")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("width", 150)
                        .attr("height", 150)
                        .attr('fill', 'rgba(0,0,0,0)')
                        .attr('stroke', 'black')
                        .attr('stroke-width', 3);
        	}
        }
        module.exports.drawPan(svgContainer, pan, false, 36, 150/2 - 18, 150/2 + 18/2, 'black');
        module.exports.drawShan(svgContainer, shan, pan);
        module.exports.drawXiang(svgContainer, xiang, pan);
	},

	drawPan: function(svgContainer, pan, useNumber, fontSize, xOffset, yOffset, color){
		for(var i=0; i<pan.length; i++){
        	var pos = pan[i];
        	var x = pos % 3;
        	var y = Math.floor(pos / 3);
        	var number = i+1;
        	if( !useNumber){
        		number = number[i];
        	}
        	svgContainer.append("text")
        				.text(number)
        				.attr('x', x * 150 + xOffset)
                        .attr('y', y * 150 + yOffset)
                        .attr('font-size', fontSize)
                        .attr('fill', color);
        }
	},

	drawShan: function(svgContainer, shan, pan) {
		var direction = mountain_direction[shan];
		var mountain_star = pan.indexOf(direction) + 1;
		var shunni = getShunNi(shan, mountain_star);
		var shan_pan = getPan(mountain_star, shunni);

		module.exports.drawPan(svgContainer, shan_pan, true, 28, 150/4, 150/4, 'black');
	},

	drawXiang: function(svgContainer, xiang, pan) {
		var direction = mountain_direction[xiang];
		var face_star = pan.indexOf(direction) + 1;
		var shunni = getShunNi(xiang, face_star);
		var xiang_pan = getPan(face_star, shunni);

		module.exports.drawPan(svgContainer, xiang_pan, true, 28,150 *0.75 - 18/2, 150/4, 'black');
	}
};