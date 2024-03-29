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
      {
        name: 'Ruby',
        level: 7.0,
        fpManMo: 15.8664339,
        locFp: 46.0
      },
    ];
    this.hourlyCost = 318.4;
  }

  calculateCost(formData, months) {
    let monthlyCost = formData['programmer-pay'] * 8 * 5 * 4;
    return months * monthlyCost;
  }

  calculateLinesOfCode(formData) {
    let languageProd = this.languageProd[formData.language];
    return languageProd.locFp * formData.fps;
  }

  calcualteBaseMonths(formData) {
    let languageProd = this.languageProd[formData.language];
    let months = formData.fps / formData['number-programmers'] / languageProd.fpManMo;

    // Team experience. A more experienced team will be more productive.
    months = months / formData.experience;

    // Project complexity. A more complex project will take longer to complete.
    months = months * formData.complexity;

    // Project testing coverage. A project with more testing code coverage will last much more longer.
    months = months * formData.testing;

    // months to create queries and to database or setup database
    months = months * formData['database-complexity'];

    // Effect of group cohesion on months it takes to finish project
    months = months * formData['group-cohesion'];
    
    // Project Software Reliability. A project with more reliable software will increase months.
    months = months * formData.reliability;

    // Version control. A project with no version control and lots of programmer will have a longer duration.
    if (formData['version-control'] == 'false') {
      months = months * Math.sqrt(formData['number-programmers'])
    }

    return months;
  }

}

function getFormData() {
  var data = {};
  var elementIds = [
    'fps',
    'language',
    'number-programmers',
    'programmer-pay',
    'group-cohesion',
    'database-complexity',
    'experience',
    'complexity',
    'testing',
    'reliability',
    'version-control'
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
    var totalMonths = modeller.calcualteBaseMonths(data);
    var linesOfCode = modeller.calculateLinesOfCode(data);
    var totalCost = modeller.calculateCost(data, totalMonths);
    
    setOutput({
      'output-hours': totalMonths.toFixed(2),
      'output-cost': totalCost.toFixed(2)
    });
    
  });
});
