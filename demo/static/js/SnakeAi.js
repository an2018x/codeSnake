// new_element = document.createElement("script");
// new_element.setAttribute("type", "text/javascript");
// new_element.setAttribute("src", "./js/if.js"); // 在这里引入了if.js
// document.body.appendChild(new_element);
(function() {
    window.SnakeAi = Class.extend({
        init: function() {
            this.bodyImg = new Image();
            this.bodyImg.src = "../static/img/body2.png";
            this.headImg = new Image();
            this.headImg.src = "../static/img/head1.png";
            this.snake = {
                head: null,
                snakeArray: [],
                direction: "right"
            };
            var snakeArray = [];
            for (var i = 0; i < 4; i++) {
                var sectionObj = this.createNewPart(20 * i, 200, 20, 20);
                snakeArray.unshift(sectionObj);
            }
            var head = snakeArray[0];
            this.snake.head = head;
            this.snake.snakeArray = snakeArray;
            // this.render();
        },
        update: function() {
            var snakeArray = this.snake.snakeArray;

            var modiy = this.createNewPart(this.snake.head.x, this.snake.head.y, 20, 20);
            snakeArray.splice(1, 0, modiy);
            switch (this.snake.direction) {
                case "up":
                    {
                        this.snake.head.y = this.snake.head.y - 20;
                        break;
                    }
                case "down":
                    {
                        this.snake.head.y = this.snake.head.y + 20;
                        break;
                    }
                case "left":
                    {
                        this.snake.head.x = this.snake.head.x - 20;
                        break;
                    }
                case "right":
                    {
                        this.snake.head.x = this.snake.head.x + 20;
                        break;
                    }
            }

            if (this.isEat()) {
                game.food.foods = game.food.createfood();
            } else {
                this.snake.snakeArray.pop();
            }
            if (this.gameOver()) {
                // cancelAnimationFrame(globalID);
                game.pause();
                $.get("data/", { 'name': 'jack', 'score': this.snake.snakeArray.length - 4 }, function(ret) {

                    })
                    // flag = 0;
                    // $("#gameScreen").hide();
                    // $("#start").show();
            }
        },
        createNewPart: function(x, y, w, h) {
            return {
                x: x,
                y: y,
                w: w,
                h: h
            }
        },
        draw: function(section) {
            game.ctx.drawImage(this.bodyImg, section.x - 3, section.y - 3, 26, 26);
        },
        render: function() {
            var snakeArray = this.snake.snakeArray;
            if (this.snake.direction == "left" || this.snake.direction == "right") {
                this.headImg.src = "../static/img/head1.png";
                game.ctx.drawImage(this.headImg, snakeArray[0].x - 3, snakeArray[0].y - 3, 26, 26);
            } else {
                this.headImg.src = "../static/img/head2.png";
                game.ctx.drawImage(this.headImg, snakeArray[0].x - 3, snakeArray[0].y - 3, 26, 26);
            }
            for (var i = 1; i < snakeArray.length; i++) {
                var section = snakeArray[i];
                this.draw(section);
            }
            // drwaGrid();
            this.drawGrid('black', 20, 20);
        },
        gameOver: function() {
            var canvasWidth = canvas.width;
            var canvasHeigh = canvas.height;
            var head = game.snakeai.snake.head;
            var my = game.snakeai.snake.snakeArray;
            if (head.x < 0 || head.y < 0 || head.x > canvasWidth - 20 || head.y > canvasHeigh - 20) {
                return true;
            }

            for (var i = 1; i < game.snakeai.snake.snakeArray.length; i++) {
                var section = game.snakeai.snake.snakeArray[i];
                if (section.x == head.x && section.y == head.y) {
                    return true;
                }
            }

            for (var i = 1; i < my.length; i++) {
                var section = my[i];
                if (section.x == head.x && section.y == head.y) {
                    return true;
                }
            }

            return false;
        },
        isEat: function() {
            if (game.food.foods.x == this.snake.head.x && game.food.foods.y == this.snake.head.y) {
                return true;
            } else {
                return false;
            }
        },
        drawGrid: function(color, stepx, stepy) {    
            //game.ctx.save();
            game.ctx.fillStyle = 'black';    
            // console.log(game.ctx);    
            // game.ctx.fillRect(0, 0, game.ctx.canvas.width, game.ctx.canvas.height);    
            game.ctx.lineWidth = 0.5;    
            game.ctx.strokeStyle = color;    
            for (var i = stepx; i < game.ctx.canvas.width; i += stepx) {        
                game.ctx.beginPath();        
                game.ctx.moveTo(i, 0);        
                game.ctx.lineTo(i, game.ctx.canvas.height);        
                game.ctx.closePath();        
                game.ctx.stroke();    
            }    
            for (var j = stepy; j < game.ctx.canvas.height; j += stepy) {        
                game.ctx.beginPath();        
                game.ctx.moveTo(0, j);        
                game.ctx.lineTo(game.ctx.canvas.width, j);        
                game.ctx.closePath();        
                game.ctx.stroke();    
            }    
        },
        ifmove: function() {
            // var codes = editor.getValue();
            // console.log(codes);
            // eval(codes);
            var move = this.if_getState();
            // if (move[0] == 1 || move[3] == 1) //前方危险（或身体或墙壁），转向
            // {
            //     if (move[0] == 1)
            //         this.turn_right();
            //     if (move[3] == 1)
            //         this.turn_left();
            //     if (move[1] == 1)
            //         this.turn_left();
            //     if (move[4] == 1)
            //         this.turn_right();
            // }
            if (move[0] == 1 || move[3] == 1) //前方危险（或身体或墙壁），转向
            {

                if (move[1] == 1 || move[4] == 1)
                    this.turn_left();
                else if (move[2] == 1 || move[5] == 1)
                    this.turn_right();
                else this.turn_right();
            }
            //move[10]+move[11]+move[12]+move[13] == 1确保只有一个方向有食物
            //move[1]+move[2]+move[4]+move[5]<2，蛇两侧危险（或身体或墙壁），不吃豆子
            //move[4]+move[5] == 0，蛇一侧危险，食物在另一侧，避免蛇去吃
            else if ((move[10] + move[11] + move[12] + move[13] == 1) && (move[1] + move[2] + move[4] + move[5] < 2) && (move[4] + move[5] == 0)) {
                if (move[10] == 1 && this.snake.direction != "right")
                // # 食物在左，且移动方向不为右
                    this.snake.direction = "left";
                else if (move[10] == 1 && this.snake.direction == "right")
                // # 食物在左，且移动方向为右
                    this.snake.direction = "down";
                else if (move[11] == 1 && this.snake.direction != "left")
                // # 食物在右，方向不为左
                    this.snake.direction = "right";
                else if (move[11] == 1 && this.snake.direction == "left")
                // # 食物在右，方向为左
                    this.snake.direction = "up";
                else if (move[12] == 1 && this.snake.direction != "down")
                // # 上
                    this.snake.direction = "up";
                else if (move[12] == 1 && this.snake.direction == "down")
                    this.snake.direction = "right";
                else if (move[13] == 1 && this.snake.direction != "up")
                // # 下
                    this.snake.direction = "down";
                else if (move[13] == 1 && this.snake.direction == "up")
                    this.snake.direction = "left";
            }
        },
        if_getState: function() {
            var arr = [];
            for (var i = 0; i < this.snake.snakeArray.length; i++) {
                arr.unshift([this.snake.snakeArray[i].x, this.snake.snakeArray[i].y]);
            }
            // 前方危险
            var x = (this.snake.direction == "right" && this.snake.head.x + 20 >= canvas.width) ||
                (this.snake.direction == "left" && this.snake.head.x - 20 < 0) ||
                (this.snake.direction == "up" && this.snake.head.y - 20 < 0) ||
                (this.snake.direction == "down" && this.snake.head.y + 20 >= canvas.height);
            // 右侧危险
            var y = (this.snake.direction == "right" && this.snake.head.y + 20 >= canvas.height) ||
                (this.snake.direction == "left" && this.snake.head.y - 20 < 0) ||
                (this.snake.direction == "up" && this.snake.head.x + 20 >= canvas.width) ||
                (this.snake.direction == "down" && this.snake.head.x - 20 < 0);
            // 左侧危险
            var z = (this.snake.direction == "right" && this.snake.head.y - 20 < 0) ||
                (this.snake.direction == "left" && this.snake.head.y + 20 >= canvas.height) ||
                (this.snake.direction == "up" && this.snake.head.x - 20 < 0) ||
                (this.snake.direction == "down" && this.snake.head.x + 20 >= canvas.width);

            // 身体碰撞前方危险
            var ahead = (this.snake.direction == "right" && this.headvarr(20, 0)) ||
                (this.snake.direction == "left" && this.headvarr(-20, 0)) ||
                (this.snake.direction == "up" && this.headvarr(0, -20)) ||
                (this.snake.direction == "down" && this.headvarr(0, 20));
            // 身体碰撞右侧危险
            var ri = (this.snake.direction == "right" && this.headvarr(0, 20)) ||
                (this.snake.direction == "left" && this.headvarr(0, -20)) ||
                (this.snake.direction == "up" && this.headvarr(20, 0)) ||
                (this.snake.direction == "down" && this.headvarr(-20, 0));
            // 身体碰撞左侧危险
            var le = (this.snake.direction == "right" && this.headvarr(0, -20)) ||
                (this.snake.direction == "left" && this.headvarr(0, 20)) ||
                (this.snake.direction == "up" && this.headvarr(-20, 0)) ||
                (this.snake.direction == "down" && this.headvarr(20, 0));


            var a = this.snake.direction == "left";
            var b = this.snake.direction == "right";
            var c = this.snake.direction == "up";
            var d = this.snake.direction == "down";


            var p = game.food.foods.x < this.snake.head.x;
            var q = game.food.foods.x > this.snake.head.x;
            var m = game.food.foods.y < this.snake.head.y;
            var n = game.food.foods.y > this.snake.head.y;

            var state = [x, y, z, ahead, le, ri, a, b, c, d, p, q, m, n];
            return state;
        },

        turn_left: function() {
            if (this.snake.direction == "left")
                this.snake.direction = "down";
            else if (this.snake.direction == "right")
                this.snake.direction = "up";
            else if (this.snake.direction == "up")
                this.snake.direction = "left";
            else if (this.snake.direction == "down")
                this.snake.direction = "right";
        },

        turn_right: function() {
            if (this.snake.direction == "left")
                this.snake.direction = "up";
            else if (this.snake.direction == "right")
                this.snake.direction = "down";
            else if (this.snake.direction == "up")
                this.snake.direction = "right";
            else if (this.snake.direction == "down")
                this.snake.direction = "left";
        },

        headvarr: function(m, n) {
            var flag = 0;
            for (var i = 0; i < this.snake.snakeArray.length; i++) {
                if ((this.snake.head.x + m == this.snake.snakeArray[i].x) && (this.snake.head.y + n == this.snake.snakeArray[i].y)) {
                    flag = 1;
                    break;
                }
            }
            for (var i = 0; i < this.snake.snakeArray.length; i++) {
                if ((this.snake.head.x + m == this.snake.snakeArray[i].x) && (this.snake.head.y + n == this.snake.snakeArray[i].y)) {
                    flag = 1;
                    break;
                }
            }
            var s = game.snakeai.snake.snakeArray;
            for (var i = 0; i < s.length; i++) {
                if ((this.snake.head.x + m == s[i].x) && (this.snake.head.y + n == s[i].y)) {
                    flag = 1;
                    break;
                }
            }
            return flag;
        }



    });
})();