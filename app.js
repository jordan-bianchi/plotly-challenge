function buildMetaData(sample) {
    d3.json("samples.json").then((data)=> {
        var metadata = data.metadata;
        var resultArray = metadata.filter(s => s.id == sample);
        var result = resultArray[0];
        var panel = d3.select("#sample-metadata");
        panel.html("");

        Object.entries(result).forEach(([k,v]) => {
            panel.append("h6").text(`${k.toUpperCase()}: ${v}`);
        });
    });
}

function buildChart(sample) {
    d3.json("samples.json").then((d)=> {
    //console.log(d)
        var samples = d.samples;
        var resultArray = samples.filter(s => s.id == sample);
        var result = resultArray[0];
        var otuID = result.otu_ids;
        var otuLabel = result.otu_labels;
        var sampleValues = result.sample_values;

        // Bar Chart
        var ytick = otuID.slice(0,10).map(id => `OTU ${id}`).reverse();
        var trace2 = {
            x: sampleValues.slice(0,10).reverse(),
            y: ytick,
            text: otuID.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        }

        var data2 = [trace2];

        var layout2 = {
            title: "Top 10 Bacteria Cultures Found",
            margin: {t: 30, l: 150}
        }

        Plotly.newPlot("bar",data2,layout2);

        // Bubble Chart
        var trace1 = {
            x: otuID,
            y: sampleValues,
            text: otuLabel,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: otuID,
                colorscale: "Earth"
            }
        }

        var data = [trace1];

        var layout = {
            title: "Bacteria Cultures Per Sample",
            margin: {t: 0},
            hovermode: "closest",
            xaxis: 
                {title: "OTU ID"},
            margin: {t: 30}
        };
        
        Plotly.newPlot("bubble",data,layout);
    });  
 }

function init() {
    var selector = d3.select("#selDataset");

    d3.json("samples.json").then((d) => {
        var sampleNames = d.names;
        sampleNames.forEach((s) => {
            selector
                .append("option")
                .text(s)
                .property("value", s);
        });

        var sample = sampleNames[0];
        buildChart(sample);
        buildMetaData(sample);
    });
}

function optionChanged(sample) {
    buildChart(sample);
    buildMetaData(sample);
}

init();