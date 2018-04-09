class MetricModeller {
  constructor() {
    this.data = [
      {
        name: 'Kappa',
        language: 8,
        fps: 10,
        time: 20,
        kloc: 5
      },
      {
        name: 'Javascript',
        language: 8,
        fps: 15,
        time: 15,
        kloc: 2
      },
      {
        name: 'C',
        language: 2.5,
        fps: 12,
        time: 30,
        kloc: 8
      },
      {
        name: 'Haskell',
        language: 8.5,
        fps: 30,
        time: 40,
        kloc: 3
      },
    ]
  }

  getAverageDataset() {
    // create copy of array
    let data = this.data.slice();
    let length = data.length;

    // possibly convoluted way of getting database averages.
    return {
      language: data.reduce((d, a) => typeof d === 'object' ? d.language + a.language : d + a.language) / length,
      fps: data.reduce((d, a) => typeof d === 'object' ? d.fps + a.fps : d + a.fps) / length,
      time: data.reduce((d, a) => typeof d === 'object' ? d.time + a.time : d + a.time) / length,
      kloc: data.reduce((d, a) => typeof d === 'object' ? d.kloc + a.kloc : d + a.kloc) / length
    }
  }

  getEstimatedTime(formData) {
    let dataset = this.getAverageDataset();

    let time = dataset.time;

    // language productivity. A higher value means less lines of code written for the same functionality.
    time = time * dataset.language / formData.language;

    // 1000 lines of code
    time = time * formData.kloc / dataset.kloc;

    // Function points. More function points means a longer project
    time = time * formData.fps / dataset.fps;

    // Team experience. A more experienced taem will be more productive.
    time = time / formData.experience;

    // Project complexity. A more complex project will take longer to complete.
    time = time * formData.complexity;

    // Project testing coverage. A project with more testing code coverage will last much more longer.
    time = time * formData.testing;

    // Version control. A project with no version control and lots of programmer will have a longer duration.
    if (formData['version-control'] == 'false') {
      time = time * Math.sqrt(formData['number-programmers'])
    }

    return time;
  }

  getEstimatedCost(estimatedTime, formData) {
    var employeePay = formData['programmer-pay'];
    var employeeNumber = formData['number-programmers'];
    var estimatedCost = employeePay * employeeNumber * estimatedTime;
    return estimatedCost;
  }
}

function getFormData() {
  var data = {};

  var elementIds = [
    'kloc',
    'fps',
    'language',
    'experience',
    'complexity',
    'testing',
    'programmer-pay',
    'number-programmers',
    'version-control'
  ];

  for (var id of elementIds) {
    var element = document.getElementById(id);

    data[id] = element.value;
  }

  return data;
}

function setOutput(output) {
  for (var item in output) {
    var element = document.getElementById(item);
    element.value = output[item];
  }
}

document.addEventListener('DOMContentLoaded', function() {
  var submit = document.getElementById('submit');

  submit.addEventListener('click', function (event) {
    event.preventDefault();

    var modeller = new MetricModeller();

    var data = getFormData();
    var estimatedTime = modeller.getEstimatedTime(data);
    var estimatedCost = modeller.getEstimatedCost(estimatedTime, data);

    setOutput({
      'output-hours': estimatedTime.toFixed(2),
      'output-cost': estimatedCost.toFixed(2)
    });
  });
});