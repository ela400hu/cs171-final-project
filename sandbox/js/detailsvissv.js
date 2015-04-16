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
	
	var that = this;

	var margin = {top: 0, right: 10, bottom: 10, left: 30}
	
	var width = window.innerWidth*0.5 - margin.right - margin.left;
	var heights = window.innerHeight*0.5;
	var height = 2000 - margin.top - margin.bottom;
	var hheight = 200 - margin.top - margin.bottom;
	
	d3.select("#divmainbody")
			.attr("width",width + margin.left + margin.right)
			.attr("height",heights);
	
	d3.csv("data/sr_ag_pop2.csv", function(data) {
			
		var dimensions = [];
		var parse = d3.time.format("%Y").parse;

		// Nest values by symbol.
		var symbols = d3.nest()
				.key(function(d) { return d.symbol; })
				//.key(function(d) { return parse(d.date); })
				.entries(data);

		// Parse dates and numbers. We assume values are sorted by date.
		// Also compute the maximum price per symbol, needed for the y-domain.
		symbols.forEach(function(s,i) {
			s.values.forEach(function(d) {
					if (i==0) {
						buildDim = {
								name: d.date,
								scale: d3.scale.linear().range([0, width]),
								type: "number"
								}
						dimensions.push(buildDim);
					}
					//d.date = parse(d.date);
					d.price = +d.price;
				});
			s.maxPrice = d3.max(s.values, function(d) { return d.price; });
			s.minPrice = d3.min(s.values, function(d) { return d.price; });
			s.sumPrice = d3.sum(s.values, function(d) { return d.price; });
		});

		// Sort by maximum price, descending.
		symbols.sort(function(a, b) { return b.maxPrice - a.maxPrice; });

		var y = d3.scale.ordinal()
				.domain(dimensions.map(function(d) { return d.name; }))
				.rangePoints([0, height]);

		var line = d3.svg.line()
				.defined(function(d) { return !isNaN(d[1]); });

		var xAxis = d3.svg.axis()
				.orient("left");

		var svgh = d3.select("#divmainhead").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", hheight + margin.top + margin.bottom)
			.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		var svgd = d3.select("#divmainbody").append("div")
									.attr("class","scroll")
									.attr("width", width + margin.left + margin.right)
									.attr("height", heights);
		
		var svgg = svgd.append("g");

		var svg = svgg.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
			.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var dimensionh = svgh.selectAll(".dimension")
				.data([{
								name: "name",
								scale: d3.scale.ordinal().rangePoints([0, height]),
								type: "string"
							}])
			.enter().append("g")
				.attr("class", "dimension")
				.attr("transform", "translate(0)");

		var dimension = svg.selectAll(".dimension")
				.data(dimensions)
			.enter().append("g")
				.attr("class", "dimension")
				.attr("transform", function(d) { return "translate(" + y(d.name) + ")"; });
				
			dimensions.forEach(function(dimension) {
				dimension.scale.domain(dimension.type === "number"
						? d3.extent(data, function(d) { return +d.price; })
						: data.map(function(d) { return d.symbol; }).sort());
			});

//debugger;

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
					.each(function(d) { d3.select(this).call(xAxis.scale(d.scale)); })
				.append("text")
					.attr("class", "title")
					.attr("text-anchor", "end")
					.attr("x", -9)
					.text(function(d) { return d.name; });

			var ordinal_labels = svg.selectAll(".axis text")
					.on("mouseover", mouseover)
					.on("mouseout", mouseout);

			var projection = svg.selectAll(".background path,.foreground path")
					.on("mouseover", mouseover)
					.on("mouseout", mouseout);

			function mouseover(d) {
				svg.classed("active", true);

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
				projection.classed("inactive", false);
				ordinal_labels.classed("inactive", false);
			}

			function moveToFront() {
				this.parentNode.appendChild(this);
			}
			
			function draw(d) {
				return line(dimensions.map(function(dimension) {
					return [y(dimension.name), dimension.scale(d[dimension.name])];
				}));
			}
	
	})

}