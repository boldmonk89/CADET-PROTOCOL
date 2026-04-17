import React, { useRef, useEffect, useState } from 'react';
import { Pose, POSE_CONNECTIONS } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { Shield, Camera as CameraIcon, CheckCircle, AlertTriangle } from 'lucide-react';

export default function VisionScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [carryAngle, setCarryAngle] = useState<number | null>(null);
  const [status, setStatus] = useState<'IDLE' | 'TRACKING' | 'LOCKED'>('IDLE');

  const calculateAngle = (p1, p2, p3) => {
    const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);
    if (angle > 180.0) angle = 360 - angle;
    return Math.abs(180 - angle); // Carry angle is the deviation from 180
  };

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults((results) => {
      if (!canvasRef.current) return;
      const canvasCtx = canvasRef.current.getContext('2d')!;
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

      if (results.poseLandmarks) {
        // Draw Landmarks
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { color: '#22c55e', lineWidth: 2 });
        drawLandmarks(canvasCtx, results.poseLandmarks, { color: '#EAB308', lineWidth: 1, radius: 4 });

        // Calculate Right Arm Carry Angle (Shoulder 12, Elbow 14, Wrist 16)
        const s = results.poseLandmarks[12];
        const e = results.poseLandmarks[14];
        const w = results.poseLandmarks[16];

        if (s.visibility > 0.8 && e.visibility > 0.8 && w.visibility > 0.8) {
          const angle = calculateAngle(s, e, w);
          setCarryAngle(parseFloat(angle.toFixed(1)));
          setStatus('TRACKING');

          // Highlight Elbow Node
          canvasCtx.beginPath();
          canvasCtx.arc(e.x * canvasRef.current.width, e.y * canvasRef.current.height, 15, 0, 2 * Math.PI);
          canvasCtx.strokeStyle = angle > 15 ? '#ef4444' : '#22c55e';
          canvasCtx.lineWidth = 3;
          canvasCtx.stroke();
        }
      }
      canvasCtx.restore();
    });

    if (videoRef.current) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await pose.send({ image: videoRef.current! });
        },
        width: 1280,
        height: 720,
      });
      camera.start();
    }
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="relative rounded-2xl overflow-hidden border-2 border-slate-800 bg-black aspect-video group">
        <video ref={videoRef} className="hidden" playsInline muted />
        <canvas ref={canvasRef} className="w-full h-full" width={1280} height={720} />
        
        {/* SCANNER OVERLAY */}
        <div className="absolute inset-0 pointer-events-none border-[1px] border-blue-500/20 m-12 rounded-xl">
           <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500" />
           <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-500" />
           <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-500" />
           <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500" />
        </div>

        {/* DATA HUD */}
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 p-4 rounded-xl min-w-[200px]">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Inference Status</div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${status === 'TRACKING' ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`} />
              <span className="font-mono text-sm">{status} ENGINE_L4_POSE</span>
            </div>
          </div>

          <div className="bg-slate-900/95 backdrop-blur-xl border-l-[4px] border-l-blue-500 p-6 rounded-r-xl shadow-2xl">
             <div className="text-[10px] text-blue-400 uppercase tracking-widest mb-1">Calculated Carry Angle</div>
             <div className="flex items-baseline gap-2">
               <span className="text-4xl font-bold font-mono">{carryAngle || '--.-'}</span>
               <span className="text-xl text-slate-400">°</span>
             </div>
             {carryAngle && (
               <div className={`mt-2 flex items-center gap-1 text-[10px] font-bold ${carryAngle > 15 ? 'text-red-500' : 'text-green-500'}`}>
                 {carryAngle > 15 ? <AlertTriangle size={10} /> : <CheckCircle size={10} />}
                 {carryAngle > 15 ? 'EXCEEDS AFMS THRESHOLD' : 'WITHIN MILITARY LIMITS'}
               </div>
             )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InstructionBlock title="Step 1: Calibration" desc="Ensure full body is visible in frame with arms extended sideways." />
        <InstructionBlock title="Step 2: Pose Capture" desc="Keep right elbow extended and hand supinated (palm front)." />
      </div>
    </div>
  );
}

function InstructionBlock({ title, desc }) {
  return (
    <div className="bg-slate-900/30 border border-slate-800 p-4 rounded-xl">
      <h4 className="text-xs font-bold text-slate-300 mb-1">{title}</h4>
      <p className="text-[11px] text-slate-500 leading-tight">{desc}</p>
    </div>
  );
}
