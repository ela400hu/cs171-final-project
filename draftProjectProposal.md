##Cases And Results in the Florida State Courts System

###Project Team:
Scott Stephens, Joshua Darlington, and Eric Arnold

###Background and Motivation  
This project explores the volume and composition of the legal cases moving through the Florida state courts, looking to explain historical changes and make some projections about future ones.  It is intended to inform the general public about the what they get for their tax dollars spent on the judiciary, and to be useful to decision makers in the Florida courts and legislature responsible for allocation of resources.  It adds to the existing body of competent work on the subject [http://www.flcourts.org/publications-reports-stats/statistics/](http://www.flcourts.org/publications-reports-stats/statistics/) by adding data from other sources, such as economic and demographic trends and applying  interactive data visualization methods to make the data more accessible.

One member of our group is part of Florida's Judicial Management Council responsible for refining the performance metrics to be used in evaluating the system.  In that process, an interesting puzzle arose: the number of cases is falling in absolute terms, but the judges report that they are working harder than ever.  Assuming that is true, there would have to be something about the composition of the cases themselves that required more work per unit. While this project is unlikely to definitively solve that puzzle, it has the prospect of advancing our understanding in that direction. 

### Project Objectives
The primary questions to be answered are how the composition of the cases in the trial courts have changed over time, and how they might be expected to change in the future.  The benefit of doing that, we hope, is to detect apparent patterns, using them to develop hypotheses explaining why the changes occur. Some of these can already be anticipated, for example the increase in foreclosure cases was caused by the recent economic downturn, or the decrease in the crime rate results from the aging of the population.  Depending on the results of the visualization, we may be able to generate additional hypotheses.  

### Data

The Office of State Courts Administrator (OSCA) supervises collection of data from the Clerks in each county according to the Summary Reporting System (SRS). Members of the public can query the database at [http://trialstats.flcourts.org/](http://trialstats.flcourts.org/) but the state courts administrator kindly provided a copy of the entire set in three flat csv files. These constitute annual totals going back to 1986 for case filings, by county and by case type; summary dispositions (number of cases closed), also by county and case type; and detailed dispositions, including the numbers dismissed, resolved at trial, and whether the trial was by jury or non-jury.   We intend to supplement that data with demographic and economic data from public sources such as census, matching it by year to the data obtained from OSCA.

Four data files we have now: 
 
![Data](images/datafiles.png)  

### Data Processing

The data is in great shape. Because we received a direct download from OSCA's SQL server files, we were able to skip the scraping and cleaning process altogether. Matching it with the economic and demographic data will require some restructuring to ensure comparability. Since the data consists primarily of annual counts and the relationship of interest is change over time, in many cases the data will be transformed into ratios or normalized relative to an index value. 

##Visualization

We envision a set of three or at most four views ranging from the simple to the more visually rich presentations. The simple view consists of a timeline that can be aggregated and disaggregated interactively along the geographical and case type dimensions, including resolutions and specific type of resolution. "Resolution" in this context means the stage at which a case was terminated- by pretrial dismissal, by settlement, by jury trial, or otherwise. Except in criminal cases where the terms conviction and acquittal are unambiguous indicators of which side won or lost, the data does not try to characterize which side has won or lost any case.  


### Design Sketches

As represented by the first image, the timeline can be shown by a stacked area graph layout. In addition, we need an appropriate mechanism to let the viewer take advantage of the rich level of detail our dataset offers. For this, a collapsible force layout would be preferable to a simple pop-up box if it turns out to be feasible within time constraints.  

These initial sketches show a direction for the menu and layout.  Given our understanding of human cognition based design, we chose to feature Scott in the design.  He is the domain specialist and a public figure.  He can provide a design element for triggering and or binding story elements.

![Viz1](images/_BigPicture_4w.jpg)  

The general color direction is based off of Fathom.  Here are two color grids that can be applied to the vertical layout.  They are made from exact hex values and generated analogous colors.  
![ColorChart1](images/171_Final_Colors_Oranges_noHex_4w.jpg)
![ColorChart2](images/171_Final_Colors_Blues_noHex_4w.jpg)

The node based menu is based on this  
[http://bl.ocks.org/mbostock/1062288](http://bl.ocks.org/mbostock/1062288)

As well as this general Fathom direction. Text labels and perhaps as appropriate starburst of rotated sliders should be available from the nodes as they are selected.

[http://openindia.worldbankgroup.org/](http://openindia.worldbankgroup.org/)  
[http://fathom.info/civictech](http://fathom.info/civictech)

The background of the yellow viz is based on this:  
[http://bl.ocks.org/mbostock/1256572](http://bl.ocks.org/mbostock/1256572)  
and is targeted at the big picture comparisons such as budget, aging population trends, and workload trends.

---

Similarly, along the lines of the second image below, parallel to the caseload timeline we would match demographic data such as population and, in particular age cohorts, general economic data such as employment rates and changes in gross domestic product, and crime rates. This will allow comparison, for example, of whether higher rates of foreclosure cases are associated with economic downturns (we already know in general that they are, but this will visualize it in a more concrete setting), whether conviction rates are associated with decreased crime, and whether the budgetary resources of the courts are keeping up with changes in caseloads.

The orange page is meant to point in the direction of  
[http://www.nytimes.com/interactive/2012/10/15/us/politics/swing-history.html?_r=1&](http://www.nytimes.com/interactive/2012/10/15/us/politics/swing-history.html?_r=1&)

Again, the color values are not exact.  They merely point in the direction of the visual style used by fathom.

![Viz2](images/_multiAxisV2_4W.jpg) 

A boostrap landing page layout can be found here:
[http://getbootstrap.com/examples/cover/](http://getbootstrap.com/examples/cover/)

Information on incorporating gradients into D3 SVG layouts can be found here:
[http://4waisenkinder.de/blog/2013/09/28/using-gradient-and-shadows-with-d3-dot-js/](http://4waisenkinder.de/blog/2013/09/28/using-gradient-and-shadows-with-d3-dot-js/)

## Design Ideation ##

Our original thought was to have a welcome page where a user could click onto an introductory video of Scott explaining the domain, and then there would be animated divs where the user choose the map view or the vertical graph view.  

As we explored the animated div idea we realized that the welcome page might be a good place for big picture data and narrative.  As we understand it the big questions being explored are: 1 Demographic time trends vs. 2 budget trends vs. 3 workload trends.  Scott's narrative would be the emphasis of this page (the user would click on Scott's image/icon and the full page design would fade to the quick vid and back).  The visualization would illustrate the story conveying general directionality and velocity, with tool tips or text elements to tie it together.  This would be similar to the example shown in class where node animation was used to provide a big energetic picture of the evolution of open source projects Python vs Eclipse.  With that use in mind the D3 showreel example makes a nice hook and plays well with the Florida centered data when juxtaposed with the Florida coastal image.  The specific parts of the  showreel that match the wave/coastal quality are: sequence of lines, horizons areas, stacked areas ,streamgraph, overlapping areas, grouped bars.  So whatever aggregated time sequence data we have that supports the big questions (1 Demographic time trends vs 2 budget trends vs 3 workload trends) could be toggled and fed into this model - with appropriate narrative tool tip tags. We assume that if this animation includes these various layouts, that it would relatively easy to allow the user to stop and through the views, but the main emphasis would be on Scott's narrative and presenting a visual story hook. 

For the vertical graph we would again have the option of a quick introductory set up video from Scott, but the emphasis would be on exploration of the data.  We thought that the dispodetail data offered a lot of options for presentation on the vertical chart.  There is a good time series of metrics.  Aggregation of (disposition/crime) counts could be graphed, percentage change in aggregated counts could graphed.  As an exploration engine we would want to allow the user to explore relationships between any and all time sequenced data we have (time permitting). 

The next question is whether we could/should include the map as a way for people to compare geographic trends via a brush tool.  We've seen an effective New York times visualization that uses a national map of the United States as a small user interface for selection rather than for information.  We may want to consider this option.

###Must-Have Features. 

The essential mission of this visualization is to convey the historical and projected trends in the caseload of the Florida courts, along with some measures of their performance over the same period. To succeed in this mission our product must have a means of displaying the data visually at both the macro and micro levels.  That is, it must present a broad overview of the demands on the court system over the relevant timeframe, but it must also afford easy access to visually informative detail data for locations (i.e. each of Florida's 67 counties), the mix of case types, and the number and type of resolutions, also capable of being broken out by location and year.   

###Optional Features. 

There are two types of features that could be desired but not required.  First is any measure that improves upon the presentation of the basic mission. For example, allowing subsetting interactively (e.g., brush) and depicting meaningful aggregations based on the user-selected subset; permitting pan and zoom to magnify the details over a given time frame or geographic region; and in general just increasing the visual power of the displays. 

The second set of potential features would be ones that tell additional interesting stories based on the dataset, beyond the merely descriptive. These would include the comparisons mentioned above, the results we obtain by matching this data set to demographic and economic data, and making plausible explanatory or predictive hypotheses. 

###Project Schedule. 

April 3

+ Project Proposal Submitted
+ Repository Set Up
+ Team Form Submitted
		
April 10

+ Working Model 

April 17

+ Milestone 1 submitted
+ Working Prototype Code
+ Process Book to date
		
May 5 

+ Project Finished and Submitted
+ Process Book
+ Code and Data
+ Website
+ Screen Cast
+ Readme
    
May 7

+ Project Presentations


#### ---End---