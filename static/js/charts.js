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

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    console.log(metadata);
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
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleArray = data;
      // 4. Create a variable that filters the samples for the object with the desired sample number.
    var newSample = sampleArray.filter(sampleObj => sampleObj.id == sample);
      //  5. Create a variable that holds the first sample in the array.
    var initialSample = newSample[0];
    // 3. Create a variable that holds the washing frequency.
    var washingFreq = firstSample.wfreq;
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIDs = initialSample.otu_ids;
    var otuLables = initialSample.otu_labels;
    var sampleValues = initialSample.sample_values;
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIDs.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      text: otuLables.slice(0,10).reverse(),
      type: 'bar',
      orientation: 'h'
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: {
        t: 30,
        l: 150
      }
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      mode: 'markers',
      text: otuLables,
      x: otuIDs,
      y: sampleValues,
      marker: {
        size: sampleValues,
        color: otuIDs,
        colorscale: "Picnic"
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title:'Bacteria Cultures Per Sample',
      xaxis: {title: "OTU ID"},
      hovermode: 'closest'
      }
   

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

     // 4. Create the trace for the gauge chart.
     var gaugeData = [{
       title: {text: "Scrubs per Week"},
       value: washingFreq,
       type: "indicator",
       mode: "gauge+number",
       steps: [
         {range: [0,2], color: "red"},
         {range: [2, 4], color: "orange"},
         {range: [4, 6], color: "yellow"},
         {range: [6, 8], color: "lightgreen"},
         {range: [8, 10], color: "green"}
       ],
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
