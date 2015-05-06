CS171 2015 Final Project
===

Final project for Harvard's [CS171](http://www.cs171.org/2015/index.html) 2015.

---
**Team**: Scott Stephens, Josh Darlington, Eric Arnold

###
Project uses two html files, 
Landing.html and Discovery.html

##Discovery 

###Major design elements:

####Timeline.

Displays, by year,  filings, resolutions, population (as selected),clearance rates, cumulative clearance rates, personal income per capita. All can be toggled by control at the top of the element.
Selects year or year span, which updates DOC graph, POP graph, and sankey diagram.
Responsive to: map, DOC and POP.

####Map: 

Displays whole state or selected part of state. Updates timeline, DOC, POP and sankey. Responsive to itself only.

####Division of Court (DOC) barchart. 

Displays number of cases filed, by division  (or at second level by casetype) honoring selections made by timeline, map, and itself.  Optionally click to eliminate traffic data which is so predominant it obscures comparison among others. Updates timeline, sankey. Responsive to map, timeline.




####Population (POP) barchart. 

Displays number of inhabitants in each age bracket, following selections on map,and timeline.   

####Sankey.  

Displays divisions of court or case types, depending on DOC selection, and displays outcome of cases, whether by pretrial resolution, default or trial. Responsive to map, timeline, and DOC. Updates nothing. Nodes- hover to show value. Links- same.  

##Depends on 

###Libraries

libs/d3/d3.min.js

libs/d3/sankey.js

http://d3js.org/topojson.v1.min.js

http://d3js.org/queue.v1.min.js"

libs/jquery/jquery-2.1.1.min.js

libs/bootstrap/js/bootstrap.min.js

###Stylesheets

 <link rel="stylesheet" type="text/css" href="libs/bootstrap/css/bootstrap.min.css">

 <link href='http://fonts.googleapis.com/css?family=PT+Sans:400,700' rel='stylesheet' type='text/css'>
 
 <link rel="stylesheet" type="text/css" href="css/myStyle.css">
 
 add own vis classes
 
  js/dd.js

###data files 

data/floridacourtsystem.json

data/FDCombined.csv

data/Population.csv

data/Income.csv

data/dispodetail.csv     


##Index.html

###Major design elements

####Picture- 

launches video demo. 

####Left side thumbnails- 

select visualization type.

####Dropdown- 

select dataset 

####Link- Forward to Discovery Page 

opens discovery page. 

###Depends on

####Libraries

libs/d3/d3.min.js" charset="utf-8"></script>

http://d3js.org/queue.v1.min.js"></script>

libs/jquery/jquery-2.1.1.min.js" charset="utf-8"></script>

libs/bootstrap/js/bootstrap.min.js" charset="utf-8"></script>

####Stylesheets

 <link rel="stylesheet" type="text/css" href="libs/bootstrap/css/bootstrap.min.css">

 <link href='http://fonts.googleapis.com/css?family=PT+Sans:400,700' rel='stylesheet' type='text/css'>

 <link rel="stylesheet" type="text/css" href="css/myStyle.css">

#### own class

 <script src = "js/showreelvisx.js"></script>

#### js/showreelvisx.js depends on 

(in js subdirectory)

sr_wl_fd.csv

sr_ag_pop.csv

sr_wl_fil.csv

sr_wl_dis.csv

sr_fl_bud.csv

sr_ju_bud.csv

sr_co_dtc.csv

sr_co_c1y.csv
