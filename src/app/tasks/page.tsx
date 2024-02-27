/* import "./styles.css";

import cubejs from "@cubejs-client/core";
import Chart from "chart.js/auto";
import moment from "moment";
import flatpickr from "flatpickr";

// TENTATIVE CHARTS, a refaire avec des bonnes datas

const cubejsApi = cubejs(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjEwMDAwMDAwMDAsImV4cCI6NTAwMDAwMDAwMH0.OHZOpOBVKr-sCwn8sbZ5UFsqI3uCs6e4omT7P6WVMFw",
  {
    apiUrl:
      "https://awesome-ecom.gcp-us-central1.cubecloudapp.dev/cubejs-api/v1",
  }
);

let chart;

var drawChart = function (startDate, endDate) {
  cubejsApi
    .load({
      measures: ["Orders.count"],
      timeDimensions: [
        {
          dimension: "Orders.createdAt",
          granularity: `day`,
          dateRange: [startDate, endDate],
        },
      ],
    })
    .then((resultSet) => {
      if (chart) {
        chart.data = chartJsData(resultSet);
        chart.update();
      } else {
        chart = new Chart(document.getElementById("chart"), {
          type: "line",
          options: {},
          data: chartJsData(resultSet),
        });
      }
    });
};

const MIN_DATE = "2020-08-01";
const MAX_DATE = "2020-09-01";

flatpickr("#dates", {
  mode: "range",
  dateFormat: "Y-m-d",
  defaultDate: [MIN_DATE, MAX_DATE],

  onChange: function (selectedDates) {
    if (selectedDates.length === 2) {
      drawChart(selectedDates[0], selectedDates[1]);
    }
  },
});

drawChart(MIN_DATE, MAX_DATE);

var chartJsData = function (resultSet) {
  return {
    datasets: [
      {
        label: "Orders Count",
        data: resultSet.chartPivot().map(function (r) {
          return r["Orders.count"];
        }),
        backgroundColor: "rgb(255, 99, 132)",
      },
    ],
    labels: resultSet.categories().map(function (c) {
      return moment(c.x).format("DD MMM");
    }),
  };
};
 */
