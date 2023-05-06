// Boid class
class Boid {
  ctx: CanvasRenderingContext2D;
  pos: Array<number>;
  velocity: number[];
  vision: number;
  separation: number;
  speed: number;

  // Boids vision
  static VISION = 50;
  

  // Vector addition
  static addVector(a: Array<number>, b: Array<number>) {
    return a.map((n: number, i: number) => n + b[i]);
  }

  // Vector subtraction
  static subtractVector(a: Array<number>, b: Array<number>) {
    return a.map((n: number, i: number) => n - b[i]);
  }

  // Vector Scalar multiplication
  static multVector(a: number, b: Array<number>) {
    return b.map((n: number) => a * n);
  }

  // Vector length
  static vecLen(a: Array<number>) {
    return Math.sqrt(a.map((el) => Math.pow(el, 2)).reduce(function (p, c) { return p + c; }, 0));
  }

  // Constructor
  constructor(ctx: CanvasRenderingContext2D, x: number, y: number, speed: number) {
    this.ctx = ctx;
    this.pos = [x, y];
    this.velocity = [Math.random() * 2 - 1, Math.random() * 2 - 1];
    this.vision = 20;
    this.separation = 40;
    this.speed = speed;
  }

  // Cohesion
  cohere(neighbors: Array<Boid>) {
    // Vector towards the center of the local neighbors
    let cohere = [0, 0];
    if (neighbors.length) {
      neighbors.forEach((neighbor) => {
        cohere = Boid.addVector(cohere, Boid.subtractVector(neighbor.pos, this.pos));
      })
      cohere = Boid.multVector(Number(1 / neighbors.length), cohere);
    }
    return cohere;
  }

  // Separation
  separate(neighbors: Array<Boid>) {
    // Vector away from the neighbors in vision
    let separation = [0, 0];
    if (neighbors) {
      neighbors.forEach((neighbor) => {
        if (Boid.vecLen(Boid.subtractVector(this.pos, neighbor.pos)) < this.separation) {
          separation = Boid.addVector(separation, Boid.subtractVector(this.pos, neighbor.pos));
        }
      })
    }
    return separation;
  }

  // Alignment
  align(neighbors: Array<Boid>) {
    // Vector towars the boids heading
    let align = [0, 0];
    if (neighbors) {
      neighbors.forEach((neighbor) => {
        align = Boid.addVector(align, neighbor.velocity);
      })
    }
    return align;
  }

  // Step
  step(neighbors: Array<Boid>, separateFactor: number, alignFactor: number, cohereFactor: number) {

    // Calculate the new velocity based on the params
    this.velocity = Boid.addVector(this.velocity, Boid.multVector(cohereFactor, this.cohere(neighbors)));
    this.velocity = Boid.addVector(this.velocity, Boid.multVector(alignFactor, this.align(neighbors)));
    this.velocity = Boid.addVector(this.velocity, Boid.multVector(separateFactor, this.separate(neighbors)));
    // Normalize the velocity vector
    this.velocity = Boid.multVector((1 / Boid.vecLen(this.velocity)), this.velocity);

    // New position
    let newPos = Boid.addVector(this.pos, Boid.multVector(this.speed, this.velocity));

    // Detect bounds and change direction
    if ((newPos[0] < 0 + 2.5 || newPos[0] > this.ctx.canvas.width - 2.5)) {
      this.velocity[0] *= -1;
      newPos = Boid.addVector(this.pos, Boid.multVector(this.speed, this.velocity));
    } else if ((newPos[1] < 0 + 2.5 || newPos[1] > this.ctx.canvas.height - 2.5)) {
      this.velocity[1] *= -1;
      newPos = Boid.addVector(this.pos, Boid.multVector(this.speed, this.velocity));
    }

    // Update position
    this.pos = newPos;
  }
}

export default Boid;