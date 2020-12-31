var myLegend = document.getElementById("myLegend");
var myCanvas = document.getElementById("myCanvas");
myCanvas.width = 500;
myCanvas.height = 500;
 
var ctx = myCanvas.getContext("2d");
var myVinyls = {
    "Classical music": 10,
    "Alternative rock": 14,
    "Pop": 2,
    "Jazz": 12
};
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
            var slice_angle = 2 * Math.PI * val / total_value;
            
            drawPieSlice(
                this.ctx,
                this.canvas.width/2,
                this.canvas.height/2,
                Math.min(this.canvas.width/4,this.canvas.height/4),
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
            val = this.options.data[categ];
            slice_angle = 2 * Math.PI * val / total_value;
            var pieRadius = Math.min(this.canvas.width/2,this.canvas.height/2);
            var labelX = this.canvas.width/2 + (pieRadius) * Math.cos(start_angle + slice_angle/2);
            var labelY = this.canvas.height/2 + (pieRadius) * Math.sin(start_angle + slice_angle/2);
            var labelText = Math.round(100 * val / total_value);
            var lineXs = this.canvas.width/2 + (pieRadius/4) * Math.cos(start_angle + slice_angle/2);
            var lineYs = this.canvas.height/2 + (pieRadius/4) * Math.sin(start_angle + slice_angle/2);
            var lineXe = this.canvas.width/2 + (pieRadius*7/8) * Math.cos(start_angle + slice_angle/2);
            var lineYe = this.canvas.height/2 + (pieRadius*7/8) * Math.sin(start_angle + slice_angle/2);

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
                legendHTML += "<div><span style='display:inline-block;width:20px;background-color:"+this.colors[color_index++]+";'>&nbsp;</span> "+categ+"</div>";
            }
 
            this.options.legend.innerHTML = legendHTML;
 
        }
    }
}
var myPiechart = new Piechart(
    {
        canvas:myCanvas,
        data:myVinyls,
        colors:["#fde23e","#f16e23", "#57d9ff","#937e88"],
        legend:myLegend,
    }
);

myPiechart.draw();