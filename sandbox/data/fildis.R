library(reshape2)
library(data.table)

counties = c("Alachua",
             "Baker",
             "Bay",
             "Bradford",
             "Brevard",
             "Broward",
             "Calhoun",
             "Charlotte",
             "Citrus",
             "Clay",
             "Collier",
             "Columbia",
             "Dade",
             "Desoto",
             "Dixie",
             "Duval",
             "Escambia",
             "Flagler",
             "Franklin",
             "Gadsden",
             "Gilchrist",
             "Glades",
             "Gulf",
             "Hamilton",
             "Hardee",
             "Hendry",
             "Hernando",
             "Highlands",
             "Hillsborough",
             "Holmes",
             "Indian River",
             "Jackson",
             "Jefferson",
             "Lafayette",
             "Lake",
             "Lee",
             "Leon",
             "Levy",
             "Liberty",
             "Madison",
             "Manatee",
             "Marion",
             "Martin",
             "Miami-Dade",
             "Monroe",
             "Nassau",
             "Okaloosa",
             "Okeechobee",
             "Orange",
             "Osceola",
             "Palm Beach",
             "Pasco",
             "Pinellas",
             "Polk",
             "Putnam",
             "St. Johns",
             "St. Lucie",
             "Santa Rosa",
             "Sarasota",
             "Seminole",
             "Sumter",
             "Suwannee",
             "Taylor",
             "Union",
             "Volusia",
             "Wakulla",
             "Walton",
             "Washington"
)

cids = c(12001, 
         12003, 
         12005, 
         12007, 
         12009, 
         12011, 
         12013, 
         12015, 
         12017, 
         12019, 
         12021, 
         12023, 
         12025, 
         12027, 
         12029, 
         12031, 
         12033, 
         12035, 
         12037, 
         12039, 
         12041, 
         12043, 
         12045, 
         12047, 
         12049, 
         12051, 
         12053, 
         12055, 
         12057, 
         12059, 
         12061, 
         12063, 
         12065, 
         12067, 
         12069, 
         12071, 
         12073, 
         12075, 
         12077, 
         12079, 
         12081, 
         12083, 
         12085, 
         12086, 
         12087, 
         12089, 
         12091, 
         12093,
         12095, 
         12097, 
         12099, 
         12101, 
         12103, 
         12105, 
         12107, 
         12109, 
         12111, 
         12113, 
         12115, 
         12117, 
         12119, 
         12121, 
         12123, 
         12125, 
         12127, 
         12129, 
         12131, 
         12133
)

doclist = c("Circuit Civil","Circuit Criminal","County Civil","County Criminal","Family Court","Probate","Traffic")
doctoc1 = c("Auto Negligence","Condominium","Contract & Indebtedness","Eminent Domain","Other Circuit Civil","Other Negligence","Products Liability","Professional Malpractice","Real Property/Mortgage Foreclosure")
doctoc2 = c("Burglary","Capital Murder","Drugs","Non Capital Murder","Other Crimes Against Person","Other Crimes Against Property","Other Felonies","Robbery","Sexual Offenses","Theft, Forgery, Fraud","Worthless Checks (Felony)")
doctoc3 = c("Civil ($5,001 to $15,000)","Evictions","Other Civil (non-monetary)","Replevins","Small Claims (up to $5,000)")
doctoc4 = c("County Ordinances","Misdemeanors","Municipal Ordinances","Worthless Checks (Misdemeanors)")
doctoc5 = c("Child Support","Dissolution","Domestic Violence","Juvenile Delinquency","Juvenile Dependency","Other Domestic Relations","Repeat Violence","Simplified Dissolution","Termination of Parental Rights","UIFSA")
doctoc6 = c("Baker Act","Guardianship","Other Social","Probate","Substance Abuse Act","Trusts")
doctoc7 = c("Civil Traffic Infractions","DUI","Non DUI Criminal Traffic")

fil <- read.csv("20150220_Filings_1986to2013.csv", stringsAsFactors=FALSE)
fil2 <- fil
fil2$doc <- match(fil2$Division.of.Court, doclist)
fil21 <- subset(fil2,doc==1)
fil22 <- subset(fil2,doc==2)
fil23 <- subset(fil2,doc==3)
fil24 <- subset(fil2,doc==4)
fil25 <- subset(fil2,doc==5)
fil26 <- subset(fil2,doc==6)
fil27 <- subset(fil2,doc==7)
fil21$toc <- match(fil21$Type.of.Case, doctoc1)
fil22$toc <- match(fil22$Type.of.Case, doctoc2)
fil23$toc <- match(fil23$Type.of.Case, doctoc3)
fil24$toc <- match(fil24$Type.of.Case, doctoc4)
fil25$toc <- match(fil25$Type.of.Case, doctoc5)
fil26$toc <- match(fil26$Type.of.Case, doctoc6)
fil27$toc <- match(fil27$Type.of.Case, doctoc7)
fil2c <- rbind(fil21,fil22,fil23,fil24,fil25,fil26,fil27)
fil2c$id <- cids[match(fil2c$County, counties)]
fil2c[!complete.cases(fil2c),]
fil2c$Circuit = NULL
fil2c$County = NULL
fil2c$Division.of.Court = NULL
fil2c$Type.of.Case = NULL

film <- melt(fil2c,id=c("id","doc","toc"))
film$variable <- as.numeric(substr(film$variable,2,5))
film$value <- as.numeric(gsub(",","",film$value))
write.csv(film, file = "Filings.csv")

dis <- read.csv("20150220_Dispositions_1986to2013.csv", stringsAsFactors=FALSE)


fil2 <- dis
fil2$doc <- match(fil2$Division.of.Court, doclist)
fil21 <- subset(fil2,doc==1)
fil22 <- subset(fil2,doc==2)
fil23 <- subset(fil2,doc==3)
fil24 <- subset(fil2,doc==4)
fil25 <- subset(fil2,doc==5)
fil26 <- subset(fil2,doc==6)
fil27 <- subset(fil2,doc==7)
fil21$toc <- match(fil21$Type.of.Case, doctoc1)
fil22$toc <- match(fil22$Type.of.Case, doctoc2)
fil23$toc <- match(fil23$Type.of.Case, doctoc3)
fil24$toc <- match(fil24$Type.of.Case, doctoc4)
fil25$toc <- match(fil25$Type.of.Case, doctoc5)
fil26$toc <- match(fil26$Type.of.Case, doctoc6)
fil27$toc <- match(fil27$Type.of.Case, doctoc7)
fil2c <- rbind(fil21,fil22,fil23,fil24,fil25,fil26,fil27)
fil2c$id <- cids[match(fil2c$County, counties)]
fil2c[!complete.cases(fil2c),]
fil2c$Circuit = NULL
fil2c$County = NULL
fil2c$Division.of.Court = NULL
fil2c$Type.of.Case = NULL

#film <- melt(fil2c,id=c("id","doc","toc"))


dism <- melt(fil2c,id=c("id","doc","toc"))
dism$variable <- as.numeric(substr(dism$variable,2,5))
dism$value <- as.numeric(gsub(",","",dism$value))
write.csv(dism, file = "Dispositions.csv")


dfa <- read.csv("percapitapersonalincombycounty1986-2013.csv", stringsAsFactors=FALSE)

sink("Income.csv")
cat(paste(paste("id", "year","income",sep=","),"\n",sep=""))

for(k in 1:nrow(dfa)) {
    row <- dfa[k,]
    for (j in 3:30) {
        cat(paste(paste(row[1],(j+1983),(row[j]),sep=","),"\n",sep=""))
    }
}

sink()




