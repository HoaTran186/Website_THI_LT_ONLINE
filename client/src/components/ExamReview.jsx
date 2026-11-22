import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, AlertTriangle, CheckCircle, XCircle, ZoomIn } from 'lucide-react';

export default function ExamReview({ result, onBackToResult, onRetry, onOpenImageModal }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const details = result?.details || [];
  const currentItem = details[currentIndex] || null;

  if (!currentItem) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Review Header Banner */}
      <div style={{
        background: '#1e293b',
        color: '#ffffff',
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button 
            className="btn-nav"
            onClick={onBackToResult}
            style={{ padding: '6px 12px', fontSize: '13px' }}
          >
            ← Bảng kết quả
          </button>
          <span style={{ fontWeight: 800, fontSize: '16px' }}>
            XEM LẠI BÀI THI - HẠNG {result.rank} ({result.correctCount}/{result.totalQuestions} ĐÚNG)
          </span>
        </div>

        <button 
          className="btn-nav"
          onClick={onRetry}
          style={{ background: '#16a34a', color: '#fff', borderColor: '#15803d', padding: '6px 14px', fontSize: '13px' }}
        >
          <RotateCcw size={15} />
          <span>Thi đề mới</span>
        </button>
      </div>

      <div className="exam-layout">
        {/* Left Column: Question Review */}
        <main className="exam-main-panel">
          <div className="question-header" style={{
            background: currentItem.is_correct ? '#166534' : (currentItem.user_answer ? '#991b1b' : '#334155')
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>CÂU {currentIndex + 1} / {details.length}</span>
              {currentItem.is_critical && (
                <span className="badge-critical">⚠️ CÂU ĐIỂM LIỆT</span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {currentItem.is_correct ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#86efac', fontWeight: 800 }}>
                  <CheckCircle size={18} /> ĐÚNG
                </span>
              ) : currentItem.user_answer ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fca5a5', fontWeight: 800 }}>
                  <XCircle size={18} /> SAI
                </span>
              ) : (
                <span style={{ color: '#cbd5e1', fontWeight: 600 }}>CHƯA TRẢ LỜI</span>
              )}
            </div>
          </div>

          <div className="question-body">
            <h2 className="question-text">
              {currentIndex + 1}. {currentItem.question}
            </h2>

            {/* Illustration */}
            {currentItem.image && (
              <div className="question-image-box">
                <img 
                  src={currentItem.image} 
                  alt={`Minh họa câu ${currentItem.id}`}
                  onClick={() => onOpenImageModal(currentItem.image)}
                  title="Nhấn để phóng to"
                />
                <div className="image-hint">
                  <ZoomIn size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                  Nhấn vào hình để phóng to
                </div>
              </div>
            )}

            {/* Answers with review colors */}
            <div className="answers-list">
              {currentItem.options.map((opt, idx) => {
                const optNum = idx + 1;
                const isUserChoice = Array.isArray(currentItem.user_answer) 
                  ? currentItem.user_answer.includes(optNum) 
                  : currentItem.user_answer === optNum;
                const isCorrectChoice = currentItem.correct_option === optNum;

                let extraClass = '';
                if (isCorrectChoice) {
                  extraClass = 'correct-review';
                } else if (isUserChoice && !currentItem.is_correct) {
                  extraClass = 'wrong-review';
                }

                return (
                  <div
                    key={idx}
                    className={`answer-option ${extraClass}`}
                    style={{ cursor: 'default' }}
                  >
                    <div 
                      className="answer-key-box"
                      style={{
                        background: isCorrectChoice ? '#16a34a' : (isUserChoice ? '#dc2626' : '#ffffff'),
                        color: (isCorrectChoice || isUserChoice) ? '#ffffff' : '#1e293b',
                        borderColor: isCorrectChoice ? '#16a34a' : (isUserChoice ? '#dc2626' : '#64748b')
                      }}
                    >
                      {optNum}
                    </div>
                    <div className="answer-text">
                      <strong>{optNum}.</strong> {opt}
                      {isCorrectChoice && (
                        <span style={{ marginLeft: '10px', color: '#16a34a', fontWeight: 800 }}>
                          ✓ (Đáp án đúng của Cục Đường Bộ)
                        </span>
                      )}
                      {isUserChoice && !isCorrectChoice && (
                        <span style={{ marginLeft: '10px', color: '#dc2626', fontWeight: 800 }}>
                          ✗ (Bạn đã chọn đáp án này)
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Official Explanation Box */}
            {currentItem.explanation && (
              <div style={{
                marginTop: '24px',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <h4 style={{ color: '#166534', fontSize: '15px', fontWeight: 800, marginBottom: '6px' }}>
                  📖 GIẢI THÍCH CHI TIẾT THEO LUẬT GIAO THÔNG:
                </h4>
                <p style={{ color: '#14532d', fontSize: '14px', lineHeight: 1.6 }}>
                  {currentItem.explanation}
                </p>
              </div>
            )}
          </div>

          {/* Navigation Bar */}
          <div className="exam-nav-bar">
            <button
              className="btn-nav"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(prev => prev - 1)}
            >
              <ArrowLeft size={16} />
              <span>Câu trước</span>
            </button>

            <span>Câu {currentIndex + 1} / {details.length}</span>

            <button
              className="btn-nav"
              disabled={currentIndex === details.length - 1}
              onClick={() => setCurrentIndex(prev => prev + 1)}
            >
              <span>Câu sau</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </main>

        {/* Right Palette */}
        <aside className="exam-sidebar">
          <div className="palette-card">
            <div className="palette-header">
              <span>BẢNG ĐÁNH GIÁ CÂU HỎI</span>
            </div>

            <div className="palette-grid">
              {details.map((item, idx) => {
                const isCurrent = idx === currentIndex;
                const isCorrect = item.is_correct;
                const isWrong = item.user_answer && !item.is_correct;
                const isUnanswered = !item.user_answer;

                let bg = '#f8fafc';
                let color = '#334155';
                let border = '#cbd5e1';

                if (isCorrect) {
                  bg = '#dcfce7';
                  color = '#166534';
                  border = '#86efac';
                } else if (isWrong) {
                  bg = '#fee2e2';
                  color = '#991b1b';
                  border = '#fca5a5';
                }

                return (
                  <div
                    key={item.id}
                    className={`palette-item ${isCurrent ? 'current' : ''}`}
                    style={{
                      background: isCurrent ? '#fef08a' : bg,
                      color: isCurrent ? '#854d0e' : color,
                      borderColor: isCurrent ? '#ca8a04' : border
                    }}
                    onClick={() => setCurrentIndex(idx)}
                  >
                    <span>Câu {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                    <div 
                      className="palette-answer-box"
                      style={{
                        background: isCorrect ? '#16a34a' : (isWrong ? '#dc2626' : '#fff'),
                        color: (isCorrect || isWrong) ? '#fff' : '#1e293b'
                      }}
                    >
                      {Array.isArray(item.user_answer) 
                        ? (item.user_answer.length > 0 ? item.user_answer.join(',') : '-') 
                        : (item.user_answer || '-')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
