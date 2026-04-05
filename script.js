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


let echelle_x_axis = 50;
let echelle_y_axis = 50;


let objects = [
    ball = {
    color: "#03adfc",
    m : 10, //masse
    r : 15, //radius
    F : {      //net force
        x : 0,
        y : -3
    }, 
    v0 : {     // initial velocity
        x : 2,
        y : 4
    },
    pos : {    // initial position
        x : -30,
        y : 0
    },
    tail : {    //tail points
        x: [],
        y: []
    } 
}
]


refrech(0)

function refrech (t){
    ctx.clearRect(0, 0, canvas_width, canvas_height);
    // draw tail
    for (thing of objects){
        let tail_Max = 100;
        thing.tail.x.push(thing.pos.x);
        thing.tail.y.push(thing.pos.y);
        if (thing.tail.x.length > tail_Max){
            thing.tail.x.shift();
            thing.tail.y.shift()
        }
        for (i in thing.tail.x){
            ctx.beginPath();
            ctx.arc(math_to_canvas_x(thing.tail.x[i]), math_to_canvas_y(thing.tail.y[i]), 1, 0, Math.PI * 2);
            ctx.fillStyle = "#000000";
            ctx.fill();
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
        
        draw_arrow(thing.pos.x, thing.pos.y, thing.F.x, thing.F.y, 5, "#c71d1d")
        draw_arrow(thing.pos.x, thing.pos.y, thing.v0.x, thing.v0.y, 5, "#25c71d")
    
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

function math_to_canvas_x(x){
    return canvas_width/2 + (canvas_width*x)/(echelle_x_axis*2)
}

function math_to_canvas_y(y){
    return canvas_height/2 - (canvas_height*y)/(echelle_y_axis*2)
}