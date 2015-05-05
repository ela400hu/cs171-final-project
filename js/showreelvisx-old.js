/**
 * Created by Stephens, Darlington, Arnold
 */

/**
 * ShowreelVis object for Final Project of CS171
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _file -- the csv file to use
 * @param _growthFlag -- whether to show data or growth of data
 * @param _whichSlide -- which slide to show
 * @param _eventHandler -- the Eventhandling Object to emit data to 
 * @constructor
 */
ShowreelVis = function(_parentElement, _whichFile, _growthFlag, _whichSlide, _eventHandler){
    this.parentElement = _parentElement;
    this.whichFile = _whichFile;
    this.growthFlag = _growthFlag;
    this.whichSlide = _whichSlide;
    this.eventHandler = _eventHandler;

		this.showFlag = true;
		
		numViz = 9;
		if (this.whichFile == "0") { this.file = "sr_wl_fd.csv" };
		if (this.whichFile == "1") { this.file = "sr_ag_pop.csv" };
		if (this.whichFile == "2") { this.file = "sr_wl_fil.csv" };
		if (this.whichFile == "3") { this.file = "sr_wl_dis.csv" };
		if (this.whichFile == "4") { this.file = "sr_fl_bud.csv" };
		if (this.whichFile == "5") { this.file = "sr_ju_bud.csv" };
		if (this.whichFile == "6") { this.file = "sr_ag_pop2.csv" };
		if (this.whichFile == "7") { this.file = "sr_co_dtc.csv" };
		if (this.whichFile == "8") { this.file = "sr_co_c1y.csv" };
		
    this.srVis();
}

	/**
	 * Gets called by event handler
	 */
ShowreelVis.prototype.onSelectionChange= function (selectionStart, selectionEnd){
		this.showFlag = false;
		for (i = 0; i < numViz; i++) {
			d3.select(".srsvg"+i).attr("visibility", "hidden");
		};
}

ShowreelVis.prototype.srVis = function () {
	
	var that = this;
	var whichSlide = this.whichSlide;
	var whichFile = this.whichFile;
	var growthFlag = this.growthFlag;

	var m = [20, 20, 30, 20];
	var txtm = 240;
	var menm = 170;
	var w = window.innerWidth - m[1] - m[3];
	var h = window.innerHeight - m[0] - m[2] - menm;

	var x = 0;
	var y = 0;
	var duration = 1500;
	var delay = 500;
			
	// var color = d3.scale.category10();
	var color = d3.scale.ordinal() //CHANGE
		.range(["#D31D8C", "#EE88CD", "#4DC5D6", "#A5F2F3", "#BCDD11", "#007034", "#F1FAC0", "#a79e65", "#982395", "#3f0082", "#f76835", "#FFA200"]); 

	
	for (i = 0; i < numViz; i++) {
		d3.select(".srsvg"+i).attr("visibility", "hidden");
	};
		
	for (i = 0; i < numViz; i++) {
		d3.select(".srsvg"+i).remove();
	};

	var svg = d3.select("#showreelVis").append("svg")
			.attr("class", "srsvg"+whichFile)
			.attr("visibility", "visible")
			.attr("width", w + m[1] + m[3])
			.attr("height", h + m[0] + m[2])
		.append("g")
			.attr("transform", "translate(" + m[3] + "," + m[0] + ")");

	var stocks="";
	var symbols="";

	// A line generator, for the dark stroke.
	var line = d3.svg.line()
			.interpolate("basis")
			.x(function(d) { return x(d.date); })
			.y(function(d) { return y(d.price); });

	// A line generator, for the dark stroke.
	var axis = d3.svg.line()
			.interpolate("basis")
			.x(function(d) { return x(d.date); })
			.y(h);

	// A area generator, for the dark stroke.
	var area = d3.svg.area()
			.interpolate("basis")
			.x(function(d) { return x(d.date); })
			.y1(function(d) { return y(d.price); });
			
	d3.csv("data/"+that.file, function(data) {
		var parse = d3.time.format("%Y").parse;

		// Nest stock values by symbol.
		symbols = d3.nest()
				.key(function(d) { return d.symbol; })
				.entries(stocks = data);

		// Parse dates and numbers. We assume values are sorted by date.
		// Also compute the maximum price per symbol, needed for the y-domain.
		symbols.forEach(function(s) {
			var prevPrice = 0;
			s.values.forEach(function(d) { 
							d.date = parse(d.date);
							if (growthFlag) {
								if (prevPrice == 0) {
									prevPrice = d.price;
									d.price = 0;
								} else {
									d.price = (prevPrice - d.price) / prevPrice;
								}
							} else {
								d.price = +d.price;
							}
						});
			s.maxPrice = d3.max(s.values, function(d) { return d.price; });
			s.minPrice = d3.min(s.values, function(d) { return d.price; });
			s.sumPrice = d3.sum(s.values, function(d) { return d.price; });
		});

		// Sort by maximum price, descending.
		symbols.sort(function(a, b) { return b.maxPrice - a.maxPrice; });

		var g = svg.selectAll("g")
				.data(symbols)
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
											svg.selectAll("g").data(symbols).enter().append("g").attr("class", "symbol");
											if (that.showFlag) {
												if (firstTime) {
													mydef1.resolve();
												} else {
													showreel();
												};
											};
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
		y = d3.scale.linear().range([h / symbols.length - 20, 0]);

		// Compute the minimum and maximum date across symbols.
		x.domain([
			d3.min(symbols, function(d) { return d.values[0].date; }),
			d3.max(symbols, function(d) { return d.values[d.values.length - 1].date; })
		]);

		var g = svg.selectAll(".symbol")
				.attr("transform", function(d, i) { return "translate(0," + (i * h / symbols.length + 10) + ")"; });

		g.each(function(d) {
			var e = d3.select(this);

			e.append("path")
					.attr("class", "line");

			e.append("circle")
					.attr("r", 5)
					.style("fill", function(d) { return color(d.key); })
					.style("stroke", "#000b95")
					.style("opacity", ".7")
					.style("stroke-width", "2px");

			e.append("text")
					.attr("x", 12)
					.attr("dy", ".31em")
					.text(d.key);
		});

		function draw(k) {
			g.each(function(d) {
				var e = d3.select(this);
				y.domain([0, d.maxPrice]);

				e.select("path")
						.attr("d", function(d) { return line(d.values.slice(0, k + 1)); });

				e.selectAll("circle, text")
						.data(function(d) { return [d.values[k], d.values[k]]; })
						.attr("transform", function(d) { return "translate(" + x(d.date) + "," + y(d.price) + ")"; });
			});
		}

		if (that.whichSlide == "1") {
			that.showFlag = false;
		};
		if (!that.showFlag) {
			duration = 0;
			delay = 0;
		};
		
		var k = 1, n = symbols[0].values.length;
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
				.attr("height", h / symbols.length - 10);

		var color2 = d3.scale.ordinal() //CHANGE
			.range(["#51a6da", "#005595", "#00355f"]); //fathom blues

		var g = svg.selectAll(".symbol")
				.attr("clip-path", "url(#clip)");

		area
				.y0(h / symbols.length - 10);

		g.select("circle").transition()
				.duration(duration)
				.attr("transform", function(d) { return "translate(" + (w - txtm) + "," + (-h / symbols.length) + ")"; })
				.remove();

		g.select("text").transition()
				.duration(duration)
				.attr("transform", function(d) { return "translate(" + (w - txtm) + "," + (h / symbols.length - 25) + ")"; })
				.attr("dy", "0em");

		g.each(function(d) {
			y.domain([0, d.maxPrice]);

			d3.select(this).selectAll(".area")
					.data(d3.range(3))
				.enter().insert("path", ".line")
					.attr("class", "area")
					.attr("transform", function(d) { return "translate(0," + (d * (h / symbols.length - 20)) + ")"; })
					.attr("d", area(d.values))
					.style("fill", function(d, i) { return color2(i); })
					.style("fill-opacity", 1e-6);

			y.domain([0, d.maxPrice / 3]);

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
				.y(h / symbols.length - 11);

		g.select(".line")
				.attr("d", function(d) { return axis(d.values); });

		g.each(function(d) {
			y.domain([0, d.maxPrice]);

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
				.y(function(d) { return d.price; })
				.out(function(d, y0, y) { d.price0 = y0; })
				.order("reverse");

		stack(symbols);

		y
				.domain([0, d3.max(symbols[0].values.map(function(d) { return d.price + d.price0; }))])
				.range([h, 0]);

		line
				.y(function(d) { return y(d.price0); });

		area
				.y0(function(d) { return y(d.price0); })
				.y1(function(d) { return y(d.price0 + d.price); });

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
				.attr("transform", function(d) { d = d.values[d.values.length - 1]; return "translate(" + (w - txtm) + "," + y(d.price / 2 + d.price0) + ")"; });

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
				.y(function(d) { return d.price; })
				.out(function(d, y0, y) { d.price0 = y0; })
				.order("reverse")
				.offset("wiggle");

		stack(symbols);

		line
				.y(function(d) { return y(d.price0); });

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
				.attr("transform", function(d) { d = d.values[d.values.length - 1]; return "translate(" + (w - txtm) + "," + y(d.price / 2 + d.price0) + ")"; });

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
				.y(function(d) { return y(d.price0 + d.price); });

		g.select(".line")
				.attr("d", function(d) { return line(d.values); });

		y
				.domain([0, d3.max(symbols.map(function(d) { return d.maxPrice; }))])
				.range([h, 0]);

		area
				.y0(h)
				.y1(function(d) { return y(d.price); });

		line
				.y(function(d) { return y(d.price); });

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
				.attr("transform", function(d) { d = d.values[d.values.length - 1]; return "translate(" + (w - txtm) + "," + y(d.price) + ")"; });

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
				.domain(symbols[0].values.map(function(d) { return d.date; }))
				.rangeBands([0, w - txtm], .1);

		var x1 = d3.scale.ordinal()
				.domain(symbols.map(function(d) { return d.key; }))
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
					.attr("y", function(d) { return y(d.price); })
					.attr("width", x1.rangeBand())
					.attr("height", function(d) { return h - y(d.price); })
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
				.y(function(d) { return d.price; })
				.out(function(d, y0, y) { d.price0 = y0; })
				.order("reverse");

		var g = svg.selectAll(".symbol")
						.attr("clip-path", null)
						.attr("transform", "translate(0,0)");

		stack(symbols);

		y
				.domain([0, d3.max(symbols[0].values.map(function(d) { return d.price + d.price0; }))])
				.range([h, 0]);

		var t = g.transition()
				.duration(duration / 2);

		t.select("text")
				.delay(symbols[0].values.length * 10)
				.attr("transform", function(d) { d = d.values[d.values.length - 1]; return "translate(" + (w - txtm) + "," + y(d.price / 2 + d.price0) + ")"; });

		t.selectAll("rect")
				.delay(function(d, i) { return i * 10; })
				.attr("y", function(d) { return y(d.price0 + d.price); })
				.attr("height", function(d) { return h - y(d.price); })
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
			svg.selectAll("g").data(symbols).enter().append("g").attr("class", "symbol");
			lines();
		}, duration + symbols[0].values.length * 10 + delay);
	*/
		if (that.whichSlide == "8") {
			that.showFlag = false;
		};
		if (!that.showFlag) {
			duration = 0;
			delay = 0;
		};
			
		setTimeout(callback, duration + symbols[0].values.length * 10 + delay);

	}
}