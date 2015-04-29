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
 * PrioVis object for HW3 of CS171
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
PrioVis = function(_parentElement, _data, _metaData){
    this.parentElement = _parentElement;
    this.data = _data;
    this.metaData = _metaData;
    this.displayData = [];
    pdate1 = dateFormatter(loDate);
    pdate2 = dateFormatter(hiDate);



    // TODO: define all constants here


    this.initVis();

}


/**
 * Method that sets up the SVG and the variables
 */
PrioVis.prototype.initVis = function(){

    var that = this; // read about the this
        pmargin = {top: 10, bottom: 200, left:80, right: 50};
        pwidthTot = 970;
        pwidth = 660;
        pheight = 440;
        pwidthp = pwidth - pmargin.left - pmargin.right;
        pheightp = pheight - pmargin.top - pmargin.bottom;
        barWidth = pwidthp / 16;
        prioDesc = [];
        prioColor = [];
        prioTitle = [];
        snapFlag = false;
        savePrios = [];
        savePmax = 0;
        savePtot = 0;
        d3.select("#snapInfo").text("take snapshot");

        for (var i = 0; i < 16; i++) {
            prioDesc[i] = this.metaData.priorities[i]['item-title'];
            prioColor[i] = this.metaData.priorities[i]['item-color'];
            prioTitle[i] = this.metaData.priorities[i]['item-content'];
        };

        
    //TODO: construct or select SVG
    //TODO: create axis and scales

        this.svg = this.parentElement.append("svg")
                                .attr("class", "pvsvg")
                                .attr("width", pwidthTot)
                                .attr("height", pheight);

        // Axes
        //
        pxScale = d3.scale.linear()
                                    .domain([0, 16])
                                    .range([0, pwidthp]);

        pyScale = d3.scale.linear()
                        .domain([0, d3.max(this.data, function (d) { 
                                  return d3.max(d.prios)})])
                        .range([pheightp, 0]);

                
        var paxg = this.svg.append('g')
                        .attr('class', 'pgrpa')
                        .attr("transform", "translate("+pmargin.left+","+pmargin.top+")");
                                        
        var pxAxis = d3.svg.axis()
                            .scale(pxScale)
                            .orient('bottom')
                            .ticks(16)
                            .tickSize(0)
                            .tickPadding(12)
                            .tickFormat(function (d) { return prioDesc[d] });

        paxg.append('g')
                .attr('class', 'pxaxis')
                .attr('transform', 'translate(0, ' + (pheightp) + ')')
                .call(pxAxis)
                .selectAll('text')  
                .style('text-anchor', 'end')
                .attr('dx', '5px')
                .attr('transform', function(d) { return 'rotate(-60)' });
                
        
        var pyAxis = d3.svg.axis()
                            .scale(pyScale)
                            .orient('left')
                            .ticks(10)
                            .tickSize(5)
                            .tickPadding(8);

        paxg.append('g')
                .attr('class', 'pyaxis')
                .call(pyAxis);

        // Snapshot Button
        //
        d3.selectAll('#myBtn').on('click', function () {
            
            snapFlag = snapFlag ? false : true;
            
            if (snapFlag) {

                d3.select("#snapInfo").text("clear snapshot");
                d3.select("#snapRange").text(pdate1 + " --> " + pdate2);
                
                savePrios = copy(prios);
                savePmax = pmaxCount;
                savePtot = pmaxTotal;
                
                paxg.append('g')
                    .attr('class', 'pyaxis2')
                    .attr("transform", "translate("+(pwidthp+1)+",0)");
                
                d3.select(".pvsvg").append("rect")
                          .attr("class", "comprect")
                          .attr("width", 255)
                          .attr("height", 230)
                          .attr("x", pwidth + 20)
                          .attr("y", 10);

                d3.select(".pvsvg").append("text")
                  .attr("class", "compinst")
                  .attr("x", pwidth + 30)
                  .attr("y", 50)
                  .style("font-size","12px")
                  .text("Hover over bars for comparison details");

          } else {

                d3.select("#snapInfo").text("take snapshot");
                d3.select("#snapRange").text("");
                savePrios = [];
                d3.select(".pyaxis2").remove();
                d3.select(".comprect").remove();
                d3.select(".compinst").remove();
            
            }

        that.updateVis();
            
            $(document).trigger("clickSnapshot");
    
        });             
                                
    // filter, aggregate, modify data
    this.wrangleData(null);

    // call the update method
    this.updateVis();
}


/**
 * Method to wrangle the data. In this case it takes an options object
 * @param _filterFunction - a function that filters data or "null" if none
 */
PrioVis.prototype.wrangleData= function(_filterFunction){

    // displayData should hold the data which is visualized
    //this.displayData = this.filterAndAggregate(_filterFunction);

    //// you might be able to pass some options,
    //// if you don't pass options -- set the default options
    //// the default is: var options = {filter: function(){return true;} }
    //var options = _options || {filter: function(){return true;}};





}



/**
 * the drawing function - should use the D3 selection, enter, exit
 */
PrioVis.prototype.updateVis = function(){

    // Dear JS hipster,
    // you might be able to pass some options as parameter _option
    // But it's not needed to solve the task.
    //var options = _options || {};


    // TODO: implement...
    // TODO: ...update scales
    // TODO: ...update graphs

        var that = this;

        prios = d3.range(0,16). map(function(){return 0;});
        pmaxCount = 0;
        pmaxTotal = 0;
        
            this.data.forEach( function (d) {
                if (dateFormatter(d.time) >= pdate1 && dateFormatter(d.time) <= pdate2) {
                    for (var i = 0; i < 16; i++) {
                        prios[i] += d.prios[i];
                        pmaxTotal += d.prios[i];
                        pmaxCount = prios[i] > pmaxCount ? prios[i] : pmaxCount;
                    };
                };
            });
            
            pyScale = d3.scale.linear()
                                    .domain([0, pmaxCount])
                                    .range([pheightp, 0]);
                                    
            pyAxis = d3.svg.axis()
                                    .scale(pyScale)
                                    .orient('left')
                                    .ticks(10)
                                    .tickSize(5)
                                    .tickPadding(8);
            
            d3.selectAll(".pyaxis").call(pyAxis);

                                    
                d3.selectAll('.pgrpb').remove();
                
        var pg = this.svg.append("g")
                                        .attr('class', 'pgrpb')
                    .attr("transform", "translate("+pmargin.left+","+pmargin.top+")");
                
                
        // Prio Bars
        // =========
        var grpbars = pg.append("g")
                    .selectAll("g.pgbar")
                    .data(prios)
                    .enter()
                    .append("g")
                    .attr("class", "pgbar");
                    //.attr("pointer-events", "none");

        var bars = grpbars.append("rect")
                    .attr("class", "pbar")
                    .attr("width", barWidth)
                    .attr("height", function (d) { return pheightp - pyScale(d) })
                    .attr("x", function (d, i) { return pxScale(i) + 1 })
                    .attr("y", function (d, i) { return pyScale(d); } )
                    .style("fill", function(d, i) {return prioColor[i]})
                    .on("mouseover", mouseovered)
                    .on("mouseout", mouseouted);

        // Prio snapshot Bars
        // ==================
                pyScales = d3.scale.linear()
                                    .domain([0, savePmax])
                                    .range([pheightp, 0]);

                if (snapFlag) {
                        pyAxis2 = d3.svg.axis()
                                            .scale(pyScales)
                                            .orient('right')
                                            .ticks(10)
                                            .tickSize(5)
                                            .tickPadding(8);
                        d3.selectAll(".pyaxis2").call(pyAxis2);
                };
        
                var grpbarsnap = pg.append("g")
                    .selectAll("g.pgbars")
                    .data(savePrios)
                    .enter()
                    .append("g")
                    .attr("class", "pgbars");

                var barssnap = grpbarsnap.append("rect")
                    .attr("class", "pbars")
                    .attr("width", barWidth-10)
                    .attr("height", function (d) { return pheightp - pyScales(d) })
                    .attr("x", function (d, i) { return pxScale(i) + 1 + 5 })
                    .attr("y", function (d, i) { return pyScales(d); } )
                    .style("fill", function (d, i) {return prioColor[i]})
                    .on("mouseover", mouseovered)
                    .on("mouseout", mouseouted);

        // Bar hovering
        function mouseovered(d, i) {

          // Show comparison table if hover and snapshot on
          if (snapFlag) {
            drawTable(d, i);
          };

        };

        function mouseouted(d) {

          d3.selectAll('.comptext').remove();
          d3.select('.pbardup').remove();
          d3.select('.pbarsdup').remove();
          d3.select('.compinst').text("Hover over bars for comparison details");


        };

        // Draw Table
        function drawTable(d, i) {

          // Header
          d3.select(".pvsvg").append("text")
            .attr("class", "comptext")
            .attr("x", pwidth + 30)
            .attr("y", 30)
            .style("font-weight", "bold")
            .style("font-size","18px")
            .text("Comparison");

          d3.select(".compinst").text(prioDesc[i]);                

          // Duplicate Bars
          d3.select(".pvsvg").append("rect")
                    .attr("class", "pbardup")
                    .attr("width", barWidth)
                    .attr("height", pheightp - pyScale(prios[i]))
                    .attr("x", pxScale(i) + 1 + 80)
                    .attr("y", pyScale(prios[i]) + 10)
                    .style("fill", prioColor[i])
                    .attr("pointer-events", "none");

          d3.select(".pvsvg").append("rect")
                    .attr("class", "pbarsdup")
                    .attr("width", barWidth-10)
                    .attr("height", pheightp - pyScales(savePrios[i]))
                    .attr("x", pxScale(i) + 1 + 5 + 80)
                    .attr("y", pyScales(savePrios[i]) + 10)
                    .style("fill", prioColor[i])
                    .attr("pointer-events", "none");

          d3.select(".pbardup")
                      .transition()
                      .duration(1000)
                      .attr("width", barWidth)
                      .attr("height", barWidth)
                      .attr("x", pwidth + 30)
                      .attr("y", 70);

          if (d3.select("#brushInfo").text()=="") {
            d3.select(".pvsvg").append("text")
              .attr("class", "comptext")
              .attr("x", pwidth + 40 + barWidth)
              .attr("y", 80)
              .style("text-decoration","underline")
              .text("All Dates");
          } else {
            d3.select(".pvsvg").append("text")
              .attr("class", "comptext")
              .attr("x", pwidth + 40 + barWidth)
              .attr("y", 80)
              .style("text-decoration","underline")
              .text(d3.select("#brushInfo").text());
          }

          d3.select(".pvsvg").append("text")
              .attr("class", "comptext")
              .attr("x", pwidth + 40 + barWidth)
              .attr("y", 100)
              .style("font-size","12px")
              .text((d3.format(",")(prios[i])+" votes out of "+d3.format(",")(pmaxTotal)));
          
          d3.select(".pvsvg").append("text")
              .attr("class", "comptext")
              .attr("x", pwidth + 40 + barWidth)
              .attr("y", 120)
              .style("font-size","12px")
              .text((d3.format(".1%")(prios[i]/pmaxTotal)+" of the total votes"));

          d3.select(".pbarsdup")
                      .transition()
                      .duration(1000)
                      .attr("width", barWidth-10)
                      .attr("height", barWidth)
                      .attr("x", pwidth + 35)
                      .attr("y", 140);

          d3.select(".pvsvg").append("text")
            .attr("class", "comptext")
            .attr("x", pwidth + 40 + barWidth)
            .attr("y", 150)
            .style("text-decoration","underline")
            .text(d3.select("#snapRange").text());

          d3.select(".pvsvg").append("text")
              .attr("class", "comptext")
              .attr("x", pwidth + 40 + barWidth)
              .attr("y", 170)
              .style("font-size","12px")
              .text((d3.format(",")(savePrios[i])+" votes out of "+d3.format(",")(savePtot)));
          
          d3.select(".pvsvg").append("text")
              .attr("class", "comptext")
              .attr("x", pwidth + 40 + barWidth)
              .attr("y", 190)
              .style("font-size","12px")
              .text((d3.format(".1%")(savePrios[i]/savePtot)+" of the total votes."));

          var diff = prios[i]/pmaxTotal - savePrios[i]/savePtot;

          if (diff == 0) {
            d3.select(".pvsvg").append("text")
              .attr("class", "comptext")
              .attr("x", pwidth + 40)
              .attr("y", 225)
              .style("font-size","18px")
              .text("No change.");
          } else if (diff > 0) {
            d3.select(".pvsvg").append("text")
              .attr("class", "comptext")
              .attr("x", pwidth + 40)
              .attr("y", 225)
              .style("fill", "green")
              .style("font-size","18px")
              .text("A "+d3.format(".1%")(diff)+" increase.");
            d3.select(".pvsvg").append("text")
              .attr("class", "comptext")
              .attr("x", pwidth + 40)
              .attr("y", 225)
              .style("fill", "green")
              .style("font-size","18px")
              .text("A "+d3.format(".1%")(diff)+" increase.");
          } else {
            d3.select(".pvsvg").append("text")
              .attr("class", "comptext")
              .attr("x", pwidth + 40)
              .attr("y", 225)
              .style("fill", "red")
              .style("font-size","18px")
              .text("A "+d3.format(".1%")(-diff)+" decrease.");
            d3.select(".pvsvg").append("text")
              .attr("class", "comptext")
              .attr("x", pwidth + 40)
              .attr("y", 225)
              .style("fill", "red")
              .style("font-size","18px")
              .text("A "+d3.format(".1%")(-diff)+" decrease.");          
          }

            
        };    

}


/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
PrioVis.prototype.onSelectionChange= function (selectionStart, selectionEnd){
    pdate1 = selectionStart;
    pdate2 = selectionEnd;
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
    // Deep-copy any array-type (without 3rd party library):
    //   from: http://stackoverflow.com/questions/7486085/copying-array-by-value-in-javascript
    function copy(o) {
         var out, v, key;
         out = Array.isArray(o) ? [] : {};
         for (key in o) {
                 v = o[key];
                 out[key] = (typeof v === "object") ? copy(v) : v;
         };
         return out;
    };
