import React from 'react';
import { Keyboard, HelpCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function HelpModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Keyboard size={22} color="#fef08a" />
            <span>HƯỚNG DẪN THAO TÁC TRÊN PHẦN MỀM THI SÁT HẠCH</span>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: '#334155', fontSize: '14px', marginBottom: '18px', lineHeight: 1.6 }}>
            Phần mềm sát hạch lý thuyết của Cục Đường Bộ trên máy tính được thiết kế để thí sinh có thể hoàn thành toàn bộ bài thi <strong>hoàn toàn bằng bàn phím</strong> mà không nhất thiết phải dùng chuột:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ minWidth: '120px' }}>
                <span className="key-badge" style={{ fontSize: '14px', padding: '4px 8px' }}>1</span>{' '}
                <span className="key-badge" style={{ fontSize: '14px', padding: '4px 8px' }}>2</span>{' '}
                <span className="key-badge" style={{ fontSize: '14px', padding: '4px 8px' }}>3</span>{' '}
                <span className="key-badge" style={{ fontSize: '14px', padding: '4px 8px' }}>4</span>
              </div>
              <div style={{ fontSize: '14px', color: '#1e293b' }}>
                <strong>Chọn hoặc bỏ chọn đáp án:</strong> Bấm phím số tương ứng với ý trả lời bạn chọn. Bấm lại cùng số sẽ hủy chọn đáp án đó.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ minWidth: '120px' }}>
                <span className="key-badge" style={{ fontSize: '14px', padding: '4px 8px' }}>↑</span>{' '}
                <span className="key-badge" style={{ fontSize: '14px', padding: '4px 8px' }}>↓</span>
              </div>
              <div style={{ fontSize: '14px', color: '#1e293b' }}>
                <strong>Chuyển câu hỏi:</strong> Phím mũi tên Lên (<kbd>↑</kbd>) để lùi về câu trước; Phím mũi tên Xuống (<kbd>↓</kbd>) hoặc phím <span className="key-badge">Enter</span> để chuyển sang câu tiếp theo.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ minWidth: '120px' }}>
                <span className="key-badge" style={{ fontSize: '14px', padding: '4px 8px' }}>F11</span>
              </div>
              <div style={{ fontSize: '14px', color: '#1e293b' }}>
                <strong>Chế độ toàn màn hình:</strong> Bấm phím F11 (hoặc nút "Toàn màn hình" trên thanh điều hướng) để trình duyệt chuyển sang chế độ Fullscreen không viền, giống hệt màn hình máy thi tại trung tâm sát hạch.
              </div>
            </div>
          </div>

          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            padding: '14px',
            fontSize: '13px',
            color: '#991b1b',
            lineHeight: 1.6
          }}>
            <strong style={{ display: 'block', marginBottom: '4px' }}>
              ⚠️ LƯU Ý ĐẶC BIỆT VỀ CÂU HỎI ĐIỂM LIỆT:
            </strong>
            Trong đề thi luôn có 1-2 câu điểm liệt về tình huống mất an toàn giao thông nghiêm trọng (uống rượu bia, chạy quá tốc độ, vượt tàu hỏa,...). <strong>Nếu trả lời sai chỉ 1 câu điểm liệt, bài thi sẽ bị đánh trượt ngay lập tức</strong>, kể cả khi đạt 34/35 câu còn lại.
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="btn-finish"
            onClick={onClose}
            style={{ padding: '8px 24px', fontSize: '14px' }}
          >
            Đã hiểu và bắt đầu
          </button>
        </div>
      </div>
    </div>
  );
}
