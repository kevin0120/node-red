document.addEventListener("DOMContentLoaded", function (event) {
    // resize canvas to screen
    function resizeCanvas() {
        $("#container").css({
            "height": window.innerHeight - $("#toolbar").outerHeight(),
            "width": window.innerWidth
        });
    }

    $(window).resize(function () {
        resizeCanvas();
    });

    resizeCanvas();


    // implement message topic event
    var topic = window.location.pathname.replace('/', '');

    // connect to socket.io server
    var socket = io.connect(window.location.origin, {query: 'topic=' + topic});

    socket.on(topic, function (red) {
        console.log(red);

        // update chart dataset
        if (red.msg !== undefined) {
            if (!Array.isArray(red.msg.payload)) {
                var payload = [];
                payload.push(red.msg.payload);

                red.msg.payload = payload;
            }
            if (red.msg.result !== undefined) {
                document.getElementById('entity_id').value = red.msg.result.entity_id;
                document.getElementById('vin').value = red.msg.result.vin;
                document.getElementById('tool_sn').value = red.msg.result.tool_sn;
                document.getElementById('measure_result').value = red.msg.result.measure_result;
                document.getElementById('measure_torque').value = red.msg.result.measure_torque;
                document.getElementById('measure_angle').value = red.msg.result.measure_angle;
                document.getElementById('controller_name').value = red.msg.result.controller_name;
                document.getElementById('update_time').value = red.msg.result.update_time;
                document.getElementById('pset').value = red.msg.result.pset;
                document.getElementById('tightening_id').value = red.msg.result.tightening_id;

                document.getElementById('torque_min').value = red.msg.result.torque_min;
                document.getElementById('torque_max').value = red.msg.result.torque_max;
                document.getElementById('torque_target').value = red.msg.result.torque_target;
                document.getElementById('angle_min').value = red.msg.result.angle_min;
                document.getElementById('angle_max').value = red.msg.result.angle_max;
                document.getElementById('angle_target').value = red.msg.result.angle_target;

            }

            // initialize graph labels datasets
            // NOTES: the several series must have the same x axis distribution
            // get the first serial x axis
            chart.config.data.labels = [];

            red.msg.payload[0].dataset.forEach(item => {
                chart.config.data.labels.push(item.x);
            });

            chart.config.data.datasets = [];

            red.msg.payload.forEach((serie, i) => {
                var dataset = {
                    label: serie.channel,
                    backgroundColor: serie.color,
                    borderColor: serie.color,
                    data: [],
                    fill: false
                };

                serie.dataset.forEach(item => {
                    dataset.data.push(item.y);
                });

                chart.config.data.datasets.push(dataset);
            });

            // refresh chart
            chart.update();
        }

        // update chart configuration
        if (red.config !== undefined) {
            config.options.title.text = red.config.title;
            config.options.scales['xAxes'][0].scaleLabel.labelString = red.config.xaxis;
            config.options.scales['yAxes'][0].scaleLabel.labelString = red.config.yaxis;

            // refresh chart
            chart.update();
        }
    });

    // export event
    $(".dropdown-menu").on("click", "a", function (event) {
        // set a new white canvas to be exported
        destinationCanvas = document.createElement("canvas");
        destinationCanvas.width = canvas.width;
        destinationCanvas.height = canvas.height;

        var ctx = destinationCanvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(canvas, 0, 0);

        var canvasImg = destinationCanvas.toDataURL('image/png', 1.0);

        // export to image or pdf file
        if (event.target.id == 'image') {
            var link = document.createElement('a')

            link.download = 'image'
            link.href = canvasImg
            link.click()
        } else {
            var doc = new jsPDF('landscape');

            doc.addImage(canvasImg, 'JPEG', 10, 10, 280, 110);
            doc.save('canvas.pdf');
        }
    });

    // get canvas chart
    var canvas = document.getElementById('chart');
    var ctx = canvas.getContext('2d');

    // configure chart
    var config = {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Line Chart'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Item'
                    }
                }],
                yAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero: true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
                    }
                }]
            }
        }
    };

    // define global Chart Options and create chart
    Chart.defaults.global.defaultFontColor = 'grey';
    Chart.defaults.global.defaultFontSize = 16;

    var chart = new Chart(ctx, config);
});
