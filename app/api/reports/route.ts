import { writeFile } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/session';

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const reportedRoomNumber = formData.get('reportedRoomNumber') as string;
    const reportedBuilding = formData.get('reportedBuilding') as string;
    const images = formData.getAll('images') as File[];

    // Cari atau buat room berdasarkan reportedRoomNumber dan reportedBuilding
    const floor = reportedRoomNumber.charAt(0); // Ambil lantai dari nomor kamar
    let room = await prisma.room.findFirst({
      where: {
        number: reportedRoomNumber,
        building: reportedBuilding,
      },
    });

    if (!room) {
      room = await prisma.room.create({
        data: {
          number: reportedRoomNumber,
          building: reportedBuilding,
          floor: floor,
        },
      });
    }

    // Simpan laporan ke database
    const report = await prisma.report.create({
      data: {
        title,
        description,
        category,
        reportedRoomNumber,
        reportedBuilding,
        user: {
          connect: { id: session.id }, // Hubungkan laporan dengan user yang sudah ada
        },
        room: {
          connect: { id: room.id }, // Hubungkan laporan dengan room yang sudah ada
        },
      },
    });

    // Proses upload gambar
    const imageUrls: string[] = [];
    for (const image of images) {
      const buffer = await image.arrayBuffer();
      const filename = `report_${report.id}_${Date.now()}.${image.type.split('/')[1]}`;
      const filePath = join(process.cwd(), 'public', 'uploads', filename);

      // Simpan file ke folder public/uploads
      await writeFile(filePath, Buffer.from(buffer));

      // Simpan path gambar ke database
      imageUrls.push(`/uploads/${filename}`);
    }

    // Update laporan dengan path gambar
    await prisma.report.update({
      where: { id: report.id },
      data: {
        images: {
          create: imageUrls.map((url) => ({ url })),
        },
      },
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membuat laporan' },
      { status: 500 }
    );
  }
}