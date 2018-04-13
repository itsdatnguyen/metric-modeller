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
    ];
    this.hourlyCost = 318.4;
  }

  calculateCost(formData, months) {
    let monthlyCost = this.hourlyCost * 8 * 5 * 4;
    return months * formData['number-programmers'] * monthlyCost;
  }

  calculateLinesOfCode(formData) {
    let languageProd = this.languageProd[formData.language];
    return languageProd.locFp * formData.fps;
  }

  calcualteBaseMonths(formData) {
    let languageProd = this.languageProd[formData.language];
    return (formData['number-programmers'] * formData.fps) / languageProd.fpManMo;
  }

}

function getFormData() {
  var data = {};
  var elementIds = [
    'fps',
    'language',
    'number-programmers',
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
    var totalMonths = modeller.calcualteBaseMonths(data);
    var linesOfCode = modeller.calculateLinesOfCode(data);
    var totalCost = modeller.calculateCost(data, totalMonths);
    
    setOutput({
      'output-hours': totalMonths.toFixed(2),
      'output-cost': totalCost.toFixed(2)
    });
    
  });
});
