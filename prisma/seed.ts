// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // ตรวจสอบว่าถ้ามี Category อยู่แล้ว เช่น > 0 รายการ ก็ไม่ต้อง insert ซ้ำ
  const count = await prisma.category.count();
  if (count === 0) {
    // ใส่ Category เริ่มต้นได้เลย
    await prisma.category.createMany({
      data: [
        { name: 'เงินเดือน', type: 'income', icon: 'Briefcase', color: '#4CAF50' },
        { name: 'โบนัส', type: 'income', icon: 'Award', color: '#8BC34A' },
        { name: 'ของขวัญ', type: 'income', icon: 'Gift', color: '#CDDC39' },
        { name: 'เงินออม', type: 'income', icon: 'Piggy', color: '#FFEB3B' },
        { name: 'อาหาร', type: 'expense', icon: 'Utensils', color: '#F44336' },
        { name: 'การเดินทาง', type: 'expense', icon: 'Car', color: '#E91E63' },
        { name: 'ที่พักอาศัย', type: 'expense', icon: 'Home', color: '#9C27B0' },
        { name: 'บิล/ค่าน้ำค่าไฟ', type: 'expense', icon: 'Zap', color: '#673AB7' },
        { name: 'สุขภาพ', type: 'expense', icon: 'HeartPulse', color: '#3F51B5' },
        { name: 'ช้อปปิ้ง', type: 'expense', icon: 'ShoppingBag', color: '#2196F3' },
        { name: 'บันเทิง', type: 'expense', icon: 'Film', color: '#03A9F4' },
        { name: 'อื่นๆ', type: 'income', icon: 'Plus', color: '#FFC107' },
      ],
    });
    console.log('Default categories added!');
  } else {
    console.log('Categories already exist. Skip inserting.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
