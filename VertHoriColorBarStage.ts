const w : number = window.innerWidth, h : number = window.innerHeight
const size : number = 2 * Math.min(w, h) / 3
const colors : Array<string> = ["#673AB7", "#FF5722", "#1565C0", "#4CAF50", "#f44336"]
class VertHoriColorBarStage {

    canvas : HTMLCanvasElement = document.createElement('canvas')

    context : CanvasRenderingContext2D

    container : VHCBarContainer = new VHCBarContainer()

    animator : VHCAnimator = new VHCAnimator()

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
        this.container.draw(this.context)
    }

    handleTap() {
        this.canvas.onmousedown = (event) => {
            this.container.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.container.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}

class VHCState {

    scale : number = 0

    dir : number = 0

    prevScale : number = 0

    update(stopcb : Function) {
        this.scale += 0.1 * this.dir
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            stopcb()
        }
    }

    startUpdating(startcb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            startcb()
        }
    }
}

class VHCAnimator {

    animated : boolean = false

    interval : number

    start(updatecb : Function) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(() => {
                updatecb()
            }, 50)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}

class VHCBar {

    state : VHCState = new VHCState()

    constructor(private i : number) {

    }

    draw(context : CanvasRenderingContext2D) {
        const barSize : number = size / colors.length
        context.fillStyle = colors[this.i]
        const x : number = this.i * barSize + barSize / 2, y : number = this.i * barSize + barSize / 2
        const length : number = (w - (this.i + 1) * barSize)
        context.save()
        context.translate(x, y)
        const barSizeUpdated = barSize * this.state.scale
        context.fillRect(-barSizeUpdated/2, -barSizeUpdated/2, barSizeUpdated, barSizeUpdated)
        for (var i = 0; i < 2; i++) {
            context.save()
            context.rotate(Math.PI/2 * i)
            context.fillRect(barSize/2, -barSize/2, length * this.state.scale, barSize)
            context.restore()
        }
        context.restore()
    }

    update(stopcb : Function) {
        this.state.update(stopcb)
    }

    startUpdating(startcb : Function) {
        this.state.startUpdating(startcb)
    }

}

class VHCBarContainer {

    vhcBars : Array<VHCBar> = []

    state : ContainerState = new ContainerState()

    constructor () {
        this.initVHCBars()
    }

    initVHCBars() {
        for (var i = 0; i < colors.length; i++) {
            this.vhcBars.push(new VHCBar(i))
        }
    }

    draw(context : CanvasRenderingContext2D) {
        this.vhcBars.forEach((vhcBar : VHCBar) => {
            vhcBar.draw(context)
        })
    }

    update(stopcb : Function) {
        this.state.execute((j : number) => {
            this.vhcBars[j].update(() => {
                this.state.incrementCounter()
                stopcb()
            })
        })
    }

    startUpdating(startcb : Function) {
        this.state.execute((j : number) => {
            this.vhcBars[j].startUpdating(startcb)
        })
    }
}

class ContainerState {

    j : number = 0

    dir : number = 1

    incrementCounter() {
        this.j += this.dir
        if (this.j == colors.length || this.j == -1) {
            this.dir *= -1
            this.j -= this.dir
        }
    }

    execute(cb : Function) {
        if (this.j < colors.length) {
            cb(this.j)
        }
    }

}
