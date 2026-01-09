# Attendance-Tracker

แอปพลิเคชันสำหรับลงเวลาการทำงานของพนักงานผ่านมือถือหรือเว็บ พร้อมระบบสแกนหน้าและตรวจสอบตำแหน่ง GPS
สามารถเข้าดูเว็บไซต์ตัวอย่างที่ https://attendance.thanaboat.com

## คำอธิบาย

โปรเจกต์นี้ช่วยให้พนักงานสามารถลงเวลาเข้า-ออกงานได้อย่างสะดวกและปลอดภัย โดยมีฟีเจอร์หลักดังนี้:

- **สแกนหน้า (Facial Recognition)** – พนักงานสแกนหน้าเพื่อตรวจสอบตัวตน
- **ตรวจสอบตำแหน่ง (Geolocation Verification)** – สามารถลงเวลาได้เฉพาะบริเวณที่ได้รับอนุญาต ไม่เกิน 200 เมตรจากจุดตั้ง
- **หลายช่วงเวลา** – รองรับการลงเวลาช่วง เช้า, กลางวัน, บ่าย, เย็น
- **บันทึกเวลา** – เก็บข้อมูลการลงเวลาของพนักงานทุกคน เพื่อตรวจสอบย้อนหลัง
- **ใช้งานได้ทั้งมือถือและเว็บ**

## การเริ่มต้นใช้งาน

### ข้อกำหนดเบื้องต้น

- Node.js เวอร์ชัน 18 ขึ้นไป
- npm หรือ pnpm
- MySQL 8 ขึ้นไป
- เว็บเบราว์เซอร์ที่รองรับกล้อง (Chrome, Edge, Firefox)
- มือถือที่รองรับ GPS

### การติดตั้ง

1. โคลนโปรเจกต์จาก GitHub:

```bash
git clone https://github.com/boatenine/Attendance-tracker.git
```

2. ติดตั้ง dependencies ของ frontend:

```
cd ./frontend
pnpm install
```

3. ติดตั้ง dependencies ของ backend:

```
cd ./backend
npm install
```

4.สร้างไฟล์ .env สำหรับ backend และ frontend ตั้งค่าการเชื่อมต่อฐานข้อมูลและ API ตัวอย่าง backend:

- Backend

```
PORT=3002

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=boateiei
DB_NAME=attendance_tracker
DB_PORT=3306

JWT_SECRET=cat555
JWT_EXPIRES_IN=8h
```

- Frontend

```
VITE_ENDPOINT="http://localhost:3002"
```

5.การติดตั้งฐานข้อมูล
นำไฟล์ attendance_tracker.sql เข้าmysqlworkbench แล้วทำการ execute

6.การรันโปรแกรม
Backend

```
cd backend
npm start
```

Frontend

```
cd frontend
pnpm dev
```

การเข้าใช้งาน

- เว็บ: http://localhost:5173

การใช้งาน

1. usename passwordสำหรับ admin คือ username=ADMIN001 password=123456

2. พนักงานสามารถสแกนหน้าเพื่อลงเวลาเข้า/ออกงาน

3. ระบบจะตรวจสอบตำแหน่ง (ไม่เกิน 200 เมตร) ก่อนอนุญาตให้ลงเวลา

4. สามารถลงเวลา เช้า, กลางวัน, บ่าย, เย็น

5. ผู้ดูแลระบบสามารถตรวจสอบบันทึกเวลาได้

การช่วยเหลือ

หากพบปัญหา:

- ตรวจสอบสิทธิ์การเข้าถึงกล้องและ GPS

- ตรวจสอบว่า backend และฐานข้อมูลกำลังทำงานอยู่

- ดู console logs เพื่อตรวจสอบ error
