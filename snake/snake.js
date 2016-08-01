/**
 * Created by lc on 2016/7/22.
 */
var Grid={
    create:function(p_rows,p_cols,p_container){
        var obj={};
        obj.rows=p_rows;
        obj.cols=p_cols;
       //创建map
        (function(){
            if(typeof p_container == "string"){
                var container=document.getElementById(p_container);
            }
            else{
                var container=p_container;
            }
           var map=document.createElement("table");
            map.className="grid";
            for(var rowCount= 0;rowCount<obj.rows;rowCount++){
                var row=document.createElement("tr");
                for(var colCount=0;colCount<obj.cols;colCount++){
                    var col=document.createElement("td");
                    col.id="r"+rowCount+"c"+colCount;
                    row.appendChild(col);
                }
                map.appendChild(row);
            }
            container.appendChild(map);
        })();

        //绘制地图上的点
        //@param int x 横坐标(0-rows-1)
        //@param int y 纵坐标(0-cols-1)
        obj.drawBody=function(x,y){
            var snakeBody = document.getElementById("r"+y+"c"+x);
            snakeBody.className="snakeBody";
        };

        obj.drawFood=function(x,y){
            var foodDot = document.getElementById("r"+y+"c"+x);
            foodDot.className="foodDot";
        };
        obj.drawHead = function(x,y,d)
        {
            var head = document.getElementById("r"+y+"c"+x);
            head.className = "snakeHead"+d;
        };
        //清除点

        obj.easeDot=function(x,y){
            var dot=document.getElementById("r"+y+"c"+x);
            dot.className="";

        };
        //清除地图上的所有点
        obj.clear=function(){
            var dots=document.getElementsByClassName("snakeBody");
            for(var i in dots){
               dots[i].className="";
            }
            var food = document.getElementsByClassName("foodDot");
            for(var f in food)
            {
                food[f].className = "";
            }

        };
        return obj;
    }
};

//构造贪吃蛇
var Snake= {
    create: function (p_grid, p_length, p_speed) {
        var obj = {};
        var grid = p_grid;
        var length = p_length || 4;
        var speed = p_speed || 500;
        var minSpeed = 100;
        var direction;
        var food;
        var snakeBody;
        var interval = null;
        var operations = [];
        var directions = {
            "37": {operation: 'l', oppsite: 'r'},
            "38": {operation: 'u', oppsite: 'd'},
            "39": {operation: 'r', oppsite: 'l'},
            "40": {operation: 'd', oppsite: 'u'}
        };


        var foodCreate = function () {
            var food = {};

            function foodOK() {
                for (var i = 0; i < snakeBody.length; i++) {
                    if (food.x == snakeBody[i].x && food.y == snakeBody[i].y) {
                        return false;
                    }
                }
                return true;

            }
            do {
                food.x = Math.floor(Math.random() * grid.rows);
                food.y = Math.floor(Math.random() * grid.cols);
            } while (!foodOK());
            grid.drawFood(food.x, food.y);
            return food;
        };

        //判断蛇是否存活
        var isAlive = function () {
            var isAlive = true;
            for (var i = 1; i < snakeBody.length; i++) {
                if (snakeBody[0].x === snakeBody[i].x && snakeBody[0].y === snakeBody[i].y) {
                    isAlive = false;
                }
            }
            if (snakeBody[0].x < 0 || snakeBody[0].y < 0 || snakeBody[0].y > grid.rows - 1 || snakeBody[0].x > grid.cols - 1) {
                isAlive = false;
            }
            if (!isAlive) {
                clearInterval(interval);
            }
            return isAlive;
        };
        //蛇行进方向

        var forward = function () {
            direction = operations.pop() || direction;
            var head;
            switch (direction) {
                case "l":
                    head = {x: snakeBody[0].x - 1, y: snakeBody[0].y};
                    break;
                case "u":
                    head = {x: snakeBody[0].x, y: snakeBody[0].y - 1};
                    break;
                case "r":
                    head = {x: snakeBody[0].x + 1, y: snakeBody[0].y};
                    break;
                case "d":
                    head = {x: snakeBody[0].x, y: snakeBody[0].y + 1};
                    break;
            }

            snakeBody.unshift(head);
            if (!isAlive()) {
                if (confirm("Game over!\n Play agin?")) {
                 //   grid.clear();
                    snakeBody.shift();
                    for(var i in snakeBody)
                        grid.easeDot(snakeBody[i].x,snakeBody[i].y);
                    grid.easeDot(food.x,food.y);
                    init();
                }
                return;
            }

           grid.drawBody(snakeBody[1].x,snakeBody[1].y);
            grid.drawHead(snakeBody[0].x, snakeBody[0].y,direction);

            //判断吃食物，处理蛇尾
            if (head.x == food.x && head.y == food.y) {
                food = foodCreate();
                speed > minSpeed ? speed -= 50 : speed;
                clearInterval(interval);
                interval = setInterval(forward.bind(obj), speed);
            }
            else {
                var tail = snakeBody.pop();
                grid.easeDot(tail.x, tail.y);
            }
        };
        //初始化
        var init=function(){
            direction = "r";
            snakeBody=[];
            food=foodCreate();
            speed = 500;
          //  grid.clear();
            //初始化蛇身
            for(var i=0;i<length;i++){
                snakeBody.unshift({x:i,y:0});
                grid.drawBody(i,0);
            }
           //绘制蛇头
            grid.drawHead(snakeBody[0].x,snakeBody[0].y,direction);
            //监听键盘事件，加入队列
            document.onkeydown=function(e){
                var e=e||window.event;
                e.preventDefault();
                if(!directions[e.keyCode]) return;
                var operation=directions[e.keyCode];
                if((operations[0] !==operation.operation && operations[0]!==operation.oppsite) && (operation[0]||(direction!==operation.oppsite&&direction!==operation.operation))){
                    operations.unshift(operation.operation);
                }
            };
            interval=setInterval(forward.bind(obj),speed);
        };
        init();
        return obj;
    }
};
