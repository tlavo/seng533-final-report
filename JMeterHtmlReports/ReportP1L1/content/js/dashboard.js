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

    var data = {"OkPercent": 99.6842339337336, "KoPercent": 0.3157660662663998};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5609962197020236, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4535840188014101, 500, 1500, "Level 1, Run 1Logout"], "isController": false}, {"data": [0.5210280373831776, 500, 1500, "Level 1, Run 1Add Product to Cart"], "isController": false}, {"data": [0.5928246013667426, 500, 1500, "Level 1, Run 2Add Product to Cart"], "isController": false}, {"data": [0.39627959413754227, 500, 1500, "Level 1, Run 2Login"], "isController": false}, {"data": [0.7776484284051223, 500, 1500, "Level 1, Run 1Login-0"], "isController": false}, {"data": [0.37177985948477754, 500, 1500, "Level 1, Run 1Update Cart"], "isController": false}, {"data": [0.7175873731679819, 500, 1500, "Level 1, Run 2Login-0"], "isController": false}, {"data": [0.6728754365541327, 500, 1500, "Level 1, Run 1Login-1"], "isController": false}, {"data": [0.6617812852311161, 500, 1500, "Level 1, Run 2Login-1"], "isController": false}, {"data": [0.7634660421545667, 500, 1500, "Level 1, Run 1Update Cart-0"], "isController": false}, {"data": [0.493006993006993, 500, 1500, "Level 1, Run 2Logout"], "isController": false}, {"data": [0.6789044289044289, 500, 1500, "Level 1, Run 2Update Cart-1"], "isController": false}, {"data": [0.7485907553551296, 500, 1500, "Level 1, Run 2Home"], "isController": false}, {"data": [0.6911421911421911, 500, 1500, "Level 1, Run 2Update Cart-0"], "isController": false}, {"data": [0.23472850678733032, 500, 1500, "Level 1, Run 2Look at Product"], "isController": false}, {"data": [0.11843640606767794, 500, 1500, "Level 1, Run 1Look at Product"], "isController": false}, {"data": [0.2774011299435028, 500, 1500, "Level 1, Run 2List Products"], "isController": false}, {"data": [0.37543453070683663, 500, 1500, "Level 1, Run 2Update Cart"], "isController": false}, {"data": [0.23050058207217694, 500, 1500, "Level 1, Run 1List Products"], "isController": false}, {"data": [0.6118266978922716, 500, 1500, "Level 1, Run 1Update Cart-1"], "isController": false}, {"data": [0.7305045871559633, 500, 1500, "Level 1, Run 1Home"], "isController": false}, {"data": [0.71900826446281, 500, 1500, "Level 1, Run 1Logout-1"], "isController": false}, {"data": [0.8116883116883117, 500, 1500, "Level 1, Run 1Logout-0"], "isController": false}, {"data": [0.40898617511520735, 500, 1500, "Level 1, Run 1Login"], "isController": false}, {"data": [0.7768065268065268, 500, 1500, "Level 1, Run 2Logout-0"], "isController": false}, {"data": [0.7628205128205128, 500, 1500, "Level 1, Run 2Logout-1"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22485, 71, 0.3157660662663998, 1074.1443184345203, 14, 14942, 723.0, 2357.0, 3169.9500000000007, 5538.990000000002, 74.51261097358505, 1789.4673695097279, 18.454494383593307], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Level 1, Run 1Logout", 851, 9, 1.0575793184488838, 1151.7038777908344, 161, 11473, 904.0, 1946.2000000000003, 2511.2, 5570.720000000007, 2.9031091582689146, 28.85847894542257, 1.131841580983441], "isController": false}, {"data": ["Level 1, Run 1Add Product to Cart", 856, 2, 0.2336448598130841, 993.5292056074768, 49, 4575, 813.0, 1990.7000000000012, 2353.0, 3092.1499999999996, 2.906157591148441, 27.74031035900043, 0.7440252001378387], "isController": false}, {"data": ["Level 1, Run 2Add Product to Cart", 878, 15, 1.7084282460136675, 945.0649202733483, 48, 6523, 742.5, 1789.3000000000002, 2517.5999999999976, 4626.660000000009, 2.9442734217286035, 27.791364888072337, 0.7426081142314372], "isController": false}, {"data": ["Level 1, Run 2Login", 887, 2, 0.2254791431792559, 1454.9853438556952, 70, 8614, 1157.0, 2949.2, 3862.3999999999955, 5735.200000000003, 2.9407279213330417, 28.44948542959659, 1.2301781376191046], "isController": false}, {"data": ["Level 1, Run 1Login-0", 859, 0, 0.0, 571.7904540162971, 65, 2894, 387.0, 1277.0, 1750.0, 2235.2, 2.8722276650026246, 2.25228708233162, 0.7817175938155153], "isController": false}, {"data": ["Level 1, Run 1Update Cart", 854, 3, 0.351288056206089, 1360.2775175644035, 157, 6668, 1057.5, 2524.5, 3241.0, 4817.35, 2.905196696104179, 29.61266086059648, 1.268850876066486], "isController": false}, {"data": ["Level 1, Run 2Login-0", 887, 0, 0.0, 658.4441939120634, 26, 4515, 489.0, 1399.6000000000001, 1699.7999999999975, 2422.04, 2.9500487240290947, 2.3133812782075545, 0.8029155895690667], "isController": false}, {"data": ["Level 1, Run 1Login-1", 859, 0, 0.0, 746.2898719441212, 40, 6364, 553.0, 1559.0, 2096.0, 3158.2, 2.8647179470077204, 25.508299063297258, 0.419636418018709], "isController": false}, {"data": ["Level 1, Run 2Login-1", 887, 2, 0.2254791431792559, 796.5388951521983, 29, 6903, 565.0, 1655.0000000000002, 2333.3999999999987, 4171.040000000002, 2.9418885797013004, 26.153731764519563, 0.4299690284968508], "isController": false}, {"data": ["Level 1, Run 1Update Cart-0", 854, 0, 0.0, 581.192037470726, 22, 3629, 361.0, 1415.5, 1824.0, 2822.600000000012, 2.905710708258479, 1.898359827954026, 0.8336188219622734], "isController": false}, {"data": ["Level 1, Run 2Logout", 858, 1, 0.11655011655011654, 1151.363636363635, 91, 7597, 876.0, 2257.3, 2946.1499999999996, 5384.399999999986, 2.9089084473616404, 29.09769605996318, 1.1414771927846865], "isController": false}, {"data": ["Level 1, Run 2Update Cart-1", 858, 0, 0.0, 755.3135198135203, 31, 8592, 555.5, 1468.1, 1945.2999999999997, 3991.599999999998, 2.9815063209323984, 28.51065419391606, 0.448390599046474], "isController": false}, {"data": ["Level 1, Run 2Home", 887, 0, 0.0, 599.4250281848928, 33, 4599, 463.0, 1247.2, 1525.7999999999947, 2608.28, 2.9897331149176556, 26.621471232245298, 0.437949186755516], "isController": false}, {"data": ["Level 1, Run 2Update Cart-0", 858, 0, 0.0, 671.3986013986007, 14, 3049, 543.5, 1400.5, 1765.049999999999, 2513.9399999999987, 2.9852200295042723, 1.9503048825569906, 0.8563983150729256], "isController": false}, {"data": ["Level 1, Run 2Look at Product", 884, 6, 0.6787330316742082, 2243.419683257921, 116, 11124, 1657.0, 4367.0, 5614.25, 8720.25, 2.9412645441206315, 344.28279747031286, 0.4672018018572555], "isController": false}, {"data": ["Level 1, Run 1Look at Product", 857, 1, 0.11668611435239207, 2675.38039673279, 153, 12407, 2355.0, 4776.8, 5831.599999999993, 8034.039999999994, 2.865492383206944, 338.44345075018555, 0.4577640800331688], "isController": false}, {"data": ["Level 1, Run 2List Products", 885, 1, 0.11299435028248588, 2016.9435028248627, 130, 14942, 1512.0, 4129.8, 5341.899999999987, 8550.4, 2.937369311958578, 336.8140984651415, 0.5042898868200073], "isController": false}, {"data": ["Level 1, Run 2Update Cart", 863, 5, 0.5793742757821553, 1427.1193511008098, 43, 8728, 1189.0, 2592.4, 3256.2, 5850.600000000001, 2.9046285575809794, 29.544309048439644, 1.2627485068761948], "isController": false}, {"data": ["Level 1, Run 1List Products", 859, 2, 0.23282887077997672, 2085.68102444703, 50, 10171, 1745.0, 3811.0, 4608.0, 7102.999999999995, 2.866123026412375, 329.87307841611664, 0.4914679454669211], "isController": false}, {"data": ["Level 1, Run 1Update Cart-1", 854, 3, 0.351288056206089, 779.0433255269318, 50, 5688, 641.0, 1398.0, 1773.25, 2706.150000000015, 2.9063435883474, 27.7255778282824, 0.43555139489177785], "isController": false}, {"data": ["Level 1, Run 1Home", 872, 4, 0.45871559633027525, 600.4506880733936, 48, 3496, 493.0, 1031.7, 1358.199999999997, 2343.43, 2.905465740827125, 25.786854454325542, 0.4236530150870973], "isController": false}, {"data": ["Level 1, Run 1Logout-1", 847, 5, 0.5903187721369539, 659.8913813459264, 47, 11151, 503.0, 1094.2000000000016, 1561.799999999998, 3698.8399999999992, 2.892917645772993, 25.659684672617015, 0.4212656557393847], "isController": false}, {"data": ["Level 1, Run 1Logout-0", 847, 0, 0.0, 495.32939787485276, 34, 3166, 365.0, 1035.000000000001, 1288.1999999999998, 2077.919999999998, 2.895716595840698, 3.201124205558272, 0.7126177560076719], "isController": false}, {"data": ["Level 1, Run 1Login", 868, 9, 1.0368663594470047, 1310.3110599078327, 133, 8003, 1004.0, 2649.1, 3497.6499999999987, 4797.62, 2.892870474057484, 27.814263910482655, 1.1985387025575909], "isController": false}, {"data": ["Level 1, Run 2Logout-0", 858, 0, 0.0, 544.1410256410257, 21, 4890, 385.0, 1179.0, 1489.0, 2606.0699999999993, 2.935852646202382, 3.2454933549815395, 0.7224949871513674], "isController": false}, {"data": ["Level 1, Run 2Logout-1", 858, 1, 0.11655011655011654, 607.1864801864813, 28, 5584, 415.0, 1238.1, 1603.4499999999987, 3552.9199999999996, 2.9167006608468626, 25.951319829357715, 0.4267531117422697], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection has been shut down", 1, 1.408450704225352, 0.004447409384033801], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 69, 97.1830985915493, 0.3068712474983322], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, 1.408450704225352, 0.004447409384033801], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 22485, 71, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 69, "Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection has been shut down", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Level 1, Run 1Logout", 851, 9, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 1, Run 1Add Product to Cart", 856, 2, "Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection has been shut down", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Level 1, Run 2Add Product to Cart", 878, 15, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 1, Run 2Login", 887, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 1, Run 1Update Cart", 854, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 1, Run 2Login-1", 887, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 1, Run 2Logout", 858, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 1, Run 2Look at Product", 884, 6, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 1, Run 1Look at Product", 857, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 1, Run 2List Products", 885, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 1, Run 2Update Cart", 863, 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Level 1, Run 1List Products", 859, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 1, Run 1Update Cart-1", 854, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 1, Run 1Home", 872, 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 1, Run 1Logout-1", 847, 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 1, Run 1Login", 868, 9, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 1, Run 2Logout-1", 858, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
