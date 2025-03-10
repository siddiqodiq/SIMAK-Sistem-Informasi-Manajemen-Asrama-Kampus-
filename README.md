## 📘 **SIMAK - Sistem Informasi Manajemen Asrama**  

Repository ini berisi sistem informasi manajemen asrama yang berjalan menggunakan **MySQL** sebagai database dan **Node.js** sebagai backend. Proyek ini dapat dijalankan secara manual atau menggunakan **Docker**.  

---

## 🚀 **Instalasi Manual**  

### **1️⃣ Prasyarat**  
Sebelum memulai, pastikan Anda memiliki:  
- **Node.js** (disarankan versi 18 atau lebih baru)  
- **MySQL** (versi 8.0)  
- **NPM** atau **Yarn**  
- **Prisma CLI** (untuk ORM)  

### **2️⃣ Instalasi & Konfigurasi**  
1. **Clone repositori ini**  
   ```sh
   git clone https://github.com/username/simak.git
   cd simak
   ```

2. **Install dependensi**  
   ```sh
   npm install
   ```

3. **Buat file `.env`** dan atur variabel berikut:  
   ```
   DATABASE_URL="mysql://root@localhost:3306/dormitory_db"
   JWT_SECRET="jwt"
   ```

4. **Buat database MySQL**  
   ```sh
   mysql -u root -p -e "CREATE DATABASE dormitory_db;"
   ```

5. **Jalankan migrasi database**  
   ```sh
   npx prisma generate
   npx prisma migrate dev
   npx prisma db push
   ```

6. **Jalankan seeder (jika ada)**  
   ```sh
   npm run seed
   ```

7. **Jalankan aplikasi**  
   ```sh
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:3000/`

---

## 🐳 **Menjalankan dengan Docker**  

### **1️⃣ Prasyarat**  
Pastikan Anda telah menginstal:  
- **Docker**  
- **Docker Compose**  

### **2️⃣ Menjalankan Aplikasi**  
1. **Clone repositori ini**  
   ```sh
   git clone https://github.com/username/simak.git
   cd simak
   ```

2. **Bangun dan jalankan container**  
   ```sh
   docker-compose up -d --build
   ```

3. **Cek status container**  
   ```sh
   docker ps
   ```

4. **Tips**  
   tunggu muncul http://localhost:3000/ pada log, baru dapat diakses

5. **Akses aplikasi**  
   Aplikasi akan tersedia di `http://localhost:3000/`

### **3️⃣ Menghentikan & Menghapus Container**  
- **Hentikan container**  
  ```sh
  docker-compose down
  ```

- **Menghapus container & volume database**  
  ```sh
  docker-compose down -v
  ```


## 🎯 **Fitur Utama**  
✅ Dashboard statistik
✅ Role Based Access Control (RBAC) ->
✅ Manajemen data kerusakan kamar
✅ Diskusi dan komentar dengan admin PART pada laporan kerusakan 
✅ Otentikasi JWT,Sanitasi input, hashing password dan unique id untuk keamanan
✅ Tracking progress perbaikan
✅ Migrasi database otomatis dengan Prisma  
✅ Dukungan **Docker** untuk kemudahan deployment  

Jika mengalami kendala, silakan buat **issue** atau hubungi pengembang. 🚀