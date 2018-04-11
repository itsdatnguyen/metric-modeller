class MetricModeller {
  constructor() {
    this.languageProd = [
      {
        name: 'C++',
        level: 6.0,
        fpManMo: 14.84854613,  // function points per man per month
        locFp: 53.0  // lines of code per function point
      },
      {
        name: 'C#',
        level: 6.0,
        fpManMo: 14.84854613,
        locFp: 54.0
      },
      {
        name: 'Objective-C',
        level: 12.0,
        fpManMo: 19.42553559,
        locFp: 27.0
      },
      {
        name: 'HTML5',
        level: 22.0,
        fpManMo: 23.42797153,
        locFp: 15.0
      },
      {
        name: 'Java',
        level: 6.0,
        fpManMo: 14.84854613,
        locFp: 53.0
      },
      {
        name: 'SQL',
        level: 25.0,
        fpManMo: 24.27208085,
        locFp: 13.0
      },
      {
        name: 'PHP',
        level: 5.0,
        fpManMo: 13.64464042,
        locFp: 67.0
      },
      {
        name: 'Python',
        level: 6.0,
        fpManMo: 14.84854613,
        locFp: 53.0
      },
      {
        name: 'VB .net',
        level: 15.0,
        fpManMo: 20.89899709,
        locFp: 20.0
      },
    ]
  }

  calculateCost(formData, time) {
    let cost = time * formData.employeeNumber * (formData['programmer-pay'] / 12.0);
    return cost;
  }

  calculateLinesOfCode(formData) {
    let languageProd = this.languageProd[parseInt(formData.language)];
    let linesOfCode = languageProd.locFp * formData.fps;
    return linesOfCode;
  }

  calcualteBaseMonths(formData) {
    let languageProd = this.languageProd[parseInt(formData.language)];
    let months = languageProd.fpManMo / formData.employeeNumber / formData.fps;
    return months;
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

    // Team experience. A more experienced team will be more productive.
    time = time / formData.experience;

    // Project complexity. A more complex project will take longer to complete.
    time = time * formData.complexity;

    // Project testing coverage. A project with more testing code coverage will last much more longer.
    time = time * formData.testing;

    // Time to create queries and to database or setup database
    time = time * formData['database-complexity'];

    // Effect of group cohesion on time it takes to finish project
    time = time * formData['group-cohesion'];
    
    // Project Software Reliability. A project with more reliable software will shorten time.
    time = time / formData.reliability;

    time = time / Math.sqrt(formData['number-programmers']);

    time = time + Math.sqrt(getCommChannels(formData['number-programmers']));

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

  /*
  var elementIds = [
    'kloc',
    'fps',
    'language',
    'experience',
    'complexity',
    'testing',
    'programmer-pay',
    'number-programmers',
    'database-complexity',
    'group-cohesion',
    'reliability',
    'version-control',
  ];
  */

  var elementIds = [
    'fps',
    'language',
    'programmer-pay',
    'number-programmers',
  ];

  for (var id of elementIds) {
    var element = document.getElementById(id);

    data[id] = element.value;
  }

  return data;
}

function getCommChannels(devCount) {
  return (devCount * (devCount - 1) / 2);
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
    console.log(data);
    //var estimatedTime = modeller.getEstimatedTime(data);
    //var estimatedCost = modeller.getEstimatedCost(estimatedTime, data);
    var months = modeller.calcualteBaseMonths(data);
    var linesOfCode = modeller.calculateLinesOfCode(data);
    var cost = modeller.calculateCost(data, months);
    console.log(months, linesOfCode, cost);
    /*
    setOutput({
      'output-hours': months.toFixed(2),
      'output-cost': cost.toFixed(2),
      'output-comm-channels': getCommChannels(data['number-programmers'])
    });
    */
  });
});
