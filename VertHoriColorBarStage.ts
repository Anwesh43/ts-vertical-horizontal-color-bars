const w : number = window.innerWidth, h : number = window.innerHeight
const size : number = 2 * Math.min(w, h) / 3
const colors : Array<string> = ["#673AB7", "#FF5722", "#1565C0", "#4CAF50", "#f44336"]
class VertHoriColorBarStage {

    canvas : HTMLCanvasElement = document.createElement('canvas')

    context : CanvasRenderingContext2D

    constructor() {
        this.initCanvas()
    }

    initCanvas() {
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = '#212121'
        this.context.fillRect(0, 0, w, h)
    }

    handleTap() {
        this.canvas.onmousedown = (event) => {
            
        }
    }
}
