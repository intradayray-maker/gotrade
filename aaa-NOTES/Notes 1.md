your format is triggering lots of errors use this format

// NEWS HELPER
nw(y,m,d,h,mm,pair) =>
    time > timestamp(y,m,d,h,mm) 
     and time <= timestamp(y,m,d,h,mm) 
     + NewsWindow*60000 and syminfo.ticker == pair

//{ 📰 NEWS FEB

newsFeb =

// Mon Feb 2
     nw(2026,2,2,10,0,"EURUSD")

// Wed Feb 4
  or nw(2026,2,4,8,15,"EURUSD")
  or nw(2026,2,4,10,0,"EURUSD")

//}