import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Reports by building
    const byBuilding = await prisma.report.groupBy({
      by: ["reportedBuilding"],
      _count: true,
      orderBy: {
        _count: {
          id: "desc",
        },
      },
    });

    // Reports by category
    const byCategory = await prisma.report.groupBy({
      by: ["category"],
      _count: true,
      orderBy: {
        _count: {
          id: "desc",
        },
      },
    });

    // Reports by month
    const byMonthRaw = await prisma.$queryRaw<
      { month: string; count: bigint }[]
    >`
      SELECT 
        DATE_FORMAT(createdAt, '%Y-%m') as month,
        COUNT(*) as count
      FROM Report
      GROUP BY month
      ORDER BY month
    `;

    // Reports by status
    const byStatus = await prisma.report.groupBy({
      by: ["status"],
      _count: true,
    });

    return NextResponse.json({
      byBuilding: byBuilding.map((b) => ({
        building: b.reportedBuilding,
        count: b._count,
      })),
      byCategory: byCategory.map((c) => ({
        category: c.category,
        count: c._count,
      })),
      byMonth: byMonthRaw.map((m) => ({
        month: m.month,
        count: Number(m.count), // 🔥 Konversi BigInt ke Number
      })),
      byStatus: byStatus.map((s) => ({
        status: s.status,
        count: Number(s._count), // 🔥 Konversi BigInt ke Number
      })),
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil statistik" },
      { status: 500 }
    );
  }
}
