#!/usr/bin/php-cgi
<html>
    <head>
    <link rel="stylesheet" href="ShyftBaseCSS.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
        <title>Country Updates</title>
    </head>


    <body>

        <div class="tempbtm"></div>

        <h1>Corona Virus World Meter</h1>

     
        <div style="background-color: rgb(240, 205, 48); text-align: center;margin-bottom: 20px;margin-top:10px; margin-left:20%;margin-right:20%;padding: 10px; color: white;" id = "countryname">countryname</div>
        <div id="parent">

            <div class="child" ><b>Total Confirmed Cases</b><p id='global-total-cases'></p></div>
            <div class="child" ><b>Total Active Cases</b><p id='global-total-active-cases'></p></div>
            <div class="child" ><b>Total Deaths</b><p id='global-total-deaths'></p></div>
            <div class="child" ><b>Total Recovered</b><p id='global-total-recovered'></p></div>
        
        </div>
        <p><i>These records are pulled every 10 minutes</i></p>


        <label>From: </label>
        <input type="date" id="fromdate" name="fromdate" value="2020-01-01" min="2020-01-01" >
        <label>To: </label>
        <input type="date" id="todate" name="todate" value="2020-01-01" min="2020-01-01">
        <input type='submit' name='dates' value='Check!'>

        <h1 style="text-align: center; margin-top: 200px"> Charts </h1>
    <div class="graph-wrapper">
    <h2><u>Confirmed cases</u></h2>
    <div id="curve_chart" style="width: 900px; height: 500px"></div>

</div>

<?php
/* TODO1: Selection of dates feature is not currently working properly. 
    Need to grab dates from the form and then pass them for the graph generation. 
*/

/* TODO2: Need to add more graphs for visual representations. THey should allbe pretty similar to the one generated. 

*/

    if(isset($_POST['submit'])){
        $term = $_POST['searchterm'];
        echo "<script>document.getElementById('countryname').innerHTML = '".$term."'
        document.getElementById('fromdate').value
        function finddataCountry(country) {
            console.log('clicked?');
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

        finddataCountry('".$term."');

        
        let countryGraphDates = [['Date', 'Cases']];
        function finddataGraphCountry() {
            $.get('https://api.covid19api.com/total/country/".$term."/status/confirmed?from=2020-03-01T00:00:00Z&to=2020-04-01T00:00:00Z', function (data) {
                data.forEach(element => countryGraphDates.push([element['Date'].substring(0,10), element['Cases']]));
            })
        }
    finddataGraphCountry();
    google.charts.load('current', {'packages':['corechart']});
          google.charts.setOnLoadCallback(drawLineChart);
    
          function drawLineChart() {
              console.log(countryGraphDates);
            var data = google.visualization.arrayToDataTable(countryGraphDates);
    
            var options = {
              title: 'Confirmed COVID-19 Cases',
              curveType: 'function',
              legend: { position: 'bottom' }
            };
    
            var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
    
            chart.draw(data, options);
          }



        </script>";
}
?>

    </body>
</html>

