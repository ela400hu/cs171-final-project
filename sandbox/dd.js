  //////////////////////////////////////////////////Function shapedata
function shapedata(data,division,casetype,counties,year,endyear){
// list of keys
keys = Object.keys(data[0]);
// list of alphabetic keys
alfakeys = keys.filter(function(d) {return d > "2015"})
yearkeys = keys.filter(function(d) {return d <= "2015"})

// arrays to hold unique values	
divisions = [data[0].DivisionOfCourt];   
ctypes= [data[0].TypeOfCase];
dtypes=[data[0].TypeOfDisposition];

// get the year or year range, or use a default year
if (year == undefined || year < 1986 || year > 2013)  year = "1986"   
if (endyear == undefined || year < 1986 || year > 2013)  endyear = "2013"   //default case, sum over
var yearspan= endyear - year

document.getElementById("xh1").innerHTML= "Case Paths to Resolution "+ year+"-"+endyear

//fill the unique values and aggregate the year values while we're in there
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
// nodes are the divisions the paths and the destinations concatenated
var sources=divisions
var paths = ["Before Trial", "Default", "Nonjury Trial","Jury Trial"]
var destinations = [
	"Dismissed Before Trial(11)",
	"Plea(12)",
	"Jury Conviction(13)",
	"Jury Acquittal(14)",
	"Resolved- Default(15)",
	"Resolved- Nonjury Trial(16)",
	"Jury Trial (Result Unspecified)(17)",
	"Adjudication(18)",
	"Resolved- Hearing Officer(19)",
	"Resolved- Unspecified(20)"
	]
var htmlstr=" "

var	nodelist = sources.concat(paths).concat(destinations)	
// objectify
var objnodes=[]
for(i=0;i<nodelist.length;i++){
	objnodes[i]={"name":nodelist[i]}
	htmlstr+= i + ". "+nodelist[i]+"<br>"
}

// The disposition types have to be classified into paths and destinations to
// make this work. THis required some judgment, hence manual manipulation. 

// this array will return the right path indx for any disposition type
var pathindices=[0,0,0,0,0,2,2,2,3,3,3,0,2,1,0,2,3,5,5,5,0,0,2,2]  // 5 means no link
// this array will return the right destination indx for any disposition type
var destindices = [0,0,0,0,0,5,5,5,3,1,2,0,7,4,7,5,6,10,10,10,7,0,7,8] //10 means direct link



htmlstr+=  "<br>Dispo Types<br>"
for(i=0;i<dtypes.length;i++){
	htmlstr+= i + ". "+dtypes[i]+" ---<i>"+ nodelist[pathindices[i]] +" </i>---<b>"+nodelist[destindices[i]] + "</b><br>"
}


// set up a matrix for the source->path links 7 sources 4 paths
srcpaths=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]
pathdests = []
for(i=0;i<paths.length;i++){
	pathdests[i]=[0,0,0,0,0,0,0,0,0,0,0]	
}
/*
for(i=0;i<srcpaths.length;i++){
	console.log(i+" " +srcpaths[i])	
}
for(i=0;i<paths.length;i++){
	console.log(i+" " +pathdests[i])	
}
*/
//console.log(pathdests[1])
// for every data point, add its size to th ematching indices		
for(i=0;i<data.length;i++){
	dindex = dtypes.indexOf(data[i].TypeOfDisposition) 
	var sourceindex = divisions.indexOf(data[i]["DivisionOfCourt"])
	var pathindex = pathindices[dindex];
	var destindex = destindices[dindex];
	var size= data[i].size
	if(size>0 & pathindex !=5) {
		srcpaths[sourceindex][pathindex] += size
		pathdests[pathindex][destindex] += size
	}
}

/*for(i=0;i<srcpaths.length;i++){
	console.log(i+" " +srcpaths[i])	
}
for(i=0;i<paths.length;i++){
	console.log(i+" " +pathdests[i])	
}
*/
var objlinks = [];

for(i=0;i<srcpaths.length;i++){
	for(j=0;j<srcpaths[0].length;j++){
		if(srcpaths[i][j] >0) objlinks.push({"source":i,"target":j+7,"value":srcpaths[i][j]})
	}
}
for(i=0;i<pathdests.length;i++){
	for(j=0;j<pathdests[0].length;j++){
		if(pathdests[i][j] >0) objlinks.push({"source":i+7,"target":j+11,"value":pathdests[i][j]})
	}
}		
//console.log(objlinks)

	var cases={"nodes": objnodes,"links": objlinks}

//	document.getElementById("b2").innerHTML= htmlstr
console.log(JSON.stringify(cases))
	return cases	
}   //close function shapedata  /////////////////////////////////////// 	