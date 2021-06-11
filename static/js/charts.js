function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    //console.log(metadata);
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var sampleArray = data.samples;
    var buildingArray = sampleArray.filter(sampleObj => sampleObj.id == sample);
    var initialSample = buildingArray[0];
// 3. Create a variable that holds the washing frequency.
    var metadata = data.metadata;
    //console.log(metadata);
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var washFreq = result.wfreq;
    console.log(washFreq);
    var otu_ids = initialSample.otu_ids;
    var otu_labels = initialSample.otu_labels;
    var sample_values = initialSample.sample_values;

    // Build a Bubble Chart
  var bubbleChart = {
      title: "Bacteria Cultures Per Sample",
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
    };
  var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Picnic"
        }
      }
    ];

    Plotly.newPlot("bubble", bubbleData, bubbleChart);
    
    //Create a horizontal bar chart
    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    var barData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];

    var chartLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", barData, chartLayout);
// 4. Create the trace for the gauge chart.
   var gaugeData = [{
     title: {text: "Scrubs per Week"},
     value: washFreq,
     type: "indicator",
     mode: "gauge+number",
     gauge: { 
       axis: { range: [0, 10]},
       steps: [
         {range: [0,2], color: "red"},
         {range: [2, 4], color: "orange"},
         {range: [4, 6], color: "yellow"},
         {range: [6, 8], color: "lightgreen"},
         {range: [8, 10], color: "green"}
     ]},
     threshold: {
       line: {color: "black", width: 4},
       thickness: 0.75
     }}];
  
  // 5. Create the layout for the gauge chart.
  var gaugeLayout = { 
   title: "Belly Button Washing Frequency"

  };

  // 6. Use Plotly to plot the gauge data and layout.
  Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
};

// Initialize the dashboard
init();