class MetricModeller {
  constructor() {
    this.data = [
      {
        name: 'Kappa',
        language: 8,
        fps: 58,
        time: 55,
        kloc: 30
      },
      {
        name: 'Javascript',
        language: 8,
        fps: 60,
        time: 40,
        kloc: 37
      },
      {
        name: 'C',
        language: 2.5,
        fps: 50,
        time: 90,
        kloc: 80
      },
      {
        name: 'Haskell',
        language: 8.5,
        fps: 70,
        time: 50,
        kloc: 35
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

    return dataset.time * dataset.language / formData.language * formData.kloc / dataset.kloc * formData.fps / dataset.fps
  }
}

function getFormData() {
  var data = {};

  var elementIds = [
    'kloc',
    'fps',
    'language'
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