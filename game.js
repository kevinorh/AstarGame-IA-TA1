var canvas = document.getElementById("myCanvas");
var ctx= canvas.getContext("2d");

var level=1;

var grids=[]
var blockSize=40;
var num_col=(canvas.width/blockSize);
var num_row=(canvas.height/blockSize);
//------Mouse and keyboard
var clicX;
var clicY;
var rightPressed=false;
var leftPressed=false;
var upPressed=false;
var downPressed=false;
//-------
var human_position={
    x:99,
    y:99
}
var target={
	col:99,
	row:99
    }
var origin={
    col:0,
    row:0
}

var ended=false;
var iterations=0;

//DRAW FUNCTIONS
function drawMap(){
    var backcolor;
    var bordercolor="8B0000";
    for(c=0;c<num_col;c++){
		for(r=0;r<num_row;r++){		
			if(grids[c][r].type==1)
			{backcolor="#8B4513";}
			else if(grids[c][r].type==0)
			{backcolor="#F5F5DC";}
			
			ctx.beginPath();
            ctx.rect(c*blockSize,r*blockSize,blockSize,blockSize);            	
			ctx.fillStyle=backcolor;
            ctx.fill();	
            ctx.fillStyle=bordercolor;
            ctx.strokeRect(c*blockSize,r*blockSize,blockSize,blockSize)			
			ctx.closePath();			
			
			
		}
    }

}
function drawOrigin(){
    ctx.beginPath();
		ctx.rect(origin.col*blockSize,origin.row*blockSize,blockSize,blockSize);					
		ctx.fillStyle="#6495ED";
		ctx.fill();			
		ctx.fillStyle="#8B0000";
		ctx.strokeRect(origin.col*blockSize,origin.row*blockSize,blockSize,blockSize)
		ctx.closePath();
}
function drawTarget(){
	ctx.beginPath();
	ctx.rect(target.col*blockSize,target.row*blockSize,blockSize,blockSize);					
	ctx.fillStyle="#B22222";
	ctx.fill();			
	ctx.closePath();
}
function drawPath(num_keyDown){
		
	if(pathList.getPathList().length>1){ 
		if(num_keyDown==2){step=pathList.getFirts();}
		ctx.beginPath();
		ctx.rect(step.x*blockSize,step.y*blockSize,blockSize,blockSize);					
		ctx.fillStyle="#6495ED";
		ctx.fill();			
		ctx.fillStyle="#8B0000";
		ctx.strokeRect(step.x*blockSize,step.y*blockSize,blockSize,blockSize)
		ctx.closePath();}else{
		alert("GAME OVER"); 
        document.location.reload();
    }
	
}
function drawHumanPosition(){
	ctx.beginPath();
    ctx.rect(human_position.x*blockSize,human_position.y*blockSize,blockSize,blockSize);            	
	ctx.fillStyle="#7FFF00";
    ctx.fill();	
    ctx.fillStyle="#0000FF";
    ctx.strokeRect(human_position.x*blockSize,human_position.y*blockSize,blockSize,blockSize)			
	ctx.closePath();
}
function drawInstructions(){
	ctx.beginPath();
    ctx.rect(0,0,canvas.width,canvas.height);            	
	ctx.fillStyle="#F3F781";
    ctx.fill();			
    ctx.closePath();
    ctx.font="30px Comic Sans MS";
    ctx.fillStyle = "#0040FF";
    ctx.textAlign = "center";
    ctx.fillText("INTRUCTIONS:" , canvas.width/2, (canvas.height/2)-65);
    ctx.fillText("Move yourselft with the arrows of the keyboard" , canvas.width/2, canvas.height/2);    
    ctx.fillText("Who comes first to the red box WINS" , canvas.width/2, (canvas.height/2)+65);
}
//FINISH OF DRAW FUNCTIONS------------------------

function set_humanPosition(x,y){
    human_position.x=x;
    human_position.y=y;	
	drawHumanPosition();
}
function grid(x,y,type){
this.G=0x0;
this.H=0x0;
this.F=this.G+this.H;
this.x=x;
this.y=y;
this.list=0x0;
this.dad=0x0;
this.type=type;
}
function openList(){
    var opened=[];
    this.add=function(grid){
        grid.list="open";
        opened.push(grid);
    }
    this.getFirts=function(){
        var first=opened.splice(0,1)[0]; //splice(0,1) = at position 0 remove 1 item -> save that item 
        return first;//splice(position,#items,item(optional for add items/ repeat #items times))
    }
    this.sort=function() //Order opended list by F cost
        {
            opened.sort(function(a,b) {return a.F-b.F;});
        }
    this.contains=function(grid){
        return opened.indexOf(grid)<0?false:true;
    }
    this.getList=function(){
        return opened;
    }
    this.clearList=function(){
        opened.length=0;
    }
}
function closedList(){
        var closed=[];
        this.add=function(grid)
        {
            grid.list="closed";
            closed.push(grid);
        }
        this.contains=function(grid)
        {
            return closed.indexOf(grid)<0?false:true;
        }
        this.getList=function(){
            return closed;
        }
        this.clearList=function(){
            closed.length=0;
        }
    }
function pathList(){
    var path=[];
    this.add=function(grid){
        path.unshift(grid);
    }
    this.getPathList=function(){
        return path;
    }
    this.getFirts=function(){
        var first=path.splice(0,1)[0]; //splice(0,1) = at position 0 remove 1 item -> save that item 
        return first;//splice(position,#items,item(optional for add items/ repeat #items times))
    }
    this.clearList=function(){
        path.length=0;
    }
}
function getAdjacentGrids(grid){
var adjacent_grids=[]
for(var i=grid.x-1;i<=grid.x+1;i++)
        {
            for(var j=grid.y-1;j<=grid.y+1;j++)
            {
                try
                {
                    if(grids[i][j] && !(i==grid.x && j==grid.y)) //if grid exist and is diferent to parameter grid
                        adjacent_grids.push(this.grids[i][j]);
                }
                catch(ex) {}
            }
        }
        return adjacent_grids;
}

function copyMaphValues(_graph){
	for(c=0;c<num_col;c++){
        grids[c]=[];
		for(r=0;r<num_row;r++){
			grids[c].push(new grid(c,r,_graph[r][c]));
		}
	}
}


function updateManhattanValues(){ //All Manhattan Values Calculated except the origin
	for(c=0;c<num_col;c++){
		for(r=0;r<num_row;r++){			
            if(target.col<=num_col && target.row<=num_row){
				var dx=Math.abs(target.col-c)
				var dy=Math.abs(target.row-r)
                grids[c][r].H=(dx+dy)*10;			
            }                
		}
	}
}
function updateTotalCostValues(Gx,Gy){
    grids[Gx][Gy].F= grids[Gx][Gy].H+ grids[Gx][Gy].G;
}

function next(){    
    if(ended)return;
    iterations++;
    //Open first grid of openList
    var dad= open_list.getFirts();
    //Add the grid to closeList
    close_list.add(dad);
    //Obtain Adjacents
    var adjacents=getAdjacentGrids(dad);
    for(i=0;i<adjacents.length;i++){
        //Analyze each adjacent grid
        var grid=adjacents[i];
        if(grid.x==target.col&&grid.y==target.row){
            ended=true;
            grid.dad=dad;
            return grid;
        }
        //Exclusion
        if(grid.type==1)
        continue;
        if(close_list.contains(grid))
        continue;
        if(open_list.contains(grid)){
             //Change the dad and G,H,F if the current path is better
            var newG=parseInt(grid.x!=dad.x && grid.y!=dad.y? dad.G+14 : dad.G+10);
            if(grid.G<newG) //worse? ok, skip
                    continue;
        }
        //End of exclusion
        grid.dad=dad;
        //Cost to the origin
        grid.G=Math.round(parseInt(grid.x!=dad.x && grid.y!=dad.y? dad.G+14 : dad.G+10));
        updateTotalCostValues(grid.x,grid.y);
        open_list.add(grid)
    }
    open_list.sort();
}
function solve(){
    var last_cell=0x0;
        while(!ended)
            last_cell=this.next(true);
    this.getLastCell=function(){
        return last_cell;
    }
}
//Listeners------
//document.addEventListener("click", mouseClickHandler, false);
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
//--------------
var num_keyDown=0;
function keyDownHandler(e){	
	if(e.keyCode == 37){
        leftPressed = true;
        if(num_keyDown<=2 && human_position.x-1>=0 && grids[human_position.x-1][human_position.y].type!=1){
            human_position.x--
            num_keyDown++;
        }
	}
	else if(e.keyCode == 38){
        upPressed = true;
        if(num_keyDown<=2 && human_position.y-1>=0 && grids[human_position.x][human_position.y-1].type!=1){
            human_position.y--
            num_keyDown++;
        }
    }
    else if(e.keyCode == 39){
        rightPressed = true;
        if(num_keyDown<=2 && human_position.x+1<num_col && grids[human_position.x+1][human_position.y].type!=1){
            human_position.x++;
            num_keyDown++;
        }
    }
    else if(e.keyCode == 40){
        downPressed = true;
        if(num_keyDown<=2 && human_position.y+1<num_row  && grids[human_position.x][human_position.y+1].type!=1){
            human_position.y++;
            num_keyDown++;
        }
    }
	drawMap()
	drawTarget();
	drawHumanPosition();	    
	drawPath(num_keyDown)
    if((human_position.x==target.col) && (human_position.y==target.row))
    {alert("YOU WIN!!");
        if(level<=5){
            start();
        }else{
            alert("AWESOME YOU FINISHED THE GAME!!");
            document.location.reload();
        }
    }
    if(num_keyDown==2){    
    num_keyDown=0;
    }
}
function keyUpHandler(e){
	if(e.keyCode == 37){
		rightPressed = false;
	}
	else if(e.keyCode == 38){
		leftPressed = false;
    }
    else if(e.keyCode == 39){
		leftPressed = false;
    }
    else if(e.keyCode == 40){
		leftPressed = false;
	}
}


//init
var open_list=new openList();
var close_list=new closedList();
var pathList=new pathList()
var step;

function restar_values(){
    ended=false;
    iterations=0;
    //Restart grids values
    for(c=0;c<num_col;c++){
		for(r=0;r<num_row;r++){
            grids[c][r].G=0x0;
            grids[c][r].H=0x0;
            grids[c][r].F= grids[c][r].G+ grids[c][r].H;
            grids[c][r].list=0x0;
            grids[c][r].dad=0x0;
		}
    }
    //Restart lists values
    open_list.clearList();
    close_list.clearList();
    pathList.clearList();
    
    num_keyDown=0;
}
function changeLevel(level){
    
    switch(level){
        case 1:   
        copyMaphValues(graph1);
         //IA position
        origin.col=0;
        origin.row=0;
        //Human Position
        human_position.x=19;
        human_position.y=14;
        //Target position
        target.col=8;
        target.row=7;
        break;
        case 2: 
        restar_values();
        copyMaphValues(graph2);
        //IA position
       origin.col=19;
       origin.row=0;
       //Human Position
       human_position.x=19;
       human_position.y=14;
       //Target position
       target.col=9;
       target.row=6;
       break;

       case 3: 
        restar_values();
        copyMaphValues(graph3);
        //IA position
       origin.col=1;
       origin.row=13;
       //Human Position
       human_position.x=2;
       human_position.y=1;
       //Target position
       target.col=18;
       target.row=13;
       break;

       case 4: 
       restar_values();
       copyMaphValues(graph4);
       //IA position
      origin.col=3;
      origin.row=1;
      //Human Position
      human_position.x=18;
      human_position.y=1;
      //Target position
      target.col=10;
      target.row=14;
      break;

      case 5: 
        restar_values();
        copyMaphValues(graph5);
        //IA position
       origin.col=18;
       origin.row=1;
       //Human Position
       human_position.x=1;
       human_position.y=1;
       //Target position
       target.col=2;
       target.row=13;
       break;
}
drawMap()
drawHumanPosition()
drawTarget()
drawOrigin()
}

function start(){
    changeLevel(level);

    if(target.col<=num_col&&target.row<=num_row){
        updateManhattanValues();
        open_list.add(grids[origin.col][origin.row]);
        solve();
       //Save path in queue
        var pathGrid=getLastCell();
        do{
            pathList.add(pathGrid);
            pathGrid=pathGrid.dad;
        }while(pathGrid!=0);
		step=pathList.getFirts();
		//Draw origin
		ctx.beginPath();
		ctx.rect(step.x*blockSize,step.y*blockSize,blockSize,blockSize);					
		ctx.fillStyle="#6495ED";
		ctx.fill();			
		ctx.fillStyle="#8B0000";
		ctx.strokeRect(step.x*blockSize,step.y*blockSize,blockSize,blockSize)
		ctx.closePath();
        drawHumanPosition();
        drawTarget();
    }
    level++;
}
drawInstructions()


