require([
      'underscore',
      'jquery',
      'splunkjs/mvc',
      'splunkjs/mvc/tableview',
      'splunkjs/mvc/simplexml/ready!'
  ], function(_, $, mvc, TableView) {

    var CustomRangeRenderer = TableView.BaseCellRenderer.extend({
        canRender: function(cell) {
            return cell.field;
        },
        render: function($td, cell) {
            var value = cell.value;
            if(value=="UP" )
                {
                    $td.html("<div class='up'> </div>")
                }
            else if(value=="DOWN")
            {
                    $td.html("<div class='down'> </div>")
            }
            else if(value=="UNKNOWN" || value=="N/A")
            {
                    $td.html("<div class='unknown'> </div>")
            }
            else if(value=="WARN")
            {
                    $td.html("<div class='warn'> </div>")
            }

        }
    });

    var sh = mvc.Components.get("sample");
    if(typeof(sh)!="undefined") {
        sh.getVisualization(function(tableView) {
            // Add custom cell renderer and force re-render
            tableView.table.addCellRenderer(new CustomRangeRenderer());
            tableView.table.render();
        });
    }

  }); 