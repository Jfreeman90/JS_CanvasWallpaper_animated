//get the canvas object from the html
const canvas=document.getElementById('canvas1')
const ctx= canvas.getContext('2d')

ctx.canvas.width=window.innerWidth
ctx.canvas.height=window.innerHeight

//distance between two points
function distance_between_two_points(x1, y1, x2, y2){
    return Math.sqrt((x1-x2)**2 + (y1-y2)**2)

}

let particleArray

//object to hold mouse position to allow the canvas to know where to not allow particles.
let mouse ={
    x:undefined,
    y: undefined,
    radius: 100
}

//get the current mouse position as an event listener
window.addEventListener('mousemove',
    function(event){
        mouse.x=event.x
        mouse.y=event.y
        //console.log('current mouse position - x ', mouse.x ,'current mouse position - y', mouse.y)
    }
)

//create particle class
class Particle{
    //create the particle
    constructor(x,y, direction_x, direction_y, size, colour){
        this.x=x
        this.y=y
        this.direction_x=direction_x
        this.direction_y=direction_y
        this.size=size
        this.colour=colour
    }
    //draw the particle
    draw(){
        ctx.beginPath()
        //draw the circle
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2, false)
        ctx.fillStyle=this.colour
        ctx.fill()
    }
    //check for particle position, check mouse positition, move the particle and draw it.
    update(){
        //check particle is still inside the window
        if(this.x + this.size > canvas.width || this.x - this.size < 0){
            this.direction_x = -this.direction_x
        }
        if(this.y + this.size > canvas.height || this.y - this.size < 0){
            this.direction_y = -this.direction_y
        }

        //check that the particle hasnt collided with the loction of the mouse.
        //distance between the particle center and mouse center
        let distance=distance_between_two_points(mouse.x, mouse.y, this.x, this.y)
        const buffer=10     //area around the edge of the canvas the particles wont touch
        //this is a collision being detected so determine where the particle is in relation to the mouse and move opposite direction
        if (distance < mouse.radius + this.size) {
            //
            if (mouse.x < this.x && this.x < canvas.width - this.size *buffer){
                this.x +=10
            }
            //
            if (mouse.x > this.x && this.x > this.size *buffer){
                this.x -=10
            }
            //
            if (mouse.y < this.y && this.y < canvas.height - this.size *buffer){
                this.y +=10
            }
            //
            if (mouse.y > this.y && this.y > this.size *buffer){
                this.y -=10
            }
        }
        //particles that arent currently colliding will just have x and y values updated in thier usual direction
        this.x +=this.direction_x
        this.y += this.direction_y
        //draw the updated particle in the given position
        this.draw()

    }

}


//create the initial conditions for the particles
function init(){
    particleArray=[]
    let colours=['#FFFFFF', '#FFFAFA', '#F0FFF0', '#F5FFFA', '#F0FFFF', '#F0F8FF', '#F8F8FF', '#F5F5F5', '#FFF5EE', '#F5F5DC', '#FDF5E6']
    for (let i=0; i<numberOfParticles; i++){
            //size of the balls here.
            let size=Math.random()*particle_max_size + particle_min_size
            let x=(Math.random()* (innerWidth-size*2))+size*2
            let y=(Math.random()* (innerHeight-size*2))-size*2
            //change here to change max speed of the balls
            let direction_x=(Math.random()*particle_speed)-particle_speed
            let direction_y=(Math.random()*particle_speed)-particle_speed
            let colour=colours[Math.floor(Math.random() * colours.length)]

             //add this particle into the array
            particleArray.push(new Particle(x, y, direction_x, direction_y, size, colour))
    }
}


//check if particles are close enough toghther to connect and draw a line between them if they are
function connect(){
    //opacaity of each line changes as particles move closer and further away
    let opacity=1
    for (let a=0; a<particleArray.length; a++){
        for(let b=a;  b<particleArray.length; b++){
            //check distance between the two points
            let distance = distance_between_two_points(particleArray[a].x, particleArray[a].y, particleArray[b].x, particleArray[b].y)
            //if the two points are close to each other in relation to the size of the canvas connect them
            if (distance < connecting_distance){
                opacity= 1 - (distance/100)
                ctx.strokeStyle='rgba(255,255,255,' + opacity +')'
                ctx.lineWidth=connecting_line_width
                ctx.beginPath()
                ctx.moveTo(particleArray[a].x, particleArray[a].y)
                ctx.lineTo(particleArray[b].x, particleArray[b].y)
                ctx.stroke()
            }

        }
    }
}


//animation loop
function animate(){
    requestAnimationFrame(animate)
    ctx.clearRect(0,0, innerWidth, innerHeight)
    for (let i=0; i< particleArray.length; i++){
        particleArray[i].update()
    }
    connect()
}

//initial conditions that can change how the screen looks
let numberOfParticles = (canvas.height *canvas.width)/5000
let connecting_distance=120
mouse.radius=100
let particle_speed=3
let particle_max_size=7
let particle_min_size=2
let connecting_line_width=2
//start and animate the balls
init()
animate()


//check for the window resizing and rescale the canvas when it does and re make the balls
window.addEventListener('resize', 
    function(){
        canvas.width=this.innerWidth
        canvas.height=this.innerHeight
        mouse.radius=100
        numberOfParticles = (canvas.height *canvas.width)/5000
        init()
    }
)

//check the mouse is off the screen
window.addEventListener('mouseout', 
    function(){
        mouse.x=undefined
        mouse.y=undefined
    }
)