require([
    'underscore',
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/tableview',
    'splunkjs/mvc/simplexml/ready!'
], function(_, $, mvc, TableView) {
    
    new TableView({
        id: "splunk_table_id",
        el: $("#splunk_table_id")
    }).render();

 //#################################################################################//   
//demo or sample javascript from splunk community

    // Translations from rangemap results to CSS class
    var ICONS = {
        severe: 'alert-circle',
        elevated: 'alert',
        low: 'check-circle'
    };
    
    var RangeMapIconRenderer = TableView.BaseCellRenderer.extend({
        canRender: function(cell) {
            // Only use the cell renderer for the "Average Response Time SLA" field
            return cell.field === 'Average Response Time SLA';
        },
        render: function($td, cell) {
            var icon = 'check-circle';
            // Fetch the icon for the value
            if (ICONS.hasOwnProperty(cell.value)) {
                icon = ICONS[cell.value];
            }
            // Create the icon element and add it to the table cell
            $td.addClass('icon').html(_.template('<i class="icon-<%-icon%> <%- range %>" title="<%- range %>"></i>', {
                icon: icon,
                range: cell.value
            }));
        }
    });

    var CustomRangeRenderer = TableView.BaseCellRenderer.extend({
        canRender: function(cell) {
            // Enable this custom cell renderer for 'Average Response Time SLA'
            return _(['Average Response Time SLA']).contains(cell.field);
        },
        render: function($td, cell) {
            // Add a class to the cell based on the returned value
            var strSLA = cell.value;
            if (strSLA!==undefined){
                strSLA=strSLA.trim();
                $td.addClass('range-cell').addClass("range-"+strSLA);
            }
            $td.text(strSLA).addClass('string');
        }
    }); 

    mvc.Components.get("response_time_highlight_icon").getVisualization(function(tableView){
        // Register custom cell renderer, the table will re-render automatically
        tableView.addCellRenderer(new RangeMapIconRenderer());
    }); 

    mvc.Components.get("response_time_highlight_cell").getVisualization(function(tableView){
        tableView.on("rendered", function() {
            console.log("Table Rendered");
            setTimeout(function(){
                $("#response_time_highlight_cell tr").each(function() {
                    var strSLA=$(this).find("td:last").html();
                    if (strSLA!==undefined){
                        strSLA=strSLA.trim();
                        $(this).find("td:nth-child(3)").addClass("range-cell").addClass("range-"+strSLA);
                        $(this).find("td:nth-child(6)").addClass("range-cell").addClass("range-"+strSLA);
                    }
                });
            },100);
        });
    });


    mvc.Components.get("response_time_highlight_row").getVisualization(function(tableView) {
        tableView.on('rendered', function() {
            setTimeout(function(){
                // Apply class of the cells to the parent row in order to color the whole row
                tableView.$el.find('td.range-cell').each(function() {
                    $(this).parents('tr').addClass(this.className);
                });
            },100);
        });
        // Add custom cell renderer, the table will re-render automatically.
        tableView.addCellRenderer(new CustomRangeRenderer());
    });




});
