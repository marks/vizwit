var $ = require('jquery')
var _ = require('underscore')
var BaseChart = require('./basechart')
var numberFormatter = require('../util/number-formatter')

module.exports = BaseChart.extend({
  settings: {
    graphs: [
      {
        title: 'Data',
        valueField: 'value',
        fillAlphas: 0.6,
        clustered: false,
        lineColor: '#97bbcd',
        balloonText: '<b>[[category]]</b><br>Total: [[value]]'
      },
      {
        title: 'Filtered Data',
        valueField: 'filteredValue',
        fillAlphas: 0.4,
        clustered: false,
        lineColor: '#97bbcd',
        balloonFunction: function (item, graph) {
          return '<b>' + item.category +
            '</b><br>Total: ' + (+item.dataContext.value).toLocaleString() +
            '<br>Filtered Amount: ' + (+item.dataContext.filteredValue).toLocaleString()
        }
      }
    ],
    chart: {
      type: 'serial',
      theme: 'light',
      responsive: {
        enabled: true
      },
      addClassNames: true,
      categoryField: 'label',
      marginLeft: 0,
      marginRight: 0,
      marginTop: 0,
      valueAxes: [{
        labelFunction: numberFormatter,
        position: 'right',
        inside: true,
        axisThickness: 0,
        axisAlpha: 0,
        tickLength: 0,
        // includeAllValues: true,
        // ignoreAxisWidth: true,
        gridAlpha: 0
      }],
      zoomOutText: '',
      creditsPosition: 'top-right',
      chartCursor: {
        cursorPosition: 'mouse',
        selectWithoutZooming: true,
        oneBalloonOnly: true,
        categoryBalloonEnabled: false
      },
      categoryAxis: {
        autoWrap: true,
        gridAlpha: 0,
        labelFunction: function (label) {
          return label && label.length > 12 ? label.substr(0, 12) + '…' : label
        },
        guides: [{
          lineThickness: 2,
          lineColor: '#ddd64b',
          fillColor: '#ddd64b',
          fillAlpha: 0.4,
          // label: 'Filtered',
          // inside: true,
          // color: '#000',
          balloonText: 'Currently filtered',
          expand: true,
          above: true
        }]
      }
    }
  },
  initialize: function (options) {
    BaseChart.prototype.initialize.apply(this, arguments)
    _.bindAll(this, 'onRangeSelected')
  },
  events: {
    'click .scroll a': 'onClickScroll'
  },
  render: function () {
    BaseChart.prototype.render.apply(this, arguments)

    // Listen to when the user selects a range
    this.chart.chartCursor.addListener('selected', this.onRangeSelected)
  },
  // Keep track of which column the cursor is hovered over
  // onHover: function (e) {
  //   if (e.index == null) {
  //     this.hovering = null
  //   } else {
  //     this.hovering = this.chart.categoryAxis.data[e.index]
  //   }
  // },
  // // When the user clicks on a bar in this chart
  // onClickCursor: function (e) {
  //   if (this.hovering !== null) {
  //     this.onSelect(this.hovering.category)
  //   }
  // },
  // onClickBar: function (e) {
  //   this.onSelect(e.item.category)
  // },
  // onClickLabel: function (e) {
  //   this.onSelect(e.serialDataItem.category)
  // },
  // onSelect: function (category) {
  //   console.log(this.collection)
  //   // If already selected, clear the filter
  //   var filter = this.filteredCollection.getFilters(this.filteredCollection.getTriggerField())
  //   if (filter && filter.expression.value === category) {
  //     this.vent.trigger(this.collection.getDataset() + '.filter', {
  //       field: this.filteredCollection.getTriggerField()
  //     })
  //   // Otherwise, add the filter
  //   } else {
  //     // Trigger the global event handler with this filter
  //     this.vent.trigger(this.collection.getDataset() + '.filter', {
  //       field: this.collection.getTriggerField(),
  //       expression: {
  //         type: '=',
  //         value: category
  //       }
  //     })
  //   }
  // },
  onRangeSelected: function (e) {
    var field = this.collection.getTriggerField()

    // Trigger the global event handler with this filter
    this.vent.trigger(this.collection.getDataset() + '.filter', {
      field: field,
      expression: {
        type: 'and',
        value: [
          {
            type: '>=',
            value: e.start,
            label: e.start
          },
          {
            type: '<=',
            value: e.end,
            label: e.end
          }
        ]
      }
    })
  }
})