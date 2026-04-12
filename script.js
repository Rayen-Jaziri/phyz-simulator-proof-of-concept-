

console.log("hello world");
const body = document.getElementById("body");
const c = document.getElementById("canvas");
const ctx = c.getContext("2d");

const  display_width = 600;
const  display_height = 600;
const scale = 1;

c.style.width = display_width + "px";
c.style.height = display_height + "px";

c.width = display_width * scale;
c.height = display_height * scale;

let canvas_width = c.width;
let canvas_height = c.height;

let camera_x;
let camera_y;

let echelle_x_axis = 100;
let echelle_y_axis = 100;
const G = 1 //6.67*10**-11
const k = 9 * 10**-9

let objects = [
ball = {
    focus : true,
    color: "#03adfc",
    m : 10, //masse
    q : 0, //charge
    r : 15, //radius
    F : {      //net force
        x : 0,
        y : 0
    }, 
    v0 : {     // initial velocity
        x : 0,
        y : 1
    },
    pos : {    // initial position
        x : -50,
        y : 0
    },
    tail : {    //tail points
        x: [],
        y: []
    } 
},
sun = {
    focus : false,
    color: "rgb(241, 206, 76)",
    m : 50, //masse
    q : 0, //charge
    r : 25, //radius
    F : {      //net force
        x : 0,
        y : 0
    }, 
    v0 : {     // initial velocity
        x : 0,
        y : 0
    },
    pos : {    // initial position
        x : 0,
        y : 0
    },
    tail : {    //tail points
        x: [],
        y: []
    } 
},
ball2 = {
    focus : false,
    color: "rgb(241, 76, 241)",
    m : 10, //masse
    q : 0, //charge
    r : 20, //radius
    F : {      //net force
        x : 0,
        y : -1
    }, 
    v0 : {     // initial velocity
        x : 0,
        y : -1
    },
    pos : {    // initial position
        x : 50,
        y : 0
    },
    tail : {    //tail points
        x: [],
        y: []
    } }
]

refrech(0)
draw_axis();

function refrech (t){
    ctx.clearRect(0, 0, canvas_width, canvas_height);
    
    draw_axis();

    let k = 0;
    camera_x = 0;
    camera_y = 0;
    for (i in objects){
        if (objects[i].focus){
            camera_x += objects[i].pos.x;
            camera_y += objects[i].pos.y;
            k ++;
        }
    }
    if (k != 0){
        camera_x /= k;
        camera_y /= k;
    }

    for (thing of objects){
        // draw tail:
        let tail_Max = 100;
        thing.tail.x.push(thing.pos.x-camera_x);
        thing.tail.y.push(thing.pos.y-camera_y);
        /*
        if (thing.tail.x.length > tail_Max){
            thing.tail.x.shift();
            thing.tail.y.shift()
        }*/
        for (i in thing.tail.x){
            ctx.beginPath();
            ctx.arc(math_to_canvas_x(thing.tail.x[i]+camera_x), math_to_canvas_y(thing.tail.y[i]+camera_y), 1, 0, Math.PI * 2);
            ctx.fillStyle = thing.color;
            ctx.fill();
        }
        
        // calculations:
        thing.F.x = 0;
        thing.F.y = 0;

        for (ball of objects){
            if (ball != thing){
                phi = Math.atan2((ball.pos.y - thing.pos.y),(ball.pos.x - thing.pos.x));
                distance = Math.sqrt((ball.pos.x - thing.pos.x)**2 + (ball.pos.y - thing.pos.y)**2)
                F = (G*thing.m * ball.m)/(distance**2); //gravitational force

                F += -(k * thing.q * ball.q)/(distance**2); //electric force

                thing.F.x += F * Math.cos(phi);
                thing.F.y += F * Math.sin(phi);

            }
        }

        a_x = thing.F.x / thing.m;
        a_y = thing.F.y / thing.m;
        
        thing.pos.x += thing.v0.x * t + 0.5 * a_x * t*t;
        thing.pos.y += thing.v0.y * t + 0.5 * a_y * t*t;
        
        thing.v0.x += a_x * t;
        thing.v0.y += a_y * t;
    
        ctx.beginPath()
        ctx.arc(math_to_canvas_x(thing.pos.x) ,math_to_canvas_y(thing.pos.y), thing.r, 0, 2 * Math.PI);
        ctx.fillStyle = thing.color;
        ctx.fill();  
        
        draw_arrow(thing.pos.x, thing.pos.y, thing.F.x, thing.F.y, 70, "#c71d1d")
        draw_arrow(thing.pos.x, thing.pos.y, thing.v0.x, thing.v0.y, 10, "#25c71d")
    
    }
}


addEventListener("keydown", function(){
    t = 1; // what happens after 1s
    refrech(t)
})

function draw_arrow(x, y, value_x, value_y, echelle, color){
    let dx = x + value_x * echelle;
    let dy = y + value_y * echelle;
    
    let head_length = 1;
    let theta = Math.PI / 6;
    let phi = Math.atan((dy-y) / (dx-x)) + ((dx-x) >= 0? 0 : Math.PI);
    
    ctx.strokeStyle = color;    
    ctx.beginPath()
    ctx.moveTo(math_to_canvas_x(x), math_to_canvas_y(y));
    ctx.lineTo(math_to_canvas_x(dx), math_to_canvas_y(dy));
    ctx.stroke();

    let head_x = dx - head_length * Math.cos(theta + phi);
    let head_y = dy - head_length * Math.sin(theta + phi);
    
    ctx.lineTo(math_to_canvas_x(head_x), math_to_canvas_y(head_y));
    ctx.stroke();
    
    head_x = dx - head_length * Math.cos(-theta + phi);
    head_y = dy - head_length * Math.sin(-theta + phi);
    
    ctx.moveTo(math_to_canvas_x(dx), math_to_canvas_y(dy));
    ctx.lineTo(math_to_canvas_x(head_x), math_to_canvas_y(head_y));
    ctx.stroke();
}


function draw_axis(){
    axis_space_x = echelle_x_axis*2/5;
    axis_space_y = echelle_y_axis*2/5;
    
    ctx.beginPath();
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000"
    ctx.font = "15px Arial"
    ctx.moveTo(0, math_to_canvas_y(0));
    ctx.lineTo(canvas_width, math_to_canvas_y(0));
    ctx.stroke();
    ctx.fillText("0", repepre_number_x(0), math_to_canvas_y(0) + 20);

    ctx.moveTo(math_to_canvas_x(0), 0)
    ctx.lineTo(math_to_canvas_x(0), canvas_height);
    ctx.stroke();
    ctx.fillText("0", math_to_canvas_x(0) + 10, repepre_number_y(0));

    ctx.beginPath();
    ctx.strokeStyle = "#C0C0C0";
    ctx.fillStyle = "#C0C0C0";
    
    for (let i = Math.ceil(-echelle_y_axis + camera_y); i <= Math.ceil(echelle_y_axis + camera_y) + axis_space_y; i++){
      if (i % axis_space_y == 0 && i != 0){
        ctx.moveTo(0, math_to_canvas_y(i));
        ctx.lineTo(canvas_width, math_to_canvas_y(i));
        ctx.stroke();
        ctx.fillText(i.toString(), repepre_number_x(i), math_to_canvas_y(i)+20);
      }
    }
    for (let i = Math.ceil(-echelle_x_axis + camera_x)-axis_space_x; i <= Math.ceil(echelle_x_axis + camera_x); i++){
      if (i % axis_space_x == 0 && i != 0){
        ctx.moveTo(math_to_canvas_x(i), 0);
        ctx.lineTo(math_to_canvas_x(i), canvas_height); 
          ctx.stroke();
          ctx.fillText(i.toString(), math_to_canvas_x(i)+5, repepre_number_y(i));
    }
    
  }
  

}

function repepre_number_x (i) {
  if (math_to_canvas_x(0) < 0){
    return 10;
  }else if (math_to_canvas_x(0) > canvas_width) {
    return canvas_width - 30;
  }else{
    return math_to_canvas_x(0) + 10;
  }
}
function repepre_number_y (i) {
  if (math_to_canvas_y(0) < 0){
    return 20;
  }else if (math_to_canvas_y(0) > canvas_height) {
    return canvas_height - 10;
  }else{
    return math_to_canvas_y(0) + 20;
  }
}

function math_to_canvas_x(x){
    return canvas_width/2 + (canvas_width*(x - camera_x))/(echelle_x_axis*2)
}

function math_to_canvas_y(y){
    return canvas_height/2 - (canvas_height*(y - camera_y))/(echelle_y_axis*2)
}
