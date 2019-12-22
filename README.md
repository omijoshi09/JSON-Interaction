# JSON-Interaction
This project will taught about interactions with JSON

Project - Created Webpage with filtered functionality

This project is Divided into following parts
 - index.html
 - prizesByYear.json
 - winnersByID.json
 - Js Directory
 - Css Directory
 - readme.txt


Functionality:

When page loads it will triggered the xhr request to get the data form JSON file and store the result in global variable
after getting data this function loads start year , end year and category value from JSON. When user interacts they get to
shown search filter with Start year, End year and Category. The first two filled are mandatory when user clicks on search
button it will call filter method and it performs its operation to get filtered result when it call the filter method for
first time gender value will be selected as both. If user clicks on gender function it will call the filter function with given gender value
table is created in this method and row gets updated upon filtered data. When clicks on Name attribute in  the table open
dialog method will call and it will matched both the JSON data on base of their id's and perform the logical operation.
close dialog will clear the given dialog and it will reset to previous one.


Resources:

https://medium.com/poka-techblog/simplify-your-javascript-use-map-reduce-and-filter-bd02c593cc2d
https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
https://medium.com/front-end-weekly/stop-array-foreach-and-start-using-filter-map-some-reduce-functions-298b4dabfa09
https://stackoverflow.com/questions/38517373/trying-to-apply-a-filter-to-a-nested-array-full-of-objects
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
https://www.w3schools.com/
https://stackoverflow.com/
https://developer.mozilla.org/bm/docs/Web/JavaScript

