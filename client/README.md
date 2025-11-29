🚀 YBS Portfolio - Full Stack MERN Personal Platform

Yönetim Bilişim Sistemleri (YBS/MIS) vizyonu ile modern web teknolojilerini birleştiren, veri odaklı, interaktif ve tamamen yönetilebilir bir kişisel portfolyo platformu.

🌟 Proje Hakkında

Bu proje, standart bir portfolyo sitesinin ötesine geçerek, bir yazılım geliştiricinin teknik yetkinliklerini canlı verilerle ve interaktif modüllerle sergileyebileceği bir Web Uygulaması (Web App) olarak tasarlanmıştır.

İçerisinde kendi CMS (İçerik Yönetim Sistemi) yapısını barındırır; bu sayede projeler, blog yazıları ve gelen mesajlar özel bir Admin Paneli üzerinden yönetilebilir.

🎯 Temel Hedefler

Veri Odaklı Sunum: GitHub aktiviteleri, kod satır sayıları ve yetenek haritaları ile analitik bir yaklaşım.

Yönetilebilirlik: Kod değiştirmeden içerik güncelleyebilme (Admin Dashboard).

Kullanıcı Deneyimi (UX): Akıcı animasyonlar (Framer Motion), özel imleçler ve "Sinematik" sayfa geçişleri.

🔥 Temel Özellikler

🎨 Frontend (Kullanıcı Arayüzü)

Modern Dashboard Tasarımı: Bento Grid yapısı ve Glassmorphism efektleri ile fütüristik görünüm.

İnteraktif Modüller:

🖥️ Web Terminal: Ziyaretçilerin komut satırı deneyimi ile siteyle etkileşime geçmesi.

📊 Canlı Sistem Monitörü: CPU, RAM ve Backend durumunu simüle eden dashboard.

🌍 Global Harita: CSS tabanlı interaktif dünya haritası.

Dinamik Blog & Proje Vitrini: Kategori filtreleme, arama ve detaylı vaka analizi (case study) sayfaları.

⚙️ Backend & Yönetim (Admin Paneli)

Güvenli Giriş: Yerel kimlik doğrulama ile korunan Admin rotaları.

Proje Yönetimi: Yeni proje ekleme, düzenleme, silme ve resim yükleme (Base64).

Blog Sistemi: Markdown destekli blog yazısı editörü ve yönetimi.

Mesaj Kutusu: İletişim formundan gelen mesajların veritabanında arşivlenmesi.

🛠️ Teknolojiler (Tech Stack)

Alan

Teknoloji

Açıklama

Frontend

React.js (Vite)

Hızlı ve modüler UI geliştirme

Styling

Tailwind CSS

Utility-first CSS çerçevesi

Animation

Framer Motion

Sayfa geçişleri ve mikro etkileşimler

Backend

Node.js & Express

RESTful API mimarisi

Database

MongoDB Atlas

NoSQL bulut veritabanı

Icons

React Icons & Devicon

Vektörel ikon setleri

Charts

Recharts

Veri görselleştirme grafikleri

📸 Ekran Görüntüleri

Ana Sayfa (Dashboard)

Proje Detay & Analiz





Admin Paneli

Blog Sistemi





🚀 Kurulum ve Çalıştırma

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin.

Ön Hazırlık

Node.js (v14 veya üzeri)

MongoDB (Yerel veya Atlas bağlantı linki)

1. Repoyu Klonlayın

git clone [https://github.com/KULLANICI_ADIN/ybs-portfolio.git](https://github.com/KULLANICI_ADIN/ybs-portfolio.git)
cd ybs-portfolio


2. Bağımlılıkları Yükleyin

Hem server hem de client klasörleri için paketleri yüklemeniz gerekir.

# Backend paketleri
cd server
npm install

# Frontend paketleri
cd ../client
npm install


3. Çevresel Değişkenleri (.env) Ayarlayın

server klasörünün içine .env adında bir dosya oluşturun ve MongoDB bağlantı adresinizi ekleyin:

PORT=5000
MONGO_URI=mongodb+srv://kullanici:sifre@cluster.mongodb.net/myPortfolio


4. Uygulamayı Başlatın

Otomatik başlatıcı scripti (baslat.bat) kullanabilir veya manuel başlatabilirsiniz.

Manuel Başlatma:
Terminal 1 (Backend):

cd server
npm run dev


Terminal 2 (Frontend):

cd client
npm run dev


Tarayıcınızda http://localhost:5173 adresine gidin.

📂 Proje Yapısı

ybs-portfolio/
├── client/                 # React Frontend Uygulaması
│   ├── src/
│   │   ├── components/     # Tekrar kullanılabilir bileşenler (UI, Charts)
│   │   ├── context/        # Global state (Dil vb.)
│   │   ├── pages/          # Sayfa bileşenleri (Admin, Blog, Home...)
│   │   └── ...
├── server/                 # Node.js Backend API
│   ├── config/             # Veritabanı ayarları
│   ├── controllers/        # İş mantığı (CRUD işlemleri)
│   ├── models/             # Mongoose şemaları (DB Modelleri)
│   ├── routes/             # API rotaları (Endpoints)
│   └── ...
└── README.md               # Proje Dokümantasyonu


🤝 Katkıda Bulunma

Bu projeyi Fork'layın.

Yeni bir özellik dalı (feature branch) oluşturun (git checkout -b feature/YeniOzellik).

Değişikliklerinizi kaydedin (git commit -m 'Yeni özellik eklendi').

Dalınızı uzak sunucuya gönderin (git push origin feature/YeniOzellik).

Bir Pull Request oluşturun.

📄 Lisans

Bu proje MIT Lisansı ile lisanslanmıştır.

<div align="center">
<strong>Made with ❤️ by [Senin Adın]</strong>




<em>Management Information Systems Student</em>
</div>