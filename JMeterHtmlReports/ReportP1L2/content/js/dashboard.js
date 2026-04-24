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

    var data = {"OkPercent": 99.13286512827862, "KoPercent": 0.8671348717213703};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7660885767521858, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5662544169611308, 500, 1500, "Level 2, Run 2List Products"], "isController": false}, {"data": [0.5184824902723736, 500, 1500, "Level 2, Run 1List Products"], "isController": false}, {"data": [0.6340508806262231, 500, 1500, "Level 2, Run 1Update Cart"], "isController": false}, {"data": [0.916077738515901, 500, 1500, "Level 2, Run 2Login-0"], "isController": false}, {"data": [0.8961165048543689, 500, 1500, "Level 2, Run 1Login-0"], "isController": false}, {"data": [0.841747572815534, 500, 1500, "Level 2, Run 1Login-1"], "isController": false}, {"data": [0.8948763250883393, 500, 1500, "Level 2, Run 2Login-1"], "isController": false}, {"data": [0.9158512720156555, 500, 1500, "Level 2, Run 1Update Cart-0"], "isController": false}, {"data": [0.7710371819960861, 500, 1500, "Level 2, Run 1Update Cart-1"], "isController": false}, {"data": [0.706286836935167, 500, 1500, "Level 2, Run 1Logout"], "isController": false}, {"data": [0.4247787610619469, 500, 1500, "Level 2, Run 2Look at Product"], "isController": false}, {"data": [0.8767605633802817, 500, 1500, "Level 2, Run 2Home"], "isController": false}, {"data": [0.7054673721340388, 500, 1500, "Level 2, Run 2Login"], "isController": false}, {"data": [0.9340551181102362, 500, 1500, "Level 2, Run 1Logout-0"], "isController": false}, {"data": [0.7950089126559715, 500, 1500, "Level 2, Run 2Add Product to Cart"], "isController": false}, {"data": [0.6675627240143369, 500, 1500, "Level 2, Run 2Update Cart"], "isController": false}, {"data": [0.7710371819960861, 500, 1500, "Level 2, Run 1Add Product to Cart"], "isController": false}, {"data": [0.7481949458483754, 500, 1500, "Level 2, Run 2Logout"], "isController": false}, {"data": [0.861271676300578, 500, 1500, "Level 2, Run 1Home"], "isController": false}, {"data": [0.6537717601547389, 500, 1500, "Level 2, Run 1Login"], "isController": false}, {"data": [0.8799212598425197, 500, 1500, "Level 2, Run 1Logout-1"], "isController": false}, {"data": [0.9196750902527075, 500, 1500, "Level 2, Run 2Logout-0"], "isController": false}, {"data": [0.9052346570397112, 500, 1500, "Level 2, Run 2Logout-1"], "isController": false}, {"data": [0.7872531418312387, 500, 1500, "Level 2, Run 2Update Cart-1"], "isController": false}, {"data": [0.9649910233393177, 500, 1500, "Level 2, Run 2Update Cart-0"], "isController": false}, {"data": [0.349609375, 500, 1500, "Level 2, Run 1Look at Product"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 13954, 121, 0.8671348717213703, 761.8323061487741, 0, 34170, 384.0, 1287.5, 1931.0, 6715.050000000254, 46.4410401142222, 1062.5246588799687, 11.493498428071968], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Level 2, Run 2List Products", 566, 15, 2.65017667844523, 1184.2667844522969, 0, 21347, 680.5, 2013.6000000000006, 3609.599999999999, 11857.62, 2.121176915898708, 240.1872766920227, 0.3549153403064838], "isController": false}, {"data": ["Level 2, Run 1List Products", 514, 14, 2.7237354085603114, 1241.3190661478593, 0, 27014, 736.5, 2172.5, 3193.5, 6997.800000000001, 1.948992514958707, 218.62319639986197, 0.3258590355141321], "isController": false}, {"data": ["Level 2, Run 1Update Cart", 511, 0, 0.0, 1171.1252446183955, 90, 23413, 617.0, 1621.2, 2779.5999999999995, 22894.28, 1.959528639412218, 20.01764947876922, 0.8576120893042715], "isController": false}, {"data": ["Level 2, Run 2Login-0", 566, 0, 0.0, 333.45229681978833, 21, 4043, 208.0, 620.5, 991.2499999999994, 2444.5500000000015, 2.1022058304641567, 1.6348184572557671, 0.5715357593197173], "isController": false}, {"data": ["Level 2, Run 1Login-0", 515, 0, 0.0, 364.0194174757282, 28, 5340, 222.0, 734.0000000000005, 1241.0, 1993.239999999999, 1.9342432414160913, 1.5108744551725044, 0.525883384615818], "isController": false}, {"data": ["Level 2, Run 1Login-1", 515, 1, 0.1941747572815534, 573.1378640776697, 22, 22763, 303.0, 814.4000000000002, 1122.9999999999995, 5242.479999999999, 1.9427657439472472, 17.28783742587311, 0.28408749306828723], "isController": false}, {"data": ["Level 2, Run 2Login-1", 566, 0, 0.0, 536.4045936395761, 20, 15210, 289.0, 698.2, 906.0, 15196.0, 2.1127601755905276, 18.838058892256697, 0.3096139395045092], "isController": false}, {"data": ["Level 2, Run 1Update Cart-0", 511, 0, 0.0, 285.34442270058696, 10, 4454, 153.0, 662.6, 898.5999999999993, 1612.6399999999999, 1.9625540086413829, 1.2821763982237158, 0.5637864558329333], "isController": false}, {"data": ["Level 2, Run 1Update Cart-1", 511, 0, 0.0, 885.7279843444214, 50, 22790, 418.0, 1058.8, 1542.799999999998, 21897.079999999998, 1.9648480607218797, 18.788315107941674, 0.29549472788200143], "isController": false}, {"data": ["Level 2, Run 1Logout", 509, 2, 0.3929273084479371, 675.6522593320238, 72, 4956, 510.0, 1191.0, 1816.5, 3737.699999999995, 2.143961316030007, 21.40466585373045, 0.8394017258046172], "isController": false}, {"data": ["Level 2, Run 2Look at Product", 565, 18, 3.185840707964602, 1536.2141592920364, 0, 11908, 979.0, 2818.6000000000004, 5470.999999999996, 11880.4, 2.122193258562017, 215.93679543888086, 0.32859955903453353], "isController": false}, {"data": ["Level 2, Run 2Home", 568, 14, 2.464788732394366, 1147.87852112676, 16, 29979, 259.0, 782.0000000000002, 1399.2999999999997, 29734.219999999998, 1.8944005122885892, 16.771524781877122, 0.2775000750422738], "isController": false}, {"data": ["Level 2, Run 2Login", 567, 1, 0.1763668430335097, 868.8941798941809, 51, 16877, 511.0, 1333.0, 1822.0000000000007, 16818.320000000003, 2.098818442950635, 20.31960465196445, 0.8766368389369689], "isController": false}, {"data": ["Level 2, Run 1Logout-0", 508, 0, 0.0, 283.7027559055121, 14, 4456, 199.0, 551.0, 812.9999999999991, 1461.2299999999982, 2.1410117544916996, 2.366821587973246, 0.5268896114569417], "isController": false}, {"data": ["Level 2, Run 2Add Product to Cart", 561, 10, 1.7825311942959001, 587.1479500891268, 29, 17761, 372.0, 1082.8000000000002, 1388.9999999999998, 4548.419999999997, 2.1119125419747324, 20.048423435876536, 0.5398820542961044], "isController": false}, {"data": ["Level 2, Run 2Update Cart", 558, 4, 0.7168458781362007, 898.6845878136198, 56, 16159, 577.5, 1290.6000000000001, 1834.2999999999997, 15634.549999999996, 2.1138685688958256, 21.491711121913013, 0.9218208984130832], "isController": false}, {"data": ["Level 2, Run 1Add Product to Cart", 511, 8, 1.5655577299412915, 656.1585127201563, 31, 25117, 428.0, 1224.6000000000001, 1531.7999999999997, 3827.16, 1.9528040508264066, 18.594735239323587, 0.5018674763542562], "isController": false}, {"data": ["Level 2, Run 2Logout", 554, 1, 0.18050541516245489, 638.9837545126356, 48, 6149, 454.5, 1223.5, 1650.75, 3878.4500000000226, 2.235412320592021, 22.348224323777686, 0.876982907064952], "isController": false}, {"data": ["Level 2, Run 1Home", 519, 12, 2.3121387283236996, 1306.3795761079004, 26, 34170, 281.0, 739.0, 1201.0, 33588.0, 1.7304845356699876, 15.326208656132051, 0.25348894565478336], "isController": false}, {"data": ["Level 2, Run 1Login", 517, 3, 0.5802707930367504, 933.9303675048357, 52, 24014, 563.0, 1562.3999999999996, 2516.9999999999964, 5550.5400000000045, 1.940683405843071, 18.731919731673305, 0.8082783918791596], "isController": false}, {"data": ["Level 2, Run 1Logout-1", 508, 1, 0.1968503937007874, 393.0059055118105, 21, 3839, 301.0, 690.4000000000001, 1001.7499999999998, 2689.309999999992, 2.1525241311514307, 19.141973141382277, 0.31469046077999335], "isController": false}, {"data": ["Level 2, Run 2Logout-0", 554, 0, 0.0, 307.90252707581254, 15, 5424, 189.0, 689.0, 942.5, 1421.0, 2.238076385466239, 2.4741235042458816, 0.5507766104858323], "isController": false}, {"data": ["Level 2, Run 2Logout-1", 554, 1, 0.18050541516245489, 331.05054151624586, 24, 4886, 262.0, 630.5, 727.5, 1392.0500000000177, 2.2412000534004344, 19.928509757462912, 0.3277081883700327], "isController": false}, {"data": ["Level 2, Run 2Update Cart-1", 557, 3, 0.5385996409335727, 691.7235188509873, 28, 15978, 403.0, 931.5999999999999, 1212.0000000000005, 15418.379999999985, 2.1115281094810268, 20.117598427015807, 0.3158436872133136], "isController": false}, {"data": ["Level 2, Run 2Update Cart-0", 557, 0, 0.0, 208.32136445242367, 12, 5311, 115.0, 405.59999999999997, 556.5000000000001, 1238.0399999999995, 2.1155621052311737, 1.381709438037199, 0.607768625587287], "isController": false}, {"data": ["Level 2, Run 1Look at Product", 512, 13, 2.5390625, 1784.8339843750005, 0, 15833, 1200.5, 3218.6, 5478.049999999993, 11292.68, 1.9459245802199807, 213.6997703170014, 0.303341808351133], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 74: http://172.20.10.4:8080/tools.descartes.teastore.webui/category?category=${category}&amp;page=1", 26, 21.487603305785125, 0.18632650136161674], "isController": false}, {"data": ["500", 41, 33.88429752066116, 0.29382255983947253], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 67: http://172.20.10.4:8080/tools.descartes.teastore.webui/product?id=${product_id}", 26, 21.487603305785125, 0.18632650136161674], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 28, 23.140495867768596, 0.20065930915866417], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 13954, 121, "500", 41, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 28, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 74: http://172.20.10.4:8080/tools.descartes.teastore.webui/category?category=${category}&amp;page=1", 26, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 67: http://172.20.10.4:8080/tools.descartes.teastore.webui/product?id=${product_id}", 26, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Level 2, Run 2List Products", 566, 15, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 74: http://172.20.10.4:8080/tools.descartes.teastore.webui/category?category=${category}&amp;page=1", 14, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Level 2, Run 1List Products", 514, 14, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 74: http://172.20.10.4:8080/tools.descartes.teastore.webui/category?category=${category}&amp;page=1", 12, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 2, Run 1Login-1", 515, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 2, Run 1Logout", 509, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 2, Run 2Look at Product", 565, 18, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 67: http://172.20.10.4:8080/tools.descartes.teastore.webui/product?id=${product_id}", 14, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, "", "", "", "", "", ""], "isController": false}, {"data": ["Level 2, Run 2Home", 568, 14, "500", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 2, Run 2Login", 567, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 2, Run 2Add Product to Cart", 561, 10, "500", 7, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["Level 2, Run 2Update Cart", 558, 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 2, Run 1Add Product to Cart", 511, 8, "500", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 2, Run 2Logout", 554, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 2, Run 1Home", 519, 12, "500", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 2, Run 1Login", 517, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 2, Run 1Logout-1", 508, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 2, Run 2Logout-1", 554, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 2, Run 2Update Cart-1", 557, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 2, Run 1Look at Product", 512, 13, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 67: http://172.20.10.4:8080/tools.descartes.teastore.webui/product?id=${product_id}", 12, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
