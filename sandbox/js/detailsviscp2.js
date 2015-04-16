/**
 * Created by Stephens, Darlington, Arnold
 */

/**
 * DetailsVis object for Final Project of CS171
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _file -- the csv file to use
 * @param _growthFlag -- whether to show data or growth of data
 * @param _whichSlide -- which slide to show
 * @param _eventHandler -- the Eventhandling Object to emit data to 
 * @constructor
 */
//DetailsVis = function(_parentElement, _whichFile, _whichMetric, _begDate, _endDate, _eventHandler){
DetailsVis = function(_parentElement, _eventHandler){
    this.parentElement = _parentElement;
    this.eventHandler = _eventHandler;
		
    this.detVis();
}

	/**
	 * Gets called by event handler
	 */
DetailsVis.prototype.onSelectionChange= function (selectionStart, selectionEnd){

}

DetailsVis.prototype.detVis = function () {
	
	var margin = {top: 30, right: 40, bottom: 20, left: 30},
			width = window.innerWidth*0.7 - margin.left - margin.right - 100,
			height = window.innerHeight*0.6 - margin.top - margin.bottom,
			widthh = window.innerWidth*0.7 - margin.left - margin.right - 100,
			heighth = window.innerHeight*0.1 - margin.top - margin.bottom;

			
	var dimensionh = [
			{
				name: "name",
				scale: d3.scale.ordinal().rangePoints([0, width]),
				type: "string"
			}
		];
			
	var dimensions = [
			{
				name: "name",
				scale: d3.scale.ordinal().rangePoints([0, width]),
				type: "string"
			}
		];

	var parse = d3.time.format("%Y").parse;


	d3.csv("data/clajson2.csv", function(data) {

		numYears = Object.keys(data[0])
			.sort(function(a, b){ return d3.descending(a, b); });

		for (var i=0; i < numYears.length; i++) {
			if (numYears[i] != "name") {
				buildDim = {
					name: numYears[i],
					scale: d3.scale.linear().range([0, width]),
					type: "number"
					};
				dimensions.push(buildDim);
			}
		}

		var x = d3.scale.ordinal()
				.domain(dimensions.map(function(d) { return d.name; }))
				.rangePoints([0, (dimensions.length-1) * 40]);

		var xh = d3.scale.ordinal()
				.domain(dimensionh.map(function(d) { return d.name; }))
				.rangePoints([0, heighth]);

		var line = d3.svg.line()
				.defined(function(d) { return !isNaN(d[1]); });

		var yAxish = d3.svg.axis()
				.orient("top");
				
		var yAxis = d3.svg.axis()
				.tickFormat(function (d) { return ''; })
				.orient("top");
			

		var svgh = d3.select("#divmainhead").append("svg")
				.attr("width", widthh + margin.left + margin.right)
				.attr("height", heighth + margin.top + margin.bottom)
			.append("g")
				.attr("transform", "translate(" + margin.left + ",0)");// + margin.top + ")");

		var dimensionhh = svgh.selectAll(".dimensionh")
				.data(dimensionh)
			.enter().append("g")
				.attr("class", "dimensionh");

		dimensionh.forEach(function(dimension) {
			dimension.scale.domain(dimension.type === "number"
					? d3.extent(data, function(d) { return +d[dimension.name]; })
					: data.map(function(d) { return d[dimension.name]; }));//.sort());
		});

		dimensionhh.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(0," + (heighth + margin.bottom + margin.top + 6) + ")")
				.each(function(d) { d3.select(this).call(yAxish.scale(d.scale)); })
	        .selectAll("text")
	      		.attr("class", "label")
	            .style("text-anchor", "end")
	            .attr("dx", "-.8em")
	            .attr("dy", "1em")
	            .attr("transform", function(d) {
	                return "rotate(90)" 
	                });

		// Main Body
		var svgv = d3.select("#divmainbody")			
						.style({
							"width": width + margin.left + margin.right + 20 + "px",
							"height": height + margin.top + margin.bottom + "px",
							"overflow":"auto"
						});
						
		var svgg = svgv.append("g");

		var svg = svgg.append("svg")
				.attr("display","inline-block")
				.attr("width", width + margin.left + margin.right)
				.attr("height", dimensions.length * 40 + "px")
			.append("g")
				.attr("transform", "translate(" + margin.left + ",0)");// + margin.top + ")");

		var dimension = svg.selectAll(".dimension")
				.data(dimensions)
			.enter().append("g")
				.attr("class", "dimension")
				.attr("transform", function(d,i) { return "translate(0," + (i*40) + ")"; }); //x(d.name)
		
		dimensions.forEach(function(dimension) {
			dimension.scale.domain(dimension.type === "number"
					? d3.extent(data, function(d) { return +d[dimension.name]; })
					: data.map(function(d) { return d[dimension.name]; }));//.sort());
		});

		svg.append("g")
				.attr("class", "background")
			.selectAll("path")
				.data(data)
			.enter().append("path")
				.attr("d", draw);

		svg.append("g")
				.attr("class", "foreground")
			.selectAll("path")
				.data(data)
			.enter().append("path")
				.attr("d", draw);

		dimension.append("g")
				.attr("class", "axis")
				.each(function(d) { d3.select(this).call(yAxis.scale(d.scale)); })
			.append("text")
				.attr("class", "title")
				.attr("text-anchor", "end")
				.attr("y", 0)
        		.attr("dx", "-0.3em")
				.text(function(d) { 
					if (d.type === "number") {
						return d.name;
					} else {
						return "";
					}
				});

		var ordinal_labels = d3.selectAll(".axis text")
				.on("mouseover", mouseover)
				.on("mouseout", mouseout);

		var projection = d3.selectAll(".background path,.foreground path")
				.on("mouseover", mouseover)
				.on("mouseout", mouseout);

		function mouseover(d) {
			svg.classed("active", true);
			svgh.classed("active", true);

			// this could be more elegant
			if (typeof d === "string") {
				projection.classed("inactive", function(p) { return p.name !== d; });
				projection.filter(function(p) { return p.name === d; }).each(moveToFront);
				ordinal_labels.classed("inactive", function(p) { return p !== d; });
				ordinal_labels.filter(function(p) { return p === d; }).each(moveToFront);
			} else {
				projection.classed("inactive", function(p) { return p !== d; });
				projection.filter(function(p) { return p === d; }).each(moveToFront);
				ordinal_labels.classed("inactive", function(p) { return p !== d.name; });
				ordinal_labels.filter(function(p) { return p === d.name; }).each(moveToFront);
			}
		}

		function mouseout(d) {
			svg.classed("active", false);
			svgh.classed("active", false);
			projection.classed("inactive", false);
			ordinal_labels.classed("inactive", false);
		}

		function moveToFront() {
			this.parentNode.appendChild(this);
		}

		function draw(d) {
			return line(dimensions.map(function(dimension) {
				return [dimension.scale(d[dimension.name]), x(dimension.name)];
			}));
		}

	});

}