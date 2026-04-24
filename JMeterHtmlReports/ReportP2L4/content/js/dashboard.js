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

    var data = {"OkPercent": 98.74233611067442, "KoPercent": 1.2576638893255778};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.668212545197296, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6863207547169812, 500, 1500, "Level 4, Run 3Add Product to Cart"], "isController": false}, {"data": [0.6207729468599034, 500, 1500, "Level 4, Run 3Logout"], "isController": false}, {"data": [0.7205128205128205, 500, 1500, "Level 4, Run 2Add Product to Cart"], "isController": false}, {"data": [0.35119047619047616, 500, 1500, "Level 4, Run 1Logout"], "isController": false}, {"data": [0.8391959798994975, 500, 1500, "Level 4, Run 2Login-1"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "Level 4, Run 1Login-1"], "isController": false}, {"data": [0.8519417475728155, 500, 1500, "Level 4, Run 3Login-1"], "isController": false}, {"data": [0.8222222222222222, 500, 1500, "Level 4, Run 1Login-0"], "isController": false}, {"data": [0.9221105527638191, 500, 1500, "Level 4, Run 2Login-0"], "isController": false}, {"data": [0.9441747572815534, 500, 1500, "Level 4, Run 3Login-0"], "isController": false}, {"data": [0.39540816326530615, 500, 1500, "Level 4, Run 2List Products"], "isController": false}, {"data": [0.5979899497487438, 500, 1500, "Level 4, Run 2Login"], "isController": false}, {"data": [0.8492462311557789, 500, 1500, "Level 4, Run 3Logout-1"], "isController": false}, {"data": [0.43896713615023475, 500, 1500, "Level 4, Run 3List Products"], "isController": false}, {"data": [0.5760869565217391, 500, 1500, "Level 4, Run 1Home"], "isController": false}, {"data": [0.29411764705882354, 500, 1500, "Level 4, Run 1Update Cart"], "isController": false}, {"data": [0.20555555555555555, 500, 1500, "Level 4, Run 1List Products"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "Level 4, Run 1Look at Product"], "isController": false}, {"data": [0.22535211267605634, 500, 1500, "Level 4, Run 3Look at Product"], "isController": false}, {"data": [0.3626373626373626, 500, 1500, "Level 4, Run 1Login"], "isController": false}, {"data": [0.8186046511627907, 500, 1500, "Level 4, Run 3Home"], "isController": false}, {"data": [0.6484375, 500, 1500, "Level 4, Run 2Logout"], "isController": false}, {"data": [0.7487437185929648, 500, 1500, "Level 4, Run 3Update Cart-1"], "isController": false}, {"data": [0.9798994974874372, 500, 1500, "Level 4, Run 3Update Cart-0"], "isController": false}, {"data": [0.5208333333333334, 500, 1500, "Level 4, Run 2Update Cart"], "isController": false}, {"data": [0.9472361809045227, 500, 1500, "Level 4, Run 3Logout-0"], "isController": false}, {"data": [0.20256410256410257, 500, 1500, "Level 4, Run 2Look at Product"], "isController": false}, {"data": [0.8619791666666666, 500, 1500, "Level 4, Run 2Logout-1"], "isController": false}, {"data": [0.9140625, 500, 1500, "Level 4, Run 2Logout-0"], "isController": false}, {"data": [0.8095238095238095, 500, 1500, "Level 4, Run 1Logout-0"], "isController": false}, {"data": [0.5654761904761905, 500, 1500, "Level 4, Run 1Logout-1"], "isController": false}, {"data": [0.84, 500, 1500, "Level 4, Run 2Home"], "isController": false}, {"data": [0.616822429906542, 500, 1500, "Level 4, Run 3Login"], "isController": false}, {"data": [0.9823529411764705, 500, 1500, "Level 4, Run 1Update Cart-0"], "isController": false}, {"data": [0.4235294117647059, 500, 1500, "Level 4, Run 1Update Cart-1"], "isController": false}, {"data": [0.9401041666666666, 500, 1500, "Level 4, Run 2Update Cart-0"], "isController": false}, {"data": [0.6901041666666666, 500, 1500, "Level 4, Run 2Update Cart-1"], "isController": false}, {"data": [0.6095238095238096, 500, 1500, "Level 4, Run 3Update Cart"], "isController": false}, {"data": [0.3953488372093023, 500, 1500, "Level 4, Run 1Add Product to Cart"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 6361, 80, 1.2576638893255778, 879.1180631976106, 0, 25578, 513.0, 1660.8000000000002, 2335.7999999999993, 6178.040000000001, 35.132582556874354, 829.6917814987131, 8.613050724357523], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Level 4, Run 3Add Product to Cart", 212, 9, 4.245283018867925, 767.8066037735852, 0, 20636, 529.5, 1023.7, 1223.5, 17795.470000000078, 1.1845891654792837, 10.972084712793004, 0.29104525500796247], "isController": false}, {"data": ["Level 4, Run 3Logout", 207, 8, 3.864734299516908, 687.8743961352658, 0, 3437, 582.0, 1106.0000000000002, 1504.9999999999986, 3326.559999999995, 1.1674139243718806, 11.34513216239461, 0.44058904703493784], "isController": false}, {"data": ["Level 4, Run 2Add Product to Cart", 195, 3, 1.5384615384615385, 615.2153846153844, 74, 6237, 495.0, 1036.2, 1379.0, 3450.1199999999767, 1.1140819964349375, 10.53374905195907, 0.2815333410462087], "isController": false}, {"data": ["Level 4, Run 1Logout", 84, 0, 0.0, 1287.7261904761904, 407, 2297, 1233.5, 2000.5, 2107.75, 2297.0, 0.7901569025849419, 7.909285401851224, 0.3101983152726041], "isController": false}, {"data": ["Level 4, Run 2Login-1", 199, 3, 1.5075376884422111, 472.8140703517588, 19, 6238, 352.0, 706.0, 849.0, 3453.0, 1.1055187049320578, 9.746398210337434, 0.15949989167027764], "isController": false}, {"data": ["Level 4, Run 1Login-1", 90, 0, 0.0, 1010.2666666666669, 204, 3583, 753.5, 2749.400000000001, 3256.85, 3583.0, 0.5070908199658559, 4.515287203563158, 0.07428088183093592], "isController": false}, {"data": ["Level 4, Run 3Login-1", 206, 0, 0.0, 419.27669902912623, 42, 2497, 362.5, 734.2, 818.65, 1898.3800000000006, 1.2985784978094368, 11.562928459986763, 0.1902214596400542], "isController": false}, {"data": ["Level 4, Run 1Login-0", 90, 0, 0.0, 500.9666666666667, 31, 3074, 395.0, 1014.9000000000001, 1189.0, 3074.0, 0.5019940318487325, 0.3936371820704465, 0.13628353599018322], "isController": false}, {"data": ["Level 4, Run 2Login-0", 199, 0, 0.0, 361.9899497487438, 50, 6345, 259.0, 583.0, 904.0, 2342.0, 1.1045001443065516, 0.8660290149829052, 0.29985453136447393], "isController": false}, {"data": ["Level 4, Run 3Login-0", 206, 0, 0.0, 287.60679611650494, 24, 1883, 222.0, 515.7, 594.1499999999997, 1496.6800000000032, 1.2989715424341215, 1.0186517298076136, 0.3526504773405134], "isController": false}, {"data": ["Level 4, Run 2List Products", 196, 1, 0.5102040816326531, 1420.928571428572, 253, 19571, 917.5, 2175.100000000001, 3421.9499999999803, 12263.990000000009, 1.0895002195676464, 125.61940137243676, 0.1863024530430964], "isController": false}, {"data": ["Level 4, Run 2Login", 199, 3, 1.5075376884422111, 834.8442211055277, 199, 9297, 637.0, 1206.0, 1565.0, 8142.0, 1.1043836817599102, 10.602329394572982, 0.459159048592882], "isController": false}, {"data": ["Level 4, Run 3Logout-1", 199, 0, 0.0, 432.62311557788934, 44, 2527, 343.0, 746.0, 900.0, 2272.0, 1.293383595476407, 11.516671507376834, 0.1894604876186143], "isController": false}, {"data": ["Level 4, Run 3List Products", 213, 8, 3.755868544600939, 1228.2629107981215, 0, 19276, 942.0, 1994.9999999999998, 2555.3, 7363.41999999999, 1.1801665530825618, 131.23521112445493, 0.19522268025243375], "isController": false}, {"data": ["Level 4, Run 1Home", 92, 1, 1.0869565217391304, 812.1086956521743, 73, 2847, 736.0, 1429.1000000000001, 1667.9499999999996, 2847.0, 0.5086020078722746, 4.493786598959025, 0.07369244021162266], "isController": false}, {"data": ["Level 4, Run 1Update Cart", 85, 1, 1.1764705882352942, 1416.9529411764706, 432, 4907, 1307.0, 2052.4000000000005, 2291.9, 4907.0, 0.7839086608073337, 7.948351082716197, 0.34143797380361707], "isController": false}, {"data": ["Level 4, Run 1List Products", 90, 2, 2.2222222222222223, 3546.933333333333, 478, 24721, 1687.0, 3529.5000000000045, 23156.0, 24721.0, 0.5122455135830435, 57.4394356388413, 0.08608570436603925], "isController": false}, {"data": ["Level 4, Run 1Look at Product", 88, 2, 2.272727272727273, 5167.43181818182, 1313, 25578, 3281.5, 8984.100000000157, 25536.0, 25578.0, 0.5826849859294819, 64.89716106604867, 0.09109625889753352], "isController": false}, {"data": ["Level 4, Run 3Look at Product", 213, 8, 3.755868544600939, 1696.3192488262903, 0, 7208, 1570.0, 2756.8, 3511.4999999999995, 6077.899999999975, 1.1791538878862697, 130.82924632932992, 0.1814748281092572], "isController": false}, {"data": ["Level 4, Run 1Login", 91, 1, 1.098901098901099, 1495.8681318681313, 107, 6407, 1134.0, 3602.9999999999995, 4264.799999999997, 6407.0, 0.5040853067442183, 4.844431605733278, 0.20837660988782716], "isController": false}, {"data": ["Level 4, Run 3Home", 215, 8, 3.7209302325581395, 425.4604651162789, 0, 3698, 338.0, 703.4, 840.1999999999998, 2432.120000000001, 1.188666205943331, 10.299423375950242, 0.16764210435383553], "isController": false}, {"data": ["Level 4, Run 2Logout", 192, 0, 0.0, 889.3072916666669, 88, 9116, 600.0, 1275.2000000000007, 2573.299999999996, 9114.14, 1.1067941017097664, 11.078423045384323, 0.4345031532102794], "isController": false}, {"data": ["Level 4, Run 3Update Cart-1", 199, 0, 0.0, 562.8140703517588, 82, 2762, 500.0, 958.0, 1227.0, 1360.0, 1.2837467341870143, 12.275828145663324, 0.19306347369609395], "isController": false}, {"data": ["Level 4, Run 3Update Cart-0", 199, 0, 0.0, 163.53768844221116, 15, 895, 110.0, 338.0, 494.0, 651.0, 1.2873842809732365, 0.8410743007530228, 0.36930421408100816], "isController": false}, {"data": ["Level 4, Run 2Update Cart", 192, 0, 0.0, 933.333333333333, 253, 5116, 690.5, 1668.1000000000001, 2432.6499999999983, 4110.669999999993, 1.103511696074487, 11.27327719983907, 0.4825843080062072], "isController": false}, {"data": ["Level 4, Run 3Logout-0", 199, 0, 0.0, 282.8592964824122, 19, 2512, 209.0, 494.0, 597.0, 2365.0, 1.2861944157187177, 1.421847733001551, 0.31652440699327816], "isController": false}, {"data": ["Level 4, Run 2Look at Product", 195, 0, 0.0, 2125.5384615384614, 450, 12453, 1646.0, 3233.600000000001, 5431.599999999991, 10683.719999999985, 1.096922990380829, 126.51344939212184, 0.1754758167154188], "isController": false}, {"data": ["Level 4, Run 2Logout-1", 192, 0, 0.0, 456.1875000000001, 61, 2933, 334.5, 783.6000000000006, 1281.449999999999, 2931.14, 1.109377708441671, 9.877901192436587, 0.1625065002600104], "isController": false}, {"data": ["Level 4, Run 2Logout-0", 192, 0, 0.0, 433.03645833333354, 20, 6183, 204.0, 530.7, 1690.3999999999999, 6183.0, 1.1086282457690242, 1.225553881064976, 0.2728264823572208], "isController": false}, {"data": ["Level 4, Run 1Logout-0", 84, 0, 0.0, 481.02380952380946, 86, 1630, 429.0, 802.5, 1010.0, 1630.0, 0.7960953418945174, 0.8800585224849548, 0.1959140880443539], "isController": false}, {"data": ["Level 4, Run 1Logout-1", 84, 0, 0.0, 806.7261904761906, 210, 1693, 767.0, 1302.0, 1514.0, 1693.0, 0.7939958787832958, 7.06997502221298, 0.11630799005614685], "isController": false}, {"data": ["Level 4, Run 2Home", 200, 1, 0.5, 473.68499999999995, 74, 3460, 336.5, 906.3000000000001, 1287.699999999999, 3436.7600000000057, 1.1094715586965929, 9.843986846174543, 0.16170764661666648], "isController": false}, {"data": ["Level 4, Run 3Login", 214, 8, 3.7383177570093458, 770.6542056074769, 0, 19284, 604.5, 1060.0, 1415.0, 2870.8499999999985, 1.183431952662722, 11.146783451653485, 0.476146449704142], "isController": false}, {"data": ["Level 4, Run 1Update Cart-0", 85, 0, 0.0, 198.29411764705893, 46, 829, 187.0, 372.80000000000007, 464.90000000000026, 829.0, 0.7863962697061654, 0.5137686566732662, 0.2256462182434683], "isController": false}, {"data": ["Level 4, Run 1Update Cart-1", 85, 1, 1.1764705882352942, 1218.5999999999992, 300, 4598, 1102.0, 1909.2, 2155.0, 4598.0, 0.7899554836850958, 7.493568179547588, 0.11740422951459559], "isController": false}, {"data": ["Level 4, Run 2Update Cart-0", 192, 0, 0.0, 261.40624999999994, 12, 3407, 126.5, 482.0000000000007, 994.0499999999997, 2722.519999999995, 1.1067685816068895, 0.7230743956005948, 0.31756098035485764], "isController": false}, {"data": ["Level 4, Run 2Update Cart-1", 192, 0, 0.0, 671.8749999999998, 169, 3123, 513.0, 1309.1000000000004, 1609.8999999999999, 2840.279999999998, 1.1046227310646377, 10.562954865805597, 0.16612490291401777], "isController": false}, {"data": ["Level 4, Run 3Update Cart", 210, 11, 5.238095238095238, 1086.7190476190478, 1, 22168, 646.5, 1283.7000000000003, 1469.0499999999997, 21456.109999999986, 1.1762992505293346, 11.542015194915585, 0.48740055720175207], "isController": false}, {"data": ["Level 4, Run 1Add Product to Cart", 86, 1, 1.1627906976744187, 2662.5930232558135, 330, 17848, 1035.5, 7688.099999999962, 17796.75, 17848.0, 0.6855266199552017, 6.499697528816032, 0.17390380507130274], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.NoRouteToHostException/Non HTTP response message: No route to host: connect", 52, 65.0, 0.8174815280616256], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 21, 26.25, 0.3301367709479642], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 7, 8.75, 0.11004559031598805], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 6361, 80, "Non HTTP response code: java.net.NoRouteToHostException/Non HTTP response message: No route to host: connect", 52, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 21, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 7, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Level 4, Run 3Add Product to Cart", 212, 9, "Non HTTP response code: java.net.NoRouteToHostException/Non HTTP response message: No route to host: connect", 7, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["Level 4, Run 3Logout", 207, 8, "Non HTTP response code: java.net.NoRouteToHostException/Non HTTP response message: No route to host: connect", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 4, Run 2Add Product to Cart", 195, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 4, Run 2Login-1", 199, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 4, Run 2List Products", 196, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 4, Run 2Login", 199, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 4, Run 3List Products", 213, 8, "Non HTTP response code: java.net.NoRouteToHostException/Non HTTP response message: No route to host: connect", 7, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Level 4, Run 1Home", 92, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 4, Run 1Update Cart", 85, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 4, Run 1List Products", 90, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 4, Run 1Look at Product", 88, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 4, Run 3Look at Product", 213, 8, "Non HTTP response code: java.net.NoRouteToHostException/Non HTTP response message: No route to host: connect", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 4, Run 1Login", 91, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 4, Run 3Home", 215, 8, "Non HTTP response code: java.net.NoRouteToHostException/Non HTTP response message: No route to host: connect", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 4, Run 2Home", 200, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 4, Run 3Login", 214, 8, "Non HTTP response code: java.net.NoRouteToHostException/Non HTTP response message: No route to host: connect", 7, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 4, Run 1Update Cart-1", 85, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 4, Run 3Update Cart", 210, 11, "Non HTTP response code: java.net.NoRouteToHostException/Non HTTP response message: No route to host: connect", 7, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", ""], "isController": false}, {"data": ["Level 4, Run 1Add Product to Cart", 86, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
