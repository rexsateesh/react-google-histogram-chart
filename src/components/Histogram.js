import React from 'react'
import axios from 'axios';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

export default class Historgram extends React.Component {

    constructor(props) {
        super(props);

        this.btnRef = React.createRef(); // Creating button ref
        this.chartRef = React.createRef(); // Creating chart ref
    }

    /**
     * Generate bucket
     * @returns {Object} {bucketKey: 0}
     */
    generateBucket() {
        const bucket = {};
        const { range, slab } = this.props; // Extract props

        for (let i = 0; i <= range + slab; i += slab) {
            if (i === 0) {
                continue;
            }

            const key = i > range ? `${range}-Infinity` : `${i - slab}-${i}`; // Generate bucket key
            bucket[key] = 0; // Push key with value 0
        }

        return bucket;
    }

    /**
     * Generate bucket key using wordCount
     * @param {integer} wordCount
     * @returns {String}
     */
    generateKey(wordCount) {
        const { range, slab } = this.props; // Extract props

        let key = '';
        if (wordCount < slab) {
            key = `0-${slab}`;
        } else if (wordCount > range) {
            key = `${range}-Infinity`;
        } else {
            const startPorint = (Math.floor(wordCount / slab) * slab);
            key = `${startPorint}-${startPorint + slab}`
        }

        return key;
    }

    /**
     * Get Post Data from server API URL
     * @param {String} url 
     * @returns {Object} {bucketKey: wordCount}
     */
    async getPostData(url) {
        const { range, slab } = this.props; // Extract props
        const bucket = this.generateBucket(range, slab); // Generate bucket with range and slab between labels

        try {
            // Request to load data from server URL
            const resp = await axios.get(url);

            // If HTTP Status code is not 200 or data is empty then throw error
            if (resp.status !== 200 || resp.data.length === 0) {
                throw new Error('Unable to load data from remote URL');
            }

            // Iterate posts, count word of content and push into bucket
            resp.data.forEach(post => {
                bucket[this.generateKey(post.content.rendered.match(/\b\w+\b/g)?.length || 0, range, slab)] += 1;
            });

            return bucket;
        } catch (e) {
            console.error('Oops, Something went wrong.', e);
        }
    }

    /**
     * Load google chart library
     * @returns {HTMLScriptElement}
     */
    loadGoogleChartScript() {
         // If google file loaded already then return
        if (typeof window.google !== 'undefined') {
            return;
        }

        // Create Script element and set type and src
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://www.gstatic.com/charts/loader.js';

        document.body.appendChild(script); // Append script into document body

        return script;
    }

    /**
     * Generate google chart
     * @param {String} apiUrl
     * @returns {void} 
     */
    generateChart(apiUrl) {
        const { title, subtitle } = this.props; // Extract props
        const script = this.loadGoogleChartScript(); // Load google chart script

        // Wait until google chart script not loaded
        script.onload = () => {
            // Google chart configuration and generate the chart
            window.google.charts.load('current', { 'packages': ['corechart', 'bar'] });
            window.google.charts.setOnLoadCallback(async () => {
                try {
                    const bucket = await this.getPostData(apiUrl); // Load data from server
                    
                    // Initialize chart data
                    const chartData = [
                        ['Label', 'Count'],
                    ];

                    // Iterate bucket data and push into chart data
                    const bucketKeys = Object.keys(bucket); // Extract bucket keys
                    bucketKeys.forEach(key => {
                        chartData.push([key, bucket[key]]); // Pushing bucket data into chart data [bucketKey, wordCount]
                    })

                    const data = window.google.visualization.arrayToDataTable(chartData); // Converting chart data to DataTable
                    const btnRef = this.btnRef.current; // Button element reference
                    const chartRef = this.chartRef.current; // Chart element reference

                    // Material Chart Configuration
                    const materialOptions = {
                        width: 1200,
                        chart: {
                            title: title,
                            subtitle: subtitle
                        },
                        series: {
                            0: { axis: 'count' }, // Bind series 0 to an axis named 'count'.
                        },
                        axes: {
                            y: {
                                count: { label: 'No. of Items' }, // Left y-axis.
                            }
                        }
                    };

                    // Classical Chart Configuration
                    const classicOptions = {
                        width: 1200,
                        series: {
                            0: { targetAxisIndex: 0 },
                        },
                        title: title,
                        vAxes: {
                            0: { title: 'No. of Items' },  // Adds titles to each axis.
                        }
                    };

                    // Draw Material Chart
                    function drawMaterialChart() {
                        const materialChart = new window.google.charts.Bar(chartRef);
                        materialChart.draw(data, window.google.charts.Bar.convertOptions(materialOptions));
                        btnRef.innerText = 'Change to Classic';
                        btnRef.onclick = drawClassicChart;
                    }

                    // Draw Classic Chart
                    function drawClassicChart() {
                        const classicChart = new window.google.visualization.ColumnChart(chartRef);
                        classicChart.draw(data, classicOptions);
                        btnRef.innerText = 'Change to Material';
                        btnRef.onclick = drawMaterialChart;
                    }

                    drawMaterialChart(); // By Default drawing material chart
                } catch (e) {
                    console.error('Oops something went wrong.', e)
                }
            });
        }
    }

    componentDidMount() {
        this.generateChart(this.props.url); // Generate chart when component mounted
    }

    render() {
        return (
            <React.Fragment>
                <CssBaseline />
                <Container>
                    <Typography variant="h4">
                        {this.props.heading}
                    </Typography>
                    <Button
                        ref={this.btnRef}
                        variant="contained"
                        color="primary"
                    >
                        Loading...
                    </Button>
                    <div ref={this.chartRef}></div>
                </Container>
            </React.Fragment>
        );
    }
}
