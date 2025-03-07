Berikut adalah langkah-langkah untuk menjalankan proyek dengan database MySQL tanpa mengubah konfigurasi Prisma:  

---

# **Cara Menjalankan Proyek dengan MySQL (`dormitory_db`)**  

## **1. Install Dependensi**  
Jalankan perintah berikut di root folder proyek untuk menginstal dependensi:  

```bash
npm install
```  
atau  
```bash
yarn install
```

---

## **2. Buat Database MySQL**  
Pastikan MySQL sudah terinstall dan jalankan perintah berikut untuk membuat database:  

```sql
CREATE DATABASE dormitory_db;
```

---

## **3. Konfigurasi `.env`**  
Buat file `.env` di root proyek jika belum ada, lalu tambahkan konfigurasi berikut:  

```env
DATABASE_URL="mysql://user:password@localhost:3306/dormitory_db"
JWT_SECRET="secret"
```
> **Ganti `user` dan `password` sesuai dengan pengaturan MySQL Anda.**

---

## **4. Jalankan Migrasi**  
Gunakan perintah berikut untuk menerapkan skema database ke MySQL:  

```bash
npx prisma migrate dev --name init
```  
atau  
```bash
yarn prisma migrate dev --name init
```
> Jika sudah ada migrasi sebelumnya, gunakan:  
```bash
npx prisma db push
```

---

## **5. Jalankan Seed Data (Opsional)**  
Jika ada file `seed.ts` untuk mengisi database dengan data awal, jalankan:  

```bash
npx prisma db seed
```
atau  
```bash
yarn prisma db seed
```

---

## **6. Jalankan Server Next.js**  
Setelah database siap, jalankan aplikasi dengan perintah:  

```bash
npm run dev
```
atau  
```bash
yarn dev
```

Aplikasi akan berjalan di `http://localhost:3000`. 🚀  

---
