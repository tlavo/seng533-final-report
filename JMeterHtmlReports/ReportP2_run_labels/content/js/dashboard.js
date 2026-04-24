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

    var data = {"OkPercent": 99.64464599972925, "KoPercent": 0.35535400027074593};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.741821217454086, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6996055226824458, 500, 1500, "L4: RUN 2"], "isController": false}, {"data": [0.8244971514940124, 500, 1500, "L3: RUN 1"], "isController": false}, {"data": [0.48853615520282184, 500, 1500, "L4: RUN 1"], "isController": false}, {"data": [0.6508567931456548, 500, 1500, "L1: RUN 2"], "isController": false}, {"data": [0.6938252028728663, 500, 1500, "L1: RUN 3"], "isController": false}, {"data": [0.7708975250969089, 500, 1500, "L2: RUN 3"], "isController": false}, {"data": [0.754061419138455, 500, 1500, "L2: RUN 2"], "isController": false}, {"data": [0.5344466077579751, 500, 1500, "L1: RUN 1"], "isController": false}, {"data": [0.6386774145394835, 500, 1500, "L2: RUN 1"], "isController": false}, {"data": [0.8739853896103896, 500, 1500, "L3: RUN 2"], "isController": false}, {"data": [0.8897607284704059, 500, 1500, "L3: RUN 3"], "isController": false}, {"data": [0.7143387815750372, 500, 1500, "L4: RUN 3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 88644, 315, 0.35535400027074593, 623.445681602814, 0, 25578, 312.0, 1020.9000000000015, 1469.9500000000007, 3054.9900000000016, 485.65401999726066, 11511.313722007259, 120.25633260854677], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["L4: RUN 2", 2535, 11, 0.4339250493096647, 765.2126232741622, 12, 19571, 489.0, 1554.8000000000002, 2193.0, 6127.119999999983, 14.062473996904592, 334.47486380445395, 3.47978298336634], "isController": false}, {"data": ["L3: RUN 1", 8601, 23, 0.2674107661899779, 449.11661434716825, 12, 3728, 366.0, 886.0, 1159.8999999999996, 1709.859999999997, 47.55875034559027, 1136.4359653632155, 11.79494185443738], "isController": false}, {"data": ["L4: RUN 1", 1134, 9, 0.7936507936507936, 1593.4805996472667, 31, 25578, 911.0, 2633.0, 3645.75, 23552.450000000055, 6.26907257529521, 147.4566185291451, 1.5438377269360046], "isController": false}, {"data": ["L1: RUN 2", 9804, 36, 0.3671970624235006, 751.7751937984467, 36, 7708, 596.0, 1465.0, 1957.75, 3028.9500000000007, 54.4460981407024, 1278.1323626699357, 13.486691052130306], "isController": false}, {"data": ["L1: RUN 3", 10721, 32, 0.2984796194384852, 694.8885365171135, 11, 14796, 522.0, 1329.800000000001, 1790.7999999999993, 3360.360000000008, 58.94351406925217, 1398.871499739191, 14.603933104045941], "isController": false}, {"data": ["L2: RUN 3", 10061, 21, 0.20872676672298976, 541.5122751217581, 12, 6721, 429.0, 1027.800000000001, 1365.0, 2296.379999999999, 55.12121627174359, 1304.9776678708395, 13.664010067114093], "isController": false}, {"data": ["L2: RUN 2", 9541, 32, 0.33539461272403315, 565.8527408028519, 17, 5029, 453.0, 1084.0, 1453.5999999999985, 2235.74, 53.051828539337095, 1252.1989557384775, 13.147410388853055], "isController": false}, {"data": ["L1: RUN 1", 6677, 33, 0.4942339373970346, 1097.8505316759006, 39, 10505, 784.0, 2304.2, 3156.7999999999956, 5371.3200000000015, 36.90785473439832, 881.8276730746642, 9.116497844231938], "isController": false}, {"data": ["L2: RUN 1", 6699, 22, 0.3284072249589491, 813.310195551575, 19, 8420, 603.0, 1667.0, 2151.0, 3752.0, 37.278797996661105, 881.2363487757374, 9.23355331803005], "isController": false}, {"data": ["L3: RUN 2", 9856, 17, 0.17248376623376624, 376.8354301948055, 10, 5570, 296.0, 763.0, 1008.0, 1576.7200000000012, 54.51960681273821, 1293.406536347557, 13.523018350444465], "isController": false}, {"data": ["L3: RUN 3", 10323, 19, 0.18405502276470018, 353.55361813426316, 2, 4799, 262.0, 731.0, 976.7999999999993, 1658.680000000004, 57.14776042560494, 1360.020848095905, 14.176166756395423], "isController": false}, {"data": ["L4: RUN 3", 2692, 60, 2.2288261515601784, 685.4565378900435, 0, 22168, 462.0, 1288.4000000000005, 1918.3999999999996, 3363.7100000000087, 14.86824591150853, 349.35733938414427, 3.606054265714665], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.NoRouteToHostException/Non HTTP response message: No route to host: connect", 52, 16.50793650793651, 0.05866161274310726], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 255, 80.95238095238095, 0.28766752402869905], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.impl.execchain.RequestAbortedException/Non HTTP response message: Request aborted", 1, 0.31746031746031744, 0.0011281079373674473], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 7, 2.2222222222222223, 0.007896755561572131], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 88644, 315, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 255, "Non HTTP response code: java.net.NoRouteToHostException/Non HTTP response message: No route to host: connect", 52, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 7, "Non HTTP response code: org.apache.http.impl.execchain.RequestAbortedException/Non HTTP response message: Request aborted", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["L4: RUN 2", 2535, 11, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["L3: RUN 1", 8601, 23, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 23, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["L4: RUN 1", 1134, 9, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["L1: RUN 2", 9804, 36, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 36, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["L1: RUN 3", 10721, 32, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 32, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["L2: RUN 3", 10061, 21, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["L2: RUN 2", 9541, 32, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 32, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["L1: RUN 1", 6677, 33, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 33, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["L2: RUN 1", 6699, 22, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 22, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["L3: RUN 2", 9856, 17, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["L3: RUN 3", 10323, 19, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 18, "Non HTTP response code: org.apache.http.impl.execchain.RequestAbortedException/Non HTTP response message: Request aborted", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["L4: RUN 3", 2692, 60, "Non HTTP response code: java.net.NoRouteToHostException/Non HTTP response message: No route to host: connect", 52, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 7, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
