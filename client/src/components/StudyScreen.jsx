import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, Image as ImageIcon, BookOpen, Check, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

export default function StudyScreen({ initialChapter = null, onOpenImageModal }) {
  const [selectedChapter, setSelectedChapter] = useState(initialChapter || 'all');
  const [onlyCritical, setOnlyCritical] = useState(false);
  const [onlyWithImage, setOnlyWithImage] = useState(false);
  const [search, setSearch] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userSelections, setUserSelections] = useState({});
  const [revealedQuestions, setRevealedQuestions] = useState({});

  const chapters = [
    { id: 'all', name: 'Tất cả 600 câu hỏi' },
    { id: 1, name: 'Chương 1: Quy tắc giao thông đường bộ (180 câu)' },
    { id: 2, name: 'Chương 2: Đạo đức & Văn hóa lái xe (25 câu)' },
    { id: 3, name: 'Chương 3: Kỹ thuật lái xe (58 câu)' },
    { id: 4, name: 'Chương 4: Cấu tạo & Sửa chữa xe (37 câu)' },
    { id: 5, name: 'Chương 5: Hệ thống biển báo hiệu (185 câu)' },
    { id: 6, name: 'Chương 6: Giải các thế sa hình (115 câu)' },
  ];

  // Fetch questions from API
  useEffect(() => {
    fetchQuestions();
  }, [selectedChapter, onlyCritical, page, search]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedChapter !== 'all') params.append('chapter', selectedChapter);
      if (onlyCritical) params.append('critical', 'true');
      if (search) params.append('search', search);
      params.append('page', page);
      params.append('limit', 20);

      const res = await fetch(`/api/questions?${params.toString()}`);
      const data = await res.json();
      setQuestions(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qId, optNum) => {
    setUserSelections(prev => ({
      ...prev,
      [qId]: optNum
    }));
    // Automatically reveal explanation when an answer is selected
    setRevealedQuestions(prev => ({
      ...prev,
      [qId]: true
    }));
  };

  const toggleReveal = (qId) => {
    setRevealedQuestions(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', width: '100%' }}>
      {/* Control Filter Bar */}
      <div style={{
        background: '#ffffff',
        padding: '16px 20px',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Chapter select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 300px' }}>
            <BookOpen size={18} color="#0284c7" />
            <select
              value={selectedChapter}
              onChange={(e) => {
                setSelectedChapter(e.target.value);
                setPage(1);
              }}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                fontWeight: 600,
                color: '#1e293b'
              }}
            >
              {chapters.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Search box */}
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative', flex: '1 1 240px' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px' }} />
            <input
              type="text"
              placeholder="Tìm kiếm nội dung hoặc số câu..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Quick Toggle: 60 Câu điểm liệt */}
          <button
            onClick={() => {
              setOnlyCritical(prev => !prev);
              setPage(1);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '6px',
              border: '1px solid #f87171',
              background: onlyCritical ? '#dc2626' : '#fef2f2',
              color: onlyCritical ? '#ffffff' : '#b91c1c',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            <AlertTriangle size={16} />
            <span>Chỉ xem 60 câu điểm liệt</span>
          </button>
        </div>
      </div>

      {/* Questions list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
          <h3>Đang tải danh sách câu hỏi...</h3>
        </div>
      ) : questions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '8px' }}>
          <h3>Không tìm thấy câu hỏi phù hợp với bộ lọc</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {questions.map((q) => {
            const userChoice = userSelections[q.id];
            const isRevealed = revealedQuestions[q.id];

            return (
              <div 
                key={q.id}
                style={{
                  background: '#ffffff',
                  border: q.is_critical ? '2px solid #f87171' : '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '20px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      background: '#003366',
                      color: '#ffffff',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontWeight: 800,
                      fontSize: '13px'
                    }}>
                      CÂU #{q.id}
                    </span>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>
                      {q.chapter_name}
                    </span>
                  </div>

                  {q.is_critical && (
                    <span className="badge-critical">
                      ⚠️ CÂU ĐIỂM LIỆT
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '17px', color: '#0f172a', fontWeight: 700, lineHeight: 1.6, marginBottom: '16px' }}>
                  {q.question}
                </h3>

                {/* Question Image if present */}
                {q.image && (
                  <div className="question-image-box" style={{ maxWidth: '480px', margin: '0 auto 18px' }}>
                    <img 
                      src={q.image.startsWith('/') ? q.image : `/images/${q.image.replace(/^images\//, '')}`}
                      alt={`Câu ${q.id}`}
                      onClick={() => onOpenImageModal(q.image.startsWith('/') ? q.image : `/images/${q.image.replace(/^images\//, '')}`)}
                      style={{ maxHeight: '240px' }}
                    />
                    <div className="image-hint">
                      <ZoomIn size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                      Nhấn vào hình để phóng to
                    </div>
                  </div>
                )}

                {/* Answers options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {q.options.map((opt, idx) => {
                    const optNum = idx + 1;
                    const isSelected = userChoice === optNum;
                    const isCorrect = q.correct_option === optNum;

                    let bg = '#f8fafc';
                    let border = '#cbd5e1';

                    if (isRevealed) {
                      if (isCorrect) {
                        bg = '#dcfce7';
                        border = '#16a34a';
                      } else if (isSelected && !isCorrect) {
                        bg = '#fee2e2';
                        border = '#dc2626';
                      }
                    } else if (isSelected) {
                      bg = '#eff6ff';
                      border = '#2563eb';
                    }

                    return (
                      <div
                        key={idx}
                        onClick={() => handleSelectOption(q.id, optNum)}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '6px',
                          border: `2px solid ${border}`,
                          background: bg,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          transition: 'all 0.15s'
                        }}
                      >
                        <div style={{
                          minWidth: '28px',
                          height: '28px',
                          borderRadius: '4px',
                          border: '2px solid #64748b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '13px',
                          background: isRevealed && isCorrect ? '#16a34a' : (isSelected ? '#2563eb' : '#fff'),
                          color: (isRevealed && isCorrect) || isSelected ? '#fff' : '#1e293b',
                          borderColor: isRevealed && isCorrect ? '#16a34a' : (isSelected ? '#2563eb' : '#64748b')
                        }}>
                          {isRevealed && isCorrect ? '✓' : optNum}
                        </div>
                        <div style={{ fontSize: '15px', color: '#1e293b', fontWeight: 500 }}>
                          <strong>{optNum}.</strong> {opt}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Toggle explanation button & Explanation box */}
                <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => toggleReveal(q.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#0284c7',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {isRevealed ? 'Ẩn lời giải thích ▲' : 'Xem đáp án & giải thích chi tiết ▼'}
                  </button>
                </div>

                {isRevealed && (
                  <div style={{
                    marginTop: '12px',
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '6px',
                    padding: '14px',
                    fontSize: '14px',
                    lineHeight: 1.6,
                    color: '#14532d'
                  }}>
                    <strong style={{ color: '#166534', display: 'block', marginBottom: '4px' }}>
                      ✓ ĐÁP ÁN ĐÚNG LÀ Ý {q.correct_option}:
                    </strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', alignItems: 'center', marginTop: '30px' }}>
          <button
            className="btn-nav"
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            <ChevronLeft size={16} /> Trang trước
          </button>
          <span style={{ fontWeight: 700, fontSize: '14px' }}>
            Trang {page} / {totalPages}
          </span>
          <button
            className="btn-nav"
            disabled={page >= totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          >
            Trang sau <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
