import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface ReportStats {
  byBuilding: { building: string; count: number }[];
  byCategory: { category: string; count: number }[];
  byMonth: { month: string; count: number }[];
  byStatus: { status: string; count: number }[];
  repairCostByYear: { year: string; totalCost: number }[];
  repairCostByMonth: { month: string; totalCost: number }[]; //
  avgRepairDuration: number;
}

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
// Total biaya perbaikan per bulan untuk tahun sekarang
const repairCostByMonth = await prisma.$queryRaw<
  { month: string; totalCost: number }[]
>`
  SELECT 
    DATE_FORMAT(completedAt, '%Y-%m') as month,
    SUM(repairCost) as totalCost
  FROM Report
  WHERE 
    status = 'COMPLETED' 
    AND repairCost IS NOT NULL
    AND YEAR(completedAt) = YEAR(CURDATE())
  GROUP BY month
  ORDER BY month
`;
    // Total biaya perbaikan per tahun
    const repairCostByYear = await prisma.$queryRaw<
      { year: string; totalCost: number }[]
    >`
      SELECT 
        YEAR(completedAt) as year,
        SUM(repairCost) as totalCost
      FROM Report
      WHERE status = 'COMPLETED' AND repairCost IS NOT NULL
      GROUP BY year
      ORDER BY year
    `;    
    const stats: ReportStats = {
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
        count: Number(m.count),
      })),
      byStatus: byStatus.map((s) => ({
        status: s.status,
        count: Number(s._count),
      })),
      repairCostByYear: repairCostByYear.map((y) => ({
        year: y.year,
        totalCost: Number(y.totalCost),
      })),
      repairCostByMonth: repairCostByMonth.map((m) => ({
        month: m.month,
        totalCost: Number(m.totalCost),
      })),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil statistik" },
      { status: 500 }
    );
  }
}