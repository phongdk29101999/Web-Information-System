// local storage transactions
const localStorageTransactions = JSON.parse(
    localStorage.getItem('transactions')
);

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

//local storage url
const localStorageUrl = JSON.parse(
    localStorage.getItem('url')
);
let url = localStorage.getItem('url') !== null ? localStorageUrl : '';

//set Title
if (url !== null)
    document.title = url;

function backHome() {
    window.location.href = 'index.html';
}
var myLegend = document.getElementById("myLegend");
var myCanvas = document.getElementById("myCanvas");
myCanvas.width = 500;
myCanvas.height = 500;

var ctx = myCanvas.getContext("2d");
var myData = {};
if (url == "income") {
    myData = {
        'Award': 0,
        'Salary': 0,
        'Gifts': 0,
        'Selling': 0,
        'Interest Money': 0,
        'Others': 0,
    };
} else {
    myData = {
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
}

transactions.forEach(transaction => {
    for (data in myData){
        if (transaction.category_name == data && transaction.type == url){
            console.log(data);
            myData[data] += transaction.amount > 0 ? +transaction.amount : -transaction.amount;
        }
    }
});
// console.log(myData);

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
var myPiechart = new Piechart(
    {
        canvas:myCanvas,
        data:myData,
        colors:["#fde23e","#f16e23", "#57d9ff","#937e88"],
        legend:myLegend,
    }
);

myPiechart.draw();