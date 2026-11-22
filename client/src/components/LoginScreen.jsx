import React, { useState } from 'react';
import { User } from 'lucide-react';

export default function LoginScreen({ onStartExam, onReviewLastExam, hasPreviousResult }) {
  const [sbdInput, setSbdInput] = useState('9');
  const [checkedInfo, setCheckedInfo] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle "Kiểm tra thông tin thí sinh" (Bước 2)
  const handleCheckInfo = () => {
    const sbdNum = parseInt(sbdInput);
    if (isNaN(sbdNum) || sbdNum <= 0) {
      setErrorMsg('Vui lòng nhập số báo danh hợp lệ (1 - 200)!');
      setCheckedInfo(null);
      return;
    }

    setErrorMsg('');

    // Quy định phân hạng theo SBD:
    // 1 - 100: Hạng B (30 câu)
    // 101 - 150: Hạng C1 (35 câu)
    // 151 - 200: Hạng C (40 câu)
    let rank = 'B';
    let rankLabel = 'Hạng B';
    let totalQ = 30;
    let durationMin = 20;

    if (sbdNum >= 101 && sbdNum <= 150) {
      rank = 'C1';
      rankLabel = 'Hạng C1';
      totalQ = 35;
      durationMin = 22;
    } else if (sbdNum >= 151 && sbdNum <= 200) {
      rank = 'C';
      rankLabel = 'Hạng C';
      totalQ = 40;
      durationMin = 24;
    }

    setCheckedInfo({
      sbd: sbdNum,
      rank,
      rankLabel,
      totalQ,
      durationMin,
      name: `THÍ SINH SỐ ${sbdNum}`,
      dob: `15/08/${1990 + (sbdNum % 12)}`,
      cccd: `079200${sbdNum.toString().padStart(6, '0')}`,
      address: 'Trung tâm GDNN Đào tạo & Sát hạch lái xe Sông Tiền'
    });
  };

  // Bước 3: Vào thi
  const handleEnterExam = () => {
    if (!checkedInfo) {
      const sbdNum = parseInt(sbdInput);
      if (isNaN(sbdNum) || sbdNum <= 0) {
        setErrorMsg('Vui lòng nhập số báo danh và kiểm tra thông tin!');
        return;
      }
      handleCheckInfo();
      return;
    }

    onStartExam(checkedInfo.sbd, checkedInfo.rank);
  };

  return (
    <div style={{
      minHeight: '88vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      background: '#9ec4e4', /* Authentic Windows desktop backdrop */
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Windows Dialog Window */}
      <div style={{
        maxWidth: '700px',
        width: '100%',
        background: '#ffffff',
        border: '1px solid #5a7b9c',
        borderRadius: '6px',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.35)',
        overflow: 'hidden'
      }}>
        {/* Windows Titlebar */}
        <div style={{
          height: '32px',
          background: 'linear-gradient(180deg, #ffffff 0%, #e6eff7 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 10px',
          borderBottom: '1px solid #c2d5e6',
          fontSize: '13px',
          fontWeight: 700,
          color: '#1a3b5c',
          userSelect: 'none'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/logo-songtien.png" alt="Logo Sông Tiền" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
            <span>PHẦN MỀM TỰ LUYỆN SÁT HẠCH LÝ THUYẾT</span>
          </div>
          <div
            onClick={() => {
              setSbdInput('');
              setCheckedInfo(null);
            }}
            style={{
              width: '24px',
              height: '22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '13px',
              color: '#555',
              borderRadius: '2px'
            }}
            title="Đóng"
          >
            ✕
          </div>
        </div>

        {/* High-Tech Banner Graphic */}
        <div style={{
          background: 'linear-gradient(90deg, #021a38 0%, #06396e 35%, #086144 80%, #03482a 100%)',
          padding: '14px 20px',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '3px solid #ff6666'
        }}>
          {/* Angular tab design on banner */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '20px',
            width: '140px',
            height: '10px',
            background: '#042852',
            clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)'
          }} />

          <h1 style={{
            fontSize: '21px',
            fontWeight: 900,
            color: '#ffffff',
            textAlign: 'center',
            letterSpacing: '0.6px',
            textShadow: '0 2px 4px rgba(0,0,0,0.6)',
            margin: '4px 0 0 0',
            textTransform: 'uppercase'
          }}>
            TỰ LUYỆN SÁT HẠCH LÝ THUYẾT 600 CÂU
          </h1>
        </div>

        {/* Form Body - Light Cream / Ivory Container */}
        <div style={{
          background: '#fcfbee',
          padding: '22px 28px 18px 28px',
          fontSize: '14px',
          color: '#000080'
        }}>
          {/* Grid Layout: Controls + Nút Kiểm Tra */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '110px 1fr 180px',
            gap: '12px 14px',
            alignItems: 'center'
          }}>
            {/* Row 1: Đơn vị (Spans columns 2 & 3 - no wrapping) */}
            <label style={{ fontWeight: 800, color: '#000080' }}>
              Đơn vị:
            </label>
            <div style={{
              gridColumn: '2 / 4',
              background: '#ffffff',
              border: '1px solid #7f9db9',
              borderRadius: '2px',
              padding: '6px 12px',
              fontSize: '12.5px',
              fontWeight: 800,
              color: '#000000',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)'
            }}>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                TRUNG TÂM GDNN ĐÀO TẠO VÀ SÁT HẠCH LÁI XE SÔNG TIỀN
              </span>
              <span style={{ fontSize: '10px', color: '#555', marginLeft: '8px', flexShrink: 0 }}>▼</span>
            </div>

            {/* Row 2: Khóa */}
            <label style={{ fontWeight: 800, color: '#000080' }}>
              Khóa:
            </label>
            <div style={{
              background: '#ffffff',
              border: '1px solid #7f9db9',
              borderRadius: '2px',
              padding: '6px 12px',
              fontSize: '13px',
              fontWeight: 700,
              color: '#000000',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)'
            }}>
              <span>TỰ LUYỆN LÝ THUYẾT</span>
              <span style={{ fontSize: '10px', color: '#555' }}>▼</span>
            </div>

            {/* Nút "Kiểm tra thông tin thí sinh" spanning Row 2 and Row 3 on the right */}
            <button
              type="button"
              onClick={handleCheckInfo}
              style={{
                gridColumn: '3 / 4',
                gridRow: '2 / 4',
                height: '100%',
                minHeight: '74px',
                padding: '8px 12px',
                background: 'linear-gradient(180deg, #fff3e6 0%, #fbd5b5 100%)',
                border: '1px solid #d99b66',
                borderRadius: '3px',
                color: '#000080',
                fontWeight: 800,
                fontSize: '13.5px',
                lineHeight: 1.35,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.12)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(180deg, #ffe8d2 0%, #f7c399 100%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(180deg, #fff3e6 0%, #fbd5b5 100%)';
              }}
            >
              <span>Kiểm tra</span>
              <span>thông tin thí sinh</span>
            </button>

            {/* Row 3: Số báo danh */}
            <label style={{ fontWeight: 800, color: '#000080' }}>
              Số báo danh:
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="text"
                value={sbdInput}
                onChange={(e) => {
                  setSbdInput(e.target.value);
                  setCheckedInfo(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCheckInfo();
                  }
                }}
                placeholder="Nhập SBD..."
                style={{
                  width: '140px',
                  padding: '6px 12px',
                  fontSize: '16px',
                  fontWeight: 900,
                  color: '#004080',
                  border: '2px solid #005090',
                  borderRadius: '2px',
                  background: '#ffffff',
                  outline: 'none',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
                }}
                autoFocus
              />
            </div>
          </div>

          {/* Error Message Notice */}
          {errorMsg && (
            <div style={{
              margin: '10px 0 0 124px',
              color: '#d32f2f',
              fontSize: '12px',
              fontWeight: 700
            }}>
              ⚠ {errorMsg}
            </div>
          )}

          {/* Clean Separator Line */}
          <div style={{
            borderTop: '1px dashed #cfcdc1',
            margin: '16px 0 18px 0'
          }} />

          {/* Candidate Details (Loại GPLX, Họ tên, Ngày sinh, Số CMT, Địa chỉ) */}
          <div style={{
            display: 'flex',
            gap: '26px',
            alignItems: 'center'
          }}>
            {/* 3x4 Portrait silhouette with official frame style */}
            <div style={{
              width: '108px',
              height: '140px',
              background: '#f8f8f8',
              border: '1px solid #b5b5b5',
              padding: '4px',
              boxShadow: '2px 3px 8px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                background: '#e9ecef',
                border: '1px solid #d0d0d0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <User size={62} color="#88929b" />
              </div>
            </div>

            {/* Information fields */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '9px',
              fontSize: '14px',
              color: '#000080',
              fontWeight: 600
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ width: '105px', fontWeight: 800, color: '#000080' }}>Loại GPLX:</span>
                <strong style={{
                  color: checkedInfo ? '#cc0000' : '#000080',
                  fontSize: '15px',
                  fontWeight: 800
                }}>
                  {checkedInfo ? checkedInfo.rankLabel : '-'}
                </strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ width: '105px', fontWeight: 800, color: '#000080' }}>Họ tên:</span>
                <strong style={{
                  color: checkedInfo ? '#003366' : '#000080',
                  textTransform: 'uppercase',
                  fontSize: '15px',
                  fontWeight: 800
                }}>
                  {checkedInfo ? checkedInfo.name : '-'}
                </strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ width: '105px', fontWeight: 800, color: '#000080' }}>Ngày sinh:</span>
                <span style={{ color: '#000000', fontWeight: 600 }}>
                  {checkedInfo ? checkedInfo.dob : '-'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ width: '105px', fontWeight: 800, color: '#000080' }}>Số CMT:</span>
                <span style={{ color: '#000000', fontWeight: 600 }}>
                  {checkedInfo ? checkedInfo.cccd : '-'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ width: '105px', fontWeight: 800, color: '#000080' }}>Địa chỉ:</span>
                <span style={{ color: '#000000', fontWeight: 600 }}>
                  {checkedInfo ? checkedInfo.address : '-'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons Bar (BƯỚC 3) */}
        <div style={{
          background: '#f0f0e0',
          padding: '14px 20px',
          borderTop: '1px solid #d4d4c4',
          display: 'flex',
          justifyContent: 'center',
          gap: '14px'
        }}>
          {/* Nút 1: Vào tập luyện (VÀO THI) */}
          <button
            type="button"
            onClick={handleEnterExam}
            style={{
              padding: '9px 28px',
              background: 'linear-gradient(180deg, #fff3e6 0%, #fbd5b5 100%)',
              border: '1px solid #d99b66',
              borderRadius: '3px',
              color: '#662200',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.12)'
            }}
          >
            <span style={{
              width: '12px',
              height: '12px',
              background: '#ffffff',
              border: '1px solid #999',
              display: 'inline-block'
            }} />
            <span>Vào tập luyện</span>
          </button>

          {/* Nút 2: Xem lại bài thi (nếu có bài thi trước) */}
          <button
            type="button"
            onClick={onReviewLastExam}
            disabled={!hasPreviousResult}
            style={{
              padding: '9px 22px',
              background: 'linear-gradient(180deg, #ffffff 0%, #ececec 100%)',
              border: '1px solid #b0b0b0',
              borderRadius: '3px',
              color: hasPreviousResult ? '#000080' : '#888',
              fontWeight: 700,
              fontSize: '14px',
              cursor: hasPreviousResult ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              opacity: hasPreviousResult ? 1 : 0.6,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
            }}
          >
            <span style={{ color: '#16a34a', fontWeight: 900 }}>✔</span>
            <span>Xem lại bài thi</span>
          </button>

          {/* Nút 3: Hủy bỏ */}
          <button
            type="button"
            onClick={() => {
              setSbdInput('');
              setCheckedInfo(null);
            }}
            style={{
              padding: '9px 22px',
              background: 'linear-gradient(180deg, #ffffff 0%, #ececec 100%)',
              border: '1px solid #b0b0b0',
              borderRadius: '3px',
              color: '#000080',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
            }}
          >
            <span style={{
              width: '16px',
              height: '16px',
              background: '#cc0000',
              borderRadius: '3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '10px'
            }}>
              ⏻
            </span>
            <span>Hủy bỏ</span>
          </button>
        </div>
      </div>
    </div>
  );
}
