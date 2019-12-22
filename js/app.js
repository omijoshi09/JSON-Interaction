var xhr = new XMLHttpRequest(); //  create xml http request
var allData = []; // save all the data of json
var prizesData = []; // save prizes related json data
var winnersData = []; // save winner related json data
var genderValue = 'both'; // pre defined gender value

// Get the data from JSON file
function getJSONFile(url,callback) {
    var req = xhr;
    req.open('GET', url, true);
    req.overrideMimeType("application/json");
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status == "200") {
            callback(req.responseText);
        }
    };
    req.send();
}
// On load will triggered this function
window.onload = function() {

    getJSONFile('./prizesByYear.json', function(data){
        if (data) {
            allData = JSON.parse(data);

            // save the data in variable
            prizesData = allData.prizes;

            // Gender radio button attributes
            var male_radio = document.getElementById('male-val');
            var female_radio = document.getElementById('female-val');
            var both_radio = document.getElementById('both-val');

            // Get to know radio button is triggered
            male_radio.onclick = handler;
            female_radio.onclick = handler;
            both_radio.onclick = handler;

            // Hide the table structure
            document.getElementById("table-value").style.display = 'none';

            //Hide the gender block
            document.getElementById('gender-block').style.display = 'none';

            // store year values in one array
            function getYearValue(data) {
                return data.year
            }

            // # Resources - https://medium.com/poka-techblog/simplify-your-javascript-use-map-reduce-and-filter-bd02c593cc2d
            // Using Array map get only year value
            var allYears = prizesData.map(getYearValue);

            // get unique value of array
            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }
            // # Resources - https://medium.com/poka-techblog/simplify-your-javascript-use-map-reduce-and-filter-bd02c593cc2d
            // Save the result of unique values in variable
            var uniqueYears = allYears.filter( onlyUnique );


            function get_category(item) {
                return item.category;
            }

            // # Resources - https://medium.com/poka-techblog/simplify-your-javascript-use-map-reduce-and-filter-bd02c593cc2d
            // Get only categories
            var categories = prizesData.map(get_category)

            // get unique values only
            function uniqueCategory(item, index, self) {
                return self.indexOf(item) === index;
            }

            // get unique values only
            var uniqueCategories = categories.filter(uniqueCategory);


            // Get the category select element value
            var categories_list = document.getElementById('category-value');

            // load all the categories value in category
            for(var k = 0; k < uniqueCategories.length; k++) {
                var opt3 = document.createElement('option');
                opt3.innerHTML = uniqueCategories[k];
                opt3.value = uniqueCategories[k];
                categories_list.appendChild(opt3);
            }

            // Get the start year select element value
            var startYearValue = document.getElementById('year-list-start');

            // load all the years in option for starting year
            for(var i = 0; i < uniqueYears.length; i++) {
                var opt = document.createElement('option');
                opt.innerHTML = uniqueYears[i];
                opt.value = uniqueYears[i];
                startYearValue.appendChild(opt);
            }

            // Get the end year select element value
            var endYearValue = document.getElementById('year-list-end');

            // load all the years in option for end year
            for(var j = 0; j < uniqueYears.length; j++) {
                var opt2 = document.createElement('option');
                opt2.innerHTML = uniqueYears[j];
                opt2.value = uniqueYears[j];
                endYearValue.appendChild(opt2);
            }

            // Load winner data
            getJSONFile('./winnersByID.json', function(data){
                if(data){
                    var winner_items = JSON.parse(data);
                    // save the data in variable;
                    winnersData = winner_items.laureates;
                }
            });

        } else {
            alert('Error while loading JSON data');
        }
    });

};


// Triggered when gender radio button click
function handler(event) {
    genderValue = event.target.value;
    console.log('gender value', genderValue);

    // Call the filterResult method
    filterResult(genderValue);
}

// Filtered search output for selected field
function filterResult() {
    //show the gender block
    document.getElementById('gender-block').style.display = 'block';

    // Select radio button as both
    if(genderValue === 'both') {
        document.getElementById('both-val').checked = true;
    }

    var filteredArray = []; //Filtered Data

    // Get Selected start year value
    var start_year_value = document.getElementById("year-list-start");
    var start_year = start_year_value.options[start_year_value.selectedIndex].value; // get the user entered value for start year

    // Get Selected end year value
    var end_year_value = document.getElementById("year-list-end");
    var end_year = end_year_value.options[end_year_value.selectedIndex].value; // get the user entered value for end of year

    // Get Selected Category value
    var categories = document.getElementById("category-value");
    var category = categories.options[categories.selectedIndex].value; // get the category entered value


    // check if start year value and end year value is present and start year value is less than or equal to end year
    if(start_year && end_year) {
        if(start_year <= end_year) {

            // Get table attributes
            var elmtTable = document.getElementById('table-value');
            var tableRows = elmtTable.getElementsByTagName('tr');
            var rowCount = tableRows.length;

            // clear all the previous data from table
            for (var x=rowCount-1; x>0; x--) {
                document.getElementById("table-value").deleteRow(x);
            }

            for (var i = 0; i < prizesData.length; i++) {
                // If category value is not entered
                if (prizesData[i].year >= start_year && prizesData[i].year <= end_year && category === '') {
                    filteredArray.push(prizesData[i]) //Store the result in filtered array
                }else if (prizesData[i].year >= start_year && prizesData[i].year <= end_year && category === prizesData[i].category) {
                    filteredArray.push(prizesData[i]) //Store the result in filtered array
                }
            }

            // Call the genderFunction
            var dataFromGenderCall = genderFilter(filteredArray);


            // check if array contains any object or not
            if(dataFromGenderCall.length > 0) {
                // Display the table
                document.getElementById("table-value").style.display = 'table';
                var table = document.getElementsByTagName('table')[0];
                var nameValue= '';

                // Append new row with data
                dataFromGenderCall.forEach(function(data, outerindex)  {
                    var filtered_table = table.insertRow(outerindex + 1);
                    var cel1 = filtered_table.insertCell(0);
                    var cel2 = filtered_table.insertCell(1);
                    var cel3 = filtered_table.insertCell(2);
                    var cel4 = filtered_table.insertCell(3);
                    nameValue = '';
                    data.laureates.forEach(function(innerdata) {
                        if(genderValue  !== "both" && genderValue === innerdata.gender){
                            cel1.innerHTML = data.year;
                            cel2.innerHTML = data.category;
                            nameValue += '<br>' + `<a id="${innerdata.id}"
                            onclick="openModal(document.getElementById(${innerdata.id}))" class="name"> Name: </a>`
                                + innerdata.firstname+ ' ' + innerdata.surname+ '\n'+ '<br><b style="color: #662200"> Motivation:</b>'+ innerdata.motivation + '<br>';
                            cel3.innerHTML = nameValue;
                            cel4.innerHTML = innerdata.id;
                            cel4.style.display = 'none';
                        }

                        if(genderValue === 'both') {
                            cel1.innerHTML = data.year;
                            cel2.innerHTML = data.category;
                            nameValue += '<br>' + `<a id="${innerdata.id}" 
                            onclick="openModal(document.getElementById(${innerdata.id}))" class="name"> Name: </a>`
                                + innerdata.firstname+ ' ' + innerdata.surname+ '\n'+ '<br><b style="color: #662200">Motivation: </b>'+ innerdata.motivation+ '<br>';
                            cel3.innerHTML = nameValue;
                            cel4.innerHTML = innerdata.id;
                            cel4.style.display = 'none';
                        }

                    });
                    // If cell vale is empty remove it
                    if(!cel1.innerHTML) {
                        cel1.remove();
                        cel2.remove();
                        cel3.remove();
                        cel4.remove();
                    }
                });

                var row =table.getElementsByTagName("tr")[1];
                if(row.getElementsByTagName("td")[0] === undefined){
                    document.getElementById("table-value").style.display = 'none';
                    alert('Sorry No result found')
                }
            } else {
                // If filtered result not found
                document.getElementById("table-value").style.display = 'none';
                alert('Sorry No result found')
            }

        } else {
            // If starting year is greater than end year value
            document.getElementById("table-value").style.display = 'none';
            document.getElementById('gender-block').style.display = 'none';
            alert('Please check your year range');
        }
    }else{
        // If starting year or End year value is not present
        document.getElementById("table-value").style.display = 'none';
        document.getElementById('gender-block').style.display = 'none';
        alert('Please select starting and ending year');
    }


}

// Modal view when click on Name in table
function openModal(data) {
    // Store the result in variable
    var modalData;

    // Get particular winner data value
    for (var j= 0; j < winnersData.length; j++) {
        if(data.id !== 0 && winnersData[j].id === data.id) modalData = winnersData[j];
    }

    var dialog = document.getElementById('myFirstDialog');

    // Get name:
    var person_name = document.getElementById('dialog_person').innerText;
    person_name += modalData.firstname + ' '+ modalData.surname;
    document.getElementById('dialog_person').innerText = person_name;

    // Update Year of birth in dialog
    var yob = document.getElementById('yob');
    var update_yob = document.createElement('span');
    if(modalData.born === '0000-00-00'){
        update_yob.innerText = "-";
    }else {
        update_yob.innerText = modalData.born ? modalData.born : '-';
    }
    yob.appendChild(update_yob);

    // Update Year of death in dialog
    var yod = document.getElementById('yod');
    var update_yod = document.createElement('span');

    if(modalData.died === '0000-00-00'){
        yod.style.display = 'none';
    }else {
        update_yod.innerText = modalData.died ? modalData.died : '-';
    }
    yod.appendChild(update_yod);

    // Update City of birth in dialog
    var cob = document.getElementById('cob');
    var update_cob = document.createElement('span');
    if(modalData.bornCity === '0000-00-00'){
        update_cob.innerText = "-";
    }else {
        update_cob.innerText = modalData.bornCity ? modalData.bornCity : '-';
    }
    cob.appendChild(update_cob);


    // Table operation
    var inner_table = document.getElementsByTagName('table')[1];

    // Append new row with data
    var affiliation_value = '';
    modalData.prizes.forEach(function(data, outerindex)  {
        var filtered_table = inner_table.insertRow(outerindex + 1);
        var cel1 = filtered_table.insertCell(0);
        var cel2 = filtered_table.insertCell(1);
        var cel3 = filtered_table.insertCell(2);

        if(data.affiliations.length > 0) {
            data.affiliations.forEach(function(innerdata) {
                cel1.innerHTML = data.category ? data.category : '-';
                cel2.innerHTML = data.motivation ? data.motivation: '-';
                affiliation_value = affiliation_value +  'Affiliation Name:'+ (innerdata.name ? innerdata.name : '-')
                    + ', <span> <br> City: '+ (innerdata.city ? innerdata.city : '-')
                    + ',<br> Country: ' +(innerdata.country ? innerdata.country : '-')+'</span><br><br>'
                cel3.innerHTML = affiliation_value;
            });
        }else {
            cel1.innerHTML = data.category ? data.category : '-';
            cel2.innerHTML = data.motivation ? data.motivation: '-';
        }


        // If cell vale is empty remove it
        if(!cel1.innerHTML) {
            cel1.remove();
            cel2.remove();
            cel3.remove();
        }
    });


    // Call the dialog
    dialog.show();

}

// When click on close within dialog
function close_dialog() {

    //Clear the table header name
    document.getElementById('dialog_person').innerText  ='Details About: ';

    // # Resources - https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
    var elm;
    elm = document.getElementById("yob");
    // Remove the children data when click on close
    for (elm = elm.firstChild; elm; elm = elm.nextSibling) {
        elm.innerHTML = "";
    }

    elm = document.getElementById("yod");
    // Remove the children data when click on close
    elm.style.display = 'block';
    for (elm = elm.firstChild; elm; elm = elm.nextSibling) {
        elm.innerHTML = "";
    }

    elm = document.getElementById("cob");
    // Remove the children data when click on close
    for (elm = elm.firstChild; elm; elm = elm.nextSibling) {
        elm.innerHTML = "";
    }

    //clear table data
    // Get table attributes
    var elmtTable = document.getElementById('dialog-table');
    var tableRows = elmtTable.getElementsByTagName('tr');
    var rowCount = tableRows.length;

    // clear all the previous data from table
    for (var x=rowCount-1; x>0; x--) {
        document.getElementById("dialog-table").deleteRow(x);
    }

    // Close the dialog box
    document.getElementById('myFirstDialog').close();
}

// Radio Buttons for gender
function genderFilter(filteredArray_value) {
    // # Resources-
    // - https://medium.com/front-end-weekly/stop-array-foreach-and-start-using-filter-map-some-reduce-functions-298b4dabfa09
    // - https://stackoverflow.com/questions/38517373/trying-to-apply-a-filter-to-a-nested-array-full-of-objects
    // Filtered data using gender
    filteredArray_value.filter(function (o1) {
        return o1.laureates.filter(function (o2) {
            return winnersData.some(function (o3) {
                if(o2.id === o3.id) {
                    o2.gender = o3.gender;
                }
            });
        })

    });
    return filteredArray_value;

}





