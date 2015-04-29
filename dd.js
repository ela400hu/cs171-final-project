  //////////////////////////////////////////////////Function shapedata
function shapedata(data,division,casetype,counties,year,endyear){
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

//	document.getElementById("b2").innerHTML= htmlstr
console.log(JSON.stringify(cases))
	return cases	
}   //close function shapedata  /////////////////////////////////////// 	