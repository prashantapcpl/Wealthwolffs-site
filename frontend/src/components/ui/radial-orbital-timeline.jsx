import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Link, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Navy/gold shader adapted for Wealthwolffs theme
const SHADER_SRC = `#version 300 es
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
  float bg=clouds(vec2(st.x+T*.25,-st.y));
  uv*=1.-.25*(sin(T*.15)*.5+.5);
  for(float i=1.;i<10.;i++){
    uv+=.07*cos(i*vec2(.12+.01*i,.85)+i*i+T*.3+.07*uv.x);
    vec2 p=uv;float d=length(p);
    col+=.0012/d*(cos(sin(i)*vec3(2.2,3.0,4.5))+1.)*vec3(0.4,0.7,1.2);
    float b=noise(i+p+bg*1.6);
    col+=.0007*b/length(max(p,vec2(b*p.x*.02,p.y)))*vec3(1.5,1.1,0.4);
    col=mix(col,vec3(bg*.0,bg*.03,bg*.12),d);
  }
  col+=vec3(0.025,0.063,0.137);
  col=clamp(col,0.0,1.0);
  O=vec4(col,1);
}`;

function useOrbitalShader(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl2');
    if (!gl) return;

    const resize = () => {
      const dpr = Math.max(1, 0.5 * window.devicePixelRatio);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const mkShader = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const prog = gl.createProgram();
    gl.attachShader(prog, mkShader(gl.VERTEX_SHADER, `#version 300 es
      precision highp float; in vec4 position;
      void main(){gl_Position=position;}`));
    gl.attachShader(prog, mkShader(gl.FRAGMENT_SHADER, SHADER_SRC));
    gl.linkProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,-1,-1,1,1,1,-1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'resolution');
    const uTime = gl.getUniformLocation(prog, 'time');

    let raf;
    const render = (t) => {
      gl.useProgram(prog);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t * 1e-3);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, [canvasRef]);
}

export default function RadialOrbitalTimeline({ timelineData }) {
  const [expandedItems, setExpandedItems] = useState({});
  const [rotationAngle, setRotationAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [pulseEffect, setPulseEffect] = useState({});
  const [activeNodeId, setActiveNodeId] = useState(null);
  const containerRef = useRef(null);
  const orbitRef = useRef(null);
  const shaderCanvasRef = useRef(null);
  const nodeRefs = useRef({});

  useOrbitalShader(shaderCanvasRef);

  const handleContainerClick = (e) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const getRelatedItems = (itemId) => {
    const item = timelineData.find((i) => i.id === itemId);
    return item ? item.relatedIds : [];
  };

  const centerViewOnNode = (nodeId) => {
    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const targetAngle = (nodeIndex / timelineData.length) * 360;
    setRotationAngle(270 - targetAngle);
  };

  const toggleItem = (id) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) newState[parseInt(key)] = false;
      });
      newState[id] = !prev[id];
      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);
        const newPulse = {};
        getRelatedItems(id).forEach((relId) => { newPulse[relId] = true; });
        setPulseEffect(newPulse);
        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }
      return newState;
    });
  };

  useEffect(() => {
    if (!autoRotate) return;
    const timer = setInterval(() => {
      setRotationAngle((prev) => Number(((prev + 0.3) % 360).toFixed(3)));
    }, 50);
    return () => clearInterval(timer);
  }, [autoRotate]);

  const calculateNodePosition = (index, total) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radian = (angle * Math.PI) / 180;
    const radius = 210;
    return {
      x: radius * Math.cos(radian),
      y: radius * Math.sin(radian),
      zIndex: Math.round(100 + 50 * Math.cos(radian)),
      opacity: Math.max(0.45, Math.min(1, 0.45 + 0.55 * ((1 + Math.sin(radian)) / 2))),
    };
  };

  const isRelatedToActive = (itemId) => {
    if (!activeNodeId) return false;
    return getRelatedItems(activeNodeId).includes(itemId);
  };

  const getStatusStyles = (status) => {
    if (status === 'completed') return 'text-white bg-[#003B5C] border-[#003B5C]';
    if (status === 'in-progress') return 'text-[#7A5C35] bg-[#F0EBE1] border-[#C4A47C]';
    return 'text-white bg-red-600 border-red-600';
  };

  return (
    <div
      className="w-full h-full flex items-center justify-center overflow-hidden relative"
      style={{ background: '#0A192F' }}
      ref={containerRef}
      onClick={handleContainerClick}
    >
      {/* Shader background canvas */}
      <canvas
        ref={shaderCanvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block', pointerEvents: 'none' }}
      />

      {/* Orbital layer — above shader */}
      <div className="relative w-full h-full flex items-center justify-center z-10">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{ perspective: '1000px' }}
        >
          {/* Center orb */}
          <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-[#003B5C] via-[#005082] to-[#C4A47C] animate-pulse flex items-center justify-center z-10">
            <div className="absolute w-20 h-20 rounded-full border border-white/15 animate-ping opacity-60" />
            <div className="absolute w-28 h-28 rounded-full border border-[#C4A47C]/10 animate-ping opacity-40" style={{ animationDelay: '0.6s' }} />
            <div className="w-8 h-8 rounded-full bg-white/90" />
          </div>

          {/* Orbit ring */}
          <div className="absolute w-[420px] h-[420px] rounded-full border border-white/8" style={{ borderColor: 'rgba(255,255,255,0.08)' }} />

          {timelineData.map((item, index) => {
            const pos = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                ref={(el) => (nodeRefs.current[item.id] = el)}
                className="absolute transition-all duration-700 cursor-pointer"
                style={{
                  transform: `translate(${pos.x}px, ${pos.y}px)`,
                  zIndex: isExpanded ? 200 : pos.zIndex,
                  opacity: isExpanded ? 1 : pos.opacity,
                }}
                onClick={(e) => { e.stopPropagation(); toggleItem(item.id); }}
              >
                {/* Energy glow */}
                <div
                  className={`absolute rounded-full ${pulseEffect[item.id] ? 'animate-pulse' : ''}`}
                  style={{
                    background: isExpanded
                      ? 'radial-gradient(circle, rgba(196,164,124,0.25) 0%, transparent 70%)'
                      : 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
                    width: `${item.energy * 0.4 + 48}px`,
                    height: `${item.energy * 0.4 + 48}px`,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                />

                {/* City name — ABOVE node */}
                <div className={`
                  absolute -top-8 left-1/2 -translate-x-1/2
                  whitespace-nowrap text-[10px] font-semibold tracking-[0.18em] uppercase
                  transition-colors duration-300
                  ${isExpanded ? 'text-[#C4A47C]' : 'text-[#C4A47C]/70'}
                `}>
                  {item.date}
                </div>

                {/* Node circle */}
                <div className={`
                  w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${isExpanded
                    ? 'bg-white text-[#003B5C] border-white scale-150 shadow-xl shadow-white/20'
                    : isRelated
                    ? 'bg-[#C4A47C]/25 text-[#C4A47C] border-[#C4A47C] animate-pulse'
                    : 'bg-white/12 text-white/80 border-white/25 hover:bg-white/20 hover:border-white/50'
                  }
                `}
                style={isExpanded ? {} : { backdropFilter: 'blur(4px)' }}>
                  <Icon size={17} />
                </div>

                {/* Index name — BELOW node (180° from city label) */}
                <div className={`
                  absolute top-[52px] left-1/2 -translate-x-1/2
                  whitespace-nowrap text-[11px] font-semibold tracking-wider
                  transition-colors duration-300
                  ${isExpanded ? 'text-white' : 'text-white/65'}
                `}>
                  {item.title}
                </div>

                {/* Expanded card */}
                {isExpanded && (
                  <Card className="absolute top-[72px] left-1/2 -translate-x-1/2 w-52 bg-[#0F1E30] border-white/15 shadow-2xl overflow-visible">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-white/20" />
                    <CardHeader className="pb-1 px-4 pt-3">
                      <div className="flex justify-between items-center gap-2">
                        <Badge className={`px-2 py-0 text-[10px] ${getStatusStyles(item.status)}`}>
                          {item.status === 'completed' ? '▲ UP' : item.status === 'in-progress' ? '◆ FLAT' : '▼ DOWN'}
                        </Badge>
                        <span className="text-[10px] font-mono text-white/50 shrink-0">{item.date}</span>
                      </div>
                      <CardTitle className="text-sm mt-1.5 text-white">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-white/60 px-4 pb-3">
                      <p className="leading-relaxed">{item.content}</p>
                      <div className="mt-3 pt-2.5 border-t border-white/10">
                        <div className="flex justify-between items-center mb-1">
                          <span className="flex items-center gap-1 text-white/50">
                            <Zap size={9} className="text-[#C4A47C]" />
                            Momentum
                          </span>
                          <span className="font-mono text-[#C4A47C] text-[10px]">{item.energy}%</span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#003B5C] to-[#C4A47C]"
                            style={{ width: `${item.energy}%` }}
                          />
                        </div>
                      </div>
                      {item.relatedIds.length > 0 && (
                        <div className="mt-2.5 pt-2.5 border-t border-white/10">
                          <div className="flex items-center mb-1.5">
                            <Link size={9} className="text-[#C4A47C] mr-1" />
                            <span className="text-[10px] uppercase tracking-wider font-medium text-white/40">Correlated</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((relatedId) => {
                              const rel = timelineData.find((i) => i.id === relatedId);
                              return (
                                <Button
                                  key={relatedId}
                                  variant="outline"
                                  size="sm"
                                  className="h-5 px-2 py-0 text-[10px] rounded-none border-white/20 bg-transparent hover:bg-white/10 text-white/60 hover:text-white"
                                  onClick={(e) => { e.stopPropagation(); toggleItem(relatedId); }}
                                >
                                  {rel?.title}
                                  <ArrowRight size={7} className="ml-1 text-[#C4A47C]" />
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
