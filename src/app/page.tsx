'use client';

import { useEffect, useRef, useState } from 'react';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

interface Connection {
  from: string;
  to: string;
  strength: number;
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const nodes: Node[] = [
    { id: 'pm', label: 'PM', x: 0.15, y: 0.3, vx: 0, vy: 0, color: '#22d3ee' },
    { id: 'architect', label: 'Architect', x: 0.3, y: 0.5, vx: 0, vy: 0, color: '#a78bfa' },
    { id: 'dev', label: 'Dev', x: 0.5, y: 0.5, vx: 0, vy: 0, color: '#4ade80' },
    { id: 'qa', label: 'QA', x: 0.7, y: 0.5, vx: 0, vy: 0, color: '#f472b6' },
    { id: 'ux', label: 'UX', x: 0.5, y: 0.7, vx: 0, vy: 0, color: '#fb923c' },
    { id: 'sm', label: 'Scrum Master', x: 0.85, y: 0.3, vx: 0, vy: 0, color: '#60a5fa' },
  ];

  const connections: Connection[] = [
    { from: 'pm', to: 'architect', strength: 0.8 },
    { from: 'architect', to: 'dev', strength: 0.9 },
    { from: 'dev', to: 'qa', strength: 0.85 },
    { from: 'ux', to: 'dev', strength: 0.75 },
    { from: 'sm', to: 'pm', strength: 0.7 },
    { from: 'sm', to: 'dev', strength: 0.65 },
    { from: 'qa', to: 'pm', strength: 0.6 },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      ctx.clearRect(0, 0, width, height);

      // Background grid
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw connections
      connections.forEach((conn) => {
        const fromNode = nodes.find((n) => n.id === conn.from);
        const toNode = nodes.find((n) => n.id === conn.to);
        if (!fromNode || !toNode) return;

        const fromX = fromNode.x * width;
        const fromY = fromNode.y * height;
        const toX = toNode.x * width;
        const toY = toNode.y * height;

        // Calculate distance to mouse
        const midX = (fromX + toX) / 2;
        const midY = (fromY + toY) / 2;
        const distToMouse = Math.sqrt(
          Math.pow(midX - mousePos.x, 2) + Math.pow(midY - mousePos.y, 2)
        );
        const proximityEffect = Math.max(0, 1 - distToMouse / 300);

        // Pulse effect
        const pulse = Math.sin(time * 0.002 + conn.strength * 2) * 0.3 + 0.7;
        const opacity = (conn.strength * 0.3 + proximityEffect * 0.4) * pulse;

        const gradient = ctx.createLinearGradient(fromX, fromY, toX, toY);
        gradient.addColorStop(0, `${fromNode.color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `${toNode.color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2 + proximityEffect * 2;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();

        // Data flow animation
        const flowProgress = (time * 0.001 + conn.strength) % 1;
        const flowX = fromX + (toX - fromX) * flowProgress;
        const flowY = fromY + (toY - fromY) * flowProgress;

        ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + proximityEffect * 0.5})`;
        ctx.beginPath();
        ctx.arc(flowX, flowY, 3 + proximityEffect * 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw nodes
      nodes.forEach((node) => {
        const x = node.x * width;
        const y = node.y * height;

        // Calculate distance to mouse
        const distToMouse = Math.sqrt(
          Math.pow(x - mousePos.x, 2) + Math.pow(y - mousePos.y, 2)
        );
        const proximityEffect = Math.max(0, 1 - distToMouse / 200);

        // Glow effect
        const glowSize = 20 + proximityEffect * 30;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
        gradient.addColorStop(0, `${node.color}${Math.floor((0.3 + proximityEffect * 0.3) * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `${node.color}00`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Node circle
        const nodeSize = 8 + proximityEffect * 4;
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(x, y, nodeSize, 0, Math.PI * 2);
        ctx.fill();

        // Node border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Node label
        ctx.fillStyle = '#ffffff';
        ctx.font = `600 ${12 + proximityEffect * 2}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, x, y + nodeSize + 15);
      });

      time += 16;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-[#0a0a0a] font-sans min-h-screen">
      <main className="flex flex-1 w-full max-w-7xl flex-col items-center justify-between py-24 px-8">
        {/* Hero Section */}
        <div className="flex flex-col items-center gap-12 text-center w-full max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight text-white">
            Orchestrate Your Development Lifecycle with{' '}
            <span className="text-[#22d3ee]">Agentic AI</span>
          </h1>
          <p className="max-w-2xl text-lg md:text-xl leading-relaxed text-gray-400">
            Specialized agents collaborate autonomously—from product planning to delivery.
            Transform your software development workflow with intelligent orchestration.
          </p>

          {/* Neural Network Canvas */}
          <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden border border-gray-800 bg-[#0a0a0a]">
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-pointer"
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
            {!isHovering && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-gray-500 text-sm">Move cursor to interact with agents</p>
              </div>
            )}
          </div>

          {/* CTA Button */}
          <button
            className="group relative px-8 py-4 bg-[#22d3ee] text-white font-medium rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:-translate-y-1"
            onClick={() => (window.location.href = '/docs')}
          >
            <span className="relative z-10">Explore the Workflow</span>
          </button>
        </div>

        {/* Quick Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-16">
          {[
            {
              title: 'Multi-Agent Orchestration',
              description: 'PM, Architect, Dev, QA, UX, and Scrum Master agents collaborate seamlessly',
              color: '#22d3ee',
            },
            {
              title: 'Autonomous Workflows',
              description: 'From PRD creation to deployment, agents handle the entire SDLC',
              color: '#a78bfa',
            },
            {
              title: 'Enterprise Security',
              description: 'JWT authentication, rate limiting, and session management built-in',
              color: '#4ade80',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl border border-gray-800 bg-[#0a0a0a]/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1"
              style={{
                borderColor: 'rgba(255,255,255,0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = feature.color;
                e.currentTarget.style.boxShadow = `0 0 20px ${feature.color}33`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center"
                style={{ backgroundColor: `${feature.color}20` }}
              >
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: feature.color }} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
