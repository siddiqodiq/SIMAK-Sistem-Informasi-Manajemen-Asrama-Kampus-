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
   git clone https://github.com/siddiqodiq/SIMAK-Sistem-Informasi-Manajemen-Asrama-Kampus-
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
   git clone https://github.com/siddiqodiq/SIMAK-Sistem-Informasi-Manajemen-Asrama-Kampus-
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
- ✅ Dashboard statistik
- ✅ Role Based Access Control (RBAC) -> admin & user
- ✅ Manajemen data kerusakan kamar
- ✅ Diskusi dan komentar dengan admin PART pada laporan kerusakan
- ✅ Otentikasi JWT, sanitasi input, hashing password, dan unique id untuk keamanan
- ✅ Tracking progress perbaikan
- ✅ Migrasi database otomatis dengan Prisma
- ✅ Dukungan **Docker** untuk kemudahan deployment 

##📷🎥 Dokumentasi
- ![image](https://github.com/user-attachments/assets/f832774d-93fb-4ed3-8cee-e339295ece11)
- ![image](https://github.com/user-attachments/assets/74944831-7e72-4807-8d8f-a6e169d79a3a)
- ![image](https://github.com/user-attachments/assets/631c4656-567f-4a08-a9e0-a9fe85c2cdbc)
- ![image](https://github.com/user-attachments/assets/52110e0a-c438-428c-80d7-e0bda86f60b5)
- ![image](https://github.com/user-attachments/assets/0b27030c-40a6-462c-bf3f-b32b41d2bf91)
- ![image](https://github.com/user-attachments/assets/0888d574-e878-4b17-9502-2492473e3251)
- ![image](https://github.com/user-attachments/assets/28d6a419-0c1d-41e1-b29d-e449a3d58412)
- ![image](https://github.com/user-attachments/assets/c12138f4-b64d-4d8e-8998-d1c1cba2a066)
- ![image](https://github.com/user-attachments/assets/d08fd02b-5d4e-4116-9235-64b3f5c29583)
- ![image](https://github.com/user-attachments/assets/f03bc54a-4883-49f9-9011-34bbbe46f0a4)


Jika mengalami kendala, silakan buat **issue** atau hubungi pengembang. 🚀
