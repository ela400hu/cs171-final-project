##Cases And Results in the Florida State Courts System

###Background and Motivation.  
This project explores the volume and composition of the legal cases moving through the Florida state courts, looking to explain historical changes and make some projections about future ones.  It is intended to inform the general public about the what they get for their tax dollars spent on the judiciary, and to be useful to decision makers in the Florida courts and legislature responsible for allocation of resources.  It adds to the existing body of competent work on the subject http://www.flcourts.org/publications-reports-stats/statistics/  by adding data from other sources, such as economic and  demographic trends and applying  interactive data visualization methods to make the data more accessible.

One member of our group is part of Florida's Judicial Management Council responsible for refining the performance metrics to be used in evaluating the system.  In that process, an interesting puzzle arose: the number of cases is falling in absolute terms, but the judges report that they are working harder than ever.  Assuming that is true, there would have to be something about the composition of the cases themselves that reuired more work per unit. While this project is unlikely to definitively solve that puzzle, it has the prospect of advancing our understanding in that direction. 

### Project Objectives
The primary questions to be answered are how the composition of the cases in the trial courts have changed over time, and how they might be expected to change in the future.   The benefit of doing that, we hope, is to detect apparent patterns, using them to develop hypotheses explaining why the changes occur.  Some of these can already be anticipated, for example the increase in foreclosure cases was caused by the recent economic downturn, or the decrease in the crime rate results from the aging of the population.  Depending on the results of the visualization, we may be able to generate additional hypotheses. 
Data. 

The Office of State Courts Administrator (OSCA) supervises collection of data from the Clerks in each county acccording to the Summary Reporting System (SRS). Members of the public can query the database at http://trialstats.flcourts.org/  but the state courts administrator kindly provided a copy of the entire set in a three flat csv files. These constitute annual totals going back to 1986 for case filings, by county and by case type;  summary dispositions (number of cases closed) , also by county and case type; and detailed dispositions, including the nuimbers dismissed, resolved at trial, and whther the trial was by jury or non-jury.   We intend to supplement that data with demographic and economic data from public sources such as census, matching it by year to the data obtained from OSCA.. 

###Data Processing. 

The data is in great shape. Because we received a direct download from OSCA's SQL server files, we were able to skip the scraping and cleaning process altogether. Matching it with the economic and demographic data will require some restructuring to ensure comparability. Since the data consists primarily of annual counts and the relationship of interest is change over time, in many cases the data will be transformed into ratios  or normalized relative to an index value. 
Visualization. 

###Must-Have Features. 

###Optional Features. 

###Project Schedule. 

April 3 	Project Proposal Submitted
		Repository Set Up
		Team Form Submitted
		
April 10	Working Model 

April 17 Milestone 1 submitted
		Working Prototype Code
		Process Book to date
		
May 5 Project Finished and Submitted
		Process Book
		Code and Data
		Website
		Screen Cast
    Readme
    
May 7 Project Presentations


