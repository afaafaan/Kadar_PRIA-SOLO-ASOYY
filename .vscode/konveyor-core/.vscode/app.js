/*
 * KADAR — Kabar Udara · app.js
 * Satu file untuk semua halaman. Setiap halaman HTML hanya berisi <div id="app">
 * dan atribut <body data-page="...">; isinya dirakit dari file ini.
 *
 * Alur singkat:
 *   1. Data demo (kota, prediksi, berita)
 *   2. Template HTML tiap halaman (objek T)
 *   3. Fungsi umum: navbar, footer, jam, tema
 *   4. Fungsi per halaman: Air Monitor, Air Forecast, News
 *   5. Eksekusi di bagian paling bawah
 */


// === DATA DEMO — daftar kota, AQI, polutan (ganti dengan API asli bila sudah ada) ===
const cities = [
  {name: 'Jakarta', region: 'DKI Jakarta', lat: -6.2088, lng: 106.8456, aqi: 42, pm25: 8.4, pm10: 18, temp: 30},
  {name: 'Bandung', region: 'Jawa Barat', lat: -6.9175, lng: 107.6191, aqi: 58, pm25: 12.1, pm10: 24, temp: 25},
  {name: 'Surabaya', region: 'Jawa Timur', lat: -7.2575, lng: 112.7521, aqi: 76, pm25: 19.6, pm10: 38, temp: 32},
  {name: 'Semarang', region: 'Jawa Tengah', lat: -6.9667, lng: 110.4167, aqi: 64, pm25: 14.8, pm10: 29, temp: 31},
  {name: 'Yogyakarta', region: 'DI Yogyakarta', lat: -7.7956, lng: 110.3695, aqi: 35, pm25: 6.9, pm10: 15, temp: 28},
  {name: 'Medan', region: 'Sumatera Utara', lat: 3.5952, lng: 98.6722, aqi: 112, pm25: 39.4, pm10: 67, temp: 31},
  {name: 'Makassar', region: 'Sulawesi Selatan', lat: -5.1477, lng: 119.4327, aqi: 49, pm25: 9.2, pm10: 20, temp: 31},
  {name: 'Denpasar', region: 'Bali', lat: -8.6705, lng: 115.2126, aqi: 28, pm25: 5.1, pm10: 12, temp: 29}
];

// === DATA DEMO — prediksi AQI per 2 jam (12 titik = 24 jam) untuk tiap kota ===
const hourly = {
  Jakarta: [38, 34, 31, 35, 42, 50, 56, 61, 65, 59, 52, 48],
  Bandung: [48, 45, 43, 46, 52, 60, 65, 68, 62, 58, 55, 52],
  Surabaya: [65, 62, 59, 63, 70, 78, 83, 86, 80, 75, 71, 68],
  Semarang: [56, 53, 51, 54, 61, 68, 72, 74, 69, 64, 60, 58],
  Yogyakarta: [29, 27, 26, 30, 34, 39, 43, 46, 42, 38, 34, 31],
  Medan: [105, 101, 98, 102, 110, 118, 123, 127, 121, 116, 112, 108],
  Makassar: [44, 41, 39, 42, 48, 53, 57, 55, 52, 49, 46, 44],
  Denpasar: [25, 23, 22, 24, 28, 33, 36, 38, 34, 31, 28, 26]
};

// === DATA — kartu berita (judul, kategori, ringkasan, tautan sumber) ===
const news = [
  {
    t: 'Polusi udara dan dampaknya bagi kesehatan: mengapa kita perlu peduli?',
    c: 'Kesehatan',
    d: 'Memahami hubungan kualitas udara dengan kesehatan adalah langkah awal melindungi diri.',
    u: 'https://www.who.int/health-topics/air-pollution',
    s: 'WHO',
    a: 'blue',
    m: 5,
    x: 'UDARA BERSIH<br>HAK KITA'
  },
  {
    t: 'Transportasi rendah emisi sebagai bagian dari solusi udara bersih',
    c: 'Aksi',
    d: 'Pilihan mobilitas sehari-hari ikut menentukan kualitas udara perkotaan.',
    u: 'https://www.unep.org/explore-topics/air',
    s: 'UNEP',
    a: 'green',
    m: 4,
    x: 'LANGKAH KECIL<br>DAMPAK BESAR'
  },
  {
    t: 'Mengenal PM2.5, partikel halus yang perlu diwaspadai',
    c: 'Polutan',
    d: 'Ukurannya yang sangat kecil membuat PM2.5 penting untuk dipantau.',
    u: 'https://www.epa.gov/pm-pollution/particulate-matter-pm-basics',
    s: 'US EPA',
    a: 'orange',
    m: 3,
    x: 'KENALI POLUTAN<br>DI SEKITARMU'
  },
  {
    t: 'Dasar-dasar AQI: cara membaca indeks kualitas udara',
    c: 'Polutan',
    d: 'Panduan singkat membaca kategori AQI dan artinya bagi aktivitasmu.',
    u: 'https://www.airnow.gov/aqi/aqi-basics/',
    s: 'AirNow',
    a: 'blue',
    m: 4,
    x: 'BACA ANGKANYA<br>PAHAMI ARTINYA'
  },
  {
    t: 'Kebakaran hutan dan lahan: dampaknya pada kualitas udara',
    c: 'Aksi',
    d: 'Asap karhutla dapat menurunkan kualitas udara hingga ke wilayah jauh.',
    u: 'https://www.unep.org/explore-topics/air',
    s: 'UNEP',
    a: 'orange',
    m: 5,
    x: 'ASAP<br>TAK KENAL BATAS'
  },
  {
    t: 'Udara dalam ruangan: apa yang bisa kita lakukan?',
    c: 'Kesehatan',
    d: 'Ventilasi dan kebiasaan rumah tangga memengaruhi udara yang kita hirup.',
    u: 'https://www.who.int/health-topics/air-pollution',
    s: 'WHO',
    a: 'green',
    m: 3,
    x: 'UDARA SEHAT<br>MULAI DARI RUMAH'
  }
];

// === HELPER — pemilih elemen, penentu kategori/warna AQI, daftar halaman navbar, variabel global ===
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const lv = a => a <= 50 ? 'good': a <= 100 ? 'moderate': 'poor', st = a => a <= 50 ? 'BAIK': a <= 100 ? 'SEDANG': 'TIDAK SEHAT', col = a => a <= 50 ? '#39b98a': a <= 100 ? '#e9a53d': '#e76f59';
const P = document.body.dataset.page, pages = [
  ['index', 'Home'],
  ['air-monitor', 'Air Monitor'],
  ['air-forecast', 'Air Forecast'],
  ['news', 'News'],
  ['education', 'Education'],
  ['about', 'About']
];
let selected = 'Jakarta', map, markers = {}, chart, filt = 'all';
if (localStorage.kadarTheme === 'dark') document.body.classList.add('dark');

// === HELPER — judul bagian halaman (breadcrumb + heading + deskripsi) ===
const sec = (k, h, p) => `<div class="section-heading reveal">
    <div>
      <div class="crumb">
        <a href="index.html">Home</a> / ${k}</div>
      <h2>${h}</h2>
    </div>
    <p>${p}</p>
  </div>`;

// === TEMPLATE HALAMAN — isi HTML tiap halaman. Kunci objek = nilai data-page pada <body> ===
const T = {

  // --- HALAMAN HOME — hero, ringkasan kota, kartu fitur, teaser About ---
  index: () => `<section class="hero-section">
      <div class="container-fluid page-container">
        <div class="hero-grid">
          <div class="hero-copy">
            <div class="eyebrow"><i></i> KENALI UDARA DI SEKITARMU</div>
            <h1>Udara yang baik,<br><em>awal hidup</em> yang lebih baik.</h1>
            <p class="hero-lead">Sebelum melangkah keluar, cari tahu kualitas udara di kotamu. KADAR membantumu memahami kondisi udara dan mengambil keputusan dengan lebih bijak.</p>
            <div class="hero-buttons">
              <a class="btn-primary-kadar" href="air-monitor.html">Pantau kualitas udara <span>↗</span>
              </a>
              <a class="text-link" href="education.html">Kenali kualitas udara <span>→</span>
              </a>
            </div>
          </div>
          <div class="hero-visual">
            <div class="visual-orbit orbit-one"></div>
            <div class="visual-orbit orbit-two"></div>
            <div class="sun-disc"></div>
            <div class="cloud-shape cloud-a"></div>
            <div class="cloud-shape cloud-b"></div>
            <div class="wind-line wind-one"></div>
            <div class="wind-line wind-two"></div>
            <div class="wind-line wind-three"></div>
            <div class="floating-card fc-top"><span class="live-dot"></span> AIR QUALITY SNAPSHOT <b>DEMO</b>
            </div>
            <div class="floating-card fc-bottom">
              <div class="mini-label">KUALITAS UDARA HARI INI</div>
              <div class="mini-score"><strong>42</strong><span>BAIK</span>
              </div>
              <div class="mini-bar"><i></i>
              </div>
              <small>Contoh data · Jakarta</small>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="quick-strip">
      <div class="container-fluid page-container">
        <div class="quick-intro"><span class="eyebrow">PANTAU SEKILAS</span><strong>Klik kota untuk melihat detail</strong>
        </div>
        <div id="quickCities" class="quick-cities"></div>
      </div>
    </section>
    <section class="section-block">
      <div class="container-fluid page-container">${sec('Fitur', 'Pilih jalurmu,<br><em>mulai dari sini.</em>', 'Setiap fitur punya halamannya sendiri. Klik kartu untuk membukanya.')}<div class="feat-grid">${[['air-monitor', '◎', 'Air Monitor', 'Peta interaktif, AQI per kota, dan saran aktivitas.'], ['air-forecast', '∿', 'Air Forecast', 'Grafik prediksi 24 jam dan waktu terbaik keluar rumah.'], ['news', '▤', 'News', 'Kabar lingkungan dari lembaga tepercaya.'], ['education', '✦', 'Education', 'Pahami AQI, polutan, dan kelompok rentan.']].map(f => `<a class="feat-card reveal" href="${f[0]}.html">
            <div class="feat-ic">${f[1]}</div>
            <h4>${f[2]}</h4>
            <p>${f[3]}</p><b>Buka halaman <i>→</i></b>
          </a>`).join('')}</div>
      </div>
    </section>
    <section class="about-section">
      <div class="container-fluid page-container">
        <div class="about-grid reveal">
          <div>
            <div class="eyebrow"><i></i> TENTANG KADAR</div>
            <h2>Cek udara dulu,<br><em>baru beraktivitas.</em>
            </h2>
          </div>
          <div class="about-copy">
            <p>Udara tidak selalu terlihat buruk, tetapi dampaknya nyata bagi pernapasan. KADAR membantumu melihat kondisi udara sebelum olahraga, berangkat kerja, atau mengantar anak ke sekolah.</p>
            <a class="btn-primary-kadar" href="about.html">Tentang KADAR <span>↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>`,

  // --- HALAMAN AIR MONITOR — filter, peta, daftar kota, detail AQI, saran aktivitas ---
  'air-monitor': () => `<section class="sub-page">
      <div class="container-fluid page-container">${sec('Air Monitor', 'Udara setiap kota,<br><em>dalam satu pandangan.</em>', 'Pilih titik pada peta atau daftar untuk melihat AQI, polutan, dan saran aktivitas.')}
<div class="chips" id="chips">${[['all', 'Semua'], ['good', 'Baik'], ['moderate', 'Sedang'], ['poor', 'Tidak sehat']].map(c => `<button class="chip ${c[0] === 'all' ? 'on' : ''}" data-f="${c[0]}">${c[1]}</button>`).join('')}<button class="btn-ghost" id="locate">◎ Kota terdekat dari lokasiku</button>
        </div>
        <div id="alertSlot"></div>
        <div class="monitor-layout">
          <div class="map-panel">
            <div class="panel-top">
              <div><span class="panel-kicker">PETA KUALITAS UDARA INDONESIA</span>
                <h3>Peta interaktif</h3>
              </div><span class="demo-pill"><i></i> DATA DEMO</span>
            </div>
            <div id="airMap"></div>
            <div class="map-legend"><span><i class="legend-dot good"></i> Baik</span><span><i class="legend-dot moderate"></i> Sedang</span><span><i class="legend-dot poor"></i> Tidak sehat</span><span class="map-hint">Zoom dengan tombol +/−</span>
            </div>
          </div>
          <aside class="city-panel">
            <div class="city-panel-head">
              <div><span class="panel-kicker">CITY OVERVIEW</span>
                <h3>Pilih kotamu</h3>
              </div>
            </div>
            <div class="city-search"><span>⌕</span><input id="citySearch" type="search" placeholder="Cari kota..." aria-label="Cari kota"></div>
            <div id="cityList" class="city-list"></div>
          </aside>
        </div>
        <div class="detail-card">
          <div class="detail-main">
            <div class="detail-location"><span class="panel-kicker">KONDISI TERPILIH</span>
              <h3 id="detailCity"></h3><span>Data simulasi · bukan pengukuran real-time</span>
            </div>
            <div class="aqi-score"><strong id="detailAqi">0</strong><span><b id="detailStatus"></b>
                <small>US AQI</small></span>
            </div>
          </div>
          <div class="detail-advice">
            <div class="advice-icon" id="adviceIcon"></div>
            <div><b id="adviceTitle"></b>
              <p id="adviceText"></p>
            </div>
          </div>
          <div class="pollutant-grid">
            <div><span>PM2.5</span><b id="pm25"></b>
            </div>
            <div><span>PM10</span><b id="pm10"></b>
            </div>
            <div><span>DOMINAN</span><b>PM2.5</b>
            </div>
            <div><span>SUHU</span><b id="temp"></b>
            </div>
          </div>
        </div>
        <div class="act-grid" id="acts"></div>
        <div class="tools" style="margin-top:20px">
          <a class="btn-primary-kadar" href="air-forecast.html" id="toFc">Lihat prediksi kota ini <span>↗</span>
          </a>
          <button class="btn-ghost" id="share">Salin tautan kota</button>
        </div>
      </div>
    </section>`,

  // --- HALAMAN AIR FORECAST — pilih kota, ringkasan, grafik, tips ---
  'air-forecast': () => `<section class="sub-page">
      <div class="container-fluid page-container">${sec('Air Forecast', 'Kenali pola udara,<br><em>rencanakan harimu.</em>', 'Simulasi perubahan AQI 24 jam ke depan. Warna garis menunjukkan kategori udara.')}<div class="forecast-card reveal">
          <div class="forecast-toolbar">
            <div><span class="panel-kicker">PREDIKSI KUALITAS UDARA</span>
              <h3 id="forecastCity"></h3>
            </div><select id="forecastSelect" aria-label="Pilih kota">${cities.map(c => `<option>${c.name}</option>`).join('')}</select>
          </div>
          <div class="forecast-summary">
            <div><span>RATA-RATA AQI</span><strong id="forecastAvg"></strong>
            </div>
            <div><span>WAKTU TERBAIK</span><strong id="bestTime"></strong>
            </div>
            <div><span>TREN</span><strong id="trendText"></strong>
            </div>
          </div>
          <div class="chart-wrap">
            <canvas id="forecastChart"></canvas>
          </div>
          <div class="chart-legend"><span><i class="legend-dot good"></i> Baik (0–50)</span><span><i class="legend-dot moderate"></i> Sedang (51–100)</span><span><i class="legend-dot poor"></i> Tidak sehat (101+)</span>
            <small>Simulasi data untuk demonstrasi, bukan prediksi aktual.</small>
          </div>
        </div>
        <div class="act-grid" id="fcTips"></div>
      </div>
    </section>`,

  // --- HALAMAN NEWS — filter kategori + grid berita ---
  news: () => `<section class="sub-page">
      <div class="container-fluid page-container">${sec('News', 'Kabar terbaru untuk<br><em>bumi yang lebih sehat.</em>', 'Isu udara dan lingkungan dengan tautan ke sumber yang dapat ditelusuri.')}<div class="chips" id="nchips">${['Semua', 'Kesehatan', 'Aksi', 'Polutan'].map((c, i) => `<button class="chip ${i ? '' : 'on'}">${c}</button>`).join('')}</div>
        <div class="news-grid" id="newsGrid"></div>
        <p class="content-note">Konten editorial demo yang mengarah ke referensi lembaga, bukan feed real-time. Ganti ilustrasi dengan foto berita berlisensi sebelum final.</p>
      </div>
    </section>`,

  // --- HALAMAN EDUCATION — skala AQI, topik, FAQ ---
  education: () => `<section class="sub-page">
      <div class="container-fluid page-container">${sec('Education', 'Lebih paham udara,<br><em>lebih siap menjaga diri.</em>', 'Kenali istilah, dampak, dan kebiasaan sederhana agar keputusanmu lebih tepat.')}<div class="education-layout reveal">
          <div class="education-feature">
            <h3>Apa arti angka<br>kualitas udara?</h3>
            <p>AQI adalah indeks untuk menyampaikan tingkat pencemaran udara dan potensi dampaknya bagi kesehatan. Klik kategori untuk melihat artinya.</p>
            <a href="https://www.airnow.gov/aqi/aqi-basics/" target="_blank" rel="noopener">Pelajari dasar AQI ↗</a>
            <div class="aqi-scale">
              <div><b>0–50</b><span>BAIK</span><i class="scale-good"></i>
              </div>
              <div><b>51–100</b><span>SEDANG</span><i class="scale-mid"></i>
              </div>
              <div><b>101–150</b><span>SENSITIF</span><i class="scale-sensitive"></i>
              </div>
              <div><b>151+</b><span>TIDAK SEHAT+</span><i class="scale-bad"></i>
              </div>
            </div>
          </div>
          <div class="edu-topics">${[['◉', 'Mengenal PM2.5 dan PM10', 'Partikel halus yang dapat masuk ke saluran pernapasan.', 'https://www.who.int/news-room/fact-sheets/detail/ambient-(outdoor)-air-quality-and-health', 'WHO'], ['♡', 'Siapa yang perlu lebih waspada?', 'Anak-anak, lansia, serta penderita gangguan napas atau jantung lebih rentan.', 'https://www.who.int/health-topics/air-pollution', 'WHO'], ['↗', 'Langkah sederhana saat udara buruk', 'Kurangi aktivitas berat di luar dan ikuti saran otoritas kesehatan.', 'https://www.airnow.gov/', 'AirNow']].map(t => `<article class="edu-topic"><span class="topic-icon">${t[0]}</span>
              <div>
                <h4>${t[1]}</h4>
                <p>${t[2]}</p>
                <a href="${t[3]}" target="_blank" rel="noopener">Sumber ${t[4]} ↗</a>
              </div>
            </article>`).join('')}</div>
        </div>
        <h3 style="font:800 24px Manrope;margin:46px 0 16px">Pertanyaan yang sering muncul</h3>
        <div class="faq">${[['Kapan sebaiknya saya memakai masker?', 'Saat AQI masuk kategori tidak sehat dan kamu harus berada di luar. Pilih masker yang menutup hidung dan mulut dengan rapat.'], ['Apakah udara pagi selalu bersih?', 'Tidak selalu. Pada beberapa kota polusi justru menumpuk di pagi hari. Cek Air Forecast untuk waktu terbaik.'], ['Mengapa AQI berbeda di tiap aplikasi?', 'Sumber sensor dan standar perhitungannya bisa berbeda. KADAR mencantumkan sumber dan waktu data agar bisa dibandingkan.']].map(f => `<details>
            <summary>${f[0]}</summary>
            <p>${f[1]}</p>
          </details>`).join('')}</div>
        <div class="myth-banner">
          <div>
            <h3>Jangan hanya melihat cuaca.<br><em>Perhatikan juga kualitas udara.</em>
            </h3>
          </div>
          <a href="air-monitor.html" class="btn-primary-kadar">Cek udara sekarang <span>↗</span>
          </a>
        </div>
      </div>
    </section>`,

  // --- HALAMAN ABOUT + CONTACT — tentang KADAR dan form aduan (demo) ---
  about: () => `<section class="sub-page">
      <div class="container-fluid page-container">
        <div class="about-grid reveal">
          <div>
            <div class="crumb">
              <a href="index.html">Home</a> / About</div>
            <div class="eyebrow"><i></i> TENTANG KADAR</div>
            <h2>Karena udara<br>adalah <em>cerita kita.</em>
            </h2>
          </div>
          <div class="about-copy">
            <p>KADAR (Kabar Udara) adalah ruang informasi yang membantu masyarakat mengenali kualitas udara di berbagai kota, memahami artinya, dan memilih tindakan yang tepat.</p>
            <p>Melalui pemantauan, prediksi, kabar, dan edukasi, KADAR mengajak setiap orang mengambil langkah kecil demi lingkungan yang lebih sehat.</p>
            <div class="about-values"><span><b>CHECK</b> Cek udara</span><span><b>UNDERSTAND</b> Pahami</span><span><b>PROTECT</b> Lindungi diri</span>
            </div>
          </div>
        </div>
        <div class="contact-card reveal" id="contact" style="margin-top:50px">
          <div>
            <h2 style="font-size:clamp(30px,4vw,48px)">Punya masukan<br>untuk <em>KADAR?</em>
            </h2>
            <p>Kirim saran, pertanyaan, atau laporan kendala.</p>
            <div class="contact-links">
              <a href="mailto:halo@kadarudara.demo"><span>EMAIL (DEMO)</span><b>halo@kadarudara.demo ↗</b>
              </a>
            </div>
          </div>
          <form class="kform" id="cform"><input required placeholder="Nama" aria-label="Nama"><input required type="email" placeholder="Email" aria-label="Email"><textarea required rows="4" placeholder="Pesan atau aduan" aria-label="Pesan"></textarea>
            <button class="btn-primary-kadar" style="justify-content:space-between;border:0">Kirim pesan <span>↗</span>
            </button>
          </form>
        </div>
      </div>
    </section>`
};

// === CHROME — navbar pill, footer, chip jam, tombol tema, transisi halaman, ripple, efek muncul saat scroll ===
function chrome() {
  $('#app').innerHTML = `<nav class="navbar navbar-expand-lg fixed-top kadar-nav">
      <div class="container-fluid nav-wrap">
        <a class="navbar-brand" href="index.html"><img src="assets/kadar-logo.png" alt="KADAR"></a>
        <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-label="Menu"><span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="mainNav">
          <ul class="navbar-nav mx-auto">${pages.map(p => `<li>
              <a class="nav-link ${p[0] === P ? 'active' : ''}" href="${p[0]}.html">${p[1]}</a>
            </li>`).join('')}</ul>
          <div class="nav-actions">
            <button id="themeToggle" class="theme-toggle" aria-label="Ganti tema"><span class="theme-icon">${document.body.classList.contains('dark') ? '☀' : '☾'}</span>
            </button>
            <a class="nav-contact" href="about.html#contact">Hubungi kami <span>↗</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
    <main>${T[P]()}</main>
    <footer class="site-footer">
      <div class="container-fluid page-container">
        <div class="footer-main">
          <a class="footer-brand" href="index.html"><img src="assets/kadar-logo.png" alt="KADAR"><span>Informasi udara untuk keputusan yang lebih baik.</span>
          </a>
          <div class="footer-nav">${pages.slice(1).map(p => `<a href="${p[0]}.html">${p[1]}</a>`).join('')}</div>
          <div class="footer-social"><span>IKUTI KADAR (DEMO)</span>
            <a href="https://instagram.com/" target="_blank" rel="noopener">Instagram @kadar.udara ↗</a>
            <a href="https://tiktok.com/" target="_blank" rel="noopener">TikTok @kabarudara ↗</a>
            <a href="mailto:halo@kadarudara.demo">halo@kadarudara.demo ↗</a>
          </div>
        </div>
        <div class="footer-bottom"><span>© 2026 KADAR — Kabar Udara. Prototype lomba web design.</span>
        </div>
        <p class="disclaimer">Seluruh angka AQI, polutan, suhu, kota, dan grafik adalah data dummy/simulasi, bukan pengukuran aktual dan bukan dasar diagnosis medis.</p>
      </div>
    </footer>
    <div class="clock-chip" aria-label="Tanggal dan waktu lokal"><span class="live-dot"></span>
      <div><strong id="localTime">--:--:--</strong>
        <small><span id="localDate"></span> · <span id="localZone"></span>
        </small>
      </div>
    </div>
    <button id="backTop" class="back-top" aria-label="Ke atas">↑</button>
    <div class="toast" id="toast"></div>`;
  $('#themeToggle').onclick = () => {
    document.body.classList.toggle('dark');
    const d = document.body.classList.contains('dark');
    localStorage.kadarTheme = d ? 'dark' : 'light';
    $('.theme-icon').textContent = d ? '☀' : '☾';
    if (chart) fc(selected)
  };
  $('#backTop').onclick = () => scrollTo({top: 0, behavior: 'smooth'});
  addEventListener('scroll', () => $('#backTop').classList.toggle('show', scrollY > 500));
  $$('a[href$=".html"]').forEach(a => a.addEventListener('click', e => {
    if (a.target || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    document.body.classList.add('leave');
    setTimeout(() => location.href = a.href, 230)
  }));
  $$('.btn-primary-kadar').forEach(b => b.addEventListener('click', e => {
    const r = b.getBoundingClientRect(), s = document.createElement('i');
    s.className = 'rip';
    s.style.cssText = `width:40px;height:40px;left:${e.clientX - r.left - 20}px;top:${e.clientY - r.top - 20}px`;
    b.appendChild(s);
    setTimeout(() => s.remove(), 600)
  }));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target)
    }
  }), {threshold: .1});
  $$('.reveal').forEach(r => io.observe(r))
}

// === TOAST — pesan kecil di bawah layar ===
const toast = m => {
  const t = $('#toast');
  t.textContent = m;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200)
};

// === JAM — tanggal & waktu lokal perangkat, diperbarui tiap detik ===
function clock() {
  const n = new Date, f = o => new Intl.DateTimeFormat('id-ID', o).format(n);
  if (!$('#localDate')) return;
  $('#localDate').textContent = f({weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'});
  $('#localTime').textContent = f({hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false});
  $('#localZone').textContent = (new Intl.DateTimeFormat('id-ID', {timeZoneName: 'short'}).formatToParts(n).find(p => p.type === 'timeZoneName') || {}).value
}

// === HOME — ringkasan 4 kota (kartu 'Pantau sekilas') ===
function quick() {
  const q = $('#quickCities');
  if (!q) return;
  q.innerHTML = cities.slice(0, 4).map(c => `<a class="quick-city" href="air-monitor.html?city=${c.name}"><span>${c.name}</span>
      <div><strong>${c.aqi}</strong>
        <small>${st(c.aqi)}</small>
      </div>
    </a>`).join('')
}

// === AIR MONITOR — daftar kota (pencarian + filter kategori) ===
function list() {
  const f = ($('#citySearch').value || '').toLowerCase();
  const r = cities.filter(c => c.name.toLowerCase().includes(f) && (filt === 'all' || lv(c.aqi) === filt));
  $('#cityList').innerHTML = r.map(c => `<button class="city-row ${selected === c.name ? 'selected' : ''}" data-c="${c.name}"><i class="city-dot" style="background:${col(c.aqi)}"></i><span class="city-name">${c.name}<small class="city-region">${c.region}</small></span><b class="city-aqi">${c.aqi}</b><span class="city-state">${st(c.aqi)}</span>
    </button>`).join('') || '<p class="p-3 small">Tidak ada kota yang cocok. Ubah filter atau kata kunci.</p>';
  $$('.city-row').forEach(e => e.onclick = () => pick(e.dataset.c))
}

// === AIR MONITOR — pilih kota: isi detail AQI, saran, Air Alert, kartu aktivitas, geser peta ===
function pick(n) {
  const c = cities.find(x => x.name === n);
  if (!c) return;
  selected = n;
  list();
  $('#detailCity').textContent = c.name + ', ' + c.region;
  const el = $('#detailAqi'), t0 = performance.now();
  (function s(t) {
    const k = Math.min(1, (t - t0) / 600);
    el.textContent = Math.round(c.aqi * k);
    if (k < 1) requestAnimationFrame(s)
  })(t0);
  $('#detailStatus').textContent = st(c.aqi);
  $('#pm25').innerHTML = c.pm25 + ' <small>µg/m³</small>';
  $('#pm10').innerHTML = c.pm10 + ' <small>µg/m³</small>';
  $('#temp').innerHTML = c.temp + '° <small>C</small>';
  const g = c.aqi <= 50, m = c.aqi <= 100;
  $('#adviceIcon').textContent = g ? '✦' : m ? '!' : '⚠';
  $('#adviceTitle').textContent = g ? 'Udara relatif baik untuk beraktivitas.' : m ? 'Kelompok sensitif sebaiknya membatasi aktivitas berat.' : 'Kurangi aktivitas luar ruangan yang tidak perlu.';
  $('#adviceText').textContent = g ? 'Aktivitas luar ruangan umumnya aman dilakukan.' : m ? 'Sebagian besar orang masih dapat beraktivitas normal; anak, lansia, dan individu sensitif sebaiknya kurangi aktivitas berat.' : 'Pertimbangkan aktivitas di dalam ruangan. Jika harus keluar, gunakan masker dan ikuti informasi resmi setempat.';
  const a = $('#adviceIcon');
  a.style.background = g ? '#e3f7ef' : m ? '#fff2d9' : '#ffebe5';
  a.style.color = g ? '#239b70' : m ? '#c68a2c' : '#d66b51';
  $('#alertSlot').innerHTML = c.aqi > 100 ? `<div class="alert-bar"><b>⚠ Air Alert</b> Udara di ${c.name} sedang tidak sehat. Batasi aktivitas di luar ruangan.</div>` : '';
  const v = (l, x) => `<div class="act"><em class="${x <= 50 ? 'v-ok' : x <= 100 ? 'v-mid' : 'v-no'}">${x <= 50 ? 'Aman' : x <= 100 ? 'Hati-hati' : 'Tunda'}</em><b>${l}</b><span>${x <= 50 ? 'Silakan, kondisi mendukung.' : x <= 100 ? 'Batasi durasi, pantau gejala.' : 'Pilih di dalam ruangan.'}</span>
    </div>`;
  $('#acts').innerHTML = v('🏃 Jogging', c.aqi) + v('🚲 Bersepeda', c.aqi + 10) + v('🧒 Anak bermain di luar', c.aqi + 25) + v('😷 Perlu masker?', c.aqi + 40);
  $('#toFc').href = 'air-forecast.html?city=' + c.name;
  if (map && markers[n]) {
    map.flyTo([c.lat, c.lng], 6, {duration: .8});
    markers[n].openPopup()
  }
}

// === AIR MONITOR — peta Leaflet + penanda kota berwarna sesuai AQI ===
function initMap() {
  map = L.map('airMap', {scrollWheelZoom: false}).setView([ -2.3, 118], 4.4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; OpenStreetMap'}).addTo(map);
  cities.forEach(c => {
    const ic = L.divIcon({
      className: '',
      html: `<div style="width:36px;height:36px;border-radius:50%;background:${col(c.aqi)};border:3px solid #fff;box-shadow:0 2px 12px #23456a77;display:grid;place-items:center;color:#fff;font:800 11px Manrope;cursor:pointer">${c.aqi}</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });
    const m = L.marker([c.lat, c.lng], {icon: ic}).addTo(map).bindPopup(`<b>${c.name}</b><br>AQI demo ${c.aqi} · ${st(c.aqi)}`);
    m.on('click', () => pick(c.name));
    markers[c.name] = m
  })
}

// === AIR MONITOR — merangkai peta, filter, pencarian, lokasi terdekat, salin tautan ===
function monitor() {
  initMap();
  list();
  $('#citySearch').oninput = list;
  $$('#chips .chip').forEach(b => b.onclick = () => {
    $$('#chips .chip').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    filt = b.dataset.f;
    list();
    cities.forEach(c => {
      const e = markers[c.name].getElement();
      if (e) e.style.display = filt === 'all' || lv(c.aqi) === filt ? '' : 'none'
    })
  });
  $('#locate').onclick = () => {
    if (!navigator.geolocation) return toast('Perangkat tidak mendukung lokasi.');
    navigator.geolocation.getCurrentPosition(p => {
      const d = c => (c.lat - p.coords.latitude) ** 2 + (c.lng - p.coords.longitude) ** 2;
      const n = [...cities].sort((a, b) => d(a) - d(b))[0];
      pick(n.name);
      toast('Kota terdekat: ' + n.name)
    }, () => toast('Izin lokasi ditolak. Pilih kota secara manual.'))
  };
  $('#share').onclick = () => {
    const u = location.origin + location.pathname + '?city=' + selected;
    (navigator.clipboard ? navigator.clipboard.writeText(u) : Promise.reject()).then(() => toast('Tautan disalin'), () => toast('Salin dari address bar'))
  };
  pick(new URLSearchParams(location.search).get('city') || 'Jakarta')
}

// === AIR FORECAST — ringkasan, tips, dan grafik Chart.js 24 jam (warna garis per kategori) ===
function fc(n) {
  selected = n;
  $('#forecastSelect').value = n;
  const v = hourly[n], avg = Math.round(v.reduce((a, b) => a + b) / v.length), bi = v.indexOf(Math.min(...v));
  $('#forecastCity').textContent = n + ' · 24 jam ke depan';
  $('#forecastAvg').textContent = avg;
  $('#bestTime').textContent = String(bi * 2).padStart(2, '0') + '.00 – ' + String(bi * 2 + 3).padStart(2, '0') + '.00';
  $('#trendText').textContent = v[11] < v[0] ? '↘ Cenderung membaik' : '↗ Perlu dipantau';
  $('#fcTips').innerHTML = [
    ['Waktu terbaik', 'Jadwalkan olahraga di jam dengan AQI terendah.'],
    [
      'Puncak polusi',
      'Jam ' + String(v.indexOf(Math.max(...v)) * 2).padStart(2, '0') + '.00 AQI tertinggi, hindari aktivitas berat.'
    ],
    ['Siapkan rencana', 'Kategori ' + st(avg).toLowerCase() + ' rata-rata hari ini.']
  ].map(t => `<div class="act"><b>${t[0]}</b><span>${t[1]}</span>
    </div>`).join('');
  if (chart) chart.destroy();
  const mc = getComputedStyle(document.body).getPropertyValue('--muted');
  chart = new Chart($('#forecastChart'), {
    type: 'line',
    data: {
      labels: v.map((_, i) => String(i * 2).padStart(2, '0') + '.00'),
      datasets: [
        {
          data: v,
          fill: true,
          backgroundColor: 'rgba(73,145,218,.1)',
          tension: .38,
          borderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointBackgroundColor: v.map(col),
          pointBorderColor: '#fff',
          segment: {
            borderColor: c => col(c.p1.parsed.y)
          }
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      animation: {duration: 900},
      plugins: {
        legend: {display: false},
        tooltip: {
          displayColors: false,
          callbacks: {
            label: x => ' AQI simulasi ' + x.raw + ' · ' + st(x.raw)
          }
        }
      },
      scales: {
        x: {grid: {display: false}, ticks: {color: mc}},
        y: {beginAtZero: true, suggestedMax: 150, grid: {color: 'rgba(120,150,180,.15)'}, ticks: {color: mc}}
      }
    }
  })
}

// === NEWS — render kartu, filter kategori, skeleton shimmer saat memuat ===
function newsPage() {
  const g = $('#newsGrid');
  let cat = 'Semua';
  const draw = () => {
    g.innerHTML = news.filter(n => cat === 'Semua' || n.c === cat).map((n, i) => `<article class="news-card ${i === 0 && cat === 'Semua' ? 'news-feature' : ''}">
        <div class="news-art art-${n.a}"><b>${n.x}</b>
        </div>
        <div class="news-body">
          <div class="news-meta"><span>${n.c.toUpperCase()}</span><span>• ${n.m} MENIT BACA</span>
          </div>
          <h3>${n.t}</h3>
          <p>${n.d}</p>
          <a href="${n.u}" target="_blank" rel="noopener">Baca dari ${n.s} <span>↗</span>
          </a>
        </div>
      </article>`).join('')
  }, sk = () => {
    g.innerHTML = Array(3).fill('<div class="sk-card"><div class="sk"></div><div class="sk"></div><div class="sk" style="width:70%"></div></div>').join('')
  };
  sk();
  setTimeout(draw, 800);
  $$('#nchips .chip').forEach(b => b.onclick = () => {
    $$('#nchips .chip').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    cat = b.textContent;
    sk();
    setTimeout(draw, 450)
  })
}

// === JALANKAN APLIKASI — urutan eksekusi saat halaman dibuka ===
chrome();
clock();
setInterval(clock, 1000);
quick();
if (P === 'air-monitor') monitor();
if (P === 'air-forecast') {
  $('#forecastSelect').onchange = e => fc(e.target.value);
  fc(new URLSearchParams(location.search).get('city') || 'Jakarta')
}
if (P === 'news') newsPage();
if (P === 'about') $('#cform').onsubmit = e => {
  e.preventDefault();
  e.target.reset();
  toast('Terima kasih! Pesan demo terkirim.')
};

// === LANDING (hanya di Home, sekali per sesi) — Halaman 1: GIF logo (±4 dtk) → Halaman 2: loading bar → Home ===
if (P === 'index' && !sessionStorage.kadarIntro) {
  sessionStorage.kadarIntro = 1;
  document.body.classList.add('introing');
  const i = document.createElement('div');
  i.className = 'intro-screen';
  i.innerHTML = '<div class="stage s1 on"><img src="assets/kadar-intro.gif" alt="KADAR"></div><div class="stage s2"><h1>Selamat Datang di Kadar</h1><p>Kabar Udara · pantau, pahami, lindungi</p><div class="load-bar" role="progressbar" aria-label="Memuat KADAR"><i></i></div><small class="load-pct">0%</small></div><button class="skip">Lewati ↗</button>';
  document.body.appendChild(i);
  const done = () => {
    i.classList.add('hide');
    document.body.classList.remove('introing');
    setTimeout(() => i.remove(), 800)
  };
  i.querySelector('.skip').onclick = done;
  setTimeout(() => {
    if (!i.isConnected) return;
    i.querySelector('.s1').classList.remove('on');
    setTimeout(() => {
      i.querySelector('.s2').classList.add('on');
      const t0 = performance.now(), b = i.querySelector('.load-bar i'), p = i.querySelector('.load-pct');
      (function f(t) {
        if (!i.isConnected) return;
        const k = Math.min(1, (t - t0) / 2600), e = 1 - Math.pow(1 - k, 2);
        b.style.width = e * 100 + '%';
        p.textContent = Math.round(e * 100) + '%';
        if (k < 1) requestAnimationFrame(f);
        else setTimeout(done, 350)
      })(t0)
    }, 500)
  }, 4000)
}
