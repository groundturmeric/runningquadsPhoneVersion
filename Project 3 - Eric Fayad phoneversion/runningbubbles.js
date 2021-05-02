

//


			///////////////////////////////////////////////////////////////////////////
			//////////////////// Set up and initiate svg containers ///////////////////
			///////////////////////////////////////////////////////////////////////////	

			var margin = {
				top: 10,
				right: 10,
				bottom: 10,
				left: 10
			};
			// var width = 400,
			// 	height = 400;
			var width = 600,
			height = 600;
						
			//SVG container
			var svg = d3.select('#chart')
				.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", 3*height )
				.append("g")
				.attr("transform", "translate(" + (margin.left + width/2) + "," + (margin.top + height/2) + ")");



							///////////////////////////////////////////////////////////////////////////
			///////////////////////////// Data Array ///////////////////////////////
			///////////////////////////////////////////////////////////////////////////	url('/images/Horse.gif')
			const animals = [
				{id: 'Cheetah', animal: 'Cheetah', speed: 75, mass:160 ,heartrythm:250, image: `url('/images/Cheetah.gif')`, imagename:`Cheetah`},
				{id: 'Horse', animal: 'Horse', speed: 55, mass:1900, heartrythm: 180, image: `url('/images/Horse.gif')`,imagename:`Horse`}, //what is going on with image?
				{id: 'Lion', animal: 'Lion', speed:50, mass: 420, heartrythm: 76,image: `url('/images/Lion.gif')`,imagename:`Lion`},
				// {id: 4, animal: 'Ostrich', speed: 70, mass:320, heartrythm:? ,image: 'ostrich'},
				{id: 'Greyhound', animal: 'Greyhound', speed: 45,mass:75,heartrythm:90,  image: `url('/images/Greyhound.gif')`, imagename:`Greyhound`},
				{id: 'Grizzly', animal: 'Grizzly bear', speed: 35, mass:790, heartrythm:90, image: `url('/images/Grizzly.gif')`, imagename:`Grizzly`},
				{id: 'Cat', animal: 'Cat', speed: 30, mass: 10, heartrythm: 220, image: `url('/images/Cat.gif')`, imagename:`Cat`},
				{id: 'Rabbit', animal: 'Rabbit', speed: 25, mass:5, heartrythm:300, image: `url('/images/Rabbit.gif')`, imagename:`Rabbit`},
				{id: 'Squirrel', animal: 'Squirrel', speed: 20, mass:1.5, heartrythm:420, imagename: 'Squirrel'},
				{id: 'Mouse', animal: 'House mouse', speed: 8, mass:0.1, heartrythm: 750, image: `url('/images/Mouse.gif')`, imagename:`Mouse`},
				{id: 'Tortoise', animal: 'Giant tortoise', speed: 0.3, mass:500, heartrythm:6, image: 'tortoise', imagename:`Gturtle`}
			];



     /////////////////////////////////////////////*
    ///DETERMINE MIN AND MAX VALUES OF VARIABLES/////
    //////////////////////////////////////////////*/
    const speeds = {
        min: d3.min(animals, function(d) { return +d.speed; }),
        max: d3.max(animals, function(d) { return +d.speed; })
    };

	const weights = {
        min: d3.min(animals, function(d) { return +d.mass; }),
        max: d3.max(animals, function(d) { return +d.mass; })
    };

            ////////////SCALES//////////////////////////////
			//speed scale is inversed in the range, smaller speeds get biger duration
			var maxSpeed = d3.max(animals, function(d) { return d.speed; });

			var speedScale = d3.scale.linear()
		    .domain([0, speeds.max])
			.range([0, 3000])
			//.range([maxS, maxSpeed]);

			var rScale = d3.scale.linear()
		    .domain([weights.min, weights.max])
			.range([15, 50]);

			var weightScale = d3.scale.linear()
		    .domain([weights.min, weights.max])
			.range([5, 90]);

			// var rScale =  d3.scaleSqrt()
		    // .domain([weights.min, weights.max])
			// .range([5, 40])




    // defining a scale for the radius of bubbles
// rScale = d3.scaleSqrt()
//         .domain(d3.extent(animals, d => +d.mass))
//         .range([3, 100]);
	
			///////////////////////////////////////////////////////////////////////////
			///////////////////////////// Create filter ///////////////////////////////
			///////////////////////////////////////////////////////////////////////////	


			//SVG filter for the gooey effect
			//Code taken from http://tympanus.net/codrops/2015/03/10/creative-gooey-effects/
			var defs = svg.append("defs");
			var filter = defs.append("filter").attr("id","gooeyCodeFilter");
			filter.append("feGaussianBlur")
				.attr("in","SourceGraphic")
				.attr("stdDeviation","10")
				//to fix safari: http://stackoverflow.com/questions/24295043/svg-gaussian-blur-in-safari-unexpectedly-lightens-image
				.attr("color-interpolation-filters","sRGB") 
				.attr("result","blur");
			filter.append("feColorMatrix")
				.attr("in","blur")
				.attr("mode","matrix")
				.attr("values","1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9")
				.attr("result","gooey");


		///////////////////////////////////////////////////////////////////////////
		/////////////////////////// Create circles ////////////////////////////////
		///////////////////////////////////////////////////////////////////////////	

		//Create scale
		var xScale = d3.scale.linear()
			.domain([-1.25, 1.25])
			.range([-width/2, width/2]);


		
		//Create a wrapper for the circles that has the Gooey effect applied to it
		 var circleWrapper = svg.append("g")
		 ;

	
			//.style("filter", "url(#gooeyCodeFilter)");

		//Create the circles that will move out and in the center circle
		var steps = 10;
		//var colors = [ "#B7D84B", "#44ACCF",];
		var colors = [ "#EBDE52","#F95B34", "#FF9C34", "#EE3E64", "#F36283",  "#B7D84B","#44ACCF"];

			animals.forEach((d, i) => {
				d.fixedAngle = (i/steps)*(2*Math.PI);
				d.randomAngle = (i/steps)*(2*Math.PI);
				d.color = colors[i%colors.length]
				//d.r = Math.floor(Math.random() * 20 + 15);
			})
		// for (var i = 0; i < steps; i++) {
		// 	flyCircleData.push({ 
		// 		fixedAngle: (i/steps)*(2*Math.PI),
		// 		randomAngle: (i/steps)*(2*Math.PI),
		// 		speed: Math.random() * 7000 + 3000,
		// 		r: Math.floor(Math.random() * 20 + 15),
		// 		color: colors[i%colors.length]
		// 	})
		// }//for i
console.log(animals);


		//Set up the circles
		//const flyCircles = circleWrapper.selectAll(".flyCircle")
		var flyCircles = circleWrapper.selectAll(".flyCircle")
			.data(animals)
			.enter().append("circle")
			.attr("class", "flyCircle")
			// .attr("id", function(d) { return d.animal })
			 .style("fill", function(d) { return d.color; })
			.attr("cy", 0)
			.attr("cx", 0)
			.attr("r", 1)
			.transition().duration(1000)//.delay(function(d) { return xScale(Math.sin(d.fixedAngle)); })
			// .attr("cy", function(d) { return xScale(Math.sin(d.fixedAngle/3)/1.5); })     // to change the division of the splatter divide by the same for the two inside the paranthesis
			// .attr("cx", function(d) { return xScale(Math.cos(d.fixedAngle/3)/1.5); })    // to change size of the circle divide these the same way
			.attr("cy", function(d) { return xScale(Math.sin(d.fixedAngle)/1); })
			.attr("cx", function(d) { return xScale(Math.cos(d.fixedAngle)/1); })
			// .attr("cy", 0)
			// .attr("cx", 100)
			.attr("r",function(d) { return rScale(d.mass) }) //add sqaure root
			.each("end", goRound)
			.style("fill-opacity", 0.7)
        // .attr("stroke", "gray")
        // .style("stroke-width", 2)
		;
		


						//Continuously moves the circles with different speeds
						function goRound(d) {
			d3.select(this)
				.transition().duration(function(d) { return 500000/(d.speed); })
				.ease("linear")
				.attrTween("transform", function() { return d3.interpolateString("rotate(0)", "rotate(360)"); })
				.each("end", goRound);
		}//function goRound

		//function goRound

//////////>>>>>>>><<<<<<<<<<<<<<<<<<     >>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<
///////////>>>>>>>><<<<<<<<<<<<<<<<<<   >>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<
////////////>>>>>>>><<<<<<<<<<<<<<<<<< >>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<
/////////////>>>>>>>><<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<
//////////////>>>>>>>><<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<
/////////////>>>>>>>><<<<<<<<<<<<<<<<<< >>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<
///////////>>>>>>>><<<<<<<<<<<<<<<<<<      >>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<
//////////>>>>>>>><<<<<<<<<<<<<<<<<<        >>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<
/////////>>>>>>>><<<<<<<<<<<<<<<<<<           >>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<
/////////////>>>>>>>><<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<
	svg.append("svg:image")
	.attr("id", "centerdisplay")
	.attr("class", "centerdisplay")
		// .attr("xlink:href", 'images/Cheetah.gif')
		.attr("width", 300)
		.attr("height", 300)
		.attr("x", -150)
		.attr("y", -150)
		.attr("z",0)
		.style("opacity", 1)
		.style("visibility", "hidden")
		;
		;
		//Continuously moves the circles with different speeds



		//

var rect4 = d3.select("#RunningPicture").append("svg").attr("width", 800).attr("height", 200)


	


//////////////////////////////////////////////////////////
////////////////////////////Text//////////////////////////
/////////////////////////////////////////////////////////

var text = circleWrapper.selectAll("text")
    .data(animals)
    .enter()
    .append("text")
	.attr("id", "hovertext")
    // .text(function(d){return d.animal;})
	.text( function(d, i) { return d.animal+ ' - ' +d.speed+`mph`})
    //.attr("y", function(d,i) { return i*33- 125})
	.attr("y",  -105)
    .attr("x", 0)
    .attr("font-size",25)
    .attr("font-family","serif")
    .attr("text-anchor","middle")
    .attr("font-weight","bold")
	// .attr("fill", "white")
	.attr("visibility", "hidden")
	.style("fill-opacity", 1)
	.attr("id", function(d){   return d.animal;})
	.style("fill",function(d) { return d.color; })
	
	//.attr('transform', 'rotate(90)')
	;
	




	////////////////////// HOVER for text visibility /////////////////////
	/////////////>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<////////////



	
	d3.selectAll(".flyCircle")
  .on("mouseover", function(d, i,) {
	  
	
d3.select(this)
    .attr("stroke", "yellow")
    .attr("stroke-width", 2)
.attr("stroke", "yellow")
.style('fill-opacity', function(e) {
		if (d.animal === e.animal) {
			return '1';
		}
		return '0.1';
	})
;




d3.select("#centerdisplay")
.attr("xlink:href", `images/${d.imagename}.gif`)
.style("visibility", "visible");

	text.style('visibility', function(e) {
		if (d.animal === e.animal) {
			return 'visible';
		}
		return 'hidden';
	})



	d3.select("#chart").html(html)
	.style('background-image',function(d) {
		 return d.image;
		 console.log(d.image)
		});



d3.select(".centerdisplay").attr("xlink:href", "images/${d.imagename}.gif")



}).on("mouseout", function() {



d3.select(this)

    .attr("stroke-width", 0)
.attr("stroke", "gray")
.style("fill-opacity", 0.8);





});

d3.select("#chart").on("click", function () {

	d3.select(".centerdisplay").style("visibility", "hidden")

	text.style('visibility', "hidden")


})





// create svg element:
// var rect1 = d3.select("#rect").append("svg").attr("width", 80000).attr("height", 2000)
// Add the path using this helper function


//////////////////////////////////////////////////////////
//////////////////////////// heartbeatChart  //////////////////////////
/////////////////////////////////////////////////////////
var title = svg.selectAll("title")
    .append("text")
	// .attr("id", "barlabel")// id or else it animates in the css
    // .text(function(d){return d.animal;})
	.text( `animal's heart beat`)
    //.attr("y", function(d,i) { return i*33- 125})
	.attr("y",  100)
    .attr("x",-100 )
    .attr("font-size",13)
    .attr("font-family","serif")
    .attr("text-anchor","middle")
    .attr("font-weight","bold")
	.attr("fill", "white")
	.attr("visibility", "visible")
	.style("fill-opacity", 0.8)



var bars = circleWrapper.selectAll("rect")
    .data(animals)
    .enter()
.append('rect')
  .attr('x', -100)
//   .attr('y', 300)
.attr("y",   function(d,i) { return i*63 +370})
  .attr('width', 0)
  .attr('height', 10)
  .attr('stroke', 'black')
  .attr('fill',function(d) { return d.color; })
  .style("fill-opacity", 0.8)
  .transition()
            .duration(500)
			.attr('width', function(d) { return weightScale(d.mass)})
            .attr('x', d => 30)
            .delay((d, i) => i* 20)
            ;


  var barlabels = svg.selectAll("barlabel")
    .data(animals)
    .enter()
    .append("text")
	// .attr("id", "barlabel")// id or else it animates in the css
    // .text(function(d){return d.animal;})
	.text( function(d, i)  { return d.animal+ ' - ' +d.heartrythm+`bpm`})
    //.attr("y", function(d,i) { return i*33- 125})
	.attr("y",  function(d,i) { return i*63 +375})
    .attr("x",-100 )
    .attr("font-size",13)
    .attr("font-family","serif")
    .attr("text-anchor","middle")
    .attr("font-weight","bold")
	.attr("fill", "white")
	.attr("visibility", "visible")
	.style("fill-opacity", 0.8)

	var speedbarlabels = svg.selectAll("barlabel")
    .data(animals)
    .enter()
    .append("text")
	// .attr("id", "barlabel")// id or else it animates in the css
    // .text(function(d){return d.animal;})
	.text( function(d, i) { return  +d.speed+`mph`})
    //.attr("y", function(d,i) { return i*33- 125})
	.attr("y",  function(d,i) { return i*63 +360})
    .attr("x",function(d) { return (55+d.speed*1.5)})
    .attr("font-size",13)
    .attr("font-family","serif")
    .attr("text-anchor","middle")
    .attr("font-weight","bold")
	.attr("fill", "white")
	.attr("visibility", "visible")
	.style("fill-opacity", 0.8)

	var weightbarlabels = svg.selectAll("barlabel")
    .data(animals)
    .enter()
    .append("text")
	// .attr("id", "barlabel")// id or else it animates in the css
    // .text(function(d){return d.animal;})
	.text( function(d, i) { return  +d.mass+`lbp`})
    //.attr("y", function(d,i) { return i*33- 125})
	.attr("y",  function(d,i) { return i*63 +380})
    .attr("x",function(d) { return 55+weightScale(d.mass)})
    .attr("font-size",13)
    .attr("font-family","serif")
    .attr("text-anchor","middle")
    .attr("font-weight","bold")
	.attr("fill", "white")
	.attr("visibility", "visible")
	.style("fill-opacity", 0.8)


	var speedbars = circleWrapper.selectAll(".speedrect")
    .data(animals)
    .enter()
.append('rect')
  .attr('x', -50)
//   .attr('y', 300)
.attr("y", function(d,i) { return i*63 +350})
  .attr('width', 0)
  .attr('height',10)
//   .attr('stroke', 'black')
  .attr('fill',function(d) { return d.color; })
  .style("fill-opacity", 0.8)
  .transition()
            .duration(1500)
			.attr('width', function(d) { return (d.speed*1.5)})
            .attr('x', d => 30)
            .delay((d, i) => i* 20)

			;
	

	//.attr('transform', 'rotate(90)')
	;
	


			//SVG filter for the gooey effect
			//Code taken from http://tympanus.net/codrops/2015/03/10/creative-gooey-effects/
			var defs = svg.append("defs");
			var filter = defs.append("filter").attr("id","gooeyCodeFilter");
			filter.append("feGaussianBlur")
				.attr("in","SourceGraphic")
				.attr("stdDeviation","10")
				//to fix safari: http://stackoverflow.com/questions/24295043/svg-gaussian-blur-in-safari-unexpectedly-lightens-image
				.attr("color-interpolation-filters","sRGB") 
				.attr("result","blur");
			filter.append("feColorMatrix")
				.attr("in","blur")
				.attr("mode","matrix")
				.attr("values","1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9")
				.attr("result","gooey");

var hearbeatcircle = svg.selectAll("beat")
.data(animals) 
.enter()
.append("circle")
.attr("id", function(d) { return d.id})
.attr("class", "beat")
.attr("cx", function(d) { return xScale(d.animal)+ 20; })
.attr("cy", function(d,i) { return i*63 +370})
.attr("r",22)
.attr("opacity", 0.4)
// .attr('stroke', 'red')
.style("fill", function(d) { return d.color; })
.style("filter", "url(#gooeyCodeFilter)")
;

repeat();
//<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3
// >>>>>>>>>><<<<<<<<3<3<3<3-----<3----HEARTBEATS BY ID (couldn't figure out a function)
//<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3

svg.append("svg:image")
	// .attr("id", "centerdisplay")
	// .attr("class", "centerdisplay")
		.attr("xlink:href", 'images/heart.png')
		.attr("width", 300)
		.attr("height", 300)
		.attr("x", -150)
		.attr("y", -150)
		.attr("z",0)
		.style("opacity", 1)
		.style("visibility", "visible")



 



