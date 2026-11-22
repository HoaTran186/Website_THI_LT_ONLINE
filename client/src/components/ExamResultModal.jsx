import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, RotateCcw, Eye, Award } from 'lucide-react';

export default function ExamResultModal({ result, onReview, onRetry }) {
  if (!result) return null;

  const {
    rank,
    totalQuestions,
    correctCount,
    wrongCount,
    unattemptedCount,
    passScore,
    passed,
    failedDueToCritical
  } = result;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '620px' }}>
        <div 
          className="modal-header"
          style={{
            background: passed ? 'linear-gradient(180deg, #15803d 0%, #166534 100%)' : 'linear-gradient(180deg, #b91c1c 0%, #991b1b 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={22} color="#fef08a" />
            <span>KẾT QUẢ SÁT HẠCH LÝ THUYẾT - HẠNG {rank}</span>
          </div>
        </div>

        <div className="modal-body" style={{ textAlign: 'center' }}>
          {/* Main Status Badge */}
          <div style={{ marginBottom: '20px' }}>
            {passed ? (
              <div>
                <CheckCircle size={76} color="#16a34a" style={{ margin: '0 auto 10px' }} />
                <h2 style={{ fontSize: '32px', color: '#16a34a', fontWeight: 900, letterSpacing: '1px' }}>
                  KẾT QUẢ: ĐẠT
                </h2>
                <p style={{ color: '#475569', fontSize: '15px', fontWeight: 500 }}>
                  Chúc mừng bạn đã hoàn thành bài thi đạt tiêu chuẩn của Cục Đường Bộ Việt Nam!
                </p>
              </div>
            ) : (
              <div>
                <XCircle size={76} color="#dc2626" style={{ margin: '0 auto 10px' }} />
                <h2 style={{ fontSize: '32px', color: '#dc2626', fontWeight: 900, letterSpacing: '1px' }}>
                  KẾT QUẢ: KHÔNG ĐẠT
                </h2>
                <p style={{ color: '#475569', fontSize: '15px', fontWeight: 500 }}>
                  Bạn chưa vượt qua bài sát hạch lần này. Hãy ôn luyện thêm các phần chưa đạt!
                </p>
              </div>
            )}
          </div>

          {/* Critical Question Alert */}
          {failedDueToCritical && (
            <div style={{
              background: '#fef2f2',
              border: '2px dashed #dc2626',
              borderRadius: '8px',
              padding: '14px',
              marginBottom: '20px',
              textAlign: 'left',
              display: 'flex',
              gap: '12px',
              alignItems: 'center'
            }}>
              <AlertTriangle size={36} color="#dc2626" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ color: '#b91c1c', fontSize: '15px', fontWeight: 800 }}>
                  BỊ ĐIỂM LIỆT (ĐIỀU KIỆN TRƯỢT TRỰC TIẾP)
                </h4>
                <p style={{ color: '#991b1b', fontSize: '13px', marginTop: '2px' }}>
                  Bạn đã trả lời sai câu hỏi điểm liệt! Theo quy chế thi của Cục Đường Bộ, thí sinh sai 1 câu điểm liệt sẽ bị tính <strong>KHÔNG ĐẠT</strong> ngay cả khi đủ điểm số.
                </p>
              </div>
            </div>
          )}

          {/* Detailed Score Table */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            overflow: 'hidden',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '14px 10px', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>TỔNG CÂU HỎI</div>
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a' }}>{totalQuestions}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>SỐ CÂU ĐÚNG</div>
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#16a34a' }}>{correctCount}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#dc2626', fontWeight: 600 }}>SỐ CÂU SAI</div>
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#dc2626' }}>{wrongCount}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#854d0e', fontWeight: 600 }}>ĐIỂM ĐẠT</div>
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#0284c7' }}>{passScore}/{totalQuestions}</div>
              </div>
            </div>

            <div style={{ padding: '10px 14px', background: '#f1f5f9', fontSize: '13px', color: '#475569', textAlign: 'left' }}>
              Quy định đạt hạng {rank}: Tối thiểu <strong>{passScore}/{totalQuestions}</strong> câu và <strong>không sai câu điểm liệt</strong>.
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button 
            className="btn-nav"
            onClick={onReview}
            style={{ background: '#0284c7', color: '#ffffff', borderColor: '#0369a1' }}
          >
            <Eye size={17} />
            <span>Xem lại chi tiết bài làm</span>
          </button>

          <button 
            className="btn-nav"
            onClick={onRetry}
            style={{ background: '#16a34a', color: '#ffffff', borderColor: '#15803d' }}
          >
            <RotateCcw size={17} />
            <span>Thi lại đề khác</span>
          </button>
        </div>
      </div>
    </div>
  );
}
