# G2-TeamYellow
Project 2 - HTML, CSS, Bootstrap, Leaflet, D3.js, Mongo

Question to Answer: Are the blood lead level concentrations higher in children living in Missouri counties where there are lead Mines present than children not living in counties where there are lead mines. 

Children blood lead levels for Missouri counties are pulled from the CDC open database (2012-2017)
County borders for Missouri will be created via GeoJson API on Missouri state website
Lead mine geo coordinates will be taken in from Department of Labor

Interactive map of Missouri will be created with leaflet. Counties with lead mines will be colored red. Additional layer will be applied on top of that with markers indicating total number of children with blood lead levels above cautionary. 

D3 line chart will also be used to compare lead levels in children to top 10 states with highest lead levels in country via a dropdown option. 

All this will be packaged up and pushed out to heroku. 
