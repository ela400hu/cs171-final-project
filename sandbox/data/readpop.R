# Read in population Excel file
library(xlsx)
library(rjson)

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
             "Saint Johns",
             "Saint Lucie",
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


# read.xlsx(file, sheetIndex, sheetName=NULL, rowIndex=NULL,
#           startRow=NULL, endRow=NULL, colIndex=NULL, as.data.frame=TRUE)

cn = c("County", "g0","g14","g59","g1014","g1519","g2024","g2534","g3544","g4554","g5564","g6574","g7584","g8599")
rn = c("g0","g14","g59","g1014","g1519","g2024","g2534","g3544","g4554","g5564","g6574","g7584","g8599")

poplist = list()

for (i in 2020:1970) {
    
    df.aree <- read.xlsx("data/FloridaPopulation.xlsx", 
                                      sheetName=paste(i), 
                                      startRow=4,
                                        as.data.frame=TRUE)
    
    n <- df.aree[,1]
    
    # transpose all but the first column (name)
    df.aree <- as.data.frame(t(df.aree[,-1]))
    colnames(df.aree) <- n
    rownames(df.aree) <- rn
    #df.aree$myfactor <- factor(row.names(df.aree))
    
    poplist[[i-1969]] <- df.aree
    
}

json <- toJSON(poplist)
sink("data/popjson1986-2020.txt")
cat(json)
sink()


budlist = list()

df.bud <- read.xlsx("data/FloridaBudget.xlsx", 
                     sheetName="Sheet2", 
                     as.data.frame=TRUE)

#n <- df.bud[,1]

# transpose all but the first column (name)
#df.bud <- as.data.frame(t(df.bud[,-1]))
#colnames(df.bud) <- n
#rownames(df.bud) <- rn

json <- toJSON(df.bud)
sink("data/budjson.txt")
cat(json)
sink()




sink("data/sr_ag_pop.csv")
cat(paste(paste("Age Group","Year","Population",sep=","),"\n",sep=""))

for (i in 1970:2020) {
    
    df.aree <- read.xlsx("data/FloridaPopulation.xlsx", 
                         sheetName=paste(i), 
                         startRow=4,
                         as.data.frame=TRUE)
    
    for (j in 2:14) {
        cat(paste(paste(cn2[j],(i),sum(df.aree[j]),sep=","),"\n",sep=""))
    }
}

sink()




# 4/28/2015
# 4/28/2015
# 4/28/2015
# 4/28/2015
# 4/28/2015
# 4/28/2015
# 4/28/2015

dfa <- read.xlsx("data/FloridaPopulation.xlsx", 
                 sheetName=paste(1986), 
                 startRow=4,
                 as.data.frame=TRUE,
                 stringsAsFactors=FALSE)
dfa$id <- cids[match(dfa[,"NA."], counties)]
dfa["NA."] <- NULL
cn2 = c("Age < 0","Age 1-4","Age 5-9","Age 10-14","Age 15-19","Age 20-24","Age 25-34","Age 35-44","Age 45-54","Age 55-64","Age 65-74","Age 75-84","Age 85+")

sink("data/Population.csv")
cat(paste(paste("id", "group","year","population",sep=","),"\n",sep=""))

for (i in 1986:2013) {
    
    dfa <- read.xlsx("data/FloridaPopulation.xlsx", 
                         sheetName=paste(i), 
                         startRow=4,
                         as.data.frame=TRUE,
                         stringsAsFactors=FALSE)
    
    dfa$id <- cids[match(dfa[,"NA."], counties)]
    dfa["NA."] <- NULL
    
    for(k in 1:nrow(dfa)) {
        row <- dfa[k,]
        for (j in 1:13) {
            cat(paste(paste(row[14],(j),(i),(row[j]),sep=","),"\n",sep=""))
        }
    }
}

sink()

pop <- read.csv("data/Population.csv", stringsAsFactors=FALSE)











cls <- c(X1986="numeric", X1987="numeric", X1988="numeric", X1989="numeric", X1990="numeric", X1991="numeric", X1992="numeric", X1993="numeric", X1994="numeric", X1995="numeric", X1996="numeric", X1997="numeric", X1998="numeric", X1999="numeric", X2000="numeric", X2001="numeric", X2002="numeric", X2003="numeric", X2004="numeric", X2005="numeric", X2006="numeric", X2007="numeric", X2008="numeric", X2009="numeric", X2010="numeric", X2011="numeric", X2012="numeric", X2013="numeric")

#read.csv("data.csv", colClasses=cls, stringsAsFactors=FALSE)

fil <- read.csv("data/Fil.csv", stringsAsFactors=FALSE)
dis <- read.csv("data/Dis.csv", stringsAsFactors=FALSE)

sink("data/sr_wl_fd.csv")
cat(paste(paste("Group","Year","Count",sep=","),"\n",sep=""))

for (j in 1986:2013) {
    cat(paste(paste("Filings",(j),sum(as.numeric(gsub("\\,","",fil[,(j-1981)])),na.rm = TRUE),sep=","),"\n",sep=""))
}
for (j in 1986:2013) {
    cat(paste(paste("Dispositions",(j),sum(as.numeric(gsub("\\,","",dis[,(j-1981)])),na.rm = TRUE),sep=","),"\n",sep=""))
}

sink()



grp <- c("Circuit Civil","Circuit Criminal","County Civil","County Criminal","Family Court","Probate","Traffic")

sink("data/sr_wl_fil.csv")
cat(paste(paste("Division","Year","Count",sep=","),"\n",sep=""))

for (i in 1:7) {
    
    fil2 <- fil[fil$Division.of.Court == grp[i], ]
    
    for (j in 1986:2013) {
        cat(paste(paste(grp[i],(j),sum(as.numeric(gsub("\\,","",fil2[,(j-1981)])),na.rm = TRUE),sep=","),"\n",sep=""))
    }

}

sink()

sink("data/sr_wl_dis.csv")
cat(paste(paste("Division","Year","Count",sep=","),"\n",sep=""))

for (i in 1:7) {
    
    dis2 <- dis[dis$Division.of.Court == grp[i], ]
    
    for (j in 1986:2013) {
        cat(paste(paste(grp[i],(j),sum(as.numeric(gsub("\\,","",dis2[,(j-1981)])),na.rm = TRUE),sep=","),"\n",sep=""))
    }
    
}

sink()



options(java.parameters = "-Xmx4000m")
library(xlsx)
types = c("CA","CC","CF","CJ","CL","CM","CP","CT","DP","DR","II","IN","MH","NI","PK","PN","PP","TJ","TR","WD")

df.aree <- read.xlsx("data/Event Counts First 100 Cases 1989-2014 .xlsx", 
                     sheetName=types[1], 
                     startRow=1,
                     as.data.frame=TRUE,
                     colClasses=c(CaseNbr='character', DtFile='Date', Count='numeric', DtClose='numeric'),
                     stringsAsFactors=FALSE)

compdf <- df.aree

for (i in 2:18) {
    
    df.aree <- read.xlsx("data/Event Counts First 100 Cases 1989-2014 .xlsx", 
                         sheetName=types[i], 
                         startRow=1,
                         as.data.frame=TRUE,
                         colClasses=c(CaseNbr='character', DtFile='Date', Count='numeric', DtClose='numeric'),
                         stringsAsFactors=FALSE)
    
    compdf <- rbind(compdf, df.aree)
        
}

df.aree <- read.xlsx("data/Event Counts First 100 Cases 1989-2014 .xlsx", 
                     sheetName=types[19], 
                     startRow=1,
                     as.data.frame=TRUE,
                     colClasses=c(CaseNbr='character', DtFile='numeric', Count='numeric', DtClose='numeric'),
                     stringsAsFactors=FALSE)
df.aree$DtFile <- as.Date(df.aree$DtFile,origin="1899-12-30")
compdf <- rbind(compdf, df.aree)


df.aree <- read.xlsx("data/Event Counts First 100 Cases 1989-2014 .xlsx", 
                     sheetName=types[20], 
                     startRow=1,
                     as.data.frame=TRUE,
                     colClasses=c(CaseNbr='character', DtFile='Date', Count='numeric', DtClose='numeric'),
                     stringsAsFactors=FALSE)

compdf <- rbind(compdf, df.aree)


compdf$Year <- format(compdf$DtFile, "%Y")
compdf$Closed <- is.na(compdf$DtClose)
compdf$DtClose[compdf$Closed] <- 42104 # April 10, 2015

compdf$DtClosed <- as.Date(compdf$DtClose,origin="1899-12-30")
compdf$date_diff <- compdf$DtClosed - compdf$DtFile

write.csv(compdf, file = "compdf.csv")





cn2 = c("Category", "Age < 0","Age 1-4","Age 5-9","Age 10-14","Age 15-19","Age 20-24","Age 25-34","Age 35-44","Age 45-54","Age 55-64","Age 65-74","Age 75-84","Age 85+")

sink("data/sr_ag_pop.csv")
cat(paste(paste("Category","Year","Population",sep=","),"\n",sep=""))

for (i in 2020:1970) {
    
    df <- read.xlsx("data/FloridaPopulation.xlsx", 
                         sheetName=paste(i), 
                         startRow=4,
                         as.data.frame=TRUE)
    
    for (j in 2:14) {
        cat(paste(paste(cn2[j],(i),sum(df.aree[j]),sep=","),"\n",sep=""))
    }
}

sink()



rn = c("g0","g14","g59","g1014","g1519","g2024","g2534","g3544","g4554","g5564","g6574","g7584","g8599")
cn3 = c("Age 0","Age 1-4","Age 5-9","Age 10-14","Age 15-19","Age 20-24","Age 25-34","Age 35-44","Age 45-54","Age 55-64","Age 65-74","Age 75-84","Age 85+")

cla = list()
for (i in 2020:1970) {
    df <- read.xlsx("data/FloridaPopulation.xlsx", 
                         sheetName=paste(i), 
                         startRow=4,
                         as.data.frame=TRUE)
    n <- df[,1]
    # transpose all but the first column (name)
    df <- as.data.frame(t(df[,-1]))
    colnames(df) <- n
    rownames(df) <- cn3
    
    cl <- split(df, rownames(df))
    #cl2 <- as.list(as.data.frame(t(df)))
    cla[[2021-i]] <- cl
}


cljson <- toJSON(cla)

sink("data/clajson.txt")
cat(cljson)
sink()





rn = c("g0","g14","g59","g1014","g1519","g2024","g2534","g3544","g4554","g5564","g6574","g7584","g8599")
cn3 = c("Age 0","Age 1-4","Age 5-9","Age 10-14","Age 15-19","Age 20-24","Age 25-34","Age 35-44","Age 45-54","Age 55-64","Age 65-74","Age 75-84","Age 85+")

cla = list()
for (i in 2020:1970) {
    df <- read.xlsx("data/FloridaPopulation.xlsx", 
                    sheetName=paste(i), 
                    startRow=4,
                    as.data.frame=TRUE)
    n <- df[,1]
    # transpose all but the first column (name)
    df <- as.data.frame(t(df[,-1]))
    colnames(df) <- n
    rownames(df) <- cn3
    
    cl <- split(df, rownames(df))
    #cl2 <- as.list(as.data.frame(t(df)))
    cla[[2021-i]] <- cl
}


cljson <- toJSON(cla)

sink("data/clajson.txt")
cat(cljson)
sink()




df <- read.xlsx("data/FloridaPopulation.xlsx", 
                sheetName=paste(2020), 
                startRow=4,
                as.data.frame=TRUE)
n <- df[,1]
df <- as.data.frame(t(df[,-1]))
colnames(df) <- n
rownames(df) <- cn3

#cl <- split(df, rownames(df))

cl2 <- as.data.frame(rowSums(df))

#cl2 <- split(df$counties, rownames(df))

for (i in 2019:1970) {
    df <- read.xlsx("data/FloridaPopulation.xlsx", 
                    sheetName=paste(i), 
                    startRow=4,
                    as.data.frame=TRUE)
    n <- df[,1]
    # transpose all but the first column (name)
    df <- as.data.frame(t(df[,-1]))
    colnames(df) <- n
    rownames(df) <- cn3
    
    cl2 <- cbind(cl2,as.data.frame(rowSums(df)))
}

cl3 <- split(df$counties, rownames(df))
colnames(cl2) <- 2020:1970
cl2json <- toJSON(cl2)

sink("data/clajson.txt")
cat(cl2json)
sink()


colnames(cl2) <- 2020:1970
df2 <- as.data.frame(cl2)
js2 <- toJSON(df2)
sink("data/clajson2.txt")
cat(js2)
sink()



sink("data/clajson2.csv")
cat("Age Group")
for (i in 2020:1970) { cat(paste(",",i)) }
cat("\n")
sink()

write.csv(cl2,file="data/clajson2.csv",append=TRUE,row.names=TRUE,col.names=FALSE,sep=",")











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
