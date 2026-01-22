
import React, { useEffect, useRef } from 'react';
import { Orientation, Coordinates, Star, Mission } from '../types';
import { STARS_DATA, CONSTELLATIONS_DATA } from '../data/mock_data';
import { getLST, equatorialToHorizontal, lowPassFilter } from '../services/astronomy';

interface AROverlayProps {
  orientation: Orientation;
  location: Coordinates;
  lang: 'th' | 'en';
  activeMission: Mission | null;
  onMissionComplete: (id: string) => void;
}

const AROverlay: React.FC<AROverlayProps> = ({ orientation, location, lang, activeMission, onMissionComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const smoothedAlpha = useRef(orientation.alpha);
  const smoothedBeta = useRef(orientation.beta);
  const centeringStartTime = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      smoothedAlpha.current = lowPassFilter(smoothedAlpha.current, orientation.alpha, 0.08);
      smoothedBeta.current = lowPassFilter(smoothedBeta.current, orientation.beta, 0.08);

      const fovX = 60; 
      const fovY = fovX * (height / width);

      ctx.clearRect(0, 0, width, height);
      const lst = getLST(new Date(), location.lng);

      const starScreenCoords: Record<string, { x: number, y: number }> = {};

      STARS_DATA.forEach(star => {
        const { alt, az } = equatorialToHorizontal(star.ra, star.dec, location.lat, lst);
        let deltaAz = az - smoothedAlpha.current;
        if (deltaAz > 180) deltaAz -= 360;
        if (deltaAz < -180) deltaAz += 360;
        let deltaAlt = alt - (90 - smoothedBeta.current);
        const x = (width / 2) + (deltaAz / fovX) * width;
        const y = (height / 2) - (deltaAlt / fovY) * height;
        starScreenCoords[star.id] = { x, y };
      });

      // Draw Constellations (soft lines)
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.setLineDash([]);
      CONSTELLATIONS_DATA.forEach(c => {
        c.lines.forEach(line => {
          const from = starScreenCoords[line.fromId];
          const to = starScreenCoords[line.toId];
          if (from && to && 
              from.x > -50 && from.x < width + 50 && from.y > -50 && from.y < height + 50 &&
              to.x > -50 && to.x < width + 50 && to.y > -50 && to.y < height + 50) {
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
          }
        });
      });

      let targetCentered = false;

      STARS_DATA.forEach(star => {
        const coords = starScreenCoords[star.id];
        if (!coords) return;
        const { x, y } = coords;

        if (x > -150 && x < width + 150 && y > -150 && y < height + 150) {
          const size = Math.max(1, (5 - star.mag) * 2);
          
          // Glow
          const grad = ctx.createRadialGradient(x, y, 0, x, y, size * 5);
          grad.addColorStop(0, star.color || 'rgba(255,255,255,0.6)');
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath(); ctx.arc(x, y, size * 5, 0, Math.PI * 2); ctx.fill();

          // Core
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(x, y, size / 2.5, 0, Math.PI * 2); ctx.fill();

          // Technical Label
          ctx.globalAlpha = 0.8;
          ctx.font = '10px Orbitron';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.fillText((lang === 'th' ? star.nameTh : star.nameEn).toUpperCase(), x, y + size + 22);
          ctx.globalAlpha = 1.0;

          if (activeMission?.targetObjectId === star.id) {
            const dist = Math.sqrt(Math.pow(x - width/2, 2) + Math.pow(y - height/2, 2));
            if (dist < 40) {
              targetCentered = true;
              // Mission Lock Visual
              ctx.strokeStyle = '#00f3ff';
              ctx.lineWidth = 1;
              ctx.beginPath(); ctx.arc(x, y, size + 20, 0, Math.PI * 2); ctx.stroke();
            }
          }
        }
      });

      // Cinematic Reticle (Technical Targets)
      const color = targetCentered ? '#00f3ff' : 'rgba(255,255,255,0.2)';
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      
      // Outer Circle
      ctx.beginPath(); ctx.arc(width/2, height/2, 50, 0, Math.PI * 2); ctx.stroke();
      
      // Corner Brackets
      const bLen = 15;
      const bDist = 40;
      // Top Left
      ctx.beginPath();
      ctx.moveTo(width/2 - bDist, height/2 - bDist + bLen); ctx.lineTo(width/2 - bDist, height/2 - bDist); ctx.lineTo(width/2 - bDist + bLen, height/2 - bDist);
      ctx.stroke();
      // Top Right
      ctx.beginPath();
      ctx.moveTo(width/2 + bDist, height/2 - bDist + bLen); ctx.lineTo(width/2 + bDist, height/2 - bDist); ctx.lineTo(width/2 + bDist - bLen, height/2 - bDist);
      ctx.stroke();
      // Bottom Left
      ctx.beginPath();
      ctx.moveTo(width/2 - bDist, height/2 + bDist - bLen); ctx.lineTo(width/2 - bDist, height/2 + bDist); ctx.lineTo(width/2 - bDist + bLen, height/2 + bDist);
      ctx.stroke();
      // Bottom Right
      ctx.beginPath();
      ctx.moveTo(width/2 + bDist, height/2 + bDist - bLen); ctx.lineTo(width/2 + bDist, height/2 + bDist); ctx.lineTo(width/2 + bDist - bLen, height/2 + bDist);
      ctx.stroke();

      // Scan Progress
      if (targetCentered && activeMission?.completionCriteria.secondsCentered) {
        if (!centeringStartTime.current) centeringStartTime.current = Date.now();
        const elapsed = (Date.now() - centeringStartTime.current) / 1000;
        const progress = Math.min(1, elapsed / activeMission.completionCriteria.secondsCentered);

        ctx.strokeStyle = '#bc13fe';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(width/2, height/2, 54, -Math.PI/2, (-Math.PI/2) + (Math.PI * 2 * progress));
        ctx.stroke();

        if (progress >= 1) {
          onMissionComplete(activeMission.id);
          centeringStartTime.current = null;
        }
      } else {
        centeringStartTime.current = null;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [orientation, location, lang, activeMission]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-20" />;
};

export default AROverlay;
