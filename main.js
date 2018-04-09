class MetricModeller {
  constructor() {
    this.data = [
      {
        name: 'project 1',
        language: 8,
        fps: 10,
        time: 20,
        kloc: 5
      },
      {
        name: 'project 2',
        language: 8,
        fps: 15,
        time: 15,
        kloc: 2
      },
      {
        name: 'project 3',
        language: 2.5,
        fps: 12,
        time: 30,
        kloc: 8
      },
      {
        name: 'project 4',
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

    return (dataset.time * dataset.language / 10) * formData.language * formData.kloc / dataset.kloc * formData.fps / dataset.fps / formData.experience / formData.complexity;
  }
}

function getFormData() {
  var data = {};

  var elementIds = [
    'kloc',
    'fps',
    'language',
    'experience',
	'complexity'
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

    setOutput({
      'output-hours': estimatedTime.toFixed(2)
    });
  });
});