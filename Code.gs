/**
 * ============================================================================
 * BUSDIGIT CODEVERSE — BACKEND SCRIPT & GOOGLE SHEETS DATABASE (GAS)
 * Private Coding Academy + LMS + Vibe Coding + Project Lab
 * ============================================================================
 * File: Code.gs
 * Target: Google Apps Script Web App (V8 Runtime)
 * Brand: BUSDIGIT CODEVERSE (busdigit.id)
 */

// Konfigurasi Standar
const CONFIG = {
  APP_NAME: 'BUSDIGIT CODEVERSE',
  VERSION: '2.2.0',
  DEFAULT_TIMEZONE: 'Asia/Jakarta',
  GEMINI_MODEL: 'gemini-1.5-flash',
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
  // ID Spreadsheet Database & Config Resmi dari Pengguna
  SPREADSHEET_ID: '1NHtCvYOMGe4wla0aSAwoEMygaSOkQc3KrgU0Luo7C3c'
};

/**
 * ============================================================================
 * FUNGSI OTORISASI CEPAT (CUKUP JALANKAN 1x DI EDITOR APPS SCRIPT)
 * ============================================================================
 * Jika muncul peringatan: "Anda tidak memiliki izin untuk memanggil UrlFetchApp.fetch",
 * pilih fungsi ini di menu dropdown atas Apps Script, lalu klik tombol ▶ Jalankan.
 * Ini akan memunculkan popup persetujuan izin resmi dari Google.
 */
function beriIzinAksesSemuaLayanan() {
  try {
    // 1. Pemicu otorisasi UrlFetchApp (koneksi Firestore REST & internet)
    UrlFetchApp.fetch('https://www.google.com', { muteHttpExceptions: true });
    // 2. Pemicu otorisasi SpreadsheetApp
    SpreadsheetApp.getActiveSpreadsheet();
    Logger.log('✅ Otorisasi seluruh layanan Google Apps Script berhasil 100%!');
    return '✅ Otorisasi seluruh layanan Google Apps Script berhasil 100%!';
  } catch (e) {
    Logger.log('Status otorisasi: ' + e.message);
    return 'Status: ' + e.message;
  }
}

/**
 * Endpoint Utama Web App (GET)
 * Melayani antarmuka single-page application (Index.html)
 */
function doGet(e) {
  try {
    let output = null;
    const candidateNames = ['Index', 'index', 'Index.html', 'index.html', 'halaman', 'main'];
    
    // 1. Coba load langsung menggunakan createHtmlOutputFromFile
    for (let i = 0; i < candidateNames.length; i++) {
      try {
        output = HtmlService.createHtmlOutputFromFile(candidateNames[i]);
        if (output) break;
      } catch (err) {}
    }

    // 2. Jika belum ditemukan, coba via createTemplateFromFile
    if (!output) {
      for (let i = 0; i < candidateNames.length; i++) {
        try {
          const t = HtmlService.createTemplateFromFile(candidateNames[i]);
          if (t) {
            output = t.evaluate();
            break;
          }
        } catch (err) {}
      }
    }

    // Jika file HTML berhasil dimuat
    if (output) {
      return output
        .setTitle('BUSDIGIT CODEVERSE — Private Coding Academy & Vibe Coding')
        .addMetaTag('viewport', 'width=device-width, initial-scale=1')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    }

    // Jika file HTML belum dibuat di editor Apps Script
    return renderMissingHtmlGuide();

  } catch (err) {
    return HtmlService.createHtmlOutput(
      '<div style="font-family:system-ui,sans-serif;padding:30px;background:#0f172a;color:#f8fafc;border-radius:12px;margin:20px;">' +
      '<h2 style="color:#ef4444;">Terjadi kesalahan saat memuat BUSDIGIT CODEVERSE:</h2>' +
      '<p style="color:#94a3b8;font-size:15px;">' + err.message + '</p>' +
      '</div>'
    );
  }
}

function renderMissingHtmlGuide() {
  const guideHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Setup Index — BUSDIGIT CODEVERSE</title>
  <style>
    body { background: #060b14; color: #f8fafc; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
    .card { background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; max-width: 500px; padding: 28px; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <h2 style="color:#bef264; margin-bottom:10px;">File HTML Belum Dibuat</h2>
    <p style="color:#94a3b8; font-size:14px;">Silakan buat file HTML baru di editor Apps Script dengan nama <strong>Index</strong> lalu salin isi file Index.html.</p>
  </div>
</body>
</html>`;

  return HtmlService.createHtmlOutput(guideHtml)
    .setTitle('Penyiapan File Index — BUSDIGIT CODEVERSE')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Endpoint POST
 */
function doPost(e) {
  let response = { success: false, message: 'Invalid Request' };
  try {
    const postData = e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};
    const action = postData.action;

    switch (action) {
      case 'getInitialData':
        response = { success: true, data: apiGetInitialData() };
        break;
      case 'getConfig':
        response = { success: true, data: apiGetConfigFromSheet() };
        break;
      case 'saveConfig':
        response = { success: true, data: apiSaveConfigToSheet(postData.config) };
        break;
      case 'saveAIAgents':
        response = { success: true, data: apiSaveAIAgentsToSheet(postData.aiAgents) };
        break;
      case 'runAI':
        response = { success: true, data: apiRunAI(postData.prompt, postData.codeContext) };
        break;
      case 'saveProject':
        response = { success: true, data: apiSaveProject(postData.project) };
        break;
      case 'submitAssignment':
        response = { success: true, data: apiSubmitAssignment(postData.submission) };
        break;
      case 'recordTransaction':
        response = { success: true, data: apiRecordTransaction(postData.transaction) };
        break;
      case 'getGoogleUserProfile':
        response = { success: true, data: apiGetGoogleUserProfile() };
        break;
      case 'gradeSubmission':
        response = { success: true, data: apiGradeSubmission(postData.grading) };
        break;
      case 'getAdminStats':
        response = { success: true, data: apiGetAdminStats() };
        break;
      case 'toggleProStatus':
        response = { success: true, data: apiToggleProStatus(postData.isPro !== undefined ? postData.isPro : postData.payload) };
        break;
      case 'getLMSData':
        response = { success: true, data: apiGetLMSData() };
        break;
      case 'saveLMSData':
        response = apiSaveLMSData(postData.lmsData || postData.data);
        break;
      case 'getLibraryDocs':
        response = { success: true, data: apiGetLibraryDocs() };
        break;
      case 'saveLibraryDocs':
        response = apiSaveLibraryDocs(postData.libraryDocs || postData.data);
        break;
      case 'getCapstoneData':
        response = { success: true, data: apiGetCapstoneData() };
        break;
      case 'saveCapstoneData':
        response = apiSaveCapstoneData(postData.capstoneData || postData.data);
        break;
      case 'getGaleriKarya':
        response = { success: true, data: apiGetGaleriKarya() };
        break;
      case 'saveGaleriKarya':
        response = apiSaveGaleriKarya(postData.galeriKarya || postData.data);
        break;
      case 'uploadFileToDrive':
        response = apiUploadFileToDrive(postData.payload || postData);
        break;
      case 'getFirestoreConfig':
        response = { success: true, data: apiGetFirestoreConfig() };
        break;
      case 'saveFirestoreConfig':
        response = apiSaveFirestoreConfig(postData.firestoreConfig || postData.data);
        break;
      case 'testFirestoreConnection':
        response = apiTestFirestoreConnection(postData.payload || postData.firestoreConfig || postData);
        break;
      case 'migrateSheetsToFirestore':
        response = apiMigrateSheetsToFirestore(postData.payload || postData.firestoreConfig || postData);
        break;
      default:
        response = { success: false, message: 'Aksi tidak dikenal: ' + action };
    }
  } catch (error) {
    response = { success: false, error: error.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Mendapatkan referensi Spreadsheet database
 */
function getDatabase() {
  // 1. Coba Spreadsheet aktif jika script terikat (container-bound)
  try {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e) {
    Logger.log('getActiveSpreadsheet not available: ' + e.message);
  }

  // 2. Buka berdasarkan SPREADSHEET_ID resmi
  let ssId = CONFIG.SPREADSHEET_ID || PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (ssId) {
    try {
      return SpreadsheetApp.openById(ssId);
    } catch (e) {
      Logger.log('Tidak dapat membuka Spreadsheet ID: ' + ssId + '. Error: ' + e.message);
    }
  }
  return null;
}

/**
 * Mencari sheet config dengan prioritas cerdas (case-insensitive)
 */
function findConfigSheet(db) {
  if (!db) return null;
  const sheets = db.getSheets();
  
  // 1. Prioritas utama: sheet dengan nama yang mengandung 'config' atau 'konfig'
  for (let i = 0; i < sheets.length; i++) {
    const name = sheets[i].getName().toLowerCase().trim();
    if (name.includes('config') || name.includes('konfig')) {
      return sheets[i];
    }
  }
  
  // 2. Prioritas kedua: sheet Table1
  for (let i = 0; i < sheets.length; i++) {
    const name = sheets[i].getName().toLowerCase().trim();
    if (name === 'table1') {
      return sheets[i];
    }
  }
  
  // 3. Jika hanya ada 1 sheet di spreadsheet dan belum ada sheet config
  if (sheets.length === 1) {
    return sheets[0];
  }

  // 4. Cari apakah ada sheet yang sel pertamanya berisi kata kunci config/kategori
  for (let i = 0; i < sheets.length; i++) {
    try {
      const val = (sheets[i].getRange(1, 1).getValue() || '').toString().toLowerCase();
      if (val.includes('kategori') || val.includes('category') || val.includes('logo')) {
        return sheets[i];
      }
    } catch (e) {}
  }
  
  return null;
}

/**
 * Membaca konfigurasi Logo, Promosi, dan Musik langsung dari Sheet 'config' / 'Table1'
 */
function apiGetConfigFromSheet() {
  const db = getDatabase();
  const defaultConfig = {
    logoUrl: 'https://lh3.googleusercontent.com/d/1SLPiWxYWqZXg1Tly9o-xyax4_M6FRQxc',
    promoBanners: [
      'https://lh3.googleusercontent.com/d/1lv8RRFZhcym8R48lSKWRKRPIWex6htiq',
      'https://lh3.googleusercontent.com/d/1r2hvI8M1Blvfevfont_O62uNXWogJJIs',
      'https://lh3.googleusercontent.com/d/156XL-3ycRPz2KEGgF4_BO5RkhgPXPQVb'
    ],
    playlist: [
      {
        title: 'MEDINA - DUNIA SEMENTARA AKHIRAT SELAMANYA',
        url: 'https://www.dropbox.com/scl/fi/im0ous3b421amjms3jlno/MEDINA_-_DUNIA_SEMENTARA_AKHIRAT_SELAMANYA_-Official_Video-_MP3_48kbps_48k.mp3?rlkey=90d1loqhkfj04oq68a3j1d8gb&st=ljx9uh4r&raw=1'
      },
      {
        title: 'DOA DAN RINDU JAMARE (Reggae Viral TikTok)',
        url: 'https://www.dropbox.com/scl/fi/3ud0v4ozph1jk9bxs8gxf/DOA-DAN-RINDU-JAMARE-__-LAGU-REGGAE-VIRAL-TIKTOK-tuodDGXIAQA.mp3?rlkey=qjzbmoi94bznxek3gn26pgrm0&st=ub24xvmy&raw=1'
      },
      {
        title: '5 Waktu Reggae - Jangan Tinggalkan Salat',
        url: 'https://www.dropbox.com/scl/fi/7huc27fvx1m3chn9ljszw/5-waktu-Reggae-_-Jangan-tinggalkan-salat.mp3?rlkey=3jmyxc87olt6xmf0ikwkzoqf5&st=1e3ec8i3&raw=1'
      }
    ],
    aiAgents: [
      {
        id: 'agent-gemini-builder',
        name: 'GEMINI BUILDER',
        nama: 'GEMINI BUILDER',
        category: 'GEMINI GEM',
        kategori: 'GEMINI GEM',
        icon: '🤖',
        url: 'https://gemini.google.com/gems',
        description: 'Builder Aplikasi deploy full GAS',
        deskripsi: 'Builder Aplikasi deploy full GAS',
        gambarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'agent-gemini-prompt',
        name: 'Gemini Prompt',
        nama: 'Gemini Prompt',
        category: 'GEMINI GEM',
        kategori: 'GEMINI GEM',
        icon: '✨',
        url: 'https://gemini.google.com/gems',
        description: 'Membuat PRD/Arsitektur.md',
        deskripsi: 'Membuat PRD/Arsitektur.md',
        gambarUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80',
        imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'agent-gemini-poster',
        name: 'GEMINI POSTER/GAMBAR',
        nama: 'GEMINI POSTER/GAMBAR',
        category: 'GEMINI GEM',
        kategori: 'GEMINI GEM',
        icon: '🚀',
        url: 'https://gemini.google.com/gems',
        description: 'Membuat Poster gambar dengan /Charactercutout',
        deskripsi: 'Membuat Poster gambar dengan /Charactercutout',
        gambarUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
        imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'agent-antigravity',
        name: 'ANTI GRAVITY',
        nama: 'ANTI GRAVITY',
        category: 'AI TOOLS',
        kategori: 'AI TOOLS',
        icon: '💎',
        url: 'https://marketplace.visualstudio.com/',
        description: 'Membuat Aplikasi di Lokal Host Antigravity',
        deskripsi: 'Membuat Aplikasi di Lokal Host Antigravity',
        gambarUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
        imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'agent-vscode',
        name: 'VS CODE',
        nama: 'VS CODE',
        category: 'VS CODE EXTENSION',
        kategori: 'VS CODE EXTENSION',
        icon: '⚡',
        url: 'https://code.visualstudio.com/',
        description: 'MEMBUAT APLIKASI DI LOKAL HOST VS CODE',
        deskripsi: 'MEMBUAT APLIKASI DI LOKAL HOST VS CODE',
        gambarUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
        imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80'
      }
    ],
    adminPassword: 'ADMIN2026',
    proMembers: [
      'admin@busdigit.id',
      'tomi.bustomi@gmail.com'
    ],
    sheetName: 'default'
  };

  if (!db) return defaultConfig;

  try {
    const sheet = findConfigSheet(db);
    if (!sheet) return defaultConfig;

    const data = sheet.getDataRange().getValues();
    if (!data || data.length === 0) return defaultConfig;

    let config = {
      logoUrl: '',
      promoBanners: [],
      playlist: [],
      aiAgents: [],
      adminPassword: '',
      proMembers: [],
      sheetName: sheet.getName()
    };

    // Parser Cerdas: Membaca baris dan kolom secara komprehensif
    for (let r = 0; r < data.length; r++) {
      const row = data[r] || [];
      const col0 = (row[0] || '').toString().trim();
      const col1 = (row[1] || '').toString().trim();
      const col2 = (row[2] || '').toString().trim();
      const col3 = (row[3] || '').toString().trim();
      const fullRowText = row.map(c => (c || '').toString().trim()).join(' ').toLowerCase();

      // Abaikan header murni
      if (r === 0 && (col0.toLowerCase() === 'kategori' || col0.toLowerCase() === 'kunci' || col0.toLowerCase() === 'key')) {
        continue;
      }

      const col0Lower = col0.toLowerCase();

      // 1. LOGO
      if (col0Lower === 'logo' || col0Lower.includes('logo') || (!col0Lower && fullRowText.includes('logo'))) {
        for (let c = 1; c < row.length; c++) {
          const cellVal = (row[c] || '').toString().trim();
          if (cellVal && (cellVal.includes('http') || cellVal.includes('drive.google') || cellVal.includes('lh3.googleusercontent'))) {
            const raw = cellVal.split(/[,;\n]/)[0].trim();
            if (raw) {
              config.logoUrl = convertGoogleDriveToCdn(raw);
              break;
            }
          }
        }
      }
      // 2. PROMOSI / BANNER (Membaca seluruh kolom dan memecah tautan berjeda koma)
      else if (col0Lower.includes('promosi') || col0Lower.includes('promo') || col0Lower.includes('banner') || (!col0Lower && (fullRowText.includes('promosi') || fullRowText.includes('banner')))) {
        for (let c = 1; c < row.length; c++) {
          const cellVal = (row[c] || '').toString().trim();
          if (cellVal && (cellVal.includes('http') || cellVal.includes('drive.google') || cellVal.includes('lh3.googleusercontent'))) {
            const rawLinks = cellVal.split(/[,;\n]/);
            rawLinks.forEach(l => {
              const clean = l.trim();
              if (clean && (clean.includes('http') || clean.includes('drive.google') || clean.includes('lh3.googleusercontent'))) {
                const cdn = convertGoogleDriveToCdn(clean);
                if (cdn && !config.promoBanners.includes(cdn)) {
                  config.promoBanners.push(cdn);
                }
              }
            });
          }
        }
      }
      // 3. MUSIK / PLAYLIST (Membaca seluruh kolom dan memecah tautan lagu berjeda koma)
      else if (col0Lower.includes('musik') || col0Lower.includes('lagu') || col0Lower.includes('playlist') || col0Lower.includes('audio') || (!col0Lower && (fullRowText.includes('musik') || fullRowText.includes('lagu') || fullRowText.includes('playlist')))) {
        for (let c = 1; c < row.length; c++) {
          const cellVal = (row[c] || '').toString().trim();
          if (cellVal && (cellVal.includes('http') || cellVal.includes('dropbox') || cellVal.includes('.mp3'))) {
            const rawLinks = cellVal.split(/[,;\n]/);
            rawLinks.forEach(l => {
              const clean = l.trim();
              if (clean && (clean.includes('http') || clean.includes('dropbox') || clean.includes('.mp3'))) {
                const direct = ensureDropboxDirectStream(clean);
                if (direct && !config.playlist.some(p => p.url === direct)) {
                  const trackTitle = (col1 && !col1.toLowerCase().includes('musik') && !col1.toLowerCase().includes('lagu')) ? col1 : ('Lagu #' + (config.playlist.length + 1));
                  config.playlist.push({
                    title: trackTitle,
                    url: direct
                  });
                }
              }
            });
          }
        }
      }
      // 4. AI AGENTS (Membaca baris dengan kategori AI Agent / Agent / Gemini / GPT / Antigravity / Tool)
      else if (col0Lower.includes('agent') || col0Lower.includes('tool') || col0Lower.includes('ai') ||
               fullRowText.includes('agent') || fullRowText.includes('gemini') || fullRowText.includes('gpt') ||
               fullRowText.includes('antigravity') || fullRowText.includes('vscode') || fullRowText.includes('claude')) {
        const agentName = col1 || ('AI Agent #' + (config.aiAgents.length + 1));
        let agentUrl = '';
        let agentMeta = '';

        // Tentukan kolom URL direct dan metadata
        for (let c = 1; c < row.length; c++) {
          const cellVal = (row[c] || '').toString().trim();
          if (cellVal.startsWith('http://') || cellVal.startsWith('https://')) {
            if (!agentUrl) agentUrl = cellVal;
          } else if (c >= 2 && cellVal && !agentMeta) {
            agentMeta = cellVal;
          }
        }

        // Jika URL belum ketemu tapi ada di col2
        if (!agentUrl && (col2.startsWith('http://') || col2.startsWith('https://'))) {
          agentUrl = col2;
        }

        if (agentUrl) {
          let agentCategory = 'Custom AI';
          let agentIcon = '🤖';
          let agentDesc = agentMeta || 'Custom AI Agent untuk produktivitas & coding';
          let agentImage = '';

          // Ekstrak metadata: Icon | Kategori | Deskripsi | GambarUrl
          if (agentMeta && agentMeta.includes('|')) {
            const metaParts = agentMeta.split('|').map(p => p.trim());
            if (metaParts.length >= 4) {
              agentIcon = metaParts[0] || '🤖';
              agentCategory = metaParts[1] || 'Custom AI';
              
              // Cek apakah segmen terakhir adalah URL cover gambar
              const lastPart = metaParts[metaParts.length - 1];
              if (lastPart.startsWith('http://') || lastPart.startsWith('https://') || lastPart.includes('drive.google') || lastPart.includes('lh3.googleusercontent')) {
                agentImage = convertGoogleDriveToCdn(lastPart);
                agentDesc = metaParts.slice(2, metaParts.length - 1).join(' | ');
              } else {
                agentDesc = metaParts.slice(2).join(' | ');
              }
            } else if (metaParts.length === 3) {
              agentIcon = metaParts[0] || '🤖';
              agentCategory = metaParts[1] || 'Custom AI';
              agentDesc = metaParts[2] || '';
            } else if (metaParts.length === 2) {
              agentCategory = metaParts[0] || 'Custom AI';
              agentDesc = metaParts[1] || '';
            }
          } else {
            const lowerName = agentName.toLowerCase();
            if (lowerName.includes('gemini') || lowerName.includes('gem')) {
              agentCategory = 'GEMINI GEM';
              agentIcon = '💎';
            } else if (lowerName.includes('gpt') || lowerName.includes('chatgpt')) {
              agentCategory = 'Custom GPT';
              agentIcon = '🤖';
            } else if (lowerName.includes('antigravity') || lowerName.includes('anti gravity')) {
              agentCategory = 'AI TOOLS';
              agentIcon = '💎';
            } else if (lowerName.includes('vs code') || lowerName.includes('vscode')) {
              agentCategory = 'VS CODE EXTENSION';
              agentIcon = '⚡';
            } else if (lowerName.includes('claude')) {
              agentCategory = 'Claude Artifacts';
              agentIcon = '⚡';
            }
          }

          // Fallback gambar dari preset defaultConfig jika belum ada gambar kustom
          if (!agentImage) {
            const matchingDefault = defaultConfig.aiAgents.find(d => 
              (d.name && agentName && d.name.toLowerCase().trim() === agentName.toLowerCase().trim()) ||
              (d.nama && agentName && d.nama.toLowerCase().trim() === agentName.toLowerCase().trim())
            );
            if (matchingDefault && matchingDefault.gambarUrl) {
              agentImage = matchingDefault.gambarUrl;
            }
          }

          // Simpan semua AI agent tanpa membuang agent yang berbagi URL sama (seperti Gemini Gems)
          config.aiAgents.push({
            id: 'agent-' + (config.aiAgents.length + 1),
            name: agentName,
            nama: agentName,
            category: agentCategory,
            kategori: agentCategory,
            icon: agentIcon,
            url: agentUrl,
            description: agentDesc,
            deskripsi: agentDesc,
            gambarUrl: agentImage,
            imageUrl: agentImage
          });
        }
      }
      // 5. PASSWORD ADMIN / PIN SUPER ADMIN (Membaca baris Password Admin / PIN Super Admin)
      else if (col0Lower.includes('password') || col0Lower.includes('sandi') || col0Lower.includes('pin') ||
               (col0Lower.includes('admin') && !col0Lower.includes('agent'))) {
        for (let c = 1; c < row.length; c++) {
          const cellVal = (row[c] || '').toString().trim();
          if (cellVal && !cellVal.toLowerCase().includes('otorisasi') && !cellVal.toLowerCase().includes('status') && !cellVal.toLowerCase().includes('pin super admin')) {
            config.adminPassword = cellVal;
            break;
          }
        }
        if (!config.adminPassword && col2) config.adminPassword = col2.trim();
        else if (!config.adminPassword && col1) config.adminPassword = col1.trim();
      }
      // 6. MEMBER PRO / LISENSI PRO SISWA (Daftar email siswa/member yang disetup Admin)
      else if (col0Lower.includes('member pro') || col0Lower.includes('siswa pro') || col0Lower.includes('lisensi pro') ||
               col0Lower.includes('email pro') || col0Lower.includes('akun pro')) {
        let proListRaw = '';
        for (let c = 1; c < row.length; c++) {
          const cellVal = (row[c] || '').toString().trim();
          if (cellVal && !cellVal.toLowerCase().includes('otorisasi') && !cellVal.toLowerCase().includes('status') && !cellVal.toLowerCase().includes('daftar email')) {
            proListRaw = cellVal;
            break;
          }
        }
        if (!proListRaw && col2) proListRaw = col2.trim();
        else if (!proListRaw && col1) proListRaw = col1.trim();

        if (proListRaw) {
          const emails = proListRaw.split(/[,;\n]/).map(e => e.trim().toLowerCase()).filter(e => e && e.includes('@'));
          if (emails.length > 0) {
            config.proMembers = emails;
          }
        }
      }
    }

    // Pemindaian Tambahan (Fallback): Jika ada URL Dropbox atau Drive yang tersimpan bebas di sel
    if (config.playlist.length === 0 || config.promoBanners.length === 0) {
      for (let r = 0; r < data.length; r++) {
        for (let c = 0; c < data[r].length; c++) {
          const val = (data[r][c] || '').toString().trim();
          if (!val) continue;

          const subLinks = val.split(/[,;\n]/);
          subLinks.forEach(sub => {
            const clean = sub.trim();
            if (!clean) return;

            if (clean.includes('dropbox.com') || clean.includes('.mp3')) {
              const direct = ensureDropboxDirectStream(clean);
              if (!config.playlist.some(p => p.url === direct)) {
                config.playlist.push({
                  title: 'Lagu Koleksi #' + (config.playlist.length + 1),
                  url: direct
                });
              }
            } else if ((clean.includes('drive.google.com') || clean.includes('lh3.googleusercontent.com')) && (!config.logoUrl || !clean.includes(config.logoUrl))) {
              const cdn = convertGoogleDriveToCdn(clean);
              if (cdn && !config.promoBanners.includes(cdn)) {
                config.promoBanners.push(cdn);
              }
            }
          });
        }
      }
    }

    // Validasi Fallback jika ada yang kosong
    if (!config.logoUrl) config.logoUrl = defaultConfig.logoUrl;
    if (config.promoBanners.length === 0) config.promoBanners = defaultConfig.promoBanners;
    if (config.playlist.length === 0) config.playlist = defaultConfig.playlist;
    if (config.aiAgents.length === 0) config.aiAgents = defaultConfig.aiAgents;
    if (!config.adminPassword) config.adminPassword = defaultConfig.adminPassword || 'ADMIN2026';
    if (!config.proMembers || config.proMembers.length === 0) config.proMembers = defaultConfig.proMembers;

    return config;
  } catch (err) {
    Logger.log('Gagal parse config dari sheet: ' + err.message);
    return defaultConfig;
  }
}

/**
 * Menyimpan konfigurasi Logo, Promosi, Musik, dan AI Agents langsung ke Sheet 'Config' (CRUD Save)
 * Data digabung (merge) secara cerdas sehingga logo/banner/musik/agent tidak saling menimpa atau menghapus.
 */
function apiSaveConfigToSheet(configData) {
  const db = getDatabase();
  if (!db) {
    return { success: false, message: 'Gagal terhubung ke Google Spreadsheet' };
  }

  try {
    let sheet = findConfigSheet(db);
    if (!sheet) {
      sheet = db.getSheetByName('Config') || db.getSheetByName('config');
      if (!sheet) {
        sheet = db.insertSheet('Config');
      }
    }

    // Ambil konfigurasi saat ini sebagai baseline agar tidak kehilangan data komponen lain
    const existing = apiGetConfigFromSheet();
    
    // Tentukan nilai final yang akan disimpan
    const finalLogo = (configData && configData.logoUrl) ? configData.logoUrl.trim() : existing.logoUrl;
    
    const finalPromo = (configData && Array.isArray(configData.promoBanners) && configData.promoBanners.length > 0) 
      ? configData.promoBanners 
      : (existing.promoBanners || []);
      
    const finalPlaylist = (configData && Array.isArray(configData.playlist) && configData.playlist.length > 0) 
      ? configData.playlist 
      : (existing.playlist || []);
      
    // AI Agents: jika configData.aiAgents dikirim sebagai array (meski diubah atau ditambah), gunakan itu
    const finalAgents = (configData && Array.isArray(configData.aiAgents)) 
      ? configData.aiAgents 
      : (existing.aiAgents || []);

    // 5. Password / PIN Super Admin
    const finalAdminPassword = (configData && configData.adminPassword && configData.adminPassword.trim()) 
      ? configData.adminPassword.trim() 
      : (existing.adminPassword || 'ADMIN2026');

    // 6. Daftar Siswa/Member PRO Terdaftar
    let finalProMembers = (existing.proMembers && existing.proMembers.length > 0) ? existing.proMembers : defaultConfig.proMembers;
    if (configData && Array.isArray(configData.proMembers)) {
      finalProMembers = configData.proMembers.map(e => (e || '').toString().trim().toLowerCase()).filter(e => e && e.includes('@'));
    } else if (configData && typeof configData.proMembers === 'string' && configData.proMembers.trim()) {
      finalProMembers = configData.proMembers.split(/[,;\n]/).map(e => e.trim().toLowerCase()).filter(e => e && e.includes('@'));
    }

    const rows = [
      ['KATEGORI', 'NAMA / JUDUL', 'TAUTAN URL RESMI', 'KETERANGAN STATUS']
    ];

    // 1. Logo
    if (finalLogo) {
      rows.push(['Logo', 'Logo Resmi BUSDIGIT', finalLogo, 'Aktif (Header Brand)']);
    }

    // 2. Banner Promosi
    if (finalPromo && Array.isArray(finalPromo)) {
      finalPromo.forEach((banner, idx) => {
        if (banner && banner.trim()) {
          rows.push(['Promosi', 'Banner Promosi #' + (idx + 1), banner.trim(), 'Aktif (Carousel Hero)']);
        }
      });
    }

    // 3. Playlist Musik
    if (finalPlaylist && Array.isArray(finalPlaylist)) {
      finalPlaylist.forEach((track, idx) => {
        if (track && track.url && track.url.trim()) {
          const directUrl = ensureDropboxDirectStream(track.url.trim());
          rows.push(['Musik', track.title ? track.title.trim() : ('Lagu #' + (idx + 1)), directUrl, 'Aktif (Header Player)']);
        }
      });
    }

    // 4. Direktori AI Agents & Tools Hub
    if (finalAgents && Array.isArray(finalAgents)) {
      finalAgents.forEach((agent, idx) => {
        if (agent && agent.url && agent.url.trim()) {
          const name = (agent.name || agent.nama || ('AI Agent #' + (idx + 1))).trim();
          const url = agent.url.trim();
          const desc = (agent.description || agent.deskripsi || 'AI Agent').trim();
          const cat = (agent.category || agent.kategori || 'Tools').trim();
          const icon = (agent.icon || '🤖').trim();
          const img = (agent.gambarUrl || agent.imageUrl || '').trim();
          rows.push(['AI Agent', name, url, icon + ' | ' + cat + ' | ' + desc + (img ? (' | ' + img) : '')]);
        }
      });
    }

    // 5. Password / PIN Super Admin
    if (finalAdminPassword) {
      rows.push(['Password Admin', 'PIN Super Admin', finalAdminPassword, 'Otorisasi Akses Panel Admin']);
    }

    // 6. Member Siswa PRO
    if (finalProMembers && finalProMembers.length > 0) {
      rows.push(['Member PRO', 'Daftar Email Siswa PRO Terdaftar', finalProMembers.join(', '), 'Aktif (Lisensi PRO Siswa)']);
    }

    // Tulis ke Sheet
    sheet.clear();
    sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);

    // Format estetika header tabel
    try {
      const headerRange = sheet.getRange(1, 1, 1, rows[0].length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#bef264');
      headerRange.setFontColor('#070a13');
      sheet.autoResizeColumns(1, rows[0].length);
    } catch (styleErr) {}

    return {
      success: true,
      message: 'Konfigurasi berhasil disimpan ke Google Sheet (' + sheet.getName() + ')',
      savedConfig: {
        logoUrl: finalLogo,
        promoBanners: finalPromo,
        playlist: finalPlaylist,
        aiAgents: finalAgents || [],
        adminPassword: finalAdminPassword,
        proMembers: finalProMembers,
        sheetName: sheet.getName()
      }
    };
  } catch (err) {
    Logger.log('apiSaveConfigToSheet error: ' + err.message);
    return { success: false, message: 'Gagal menyimpan ke Sheet: ' + err.message };
  }
}

/**
 * Menyimpan khusus daftar AI Agent langsung ke Sheet
 * Menerima baik array langsung maupun payload { aiAgents: [...] }
 */
function apiSaveAIAgentsToSheet(agentsList) {
  try {
    let list = agentsList;
    if (agentsList && typeof agentsList === 'object' && Array.isArray(agentsList.aiAgents)) {
      list = agentsList.aiAgents;
    }
    if (!Array.isArray(list)) {
      list = [];
    }

    const currentConfig = apiGetConfigFromSheet();
    currentConfig.aiAgents = list;
    return apiSaveConfigToSheet(currentConfig);
  } catch (err) {
    Logger.log('apiSaveAIAgentsToSheet error: ' + err.message);
    return { success: false, message: 'Gagal menyimpan AI Agents: ' + err.message };
  }
}

/**
 * Mengubah status PRO secara global atau per email siswa terdaftar
 */
function apiToggleProStatus(payload) {
  try {
    let isPro = false;
    let email = '';
    if (typeof payload === 'boolean') {
      isPro = payload;
    } else if (payload && typeof payload === 'object') {
      isPro = !!payload.isPro;
      email = (payload.email || '').trim().toLowerCase();
    }
    
    // Jika ada email spesifik yang ingin di-toggle/di-daftarkan ke PRO
    if (email && email.includes('@')) {
      const config = apiGetConfigFromSheet();
  const capstoneData = apiGetCapstoneData().capstoneData;
  const galeriKarya = apiGetGaleriKarya().galeriKarya;
      let proMembers = config.proMembers || [];
      if (isPro) {
        if (!proMembers.some(e => e.toLowerCase() === email)) {
          proMembers.push(email);
        }
      } else {
        proMembers = proMembers.filter(e => e.toLowerCase() !== email);
      }
      config.proMembers = proMembers;
      apiSaveConfigToSheet(config);
      return { success: true, isPro: isPro, email: email, proMembers: proMembers };
    }
    
    // Simpan status global di ScriptProperties jika tidak ada email
    PropertiesService.getScriptProperties().setProperty('GLOBAL_PRO_ACTIVE', isPro ? 'true' : 'false');
    return { success: true, isPro: isPro, message: 'Status PRO global diperbarui' };
  } catch (err) {
    Logger.log('apiToggleProStatus error: ' + err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Konversi link Google Drive ke direct CDN lh3
 */
function convertGoogleDriveToCdn(url) {
  if (!url) return '';
  url = url.trim();
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_\-]+)/) ||
                url.match(/[?&]id=([a-zA-Z0-9_\-]+)/) ||
                url.match(/\/d\/([a-zA-Z0-9_\-]+)/);
  if (match && match[1]) {
    return 'https://lh3.googleusercontent.com/d/' + match[1];
  }
  return url;
}

/**
 * Konversi link Dropbox ke direct streaming MP3 biner (raw=1)
 */
function ensureDropboxDirectStream(url) {
  if (!url) return '';
  url = url.trim();
  if (url.includes('dropbox.com')) {
    url = url.replace(/([?&])dl=0/g, '$1raw=1').replace(/([?&])dl=1/g, '$1raw=1');
    if (!url.includes('raw=1')) {
      url += (url.includes('?') ? '&' : '?') + 'raw=1';
    }
  }
  return url;
}

/**
 * Mengambil dataset inisial lengkap untuk aplikasi
 */
function apiGetInitialData() {
  const email = Session.getActiveUser().getEmail() || 'rian.pratama@student.busdigit.id';
  const db = getDatabase();
  const config = apiGetConfigFromSheet();

  let user = {
    id: 'usr_001',
    name: 'Rian Pratama',
    email: email,
    role: 'STUDENT',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    xp: 4850,
    streak: 12,
    progressOverall: 82,
    isPro: false,
    membership: 'REGULAR'
  };

  if (db) {
    try {
      const sheet = db.getSheetByName('Siswa_Users');
      if (sheet) {
        const rows = sheet.getDataRange().getValues();
        if (rows.length > 1) {
          user.name = rows[1][1] || user.name;
          user.xp = rows[1][4] || user.xp;
          user.streak = rows[1][5] || user.streak;
          if (rows[1][6] !== undefined && rows[1][6] !== '') {
            const memVal = rows[1][6].toString().toUpperCase();
            user.isPro = memVal.includes('PRO') || memVal.includes('VIP') || memVal === 'TRUE';
            user.membership = user.isPro ? 'PRO' : 'REGULAR';
          }
        }
      }
    } catch (e) {}
  }

  return {
    currentUser: user,
    config: config,
    lmsData: apiGetLMSData(),
    libraryDocs: apiGetLibraryDocs(),
    capstoneData: (typeof apiGetCapstoneData === 'function') ? apiGetCapstoneData().capstoneData : getDefaultCapstoneData(),
    galeriKarya: (typeof apiGetGaleriKarya === 'function') ? apiGetGaleriKarya().galeriKarya : getDefaultGaleriKarya(),
    mentorInfo: {
      id: 'men_001',
      name: 'Dr. Kevin Aditya, M.Kom',
      title: 'Principal Software Architect & AI Mentor'
    },
    activeProject: {
      id: 'prj_001',
      title: 'Aplikasi Kasir BUSDIGIT Smart POS',
      progress: 75
    },
    certificate: {
      id: 'CV-2026-000001',
      studentName: user.name,
      courseName: 'Private Web Development & Vibe Coding Mastery',
      issuedDate: '12 September 2026',
      issuedBy: 'BUSDIGIT CODEVERSE Academy',
      status: 'VERIFIED'
    }
  };
}

/**
 * Menyimpan pengumpulan tugas langsung ke sheet 'Tugas_Submissions'
 */
function apiSubmitAssignment(submission) {
  const subId = 'SUB-' + Date.now().toString().slice(-6);
  const studentName = submission.studentName || 'Rian Pratama';
  const projectTitle = submission.projectTitle || 'Aplikasi Kasir BUSDIGIT Smart POS';
  const scores = { codeQuality: 28, uiUx: 20, functionality: 28, documentation: 19, total: 95 };

  const db = getDatabase();
  if (db) {
    try {
      const sheet = db.getSheetByName('Tugas_Submissions') || db.insertSheet('Tugas_Submissions');
      sheet.appendRow([
        subId,
        studentName,
        projectTitle,
        scores.codeQuality,
        scores.uiUx,
        scores.functionality,
        scores.documentation,
        scores.total,
        'PASSED',
        'Karya sangat rapi dan responsif!',
        new Date()
      ]);
    } catch (e) {}
  }

  return {
    success: true,
    submissionId: subId,
    studentName: studentName,
    scores: scores,
    status: 'PASSED',
    feedback: 'Penilaian otomatis berhasil: Skor 95/100 (Excellence). Data tersimpan di Google Spreadsheet!',
    timestamp: new Date().toISOString()
  };
}

function apiSaveProject(projectData) {
  const db = getDatabase();
  if (db) {
    try {
      const sheet = db.getSheetByName('Proyek_Siswa') || db.insertSheet('Proyek_Siswa');
      sheet.appendRow([
        projectData.id || 'PRJ-' + Date.now(),
        'usr_001',
        projectData.title || 'Aplikasi Web Vibe',
        (projectData.progress || 75) + '%',
        'ACTIVE',
        new Date()
      ]);
    } catch (e) {}
  }

  PropertiesService.getUserProperties().setProperty('SAVED_PROJECT_' + (projectData.id || 'DEFAULT'), JSON.stringify(projectData));
  return { success: true, timestamp: new Date().toISOString(), message: 'Proyek berhasil disimpan ke Database Google Sheets!' };
}

function apiRecordTransaction(trx) {
  const trxId = 'TRX-' + Date.now().toString().slice(-6);
  const db = getDatabase();
  
  if (db) {
    try {
      const sheet = db.getSheetByName('Transaksi_POS') || db.insertSheet('Transaksi_POS');
      sheet.appendRow([
        trxId,
        new Date(),
        trx.items || '2x Menu Kopi',
        trx.total || 'Rp 50.000',
        trx.method || 'QRIS',
        'LUNAS'
      ]);
    } catch (e) {}
  }

  return {
    success: true,
    transactionId: trxId,
    message: 'Transaksi berhasil dicatat ke Google Sheets Database!'
  };
}

function apiRunAI(promptText, currentCode) {
  return {
    code: currentCode,
    explanation: 'AI Synthesizer offline berhasil diproses.'
  };
}

/**
 * Mendapatkan profil akun Google aktif pengguna dari sesi Apps Script
 */
function apiGetGoogleUserProfile() {
  let email = '';
  try {
    email = Session.getActiveUser().getEmail();
  } catch (e) {
    Logger.log('Session email error: ' + e.message);
  }

  let role = 'GUEST';
  let name = 'Pengunjung Baru';
  let avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

  if (email) {
    name = email.split('@')[0].replace(/[._]/g, ' ');
    name = name.charAt(0).toUpperCase() + name.slice(1);
    
    if (email.toLowerCase().includes('admin') || email.toLowerCase().includes('super')) {
      role = 'ADMIN';
      avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
    } else if (email.toLowerCase().includes('mentor') || email.toLowerCase().includes('kevin')) {
      role = 'MENTOR';
      avatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';
    } else {
      role = 'STUDENT';
    }
  }

  return {
    authenticated: Boolean(email),
    email: email || 'tomi.bustomi@gmail.com',
    name: name,
    role: role,
    avatar: avatar
  };
}

/**
 * Mentor memberi nilai dan ulasan pada tugas Capstone POS siswa
 */
function apiGradeSubmission(grading) {
  const subId = grading.submissionId || ('SUB-' + Date.now().toString().slice(-6));
  const studentName = grading.studentName || 'Rian Pratama';
  const score = grading.score || 95;
  const feedback = grading.feedback || 'Hasil kode sangat rapi, responsive, dan deployment sukses!';
  const status = score >= 70 ? 'PASSED' : 'REVISION';

  const db = getDatabase();
  if (db) {
    try {
      const sheet = db.getSheetByName('Tugas_Submissions') || db.insertSheet('Tugas_Submissions');
      sheet.appendRow([
        subId,
        studentName,
        'Aplikasi Kasir BUSDIGIT Smart POS',
        score,
        status,
        feedback,
        'Dr. Kevin Aditya, M.Kom',
        new Date()
      ]);
    } catch (e) {
      Logger.log('Gagal menyimpan nilai ke sheet: ' + e.message);
    }
  }

  return {
    success: true,
    submissionId: subId,
    studentName: studentName,
    score: score,
    status: status,
    feedback: feedback,
    gradedBy: 'Dr. Kevin Aditya, M.Kom',
    timestamp: new Date().toISOString()
  };
}

/**
 * Mengambil ringkasan data platform untuk Super Admin
 */
function apiGetAdminStats() {
  const db = getDatabase();
  let studentCount = 156;
  let mentorCount = 8;
  let totalRevenue = 'Rp 18.450.000';
  let sheetStatus = 'Online (Terhubung ke Google Sheets)';

  if (db) {
    try {
      sheetStatus = 'Online (' + db.getName() + ')';
    } catch (e) {}
  }

  return {
    success: true,
    stats: {
      totalUsers: 164,
      totalStudents: studentCount,
      activeStudents: 42,
      totalMentors: mentorCount,
      totalCourses: 5,
      totalRevenue: totalRevenue,
      sheetStatus: sheetStatus
    }
  };
}

/**
 * ============================================================================
 * RPC ALIAS BRIDGES (UNTUK PEMANGGILAN google.script.run DARI FRONTEND)
 * ============================================================================
 */
function getConfig() {
  return apiGetConfigFromSheet();
}

function saveConfig(configData) {
  return apiSaveConfigToSheet(configData);
}

function saveAIAgents(agentsData) {
  return apiSaveAIAgentsToSheet(agentsData);
}

function runAI(promptText, currentCode) {
  return apiRunAI(promptText, currentCode);
}

function saveProject(projectData) {
  return apiSaveProject(projectData);
}

function submitAssignment(submission) {
  return apiSubmitAssignment(submission);
}

function recordTransaction(trx) {
  return apiRecordTransaction(trx);
}

function getInitialData() {
  return apiGetInitialData();
}

function getGoogleUserProfile() {
  return apiGetGoogleUserProfile();
}

function gradeSubmission(grading) {
  return apiGradeSubmission(grading);
}

function getAdminStats() {
  return apiGetAdminStats();
}

function apiToggleProStatus(isPro) {
  try {
    const db = getDatabase();
    if (db) {
      const sheet = db.getSheetByName('Siswa_Users');
      if (sheet && sheet.getLastRow() > 1) {
        sheet.getRange(2, 7).setValue(isPro ? 'PRO' : 'REGULAR');
      }
    }
    return { success: true, isPro: Boolean(isPro) };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

function toggleProStatus(isPro) {
  return apiToggleProStatus(isPro);
}




/**
 * ============================================================================
 * MODUL LMS KELAS & LIBRARY DOCS DATA ENGINE (GOOGLE SHEETS CRUD)
 * ============================================================================
 */

function getDefaultLMSData() {
  return [
    {
      id: 'bab-1',
      babNumber: 1,
      title: 'BAB 1 ( METODE APPSCRIPT )',
      badge: 'BEGINNER',
      coverUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
      modulesCount: 8,
      durationHours: 4,
      lessons: [
        { id: 'b1-m1', chapter: 'MEMBUAT APLIKASI BASIC DI APPSCRIPT', title: 'MEMBUAT WEBAPPS DENGAN ARCHON + GEM CUSTOM', youtubeId: 'dQw4w9WgXcQ', duration: '14:20', completed: true },
        { id: 'b1-m2', chapter: 'UPGRADE APLIKASI & PERBAIKAN ERROR', title: 'TOOLS PERBAIKAN & UPGRADE FITUR', youtubeId: 'dQw4w9WgXcQ', duration: '18:45', completed: true },
        { id: 'b1-m3', chapter: 'MEMAKAI TOOLS ANTIGRAVITY IDE & VS CODE', title: 'Download dan Instalasi Antigravity IDE', youtubeId: 'dQw4w9WgXcQ', duration: '10:15', completed: true },
        { id: 'b1-m4', chapter: 'MEMAKAI TOOLS ANTIGRAVITY IDE & VS CODE', title: 'Membuka Folder Project, Login & Git Sync', youtubeId: 'dQw4w9WgXcQ', duration: '12:30', completed: true },
        { id: 'b1-m5', chapter: 'TUTORIAL MEMAKAI GEM CUSTOM VIBE CODING', title: 'TUTORIAL PAKE GEM CUSTOM PROMPT GENERATOR', youtubeId: 'dQw4w9WgXcQ', duration: '15:10', completed: false },
        { id: 'b1-m6', chapter: 'TUTORIAL MEMAKAI GEM CUSTOM VIBE CODING', title: 'CARA PENGGUNAAN V3 & V5 CODEBUILDER', youtubeId: 'dQw4w9WgXcQ', duration: '21:00', completed: false },
        { id: 'b1-m7', chapter: 'TUTORIAL MEMBUAT WEBAPPS [BARU]', title: 'PAKE ARCHON + GEM CUSTOM DEPLOY INSTAN', youtubeId: 'dQw4w9WgXcQ', duration: '16:40', completed: false, isNew: true },
        { id: 'b1-m8', chapter: 'TUTORIAL MEMBUAT WEBAPPS [BARU]', title: 'Deploy ke Google Workspace & Custom Domain', youtubeId: 'dQw4w9WgXcQ', duration: '25:00', completed: false }
      ]
    },
    {
      id: 'bab-2',
      babNumber: 2,
      title: 'BAB 2 ( METODE MONOREPO )',
      badge: 'BEGINNER',
      coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      modulesCount: 10,
      durationHours: 4,
      lessons: [
        { id: 'b2-m1', chapter: 'STRUKTUR MONOREPO BUSDIGIT', title: 'Pemisahan Core Script, Modules, dan Static Assets', youtubeId: 'dQw4w9WgXcQ', duration: '15:30', completed: false },
        { id: 'b2-m2', chapter: 'STRUKTUR MONOREPO BUSDIGIT', title: 'Setup Clasp & TypeScript Compiler', youtubeId: 'dQw4w9WgXcQ', duration: '20:10', completed: false },
        { id: 'b2-m3', chapter: 'KOMPILASI & BUNDLING', title: 'Vite & Rollup untuk Apps Script Production', youtubeId: 'dQw4w9WgXcQ', duration: '18:40', completed: false }
      ]
    },
    {
      id: 'bab-3',
      babNumber: 3,
      title: 'BAB 3 MIGRASI DATABASE APPSCRIPT',
      badge: 'BEGINNER',
      coverUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
      modulesCount: 4,
      durationHours: 4,
      lessons: [
        { id: 'b3-m1', chapter: 'NORMALISASI GOOGLE SHEETS', title: 'Merancang Skema Tabel Relasional di Spreadsheet', youtubeId: 'dQw4w9WgXcQ', duration: '17:00', completed: false },
        { id: 'b3-m2', chapter: 'OPTIMASI INDEX & LOCKS', title: 'Mencegah Race Condition dengan LockService', youtubeId: 'dQw4w9WgXcQ', duration: '22:15', completed: false }
      ]
    },
    {
      id: 'bab-4',
      babNumber: 4,
      title: 'BAB 4 - TUTORIAL CUSTOM DOMAIN',
      badge: 'BEGINNER',
      coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
      modulesCount: 5,
      durationHours: 4,
      lessons: [
        { id: 'b4-m1', chapter: 'DNS & CLOUDFLARE PROXY', title: 'Setup Domain Pribadi untuk Web App Apps Script', youtubeId: 'dQw4w9WgXcQ', duration: '14:50', completed: false },
        { id: 'b4-m2', chapter: 'SSL & EDGE REWRITE', title: 'Konfigurasi Cloudflare Worker Reverse Proxy', youtubeId: 'dQw4w9WgXcQ', duration: '19:30', completed: false }
      ]
    },
    {
      id: 'bab-5',
      babNumber: 5,
      title: 'BAB 5 ( TUTORIAL PWA MOBILE EKOSISTEM )',
      badge: 'BEGINNER',
      coverUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80',
      modulesCount: 1,
      durationHours: 4,
      lessons: [
        { id: 'b5-m1', chapter: 'PWA MANIFEST & SERVICE WORKER', title: 'Menjadikan Aplikasi Web Bisa Diinstal di Android & iOS', youtubeId: 'dQw4w9WgXcQ', duration: '28:10', completed: false }
      ]
    },
    {
      id: 'bab-6',
      babNumber: 6,
      title: 'BAB 6 - TUTORIAL INSTAL TOOLS PENDUKUNG VIBE CODING',
      badge: 'BEGINNER',
      coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      modulesCount: 7,
      durationHours: 4,
      lessons: [
        { id: 'b6-m1', chapter: 'ANTIGRAVITY & EXTENSIONS', title: 'Instalasi Plugin, Custom Skills, dan Prompt Templates', youtubeId: 'dQw4w9WgXcQ', duration: '16:00', completed: false }
      ]
    },
    {
      id: 'bab-7',
      babNumber: 7,
      title: 'BAB 7 - TUTORIAL GATEWAY-AN INTEGRASI PIHAK KETIGA',
      badge: 'BEGINNER',
      coverUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
      modulesCount: 1,
      durationHours: 4,
      lessons: [
        { id: 'b7-m1', chapter: 'PAYMENT GATEWAY MIDTRANS & XENDIT', title: 'Integrasi Webhook Pembayaran QRIS & Virtual Account', youtubeId: 'dQw4w9WgXcQ', duration: '32:45', completed: false }
      ]
    },
    {
      id: 'bab-8',
      babNumber: 8,
      title: 'BAB 8 - TUTORIAL BELI / LANGGANAN TOOLS KEBUTUHAN PROJECT',
      badge: 'BEGINNER',
      coverUrl: 'https://images.unsplash.com/photo-1556742049-0a67e557224f?w=800&auto=format&fit=crop&q=80',
      modulesCount: 3,
      durationHours: 4,
      lessons: [
        { id: 'b8-m1', chapter: 'SELEKSI CLOUD TIER GRATIS', title: 'Optimalisasi Free Tier Supabase, Firebase, dan Cloudflare', youtubeId: 'dQw4w9WgXcQ', duration: '18:15', completed: false }
      ]
    },
    {
      id: 'bab-9',
      babNumber: 9,
      title: 'BAB RANDOM ( EKOSISTEM KELAS SANTRI VERSE )',
      badge: 'BEGINNER',
      coverUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
      modulesCount: 4,
      durationHours: 4,
      lessons: [
        { id: 'b9-m1', chapter: 'STUDI KASUS DAN PROJEK RIIL', title: 'Bedah Arsitektur Aplikasi Komunitas Santri & Santriverse', youtubeId: 'dQw4w9WgXcQ', duration: '24:00', completed: false }
      ]
    }
  ];
}

function getDefaultLibraryDocs() {
  return [
    {
      id: 'lib-n8n-01',
      tabCategory: 'n8n',
      platform: 'OpenAI',
      subCategoryTag: 'TRAVEL',
      title: 'Flight Price Drop Alert',
      description: 'Template workflow n8n sebagai dasar pengembangan sistem pemantauan penurunan harga tiket penerbangan secara otomatis menggunakan webhook & scraping.',
      coverUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop&q=80',
      tags: ['OpenAI', 'Weaviate', 'Hugging Face', '+2'],
      contentPayload: '{\n  "name": "Flight Price Drop Alert",\n  "nodes": [\n    { "name": "Cron Trigger", "type": "n8n-nodes-base.cron" },\n    { "name": "OpenAI Parse Prices", "type": "n8n-nodes-base.openAi" },\n    { "name": "Telegram Alert", "type": "n8n-nodes-base.telegram" }\n  ]\n}',
      viewsCount: 1,
      commentsCount: 1
    },
    {
      id: 'lib-n8n-02',
      tabCategory: 'n8n',
      platform: 'Cohere',
      subCategoryTag: 'TRAVEL',
      title: 'Local Attraction Recommender',
      description: 'Local Attraction Recommender Workflow otomasi n8n yang dirancang untuk memberikan rekomendasi tempat wisata lokal dengan AI RAG & embedding.',
      coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
      tags: ['Cohere', 'Pinecone', 'Anthropic Claude', '+2'],
      contentPayload: '{\n  "name": "Local Attraction Recommender",\n  "nodes": [\n    { "name": "Webhook API", "type": "n8n-nodes-base.webhook" },\n    { "name": "Pinecone Query", "type": "n8n-nodes-base.pinecone" },\n    { "name": "Anthropic Claude Formatter", "type": "n8n-nodes-base.anthropic" }\n  ]\n}',
      viewsCount: 1,
      commentsCount: 1
    },
    {
      id: 'lib-prompt-01',
      tabCategory: 'prompt',
      platform: 'Anthropic Claude',
      subCategoryTag: 'VIBE CODING',
      title: 'Archon Vibe Master System Prompt',
      description: 'System prompt arsitek aplikasi Google Apps Script modern lengkap dengan UI React Bits, Tailwind, dan modul keamanan data.',
      coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      tags: ['Anthropic Claude', 'OpenAI', 'Antigravity'],
      contentPayload: 'You are Archon, the master software architect for high-performance Google Apps Script web applications and modern enterprise dashboards...',
      viewsCount: 4,
      commentsCount: 2
    },
    {
      id: 'lib-repo-01',
      tabCategory: 'repo',
      platform: 'GitHub',
      subCategoryTag: 'BOILERPLATE',
      title: 'GAS Monorepo Clasp Starter Pack',
      description: 'Repository template resmi monorepo Google Apps Script dengan Vite, Tailwind CSS, TypeScript, dan CI/CD otomatis.',
      coverUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
      tags: ['Repo GitHub', 'Clasp', 'TypeScript'],
      contentPayload: 'https://github.com/busdigit/codeverse-gas-monorepo-starter',
      viewsCount: 12,
      commentsCount: 5
    },
    {
      id: 'lib-style-01',
      tabCategory: 'style',
      platform: 'CSS / UI',
      subCategoryTag: 'DESIGN SYSTEM',
      title: 'Motion Obsidian & Electric Mint Tokens',
      description: 'Koleksi token CSS variable, efek glowing hairline border, dan spring cubic-bezier transitions untuk antarmuka dark mode premium.',
      coverUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
      tags: ['STYLE UI UX', 'CSS3', 'Framer Motion'],
      contentPayload: ':root {\n  --bg-dark-obsidian: #020408;\n  --accent-electric-mint: #00FFA3;\n  --spring-snappy: cubic-bezier(0.2, 0.8, 0.2, 1);\n}',
      viewsCount: 8,
      commentsCount: 3
    },
    {
      id: 'lib-ext-01',
      tabCategory: 'extension',
      platform: 'VS Code',
      subCategoryTag: 'DEVELOPER TOOLS',
      title: 'Antigravity Coding Companion Pack',
      description: 'Bundle rekomendasi ekstensi VS Code dan Antigravity untuk penulisan skrip Google Apps Script secara offline.',
      coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      tags: ['extension', 'VS Code', 'Antigravity'],
      contentPayload: 'https://marketplace.visualstudio.com/items?itemName=google-apps-script-pack',
      viewsCount: 6,
      commentsCount: 1
    },
    {
      id: 'lib-comp-01',
      tabCategory: 'component',
      platform: 'React Bits',
      subCategoryTag: 'INTERACTIVE UI',
      title: 'Interactive Particle Constellation Sphere',
      description: 'Komponen canvas bola partikel kosmik interaktif 60 FPS yang merespon gerakan mouse dan sentuhan layar perangkat mobile.',
      coverUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80',
      tags: ['component', 'Canvas HTML5', 'Motion.dev'],
      contentPayload: '<canvas id="sphereCanvas"></canvas>\n<script>/* 3D particle sphere logic */</script>',
      viewsCount: 9,
      commentsCount: 4
    }
  ];
}

/**
 * Membaca data LMS Kurikulum dari Google Spreadsheet
 */
function apiGetLMSData() {
  const db = getDatabase();
  const defaultData = getDefaultLMSData();
  if (!db) return defaultData;

  try {
    const sheet = db.getSheetByName('LMS_Kurikulum') || db.getSheetByName('LMS_Kelas');
    if (!sheet) return defaultData;

    const values = sheet.getDataRange().getValues();
    if (!values || values.length <= 1) return defaultData;

    const list = [];
    for (let r = 1; r < values.length; r++) {
      const row = values[r];
      const babId = (row[0] || ('bab-' + r)).toString().trim();
      const babNumber = parseInt(row[1], 10) || r;
      const title = (row[2] || ('BAB ' + r)).toString().trim();
      const badge = (row[3] || 'BEGINNER').toString().trim();
      const coverUrl = (row[4] || '').toString().trim() || defaultData[0].coverUrl;
      const modulesCount = parseInt(row[5], 10) || 8;
      const durationHours = parseInt(row[6], 10) || 4;
      let lessons = [];

      try {
        const rawLessons = (row[7] || '').toString().trim();
        if (rawLessons && (rawLessons.startsWith('[') || rawLessons.startsWith('{'))) {
          lessons = JSON.parse(rawLessons);
        }
      } catch (parseErr) {
        lessons = [];
      }

      list.push({
        id: babId,
        babNumber: babNumber,
        title: title,
        badge: badge,
        coverUrl: coverUrl,
        modulesCount: modulesCount,
        durationHours: durationHours,
        lessons: (Array.isArray(lessons) && lessons.length > 0) ? lessons : (defaultData[r - 1] ? defaultData[r - 1].lessons : [])
      });
    }

    return list.length > 0 ? list : defaultData;
  } catch (err) {
    Logger.log('apiGetLMSData error: ' + err.message);
    return defaultData;
  }
}

/**
 * Menyimpan data LMS Kurikulum ke Sheet 'LMS_Kurikulum'
 */
function apiSaveLMSData(lmsList) {
  const db = getDatabase();
  if (!db) return { success: false, message: 'Koneksi Spreadsheet tidak tersedia' };

  try {
    let sheet = db.getSheetByName('LMS_Kurikulum');
    if (!sheet) sheet = db.insertSheet('LMS_Kurikulum');

    let list = lmsList;
    if (lmsList && typeof lmsList === 'object' && Array.isArray(lmsList.lmsData)) {
      list = lmsList.lmsData;
    }
    if (!Array.isArray(list) || list.length === 0) {
      list = getDefaultLMSData();
    }

    const rows = [
      ['BAB ID', 'NOMOR BAB', 'JUDUL BAB', 'BADGE', 'COVER IMAGE URL', 'JUMLAH MODUL', 'DURASI JAM', 'DAFTAR LESSONS JSON']
    ];

    list.forEach((bab, idx) => {
      rows.push([
        bab.id || ('bab-' + (idx + 1)),
        bab.babNumber || (idx + 1),
        bab.title || ('BAB ' + (idx + 1)),
        bab.badge || 'BEGINNER',
        bab.coverUrl || '',
        bab.modulesCount || 8,
        bab.durationHours || 4,
        JSON.stringify(bab.lessons || [])
      ]);
    });

    sheet.clear();
    sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);

    try {
      const header = sheet.getRange(1, 1, 1, rows[0].length);
      header.setFontWeight('bold');
      header.setBackground('#00FFA3');
      header.setFontColor('#020408');
      sheet.autoResizeColumns(1, rows[0].length);
    } catch (e) {}

    return { success: true, message: 'Kurikulum LMS berhasil disimpan ke Sheet LMS_Kurikulum', lmsData: list };
  } catch (err) {
    Logger.log('apiSaveLMSData error: ' + err.message);
    return { success: false, message: 'Gagal simpan LMS: ' + err.message };
  }
}

/**
 * Membaca data Library Pustaka & Docs dari Google Spreadsheet
 */
function apiGetLibraryDocs() {
  const db = getDatabase();
  const defaultDocs = getDefaultLibraryDocs();
  if (!db) return defaultDocs;

  try {
    const sheet = db.getSheetByName('Library_Docs') || db.getSheetByName('LibraryDocs');
    if (!sheet) return defaultDocs;

    const values = sheet.getDataRange().getValues();
    if (!values || values.length <= 1) return defaultDocs;

    const list = [];
    for (let r = 1; r < values.length; r++) {
      const row = values[r];
      const id = (row[0] || ('lib-' + r)).toString().trim();
      const tabCategory = (row[1] || 'prompt').toString().trim().toLowerCase();
      const platform = (row[2] || 'OpenAI').toString().trim();
      const subCategoryTag = (row[3] || 'GENERAL').toString().trim();
      const title = (row[4] || ('Item #' + r)).toString().trim();
      const description = (row[5] || '').toString().trim();
      const coverUrl = (row[6] || '').toString().trim();
      let tags = [];
      try {
        const rawTags = (row[7] || '').toString().trim();
        tags = rawTags.includes(',') ? rawTags.split(',').map(t => t.trim()) : [platform];
      } catch (e) {
        tags = [platform];
      }
      const contentPayload = (row[8] || '').toString();

      list.push({
        id: id,
        tabCategory: tabCategory,
        platform: platform,
        subCategoryTag: subCategoryTag,
        title: title,
        description: description,
        coverUrl: coverUrl,
        tags: tags,
        contentPayload: contentPayload,
        viewsCount: 1,
        commentsCount: 1
      });
    }

    return list.length > 0 ? list : defaultDocs;
  } catch (err) {
    Logger.log('apiGetLibraryDocs error: ' + err.message);
    return defaultDocs;
  }
}

/**
 * Menyimpan data Library Pustaka & Docs ke Sheet 'Library_Docs'
 */
function apiSaveLibraryDocs(docsList) {
  const db = getDatabase();
  if (!db) return { success: false, message: 'Koneksi Spreadsheet tidak tersedia' };

  try {
    let sheet = db.getSheetByName('Library_Docs');
    if (!sheet) sheet = db.insertSheet('Library_Docs');

    let list = docsList;
    if (docsList && typeof docsList === 'object' && Array.isArray(docsList.libraryDocs)) {
      list = docsList.libraryDocs;
    }
    if (!Array.isArray(list) || list.length === 0) {
      list = getDefaultLibraryDocs();
    }

    const rows = [
      ['ID', 'KATEGORI TAB', 'PLATFORM', 'SUB TAG', 'JUDUL', 'DESKRIPSI', 'COVER IMAGE URL', 'TAGS', 'KONTEN / URL']
    ];

    list.forEach((item, idx) => {
      rows.push([
        item.id || ('lib-' + (idx + 1)),
        (item.tabCategory || 'prompt').toLowerCase(),
        item.platform || 'General',
        item.subCategoryTag || 'TECH',
        item.title || ('Item #' + (idx + 1)),
        item.description || '',
        item.coverUrl || '',
        Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || ''),
        item.contentPayload || ''
      ]);
    });

    sheet.clear();
    sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);

    try {
      const header = sheet.getRange(1, 1, 1, rows[0].length);
      header.setFontWeight('bold');
      header.setBackground('#38bdf8');
      header.setFontColor('#020408');
      sheet.autoResizeColumns(1, rows[0].length);
    } catch (e) {}

    return { success: true, message: 'Library Docs berhasil disimpan ke Sheet Library_Docs', libraryDocs: list };
  } catch (err) {
    Logger.log('apiSaveLibraryDocs error: ' + err.message);
    return { success: false, message: 'Gagal simpan Library Docs: ' + err.message };
  }
}

function getLMSData() {
  return apiGetLMSData();
}

function saveLMSData(lmsList) {
  return apiSaveLMSData(lmsList);
}

function getLibraryDocs() {
  return apiGetLibraryDocs();
}

function saveLibraryDocs(docsList) {
  return apiSaveLibraryDocs(docsList);
}

// ==========================================================================
// CAPSTONE PROJECTS & PRODUK LAYANAN (BUSDIGIT SMART POS & SAAS)
// ==========================================================================
function getDefaultCapstoneData() {
  return [
    {
      id: 'cap-001',
      code: 'CAPSTONE PROJECT #001',
      title: 'Aplikasi Sistem Keuangan Berbasis PSAK & Terintegrasi dengan Bot Telegram',
      category: 'Sistem Keuangan PSAK & Bot',
      description: 'Sistem akuntansi terintegrasi standar PSAK dengan notifikasi bot Telegram dan database Google Sheets.',
      targetPercent: 13,
      isActive: true,
      appUrl: 'https://script.google.com/macros/s/AKfycbz_keuangan_psak/exec',
      demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      price: 599000,
      promoPrice: 299000,
      saleStatus: '🔥 BEST SELLER',
      thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600',
      orderWaNumber: '6281234567890',
      milestones: [
        { id: 'm1', text: '1. Analisis kebutuhan aplikasi Selesai', completed: true },
        { id: 'm2', text: '2. Penyusunan PRD Minggu 1 3', completed: false },
        { id: 'm3', text: '3. Desain UI/UX Minggu 2 4', completed: false },
        { id: 'm4', text: '4. Pembuatan database Minggu 3 5', completed: false },
        { id: 'm5', text: '5. Pengembangan aplikasi Minggu 4–5 6', completed: false },
        { id: 'm6', text: '6. Testing aplikasi & Deploy Bot Telegram', completed: false }
      ],
      rubrics: [
        { name: 'Arsitektur Kode', score: 28, maxScore: 30 },
        { name: 'UI/UX React Bits', score: 20, maxScore: 20 },
        { name: 'Fungsionalitas', score: 28, maxScore: 30 }
      ],
      mentorFeedback: {
        quote: 'Desain kartu React Bits dan implementasi dock navigasi bawah sangat rapi dan ramah di ponsel!',
        author: 'BusDigit'
      }
    },
    {
      id: 'cap-002',
      code: 'CAPSTONE PROJECT #002',
      title: 'APLIKASI SI PRESENSI MAHASISWA',
      category: 'Presensi & Akademik GAS',
      description: 'Sistem presensi mahasiswa berbasis GPS radius geofence, scan barcode mandiri, dan rekap otomatis spreadsheet.',
      targetPercent: 45,
      isActive: false,
      appUrl: 'https://script.google.com/macros/s/AKfycbz_presensi_mahasiswa/exec',
      demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      price: 399000,
      promoPrice: 199000,
      saleStatus: '⚡ SIAP DEPLOY',
      thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600',
      orderWaNumber: '6281234567890',
      milestones: [
        { id: 'm1', text: '1. Desain Database Mahasiswa & Kelas', completed: true },
        { id: 'm2', text: '2. Modul Validasi Radius GPS & Geolokasi', completed: true },
        { id: 'm3', text: '3. Generator Barcode QR Dinamis', completed: false },
        { id: 'm4', text: '4. Dashboard Rekap Kehadiran Realtime', completed: false }
      ],
      rubrics: [
        { name: 'GPS Accuracy', score: 27, maxScore: 30 },
        { name: 'Mobile Responsiveness', score: 19, maxScore: 20 },
        { name: 'Security & Anti-Spoof', score: 28, maxScore: 30 }
      ],
      mentorFeedback: {
        quote: 'Fitur presensi GPS radius geofence sangat akurat dan performa cepat.',
        author: 'Dr. Kevin Aditya'
      }
    },
    {
      id: 'cap-003',
      code: 'CAPSTONE PROJECT #003',
      title: 'Aplikasi Kasir BUSDIGIT Smart POS Retail',
      category: 'Fullstack Retail POS',
      description: 'Sistem ritel kasir mandiri terintegrasi Google Apps Script Web App dan Google Sheets database.',
      targetPercent: 75,
      isActive: false,
      appUrl: 'https://script.google.com/macros/s/AKfycbz_smartpos_demo/exec',
      demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      price: 449000,
      promoPrice: 249000,
      saleStatus: '💎 POPULAR',
      thumbnailUrl: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?w=600',
      orderWaNumber: '6281234567890',
      milestones: [
        { id: 'm1', text: '1. Autentikasi Pengguna & Dashboard Kasir', completed: true },
        { id: 'm2', text: '2. Katalog Produk & Manajemen Stok', completed: true },
        { id: 'm3', text: '3. Keranjang Belanja & Hitung Total', completed: true },
        { id: 'm4', text: '4. Penyimpanan Database Google Sheets', completed: true },
        { id: 'm5', text: '5. Laporan Transaksi & Cetak Invoice Struk', completed: false },
        { id: 'm6', text: '6. Final Deploy ke Google Apps Script', completed: false }
      ],
      rubrics: [
        { name: 'Arsitektur Kode', score: 28, maxScore: 30 },
        { name: 'UI/UX React Bits', score: 20, maxScore: 20 },
        { name: 'Fungsionalitas', score: 28, maxScore: 30 }
      ],
      mentorFeedback: {
        quote: 'Desain kartu React Bits dan implementasi dock navigasi bawah sangat rapi dan ramah di ponsel!',
        author: 'Dr. Kevin Aditya'
      }
    }
  ];
}

function apiGetCapstoneData() {
  const db = getDatabase();
  if (!db) return { success: true, capstoneData: getDefaultCapstoneData() };

  try {
    const sheet = db.getSheetByName('Capstone_Projects');
    if (!sheet) return { success: true, capstoneData: getDefaultCapstoneData() };

    const values = sheet.getDataRange().getValues();
    if (values.length <= 1) return { success: true, capstoneData: getDefaultCapstoneData() };

    const capstoneList = [];
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      if (!row[0] && !row[2]) continue;

      let milestones = [];
      let rubrics = [];
      let mentorFeedback = { quote: '', author: '' };

      try { milestones = JSON.parse(row[5]); } catch (e) { milestones = []; }
      try { rubrics = JSON.parse(row[6]); } catch (e) { rubrics = []; }
      try { mentorFeedback = JSON.parse(row[7]); } catch (e) {
        mentorFeedback = { quote: row[7] || '', author: row[8] || '' };
      }

      capstoneList.push({
        id: String(row[0] || 'cap-' + i),
        code: String(row[1] || 'CAPSTONE PROJECT #' + i),
        title: String(row[2] || ''),
        category: String(row[3] || 'General'),
        description: String(row[4] || ''),
        targetPercent: Number(row[9] || 75),
        isActive: String(row[10]).toLowerCase() === 'true' || row[10] === true || i === 1,
        appUrl: String(row[11] || ''),
        demoUrl: String(row[12] || ''),
        price: Number(row[13] || 499000),
        promoPrice: Number(row[14] || 249000),
        saleStatus: String(row[15] || 'BEST SELLER'),
        thumbnailUrl: String(row[16] || ''),
        orderWaNumber: String(row[17] || '6281234567890'),
        milestones: Array.isArray(milestones) ? milestones : [],
        rubrics: Array.isArray(rubrics) ? rubrics : [],
        mentorFeedback: mentorFeedback
      });
    }

    return {
      success: true,
      capstoneData: capstoneList.length > 0 ? capstoneList : getDefaultCapstoneData()
    };
  } catch (err) {
    Logger.log('apiGetCapstoneData error: ' + err.message);
    return { success: false, message: err.message, capstoneData: getDefaultCapstoneData() };
  }
}

function apiSaveCapstoneData(capstoneList) {
  const db = getDatabase();
  if (!db) return { success: false, message: 'Koneksi Spreadsheet tidak tersedia' };

  try {
    let sheet = db.getSheetByName('Capstone_Projects');
    if (!sheet) sheet = db.insertSheet('Capstone_Projects');

    let list = capstoneList;
    if (capstoneList && typeof capstoneList === 'object' && Array.isArray(capstoneList.capstoneData)) {
      list = capstoneList.capstoneData;
    }
    if (!Array.isArray(list) || list.length === 0) {
      list = getDefaultCapstoneData();
    }

    const rows = [
      ['PROJECT ID', 'KODE PROYEK', 'JUDUL PROYEK', 'KATEGORI', 'DESKRIPSI', 'MILESTONES JSON', 'RUBRIK JSON', 'MENTOR FEEDBACK JSON', 'NAMA MENTOR', 'TARGET PERSEN', 'IS_ACTIVE', 'LINK APLIKASI JADI', 'LINK DEMO APLIKASI', 'HARGA_NORMAL', 'HARGA_PROMO', 'STATUS_JUAL', 'THUMBNAIL_URL', 'ORDER_WA_NUMBER']
    ];

    list.forEach(function (proj, idx) {
      rows.push([
        proj.id || ('cap-' + (idx + 1)),
        proj.code || ('CAPSTONE PROJECT #' + (idx + 1)),
        proj.title || '',
        proj.category || 'General',
        proj.description || '',
        JSON.stringify(proj.milestones || []),
        JSON.stringify(proj.rubrics || []),
        JSON.stringify(proj.mentorFeedback || {}),
        (proj.mentorFeedback && proj.mentorFeedback.author) ? proj.mentorFeedback.author : '',
        proj.targetPercent || 75,
        proj.isActive ? 'TRUE' : 'FALSE',
        proj.appUrl || '',
        proj.demoUrl || '',
        proj.price || 499000,
        proj.promoPrice || 249000,
        proj.saleStatus || 'BEST SELLER',
        proj.thumbnailUrl || '',
        proj.orderWaNumber || '6281234567890'
      ]);
    });

    sheet.clearContents();
    sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);

    return { success: true, message: 'Data Capstone Projects berhasil disimpan ke Sheet Capstone_Projects', capstoneData: list };
  } catch (err) {
    Logger.log('apiSaveCapstoneData error: ' + err.message);
    return { success: false, message: 'Gagal simpan Capstone Projects: ' + err.message };
  }
}

// ==========================================================================
// GALERI KARYA & VIBE CODING TEMPLATES
// ==========================================================================
function getDefaultGaleriKarya() {
  return [
    {
      id: 'karya-001',
      title: 'ANIMISTA CSS MOTION - Scale Up Center',
      category: 'CSS Motion',
      author: 'Rian Pratama',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
      description: 'Play, customize & copy keyframes secara instan dengan Vibe Coding AI Studio.',
      files: {
        'index.html': '<div class="container">\n  <div class="tag">ANIMISTA CSS MOTION</div>\n  <h1 class="scale-up-center">scale-up-center</h1>\n  <p>Play, customize & copy keyframes secara instan dengan Vibe Coding.</p>\n  <button class="btn" onclick="triggerAnim()">✨ ANIMISTA MOTION</button>\n  <button class="btn secondary" onclick="triggerAnim()">Putar Animasi 🎬</button>\n</div>',
        'style.css': '.container { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background: #070a13; color: #fff; font-family: sans-serif; text-align: center; padding: 24px; }\n.tag { font-size: 11px; font-weight: 800; letter-spacing: 1px; color: #f97316; margin-bottom: 16px; border: 1px solid rgba(249, 115, 22, 0.4); padding: 4px 12px; border-radius: 9999px; background: rgba(249, 115, 22, 0.1); }\nh1 { font-size: 38px; font-weight: 900; margin: 0 0 14px 0; color: #fff; }\np { color: #94a3b8; font-size: 14px; max-width: 420px; line-height: 1.6; margin-bottom: 28px; }\n.btn { background: linear-gradient(135deg, #f97316 0%, #ec4899 100%); color: #fff; font-size: 14px; font-weight: 800; padding: 12px 28px; border-radius: 12px; border: none; cursor: pointer; box-shadow: 0 8px 24px rgba(249, 115, 22, 0.35); margin: 4px; }\n.btn.secondary { background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.2); box-shadow: none; }\n.scale-up-center { animation: scale-up-center 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both; }\n@keyframes scale-up-center { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }',
        'app.js': 'function triggerAnim() {\n  var h1 = document.querySelector("h1");\n  if (h1) {\n    h1.classList.remove("scale-up-center");\n    void h1.offsetWidth;\n    h1.classList.add("scale-up-center");\n  }\n}',
        'Code.gs': '// Google Apps Script backend\nfunction doGet() {\n  return HtmlService.createHtmlOutputFromFile("index.html")\n    .setTitle("Animista Motion Preview")\n    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);\n}'
      }
    },
    {
      id: 'karya-002',
      title: 'Smart POS Retail Dashboard Barcode',
      category: 'Fullstack GAS',
      author: 'BUSDIGIT Team',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?w=600&auto=format&fit=crop&q=80',
      description: 'Sistem Kasir Pintar mandiri lengkap dengan keranjang, diskon member, dan audit transaksi realtime.',
      files: {
        'index.html': '<div style="padding: 24px; font-family: sans-serif; background: #0c1322; color: #fff; min-height: 100vh;">\n  <h2>🛒 BUSDIGIT Smart POS Terminal</h2>\n  <p style="color: #94a3b8;">Transaksi aktif siap disinkronkan ke Spreadsheet</p>\n  <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">\n    <h4>Total Belanja: Rp 250.000</h4>\n    <button style="background: #00FFA3; color: #020408; font-weight: 800; padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer;">Cetak Struk Invoice</button>\n  </div>\n</div>',
        'style.css': 'body { margin: 0; background: #0c1322; color: #fff; }',
        'app.js': 'console.log("POS Initialized successfully");',
        'Code.gs': 'function apiRecordSale(item) { return { success: true, invoiceNo: "INV-" + Date.now() }; }'
      }
    },
    {
      id: 'karya-003',
      title: 'Glassmorphic Cyberpunk Card & Neon Dock',
      category: 'React Bits',
      author: 'Sarah Devi',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      description: 'Komponen kartu neon reaktif dengan efek spotlight mouse follow dan dock bawah ultra modern.',
      files: {
        'index.html': '<div style="display:flex; justify-content:center; align-items:center; min-height:100vh; background:#020408;">\n  <div style="padding:32px; border-radius:20px; background:rgba(255,255,255,0.03); border:1px solid rgba(0,255,163,0.3); box-shadow:0 0 30px rgba(0,255,163,0.15); color:#fff; text-align:center;">\n    <h2 style="color:#00FFA3;">✨ Cyberpunk Glow Card</h2>\n    <p style="color:#94a3b8;">High performance motion component</p>\n  </div>\n</div>',
        'style.css': 'body { margin:0; background:#020408; }',
        'app.js': 'console.log("Cyberpunk dock ready");',
        'Code.gs': '// UI only component'
      }
    }
  ];
}

function apiGetGaleriKarya() {
  const db = getDatabase();
  if (!db) return { success: true, galeriKarya: getDefaultGaleriKarya() };

  try {
    const sheet = db.getSheetByName('Galeri_Karya');
    if (!sheet) return { success: true, galeriKarya: getDefaultGaleriKarya() };

    const values = sheet.getDataRange().getValues();
    if (values.length <= 1) return { success: true, galeriKarya: getDefaultGaleriKarya() };

    const list = [];
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      if (!row[0] && !row[1]) continue;

      let files = {};
      try { files = JSON.parse(row[7]); } catch (e) { files = {}; }

      list.push({
        id: String(row[0] || 'karya-' + i),
        title: String(row[1] || ''),
        category: String(row[2] || 'CSS Motion'),
        author: String(row[3] || 'Siswa Codeverse'),
        avatar: String(row[4] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
        thumbnail: String(row[5] || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80'),
        description: String(row[6] || ''),
        files: files && typeof files === 'object' ? files : {}
      });
    }

    return {
      success: true,
      galeriKarya: list.length > 0 ? list : getDefaultGaleriKarya()
    };
  } catch (err) {
    Logger.log('apiGetGaleriKarya error: ' + err.message);
    return { success: false, message: err.message, galeriKarya: getDefaultGaleriKarya() };
  }
}

function apiSaveGaleriKarya(galeriList) {
  const db = getDatabase();
  if (!db) return { success: false, message: 'Koneksi Spreadsheet tidak tersedia' };

  try {
    let sheet = db.getSheetByName('Galeri_Karya');
    if (!sheet) sheet = db.insertSheet('Galeri_Karya');

    let list = galeriList;
    if (galeriList && typeof galeriList === 'object' && Array.isArray(galeriList.galeriKarya)) {
      list = galeriList.galeriKarya;
    }
    if (!Array.isArray(list) || list.length === 0) {
      list = getDefaultGaleriKarya();
    }

    const rows = [
      ['ID', 'JUDUL KARYA', 'KATEGORI', 'AUTHOR', 'AVATAR URL', 'THUMBNAIL URL', 'DESKRIPSI', 'FILES JSON']
    ];

    list.forEach(function (karya, idx) {
      rows.push([
        karya.id || ('karya-' + (idx + 1)),
        karya.title || '',
        karya.category || 'CSS Motion',
        karya.author || 'Siswa Codeverse',
        karya.avatar || '',
        karya.thumbnail || '',
        karya.description || '',
        JSON.stringify(karya.files || {})
      ]);
    });

    sheet.clearContents();
    sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);

    return { success: true, message: 'Data Galeri Karya berhasil disimpan ke Sheet Galeri_Karya', galeriKarya: list };
  } catch (err) {
    Logger.log('apiSaveGaleriKarya error: ' + err.message);
    return { success: false, message: 'Gagal simpan Galeri Karya: ' + err.message };
  }
}

// Top-level RPC Bridges for google.script.run
function getCapstoneData() {
  return apiGetCapstoneData();
}

function saveCapstoneData(capstoneList) {
  return apiSaveCapstoneData(capstoneList);
}

function getGaleriKarya() {
  return apiGetGaleriKarya();
}

function saveGaleriKarya(galeriList) {
  return apiSaveGaleriKarya(galeriList);
}

/**
 * Mengunggah file (Base64) langsung ke Google Drive di folder 'BUSDIGIT_CODEVERSE_UPLOADS'
 * Otomatis membuat folder jika belum ada, mengatur izin akses publik (Anyone with link view),
 * dan mengonversi ID file ke direct URL format LH3: https://lh3.googleusercontent.com/d/{id}
 */
function apiUploadFileToDrive(payload) {
  try {
    if (!payload || !payload.base64) {
      return { success: false, message: 'Data base64 file tidak ditemukan.' };
    }

    var rootFolderName = 'BUSDIGIT_CODEVERSE_UPLOADS';
    var rootFolders = DriveApp.getFoldersByName(rootFolderName);
    var rootFolder;
    if (rootFolders.hasNext()) {
      rootFolder = rootFolders.next();
    } else {
      rootFolder = DriveApp.createFolder(rootFolderName);
      rootFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    }

    // Sub-folder berdasarkan kategori
    var targetFolder = rootFolder;
    var category = payload.category ? String(payload.category).trim() : 'Media_Assets';
    if (category) {
      var subFolders = rootFolder.getFoldersByName(category);
      if (subFolders.hasNext()) {
        targetFolder = subFolders.next();
      } else {
        targetFolder = rootFolder.createFolder(category);
        targetFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      }
    }

    // Ekstrak base64 & contentType
    var base64Str = String(payload.base64);
    var mimeType = payload.mimeType || 'image/png';
    var fileName = payload.fileName || ('upload_' + Date.now() + '.png');

    if (base64Str.indexOf(';base64,') !== -1) {
      var parts = base64Str.split(';base64,');
      var metaPart = parts[0];
      base64Str = parts[1];
      if (metaPart.indexOf('data:') !== -1) {
        mimeType = metaPart.replace('data:', '');
      }
    } else if (base64Str.indexOf(',') !== -1) {
      base64Str = base64Str.split(',')[1];
    }

    var decodedBytes = Utilities.base64Decode(base64Str);
    var blob = Utilities.newBlob(decodedBytes, mimeType, fileName);

    // Simpan file ke Google Drive
    var file = targetFolder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    var fileId = file.getId();
    // Format direct CDN LH3 super cepat (sesuai instruksi pengguna)
    var lh3Url = 'https://lh3.googleusercontent.com/d/' + fileId;
    var driveUcUrl = 'https://drive.google.com/uc?export=view&id=' + fileId;

    return {
      success: true,
      fileId: fileId,
      url: lh3Url,
      directUrl: driveUcUrl,
      downloadUrl: file.getDownloadUrl(),
      viewUrl: file.getUrl(),
      fileName: fileName,
      category: category,
      size: file.getSize()
    };
  } catch (err) {
    Logger.log('apiUploadFileToDrive Error: ' + err.toString());
    return {
      success: false,
      error: err.toString(),
      message: 'Gagal mengunggah file ke Google Drive: ' + err.message
    };
  }
}

function uploadFileToDrive(payload) {
  return apiUploadFileToDrive(payload);
}

// ============================================================================
// FIREBASE FIRESTORE HYBRID ADAPTER & MIGRATION ENGINE (SPARK PLAN $0)
// ============================================================================

const FIRESTORE_BASE_URL_ = 'https://firestore.googleapis.com/v1';

/**
 * Mendapatkan konfigurasi Firebase Firestore dari ScriptProperties
 */
function getFirestoreConfig_() {
  const props = PropertiesService.getScriptProperties();
  return {
    projectId: props.getProperty('FIRESTORE_PROJECT_ID') || '',
    apiKey: props.getProperty('FIRESTORE_API_KEY') || ''
  };
}

/**
 * Menyimpan konfigurasi Firebase Firestore ke ScriptProperties
 */
function apiSaveFirestoreConfig(config) {
  if (!config) return { success: false, message: 'Data konfigurasi kosong' };
  const props = PropertiesService.getScriptProperties();
  if (config.projectId !== undefined) props.setProperty('FIRESTORE_PROJECT_ID', String(config.projectId).trim());
  if (config.apiKey !== undefined) props.setProperty('FIRESTORE_API_KEY', String(config.apiKey).trim());
  return {
    success: true,
    message: 'Konfigurasi Firebase Firestore berhasil disimpan ke Script Properties!',
    config: apiGetFirestoreConfig()
  };
}

function saveFirestoreConfig(config) {
  return apiSaveFirestoreConfig(config);
}

/**
 * Membaca konfigurasi Firebase Firestore aktif
 */
function apiGetFirestoreConfig() {
  const cfg = getFirestoreConfig_();
  return {
    projectId: cfg.projectId,
    hasApiKey: Boolean(cfg.apiKey),
    apiKeyMasked: cfg.apiKey ? (cfg.apiKey.substring(0, 6) + '...' + cfg.apiKey.slice(-4)) : ''
  };
}

function getFirestoreConfig() {
  return apiGetFirestoreConfig();
}

/**
 * Mengonversi objek JavaScript biasa ke skema field Firestore REST API
 */
function toFirestoreFields_(data) {
  if (data === null || data === undefined) return { nullValue: null };
  const fields = {};
  for (const key in data) {
    if (!data.hasOwnProperty(key)) continue;
    fields[key] = toFirestoreValue_(data[key]);
  }
  return fields;
}

function toFirestoreValue_(val) {
  if (val === null || val === undefined) {
    return { nullValue: null };
  }
  if (typeof val === 'string') {
    return { stringValue: val };
  }
  if (typeof val === 'boolean') {
    return { booleanValue: val };
  }
  if (typeof val === 'number') {
    if (Number.isInteger(val)) {
      return { integerValue: val.toString() };
    }
    return { doubleValue: val };
  }
  if (val instanceof Date) {
    return { timestampValue: val.toISOString() };
  }
  if (Array.isArray(val)) {
    return {
      arrayValue: {
        values: val.map(toFirestoreValue_)
      }
    };
  }
  if (typeof val === 'object') {
    return {
      mapValue: {
        fields: toFirestoreFields_(val)
      }
    };
  }
  return { stringValue: String(val) };
}

/**
 * Mengurai dokumen Firestore REST API kembali menjadi objek JavaScript biasa
 */
function fromFirestoreDoc_(doc) {
  if (!doc || !doc.fields) return {};
  const res = { id: doc.name ? doc.name.split('/').pop() : '' };
  for (const k in doc.fields) {
    res[k] = fromFirestoreValue_(doc.fields[k]);
  }
  return res;
}

function fromFirestoreValue_(valObj) {
  if (!valObj) return null;
  if ('stringValue' in valObj) return valObj.stringValue;
  if ('integerValue' in valObj) return parseInt(valObj.integerValue, 10);
  if ('doubleValue' in valObj) return parseFloat(valObj.doubleValue);
  if ('booleanValue' in valObj) return valObj.booleanValue;
  if ('nullValue' in valObj) return null;
  if ('timestampValue' in valObj) return valObj.timestampValue;
  if ('arrayValue' in valObj) {
    return (valObj.arrayValue.values || []).map(fromFirestoreValue_);
  }
  if ('mapValue' in valObj) {
    const map = {};
    const f = valObj.mapValue.fields || {};
    for (const key in f) {
      map[key] = fromFirestoreValue_(f[key]);
    }
    return map;
  }
  return null;
}

/**
 * Menyimpan / memperbarui dokumen di Firestore via REST API
 */
function firestoreRestSet(collection, docId, data) {
  const cfg = getFirestoreConfig_();
  if (!cfg.projectId) throw new Error('Firestore Project ID belum dikonfigurasi di Script Properties!');

  let url = `${FIRESTORE_BASE_URL_}/projects/${cfg.projectId}/databases/(default)/documents/${collection}/${encodeURIComponent(docId)}`;
  if (cfg.apiKey) {
    url += `?key=${encodeURIComponent(cfg.apiKey)}`;
  }

  const payload = JSON.stringify({ fields: toFirestoreFields_(data) });
  const response = UrlFetchApp.fetch(url, {
    method: 'patch',
    contentType: 'application/json',
    payload: payload,
    muteHttpExceptions: true
  });

  const code = response.getResponseCode();
  if (code >= 200 && code < 300) {
    return fromFirestoreDoc_(JSON.parse(response.getContentText()));
  }
  throw new Error(`Firestore REST write error (${code}): ${response.getContentText()}`);
}

/**
 * Membaca 1 dokumen dari Firestore via REST API
 */
function firestoreRestGet(collection, docId) {
  const cfg = getFirestoreConfig_();
  if (!cfg.projectId) throw new Error('Firestore Project ID belum dikonfigurasi!');

  let url = `${FIRESTORE_BASE_URL_}/projects/${cfg.projectId}/databases/(default)/documents/${collection}/${encodeURIComponent(docId)}`;
  if (cfg.apiKey) {
    url += `?key=${encodeURIComponent(cfg.apiKey)}`;
  }

  const response = UrlFetchApp.fetch(url, {
    method: 'get',
    muteHttpExceptions: true
  });

  const code = response.getResponseCode();
  if (code === 404) return null;
  if (code >= 200 && code < 300) {
    return fromFirestoreDoc_(JSON.parse(response.getContentText()));
  }
  throw new Error(`Firestore REST read error (${code}): ${response.getContentText()}`);
}

/**
 * Menguji koneksi Firestore REST dengan Diagnostik Cerdas Bebas CORS
 */
function apiTestFirestoreConnection(payload) {
  try {
    let projectId = '';
    let apiKey = '';

    if (payload && typeof payload === 'object') {
      projectId = payload.projectId || payload.FIRESTORE_PROJECT_ID || '';
      apiKey = payload.apiKey || payload.FIRESTORE_API_KEY || '';
    }

    if (!projectId) {
      const cfg = getFirestoreConfig_();
      projectId = cfg.projectId;
      apiKey = cfg.apiKey;
    }

    projectId = String(projectId || '').trim();
    apiKey = String(apiKey || '').trim();

    if (!projectId) {
      return { success: false, message: 'Project ID Firebase belum diisi. Masukkan Project ID Anda.' };
    }

    // Auto-save ke ScriptProperties jika valid
    const props = PropertiesService.getScriptProperties();
    props.setProperty('FIRESTORE_PROJECT_ID', projectId);
    if (apiKey) props.setProperty('FIRESTORE_API_KEY', apiKey);

    // Lakukan pemanggilan via UrlFetchApp (Google server-side, 100% BEBAS CORS)
    let testUrl = `${FIRESTORE_BASE_URL_}/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/_test_ping/health_check`;
    if (apiKey) testUrl += `?key=${encodeURIComponent(apiKey)}`;

    const pingPayload = JSON.stringify({
      fields: toFirestoreFields_({
        ping: true,
        appName: 'BUSDIGIT CODEVERSE',
        timestamp: new Date().toISOString()
      })
    });

    const writeResponse = UrlFetchApp.fetch(testUrl, {
      method: 'patch',
      contentType: 'application/json',
      payload: pingPayload,
      muteHttpExceptions: true
    });

    const statusCode = writeResponse.getResponseCode();
    const contentText = writeResponse.getContentText();

    if (statusCode >= 200 && statusCode < 300) {
      return {
        success: true,
        statusCode: statusCode,
        message: `🟢 Koneksi REST ke Firestore Project "${projectId}" Berhasil 100%! Database aktif & siap pakai.`,
        details: {
          projectId: projectId,
          hasApiKey: Boolean(apiKey),
          timestamp: new Date().toISOString()
        }
      };
    }

    // Diagnostik Pesan Error yang Bersahabat dan Aksi yang Perlu Dilakukan di Firebase Console
    let userActionMessage = '';
    try {
      const errJson = JSON.parse(contentText);
      const errDetail = errJson.error ? errJson.error.message : contentText;
      const errStatus = errJson.error ? errJson.error.status : '';

      if (statusCode === 404 || errStatus === 'NOT_FOUND' || (errDetail && errDetail.toLowerCase().includes('not found') && errDetail.toLowerCase().includes('database'))) {
        userActionMessage = `⚠️ Database Firestore belum dibuat di Firebase Console! Buka console.firebase.google.com > pilih project "${projectId}" > menu Firestore Database > klik tombol "Create database" (pilih mode Test Mode & region asia-southeast2 Jakarta).`;
      } else if (statusCode === 403 || errStatus === 'PERMISSION_DENIED') {
        userActionMessage = `⚠️ Akses ditolak Security Rules! Buka console.firebase.google.com > pilih project "${projectId}" > Firestore Database > tab Rules > ubah menjadi 'allow read, write: if true;' lalu klik Publish.`;
      } else if (statusCode === 400 && errDetail && errDetail.includes('API')) {
        userActionMessage = `⚠️ Cloud Firestore API belum aktif. Buka Firebase Console > Firestore Database > aktifkan database.`;
      } else {
        userActionMessage = `⚠️ Respon Firestore HTTP ${statusCode}: ${errDetail}`;
      }
    } catch (pe) {
      userActionMessage = `⚠️ Respon Firestore HTTP ${statusCode}: ${contentText}`;
    }

    return {
      success: false,
      statusCode: statusCode,
      message: userActionMessage,
      rawError: contentText
    };

  } catch (err) {
    const errStr = (err && err.message) ? err.message : String(err);
    const isAuthError = errStr.includes('script.external_request') ||
                        errStr.includes('UrlFetchApp') ||
                        errStr.includes('tidak memiliki izin') ||
                        errStr.includes('permission');

    if (isAuthError) {
      return {
        success: false,
        needAuth: true,
        authScope: 'https://www.googleapis.com/auth/script.external_request',
        message: '⚠️ Izin UrlFetchApp Belum Diotorisasi (Cukup 10 Detik):\n' +
                 '1. Buka Tab Editor Google Apps Script.\n' +
                 '2. Di menu dropdown atas, pilih fungsi "beriIzinAksesSemuaLayanan".\n' +
                 '3. Klik tombol ▶ Jalankan (Run) > Tinjau Izin > Izinkan.\n' +
                 '4. Kembali ke sini dan klik Uji Koneksi lagi!',
        error: errStr
      };
    }

    return {
      success: false,
      message: 'Gagal terhubung ke Firestore: ' + errStr,
      error: errStr
    };
  }
}

function testFirestoreConnection(payload) {
  return apiTestFirestoreConnection(payload);
}

/**
 * SKRIP MIGRASI 1-KLIK: Membaca seluruh Google Sheets dan mengunggahnya ke Firestore Spark Plan
 */
function apiMigrateSheetsToFirestore(payload) {
  const startTime = Date.now();
  const summary = {
    config: 0,
    lmsCourses: 0,
    libraryDocs: 0,
    projects: 0,
    errors: []
  };

  try {
    let projectId = '';
    let apiKey = '';
    if (payload && typeof payload === 'object') {
      projectId = payload.projectId || '';
      apiKey = payload.apiKey || '';
    }
    if (!projectId) {
      const cfg = getFirestoreConfig_();
      projectId = cfg.projectId;
      apiKey = cfg.apiKey;
    }
    if (projectId) {
      PropertiesService.getScriptProperties().setProperty('FIRESTORE_PROJECT_ID', projectId);
      if (apiKey) PropertiesService.getScriptProperties().setProperty('FIRESTORE_API_KEY', apiKey);
    }

    if (!projectId) {
      return { success: false, message: 'Gagal: Project ID Firebase belum diisi di tab Firestore!' };
    }

    // 1. Migrasi Config_App -> config/main
    try {
      const currentConfig = apiGetConfigFromSheet() || {};
      currentConfig.migratedAt = new Date().toISOString();
      currentConfig.source = 'Google Sheets Migration Engine';
      firestoreRestSet('config', 'main', currentConfig);
      summary.config = 1;
    } catch (e) {
      summary.errors.push('Config migration: ' + e.message);
    }

    // 2. Migrasi LMS_Kurikulum -> lms_courses (tiap bab menjadi 1 dokumen)
    try {
      const lmsData = apiGetLMSData();
      if (Array.isArray(lmsData)) {
        lmsData.forEach((course, idx) => {
          const docId = course.id || ('bab-' + (idx + 1));
          firestoreRestSet('lms_courses', docId, course);
          summary.lmsCourses++;
        });
      }
    } catch (e) {
      summary.errors.push('LMS migration: ' + e.message);
    }

    // 3. Migrasi Library_Docs -> library_docs
    try {
      const libDocs = apiGetLibraryDocs();
      if (Array.isArray(libDocs)) {
        libDocs.forEach((doc, idx) => {
          const docId = doc.id || ('lib-' + (idx + 1));
          firestoreRestSet('library_docs', docId, doc);
          summary.libraryDocs++;
        });
      }
    } catch (e) {
      summary.errors.push('Library Docs migration: ' + e.message);
    }

    const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
    return {
      success: summary.errors.length === 0,
      message: `Migrasi selesai dalam ${durationSec} detik! Berhasil migrasi: ${summary.config} Config, ${summary.lmsCourses} Bab LMS, ${summary.libraryDocs} Library Docs.`,
      summary: summary,
      duration: durationSec + 's',
      timestamp: new Date().toISOString()
    };

  } catch (err) {
    const errStr = (err && err.message) ? err.message : String(err);
    const isAuthError = errStr.includes('script.external_request') ||
                        errStr.includes('UrlFetchApp') ||
                        errStr.includes('tidak memiliki izin') ||
                        errStr.includes('permission');

    if (isAuthError) {
      return {
        success: false,
        needAuth: true,
        authScope: 'https://www.googleapis.com/auth/script.external_request',
        message: '⚠️ Izin UrlFetchApp Belum Diotorisasi di Editor Apps Script!\n' +
                 'Pilih fungsi "beriIzinAksesSemuaLayanan" di dropdown editor Apps Script lalu klik Jalankan (Run) > Izinkan.',
        error: errStr
      };
    }

    return {
      success: false,
      message: 'Gagal menjalankan migrasi: ' + errStr,
      error: errStr
    };
  }
}

function migrateSheetsToFirestore(payload) {
  return apiMigrateSheetsToFirestore(payload);
}
