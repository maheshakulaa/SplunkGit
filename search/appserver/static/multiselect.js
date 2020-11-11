require([
'splunkjs/mvc/searchmanager',
'splunkjs/mvc/postprocessmanager',
'splunkjs/mvc/singleview',
'splunkjs/mvc/chartview',
'splunkjs/mvc/tableview',
'underscore',
'splunkjs/mvc/multidropdownview',
'splunkjs/mvc/dropdownview',
'splunkjs/mvc',
"splunkjs/mvc/simplexml/ready!"
], function(SearchManager,
    PostProcessManager,
    SingleView,
    ChartView,
    TableView,
    _,
    MultiDropdownView,
    DropdownView,
    mvc) { 

new SearchManager({
id: "base_search",
earliest_time: "-24h",
latest_time: "now",
preview: true,
cache: false,
search: "index=_internal sourcetype=splunkd| stats count by component"
    });

    var rlse_yr_post_srch = new PostProcessManager({
id: "rlse_yr_md_srch",
managerid: "base_search",
search: "| stats count by component" 
    });
    
    var mychoices = [
        {label:"All", value: "*"}
    ];
    
    new MultiDropdownView({
        id: "release-year-multidropdown",
        managerid: "base_search",
        choices: mychoices,
        default: "*",
        value: mvc.tokenSafe("$component$"),
        labelField: "component",
        valueField: "component",
        el: $("#release_year_md")
    }).render();
	
	    new MultiDropdownView({
        id: "release-year-multidropdown",
        managerid: "base_search",
        choices: mychoices,
        default: "*",
        value: mvc.tokenSafe("$component$"),
        labelField: "component",
        valueField: "component",
        el: $("#release_year_md1")
    }).render();

	});