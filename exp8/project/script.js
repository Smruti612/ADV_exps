// Load the data from the CSV file
d3.csv("/env2_df.csv").then(data => {
    // Convert relevant string data to numeric values
    data.forEach(d => {
        d.Total_emissions = +d.Total_emissions;
        d["Land use change"] = +d["Land use change"];
        d["Animal Feed"] = +d["Animal Feed"];
        d["Farm"] = +d["Farm"];
        d["Processing"] = +d["Processing"];
        d["Transport"] = +d["Transport"];
        d["Packging"] = +d["Packging"];
        d["Retail"] = +d["Retail"];
        d["Freshwater_kg"] = +d["Freshwater_kg"];
        // You can add more conversions if needed for other metrics
    });

    // Call the function to create the stacked bar chart
    stackedBarChart(data);
    pieChart(data);
    histogram(data);
    lineChart(data);
    areaChart(data);
    horizontalBarChart(data);
    
});

// Function to create a stacked bar chart
function stackedBarChart(data) {
    // Define the stages for stacking
    const stages = ['Animal Feed', 'Farm', 'Processing', 'Transport', 'Packging', 'Retail'];

    // Create a stack generator for the specified stages
    const stack = d3.stack()
        .keys(stages) // Specify which keys to stack
        .order(d3.stackOrderNone) // No specific order
        .offset(d3.stackOffsetNone); // No offset

    const series = stack(data); // Generate the stacked data

    // Set up the dimensions for the SVG
    const width = 800, height = 500;
    const svg = d3.select("#chart").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(50,30)");  // Add margin

    // Set up the scales
    const x = d3.scaleBand()
        .domain(data.map(d => d['Food product'])) // X-axis represents food products
        .range([0, width - 100]) // Set range for the x-axis
        .padding(0.1); // Add padding between bars

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Total_emissions)]) // Y-axis for total emissions
        .range([height - 100, 0]); // Invert the scale

    const color = d3.scaleOrdinal(d3.schemeCategory10); // Color scale for the stages

    // Add the stacked bars to the SVG
    svg.selectAll("g")
        .data(series) // Bind data to groups
        .enter().append("g")
        .attr("fill", (d, i) => color(i)) // Set fill color based on index
        .selectAll("rect")
        .data(d => d) // Bind data to rectangles
        .enter().append("rect")
        .attr("x", d => x(d.data['Food product'])) // Position on the x-axis
        .attr("y", d => y(d[1])) // Position on the y-axis based on stack height
        .attr("height", d => y(d[0]) - y(d[1])) // Set height of each segment
        .attr("width", x.bandwidth()); // Set width of each bar

    // Add the Y-axis
    svg.append("g")
        .attr("transform", "translate(0,0)") // Positioning of Y-axis
        .call(d3.axisLeft(y).ticks(10)); // Draw the Y-axis

    // Add the X-axis
    svg.append("g")
        .attr("transform", `translate(0,${height - 100})`) // Positioning of X-axis
        .call(d3.axisBottom(x)) // Draw the X-axis
        .selectAll("text")
        .attr("transform", "rotate(-45)") // Rotate X-axis labels
        .style("text-anchor", "end"); // Anchor text to the end

    // Add a title to the chart
    svg.append("text")
        .attr("x", width / 2 - 50)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Total Emissions by Food Product"); // Title of the chart

    // Add X-axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 30)
        .attr("text-anchor", "middle")
        .text("Food Product"); // X-axis label

    // Add Y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -30)
        .attr("text-anchor", "middle")
        .text("Total Emissions (kg CO2eq)"); // Y-axis label

    // Add a legend for the stages
    const legend = svg.append("g")
        .attr("transform", `translate(${width - 120}, 20)`); // Positioning of the legend

    stages.forEach((stage, i) => {
        const legendRow = legend.append("g")
            .attr("transform", `translate(0, ${i * 20})`); // Position each row

        // Legend color box
        legendRow.append("rect")
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", color(i)); // Set fill color for legend

        // Legend label
        legendRow.append("text")
            .attr("x", -10)
            .attr("y", 12)
            .attr("text-anchor", "end")
            .style("text-transform", "capitalize") // Capitalize text
            .text(stage); // Set text for legend
    });
}

function pieChart(data) {
    const width = 450, height = 600, radius = Math.min(width, height) / 2;

    const svg = d3.select("#chart").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const categories = ['Farm', 'Processing', 'Transport', 'Packging', 'Retail'];
    
    // Calculate the sum for each category
    const categorySums = categories.map(category => ({
        category,
        value: d3.sum(data, d => d[category])
    }));

    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    svg.append("text")
    .attr("x", 0)
    .attr("y", -height / 2 + 20) // Position above the chart
    .attr("text-anchor", "middle") // Center the text
    .style("font-size", "24px") // Set the font size
    .style("font-weight", "bold") // Make it bold
    .text("Distribution of Categories"); 

    // Create the pie chart slices
    svg.selectAll("path")
        .data(pie(categorySums))
        .enter().append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.category))
        .on("mouseover", function(event, d) {
            // Show tooltip on mouseover
            d3.select("#tooltip")
                .style("opacity", 1)
                .html(`${d.data.category}: ${d.data.value}`)
                .style("left", `${event.pageX + 5}px`)
                .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", function() {
            // Hide tooltip on mouseout
            d3.select("#tooltip").style("opacity", 0);
        });

    // Create a legend
    const legendGroup = svg.append("g")
        .attr("transform", `translate(${width / 2 + 100}, ${-height / 2 + 40})`); // Adjust position as needed

    categories.forEach((category, index) => {
        // Create a legend item
        const legendItem = legendGroup.append("g")
            .attr("transform", `translate(0, ${index * 25})`); // Increase spacing for better visibility

        // Add a colored rectangle for the legend
        legendItem.append("rect")
            .attr("width", 30)
            .attr("height", 30)
            .attr("fill", color(category));

        // Add the text label for the legend
        legendItem.append("text")
            .attr("x", 40) // Position the text further to the right of the rectangle
            .attr("y", 20) // Center the text vertically with respect to the rectangle
            .attr("dy", "0.35em") // Adjust vertical alignment
            .text(category);
    });

    // Create a tooltip div (make sure this is present in your HTML)
    d3.select("body").append("div")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("background", "lightsteelblue")
        .style("padding", "5px")
        .style("border-radius", "5px")
        .style("pointer-events", "none")
        .style("opacity", 0); // Start hidden
}



function lineChart(data) {
    const width = 800, height = 400;

    // Define the animal-based food products
    const animal_based = [
        'Beef (beef herd)', 'Beef (dairy herd)', 'Lamb & Mutton', 
        'Pig Meat', 'Poultry Meat', 'Milk', 'Cheese', 'Eggs', 
        'Fish (farmed)', 'Shrimps (farmed)'
    ];

    // Filter data to include only animal-based food products
    const filteredData = data.filter(d => animal_based.includes(d['Food product']));
    
    const svg = d3.select("#chart").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(50, 30)");

    const x = d3.scalePoint()
        .domain(filteredData.map(d => d['Food product']))
        .range([0, width - 100])
        .padding(0.5);

    const y = d3.scaleLinear()
        .domain([0, d3.max(filteredData, d => d.Total_emissions)])
        .range([height - 100, 0]);

    const line = d3.line()
        .x(d => x(d['Food product']))
        .y(d => y(d.Total_emissions))
        .curve(d3.curveMonotoneX);

    // Corrected: Use filteredData instead of data
    svg.append("path")
        .datum(filteredData) // Use filteredData here
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 2)
        .attr("d", line);

    svg.append("g").call(d3.axisLeft(y));
    
    // X-axis with rotated labels
    svg.append("g")
        .attr("transform", `translate(0,${height - 100})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)") // Rotate labels
        .style("text-anchor", "end");

    // Add title to the chart
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .text("Total Emissions by Food Product");

    // Y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)") // Rotate for vertical text
        .attr("y", -40) // Position it above the Y-axis
        .attr("x", -height / 2)
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
        .text("Total Emissions (kg CO2e)");
}



function histogram(data) {
    const width = 800, height = 400;
    
    
    const svg = d3.select("#chart").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(50, 30)");

    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Eutrophying_1000kcal)])
        .range([0, width - 100]);

    const histogramData = d3.histogram()
        .value(d => d.Eutrophying_1000kcal)
        .domain(x.domain())
        .thresholds(x.ticks(20))(data);

    const y = d3.scaleLinear()
        .domain([0, d3.max(histogramData, d => d.length)])
        .range([height - 100, 0]);

    svg.selectAll("rect")
        .data(histogramData)
        .enter().append("rect")
        .attr("x", d => x(d.x0))
        .attr("y", d => y(d.length))
        .attr("width", d => x(d.x1) - x(d.x0) - 1)
        .attr("height", d => height - 100 - y(d.length))
        .attr("fill", "orange");

    svg.append("g").call(d3.axisLeft(y));
    svg.append("g").attr("transform", `translate(0,${height - 100})`).call(d3.axisBottom(x));

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .text("Distribution of Total Emissions");

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 70)
        .attr("text-anchor", "middle")
        .text("Eutrophying_1000kcal");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 20)
        .attr("x", -height / 2)
        .attr("dy", "-3em")
        .attr("text-anchor", "middle")
        .text("Frequency");
}

function areaChart(data) {
    const width = 800, height = 400;

    // Define the plant-based food products
    const plant_based = [
        'Wheat & Rye (Bread)', 'Maize (Meal)', 'Barley (Beer)', 'Oatmeal', 
        'Rice', 'Potatoes', 'Cassava', 'Cane Sugar', 'Beet Sugar', 'Other Pulses'
    ];

    // Filter data to include only plant-based food products
    const filteredData = data.filter(d => plant_based.includes(d['Food product']));

    const svg = d3.select("#chart").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(50, 30)");

    const x = d3.scalePoint()
        .domain(filteredData.map(d => d['Food product']))
        .range([0, width - 100])
        .padding(0.5);

    const y = d3.scaleLinear()
        .domain([0, d3.max(filteredData, d => d.Total_emissions)])
        .range([height - 100, 0]);

    const area = d3.area()
        .x(d => x(d['Food product']))
        .y0(height - 100)
        .y1(d => y(d.Total_emissions))
        .curve(d3.curveMonotoneX);

    // Append area path
    svg.append("path")
        .datum(filteredData)
        .attr("fill", "lightblue")
        .attr("d", area);

    // Add axes
    svg.append("g").call(d3.axisLeft(y));
    
    svg.append("g")
        .attr("transform", `translate(0,${height - 100})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    // Add title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .text("Total Emissions by Plant-Based Food Product");

    // Y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -height / 2)
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
        .text("Total Emissions (kg CO2e)");
}


function horizontalBarChart(data) {
    // Define the categories of protein-rich foods
    const proteinRichCategories = [
        'Other Pulses', 'Peas', 'Nuts', 'Groundnuts', 'Soymilk', 
        'Tofu', 'Beef (beef herd)', 'Beef (dairy herd)', 'Lamb & Mutton', 
        'Pig Meat', 'Poultry Meat', 'Milk', 'Cheese', 'Eggs', 'Fish (farmed)', 
        'Shrimps (farmed)'
    ];

    // Filter the data for protein-rich food products
    const filteredData = data.filter(d => proteinRichCategories.includes(d['Food product']));


    const natureColors = [
        "#3D9A68", // Green
        "#A1CDA8", // Light Green
        "#F5EBAF", // Light Yellow
        "#B1C6D4", // Light Blue
        "#C3B299", // Beige
        "#C94A2A", // Red-Orange
        "#E3B657", // Gold
        "#F0A3A0"  // Soft Pink
    ];
    
    const margin = { top: 20, right: 60, bottom: 40, left: 90 },
          width = 800 - margin.left - margin.right,
          height = 600 - margin.top - margin.bottom;

    const svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = d3.scaleLinear()
        .domain([0, d3.max(filteredData, d => d.Eutrophying_1000kcal)])
        .nice()
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(filteredData.map(d => d['Food product']))
        .range([0, height])
        .padding(0.1);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(10));

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));

    svg.selectAll(".bar")
    .data(filteredData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("y", d => y(d['Food product']))
    .attr("x", 0)
    .attr("width", d => x(d.Eutrophying_1000kcal))
    .attr("height", y.bandwidth())
    .attr("fill", (d, i) => natureColors[i % natureColors.length]);

    // Add chart title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .text("Protein-Rich Food eutrophication (Horizontal Bar Chart)");

    // Add x-axis label
    svg.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 10})`)
        .attr("text-anchor", "middle")
        .text("Eutrophying_1000kcal");

    // Add y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left / 2)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
        .text("Food Products");
}
