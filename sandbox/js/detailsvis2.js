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
	var whichMetric = this.whichMetric;
	var whichFile = this.whichFile;

	var m = [20, 20, 10, 10];
	var w = window.innerWidth*0.75 - m[1] - m[3];
	var h = 2000 - m[0] - m[2];
	var hh = 200 - m[0] - m[2];

	var x = 0;
	var y = 0;
	var duration = 1500;
	var delay = 500;
			
	var color = d3.scale.category10();
	
	var svgh = d3.select("#divmainhead").append("svg")
			.attr("class", "detsvgh")
			.attr("visibility", "visible")
			.attr("width", w + m[1] + m[3])
			.attr("height", hh + m[0] + m[2])
		.append("g")
			.attr("transform", "translate(" + m[3] + "," + m[0] + ")");
	
	var svg = d3.select("#divmainbody").append("svg")
			.attr("class", "detsvgb")
			.attr("visibility", "visible")
			.attr("width", w + m[1] + m[3])
			.attr("height", h + m[0] + m[2])
		.append("g")
			.attr("transform", "translate(" + m[3] + "," + m[0] + ")");
			
	// A line generator, for the dark stroke.
	var line = d3.svg.line()
			.interpolate("basis")
			.x(function(d) { return x(d.value); })
			.y(function(d) { return y(d.date); });

	// A line generator, for the dark stroke.
	var axis = d3.svg.line()
			.interpolate("basis")
			.x(w)
			.y(function(d) { return y(d.date); });


	d3.csv("data/"+that.file, function(data) {
		var parse = d3.time.format("%Y").parse;

		// Nest values by category.
		catsumm = d3.nest()
				.key(function(d) { return d.category; })
				.entries(data);

		// Parse dates and numbers. We assume values are sorted by date.
		// Also compute the maximum value per category, needed for the x-domain.
		catsumm.forEach(function(s) {
			var prevValue = 0;
			s.values.forEach(function(d) { 
							d.date = parse(d.date);
							if (growthFlag) {
								if (prevValue == 0) {
									prevValue = d.value;
									d.value = 0;
								} else {
									d.value = (prevValue - d.value) / prevValue;
								}
							} else {
								d.value = +d.value;
							}
						});
			s.maxValue = d3.max(s.values, function(d) { return d.value; });
			s.minValue = d3.min(s.values, function(d) { return d.value; });
			s.sumValue = d3.sum(s.values, function(d) { return d.value; });
		});

		// Sort by maximum value, descending.
		catsumm.sort(function(a, b) { return b.maxValue - a.maxValue; });

		var g = svg.selectAll("g")
				.data(catsumm)
			.enter().append("g")
				.attr("class", "symbol");

		setTimeout(showreel(), duration);
	});

	
	function showreel() {

		var allFlag = (whichSlide == "0");

		if (!allFlag) {
			duration = 0;
			delay = 0;
			d3.select(".srsvg"+whichFile).attr("visibility", "hidden");
		};

		that.showFlag && lines(allFlag ? 1 : 2, function(){
			that.showFlag && horizons(function() {
				that.showFlag && areas(function() {
					that.showFlag && stackedArea(function () {
						that.showFlag && streamgraph(function () {
							that.showFlag && overlappingArea(function() {
								that.showFlag && groupedBar(function() {
									that.showFlag && stackedBar(function() {
										if (allFlag) {
											svg.selectAll("*").remove();
											svg.selectAll("g").data(catsumm).enter().append("g").attr("class", "symbol");
											that.showFlag && showreel();
										};
										setTimeout(function(){d3.select(".srsvg"+whichFile).attr("visibility", "visible")},1000);
										});
									setTimeout(function(){d3.select(".srsvg"+whichFile).attr("visibility", "visible")},1000);
									});
								setTimeout(function(){d3.select(".srsvg"+whichFile).attr("visibility", "visible")},1000);
								});
							setTimeout(function(){d3.select(".srsvg"+whichFile).attr("visibility", "visible")},1000);
							});
						setTimeout(function(){d3.select(".srsvg"+whichFile).attr("visibility", "visible")},1000);
						});
					setTimeout(function(){d3.select(".srsvg"+whichFile).attr("visibility", "visible")},1000);
					});
				setTimeout(function(){d3.select(".srsvg"+whichFile).attr("visibility", "visible")},1000);
				});
			setTimeout(function(){d3.select(".srsvg"+whichFile).attr("visibility", "visible")},1000);
			});

	};

	function lines(rep, callback) {
		x = d3.time.scale().range([0, w - txtm]);
		y = d3.scale.linear().range([h / catsumm.length - 20, 0]);

		// Compute the minimum and maximum date across catsumm.
		x.domain([
			d3.min(catsumm, function(d) { return d.values[0].date; }),
			d3.max(catsumm, function(d) { return d.values[d.values.length - 1].date; })
		]);

		var g = svg.selectAll(".symbol")
				.attr("transform", function(d, i) { return "translate(0," + (i * h / catsumm.length + 10) + ")"; });

		g.each(function(d) {
			var e = d3.select(this);

			e.append("path")
					.attr("class", "line");

			e.append("circle")
					.attr("r", 5)
					.style("fill", function(d) { return color(d.key); })
					.style("stroke", "#000")
					.style("stroke-width", "2px");

			e.append("text")
					.attr("x", 12)
					.attr("dy", ".31em")
					.text(d.key);
		});

		function draw(k) {
			g.each(function(d) {
				var e = d3.select(this);
				y.domain([0, d.maxValue]);

				e.select("path")
						.attr("d", function(d) { return line(d.values.slice(0, k + 1)); });

				e.selectAll("circle, text")
						.data(function(d) { return [d.values[k], d.values[k]]; })
						.attr("transform", function(d) { return "translate(" + x(d.date) + "," + y(d.value) + ")"; });
			});
		}

		if (that.whichSlide == "1") {
			that.showFlag = false;
		};
		if (!that.showFlag) {
			duration = 0;
			delay = 0;
		};
		
		var k = 1, n = catsumm[0].values.length;
		if (rep == 1) { 
			d3.timer(function() {
				if (!that.showFlag) { return true };
				draw(k);
				if ((k += 1) >= n - 1) {
					draw(n - 1);
					setTimeout(callback, delay);
					return true;
				}
			});
		} else {
			draw(n-1);
			callback();
		};
		
	}

	function horizons(callback) {
		
		svg.insert("defs", ".symbol")
			.append("clipPath")
				.attr("id", "clip")
			.append("rect")
				.attr("width", w)
				.attr("height", h / catsumm.length - 10);

		var color2 = d3.scale.ordinal()
				.range(["#c6dbef", "#9ecae1", "#6baed6"]);

		var g = svg.selectAll(".symbol")
				.attr("clip-path", "url(#clip)");

		area
				.y0(h / catsumm.length - 10);

		g.select("circle").transition()
				.duration(duration)
				.attr("transform", function(d) { return "translate(" + (w - txtm) + "," + (-h / catsumm.length) + ")"; })
				.remove();

		g.select("text").transition()
				.duration(duration)
				.attr("transform", function(d) { return "translate(" + (w - txtm) + "," + (h / catsumm.length - 25) + ")"; })
				.attr("dy", "0em");

		g.each(function(d) {
			y.domain([0, d.maxValue]);

			d3.select(this).selectAll(".area")
					.data(d3.range(3))
				.enter().insert("path", ".line")
					.attr("class", "area")
					.attr("transform", function(d) { return "translate(0," + (d * (h / catsumm.length - 20)) + ")"; })
					.attr("d", area(d.values))
					.style("fill", function(d, i) { return color2(i); })
					.style("fill-opacity", 1e-6);

			y.domain([0, d.maxValue / 3]);

			d3.select(this).selectAll(".line").transition()
					.duration(duration)
					.attr("d", line(d.values))
					.style("stroke-opacity", 1e-6);

			d3.select(this).selectAll(".area").transition()
					.duration(duration)
					.style("fill-opacity", 1)
					.attr("d", area(d.values))
					.each("end", function() { d3.select(this).style("fill-opacity", null); });
		});

		if (that.whichSlide == "2") {
			that.showFlag = false;
		};
		if (!that.showFlag) {
			duration = 0;
			delay = 0;
		};
		
	//  setTimeout(areas, duration + delay);
		setTimeout(callback, duration + delay);
	//	callback();

	}

	function areas(callback) {
		
		var g = svg.selectAll(".symbol");

		axis
				.y(h / catsumm.length - 11);

		g.select(".line")
				.attr("d", function(d) { return axis(d.values); });

		g.each(function(d) {
			y.domain([0, d.maxValue]);

			d3.select(this).select(".line").transition()
					.duration(duration)
					.style("stroke-opacity", 1)
					.each("end", function() { d3.select(this).style("stroke-opacity", null); });

			d3.select(this).selectAll(".area")
					.filter(function(d, i) { return i; })
				.transition()
					.duration(duration)
					.style("fill-opacity", 1e-6)
					.attr("d", area(d.values))
					.remove();

			d3.select(this).selectAll(".area")
					.filter(function(d, i) { return !i; })
				.transition()
					.duration(duration)
					.style("fill", color(d.key))
					.attr("d", area(d.values));
		});

		svg.select("defs").transition()
				.duration(duration)
				.remove();

		g.transition()
				.duration(duration)
				.each("end", function() { d3.select(this).attr("clip-path", null); });

		if (that.whichSlide == "3") {
			that.showFlag = false;
		};
		if (!that.showFlag) {
			duration = 0;
			delay = 0;
		};
		
	//  setTimeout(stackedArea, duration + delay);
		setTimeout(callback, duration + delay);

	}

	function stackedArea(callback) {
		
		var stack = d3.layout.stack()
				.values(function(d) { return d.values; })
				.x(function(d) { return d.date; })
				.y(function(d) { return d.value; })
				.out(function(d, y0, y) { d.value0 = y0; })
				.order("reverse");

		stack(catsumm);

		y
				.domain([0, d3.max(catsumm[0].values.map(function(d) { return d.value + d.value0; }))])
				.range([h, 0]);

		line
				.y(function(d) { return y(d.value0); });

		area
				.y0(function(d) { return y(d.value0); })
				.y1(function(d) { return y(d.value0 + d.value); });

		var t = svg.selectAll(".symbol").transition()
				.duration(duration)
				.attr("transform", "translate(0,0)")
				.attr("clip-path", null)
				.each("end", function() { d3.select(this).attr("transform", null); });

		t.select("path.area")
				.style("fill", function(d) { return color(d.key) } )
				.attr("d", function(d) { return area(d.values); });

		t.select("path.line")
				.style("stroke-opacity", function(d, i) { return i < 3 ? 1e-6 : 1; })
				.attr("d", function(d) { return line(d.values); });

		t.select("text")
				.attr("transform", function(d) { d = d.values[d.values.length - 1]; return "translate(" + (w - txtm) + "," + y(d.value / 2 + d.value0) + ")"; });

		if (that.whichSlide == "4") {
			that.showFlag = false;
		};	
		if (!that.showFlag) {
			duration = 0;
			delay = 0;
		};
		
	//  setTimeout(streamgraph, duration + delay);
		setTimeout(callback, duration + delay);

	}

	function streamgraph(callback) {
		var stack = d3.layout.stack()
				.values(function(d) { return d.values; })
				.x(function(d) { return d.date; })
				.y(function(d) { return d.value; })
				.out(function(d, y0, y) { d.value0 = y0; })
				.order("reverse")
				.offset("wiggle");

		stack(catsumm);

		line
				.y(function(d) { return y(d.value0); });

		var t = svg.selectAll(".symbol").transition()
				.duration(duration)
				.attr("clip-path", null)
				.attr("transform", "translate(0,0)");

		t.select("path.area")
				.style("fill", function(d) { return color(d.key) } )
				.attr("d", function(d) { return area(d.values); });

		t.select("path.line")
				.style("stroke-opacity", 1e-6)
				.attr("d", function(d) { return line(d.values); });

		t.select("text")
				.attr("transform", function(d) { d = d.values[d.values.length - 1]; return "translate(" + (w - txtm) + "," + y(d.value / 2 + d.value0) + ")"; });

		if (that.whichSlide == "5") {
			that.showFlag = false;
		};	
		if (!that.showFlag) {
			duration = 0;
			delay = 0;
		};
			
	//  setTimeout(overlappingArea, duration + delay);
		setTimeout(callback, duration + delay);

	}

	function overlappingArea(callback) {
		var g = svg.selectAll(".symbol");

		line
				.y(function(d) { return y(d.value0 + d.value); });

		g.select(".line")
				.attr("d", function(d) { return line(d.values); });

		y
				.domain([0, d3.max(catsumm.map(function(d) { return d.maxValue; }))])
				.range([h, 0]);

		area
				.y0(h)
				.y1(function(d) { return y(d.value); });

		line
				.y(function(d) { return y(d.value); });

		var t = g.transition()
				.attr("clip-path", null)
				.attr("transform", "translate(0,0)")
				.duration(duration);

		t.select(".line")
				.style("stroke-opacity", 1)
				.attr("d", function(d) { return line(d.values); });

		t.select(".area")
				.style("fill", function(d) { return color(d.key) } )
				.style("fill-opacity", .5)
				.attr("d", function(d) { return area(d.values); });

		t.select("text")
				.attr("dy", ".31em")
				.attr("transform", function(d) { d = d.values[d.values.length - 1]; return "translate(" + (w - txtm) + "," + y(d.value) + ")"; });

		svg.append("line")
				.attr("class", "line")
				.attr("x1", 0)
				.attr("x2", w - txtm)
				.attr("y1", h)
				.attr("y2", h)
				.style("stroke-opacity", 1e-6)
			.transition()
				.duration(duration)
				.style("stroke-opacity", 1);

		if (that.whichSlide == "6") {
			that.showFlag = false;
		};	
		if (!that.showFlag) {
			duration = 0;
			delay = 0;
		};
			
	//  setTimeout(groupedBar, duration + delay);
		setTimeout(callback, duration + delay);

	}

	function groupedBar(callback) {
		x = d3.scale.ordinal()
				.domain(catsumm[0].values.map(function(d) { return d.date; }))
				.rangeBands([0, w - txtm], .1);

		var x1 = d3.scale.ordinal()
				.domain(catsumm.map(function(d) { return d.key; }))
				.rangeBands([0, x.rangeBand()]);

		var g = svg.selectAll(".symbol");

		var t = g.transition()
				.attr("clip-path", null)
				.attr("transform", "translate(0,0)")
				.duration(duration);

		t.select(".line")
				.style("stroke-opacity", 1e-6)
				.remove();

		t.select(".area")
				.style("fill", function(d) { return color(d.key) } )
				.style("fill-opacity", 1e-6)
				.remove();

		g.each(function(p, j) {
			d3.select(this).selectAll("rect")
					.data(function(d) { return d.values; })
				.enter().append("rect")
					.attr("x", function(d) { return x(d.date) + x1(p.key); })
					.attr("y", function(d) { return y(d.value); })
					.attr("width", x1.rangeBand())
					.attr("height", function(d) { return h - y(d.value); })
					.style("fill", color(p.key))
					.style("fill-opacity", 1e-6)
				.transition()
					.duration(duration)
					.style("fill-opacity", 1);
		});

		if (that.whichSlide == "7") {
			that.showFlag = false;
		};	
		if (!that.showFlag) {
			duration = 0;
			delay = 0;
		};
		
	//  setTimeout(stackedBar, duration + delay);
		setTimeout(callback, duration + delay);

	}

	function stackedBar(callback) {
		x.rangeRoundBands([0, w - txtm], .1);

		var stack = d3.layout.stack()
				.values(function(d) { return d.values; })
				.x(function(d) { return d.date; })
				.y(function(d) { return d.value; })
				.out(function(d, y0, y) { d.value0 = y0; })
				.order("reverse");

		var g = svg.selectAll(".symbol")
						.attr("clip-path", null)
						.attr("transform", "translate(0,0)");

		stack(catsumm);

		y
				.domain([0, d3.max(catsumm[0].values.map(function(d) { return d.value + d.value0; }))])
				.range([h, 0]);

		var t = g.transition()
				.duration(duration / 2);

		t.select("text")
				.delay(catsumm[0].values.length * 10)
				.attr("transform", function(d) { d = d.values[d.values.length - 1]; return "translate(" + (w - txtm) + "," + y(d.value / 2 + d.value0) + ")"; });

		t.selectAll("rect")
				.delay(function(d, i) { return i * 10; })
				.attr("y", function(d) { return y(d.value0 + d.value); })
				.attr("height", function(d) { return h - y(d.value); })
				.each("end", function() {
					d3.select(this)
							.style("stroke", "#fff")
							.style("stroke-opacity", 1e-6)
						.transition()
							.duration(duration / 2)
							.attr("x", function(d) { return x(d.date); })
							.attr("width", x.rangeBand())
							.style("stroke-opacity", 1);
				});

	/*
		 setTimeout(function() {
			svg.selectAll("*").remove();
			svg.selectAll("g").data(catsumm).enter().append("g").attr("class", "symbol");
			lines();
		}, duration + catsumm[0].values.length * 10 + delay);
	*/
		if (that.whichSlide == "8") {
			that.showFlag = false;
		};
		if (!that.showFlag) {
			duration = 0;
			delay = 0;
		};
			
		setTimeout(callback, duration + catsumm[0].values.length * 10 + delay);

	}
}