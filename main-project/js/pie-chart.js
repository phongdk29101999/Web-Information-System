//get element
var chart = document.getElementsByClassName("chart");
var incomeLegend = document.getElementById("incomeLegend");
var incomeCanvas = document.getElementById("incomeCanvas");
var expenseLegend = document.getElementById("expenseLegend");
var expenseCanvas = document.getElementById("expenseCanvas");

if (localStorage.getItem('transactions') === null) {
    chart[0].style.display = "none";
    chart[1].style.display = "none";
}

// set height, width
incomeCanvas.width = 300;
incomeCanvas.height = 300;
expenseCanvas.width = 300;
expenseCanvas.height = 300;

// data
var incomeData = {
    'Award': 0,
    'Salary': 0,
    'Gifts': 0,
    'Selling': 0,
    'Interest Money': 0,
    'Others': 0,
};

var expenseData = {
    'Food & Beverage': 0,
    'Bills & Utilities': 0,
    'Transportation': 0,
    'Shopping': 0,
    'Entertainment': 0,
    'Travel': 0,
    'Health & Fitness': 0,
    'Friends & Love': 0,
    'Family': 0,
    'Education': 0,
    'Others': 0,
};

function resetData(myData) {
    for (data in myData){
        myData[data] = 0;
    }
}

function loadData(myData, type) {
    transactions.forEach(transaction => {
        for (data in myData){
            if (transaction.category_name == data && transaction.type == type){
                myData[data] += transaction.amount > 0 ? +transaction.amount : -transaction.amount;
            }
        }
    });
}

// console.log(incomeData);

function drawLine(ctx, startX, startY, endX, endY){
    ctx.beginPath();
    ctx.moveTo(startX,startY);
    ctx.lineTo(endX,endY);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#999';
    ctx.stroke();
}
function drawArc(ctx, centerX, centerY, radius, startAngle, endAngle){
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.stroke();
}
function drawPieSlice(ctx,centerX, centerY, radius, startAngle, endAngle, color ){
    ctx.fillStyle = color;
    // ctx.lineWidth = 1;
    // ctx.strokeStyle = '#333';
    ctx.beginPath();
    ctx.moveTo(centerX,centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    // ctx.stroke();
    ctx.closePath();
    ctx.fill();
}
var Piechart = function(options){
    this.options = options;
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.colors = options.colors;
 
    // draw pie chart
    this.draw = function(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        var total_value = 0;
        var color_index = 0;
        for (var categ in this.options.data){
            var val = this.options.data[categ];
            total_value += val;
        }
 
        var start_angle = 0;
        for (categ in this.options.data){
            val = this.options.data[categ];
            if (val == 0)
                continue;
            var slice_angle = 2 * Math.PI * val / total_value;
            
            drawPieSlice(
                this.ctx,
                this.canvas.width/2,
                this.canvas.height/2,
                Math.min(this.canvas.width/5,this.canvas.height/5),
                start_angle,
                start_angle+slice_angle,
                this.colors[color_index%this.colors.length]
            );
 
            start_angle += slice_angle;
            color_index++;
        }

        //add label for chart
        start_angle = 0;
        for (categ in this.options.data){
            if (this.options.data[categ] == 0)
                continue;
            val = this.options.data[categ];
            slice_angle = 2 * Math.PI * val / total_value;
            var pieRadius = Math.min(this.canvas.width/2,this.canvas.height/2);
            var labelX = this.canvas.width/2 + (pieRadius*9/10) * Math.cos(start_angle + slice_angle/2);
            var labelY = this.canvas.height/2 + (pieRadius*9/10) * Math.sin(start_angle + slice_angle/2);
            var labelText = Math.round(100 * val / total_value);
            var lineXs = this.canvas.width/2 + (pieRadius/5) * Math.cos(start_angle + slice_angle/2);
            var lineYs = this.canvas.height/2 + (pieRadius/5) * Math.sin(start_angle + slice_angle/2);
            var lineXe = this.canvas.width/2 + (pieRadius*3/4) * Math.cos(start_angle + slice_angle/2);
            var lineYe = this.canvas.height/2 + (pieRadius*3/4) * Math.sin(start_angle + slice_angle/2);
            // var iconX = this.canvas.width/2 + (pieRadius/5) * Math.cos(start_angle + slice_angle/2);
            // var iconY = this.canvas.height/2 + (pieRadius/5) * Math.sin(start_angle + slice_angle/2);
            // var iconDirtyX = this.canvas.width/2 + (pieRadius/5) * Math.cos(start_angle + slice_angle/2);
            // var iconDirtyY = this.canvas.height/2 + (pieRadius/5) * Math.sin(start_angle + slice_angle/2);

            this.ctx.fillStyle = "black";
            this.ctx.font = "bold 20px Arial";
            this.ctx.fillText(labelText+"%", labelX,labelY);
            drawLine(this.ctx, lineXs, lineYs, lineXe, lineYe)
            start_angle += slice_angle;
        }
        
        // comment for color
        if (this.options.legend){
            color_index = 0;
            var legendHTML = "";

            for (categ in this.options.data){
                if (this.options.data[categ] == 0)
                    continue;
                legendHTML += "<div><span style='display:inline-block;width:20px;background-color:"+this.colors[color_index++]+";'>&nbsp;</span> "+categ+"</div>";
            }
 
            this.options.legend.innerHTML = legendHTML;
 
        }
    }
}

function initChart() {
    if (localStorage.getItem('transactions') !== null) {
        chart[0].style.display = "flex";
        chart[1].style.display = "flex";
    }
    resetData(incomeData);
    resetData(expenseData);
    loadData(incomeData, "income");
    loadData(expenseData, "expense");
    
    var incomePiechart = new Piechart(
        {
            canvas:incomeCanvas,
            data:incomeData,
            colors:["#fde23e","#f16e23", "#57d9ff","#937e88"],
            legend:incomeLegend,
        }
    );
    
    incomePiechart.draw();
    
    var expensePiechart = new Piechart(
        {
            canvas:expenseCanvas,
            data:expenseData,
            colors:["#fde23e","#f16e23", "#57d9ff","#937e88"],
            legend:expenseLegend,
        }
    );
    
    expensePiechart.draw();
}

initChart();

form.addEventListener('submit', initChart);