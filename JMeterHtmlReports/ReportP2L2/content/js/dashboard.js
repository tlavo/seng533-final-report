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

    var data = {"OkPercent": 99.71483973993384, "KoPercent": 0.2851602600661572};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7311128854416182, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.506765899864682, 500, 1500, "Level 2, Run 2List Products"], "isController": false}, {"data": [0.35723431498079383, 500, 1500, "Level 2, Run 3Look at Product"], "isController": false}, {"data": [0.3652007648183556, 500, 1500, "Level 2, Run 1List Products"], "isController": false}, {"data": [0.45784313725490194, 500, 1500, "Level 2, Run 1Update Cart"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "Level 2, Run 3Home"], "isController": false}, {"data": [0.510178117048346, 500, 1500, "Level 2, Run 3List Products"], "isController": false}, {"data": [0.968371467025572, 500, 1500, "Level 2, Run 2Login-0"], "isController": false}, {"data": [0.864244741873805, 500, 1500, "Level 2, Run 1Login-0"], "isController": false}, {"data": [0.9681933842239185, 500, 1500, "Level 2, Run 3Login-0"], "isController": false}, {"data": [0.7782026768642447, 500, 1500, "Level 2, Run 1Login-1"], "isController": false}, {"data": [0.892328398384926, 500, 1500, "Level 2, Run 2Login-1"], "isController": false}, {"data": [0.9071246819338422, 500, 1500, "Level 2, Run 3Login-1"], "isController": false}, {"data": [0.8519607843137255, 500, 1500, "Level 2, Run 1Update Cart-0"], "isController": false}, {"data": [0.692156862745098, 500, 1500, "Level 2, Run 1Update Cart-1"], "isController": false}, {"data": [0.5372549019607843, 500, 1500, "Level 2, Run 1Logout"], "isController": false}, {"data": [0.27951153324287653, 500, 1500, "Level 2, Run 2Look at Product"], "isController": false}, {"data": [0.6246819338422391, 500, 1500, "Level 2, Run 3Login"], "isController": false}, {"data": [0.9139784946236559, 500, 1500, "Level 2, Run 2Home"], "isController": false}, {"data": [0.629878869448183, 500, 1500, "Level 2, Run 2Login"], "isController": false}, {"data": [0.8796844181459567, 500, 1500, "Level 2, Run 1Logout-0"], "isController": false}, {"data": [0.781718963165075, 500, 1500, "Level 2, Run 2Add Product to Cart"], "isController": false}, {"data": [0.6009615384615384, 500, 1500, "Level 2, Run 2Update Cart"], "isController": false}, {"data": [0.7800261096605744, 500, 1500, "Level 2, Run 3Add Product to Cart"], "isController": false}, {"data": [0.5821917808219178, 500, 1500, "Level 2, Run 1Add Product to Cart"], "isController": false}, {"data": [0.6496551724137931, 500, 1500, "Level 2, Run 2Logout"], "isController": false}, {"data": [0.8204158790170132, 500, 1500, "Level 2, Run 1Home"], "isController": false}, {"data": [0.49523809523809526, 500, 1500, "Level 2, Run 1Login"], "isController": false}, {"data": [0.8096646942800789, 500, 1500, "Level 2, Run 1Logout-1"], "isController": false}, {"data": [0.618455497382199, 500, 1500, "Level 2, Run 3Update Cart"], "isController": false}, {"data": [0.9696551724137931, 500, 1500, "Level 2, Run 2Logout-0"], "isController": false}, {"data": [0.8951724137931034, 500, 1500, "Level 2, Run 2Logout-1"], "isController": false}, {"data": [0.9149214659685864, 500, 1500, "Level 2, Run 3Logout-1"], "isController": false}, {"data": [0.9738219895287958, 500, 1500, "Level 2, Run 3Logout-0"], "isController": false}, {"data": [0.7383241758241759, 500, 1500, "Level 2, Run 2Update Cart-1"], "isController": false}, {"data": [0.9787087912087912, 500, 1500, "Level 2, Run 2Update Cart-0"], "isController": false}, {"data": [0.9685863874345549, 500, 1500, "Level 2, Run 3Update Cart-0"], "isController": false}, {"data": [0.16731898238747553, 500, 1500, "Level 2, Run 1Look at Product"], "isController": false}, {"data": [0.8010471204188482, 500, 1500, "Level 2, Run 3Update Cart-1"], "isController": false}, {"data": [0.68782722513089, 500, 1500, "Level 2, Run 3Logout"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 26301, 75, 0.2851602600661572, 619.5703965628701, 12, 8420, 448.0, 1087.9000000000015, 1461.0, 2342.980000000003, 144.09532940693057, 3406.374126831941, 35.708876566566225], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Level 2, Run 2List Products", 739, 2, 0.2706359945872801, 920.5615696887696, 79, 4644, 806.0, 1433.0, 1898.0, 3040.2000000000025, 4.1193094721821195, 470.57632358597317, 0.7060901955975228], "isController": false}, {"data": ["Level 2, Run 3Look at Product", 781, 15, 1.9206145966709347, 1351.216389244558, 60, 6721, 1256.0, 2112.0, 2402.8999999999996, 3962.919999999998, 4.2876043765406004, 482.81816573841775, 0.6723775394174129], "isController": false}, {"data": ["Level 2, Run 1List Products", 523, 12, 2.294455066921606, 1364.8279158699802, 332, 5307, 1132.0, 2435.2000000000007, 2970.5999999999985, 5015.8399999999965, 2.9218040324247623, 330.81927461012356, 0.4906626573332812], "isController": false}, {"data": ["Level 2, Run 1Update Cart", 510, 0, 0.0, 1076.8176470588242, 263, 8296, 907.0, 1921.0, 2411.45, 3261.8299999999995, 2.906115378478791, 29.688352513932262, 1.2708356185752059], "isController": false}, {"data": ["Level 2, Run 3Home", 786, 0, 0.0, 354.52290076335896, 20, 2135, 320.0, 563.6000000000001, 670.9499999999999, 1018.2099999999999, 4.317258046797759, 38.44214733466989, 0.6324108466988905], "isController": false}, {"data": ["Level 2, Run 3List Products", 786, 5, 0.6361323155216285, 922.6997455470738, 13, 5569, 786.0, 1496.8000000000004, 2050.6, 3620.41, 4.30857274416616, 492.23155122494205, 0.7358251519785997], "isController": false}, {"data": ["Level 2, Run 2Login-0", 743, 0, 0.0, 286.736204576043, 28, 1444, 242.0, 441.80000000000007, 578.1999999999998, 897.6799999999985, 4.13476092956994, 3.242058593054381, 1.1248924398706706], "isController": false}, {"data": ["Level 2, Run 1Login-0", 523, 0, 0.0, 423.74187380497153, 38, 2302, 303.0, 872.6000000000001, 1146.3999999999999, 1534.839999999999, 2.9461469130238847, 2.3103580758506084, 0.8015382069625957], "isController": false}, {"data": ["Level 2, Run 3Login-0", 786, 0, 0.0, 287.15521628498743, 22, 2311, 255.5, 453.30000000000007, 517.9499999999999, 861.43, 4.311077714580328, 3.3804399674886603, 1.1728541281585774], "isController": false}, {"data": ["Level 2, Run 1Login-1", 523, 0, 0.0, 548.0764818355636, 123, 3287, 431.0, 995.4000000000001, 1332.799999999996, 1989.2799999999984, 2.925497698198274, 26.049500011886582, 0.4285397018845128], "isController": false}, {"data": ["Level 2, Run 2Login-1", 743, 4, 0.5383580080753702, 374.67967698519465, 73, 2292, 317.0, 625.0, 733.5999999999999, 938.56, 4.134945015805173, 36.688800083338904, 0.6024439758080674], "isController": false}, {"data": ["Level 2, Run 3Login-1", 786, 0, 0.0, 369.4707379134861, 29, 2591, 332.0, 586.9000000000002, 708.2499999999999, 1066.6, 4.30793515077773, 38.3591335007728, 0.6310451881022066], "isController": false}, {"data": ["Level 2, Run 1Update Cart-0", 510, 0, 0.0, 417.2980392156863, 19, 2266, 303.0, 1021.9000000000003, 1332.5999999999992, 1535.6799999999998, 2.935488327117005, 1.917814151212184, 0.842210397528434], "isController": false}, {"data": ["Level 2, Run 1Update Cart-1", 510, 0, 0.0, 659.4588235294117, 151, 7710, 576.0, 1058.0, 1211.1499999999999, 2297.89, 2.907407618548121, 27.802085352366404, 0.43724684888321347], "isController": false}, {"data": ["Level 2, Run 1Logout", 510, 3, 0.5882352941176471, 900.9549019607844, 170, 8420, 733.5, 1484.9000000000003, 2100.849999999999, 3734.949999999998, 2.9145688438305433, 29.04678932203414, 1.1374654073538573], "isController": false}, {"data": ["Level 2, Run 2Look at Product", 737, 4, 0.5427408412483039, 1497.2645861601084, 245, 5029, 1435.0, 2210.0000000000005, 2446.8, 3234.1800000000007, 4.118583922434268, 466.75932854717934, 0.6551255710553522], "isController": false}, {"data": ["Level 2, Run 3Login", 786, 0, 0.0, 656.6603053435111, 61, 3394, 603.5, 970.3000000000001, 1159.6, 2005.4899999999998, 4.307415769745062, 41.732077309139285, 1.8028269813564524], "isController": false}, {"data": ["Level 2, Run 2Home", 744, 1, 0.13440860215053763, 368.2876344086018, 46, 1485, 321.0, 606.0, 740.5, 1025.3999999999996, 4.136941665786269, 36.801396956303556, 0.6051828018049077], "isController": false}, {"data": ["Level 2, Run 2Login", 743, 4, 0.5383580080753702, 661.4602960969046, 185, 2626, 604.0, 980.8000000000001, 1093.0, 1557.3599999999942, 4.132852001624217, 39.91079086162733, 1.7265121343427208], "isController": false}, {"data": ["Level 2, Run 1Logout-0", 507, 0, 0.0, 380.77909270216963, 49, 2302, 295.0, 714.0, 938.5999999999999, 1655.1200000000017, 2.9318560325684677, 3.2410752235034233, 0.7215114455148964], "isController": false}, {"data": ["Level 2, Run 2Add Product to Cart", 733, 5, 0.6821282401091405, 508.96043656207405, 95, 1699, 463.0, 816.4000000000001, 939.5999999999995, 1297.1799999999962, 4.134772136261331, 39.34185073888604, 1.0537997209169832], "isController": false}, {"data": ["Level 2, Run 2Update Cart", 728, 3, 0.41208791208791207, 722.71978021978, 165, 2939, 665.0, 1108.5, 1282.0, 1735.6700000000028, 4.1165294490183655, 41.94351067901531, 1.7975137900909255], "isController": false}, {"data": ["Level 2, Run 3Add Product to Cart", 766, 1, 0.13054830287206268, 510.38120104438616, 21, 3112, 457.0, 797.0000000000007, 1026.25, 2191.0000000000123, 4.241816782310628, 40.52339873666126, 1.0869039011839432], "isController": false}, {"data": ["Level 2, Run 1Add Product to Cart", 511, 1, 0.19569471624266144, 807.0900195694712, 119, 2363, 702.0, 1484.6000000000001, 1721.8, 1926.88, 2.8995704550226122, 27.68752761791208, 0.7426691510670532], "isController": false}, {"data": ["Level 2, Run 2Logout", 725, 3, 0.41379310344827586, 643.3379310344831, 161, 2563, 599.0, 977.4, 1115.0, 1560.2400000000002, 4.122034977598871, 41.151190202065, 1.6157222231698165], "isController": false}, {"data": ["Level 2, Run 1Home", 529, 4, 0.7561436672967864, 505.23251417769376, 81, 4761, 399.0, 845.0, 1145.5, 2078.500000000019, 2.943811596057852, 26.06680998503052, 0.427961740883366], "isController": false}, {"data": ["Level 2, Run 1Login", 525, 2, 0.38095238095238093, 972.3942857142855, 327, 4891, 764.0, 1768.2000000000003, 2245.8999999999996, 3235.0600000000004, 2.9235206985265454, 28.245353777327956, 1.218971091252826], "isController": false}, {"data": ["Level 2, Run 1Logout-1", 507, 0, 0.0, 522.9211045364895, 71, 7414, 409.0, 787.8, 1204.5999999999995, 2514.8, 2.91845592383233, 25.98679796240545, 0.4275081919676264], "isController": false}, {"data": ["Level 2, Run 3Update Cart", 764, 0, 0.0, 685.8350785340305, 44, 5670, 622.0, 1007.5, 1185.0, 1569.4000000000015, 4.26870491739162, 43.60832240315795, 1.8664289353520285], "isController": false}, {"data": ["Level 2, Run 2Logout-0", 725, 0, 0.0, 255.00137931034462, 37, 1403, 210.0, 427.0, 546.1999999999996, 828.9200000000001, 4.128489997665268, 4.563916677106526, 1.015995585362937], "isController": false}, {"data": ["Level 2, Run 2Logout-1", 725, 3, 0.41379310344827586, 388.2827586206898, 59, 1732, 360.0, 617.0, 730.6999999999999, 1028.74, 4.124379920811905, 36.61522717511264, 0.6016572540731807], "isController": false}, {"data": ["Level 2, Run 3Logout-1", 764, 0, 0.0, 355.3219895287959, 13, 2626, 311.0, 576.0, 685.0, 1271.6000000000026, 4.278170690051013, 38.08411103539851, 0.6266851596754415], "isController": false}, {"data": ["Level 2, Run 3Logout-0", 764, 0, 0.0, 245.336387434555, 13, 1395, 205.0, 420.0, 506.25, 807.500000000002, 4.2782904757638205, 4.729516424379536, 1.0528605467700027], "isController": false}, {"data": ["Level 2, Run 2Update Cart-1", 728, 3, 0.41208791208791207, 549.4890109890113, 81, 2442, 504.5, 884.2, 991.55, 1272.71, 4.122286963267479, 39.309000453352475, 0.6173985601723659], "isController": false}, {"data": ["Level 2, Run 2Update Cart-0", 728, 0, 0.0, 173.1895604395604, 17, 1250, 117.0, 338.0, 485.54999999999995, 772.4200000000001, 4.118439066336286, 2.690659897831031, 1.1815253817193352], "isController": false}, {"data": ["Level 2, Run 3Update Cart-0", 764, 0, 0.0, 205.37172774869123, 12, 1034, 140.0, 443.0, 551.5, 942.8000000000002, 4.27874572265439, 2.795391492632605, 1.2273358874897093], "isController": false}, {"data": ["Level 2, Run 1Look at Product", 511, 0, 0.0, 1996.3111545988263, 418, 7539, 1762.0, 3329.4000000000005, 4234.0, 5686.159999999999, 2.8865490204939332, 332.49603677631507, 0.46171412502541975], "isController": false}, {"data": ["Level 2, Run 3Update Cart-1", 764, 0, 0.0, 480.4345549738224, 18, 5217, 454.5, 717.5, 828.25, 1183.6000000000008, 4.272835059618353, 40.8589852576005, 0.6425943351379164], "isController": false}, {"data": ["Level 2, Run 3Logout", 764, 0, 0.0, 600.6884816753932, 33, 4020, 563.0, 898.0, 1032.25, 1608.3000000000004, 4.271783861155842, 42.74957929533738, 1.6770088986178207], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 75, 100.0, 0.2851602600661572], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 26301, 75, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 75, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Level 2, Run 2List Products", 739, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 2, Run 3Look at Product", 781, 15, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 2, Run 1List Products", 523, 12, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 2, Run 3List Products", 786, 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 2, Run 2Login-1", 743, 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 2, Run 1Logout", 510, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 2, Run 2Look at Product", 737, 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 2, Run 2Home", 744, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 2, Run 2Login", 743, 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 2, Run 2Add Product to Cart", 733, 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 2, Run 2Update Cart", 728, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 2, Run 3Add Product to Cart", 766, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 2, Run 1Add Product to Cart", 511, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 2, Run 2Logout", 725, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 2, Run 1Home", 529, 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 2, Run 1Login", 525, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 2, Run 2Logout-1", 725, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 2, Run 2Update Cart-1", 728, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
