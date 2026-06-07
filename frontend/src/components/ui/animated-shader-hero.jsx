import { useRef, useEffect } from 'react';

const defaultShaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}
float noise(in vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);float a=rnd(i),b=rnd(i+vec2(1,0)),c=rnd(i+vec2(0,1)),d=rnd(i+1.);return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
float fbm(vec2 p){float t=.0,a=1.;mat2 m=mat2(1.,-.5,.2,1.2);for(int i=0;i<5;i++){t+=a*noise(p);p*=2.*m;a*=.5;}return t;}
float clouds(vec2 p){float d=1.,t=.0;for(float i=.0;i<3.;i++){float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);t=mix(t,d,a);d=a;p*=2./(i+1.);}return t;}
void main(void){
  vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
  vec3 col=vec3(0);
  float bg=clouds(vec2(st.x+T*.5,-st.y));
  uv*=1.-.3*(sin(T*.2)*.5+.5);
  for(float i=1.;i<12.;i++){
    uv+=.1*cos(i*vec2(.1+.01*i,.8)+i*i+T*.5+.1*uv.x);
    vec2 p=uv;float d=length(p);
    col+=.00125/d*(cos(sin(i)*vec3(1,2,3))+1.);
    float b=noise(i+p+bg*1.731);
    col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
    col=mix(col,vec3(bg*.25,bg*.137,bg*.05),d);
  }
  O=vec4(col,1);
}`;

class WebGLRenderer {
  constructor(canvas, scale) {
    this.canvas = canvas;
    this.scale = scale;
    this.gl = canvas.getContext('webgl2');
    this.program = null;
    this.vs = null;
    this.fs = null;
    this.buffer = null;
    this.locs = {};
    this.shaderSource = defaultShaderSource;
    this.mouseMove = [0, 0];
    this.mouseCoords = [0, 0];
    this.pointerCoords = [0, 0];
    this.nbrOfPointers = 0;
    this.gl.viewport(0, 0, canvas.width * scale, canvas.height * scale);
    this.vertexSrc = `#version 300 es
      precision highp float;
      in vec4 position;
      void main(){gl_Position=position;}`;
    this.vertices = [-1, 1, -1, -1, 1, 1, 1, -1];
  }

  compile(shader, source) {
    const gl = this.gl;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader error:', gl.getShaderInfoLog(shader));
    }
  }

  reset() {
    const gl = this.gl;
    if (this.program && !gl.getProgramParameter(this.program, gl.DELETE_STATUS)) {
      if (this.vs) { gl.detachShader(this.program, this.vs); gl.deleteShader(this.vs); }
      if (this.fs) { gl.detachShader(this.program, this.fs); gl.deleteShader(this.fs); }
      gl.deleteProgram(this.program);
    }
  }

  setup() {
    const gl = this.gl;
    this.vs = gl.createShader(gl.VERTEX_SHADER);
    this.fs = gl.createShader(gl.FRAGMENT_SHADER);
    this.compile(this.vs, this.vertexSrc);
    this.compile(this.fs, this.shaderSource);
    this.program = gl.createProgram();
    gl.attachShader(this.program, this.vs);
    gl.attachShader(this.program, this.fs);
    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(this.program));
    }
  }

  init() {
    const gl = this.gl;
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(this.program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    this.locs.resolution = gl.getUniformLocation(this.program, 'resolution');
    this.locs.time = gl.getUniformLocation(this.program, 'time');
    this.locs.move = gl.getUniformLocation(this.program, 'move');
    this.locs.touch = gl.getUniformLocation(this.program, 'touch');
    this.locs.pointerCount = gl.getUniformLocation(this.program, 'pointerCount');
    this.locs.pointers = gl.getUniformLocation(this.program, 'pointers');
  }

  render(now = 0) {
    const gl = this.gl;
    if (!this.program || gl.getProgramParameter(this.program, gl.DELETE_STATUS)) return;
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.uniform2f(this.locs.resolution, this.canvas.width, this.canvas.height);
    gl.uniform1f(this.locs.time, now * 1e-3);
    gl.uniform2f(this.locs.move, ...this.mouseMove);
    gl.uniform2f(this.locs.touch, ...this.mouseCoords);
    gl.uniform1i(this.locs.pointerCount, this.nbrOfPointers);
    gl.uniform2fv(this.locs.pointers, this.pointerCoords);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  updateMove(d) { this.mouseMove = d; }
  updateMouse(c) { this.mouseCoords = c; }
  updatePointerCoords(c) { this.pointerCoords = c; }
  updatePointerCount(n) { this.nbrOfPointers = n; }
  updateScale(s) { this.scale = s; this.gl.viewport(0, 0, this.canvas.width * s, this.canvas.height * s); }
}

class PointerHandler {
  constructor(element, scale) {
    this.scale = scale;
    this.active = false;
    this.pointers = new Map();
    this.lastCoords = [0, 0];
    this.moves = [0, 0];
    const map = (el, sc, x, y) => [x * sc, el.height - y * sc];
    element.addEventListener('pointerdown', (e) => {
      this.active = true;
      this.pointers.set(e.pointerId, map(element, this.scale, e.clientX, e.clientY));
    });
    element.addEventListener('pointerup', (e) => {
      if (this.pointers.size === 1) this.lastCoords = this.first;
      this.pointers.delete(e.pointerId);
      this.active = this.pointers.size > 0;
    });
    element.addEventListener('pointerleave', (e) => {
      if (this.pointers.size === 1) this.lastCoords = this.first;
      this.pointers.delete(e.pointerId);
      this.active = this.pointers.size > 0;
    });
    element.addEventListener('pointermove', (e) => {
      if (!this.active) return;
      this.lastCoords = [e.clientX, e.clientY];
      this.pointers.set(e.pointerId, map(element, this.scale, e.clientX, e.clientY));
      this.moves = [this.moves[0] + e.movementX, this.moves[1] + e.movementY];
    });
  }
  get count() { return this.pointers.size; }
  get move() { return this.moves; }
  get coords() { return this.pointers.size > 0 ? Array.from(this.pointers.values()).flat() : [0, 0]; }
  get first() { return this.pointers.values().next().value || this.lastCoords; }
}

export function useShaderBackground() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const rendererRef = useRef(null);
  const pointersRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.max(1, 0.5 * window.devicePixelRatio);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    rendererRef.current = new WebGLRenderer(canvas, dpr);
    pointersRef.current = new PointerHandler(canvas, dpr);
    rendererRef.current.setup();
    rendererRef.current.init();

    const resize = () => {
      const d = Math.max(1, 0.5 * window.devicePixelRatio);
      canvas.width = window.innerWidth * d;
      canvas.height = window.innerHeight * d;
      rendererRef.current?.updateScale(d);
    };
    window.addEventListener('resize', resize);

    const loop = (now) => {
      const r = rendererRef.current;
      const p = pointersRef.current;
      if (r && p) {
        r.updateMouse(p.first);
        r.updatePointerCount(p.count);
        r.updatePointerCoords(p.coords);
        r.updateMove(p.move);
        r.render(now);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
      rendererRef.current?.reset();
    };
  }, []);

  return canvasRef;
}

export default function Hero({ trustBadge, headline, subtitle, buttons, className = '' }) {
  const canvasRef = useShaderBackground();
  return (
    <div className={`relative w-full h-screen overflow-hidden bg-black ${className}`}>
      <style>{`
        @keyframes fade-in-down { from { opacity:0; transform:translateY(-20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fade-in-up { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        .anim-fade-down { animation: fade-in-down 0.8s ease-out forwards; }
        .anim-fade-up { opacity:0; animation: fade-in-up 0.8s ease-out forwards; }
        .anim-d200 { animation-delay: 0.2s; }
        .anim-d400 { animation-delay: 0.4s; }
        .anim-d600 { animation-delay: 0.6s; }
        .anim-d800 { animation-delay: 0.8s; }
      `}</style>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full touch-none" style={{ background: 'black' }} />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white">
        {trustBadge && (
          <div className="mb-8 anim-fade-down">
            <div className="flex items-center gap-2 px-6 py-3 bg-orange-500/10 backdrop-blur-md border border-orange-300/30 rounded-full text-sm">
              {trustBadge.icons?.map((icon, i) => <span key={i}>{icon}</span>)}
              <span className="text-orange-100">{trustBadge.text}</span>
            </div>
          </div>
        )}
        <div className="text-center space-y-6 max-w-5xl mx-auto px-4">
          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-orange-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent anim-fade-up anim-d200">{headline.line1}</h1>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 bg-clip-text text-transparent anim-fade-up anim-d400">{headline.line2}</h1>
          </div>
          <div className="max-w-3xl mx-auto anim-fade-up anim-d600">
            <p className="text-lg md:text-xl lg:text-2xl text-orange-100/90 font-light leading-relaxed">{subtitle}</p>
          </div>
          {buttons && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 anim-fade-up anim-d800">
              {buttons.primary && (
                <button onClick={buttons.primary.onClick} className="px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105">
                  {buttons.primary.text}
                </button>
              )}
              {buttons.secondary && (
                <button onClick={buttons.secondary.onClick} className="px-8 py-4 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-300/30 text-orange-100 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                  {buttons.secondary.text}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
