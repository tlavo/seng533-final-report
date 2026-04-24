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

    var data = {"OkPercent": 99.79499652536484, "KoPercent": 0.2050034746351633};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.864854065323141, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9608865710560626, 500, 1500, "Level 3, Run 2Home"], "isController": false}, {"data": [0.7819148936170213, 500, 1500, "Level 3, Run 2Update Cart"], "isController": false}, {"data": [0.8458177278401997, 500, 1500, "Level 3, Run 3Login"], "isController": false}, {"data": [0.4358974358974359, 500, 1500, "Level 3, Run 1Look at Product"], "isController": false}, {"data": [0.7861491628614916, 500, 1500, "Level 3, Run 1Logout"], "isController": false}, {"data": [0.9810606060606061, 500, 1500, "Level 3, Run 1Update Cart-0"], "isController": false}, {"data": [0.8354430379746836, 500, 1500, "Level 3, Run 3Update Cart"], "isController": false}, {"data": [0.9657794676806084, 500, 1500, "Level 3, Run 3Update Cart-0"], "isController": false}, {"data": [0.8416666666666667, 500, 1500, "Level 3, Run 1Update Cart-1"], "isController": false}, {"data": [0.941044776119403, 500, 1500, "Level 3, Run 1Home"], "isController": false}, {"data": [0.5942028985507246, 500, 1500, "Level 3, Run 2Look at Product"], "isController": false}, {"data": [0.7861799217731421, 500, 1500, "Level 3, Run 2Login"], "isController": false}, {"data": [0.9486692015209125, 500, 1500, "Level 3, Run 3Update Cart-1"], "isController": false}, {"data": [0.9380825565912118, 500, 1500, "Level 3, Run 2Update Cart-1"], "isController": false}, {"data": [0.9727030625832224, 500, 1500, "Level 3, Run 2Update Cart-0"], "isController": false}, {"data": [0.9760319573901465, 500, 1500, "Level 3, Run 2Logout-0"], "isController": false}, {"data": [0.9733688415446072, 500, 1500, "Level 3, Run 2Logout-1"], "isController": false}, {"data": [0.9606741573033708, 500, 1500, "Level 3, Run 3Login-1"], "isController": false}, {"data": [0.9647979139504563, 500, 1500, "Level 3, Run 2Login-1"], "isController": false}, {"data": [0.9504563233376793, 500, 1500, "Level 3, Run 2Login-0"], "isController": false}, {"data": [0.9650436953807741, 500, 1500, "Level 3, Run 3Login-0"], "isController": false}, {"data": [0.9519817073170732, 500, 1500, "Level 3, Run 1Logout-1"], "isController": false}, {"data": [0.9783715012722646, 500, 1500, "Level 3, Run 3Logout-0"], "isController": false}, {"data": [0.9733231707317073, 500, 1500, "Level 3, Run 1Logout-0"], "isController": false}, {"data": [0.9681933842239185, 500, 1500, "Level 3, Run 3Logout-1"], "isController": false}, {"data": [0.8408788282290279, 500, 1500, "Level 3, Run 2Logout"], "isController": false}, {"data": [0.8598484848484849, 500, 1500, "Level 3, Run 1Add Product to Cart"], "isController": false}, {"data": [0.9443609022556391, 500, 1500, "Level 3, Run 1Login-1"], "isController": false}, {"data": [0.9759398496240601, 500, 1500, "Level 3, Run 1Login-0"], "isController": false}, {"data": [0.921957671957672, 500, 1500, "Level 3, Run 2Add Product to Cart"], "isController": false}, {"data": [0.7267267267267268, 500, 1500, "Level 3, Run 1Login"], "isController": false}, {"data": [0.5958646616541353, 500, 1500, "Level 3, Run 3Look at Product"], "isController": false}, {"data": [0.9663341645885287, 500, 1500, "Level 3, Run 3Home"], "isController": false}, {"data": [0.9238035264483627, 500, 1500, "Level 3, Run 3Add Product to Cart"], "isController": false}, {"data": [0.7022727272727273, 500, 1500, "Level 3, Run 1Update Cart"], "isController": false}, {"data": [0.7030026109660574, 500, 1500, "Level 3, Run 2List Products"], "isController": false}, {"data": [0.7409261576971214, 500, 1500, "Level 3, Run 3List Products"], "isController": false}, {"data": [0.5995475113122172, 500, 1500, "Level 3, Run 1List Products"], "isController": false}, {"data": [0.874841168996188, 500, 1500, "Level 3, Run 3Logout"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 28780, 59, 0.2050034746351633, 390.08603196664467, 2, 5570, 278.0, 750.0, 994.9500000000007, 1620.9700000000048, 159.13740669062759, 3787.7537766536498, 39.47212166505391], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Level 3, Run 2Home", 767, 0, 0.0, 255.54237288135596, 13, 3063, 218.0, 460.20000000000005, 570.3999999999992, 1067.9599999999934, 4.258745141588006, 37.92113105566352, 0.6238396203498057], "isController": false}, {"data": ["Level 3, Run 2Update Cart", 752, 1, 0.13297872340425532, 493.5957446808513, 31, 3428, 451.5, 821.7, 1013.3500000000005, 1570.47, 4.171798200357266, 42.57598613861798, 1.8218407348772314], "isController": false}, {"data": ["Level 3, Run 3Login", 801, 2, 0.24968789013732834, 466.39950062422014, 35, 3556, 391.0, 781.0000000000007, 1150.9, 2070.5800000000004, 4.435486103804772, 42.90837897103367, 1.8541595574065972], "isController": false}, {"data": ["Level 3, Run 1Look at Product", 663, 3, 0.45248868778280543, 1147.6365007541472, 204, 3728, 1122.0, 1663.4, 1896.7999999999997, 2480.6000000000004, 3.672377407401253, 423.9779709283969, 0.5847139367553466], "isController": false}, {"data": ["Level 3, Run 1Logout", 657, 3, 0.45662100456621, 498.80821917808197, 67, 2813, 467.0, 787.6000000000001, 969.9000000000004, 1402.3199999999981, 3.6913637819342298, 36.83215290399926, 1.4452969174022239], "isController": false}, {"data": ["Level 3, Run 1Update Cart-0", 660, 0, 0.0, 154.03030303030292, 12, 1105, 102.0, 297.0, 431.94999999999993, 858.6599999999987, 3.6999456220113127, 2.4172496300054376, 1.0615007343831462], "isController": false}, {"data": ["Level 3, Run 3Update Cart", 790, 3, 0.379746835443038, 464.18227848101293, 2, 2527, 392.0, 796.0999999999998, 1106.3999999999992, 2028.2400000000011, 4.387548249146094, 44.70113624135681, 1.9145408694565549], "isController": false}, {"data": ["Level 3, Run 3Update Cart-0", 789, 0, 0.0, 174.52978453738908, 11, 1089, 107.0, 410.0, 604.5, 832.7000000000004, 4.383308981616769, 2.863704793653924, 1.2575776488741728], "isController": false}, {"data": ["Level 3, Run 1Update Cart-1", 660, 3, 0.45454545454545453, 419.2954545454547, 52, 1161, 402.0, 666.6999999999997, 774.7999999999997, 994.78, 3.698307744032276, 35.255848868443906, 0.5536626730079569], "isController": false}, {"data": ["Level 3, Run 1Home", 670, 4, 0.5970149253731343, 296.0059701492537, 21, 1076, 281.0, 502.9, 607.1499999999995, 878.0599999999995, 3.7047276748686757, 32.84367872200719, 0.5394448092341719], "isController": false}, {"data": ["Level 3, Run 2Look at Product", 759, 3, 0.3952569169960474, 836.1870882740446, 41, 5570, 804.0, 1367.0, 1528.0, 2623.3999999999996, 4.203286205578907, 481.27208464512967, 0.6696294140735326], "isController": false}, {"data": ["Level 3, Run 2Login", 767, 1, 0.1303780964797914, 506.27379400260816, 43, 3366, 465.0, 834.2, 1072.6, 1759.5999999999885, 4.243923222061761, 41.08480553930193, 1.7748107145228489], "isController": false}, {"data": ["Level 3, Run 3Update Cart-1", 789, 2, 0.2534854245880862, 290.192648922687, 15, 1734, 258.0, 489.0, 663.5, 1168.600000000001, 4.3845268989891695, 41.85482914446155, 0.6577202787147612], "isController": false}, {"data": ["Level 3, Run 2Update Cart-1", 751, 0, 0.0, 323.2117177097206, 20, 3353, 299.0, 514.0, 655.9999999999999, 1371.0, 4.19778205070876, 40.14129085990252, 0.6313070662198721], "isController": false}, {"data": ["Level 3, Run 2Update Cart-0", 751, 0, 0.0, 170.50865512649793, 10, 1230, 103.0, 410.4000000000002, 508.79999999999995, 765.9200000000001, 4.205303946602159, 2.7474104885516057, 1.2064799075645074], "isController": false}, {"data": ["Level 3, Run 2Logout-0", 751, 0, 0.0, 180.01731025299614, 12, 1227, 133.0, 364.80000000000007, 474.1999999999998, 827.6000000000004, 4.202621182106123, 4.645866384906379, 1.0342388065339287], "isController": false}, {"data": ["Level 3, Run 2Logout-1", 751, 0, 0.0, 252.30093209054627, 15, 2124, 214.0, 429.0, 506.4, 1232.4, 4.19778205070876, 37.36816646427693, 0.614909480084291], "isController": false}, {"data": ["Level 3, Run 3Login-1", 801, 2, 0.24968789013732834, 244.2833957553059, 14, 2669, 206.0, 421.60000000000014, 608.8999999999997, 1197.4400000000005, 4.43649334249064, 39.439174416221725, 0.6482542904103064], "isController": false}, {"data": ["Level 3, Run 2Login-1", 767, 1, 0.1303780964797914, 261.4067796610171, 14, 2382, 231.0, 455.60000000000014, 529.7999999999997, 1078.0799999999988, 4.244674787074494, 37.76353141412143, 0.6209678702468774], "isController": false}, {"data": ["Level 3, Run 2Login-0", 767, 0, 0.0, 244.80964797913907, 21, 1419, 187.0, 498.60000000000014, 647.9999999999995, 1000.6399999999967, 4.252818115785329, 3.334935677512185, 1.1563713778964353], "isController": false}, {"data": ["Level 3, Run 3Login-0", 801, 0, 0.0, 222.0574282147316, 18, 1628, 179.0, 397.60000000000014, 610.5999999999999, 916.8800000000001, 4.4392717599135425, 3.481127206473245, 1.207081800579156], "isController": false}, {"data": ["Level 3, Run 1Logout-1", 656, 2, 0.3048780487804878, 300.01219512195075, 29, 2010, 280.5, 492.60000000000014, 625.4499999999999, 908.029999999999, 3.6902029611628637, 32.78277595306805, 0.5389090345281491], "isController": false}, {"data": ["Level 3, Run 3Logout-0", 786, 0, 0.0, 171.89694656488555, 11, 1163, 125.0, 331.60000000000014, 461.94999999999993, 831.7999999999997, 4.388805753467492, 4.851687610278516, 1.0800576658923904], "isController": false}, {"data": ["Level 3, Run 1Logout-0", 656, 0, 0.0, 199.39786585365843, 28, 1165, 179.5, 334.8000000000004, 509.64999999999975, 707.4399999999996, 3.687278327684378, 4.07617096380734, 0.9074161509535774], "isController": false}, {"data": ["Level 3, Run 3Logout-1", 786, 0, 0.0, 234.3320610687022, 13, 1621, 203.0, 404.30000000000007, 538.3, 904.5099999999999, 4.384570328842775, 39.030141306166854, 0.6422710442640783], "isController": false}, {"data": ["Level 3, Run 2Logout", 751, 0, 0.0, 432.36484687083896, 29, 3083, 393.0, 744.0000000000003, 940.8, 1735.2400000000002, 4.196398138162637, 41.99483404041618, 1.647414112833379], "isController": false}, {"data": ["Level 3, Run 1Add Product to Cart", 660, 0, 0.0, 407.5651515151515, 29, 2293, 376.5, 639.0, 771.6999999999996, 1041.9899999999993, 3.6843515541264735, 35.23161173633441, 0.9454888673968381], "isController": false}, {"data": ["Level 3, Run 1Login-1", 665, 2, 0.3007518796992481, 315.70375939849583, 25, 1151, 302.0, 503.0, 592.0999999999998, 832.4600000000006, 3.6791351542747126, 32.695504193660824, 0.5373149540246419], "isController": false}, {"data": ["Level 3, Run 1Login-0", 665, 0, 0.0, 232.86917293233088, 34, 886, 200.0, 355.0, 492.59999999999945, 823.0600000000003, 3.683965608934586, 2.8888909999750707, 1.0017025789836687], "isController": false}, {"data": ["Level 3, Run 2Add Product to Cart", 756, 4, 0.5291005291005291, 322.925925925926, 23, 1432, 289.5, 574.9000000000002, 717.0, 1119.059999999998, 4.190315714792479, 39.91510852003148, 1.069636241727452], "isController": false}, {"data": ["Level 3, Run 1Login", 666, 3, 0.45045045045045046, 548.0720720720724, 71, 1961, 511.5, 801.6000000000001, 933.1999999999998, 1319.1000000000029, 3.683893200285419, 35.58740525798315, 1.537380876736159], "isController": false}, {"data": ["Level 3, Run 3Look at Product", 798, 4, 0.5012531328320802, 785.753132832081, 58, 3379, 727.5, 1287.0000000000002, 1528.1499999999999, 2864.5599999999995, 4.422155107921642, 506.06636046729096, 0.7037657414590894], "isController": false}, {"data": ["Level 3, Run 3Home", 802, 1, 0.12468827930174564, 230.0124688279302, 16, 1627, 192.0, 420.70000000000005, 579.6999999999998, 986.3100000000006, 4.439868021878253, 39.49889751523783, 0.6495603554939215], "isController": false}, {"data": ["Level 3, Run 3Add Product to Cart", 794, 3, 0.3778337531486146, 310.7858942065491, 18, 1284, 271.0, 582.5, 745.0, 1074.199999999998, 4.4048953143896945, 42.00561798385889, 1.1261452589124237], "isController": false}, {"data": ["Level 3, Run 1Update Cart", 660, 3, 0.45454545454545453, 573.3712121212128, 131, 1899, 529.5, 889.0, 1013.8499999999998, 1541.4599999999998, 3.6918946131901325, 37.60670244063601, 1.6118935119147506], "isController": false}, {"data": ["Level 3, Run 2List Products", 766, 7, 0.9138381201044387, 615.3603133159274, 44, 4986, 523.0, 1046.6000000000001, 1409.5499999999997, 2531.3, 4.2395629818628615, 485.1524438282119, 0.722015978614006], "isController": false}, {"data": ["Level 3, Run 3List Products", 799, 1, 0.1251564455569462, 591.1138923654564, 39, 4799, 481.0, 1060.0, 1460.0, 2417.0, 4.425808166973169, 511.34374614853596, 0.759733731416037], "isController": false}, {"data": ["Level 3, Run 1List Products", 663, 0, 0.0, 743.1146304675723, 61, 2668, 667.0, 1153.0, 1365.7999999999995, 2299.0800000000004, 3.6870408577514056, 429.9350525302527, 0.6337101474260228], "isController": false}, {"data": ["Level 3, Run 3Logout", 787, 1, 0.12706480304955528, 405.8170266836085, 30, 2437, 338.0, 692.2, 901.5999999999995, 1731.0, 4.3810085783154, 43.80016462704368, 1.717702760814745], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 58, 98.30508474576271, 0.20152883947185546], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.impl.execchain.RequestAbortedException/Non HTTP response message: Request aborted", 1, 1.694915254237288, 0.0034746351633078527], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 28780, 59, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 58, "Non HTTP response code: org.apache.http.impl.execchain.RequestAbortedException/Non HTTP response message: Request aborted", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["Level 3, Run 2Update Cart", 752, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 3, Run 3Login", 801, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 3, Run 1Look at Product", 663, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 3, Run 1Logout", 657, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 3, Run 3Update Cart", 790, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "Non HTTP response code: org.apache.http.impl.execchain.RequestAbortedException/Non HTTP response message: Request aborted", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 3, Run 1Update Cart-1", 660, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 3, Run 1Home", 670, 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 3, Run 2Look at Product", 759, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 3, Run 2Login", 767, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 3, Run 3Update Cart-1", 789, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 3, Run 3Login-1", 801, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 3, Run 2Login-1", 767, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 3, Run 1Logout-1", 656, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 3, Run 1Login-1", 665, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 3, Run 2Add Product to Cart", 756, 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 3, Run 1Login", 666, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 3, Run 3Look at Product", 798, 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 3, Run 3Home", 802, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 3, Run 3Add Product to Cart", 794, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 3, Run 1Update Cart", 660, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 3, Run 2List Products", 766, 7, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Level 3, Run 3List Products", 799, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Level 3, Run 3Logout", 787, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
