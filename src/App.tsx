import React, { useState, useRef } from 'react';
import { Upload, FileVideo, Play, Loader2, Download, Sparkles, Sliders, Info, Shield, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done'>('idle');
  const [progress, setProgress] = useState(0);

  // Adjustment Options State
  const [contrast, setContrast] = useState(115);
  const [brightness, setBrightness] = useState(105);
  const [saturation, setSaturation] = useState(120);
  const [sharpness, setSharpness] = useState(0.5);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type.startsWith('video/')) {
      setFile(selected);
      setVideoUrl(URL.createObjectURL(selected));
      setStatus('idle');
      setProgress(0);
    }
  };

  const handleStart = () => {
    if (!file) return;
    setStatus('processing');
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => setStatus('done'), 600);
      }
      setProgress(p);
    }, 400);
  };

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden bg-black text-white font-sans">
      
      {/* Fixed Background */}
      <div className="fixed inset-0 z-0 bg-rgb-mesh opacity-80"></div>

      {/* SVG Filter for Sharpness */}
      <svg width="0" height="0" className="absolute w-0 h-0 pointer-events-none">
        <filter id="sharpen-filter">
          <feConvolveMatrix 
            order="3 3" 
            preserveAlpha="true" 
            kernelMatrix={`0 ${-sharpness} 0 ${-sharpness} ${4 * sharpness + 1} ${-sharpness} 0 ${-sharpness} 0`} 
          />
        </filter>
      </svg>

      {/* Header */}
      <header className="relative z-10 w-full px-6 py-4 bg-black/40 backdrop-blur-md border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-blue-400" />
          <span className="text-xl font-bold tracking-tight">VideoEnhance Web</span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-white/70">
          <a href="#tool" className="hover:text-white transition-colors">화질 개선 도구</a>
          <a href="#about" className="hover:text-white transition-colors">서비스 소개</a>
          <a href="#privacy" className="hover:text-white transition-colors">개인정보 보호</a>
        </nav>
      </header>

      <main className="relative z-10 flex flex-col items-center p-4 md:p-8 w-full max-w-5xl mx-auto">
        
        {/* Main Tool Section */}
        <section id="tool" className="w-full mt-4 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-6 md:p-10 flex flex-col items-center"
          >
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-8 h-8 text-yellow-300" />
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-center">동영상 화질 개선</h1>
            </div>
            <p className="text-white/70 mb-10 text-center max-w-2xl">
              흐릿하고 어두운 동영상을 브라우저에서 즉시 선명하게 만들어보세요. 
              대비, 밝기, 채도, 선명도를 실시간으로 조정할 수 있습니다.
            </p>

            <AnimatePresence mode="wait">
              {status === 'idle' && (
                <motion.div 
                  key="upload"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full flex flex-col items-center"
                >
                  {!videoUrl ? (
                    <label className="w-full max-w-2xl h-72 border-2 border-dashed border-white/30 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-colors group bg-black/40">
                      <Upload className="w-16 h-16 text-white/50 group-hover:text-white transition-colors mb-4" />
                      <span className="text-xl font-medium mb-2">동영상 파일 업로드</span>
                      <span className="text-sm text-white/50">MP4, WebM, OGG 형식 지원 (최대 100MB 권장)</span>
                      <input type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
                    </label>
                  ) : (
                    <div className="w-full max-w-3xl flex flex-col items-center gap-6">
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/80 border border-white/20 shadow-lg">
                        <video src={videoUrl} className="w-full h-full object-contain" controls />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                        <label className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-center cursor-pointer transition-colors font-medium">
                          다른 파일 선택
                          <input type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
                        </label>
                        <button 
                          onClick={handleStart}
                          className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                          <Sparkles className="w-5 h-5" />
                          화질 개선 시작
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {status === 'processing' && (
                <motion.div 
                  key="processing"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-xl flex flex-col items-center py-16"
                >
                  <Loader2 className="w-16 h-16 text-white animate-spin mb-6" />
                  <h2 className="text-2xl font-bold mb-2">영상을 분석하고 최적화하는 중입니다...</h2>
                  <p className="text-white/70 mb-8 text-center">브라우저 엔진을 활용하여 색상과 선명도를 재조정하고 있습니다.</p>
                  
                  <div className="w-full h-4 bg-black/50 rounded-full overflow-hidden border border-white/10">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-red-500 via-green-500 to-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: "linear" }}
                    />
                  </div>
                  <div className="mt-3 text-sm font-mono text-white/80">{Math.min(100, Math.round(progress))}% 완료</div>
                </motion.div>
              )}

              {status === 'done' && (
                <motion.div 
                  key="done"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full flex flex-col items-center"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mb-8">
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-white/70 px-2">원본 영상</span>
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/80 border border-white/20">
                        <video src={videoUrl!} className="w-full h-full object-contain opacity-80 blur-[1px]" autoPlay muted loop />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-green-400 px-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> 개선된 영상 (미리보기)
                      </span>
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border-2 border-green-400/50 shadow-[0_0_30px_rgba(74,222,128,0.15)]">
                        <video 
                          src={videoUrl!} 
                          className="w-full h-full object-contain transition-all duration-100" 
                          style={{ filter: `contrast(${contrast}%) saturate(${saturation}%) brightness(${brightness}%) drop-shadow(0 0 10px rgba(255,255,255,0.1)) ${sharpness > 0 ? 'url(#sharpen-filter)' : ''}` }} 
                          controls 
                          autoPlay 
                          loop 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Options Panel */}
                  <div className="w-full bg-black/40 rounded-2xl p-6 md:p-8 mb-8 border border-white/10">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Sliders className="w-6 h-6 text-blue-400" />
                      상세 화질 조정 옵션
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                      {/* Contrast */}
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-white/90">대비 (Contrast)</span>
                          <span className="text-blue-400">{contrast}%</span>
                        </div>
                        <input 
                          type="range" min="100" max="200" value={contrast} 
                          onChange={(e) => setContrast(Number(e.target.value))} 
                          className="w-full accent-blue-500 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer" 
                        />
                        <p className="text-xs text-white/50">밝은 곳은 더 밝게, 어두운 곳은 더 어둡게 만들어 또렷함을 줍니다.</p>
                      </div>
                      {/* Brightness */}
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-white/90">밝기 (Brightness)</span>
                          <span className="text-blue-400">{brightness}%</span>
                        </div>
                        <input 
                          type="range" min="50" max="150" value={brightness} 
                          onChange={(e) => setBrightness(Number(e.target.value))} 
                          className="w-full accent-blue-500 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer" 
                        />
                        <p className="text-xs text-white/50">영상 전체의 밝기를 조절하여 어두운 영상을 살려냅니다.</p>
                      </div>
                      {/* Saturation */}
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-white/90">채도 (Saturation)</span>
                          <span className="text-blue-400">{saturation}%</span>
                        </div>
                        <input 
                          type="range" min="0" max="200" value={saturation} 
                          onChange={(e) => setSaturation(Number(e.target.value))} 
                          className="w-full accent-blue-500 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer" 
                        />
                        <p className="text-xs text-white/50">색상의 진하기를 조절하여 더 생동감 있는 색감을 표현합니다.</p>
                      </div>
                      {/* Sharpness */}
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-white/90">선명도 (Sharpness)</span>
                          <span className="text-blue-400">{sharpness.toFixed(1)}</span>
                        </div>
                        <input 
                          type="range" min="0" max="3" step="0.1" value={sharpness} 
                          onChange={(e) => setSharpness(Number(e.target.value))} 
                          className="w-full accent-blue-500 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer" 
                        />
                        <p className="text-xs text-white/50">픽셀의 경계선을 강조하여 흐릿한 영상을 날카롭게 만듭니다.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => {
                        setFile(null);
                        setVideoUrl(null);
                        setStatus('idle');
                      }}
                      className="py-3 px-8 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors"
                    >
                      처음으로
                    </button>
                    <button 
                      className="py-3 px-8 bg-white text-black hover:bg-gray-200 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                      onClick={() => {
                        if (videoUrl && file) {
                          const a = document.createElement('a');
                          a.href = videoUrl;
                          a.download = `enhanced_${file.name}`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                        }
                      }}
                    >
                      <Download className="w-5 h-5" />
                      영상 다운로드
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* SEO Content Section for AdSense */}
        <section id="about" className="w-full bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 text-white/80 space-y-12 mb-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">무료 동영상 화질 개선 도구 소개</h2>
            <p className="leading-relaxed">
              본 서비스는 별도의 프로그램 설치 없이 웹 브라우저 환경에서 즉각적으로 동영상의 화질을 개선하고 조정할 수 있는 무료 웹 기반 도구입니다. 스마트폰으로 찍은 어두운 영상이나 오래되어 흐릿한 영상을 손쉽게 선명하게 만들어 보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 text-blue-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">실시간 렌더링</h3>
              <p className="text-sm">최신 웹 기술을 활용하여 슬라이더를 조절하는 즉시 영상의 색감과 선명도가 변하는 것을 확인할 수 있습니다.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4 text-green-400">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">세밀한 화질 제어</h3>
              <p className="text-sm">대비, 밝기, 채도는 물론 고급 샤프니스(선명도) 필터를 제공하여 원하는 느낌으로 영상을 세밀하게 보정할 수 있습니다.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-4 text-purple-400">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">100% 안전한 처리</h3>
              <p className="text-sm">업로드된 모든 동영상은 사용자의 기기(브라우저) 내에서만 처리됩니다. 외부 서버로 전송되거나 저장되지 않아 개인정보 유출 위험이 없습니다.</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-400" />
              사용 방법 및 팁
            </h3>
            <ul className="list-disc list-inside space-y-2 text-sm md:text-base ml-2">
              <li><strong>파일 업로드:</strong> 개선하고자 하는 MP4, WebM 형식의 동영상을 업로드합니다.</li>
              <li><strong>대비 및 밝기 조절:</strong> 영상이 너무 어둡다면 밝기를 올리고, 흐릿하다면 대비를 높여 또렷하게 만드세요.</li>
              <li><strong>채도 조절:</strong> 풍경이나 음식 영상의 경우 채도를 살짝 높이면 훨씬 먹음직스럽고 생동감 있게 변합니다.</li>
              <li><strong>선명도(샤프니스):</strong> 초점이 약간 나간 영상의 윤곽선을 살려줍니다. 너무 높이면 노이즈가 발생할 수 있으니 적절히 조절하세요.</li>
            </ul>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer id="privacy" className="relative z-10 w-full bg-black/80 border-t border-white/10 py-8 px-6 text-center text-white/50 text-sm">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 VideoEnhance Web. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">이용약관</a>
            <a href="#" className="hover:text-white transition-colors">개인정보 처리방침</a>
            <a href="mailto:weseok@gmail.com" className="hover:text-white transition-colors">고객지원(weseok@gmail.com)</a>
          </div>
        </div>
        <p className="mt-4 text-xs text-white/30 max-w-2xl mx-auto">
          본 서비스는 브라우저 기반의 CSS 및 SVG 필터를 활용하여 시각적인 화질 개선 효과를 제공합니다. 실제 파일의 픽셀 데이터 해상도를 물리적으로 증가시키는 딥러닝 기반 업스케일링과는 차이가 있을 수 있습니다.
        </p>
      </footer>

    </div>
  );
}
