require([
    'underscore',
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/searchmanager',
    'splunkjs/mvc/savedsearchmanager',
    'splunkjs/mvc/postprocessmanager',
    'splunkjs/mvc/singleview',
    'splunkjs/mvc/tableview',
    'splunkjs/mvc/chartview',
    'splunkjs/mvc/simplexml/ready!'
], function(_, $, mvc, SearchManager, SavedSearchManager, PostProcessManager, SingleView, TableView,ChartView) {

    var comment = "###################################";
    // Create search managers
    new SearchManager({
        id: "basesearchJS",
        app: "search",
        earliest_time: "-7d@h",
        latest_time: "now",
        preview: true,
        cache: false,
        search: "index=\"_internal\"" //escape special charecters with \
    });

    var single_pnl2_post_srch = new PostProcessManager({
        id: "singlepanel1_search",
        managerid: "basesearchxml",
        search: "stats count by sourcetype,source" 
    });

    var single_pnl1_post_srch = new PostProcessManager({
            id: "singlepanel2_search",
            managerid: "basesearchJS",
            search: "search sourcetype=splunkd |stats count" 
    });
    
    single_pnl1_post_srch.on('search:done',function(properties){
        var myResults = single_pnl1_post_srch.data('results');
        myResults.on('data',function(){
            console.log(myResults.hasData())
            //console.log(myResults.data().fields[0])
            //console.log(myResults.data().rows[0][0])
            console.log(myResults.data().fields[0]+" -->"+myResults.data().rows[0][0])
			//console.log(myResults.collection())
        })
    });

    single_pnl2_post_srch.on('search:done',function(properties){
        var myResults = single_pnl2_post_srch.data('results');
        myResults.on('data',function(){
            console.log(myResults.hasData())
            console.log(myResults.data().fields[1])
            console.log(myResults.data().rows[0][1])
            console.log(myResults.data().fields[0]+" -->"+myResults.data().rows[0][1])
			//console.log(myResults.collection())
        })
    });

    new SingleView({
        id: "single_view_count",
        managerid: "singlepanel2_search",
        colorMode: "block",
        underLabel: "Total Count",
        trendDisplayMode: "percent",
        rangeColors: '["red","green","yellow","blue","marron"]',
        rangeValues: '[0,400,800,1200,3000]',
        //beforeLabel: "Event count:",
        useColors: "true",
        el: $("#count_by_sourcetype")
    }).render();

    var columnChart = new ChartView({
        id: "column_chart_count",
        managerid: "singlepanel1_search",
        type: "column",
        "charting.chart.stackMode": "default", // Place complex property names within quotes
        "charting.legend.placement": "bottom",
        "charting.chart.showDataLabels":"minmax",
        "charting.axisLabelsY.majorLabelStyle.rotation":"-45",
        "charting.chart.showDataLabels":"all",
        el: $("#count_by_sourcetype_source")
    }).render();



    var table_post_srch = new PostProcessManager({
        id: "table_search",
        managerid: "basesearchJS",
        search: "search sourcetype=splunkd |table index source host sourcetype|dedup index source host sourcetype " 
    });


    new TableView({
        id: "table_chart",
        managerid: "table_search",
        pageSize: "10",
        pagerPosition: "bottom",
        el: $("#table_view")
    }).render();
 
var piechart_post_srch = new PostProcessManager({
    id: "piechart_search",
    managerid: "basesearchJS",
    search: "search sourcetype=splunkd |stats count by source" 
});
    var pieChart = new ChartView({
    id: "pie_chart_count",
    managerid: "piechart_search",
    type: "pie",
    // "charting.chart.stackMode": "stacked", // Place complex property names within quotes
    // "charting.legend.placement": "bottom",
    // "charting.chart.showDataLabels":"minmax",
    // "charting.axisLabelsY.majorLabelStyle.rotation":"-45",
    // "charting.chart.showDataLabels":"all",
    el: $("#pie_chart_count_by_source")
}).render();

    pieChart.settings.set("charting.chart.showPercent",true);


    var bar_line_post_srch = new PostProcessManager({
    id: "bar_line_chart_search",
    managerid: "basesearchJS",
    search: "search sourcetype=splunkd |stats count by source" 
});

    var barChart = new ChartView({
    id: "bar_chart_count",
    managerid: "bar_line_chart_search",
    type: "bar",
        // "charting.chart.stackMode": "stacked", // Place complex property names within quotes
        // "charting.legend.placement": "bottom",
        // "charting.chart.showDataLabels":"minmax",
        // "charting.axisLabelsY.majorLabelStyle.rotation":"-45",
        // "charting.chart.showDataLabels":"all",
    el: $("#bar_chart_count_by_source")
    }).render();

//set the spacing between bars//
    barChart.settings.set("charting.chart.barSpacing",5);

    // Respond to a click event
    barChart.on("click:chart", function (e) {
        e.preventDefault(); // Prevent redirecting to the Search app
        console.log("Clicked chart: ", e); // Print event info to the console
    });


    var lineChart = new ChartView({
    id: "line_chart_count",
    managerid: "bar_line_chart_search",
    type: "line",
    "link.visible":true,
    // "charting.chart.stackMode": "stacked", // Place complex property names within quotes
    // "charting.legend.placement": "bottom",
    // "charting.chart.showDataLabels":"minmax",
    // "charting.axisLabelsY.majorLabelStyle.rotation":"-45",
    // "charting.chart.showDataLabels":"all",
    el: $("#line_chart_count_by_source")
    }).render();

    lineChart.on("click:legend", function (e) {
        e.preventDefault(); // Prevent redirecting to the Search app
        console.log("Clicked legend: ", e); // Print event info to the console
    });

    lineChart.settings.set("link.visible",true);
    lineChart.settings.set("link.visible","true");

    lineChart.settings.set("link.openSearch.visible","true");
   
    
});




/////////////////////////////////////////////////////////////////
const accordionItemHeaders = document.querySelectorAll(".accordion-item-header");

accordionItemHeaders.forEach(accordionItemHeader => {
    accordionItemHeader.addEventListener("click", event => {
accordionItemHeader.classList.toggle("active");
 
});
})