// add hovered class in selected list item
let list = document.querySelectorAll('.navigation li');
function activeLink(){
    list.forEach((item) =>
    item.classList.remove('hovered'));
    this.classList.add('hovered');
}
list.forEach((item) => 
item.addEventListener('mouseover',activeLink));

// MenuToggle
let toggle = document.querySelector('.toggle');
let navigation = document.querySelector('.navigation');
let main = document.querySelector('.main');

toggle.onclick = function(){
    navigation.classList.toggle('active');
    main.classList.toggle('active');
}

//Polar Chart
var options = {
    series: [42, 47, 52, 58, 65],
    chart: {
    width: 380,
    type: 'polarArea'
  },
  labels: ['Tomato', 'Carrots', 'Pumpkins', 'Cabbage', 'Potato'],
  fill: {
    opacity: 1
  },
  stroke: {
    width: 1,
    colors: undefined
  },
  yaxis: {
    show: false
  },
  legend: {
    position: 'bottom'
  },
  plotOptions: {
    polarArea: {
      rings: {
        strokeWidth: 0
      },
      spokes: {
        strokeWidth: 0
      },
    }
  },
  theme: {
    monochrome: {
      enabled: false,
    }
  },
  colors: ['#c26c6f', '#8d99ae', '#ffbf69', '#52b788', '#55596e'],
  };

  var chart = new ApexCharts(document.querySelector("#polar-chart"), options);
  chart.render();

// line Chart
var options = {
    series: [{
            name: "Potato",
            data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
    }],
    chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false
    }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
        title: {
          text: 'Potato by Month',
          align: 'left'
        },
        grid: {
          row: {
            colors: ['#fff', 'transparent'], 
            opacity: 0.5
          },
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        },
        colors: ['#375534']
};

var chart = new ApexCharts(document.querySelector("#line-chart"), options);
chart.render();


