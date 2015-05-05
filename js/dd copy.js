function initSankey(rData, marginleft, width) {
							
		var margin = {top: 1, right: 1, bottom: 6, left: 1}
//	var width = 890*0.6
		var height=320
//	width = document.getElementById("headline").offsetWidth - mainWidthAdjust - margin.left - margin.right,
//	height = window.innerHeight*mainHeightPct - margin.top - margin.bottom;

		var svg = d3.select("#chart").append("svg")
				.attr("class","sankeysvg")
				.attr("width", width + marginleft + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
			.append("g")
				.attr("transform", "translate(" + 0 + "," + margin.top + ")");

		svg.append("g").attr("id","linklist");
		svg.append("g").attr("id","nodelist");				
				
		updateSankey(rData, marginleft, width);
		
};


function updateSankey(rData, marginleft, width) {
			
			var height=320;

			var formatNumber = d3.format(",.0f")
			var format = function(d) { return formatNumber(d) + " Cases"; },
					// var color = d3.scale.category20();
			var color = d3.scale.ordinal() //CHANGE
  							.range(["#00008b", "#00008b", "#00008b", "#00008b", "#00008b","#0071c2", "#35459e", "#348899", "#71b1d9", "#005595", "#000b95", "#5162da", "#4e52be", "#0700cc", "#0800ff", "#003b74"]);

			var sankey = d3.sankey(width + marginleft + margin.left + margin.right)
					.nodeWidth(15)
					.nodePadding(10)
					.size([width + marginleft + margin.left + margin.right, height]);

			var path = sankey.link();

			// Core sankey logic
			cases = shapedata(rData,multipleDoc,multipleToc,selGeoByName,selYrs[0],selYrs[1]);
				
			sankey
					.nodes(cases.nodes)
					.links(cases.links)
					.layout(32);			
			
			var svg = d3.select("#chart svg g");
			
			
			//Link Group
			var link = d3.select("#linklist");
			
			//Links
				// Bind Data
				var links = link.selectAll(".link")
						.data(cases.links);
				
				// Enter
				var newLinks = links.enter().append("path")
						.attr("class", "link");
						
				// Add Other new elements
				newLinks.append("title");
						
				// Update
				links//.transition()
						.attr("d", path)
						.style("stroke-width", function(d) { return Math.max(1, d.dy); })
						.sort(function(a, b) { return b.dy - a.dy; });

				// Exit
				links.exit().remove();
				
				// Update sub-elements
				links.select("title")//.transition()
					.text(function(d) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });

				
			//Node Group
			var node = d3.select("#nodelist");
			
			//Nodes Groups
				// Bind Data
				var nodes = node.selectAll(".node")
						.data(cases.nodes);
				
				// Enter
				var newNodes = nodes.enter().append("g")
						.attr("class", "node")
					.call(d3.behavior.drag()
						.origin(function(d) { return d; })
						.on("dragstart", function() { this.parentNode.appendChild(this); })
						.on("drag", dragmove));
						
				// Add Other new elements with defaults
				newNodes.append("rect")
					.attr("width", sankey.nodeWidth())
					.append(title);
				newNodes.append("text")
					.attr("x", -6)
					.attr("dy", ".35em")
					.attr("text-anchor", "end")
					.attr("transform", null);
				
				// Update
				nodes//.transition()
						.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

				// Exit
				nodes.exit().remove();
				
				// Update sub-elements
				nodes.select("rect")
					.attr("height", function(d) { return d.dy; })
					.style("fill", function(d) { return d.color = color(d.name.replace(/ .*/, "")); })
					.style("stroke", function(d) { return d3.rgb(d.color).darker(2); });
				nodes.select("rect title")
					.text(function(d) { return d.name + "\n" + format(d.value); });
				
				nodes.select("text")//.transition()
					.attr("y", function(d) { return d.dy / 2; })
					.text(function(d) { return d.name; })
					.filter(function(d) { return d.x < width / 2; })
						.attr("x", 6 + sankey.nodeWidth())
						.attr("text-anchor", "start");
			

			function dragmove(d) {
				d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
				sankey.relayout();
				links.attr("d", path);
			};

};


function shapedata(data,division,casetype,counties,year,endyear) {
// returns json array [nodes, links]

	// get the year or year range, or use a default year
	if (year == undefined || year < 1986 || year > 2013)  year = "1986"   
	if (endyear == undefined || year < 1986 || year > 2013)  endyear = "2013"   //default case
	var yearspan= endyear - year
	if(yearspan>0)document.getElementById("xh1").innerHTML= "Case Paths to Resolution "+ year+"-"+endyear
	else document.getElementById("xh1").innerHTML= "Case Paths to Resolution "+ year

	var dmode         // are we showing all divisions, one division, or one case type 
	// if division = "All" casetype must also be
	
	if(division == "All") {
		casetype= "All"
		dmode = "AllDivisions"
		}
	// otherwise filter by division, and if necessary casetype. set the mode
	else {
		data = data.filter(function(d){return d.DivisionOfCourt == division})
		dmode="OneDivision"
		if (casetype !="All") {
			data = data.filter(function(d){return d.TypeOfCase == casetype})
			dmode = "OneCasetype"
		}
	}

	// filter by counties- could be one or an array [if district or circuit is selectd) or "All"
		if (counties !="All") {
			data = data.filter(function(d){return counties.indexOf(d.County) >=0 })
		}

	// list of keys
	keys = Object.keys(data[0]);
	// list of alphabetic keys
	alfakeys = keys.filter(function(d) {return d > "2015"})
	// yearkeys needed to sum across year values
	yearkeys = keys.filter(function(d) {return d <= "2015"})

	// arrays to hold unique values; [0] is always unique	
	divisions = [data[0].DivisionOfCourt];   
	ctypes= [data[0].TypeOfCase];
	dtypes=[data[0].TypeOfDisposition];

	//fill the unique values, they will be node names
	// and aggregate the year values while we're in there

	for(i=0;i<data.length;i++){
		if (dtypes.indexOf(data[i].TypeOfDisposition) == -1) dtypes.push(data[i].TypeOfDisposition) 
		if (ctypes.indexOf(data[i].TypeOfCase) == -1) ctypes.push(data[i].TypeOfCase) 
		if (divisions.indexOf(data[i].DivisionOfCourt) == -1) divisions.push(data[i].DivisionOfCourt)
		data[i].size= +data[i][year];
			if(yearspan > 0){
			for(j=0;j<=yearspan;j++){
				cyear= +year+j
				data[i].size+= +data[i][cyear]
			} 	
		}
	}

	var sources
	// nodelist is are the sources the paths and the destinations concatenated
	if (dmode == "AllDivisions") {
		sources=divisions
		//will need this mementarily
		whatdata = "DivisionOfCourt"
		}
	// data is already filtered; only contains ctypes for selected division
	else if (dmode=="OneDivision") {
		sources = ctypes
		whatdata = "TypeOfCase"
		}
	// it will be all observations for that one case type /county /year 
	else if (dmode=="OneCasetype"){
		sources = ctypes
		whatdata = "TypeOfCase"
	}

	// groups to show the four main pathways- all bit "other" go through one
	var paths = ["Before Trial", 
		"Default", 	
		"Nonjury Trial",
		"Jury Trial"
		]

	//when sources > 1, grouping of TypeOFResolution nodes in "destinations" is needed to prevent clutter.  
	var destinations = [
		"Dismissed Before Trial",
		"Plea",
		"Jury Conviction",
		"Jury Acquittal",
		"Resolved- Default",
		"Resolved- Nonjury Trial",
		"Jury Trial (Result Unspecified)",
		"Adjudication",
		"Resolved- Hearing Officer",
		"Resolved- Unspecified("
		]
	// if case type is specified, there is only one source node, so there is room to map to all of the
	// detailed (ie ungrouped by "destination") disposition type nodes 
	if (dmode == "OneCasetype") destinations= dtypes

	var	nodelist = sources.concat(paths).concat(destinations)	
	// objectify
	var objnodes=[]
	for(i=0;i<nodelist.length;i++){
		objnodes[i]={"name":nodelist[i]}
	}

	// The classification into paths and destinations required some judgment, hence manual manipulation. 

	// this array will return the right path indx for any disposition type
	var pathindices=[0,0,0,0,0,2,2,2,3,3,3,0,2,1,0,2,3,5,5,5,0,0,2,2]  // 5 means no link
	// this array will return the right destination indx for any disposition type
	var destindices=[0,0,0,0,0,5,5,5,3,1,2,0,7,4,7,5,6,10,10,10,7,0,7,8] //10 means direct link

	// set up a matrix for the source->path links n sources 4 paths
	srcpaths=[]
	for(i=0;i<sources.length;i++){
		srcpaths[i]=[0,0,0,0]	
	}
	// 4 paths(now sources), 10 destinations  TODO-right number of dests for dmode==OneCasetype.
	pathdests = []
	for(i=0;i<paths.length;i++){
		pathdests[i]=[0,0,0,0,0,0,0,0,0,0,0]	
	}
	// this matrix approach is necessary consolidate duplicate links
	// reduces the namber and makes the size display (title)meaningfull

	// for every data point, add its size to the matching indices		
	for(i=0;i<data.length;i++){
		dindex = dtypes.indexOf(data[i].TypeOfDisposition) 
		var sourceindex = sources.indexOf(data[i][whatdata]) 
		var pathindex = pathindices[dindex];
		var destindex = destindices[dindex];
		var size= data[i].size
		if(size>0 && pathindex !=5) {  //pathindex = 5 for "other" that will map direct from source to dest
			srcpaths[sourceindex][pathindex] += size
			pathdests[pathindex][destindex] += size
		}
	}
	var objlinks = [];

	for(i=0;i<srcpaths.length;i++){
		for(j=0;j<srcpaths[0].length;j++){
			if(srcpaths[i][j] >0) objlinks.push({"source":i,"target":j+sources.length,"value":srcpaths[i][j]})
		}
	}
	for(i=0;i<pathdests.length;i++){
		for(j=0;j<pathdests[0].length;j++){
			if(pathdests[i][j] >0) objlinks.push({"source":i+sources.length,"target":j+sources.length+paths.length,"value":pathdests[i][j]})
		}
	}		
//console.log(objlinks)

	var cases={"nodes": objnodes,"links": objlinks}

	// document.getElementById("b2").innerHTML= htmlstr
// console.log(JSON.stringify(cases))
	return cases;

}   //close function shapedata  ///////////////////////////////////////