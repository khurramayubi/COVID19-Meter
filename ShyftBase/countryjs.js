let graphData = [["Country", "New Cases"]];

function finddataCountry(country) {
    console.log("clicked?");
    $.get('https://api.covid19api.com/live/country/'+country, function (data) {
        let deaths = data[data.length-1]['Deaths'];
        let confirmed = data[data.length-1]['Confirmed'];
        let active = data[data.length-1]['Active'];
        let recovered = data[data.length-1]['Recovered'];
        document.getElementById('global-total-cases').innerHTML = confirmed;
        document.getElementById('global-total-active-cases').innerHTML = active;
        document.getElementById('global-total-deaths').innerHTML = deaths;
        document.getElementById('global-total-recovered').innerHTML = recovered;

    })
}

function getDataGlobal() {
    console.log("GLOBAL DATA");
    let arrayKeys = ["Country", "NewConfirmed", "TotalConfirmed", "NewDeaths", "TotalDeaths", "NewRecovered", "TotalRecovered"];

    $.get("https://api.covid19api.com/summary", function (data) {
        console.log(data.Date);

        document.getElementById("global-total-deaths").innerHTML= data.Global["TotalDeaths"];
        document.getElementById("global-total-cases").innerHTML= data.Global["TotalConfirmed"];
        document.getElementById("global-total-recovered").innerHTML= data.Global["TotalRecovered"];


        let globalTable = document.getElementById("global-table");
        let globalRow = globalTable.insertRow();
        globalRow.style.backgroundColor="#DFDFDF";
        for (i=0; i<arrayKeys.length; i++) {
            let globalTableCell = globalRow.insertCell(i);
            if (i==0) {
                globalTableCell.outerHTML = "<th>World</th>"
            }
            else {
                let textNode = document.createTextNode(data.Global[arrayKeys[i]]);
                if (arrayKeys[i]=="NewConfirmed" || arrayKeys[i]=="NewDeaths" || arrayKeys[i]=="NewRecovered") {
                    textNode = document.createTextNode("+"+data.Global[arrayKeys[i]]);
                }
                globalTableCell.appendChild(textNode);

            }
        }
        console.log(data.Countries.forEach(element => {
            console.log(element.Country);

            let newRow = globalTable.insertRow();
            for (i=0; i<arrayKeys.length; i++) {
                let tableCell = newRow.insertCell(i);
                if (i==0) {
                    tableCell.outerHTML = "<th>"+element[arrayKeys[i]]+"</th>"
                }

                else {
                    let textNode = null;
                    if (arrayKeys[i]=="NewConfirmed" || arrayKeys[i]=="NewDeaths" || arrayKeys[i]=="NewRecovered") {
                        if (i==1) {
                            tableCell.style.backgroundColor = "rgba(255, 255, 0, 0.6)";
                            graphData.push([element[arrayKeys[0]],element[arrayKeys[i]]]);
                        }
                        else if (i==3) {
                            tableCell.style.backgroundColor = "rgba(255, 0, 25, 0.60)";
                        }
                        else if (i==5) {
                            tableCell.style.backgroundColor = "rgba(0, 128, 0, 0.60)";
                        }
                        textNode = document.createTextNode("+"+element[arrayKeys[i]]);
                    }
                    else {
                        textNode = document.createTextNode(element[arrayKeys[i]]);
                    }
                    tableCell.appendChild(textNode);
                }
            }
        }));

    })


    google.charts.load('current', {
        'packages':['geochart'],
        // Note: you will need to get a mapsApiKey for your project.
        // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
        'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'
    });
    google.charts.setOnLoadCallback(drawRegionsMap);

    //Not showing all countries due to different naming conventions for the 2 APIs. Cn be easily fixed later.
    function drawRegionsMap() {
        var data = google.visualization.arrayToDataTable(graphData);
        console.log(graphData);

        var options = {colorAxis: {colors: ['#EEEEEE', '#e31b23']},};

        var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

        chart.draw(data, options);
    }

}
getDataGlobal();
