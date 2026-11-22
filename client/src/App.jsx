import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LoginScreen from './components/LoginScreen';
import ExamScreen from './components/ExamScreen';
import ExamResultModal from './components/ExamResultModal';
import ExamReview from './components/ExamReview';
import StudyScreen from './components/StudyScreen';
import HelpModal from './components/HelpModal';
import ImageLightboxModal from './components/ImageLightboxModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState('exam');
  const [sbd, setSbd] = useState('2');
  const [rank, setRank] = useState('B');
  const [examData, setExamData] = useState(null);
  const [examState, setExamState] = useState('login'); // 'login' | 'taking' | 'result' | 'review'
  const [examResult, setExamResult] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Monitor fullscreen change events
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Request fullscreen
  const enterFullscreen = async () => {
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.warn('Fullscreen entry error or prevented by browser:', err);
    }
  };

  // Exit fullscreen
  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn('Exit fullscreen error:', err);
    }
  };

  // Start exam from Login screen with SBD and Rank
  const handleStartExam = async (chosenSbd, chosenRank) => {
    setSbd(chosenSbd);
    setRank(chosenRank);
    setLoading(true);

    // Automatically enter fullscreen when starting the exam (per user requirement)
    await enterFullscreen();

    try {
      const res = await fetch('/api/exam/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sbd: chosenSbd, rank: chosenRank })
      });
      const data = await res.json();
      setExamData(data);
      setExamState('taking');
      setExamResult(null);
    } catch (err) {
      console.error('Error generating exam:', err);
    } finally {
      setLoading(false);
    }
  };

  // Submit completed exam
  const handleFinishExam = async (answers, questionIds) => {
    // Automatically exit fullscreen when exam ends (per user requirement)
    await exitFullscreen();

    try {
      const res = await fetch('/api/exam/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sbd,
          rank,
          answers,
          questionIds
        })
      });
      const resultData = await res.json();
      setExamResult(resultData);
      setExamState('result');
    } catch (err) {
      console.error('Error submitting exam:', err);
    }
  };

  // Return to Login screen
  const handleReturnToLogin = async () => {
    await exitFullscreen();
    setCurrentTab('exam');
    setExamState('login');
    setExamResult(null);
  };

  return (
    <div className={`exam-software-frame ${examState === 'taking' ? 'in-exam-mode' : ''}`}>
      {/* Hide header tabs during exam if in fullscreen for true distraction-free kiosk mode, or show minimal header */}
      {examState !== 'taking' && (
        <Header
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          rank={rank}
          sbd={sbd}
          onOpenLogin={handleReturnToLogin}
          isFullscreen={isFullscreen}
          toggleFullscreen={isFullscreen ? exitFullscreen : enterFullscreen}
        />
      )}

      {/* Main Tab Content */}
      {currentTab === 'exam' && (
        <>
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', background: '#0080c0', color: '#fff', flex: 1, minHeight: '80vh' }}>
              <h2>Đang nạp đề thi sát hạch hạng {rank} cho thí sinh SBD {sbd}...</h2>
              <p style={{ marginTop: '10px', opacity: 0.9 }}>Đang chuyển sang chế độ thi toàn màn hình...</p>
            </div>
          ) : examState === 'login' ? (
            <LoginScreen
              onStartExam={handleStartExam}
              onReviewLastExam={() => setExamState('review')}
              hasPreviousResult={Boolean(examResult)}
            />
          ) : examState === 'review' ? (
            <ExamReview
              result={examResult}
              onBackToResult={() => setExamState('result')}
              onRetry={handleReturnToLogin}
              onOpenImageModal={(url) => setLightboxImage(url)}
            />
          ) : (
            <ExamScreen
              examData={examData}
              rank={rank}
              sbd={sbd}
              onFinishExam={handleFinishExam}
              onOpenImageModal={(url) => setLightboxImage(url)}
              onExitEarly={handleReturnToLogin}
            />
          )}

          {/* Exam Result Modal */}
          {examState === 'result' && examResult && (
            <ExamResultModal
              result={examResult}
              onReview={() => setExamState('review')}
              onRetry={handleReturnToLogin}
            />
          )}
        </>
      )}

      {currentTab === 'study' && (
        <StudyScreen
          initialChapter={null}
          onOpenImageModal={(url) => setLightboxImage(url)}
        />
      )}

      {currentTab === 'critical' && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', width: '100%' }}>
          <div style={{
            background: '#fef2f2',
            border: '2px solid #ef4444',
            borderRadius: '8px',
            padding: '16px 20px',
            marginBottom: '20px',
            color: '#991b1b'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '6px' }}>
              ⚠️ BỘ 60 CÂU HỎI ĐIỂM LIỆT (TÌNH HUỐNG MẤT AN TOÀN GIAO THÔNG NGHIÊM TRỌNG)
            </h2>
            <p style={{ fontSize: '14px', lineHeight: 1.5 }}>
              Trong kỳ thi sát hạch lý thuyết chính thức của Cục Đường Bộ, mỗi đề thi đều chứa từ 1 đến 2 câu điểm liệt. Thí sinh trả lời sai bất kỳ câu điểm liệt nào sẽ <strong>bị trượt kỳ thi ngay lập tức</strong>, kể cả khi đạt số điểm tối đa ở các câu còn lại.
            </p>
          </div>
          <StudyScreen
            initialChapter="all"
            onOpenImageModal={(url) => setLightboxImage(url)}
          />
        </div>
      )}

      {currentTab === 'help' && (
        <HelpModal onClose={() => setCurrentTab('exam')} />
      )}

      {/* Image Lightbox Modal */}
      {lightboxImage && (
        <ImageLightboxModal
          imageUrl={lightboxImage}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </div>
  );
}
