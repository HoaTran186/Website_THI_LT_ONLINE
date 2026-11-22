import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// When running on Render / Cloud host (where process.env.RENDER or PORT is defined)
if (process.env.RENDER || (process.env.NODE_ENV === 'production' && !process.env.LOCAL_DEV)) {
  console.log('[RENDER] Đang chạy trên máy chủ đám mây, khởi động server...');
  await import('./server/server.js');
} else {
  console.log('================================================================');
  console.log('  HỆ THỐNG SÁT HẠCH LÝ THUYẾT LÁI XE CỤC ĐƯỜNG BỘ VIỆT NAM');
  console.log('  Đang khởi động Backend Server & Frontend Client...');
  console.log('================================================================\n');

  // 1. Start Backend Server
  const serverProcess = spawn('node', ['server/server.js'], {
    cwd: __dirname,
    shell: true,
    stdio: 'pipe'
  });

  serverProcess.stdout.on('data', (data) => {
    process.stdout.write(`\x1b[36m[BACKEND]\x1b[0m ${data.toString()}`);
  });

  serverProcess.stderr.on('data', (data) => {
    process.stderr.write(`\x1b[31m[BACKEND ERROR]\x1b[0m ${data.toString()}`);
  });

  // 2. Start Frontend Client (Vite)
  const clientProcess = spawn('npm', ['--prefix', 'client', 'run', 'dev'], {
    cwd: __dirname,
    shell: true,
    stdio: 'pipe'
  });

  clientProcess.stdout.on('data', (data) => {
    const output = data.toString();
    process.stdout.write(`\x1b[32m[FRONTEND]\x1b[0m ${output}`);

    if (output.includes('Local:') || output.includes('localhost:')) {
      setTimeout(openBrowser, 1000);
    }
  });

  clientProcess.stderr.on('data', (data) => {
    process.stderr.write(`\x1b[33m[FRONTEND MSG]\x1b[0m ${data.toString()}`);
  });

  let browserOpened = false;
  function openBrowser() {
    if (browserOpened || process.platform !== 'win32') return;
    browserOpened = true;
    console.log('\n\x1b[35m[THÔNG BÁO]\x1b[0m Đang tự động mở trình duyệt tại: \x1b[34mhttp://localhost:3000\x1b[0m\n');
    spawn('cmd', ['/c', 'start', 'http://localhost:3000'], { shell: true });
  }

  function cleanup() {
    console.log('\nĐang dừng các dịch vụ...');
    try {
      serverProcess.kill();
      clientProcess.kill();
    } catch (e) {}
    process.exit(0);
  }

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}
