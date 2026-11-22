import React from 'react';
import { Monitor, BookOpen, AlertTriangle, HelpCircle, Maximize2, Minimize2, KeyRound } from 'lucide-react';

export default function Header({ 
  currentTab, 
  setCurrentTab, 
  rank, 
  sbd,
  onOpenLogin,
  isFullscreen, 
  toggleFullscreen 
}) {
  return (
    <header>
      {/* Official Top Banner */}
      <div className="gov-banner">
        <div className="gov-banner-title">
          <div style={{
            width: '50px',
            height: '50px',
            background: '#ffffff',
            borderRadius: '50%',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            border: '2px solid #ffde59',
            flexShrink: 0
          }}>
            <img 
              src="/logo-songtien.png" 
              alt="Logo Sông Tiền" 
              style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }} 
            />
          </div>
          <div className="gov-text">
            <h1>TRUNG TÂM GDNN ĐÀO TẠO VÀ SÁT HẠCH LÁI XE SÔNG TIỀN</h1>
            <h2>Phần Mềm Ôn Thi Sát Hạch Lý Thuyết</h2>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Current Candidate Tag */}
          <div 
            onClick={onOpenLogin}
            title="Nhấn để đổi Số Báo Danh (SBD)"
            style={{
              background: '#ffde59',
              color: '#002244',
              padding: '6px 12px',
              borderRadius: '4px',
              fontWeight: 900,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
            }}
          >
            <KeyRound size={15} />
            <span>SBD: {sbd || 2} - Hạng {rank}</span>
          </div>

          {/* Fullscreen toggle button */}
          <button 
            onClick={toggleFullscreen} 
            title={isFullscreen ? 'Thu nhỏ cửa sổ' : 'Phóng to toàn màn hình như máy thi thật (F11)'}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#ffffff',
              padding: '6px 12px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 600
            }}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            <span>{isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <nav className="app-nav">
        <button 
          className={`nav-tab ${currentTab === 'exam' ? 'active' : ''}`}
          onClick={() => setCurrentTab('exam')}
        >
          <Monitor size={17} />
          <span>Phòng Thi Sát Hạch (Chuẩn Cục Đường Bộ)</span>
        </button>

        <button 
          className={`nav-tab ${currentTab === 'study' ? 'active' : ''}`}
          onClick={() => setCurrentTab('study')}
        >
          <BookOpen size={17} />
          <span>Ôn Tập 600 Câu Theo 6 Chương</span>
        </button>

        <button 
          className={`nav-tab ${currentTab === 'critical' ? 'active' : ''}`}
          onClick={() => setCurrentTab('critical')}
        >
          <AlertTriangle size={17} color="#ef4444" />
          <span>60 Câu Điểm Liệt (Sai là Trượt)</span>
        </button>

        <button 
          className={`nav-tab ${currentTab === 'help' ? 'active' : ''}`}
          onClick={() => setCurrentTab('help')}
        >
          <HelpCircle size={17} />
          <span>Hướng Dẫn Phím Tắt Thao Tác</span>
        </button>
      </nav>
    </header>
  );
}
