## Design Sketches ##

These initial sketches show a direction for the menu and layout.  Given my understanding of human cognition based design, I chose to feature Scott in the design.  He is the domain specialist and a public figure.  He can provide a design element for triggering and or binding story elements.  Attached are a couple of rough mock ups.  

![Viz1](/images/_BigPicture_4w.jpg)  

The general color direction is based off of Fathom.  Here are two color grids that can be applied to the vertical layout.  They are made from exact hex values and generated analogous colors.  
![ColorChart1](/images/171_Final_Colors_Oranges_noHex_4w.jpg)
![ColorChart2](/images/171_Final_Colors_Blues_noHex_4w.jpg)

I also have some font options picked out but I haven't have time to use them yet..

The node based menu is based on this  
[http://bl.ocks.org/mbostock/1062288](http://bl.ocks.org/mbostock/1062288)

As well as this general Fathom direction. Text labels and perhaps as appropriate starburst of rotated sliders should be available from the nodes as they are selected.

[http://openindia.worldbankgroup.org/](http://openindia.worldbankgroup.org/)  
[http://fathom.info/civictech](http://fathom.info/civictech)

The background of the yellow viz is based on this:  
[http://bl.ocks.org/mbostock/1256572](http://bl.ocks.org/mbostock/1256572)  
and is targeted at the big picture comparisons such as budget, aging population trends, and workload trends.

The orange page is meant to point in the direction of  
[http://www.nytimes.com/interactive/2012/10/15/us/politics/swing-history.html?_r=1&](http://www.nytimes.com/interactive/2012/10/15/us/politics/swing-history.html?_r=1&)

Again, the color values are not exact.  They merely point in the direction of the visual style used by fathom.

![Viz2](/images/_multiAxisV2_4W.jpg) 

A boostrap landing page layout can be found here:
[http://getbootstrap.com/examples/cover/](http://getbootstrap.com/examples/cover/)

Information on incorporating gradients into D3 SVG layouts can be found here:
[http://4waisenkinder.de/blog/2013/09/28/using-gradient-and-shadows-with-d3-dot-js/](http://4waisenkinder.de/blog/2013/09/28/using-gradient-and-shadows-with-d3-dot-js/)

## Design Ideation ##

My original thought was to have a welcome page where a user could click onto an introductory video of Scott explaining the domain, and then there would be animated divs where the user choose the map view or the vertical graph view.  

As I explored the animated div idea I realized that the welcome page might be a good place for big picture data and narrative.  As I understand it the big questions being explored are: 1 Demographic time trends vs. 2 budget trends vs. 3 workload trends.  Scott's narrative would be the emphasis of this page (the user would click on Scott's image/icon and  the full page design would fade to the quick vid and back).  The vis would illustrate the story conveying general directionality and velocity, with tool tips or text elements to tie it together.  This would be similar to the example shown in class where node animation was used to provide a big energetic picture of the evolution of open source projects Python vs Eclipse.  With that use in mind the D3 showreel example makes a nice hook and plays well with the Florida centered data when juxtaposed with the Florida coastal image.  The specific parts of the  showreel that match the wave/coastal quality are: sequence of lines, horizons areas, stacked areas ,streamgraph, overlapping areas, grouped bars.  So whatever aggregated time sequence data we have that supports the big questions (1 Demographic time trends vs 2 budget trends vs 3 workload trends) could be toggled and fed into this model - with appropriate narrative tool tip tags.   I assume that if this animation includes these various layouts, that it would relatively easy to allow the user to stop and through the views, but the main emphasis would be on Scotts narrative and presenting a visual story hook.

I could be more specific about which data might support questions 1, 2, and 3 but I think Scott might already have an idea about which number sequences illustrate his points.  

For the vertical graph we would again have option of a quick introductory set up video from Scott, but the emphasis would be on exploration of the data.  I thought that the dispodetail data offered a lot of options for presentation on the vertical chart.  There is a good time series of metrics.  Aggregation of (disposition/crime) counts could be graphed, percentage change in aggregated counts could graphed.  As an exploration engine we would want to allow the user to explore relationships between any and all time sequenced data we have (time permitting). 

The next question is whether we could/should include the map as a way for people to compare geographic trends via a brush tool.  I've seen an effective New York times visualization that uses a national map of the United States as a small user interface for selection rather than for information.  We may want to consider this option.