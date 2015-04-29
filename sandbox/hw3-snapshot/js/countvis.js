/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 1/28/15.
 */


/*
 *
 * ======================================================
 * We follow the vis template of init - wrangle - update
 * ======================================================
 *
 * */

/**
 * CountVis object for HW3 of CS171
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @param _eventHandler -- the Eventhandling Object to emit data to (see Task 4)
 * @constructor
 */
CountVis = function(_parentElement, _data, _metaData, _eventHandler){
    this.parentElement = _parentElement;
    this.data = _data;
    this.metaData = _metaData;
    this.eventHandler = _eventHandler;
    this.displayData = [];


    // TODO: define all "constants" here


    this.initVis();
}


/**
 * Method that sets up the SVG and the variables
 */
CountVis.prototype.initVis = function(){

    var that = this; // read about the this
		myAlwaysTHIS = this;
		cmargin = {top: 10, bottom: 60, left:80, right: 10};
		cwidth = 650;
		cheight = 330;
		sliderValue = 200;
		cwidthp = cwidth - cmargin.left - cmargin.right;
		cheightp = cheight - cmargin.top - cmargin.bottom;
    dateFormatter = d3.time.format("%Y-%m-%d");
		loDate = new Date('2012-11-29');
		hiDate = new Date('2013-12-31');
		cdate1 = loDate;
		cdate2 = hiDate;
		begDatex = new Date();
		endDatex = new Date();

    //TODO: implement here all things that don't change
    //TODO: implement here all things that need an initial status
    // Examples are:
    // - construct SVG layout
    // - create axis
    // -  implement brushing !!
    // --- ONLY FOR BONUS ---  implement zooming

    // TODO: modify this to append an svg element, not modify the current placeholder SVG element
    this.svg = this.parentElement
											.append("svg")
											.attr("class", "cvsvg")
											.attr("width", cwidth)
											.attr("height", cheight);
		
		// Axes
		//
		cxScale = d3.time.scale()
									.domain([loDate, hiDate])
									.range([0, cwidthp]);
		svScale = cxScale;
		cyScale = d3.scale.pow()
									.exponent(1)
									.domain([0, d3.max(this.data, function (d) { return d.count })])
									.range([cheightp, 0]);

				
		var caxg = this.svg.append("g")
								.attr('class', 'cgrpa')
								.attr("transform", "translate("+cmargin.left+","+cmargin.top+")");

		var cxAxis = d3.svg.axis()
									.scale(cxScale)
									.orient('bottom')
									.ticks(d3.time.months)
									.tickFormat(d3.time.format('%B'))
									.tickSize(5)
									.tickPadding(8);

		caxg.append('g')
				.attr('class', 'cxaxis')
				.attr('transform', 'translate(0, ' + (cheightp) + ')')
				.call(cxAxis);
		
		var cyAxis = d3.svg.axis()
									.scale(cyScale)
									.orient('left')
									.ticks(15)
									.tickSize(5)
									.tickPadding(8);

		caxg.append('g')
				.attr('class', 'cyaxis')
				.call(cyAxis);

		// Zooming
		//
		myZoom = d3.behavior.zoom()
								.scaleExtent([1,12])
								.x(cxScale);

		// To disable panning events while zooming, found the trick here:
		//			http://stackoverflow.com/questions/13713528/how-to-disable-pan-for-d3-behavior-zoom
		this.svg.call(myZoom.on("zoom", this.zoom))
												.on("mousedown.zoom", null)
												.on("touchstart.zoom", null)
												.on("touchmove.zoom", null)
												.on("touchend.zoom", null);

		// Reset Button
		//
		d3.selectAll('#fitInBtn').on('click', function () {
			d3.select(".cvsvg").remove();

			begDate = dateFormatter(loDate);
			endDate = dateFormatter(hiDate);
			begDatex = new Date();
			endDatex = new Date();

			d3.select("#brushInfo").text("");
			$(document).trigger("brushChange", [begDate,endDate]);			
			
			that.initVis();
    });

		// Brushing
		//
		var visScale = d3.time.scale()
													.domain([loDate, hiDate])
													.range([0, cwidthp]);

		brush = d3.svg.brush().x(visScale).on("brush", brushed);

		this.svg.append("g")
		            .attr("transform", "translate("+cmargin.left+","+cmargin.top+")")
								.attr("class", "brush").call(brush)
								.selectAll("rect")
								.attr("height", cheightp);

		function brushed () {
			var extent = brush.extent();
			var begDate = dateFormatter(extent[0]);
			begDatex = extent[0];
			var endDate = dateFormatter(extent[1]);
			endDatex = extent[1];
			d3.select("#brushInfo").text(begDate + " --> " + endDate);
			$(document).trigger("brushChange", [begDate,endDate]);
		};


    //TODO: implement the slider -- see example at http://bl.ocks.org/mbostock/6452972
    this.addSlider(this.svg);

    // filter, aggregate, modify data
    this.wrangleData();

    // call the update method
    this.updateVis(sliderValue, 1);
		
}



/**
 * Method to wrangle the data. In this case it takes an options object
  */
CountVis.prototype.wrangleData= function(){

    // displayData should hold the data which is visualized
    // pretty simple in this case -- no modifications needed
    this.displayData = this.data;

}



/**
 * the drawing function - should use the D3 selection, enter, exit
 * @param _options -- only needed if different kinds of updates are needed
 */
CountVis.prototype.updateVis = function(pow, zoomScale){

    // TODO: implement update graphs (D3: update, enter, exit)
				var that = this;
				
				pow = pow<1 ? 1 : pow;
				pow = pow>200 ? 200 : pow;
        
											
        cyScale = d3.scale.pow()
											.exponent(pow/200)
											.domain([0, d3.max(this.displayData, function (d) { return d.count })])
											.range([cheightp, 0]);
				
				d3.selectAll('.cgrpb').remove();
				
        var cg = this.svg.append("g")
										.attr('class', 'cgrpb')
                    .attr("transform", "translate("+cmargin.left+","+cmargin.top+")");
										
				// SVG Area
				// ========
				var carea = d3.svg.area()
										.x(function(d) { 
														if (dateFormatter(d.time) < cdate1) { return 0 };
														if (dateFormatter(d.time) > cdate2) { return 560 };
														return cxScale(d.time); })
										.y0(cheightp)
										.y1(function(d) { return cyScale(d.count); });
				
				cg.append("path")
										.datum(this.displayData)
										.attr("class", "carea")
										.attr("clip-path", "url(#clip)")
										.attr("d", carea);
										
				// Update axes
				useFormat = zoomScale < 2.6 ? d3.time.format('%B') : d3.time.format('%b %e');

				var cxAxis = d3.svg.axis()
											.scale(cxScale)
											.orient('bottom')
											.ticks(10)
											.tickFormat(useFormat)
											.tickSize(5)
											.tickPadding(8);

				d3.selectAll(".cxaxis").call(cxAxis);
				
				var cyAxis = d3.svg.axis()
									.scale(cyScale)
									.orient('left')
									.ticks(15)
									.tickSize(5)
									.tickPadding(8);
									
				d3.selectAll(".cyaxis").call(cyAxis);

				// Bring brush to front
				d3.selectAll(".brush")
				      .each(function() { this.parentNode.appendChild(this); });
				
					
}

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
CountVis.prototype.onSelectionChange= function (selectionStart, selectionEnd){

    // TODO: call wrangle function

    // do nothing -- no update when brushing

}


/*
 *
 * ==================================
 * From here on only HELPER functions
 * ==================================
 *
 * */
CountVis.prototype.zoom = function() {

  var that = myAlwaysTHIS;   // stupid variable scoping will be the end of me!
	var zoomS = d3.event.scale;
	var zoomX = d3.event.sourceEvent.layerX - 95;
	var zoomY = d3.event.sourceEvent.layerY - 10;
	
	if (zoomX >= 0 && zoomX <= 560 && zoomY >= 0 && zoomY <= 260) {
		
		cdate1 = cxScale.invert(0) < loDate ? dateFormatter(loDate) : dateFormatter(cxScale.invert(0));
		cdate2 = cxScale.invert(560) > hiDate ? dateFormatter(hiDate) : dateFormatter(cxScale.invert(560));
		
		// Brushing
		//
		begDatex = begDatex < cxScale.invert(3) ? cxScale.invert(3) : begDatex;
		endDatex = endDatex > cxScale.invert(560) ? cxScale.invert(560) : endDatex;
		
		brush.x(cxScale);

		if (dateFormatter(endDatex) <= cdate1 || dateFormatter(begDatex) >= cdate2) {
			d3.selectAll(".brush").call(brush.clear());
			begDate = dateFormatter(loDate);
			endDate = dateFormatter(hiDate);
			begDatex = new Date();
			endDatex = new Date();
		} else {
			brush.extent([begDatex, endDatex]);
			begDate = dateFormatter(begDatex);
			endDate = dateFormatter(endDatex);
		};

		d3.selectAll(".brush").call(brush);

		d3.select("#brushInfo").text(begDate + " --> " + endDate);
		$(document).trigger("brushChange", [begDate,endDate]);
			
		that.updateVis(sliderValue, zoomS);
		
	};

};




/**
 * creates the y axis slider
 * @param svg -- the svg element
 */
CountVis.prototype.addSlider = function(svg){
    var that = this;

    // TODO: Think of what is domain and what is range for the y axis slider !!
    var sliderScale = d3.scale.linear().domain([0,200]).range([0,200])

    var sliderDragged = function(){
        var value = Math.max(0, Math.min(200,d3.event.y));

        sliderValue = sliderScale.invert(value);

        // TODO: do something here to deform the y scale
        //console.log("Y Axis Slider value: ", sliderValue);


        d3.select(this)
            .attr("y", function () {
                return sliderScale(sliderValue);
            })

        that.updateVis(sliderValue, 1);
    }
    var sliderDragBehaviour = d3.behavior.drag()
        .on("drag", sliderDragged)

    var sliderGroup = svg.append("g").attr({
        class:"sliderGroup",
        "transform":"translate("+0+","+30+")"
    })

    sliderGroup.append("rect").attr({
        class:"sliderBg",
        x:5,
        width:10,
        height:200
    }).style({
        fill:"lightgray"
    })

    sliderGroup.append("rect").attr({
        "class":"sliderHandle",
        y:200,
        width:20,
        height:10,
        rx:2,
        ry:2
    }).style({
        fill:"#333333"
    }).call(sliderDragBehaviour)


}
