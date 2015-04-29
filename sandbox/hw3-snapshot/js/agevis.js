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
 * AgeVis object for HW3 of CS171
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
AgeVis = function(_parentElement, _data, _metaData){
    this.parentElement = _parentElement;
    this.data = _data;
    this.metaData = _metaData;
    this.displayData = [];
    adate1 = dateFormatter(loDate);
    adate2 = dateFormatter(hiDate);
		anapFlag = false;
		saveAges = [];
		saveAmax = 0;


    // TODO: define all constants here


    this.initVis();

}


/**
 * Method that sets up the SVG and the variables
 */
AgeVis.prototype.initVis = function(){

    var that = this; // read about the this
		amargin = {top: 10, bottom: 30, left:30, right: 10};
		awidth = 230;
		aheight = 330;
		awidthp = awidth - amargin.left - amargin.right;
		aheightp = aheight - amargin.top - amargin.bottom;
		barWidth = aheightp / 100;

    //TODO: construct or select SVG
    //TODO: create axis and scales

		this.svg = this.parentElement.append("svg")
								.attr("class", "avsvg")
								.attr("width", awidth)
								.attr("height", aheight);

		// Axis
		//
		ayScale = d3.scale.linear()
									.domain([100, 0])
									.range([aheightp, 0]);
		
		var aaxg = this.svg.append("g")
								.attr('class', 'agrpa')
								.attr("transform", "translate("+amargin.left+","+amargin.top+")");

		var ayAxis = d3.svg.axis()
									.scale(ayScale)
									.orient('left')
									.ticks(10)
									.tickSize(5)
									.tickPadding(8);

		aaxg.append('g')
				.attr('class', 'ayaxis')
				.call(ayAxis);
				
		
    // filter, aggregate, modify data
    this.wrangleData(null);

    // call the update method
    this.updateVis();
}


/**
 * Method to wrangle the data. In this case it takes an options object
 * @param _filterFunction - a function that filters data or "null" if none
 */
AgeVis.prototype.wrangleData= function(_filterFunction){

    // displayData should hold the data which is visualized
    this.displayData = this.filterAndAggregate(_filterFunction);

    //// you might be able to pass some options,
    //// if you don't pass options -- set the default options
    //// the default is: var options = {filter: function(){return true;} }
    //var options = _options || {filter: function(){return true;}};





}



/**
 * the drawing function - should use the D3 selection, enter, exit
 */
AgeVis.prototype.updateVis = function(){

    // Dear JS hipster,
    // you might be able to pass some options as parameter _option
    // But it's not needed to solve the task.
    //var options = _options || {};


    // TODO: implement...
    // TODO: ...update scales
    // TODO: ...update graphs

		var that = this;

    ages = d3.range(0,100). map(function(){return 0;});
		amaxCount = 0;

			this.data.forEach( function (d) {
				if (dateFormatter(d.time) >= adate1 && dateFormatter(d.time) <= adate2) {
					for (var i = 0; i < 100; i++) {
						ages[i] += d.ages[i];
						amaxCount = ages[i] > amaxCount ? ages[i] : amaxCount;
					};
				};
			});
			
			axScale = d3.scale.linear()
									.domain([0, amaxCount])
									.range([0, awidthp]);
									
				d3.selectAll('.agrpb').remove();
				
        var ag = this.svg.append("g")
										.attr('class', 'agrpb')
                    .attr("transform", "translate("+amargin.left+","+amargin.top+")");
				
				
				// SVG Area
				// ========
				var aarea = d3.svg.area()
										.y(function(d, i) { return ayScale(i); })
										.x0(0)
										.x1(function(d) { return axScale(d); });
				
				ag.append("path")
										.datum(ages)
										.attr("class", "aarea")
										.attr("d", aarea);

				// Snapshot
				d3.selectAll('.agrpbs').remove();

				axScales = d3.scale.linear()
										.domain([0, saveAmax])
										.range([0, awidthp]);
									
        var ags = this.svg.append("g")
										.attr('class', 'agrpbs')
                    .attr("transform", "translate("+amargin.left+","+amargin.top+")");

				var aareas = d3.svg.area()
										.y(function(d, i) { return ayScale(i); })
										.x0(0)
										.x1(function(d) { return axScales(d); });
				
				ags.append("path")
										.datum(saveAges)
										.attr("class", "aareas")
										.attr("d", aareas);
										
}


/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
AgeVis.prototype.onSelectionChange= function (selectionStart, selectionEnd){
    adate1 = selectionStart;
    adate2 = selectionEnd;
    // TODO: call wrangle function
    this.updateVis();


}


/*
*
* ==================================
* From here on only HELPER functions
* ==================================
*
* */
		// Snapshot Button
		//
AgeVis.prototype.clickSnapshot = function() {

			anapFlag = anapFlag ? false : true;
			
			if (anapFlag) {
				saveAges = copy(ages);
				saveAmax = amaxCount;
			} else {
				saveAges = [];
			}

			this.updateVis();

};


/**
 * The aggregate function that creates the counts for each age for a given filter.
 * @param _filter - A filter can be, e.g.,  a function that is only true for data of a given time range
 * @returns {Array|*}
 */
AgeVis.prototype.filterAndAggregate = function(_filter){


    // Set filter to a function that accepts all items
    // ONLY if the parameter _filter is NOT null use this parameter
    var filter = function(){return true;}
    if (_filter != null){
        filter = _filter;
    }
    //Dear JS hipster, a more hip variant of this construct would be:
    // var filter = _filter || function(){return true;}

    var that = this;

    // create an array of values for age 0-100
    var res = d3.range(100).map(function () {
        return 0;
    });


    // accumulate all values that fulfill the filter criterion

    // TODO: implement the function that filters the data and sums the values



    return res;

}

	// Deep-copy any array-type (without 3rd party library):
	// 	 from: http://stackoverflow.com/questions/7486085/copying-array-by-value-in-javascript
	function copy(o) {
		 var out, v, key;
		 out = Array.isArray(o) ? [] : {};
		 for (key in o) {
				 v = o[key];
				 out[key] = (typeof v === "object") ? copy(v) : v;
		 };
		 return out;
	};




