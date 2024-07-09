// Fetch data from the JSON file
function fetchData() {
  return d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json");
}

// Build the metadata panel
function buildMetadata(sample) {
  fetchData().then((data) => {
    let metadata = data.metadata;
    let result = metadata.filter(obj => obj.id == sample)[0];
    let panel = d3.select("#sample-metadata");

    panel.html("");
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// Build the bar chart
function buildBarChart(sampleData) {
  let otu_ids = sampleData.otu_ids.slice(0, 10).map(id => `OTU ${id}`);
  let sample_values = sampleData.sample_values.slice(0, 10);
  let otu_labels = sampleData.otu_labels.slice(0, 10);

  let trace = {
    x: sample_values.reverse(),
    y: otu_ids.reverse(),
    text: otu_labels.reverse(),
    type: 'bar',
    orientation: 'h'
  };

  let data = [trace];
  let layout = {
    title: 'Top 10 OTUs Found',
    margin: { l: 100, r: 100, t: 100, b: 30 }
  };

  Plotly.newPlot('bar', data, layout);
}

// Build the bubble chart
function buildBubbleChart(sampleData) {
  let trace = {
    x: sampleData.otu_ids,
    y: sampleData.sample_values,
    text: sampleData.otu_labels,
    mode: 'markers',
    marker: {
      size: sampleData.sample_values,
      color: sampleData.otu_ids
    }
  };

  let data = [trace];
  let layout = {
    title: 'OTU IDs vs Sample Values',
    showlegend: false,
    height: 600,
    width: 1000
  };

  Plotly.newPlot('bubble', data, layout);
}

// Function to build both charts and metadata
function buildCharts(sample) {
  fetchData().then((data) => {
    let samples = data.samples;
    let sampleData = samples.filter(obj => obj.id == sample)[0];

    buildBarChart(sampleData);
    buildBubbleChart(sampleData);
    buildMetadata(sample);
  });
}

// Initialize the dashboard
function init() {
  let selector = d3.select("#selDataset");

  fetchData().then((data) => {
    let sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector.append("option").text(sample).property("value", sample);
    });

    let firstSample = sampleNames[0];
    buildCharts(firstSample);
  });
}

// Update charts and metadata when a new sample is selected
function optionChanged(newSample) {
  buildCharts(newSample);
}

init();