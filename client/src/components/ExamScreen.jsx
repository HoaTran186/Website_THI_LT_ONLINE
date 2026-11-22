import React, { useState, useEffect, useCallback } from 'react';
import { User, ZoomIn, AlertOctagon } from 'lucide-react';

export default function ExamScreen({
  examData,
  rank,
  sbd,
  onFinishExam,
  onOpenImageModal,
  onExitEarly
}) {
  const questions = examData?.questions || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  // answers stores an array of selected option numbers per question: { [qId]: [1, 2] }
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(examData?.durationSeconds || 20 * 60);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const currentQuestion = questions[currentIndex] || null;

  // Countdown timer
  useEffect(() => {
    if (!examData || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinish(true); // Auto submit when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examData, timeLeft]);

  // Format MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle option selection (supports multiple choices independently, like Cục Đường Bộ software)
  const handleToggleOption = useCallback((optionNumber, targetQId = null) => {
    const qId = targetQId || currentQuestion?.id;
    if (!qId) return;

    setAnswers(prev => {
      const currentSelected = prev[qId] || [];
      let updated;
      if (currentSelected.includes(optionNumber)) {
        // Uncheck
        updated = currentSelected.filter(n => n !== optionNumber);
      } else {
        // Check (allows multiple choices independently)
        updated = [...currentSelected, optionNumber].sort((a, b) => a - b);
      }
      return {
        ...prev,
        [qId]: updated
      };
    });
  }, [currentQuestion]);

  // 2D Matrix Navigation with arrow keys (Up, Down, Left, Right) & Number Keys (1, 2, 3, 4)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      // Number keys 1, 2, 3, 4
      if (['1', '2', '3', '4'].includes(e.key)) {
        e.preventDefault();
        const num = parseInt(e.key);
        if (currentQuestion && num <= (currentQuestion.options?.length || 4)) {
          handleToggleOption(num, currentQuestion.id);
        }
      } 
      // ArrowLeft (←): Move to column on the left (index - 15)
      else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentIndex(prev => {
          if (prev >= 15) {
            return prev - 15;
          }
          return prev;
        });
      } 
      // ArrowRight (→): Move to column on the right (index + 15)
      else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentIndex(prev => {
          const target = prev + 15;
          if (target < questions.length) {
            return target;
          } else if (prev < 30 && questions.length > 30) {
            // If in col 2 and col 3 exists but doesn't have 15 rows, jump to last question of col 3
            return questions.length - 1;
          }
          return prev;
        });
      }
      // ArrowUp (↑): Move up 1 row
      else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
      } 
      // ArrowDown (↓) or Enter: Move down 1 row
      else if (e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault();
        setCurrentIndex(prev => (prev < questions.length - 1 ? prev + 1 : prev));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, questions.length, handleToggleOption]);

  const handleFinish = (force = false) => {
    if (!force) {
      setShowConfirmModal(true);
      return;
    }
    setShowConfirmModal(false);
    onFinishExam(answers, questions.map(q => q.id));
  };

  const answeredCount = Object.keys(answers).filter(id => (answers[id] || []).length > 0).length;
  const progressPercent = Math.round((answeredCount / (questions.length || 1)) * 100);

  // Column layout rule:
  // - Hạng B (30 câu): Dồn thành đúng 2 cột, mỗi cột 15 câu (Cột 1: 1-15, Cột 2: 16-30).
  // - Hạng C1 (35 câu), Hạng C (40 câu): Thêm cột thứ 3 (Cột 1: 1-15, Cột 2: 16-30, Cột 3: 31 trở đi).
  const isTwoColumns = questions.length <= 30;

  let columns = [];
  if (isTwoColumns) {
    const col1 = questions.slice(0, 15);
    const col2 = questions.slice(15, 30);
    columns = [col1, col2];
  } else {
    const col1 = questions.slice(0, 15);
    const col2 = questions.slice(15, 30);
    const col3 = questions.slice(30);
    columns = [col1, col2, col3];
  }

  if (!currentQuestion) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', background: '#0080c0', color: '#fff', height: '100vh' }}>
        <h2>Đang chuẩn bị đề thi sát hạch...</h2>
      </div>
    );
  }

  const hasImage = Boolean(currentQuestion.image);
  const currentSelectedOptions = answers[currentQuestion.id] || [];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100vw',
      height: '100vh',
      maxHeight: '100vh',
      background: '#0080c0', /* Authentic cyan/sky-blue software frame */
      border: '4px solid #0080c0',
      userSelect: 'none',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      {/* Top golden border line */}
      <div style={{ height: '4px', background: '#f5ba14', width: '100%', flexShrink: 0 }} />

      {/* Main Examination Frame */}
      <div style={{
        display: 'flex',
        flex: 1,
        gap: '6px',
        padding: '6px',
        overflow: 'hidden'
      }}>
        {/* ================= LEFT SECTION: Question & Bottom Info ================= */}
        <div style={{
          flex: isTwoColumns ? '1 1 73%' : '1 1 67%',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          overflow: 'hidden'
        }}>
          {/* Main Question Box */}
          <div style={{
            background: '#ffffff',
            border: '2px solid #003366',
            borderRadius: '4px',
            flex: 1,
            padding: '20px 26px',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto'
          }}>
            {/* Question Text in DARK RED */}
            <div style={{
              color: '#990000',
              fontSize: '20px',
              fontWeight: 800,
              lineHeight: 1.5,
              marginBottom: '20px'
            }}>
              {currentQuestion.question}
            </div>

            {/* Answer Options & Optional Illustration Image */}
            <div style={{
              display: 'flex',
              flex: 1,
              gap: '24px',
              alignItems: 'flex-start'
            }}>
              {/* Answers text list: 100% full width if no image, or 58% width if image present */}
              <div style={{
                flex: hasImage ? '1 1 58%' : '1 1 100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                {currentQuestion.options.map((opt, idx) => {
                  const optNum = idx + 1;

                  return (
                    <div
                      key={idx}
                      onClick={() => handleToggleOption(optNum, currentQuestion.id)}
                      style={{
                        fontSize: '17px',
                        lineHeight: 1.6,
                        color: '#000000',
                        fontWeight: 500,
                        cursor: 'pointer',
                        padding: '4px 0',
                        background: 'transparent',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '6px'
                      }}
                    >
                      <span style={{ fontWeight: 800, minWidth: '24px', color: '#000000' }}>
                        {optNum}-
                      </span>
                      <span style={{ flex: 1, color: '#000000' }}>{opt}</span>
                    </div>
                  );
                })}
              </div>

              {/* Only show image if question actually has an image (No artificial logo) */}
              {hasImage && (
                <div style={{
                  flex: '0 0 40%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '10px',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px'
                }}>
                  <img
                    src={currentQuestion.image}
                    alt={`Minh họa câu ${currentQuestion.id}`}
                    onClick={() => onOpenImageModal(currentQuestion.image)}
                    style={{
                      maxHeight: '260px',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      cursor: 'zoom-in',
                      borderRadius: '4px'
                    }}
                    title="Nhấn vào hình để phóng to"
                  />
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
                    <ZoomIn size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                    Nhấn để phóng to sa hình / biển báo
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Progress Bar & Candidate Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flexShrink: 0 }}>
            {/* Red Progress Bar */}
            <div style={{
              height: '18px',
              background: '#e0e0e0',
              border: '1px solid #999',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${progressPercent}%`,
                background: 'linear-gradient(180deg, #ff4d4d 0%, #cc0000 100%)',
                transition: 'width 0.2s'
              }} />
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 800,
                color: '#000000'
              }}>
                {progressPercent}%
              </div>
            </div>

            {/* Bottom 2-Box Panel */}
            <div style={{
              display: 'flex',
              height: '84px',
              background: '#f2dfce',
              border: '1px solid #777'
            }}>
              {/* Left Box: Candidate Profile */}
              <div style={{
                flex: '1 1 60%',
                display: 'flex',
                alignItems: 'center',
                padding: '6px 14px',
                gap: '14px',
                borderRight: '1px solid #999'
              }}>
                <div style={{
                  width: '54px',
                  height: '70px',
                  background: '#d9d9d9',
                  border: '1px solid #888',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <User size={38} color="#777" />
                </div>

                <div style={{ fontSize: '13px', lineHeight: 1.6, color: '#000' }}>
                  <div style={{ fontSize: '11px', color: '#333' }}>Thông tin thí sinh</div>
                  <div style={{ fontWeight: 800 }}>
                    SBD: {sbd || 2} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Hạng: {rank}
                  </div>
                  <div>
                    Họ Và Tên: <strong style={{ textTransform: 'uppercase' }}>THÍ SINH SỐ {sbd || 2}</strong>
                  </div>
                </div>
              </div>

              {/* Right Box: Emblem & 600 questions branding */}
              <div style={{
                flex: '1 1 40%',
                background: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '4px'
              }}>
                <div style={{ textAlign: 'center', fontWeight: 900, fontSize: '16px', color: '#000066' }}>
                  BỘ 600 CÂU HỎI
                </div>
                <div style={{
                  background: 'linear-gradient(180deg, #005090 0%, #002855 100%)',
                  color: '#ffffff',
                  padding: '3px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderRadius: '2px'
                }}>
                  <img 
                    src="/logo-songtien.png" 
                    alt="Logo Sông Tiền" 
                    style={{
                      width: '24px',
                      height: '24px',
                      objectFit: 'contain',
                      background: '#ffffff',
                      borderRadius: '50%',
                      padding: '1px',
                      flexShrink: 0
                    }}
                  />
                  <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
                    <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}>
                      TRUNG TÂM SÁT HẠCH LÁI XE SÔNG TIỀN
                    </div>
                    <div style={{ fontSize: '8px', opacity: 0.8 }}>
                      DIRECTORATE FOR ROADS OF VIETNAM
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SECTION: Countdown & Question Matrix ================= */}
        <div style={{
          flex: isTwoColumns ? '0 0 27%' : '0 0 33%',
          background: '#ffffff',
          border: '2px solid #003366',
          borderRadius: '4px',
          display: 'flex',
          flexDirection: 'column',
          padding: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {/* Top: Countdown Timer */}
          <div style={{
            background: '#e6f2ff',
            border: '1px solid #99c2ff',
            padding: '6px 12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '4px',
            flexShrink: 0
          }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#003399' }}>
              THỜI GIAN CÒN LẠI:
            </span>
            <span style={{
              fontSize: '22px',
              fontWeight: 900,
              fontFamily: 'Consolas, monospace',
              color: timeLeft < 120 ? '#cc0000' : '#002266'
            }}>
              {formatTime(timeLeft)}
            </span>
          </div>

          {/* Question Grid: 15 rows evenly fill 100% height, NO GREEN, NO GAP */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isTwoColumns ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            gap: '3px',
            flex: 1,
            background: '#ffffff',
            padding: '2px',
            border: '1px solid #cbd5e1',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            {columns.map((column, colIdx) => {
              // Calculate starting index for this column
              let startIndex = 0;
              for (let i = 0; i < colIdx; i++) {
                startIndex += columns[i].length;
              }

              return (
                <div 
                  key={colIdx} 
                  style={{ 
                    display: 'grid', 
                    gridTemplateRows: 'repeat(15, 1fr)', 
                    gap: '2px', 
                    height: '100%'
                  }}
                >
                  {column.map((q, idxInCol) => {
                    const globalIdx = startIndex + idxInCol;
                    const isCurrent = globalIdx === currentIndex;
                    const selectedForQ = answers[q.id] || [];
                    const optCount = q.options?.length || 4;

                    // Authentic Cục Đường Bộ style:
                    // - ONLY current question is highlighted in Salmon Red (#ff9999)!
                    // - Answered questions DO NOT turn green (they stay normal beige/gray #fbf9f4)!
                    const rowBg = isCurrent ? '#ff9999' : '#fbf9f4';

                    return (
                      <div
                        key={q.id}
                        onClick={() => setCurrentIndex(globalIdx)}
                        style={{
                          background: rowBg,
                          border: isCurrent ? '1px solid #cc0000' : '1px solid #cbd5e1',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0 8px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          borderRadius: '2px',
                          boxShadow: isCurrent ? 'inset 0 0 2px rgba(204,0,0,0.5)' : 'none'
                        }}
                      >
                        {/* Left: Question index number */}
                        <span style={{
                          fontWeight: 800,
                          color: isCurrent ? '#990000' : '#000000',
                          minWidth: '22px'
                        }}>
                          {globalIdx + 1}
                        </span>

                        {/* Right: Checkboxes labeled 1 2 3 4 (Independently checkable) */}
                        <div style={{ display: 'flex', gap: '3px' }}>
                          {[1, 2, 3, 4].slice(0, optCount).map((optNum) => {
                            const isChecked = selectedForQ.includes(optNum);

                            return (
                              <div
                                key={optNum}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!isCurrent) {
                                    // When clicking another question from the list, ONLY navigate to it!
                                    // NEVER accidentally toggle or corrupt answers during navigation!
                                    setCurrentIndex(globalIdx);
                                  } else {
                                    // Only toggle the checkbox if this question is already the active/current question
                                    handleToggleOption(optNum, q.id);
                                  }
                                }}
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  width: '16px'
                                }}
                              >
                                <span style={{ fontSize: '9px', lineHeight: 1, color: '#333' }}>{optNum}</span>
                                <div style={{
                                  width: '14px',
                                  height: '14px',
                                  border: '1px solid #777',
                                  background: '#ffffff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '11px',
                                  fontWeight: 900,
                                  color: '#006600'
                                }}>
                                  {isChecked ? '✓' : ''}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Bottom Button: KẾT THÚC in bold red */}
          <button
            onClick={() => handleFinish(false)}
            style={{
              marginTop: '4px',
              height: '46px',
              flexShrink: 0,
              background: 'linear-gradient(180deg, #ffffff 0%, #e6e6e6 100%)',
              border: '2px solid #888',
              borderRadius: '2px',
              color: '#cc0000',
              fontWeight: 900,
              fontSize: '19px',
              letterSpacing: '1px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 1px 0 #fff, 0 1px 2px rgba(0,0,0,0.2)'
            }}
          >
            KẾT THÚC
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px', border: '3px solid #005080' }}>
            <div className="modal-header" style={{ background: '#005080' }}>
              <span>XÁC NHẬN KẾT THÚC BÀI THI</span>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <AlertOctagon size={54} color="#dc2626" style={{ margin: '0 auto 10px' }} />
              <h3 style={{ fontSize: '18px', color: '#000', marginBottom: '10px' }}>
                Bạn có chắc chắn muốn kết thúc bài thi?
              </h3>
              <p style={{ color: '#444', fontSize: '14px', marginBottom: '14px' }}>
                Thời gian còn lại: <strong>{formatTime(timeLeft)}</strong>
              </p>

              <div style={{ background: '#f5f5f5', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'left', fontSize: '14px' }}>
                <div>Tổng số câu hỏi: <strong>{questions.length} câu</strong></div>
                <div style={{ color: '#008800' }}>Số câu đã trả lời: <strong>{answeredCount} câu</strong></div>
                <div style={{ color: '#cc0000' }}>Số câu chưa trả lời: <strong>{questions.length - answeredCount} câu</strong></div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-nav"
                onClick={() => setShowConfirmModal(false)}
                style={{ padding: '8px 16px' }}
              >
                Tiếp tục làm bài
              </button>
              <button
                onClick={() => handleFinish(true)}
                style={{
                  background: '#cc0000',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 20px',
                  borderRadius: '4px',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Đồng ý nộp bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
