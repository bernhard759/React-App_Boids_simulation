import { useRef, useEffect, useState, useCallback } from 'react'
import Boid from '../boids/Boids'
import "./Canvas.css"

function Canvas(props:
    {
        separation: number;
        alignment: number;
        cohesion: number;
        running: boolean;
        restart: boolean;
        setRestart: Function;
        boidNum: number;
        boidColor: string;
    }) {

    // Starter
    const starter = useRef(true);

    // Boids
    const [boids, setBoids] = useState<Array<Boid>>([]);

    // Param refs for updates of the looping draw
    const separationRef = useRef(props.separation);
    separationRef.current = props.separation;
    const alignmentRef = useRef(props.alignment);
    alignmentRef.current = props.alignment;
    const cohesionRef = useRef(props.cohesion);
    cohesionRef.current = props.cohesion;
    const boidColorRef = useRef(props.boidColor);
    boidColorRef.current = props.boidColor;

    // Animation frame ref
    const animation = useRef(0);

    // Canvas HTML element ref
    const canvasRef = useRef(null);


    // Prepare the canvas for drawing
    const prepareCanvas = useCallback((ctx: CanvasRenderingContext2D) => {
        // Clear the canvas
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        // Resize the canvas
        const { width, height } = ctx.canvas.getBoundingClientRect()
        if (ctx.canvas.width !== width || ctx.canvas.height !== height) {
            ctx.canvas.width = width;
            ctx.canvas.height = height;
        }
    }, [])


    // Draw a boid
    const drawBoid = useCallback((boid: Boid, ctx: CanvasRenderingContext2D, color: string) => {
        // Rounded position values for performant canvas drawing
        const drawPos = [Math.round(boid.pos[0]), Math.round(boid.pos[1])];
        // Velocity rotation
        ctx.save();
        ctx.translate(drawPos[0], drawPos[1]);
        ctx.rotate(Math.round(Math.atan2(boid.velocity[1], boid.velocity[0]) * 10) / 10);
        ctx.translate(-drawPos[0], -drawPos[1]);
        // Draw boid triangle
        ctx.beginPath();
        ctx.moveTo(drawPos[0] - 5, drawPos[1] - 5);
        ctx.lineTo(drawPos[0] + 6, drawPos[1]);
        ctx.lineTo(drawPos[0] - 5, drawPos[1] + 5);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
    }, []);


    // Draw boids
    const drawBoids = useCallback((ctx: CanvasRenderingContext2D) => {
        // Guard
        if (!props.running) {
            if (animation.current) cancelAnimationFrame(animation.current);
            return;
        }
        // Prepare canvas
        prepareCanvas(ctx);
        // Update velocity vector based on separation, cohesion and alignment
        // Calculate the velocity with the methods from the boid object
        boids.forEach((boid) => {
            const neighbors = boids.filter((b) => !Object.is(b, boid) && Boid.vecLen(Boid.subtractVector(boid.pos, b.pos)) < Boid.VISION);
            boid.step(neighbors, separationRef.current, alignmentRef.current, cohesionRef.current);
        });
        // New draw of the  boids
        boids.forEach((boid) => {
            drawBoid(boid, ctx, boidColorRef.current)
        })
        // Simulation loop
        animation.current = requestAnimationFrame(() => drawBoids(ctx));
    }, [props.running]);


    // Make starting boids at random position
    const makeStartBoids = useCallback((ctx: CanvasRenderingContext2D) => {
        // Create some boids
        const boids = [] as Array<Boid>;
        const posChecker = [] as Array<Array<number>>;
        let boidPos = [] as Array<number>;
        for (let i = 0; i < props.boidNum; i++) {
            boidPos = [Math.max(ctx.canvas.width * 0.05, Math.random() * ctx.canvas.width * 0.95),
            Math.max(ctx.canvas.height * 0.05, Math.random() * ctx.canvas.height * 0.95)];
            // Boids should not overlap
            while (posChecker.some((pos) => Math.abs(pos[0] - boidPos[0]) < ctx.canvas.width / 50 && Math.abs(pos[1] - boidPos[1]) < ctx.canvas.width / 50)) {
                boidPos = [Math.max(ctx.canvas.width * 0.05, Math.random() * ctx.canvas.width * 0.95),
                Math.max(ctx.canvas.height * 0.05, Math.random() * ctx.canvas.height * 0.95)]
            }
            posChecker.push(boidPos);
            boids.push(new Boid(ctx, boidPos[0], boidPos[1], 2));
        }
        boids.forEach((boid) => {
            drawBoid(boid, ctx, props.boidColor)
        });
        return boids;
    }, [props.boidNum, props.boidColor]);


    // Repaint
    useEffect(() => {
        // Do not repaint on mount
        if (starter.current) {
            starter.current = false;
            return;
        }
        // Canvas and context
        const canvas: HTMLCanvasElement = canvasRef.current!;
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
        // Prepare canvas
        prepareCanvas(ctx);
        // Draw boids with new color
        boids.forEach((boid) => {
            drawBoid(boid, ctx, props.boidColor);
        })
    }, [props.boidColor]);


    // Drawing
    useEffect(() => {
        // Do not draw on mount
        if (starter.current) {
            starter.current = false;
            return;
        }
        // Canvas and context
        const canvas: HTMLCanvasElement = canvasRef.current!;
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
        if (props.restart) {
            // Prepare canvas
            prepareCanvas(ctx);
            // Set boids state
            setBoids(makeStartBoids(ctx));
            props.setRestart(false);
        }
        // Start the simulation
        drawBoids(ctx);
    }, [props.running, props.restart]);


    // Start draw
    useEffect(() => {
        // Canvas and context
        const canvas: HTMLCanvasElement = canvasRef.current!;
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
        // Prepare canvas
        prepareCanvas(ctx);
        // Set boids state
        setBoids(makeStartBoids(ctx));
    }, []);


    // Markup
    return (
        <>
            {/* Boids simulation canvas */}
            <canvas ref={canvasRef} className="boids__area" />
        </>
    )
}

// Export
export default Canvas;