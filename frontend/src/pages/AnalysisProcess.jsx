import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

export default function AnalysisProcess({ onComplete, isReady }) {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);

  const stages = [
    "Preparing image and validating visual resolution",
    "Detecting visible onion bulbs in batch sample",
    "Identifying surface defects (rot, sprouting shoot, skin cut)",
    "Evaluating surface color, outer skin firming & scale purity",
    "Calculating quality composition percentages",
    "Applying standardized grading criteria & confidence check"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (isReady) {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              onComplete();
            }, 200);
            return 100;
          }
          return Math.min(100, prev + 12);
        } else {
          if (prev >= 92) {
            return 92;
          }
          return prev + 3;
        }
      });
    }, 70);

    return () => clearInterval(interval);
  }, [isReady, onComplete]);

  useEffect(() => {
    const stageIdx = Math.min(stages.length - 1, Math.floor((progress / 100) * stages.length));
    setCurrentStage(stageIdx);
  }, [progress]);

  return (
    <div style={{
      maxWidth: '640px',
      margin: '60px auto',
      padding: '40px 30px',
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius)',
      boxShadow: 'var(--shadow-lg)',
      textAlign: 'center'
    }} className="animate-fade-in">
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: 'rgba(5, 150, 105, 0.1)',
        color: 'var(--accent-green)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px auto'
      }}>
        <Cpu size={32} className="animate-pulse-slow" />
      </div>

      <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary-navy)' }}>
        Analyzing Onion Batch Image
      </h2>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px', marginBottom: '24px' }}>
        AI Multimodal Computer-Vision Engine • Executing Standardized Assessment
      </p>

      {/* Progress Bar */}
      <div style={{
        height: '10px',
        backgroundColor: '#E2E8F0',
        borderRadius: '5px',
        overflow: 'hidden',
        marginBottom: '24px'
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          backgroundColor: 'var(--accent-green)',
          transition: 'width 0.1s linear'
        }} />
      </div>

      {/* Stage Steps List */}
      <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {stages.map((stageText, idx) => {
          const isDone = idx < currentStage;
          const isCurrent = idx === currentStage;

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '13px',
                fontWeight: isCurrent ? '700' : '500',
                color: isCurrent ? 'var(--primary-navy)' : isDone ? 'var(--accent-green)' : 'var(--text-light)',
                padding: '6px 10px',
                borderRadius: '6px',
                backgroundColor: isCurrent ? '#F1F5F9' : 'transparent'
              }}
            >
              {isDone ? (
                <CheckCircle2 size={16} color="var(--accent-green)" />
              ) : isCurrent ? (
                <Loader2 size={16} color="var(--primary-navy)" className="animate-spin" />
              ) : (
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #CBD5E1' }} />
              )}
              <span>{stageText}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
