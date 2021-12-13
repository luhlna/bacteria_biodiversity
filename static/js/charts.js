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
  //console.log(data);
    // 3. Create a variable that holds the samples array. 
    var buttonSamples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = buttonSamples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    //console.log(result);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sampleIds = result.otu_ids;
    var sampleLabels = result.otu_labels;
    var sampleValues = result.sample_values;

    //BAR CHART
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var xticks = sampleValues.slice(0,10).reverse();
    var yticks = sampleIds.slice(0,10).map(Obj => "OTU " + String(Obj)).reverse();

    // 8. Create the trace for the bar chart. 
    var barTrace = {
      x: xticks,
      y: yticks,
      type: "bar",
      text: sampleLabels.slice(0,10).reverse(),
      orientation: 'h'      
    };

    var barData = [barTrace];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: '<br>Top 10 Bacteria Cultures Found',
      width: 425, height: 375      
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData ,barLayout);

    // BUBBLE CHART
    // 1. Create the trace for the bubble chart.
    var bubbleTrace = {
      x: sampleIds,
      y: sampleValues,
      text:sampleLabels,
      mode: "markers",
      marker: { 
         color: sampleIds,
         colorscale: "Earth",
         size: sampleValues
       }
      };    
    
    var bubbleData = [bubbleTrace];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: "false ",
      xaxis: {title: "OTU ID"},      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData, bubbleLayout);

    //GAUGE CHART
    // 4. Create the trace for the gauge chart.

    var filterMetaData = data.metadata.filter(Obj => Obj.id == sample)[0];
    var washingFrequency = parseFloat(filterMetaData.wfreq)

    var gaugeTrace = 
      {
          domain: { x: [0, 1], y: [0, 1] },
          value: washingFrequency,
          title: "Weekly Washing Frequency",
          type: "indicator",
          mode: "gauge+number",
          gauge: {
              axis: { range: [null, 10]},
              bar: { color: "#000000" },
              steps: [
                  { range: [0, 2], color: "#C14242" },
                  { range: [2, 4], color: "#BF7F3F" },
                  { range: [4, 6], color: "#BFBF3F" },
                  { range: [6, 8], color: "#7FBF3F" },
                  { range: [8, 10], color: "#339933" },
              ],
          }
      };

    var gaugeData = [gaugeTrace];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 330, height: 375, margin: {t: 0, b: 0, l:0, r:0} 
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout)  

  });
}
