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

    var data = {"OkPercent": 99.62870377178149, "KoPercent": 0.3712962282185133};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6392177045805455, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5471236230110159, 500, 1500, "Level 1, Run 3Update Cart"], "isController": false}, {"data": [0.9261992619926199, 500, 1500, "Level 1, Run 3Logout-0"], "isController": false}, {"data": [0.8277982779827798, 500, 1500, "Level 1, Run 3Logout-1"], "isController": false}, {"data": [0.46, 500, 1500, "Level 1, Run 1Logout"], "isController": false}, {"data": [0.4473684210526316, 500, 1500, "Level 1, Run 1Add Product to Cart"], "isController": false}, {"data": [0.6208053691275168, 500, 1500, "Level 1, Run 2Add Product to Cart"], "isController": false}, {"data": [0.5708333333333333, 500, 1500, "Level 1, Run 3Login"], "isController": false}, {"data": [0.7062423500611995, 500, 1500, "Level 1, Run 3Add Product to Cart"], "isController": false}, {"data": [0.5175097276264592, 500, 1500, "Level 1, Run 2Login"], "isController": false}, {"data": [0.21905339805825244, 500, 1500, "Level 1, Run 3Look at Product"], "isController": false}, {"data": [0.9153754469606674, 500, 1500, "Level 1, Run 3Login-0"], "isController": false}, {"data": [0.7878787878787878, 500, 1500, "Level 1, Run 1Login-0"], "isController": false}, {"data": [0.36354581673306774, 500, 1500, "Level 1, Run 1Update Cart"], "isController": false}, {"data": [0.9084415584415585, 500, 1500, "Level 1, Run 2Login-0"], "isController": false}, {"data": [0.6429924242424242, 500, 1500, "Level 1, Run 1Login-1"], "isController": false}, {"data": [0.788961038961039, 500, 1500, "Level 1, Run 2Login-1"], "isController": false}, {"data": [0.8498212157330155, 500, 1500, "Level 1, Run 3Login-1"], "isController": false}, {"data": [0.8013972055888223, 500, 1500, "Level 1, Run 1Update Cart-0"], "isController": false}, {"data": [0.5356662180349933, 500, 1500, "Level 1, Run 2Logout"], "isController": false}, {"data": [0.6317204301075269, 500, 1500, "Level 1, Run 2Update Cart-1"], "isController": false}, {"data": [0.791828793774319, 500, 1500, "Level 1, Run 2Home"], "isController": false}, {"data": [0.9422043010752689, 500, 1500, "Level 1, Run 2Update Cart-0"], "isController": false}, {"data": [0.12034574468085106, 500, 1500, "Level 1, Run 2Look at Product"], "isController": false}, {"data": [0.6826568265682657, 500, 1500, "Level 1, Run 3Update Cart-1"], "isController": false}, {"data": [0.9514145141451414, 500, 1500, "Level 1, Run 3Update Cart-0"], "isController": false}, {"data": [0.055449330783938815, 500, 1500, "Level 1, Run 1Look at Product"], "isController": false}, {"data": [0.39490861618798956, 500, 1500, "Level 1, Run 2List Products"], "isController": false}, {"data": [0.4200477326968974, 500, 1500, "Level 1, Run 3List Products"], "isController": false}, {"data": [0.828978622327791, 500, 1500, "Level 1, Run 3Home"], "isController": false}, {"data": [0.5114247311827957, 500, 1500, "Level 1, Run 2Update Cart"], "isController": false}, {"data": [0.22580645161290322, 500, 1500, "Level 1, Run 1List Products"], "isController": false}, {"data": [0.5558882235528942, 500, 1500, "Level 1, Run 1Update Cart-1"], "isController": false}, {"data": [0.7007575757575758, 500, 1500, "Level 1, Run 1Home"], "isController": false}, {"data": [0.6933867735470942, 500, 1500, "Level 1, Run 1Logout-1"], "isController": false}, {"data": [0.8386773547094188, 500, 1500, "Level 1, Run 1Logout-0"], "isController": false}, {"data": [0.39488636363636365, 500, 1500, "Level 1, Run 1Login"], "isController": false}, {"data": [0.5768757687576875, 500, 1500, "Level 1, Run 3Logout"], "isController": false}, {"data": [0.9063342318059299, 500, 1500, "Level 1, Run 2Logout-0"], "isController": false}, {"data": [0.7911051212938005, 500, 1500, "Level 1, Run 2Logout-1"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 27202, 101, 0.3712962282185133, 814.3023307109764, 11, 14796, 557.0, 1393.0, 1871.0, 3227.930000000011, 149.55521590446764, 3541.3243692134083, 37.02339974455153], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Level 1, Run 3Update Cart", 817, 4, 0.48959608323133413, 881.2056303549576, 32, 12636, 789.0, 1278.2, 1450.8999999999992, 3370.179999999952, 4.5488964611033165, 46.30067333028496, 1.9794089531691943], "isController": false}, {"data": ["Level 1, Run 3Logout-0", 813, 0, 0.0, 317.06273062730617, 11, 4193, 256.0, 587.2000000000002, 815.0999999999992, 1085.3400000000001, 4.549320679544285, 5.028814899864583, 1.1195593859816013], "isController": false}, {"data": ["Level 1, Run 3Logout-1", 813, 1, 0.12300123001230012, 483.82779827798333, 30, 5181, 401.0, 782.8000000000001, 968.6999999999996, 2271.9200000000037, 4.556280998682994, 40.5368037117858, 0.6666030347185249], "isController": false}, {"data": ["Level 1, Run 1Logout", 500, 2, 0.4, 1086.626, 312, 7839, 904.0, 1776.6000000000004, 2050.3999999999996, 4732.960000000003, 2.9413321881746683, 29.363997119700453, 1.1515315516703823], "isController": false}, {"data": ["Level 1, Run 1Add Product to Cart", 513, 11, 2.1442495126705654, 1133.7719298245609, 129, 5202, 959.0, 1969.0000000000005, 2449.5999999999976, 3805.16, 2.9880478087649402, 28.12589758837457, 0.7503565780736703], "isController": false}, {"data": ["Level 1, Run 2Add Product to Cart", 745, 1, 0.1342281879194631, 713.9422818791949, 159, 3617, 661.0, 1124.3999999999996, 1270.6999999999998, 1995.6999999999998, 4.218334182662363, 40.29829032720401, 1.081091900939924], "isController": false}, {"data": ["Level 1, Run 3Login", 840, 2, 0.23809523809523808, 800.0726190476196, 44, 6543, 689.5, 1232.9, 1485.7499999999995, 3615.300000000012, 4.619598094965738, 44.685422426842614, 1.9308852356407493], "isController": false}, {"data": ["Level 1, Run 3Add Product to Cart", 817, 0, 0.0, 611.177478580171, 26, 4997, 543.0, 954.0, 1084.7999999999993, 1663.4599999999998, 4.523709330911829, 43.25781366795586, 1.1608453872145688], "isController": false}, {"data": ["Level 1, Run 2Login", 771, 5, 0.648508430609598, 856.2931258106357, 283, 4632, 785.0, 1298.4, 1494.7999999999995, 2124.2399999999875, 4.283190560314656, 41.32838584199971, 1.7875923233114452], "isController": false}, {"data": ["Level 1, Run 3Look at Product", 824, 7, 0.8495145631067961, 1724.1286407766997, 129, 9427, 1602.0, 2547.5, 3169.75, 5027.0, 4.537270039150473, 519.7078472075002, 0.7194987837748545], "isController": false}, {"data": ["Level 1, Run 3Login-0", 839, 0, 0.0, 355.2967818831941, 22, 5453, 281.0, 593.0, 775.0, 1125.400000000001, 4.623914289493408, 3.6257320881878004, 1.2584689811268241], "isController": false}, {"data": ["Level 1, Run 1Login-0", 528, 0, 0.0, 568.5738636363641, 115, 4544, 403.5, 1042.1, 1712.4499999999991, 3018.9100000000008, 2.9767274039328884, 2.3342065812877726, 0.8101555364733672], "isController": false}, {"data": ["Level 1, Run 1Update Cart", 502, 2, 0.398406374501992, 1368.2231075697202, 314, 6718, 1185.5, 2043.8999999999999, 2773.749999999998, 5355.98999999998, 2.9341110870823126, 29.886490641310765, 1.2796096083370838], "isController": false}, {"data": ["Level 1, Run 2Login-0", 770, 0, 0.0, 355.18181818181813, 102, 2118, 297.0, 605.8, 744.2499999999997, 1183.7699999999995, 4.286517510702376, 3.361427144163377, 1.1666582003306742], "isController": false}, {"data": ["Level 1, Run 1Login-1", 528, 1, 0.1893939393939394, 751.7159090909097, 114, 7915, 590.0, 1292.4000000000003, 1774.8499999999942, 3382.2900000000036, 2.9301102121000233, 26.058168696725268, 0.4284024552159291], "isController": false}, {"data": ["Level 1, Run 2Login-1", 770, 4, 0.5194805194805194, 501.2103896103895, 121, 3230, 435.0, 824.9, 950.8999999999999, 1272.5599999999977, 4.280060476698684, 37.98110728499644, 0.6237050385205443], "isController": false}, {"data": ["Level 1, Run 3Login-1", 839, 1, 0.11918951132300358, 445.21215733015475, 20, 4053, 379.0, 717.0, 922.0, 1868.600000000005, 4.614809192215879, 41.05951514767114, 0.6751917222203887], "isController": false}, {"data": ["Level 1, Run 1Update Cart-0", 501, 0, 0.0, 499.1616766467063, 42, 2682, 380.0, 991.0, 1323.1999999999998, 1961.2200000000007, 2.98945634856703, 1.953072555850921, 0.8576599597825633], "isController": false}, {"data": ["Level 1, Run 2Logout", 743, 2, 0.2691790040376851, 835.7039030955577, 215, 4474, 768.0, 1265.6, 1526.1999999999998, 1979.3599999999929, 4.252640013736657, 42.49199142174398, 1.6664080609850327], "isController": false}, {"data": ["Level 1, Run 2Update Cart-1", 744, 1, 0.13440860215053763, 689.7190860215057, 114, 3291, 624.5, 1067.5, 1272.75, 1904.6999999999957, 4.2387848816672555, 40.496364727427334, 0.6366166883638519], "isController": false}, {"data": ["Level 1, Run 2Home", 771, 0, 0.0, 502.0869001297016, 61, 1826, 441.0, 819.6000000000001, 943.5999999999998, 1349.56, 4.299336418892545, 38.282567839318574, 0.6297856082362125], "isController": false}, {"data": ["Level 1, Run 2Update Cart-0", 744, 0, 0.0, 271.0403225806452, 36, 2838, 193.0, 506.0, 697.5, 2126.5999999999976, 4.270854859819522, 2.7902362316594336, 1.2253167443055268], "isController": false}, {"data": ["Level 1, Run 2Look at Product", 752, 7, 0.9308510638297872, 1990.4401595744675, 268, 6107, 1915.0, 2885.0000000000005, 3338.0, 4966.81, 4.205416710939117, 475.20791048774726, 0.6663913910590156], "isController": false}, {"data": ["Level 1, Run 3Update Cart-1", 813, 0, 0.0, 639.1107011070117, 16, 8671, 560.0, 1008.0, 1119.0, 2228.400000000002, 4.54083399425833, 43.421725070095285, 0.6828988624177568], "isController": false}, {"data": ["Level 1, Run 3Update Cart-0", 813, 0, 0.0, 245.1758917589176, 16, 4988, 176.0, 465.2000000000003, 662.5999999999995, 1162.640000000001, 4.558887025957058, 2.9784134964504605, 1.307902561500115], "isController": false}, {"data": ["Level 1, Run 1Look at Product", 523, 10, 1.9120458891013383, 2858.319311663476, 469, 7819, 2529.0, 4545.4, 5581.599999999996, 7395.039999999997, 2.9839846179301532, 336.4769553782329, 0.4681308624171987], "isController": false}, {"data": ["Level 1, Run 2List Products", 766, 14, 1.8276762402088773, 1258.801566579634, 207, 7708, 1108.5, 1914.7000000000007, 2385.749999999999, 4776.2200000000585, 4.262138191206419, 480.0943436251544, 0.7191662679026496], "isController": false}, {"data": ["Level 1, Run 3List Products", 838, 14, 1.6706443914081146, 1260.9522673031026, 140, 14796, 1031.0, 1940.9, 2640.749999999998, 5616.52, 4.609689148527705, 526.0007811597521, 0.779053968568301], "isController": false}, {"data": ["Level 1, Run 3Home", 842, 2, 0.2375296912114014, 461.2327790973872, 29, 7646, 394.0, 729.7, 919.6999999999998, 1370.2199999999907, 4.629349636854461, 41.15141692221098, 0.676516634319865], "isController": false}, {"data": ["Level 1, Run 2Update Cart", 744, 1, 0.13440860215053763, 960.7930107526887, 299, 4490, 880.5, 1372.0, 1662.25, 3475.8499999999976, 4.237432935789221, 43.251849560807734, 1.8521415695588286], "isController": false}, {"data": ["Level 1, Run 1List Products", 527, 4, 0.7590132827324478, 1990.024667931691, 412, 10505, 1618.0, 3647.2, 4836.599999999995, 6843.240000000009, 2.96776010136562, 341.2823751847811, 0.5062121638744193], "isController": false}, {"data": ["Level 1, Run 1Update Cart-1", 501, 1, 0.1996007984031936, 866.1177644710575, 190, 5580, 740.0, 1312.8, 1799.9, 3073.080000000001, 2.930235822571589, 27.977113975426377, 0.4398003959620064], "isController": false}, {"data": ["Level 1, Run 1Home", 528, 0, 0.0, 670.5625000000002, 54, 6745, 521.5, 1094.1, 1787.1499999999912, 3145.8500000000013, 3.0079814052058587, 26.783959426432638, 0.440622276153202], "isController": false}, {"data": ["Level 1, Run 1Logout-1", 499, 1, 0.20040080160320642, 631.1523046092183, 116, 7310, 534.0, 1001.0, 1232.0, 2225.0, 2.940829797265441, 26.151610522380363, 0.42992231700848654], "isController": false}, {"data": ["Level 1, Run 1Logout-0", 499, 0, 0.0, 456.2304609218439, 39, 3785, 364.0, 904.0, 1078.0, 1951.0, 2.9684888071910005, 3.2815716110744266, 0.7305265423946603], "isController": false}, {"data": ["Level 1, Run 1Login", 528, 1, 0.1893939393939394, 1320.3390151515157, 266, 10021, 1015.0, 2266.500000000001, 3559.5999999999976, 5600.6500000000115, 2.9221480001549622, 28.27876688329118, 1.2225393580267754], "isController": false}, {"data": ["Level 1, Run 3Logout", 813, 1, 0.12300123001230012, 800.9446494464943, 45, 6681, 698.0, 1211.6, 1510.2999999999981, 3088.7800000000016, 4.544616055407422, 45.45663622074368, 1.7832980119400983], "isController": false}, {"data": ["Level 1, Run 2Logout-0", 742, 0, 0.0, 339.5309973045822, 42, 1792, 291.0, 594.0, 763.4000000000001, 1109.5600000000004, 4.266648266027244, 4.716646325334805, 1.049995471717642], "isController": false}, {"data": ["Level 1, Run 2Logout-1", 742, 1, 0.1347708894878706, 496.27493261455567, 81, 2682, 444.0, 789.5000000000002, 945.6000000000004, 1431.260000000001, 4.254513970516562, 37.84997628516998, 0.6223799010051433], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 101, 100.0, 0.3712962282185133], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 27202, 101, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 101, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Level 1, Run 3Update Cart", 817, 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 1, Run 3Logout-1", 813, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 1, Run 1Logout", 500, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 1, Run 1Add Product to Cart", 513, 11, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 1, Run 2Add Product to Cart", 745, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 1, Run 3Login", 840, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 1, Run 2Login", 771, 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 1, Run 3Look at Product", 824, 7, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 1, Run 1Update Cart", 502, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 1, Run 1Login-1", 528, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 1, Run 2Login-1", 770, 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 1, Run 3Login-1", 839, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 1, Run 2Logout", 743, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 1, Run 2Update Cart-1", 744, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 1, Run 2Look at Product", 752, 7, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 1, Run 1Look at Product", 523, 10, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 1, Run 2List Products", 766, 14, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 1, Run 3List Products", 838, 14, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 1, Run 3Home", 842, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 1, Run 2Update Cart", 744, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 1, Run 1List Products", 527, 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 1, Run 1Update Cart-1", 501, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 1, Run 1Logout-1", 499, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 1, Run 1Login", 528, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 1, Run 3Logout", 813, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 1, Run 2Logout-1", 742, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
