/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.47309201679519, "KoPercent": 0.526907983204808};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6395345646148357, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5689108212900952, 500, 1500, "L1: RUN 2"], "isController": false}, {"data": [0.782051282051282, 500, 1500, "L2: RUN 2"], "isController": false}, {"data": [0.552931669210739, 500, 1500, "L1: RUN 1"], "isController": false}, {"data": [0.7486113196216784, 500, 1500, "L2: RUN 1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 36439, 192, 0.526907983204808, 954.5471335656922, 0, 34170, 433.0, 1614.9000000000015, 2470.0, 5902.830000000027, 120.40815652168166, 2839.2687401746443, 29.81295140873809], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["L1: RUN 2", 11348, 33, 0.29080014099400775, 1069.986693690517, 14, 14942, 734.0, 2332.1000000000004, 3095.649999999998, 5662.360000000008, 37.60591991675531, 904.7204692310304, 9.31058449919804], "isController": false}, {"data": ["L2: RUN 2", 7293, 67, 0.9186891539832717, 715.1255998903067, 0, 29979, 364.0, 1181.0, 1720.199999999997, 9234.259999999811, 24.299308304346088, 550.8605185072735, 6.010037875001665], "isController": false}, {"data": ["L1: RUN 1", 11137, 38, 0.34120499236778307, 1078.380712938856, 22, 12407, 729.0, 2354.2000000000007, 3181.1000000000004, 5229.620000000001, 37.107748079140094, 889.5667465497825, 9.193723271642577], "isController": false}, {"data": ["L2: RUN 1", 6661, 54, 0.8106890857228645, 812.9705749887435, 0, 34170, 404.0, 1394.8000000000002, 2154.5999999999985, 6097.120000000019, 22.198671612294753, 512.9680351761547, 5.4975531961204815], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 74: http://172.20.10.4:8080/tools.descartes.teastore.webui/category?category=${category}&amp;page=1", 26, 13.541666666666666, 0.07135212272565108], "isController": false}, {"data": ["Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection has been shut down", 1, 0.5208333333333334, 0.002744312412525042], "isController": false}, {"data": ["500", 41, 21.354166666666668, 0.11251680891352672], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 67: http://172.20.10.4:8080/tools.descartes.teastore.webui/product?id=${product_id}", 26, 13.541666666666666, 0.07135212272565108], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 97, 50.520833333333336, 0.26619830401492905], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, 0.5208333333333334, 0.002744312412525042], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 36439, 192, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 97, "500", 41, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 74: http://172.20.10.4:8080/tools.descartes.teastore.webui/category?category=${category}&amp;page=1", 26, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 67: http://172.20.10.4:8080/tools.descartes.teastore.webui/product?id=${product_id}", 26, "Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection has been shut down", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["L1: RUN 2", 11348, 33, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 32, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["L2: RUN 2", 7293, 67, "500", 21, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 18, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 74: http://172.20.10.4:8080/tools.descartes.teastore.webui/category?category=${category}&amp;page=1", 14, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 67: http://172.20.10.4:8080/tools.descartes.teastore.webui/product?id=${product_id}", 14, "", ""], "isController": false}, {"data": ["L1: RUN 1", 11137, 38, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 37, "Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection has been shut down", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["L2: RUN 1", 6661, 54, "500", 20, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 74: http://172.20.10.4:8080/tools.descartes.teastore.webui/category?category=${category}&amp;page=1", 12, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 67: http://172.20.10.4:8080/tools.descartes.teastore.webui/product?id=${product_id}", 12, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 10, "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
