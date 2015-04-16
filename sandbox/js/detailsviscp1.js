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
DetailsVis = function(_parentElement, _whichFile, _whichMetric, _begDate, _endDate, _eventHandler){
    this.parentElement = _parentElement;
    this.whichFile = _whichFile;
    this.whichMetric = _whichMetric;
    this.begDate = _begDate;
    this.endDate = _endDate;
    this.eventHandler = _eventHandler;

		this.showFlag = true;
		
		numViz = 9;
		if (this.whichFile == "0") { this.file = "sr_ag_pop.csv" };
		if (this.whichFile == "1") { this.file = "sr_wl_fd.csv" };
		if (this.whichFile == "2") { this.file = "sr_wl_fil.csv" };
		if (this.whichFile == "3") { this.file = "sr_wl_dis.csv" };
		if (this.whichFile == "4") { this.file = "sr_fl_bud.csv" };
		if (this.whichFile == "5") { this.file = "sr_ju_bud.csv" };
		if (this.whichFile == "6") { this.file = "sr_ag_pop2.csv" };
		if (this.whichFile == "7") { this.file = "sr_co_dtc.csv" };
		if (this.whichFile == "8") { this.file = "sr_co_c1y.csv" };
		
    this.detVis();
}

	/**
	 * Gets called by event handler
	 */
DetailsVis.prototype.onSelectionChange= function (selectionStart, selectionEnd){
		this.showFlag = false;
		for (i = 0; i < numViz; i++) {
			d3.select(".srsvg"+i).attr("visibility", "hidden");
		};
}

DetailsVis.prototype.detVis = function () {
	
	var margin = {top: 30, right: 40, bottom: 20, left: 30},
			width = window.innerWidth*0.7 - margin.left - margin.right,
			height = window.innerHeight*0.5 - margin.top - margin.bottom,
			widthh = window.innerWidth*0.7 - margin.left - margin.right,
			heighth = window.innerHeight*0.2 - margin.top - margin.bottom;
			
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
		},
		{
			name: "economy (mpg)",
			scale: d3.scale.linear().range([0, width]),
			type: "number"
		},
		{
			name: "cylinders",
			scale: d3.scale.linear().range([width, 0]),
			type: "number"
		},
		{
			name: "displacement (cc)",
			scale: d3.scale.linear().range([width, 0]),
			type: "number"
		},
		{
			name: "power (hp)",
			scale: d3.scale.linear().range([width, 0]),
			type: "number"
		},
		{
			name: "weight (lb)",
			scale: d3.scale.linear().range([width, 0]),
			type: "number"
		},
		{
			name: "0-60 mph (s)",
			scale: d3.scale.linear().range([width, 0]),
			type: "number"
		},
		{
			name: "year",
			scale: d3.scale.linear().range([width, 0]),
			type: "number"
		},
	];

	var x = d3.scale.ordinal()
			.domain(dimensions.map(function(d) { return d.name; }))
			.rangePoints([0, height]);
			
	var xh = d3.scale.ordinal()
			.domain(dimensionh.map(function(d) { return d.name; }))
			.rangePoints([0, heighth]);

	var line = d3.svg.line()
			.defined(function(d) { return !isNaN(d[0]); });

	var yAxish = d3.svg.axis()
			.orient("top");
			
	var yAxis = d3.svg.axis()
			.tickFormat(function (d) { return ''; })
			.orient("top");
			
	d3.csv("Layout_Examples/cars.small.csv", function(data) {
		
		// Header
		//var svgvh = d3.select("#divmainhead").append("div");

		//var svggh = svgvh.append("g");

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
					: data.map(function(d) { return d[dimension.name]; }).sort());
		});

		dimensionhh.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(0," + (heighth + margin.bottom + margin.top + 6) + ")")
				.each(function(d) { d3.select(this).call(yAxish.scale(d.scale)); })
	        .selectAll("text")  
	            .style("text-anchor", "end")
	            .attr("dx", "-.8em")
	            .attr("dy", "1em")
	            .attr("transform", function(d) {
	                return "rotate(90)" 
	                });
			
		// Main Body
		var svgv = d3.select("#divmainbody")
						.attr("class","scroll")
						.attr("width", width + margin.left + margin.right)
						.attr("height", height + margin.top + margin.bottom);

		var svgg = svgv.append("g");

		var svg = svgg.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", dimensions.length * 40)
			.append("g")
				.attr("transform", "translate(" + margin.left + ",0)");// + margin.top + ")");

		var dimension = svg.selectAll(".dimension")
				.data(dimensions)
			.enter().append("g")
				.attr("class", "dimension")
				.attr("transform", function(d) { return "translate(0," + x(d.name) + ")"; });
		
		dimensions.forEach(function(dimension) {
			dimension.scale.domain(dimension.type === "number"
					? d3.extent(data, function(d) { return +d[dimension.name]; })
					: data.map(function(d) { return d[dimension.name]; }).sort());
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
				//.attr("transform", "translate(0," + 5 + ")")
				.each(function(d) { d3.select(this).call(yAxis.scale(d.scale)); })
			.append("text")
				.attr("class", "title")
				.attr("text-anchor", "end")
				.attr("y", 0)
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
	});

	function draw(d) {
		return line(dimensions.map(function(dimension) {
			return [dimension.scale(d[dimension.name]), x(dimension.name)];
		}));
	}

}