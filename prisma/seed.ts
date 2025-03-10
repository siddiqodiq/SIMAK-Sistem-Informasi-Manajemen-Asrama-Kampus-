import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Create buildings and rooms
  const buildings = ["A", "B", "C", "D"]

  for (const building of buildings) {
    for (let floor = 1; floor <= 4; floor++) {
      for (let room = 1; room <= 10; room++) {
        const roomNumber = `${floor}${room.toString().padStart(2, "0")}`

        await prisma.room.upsert({
          where: {
            id: `${building}-${roomNumber}`,
          },
          update: {},
          create: {
            id: `${building}-${roomNumber}`,
            number: roomNumber,
            building: building,
            floor: floor.toString(),
          },
        })
      }
    }
  }

  // Create admin user
  const adminPassword = await hash("admin123", 10)

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin PART",
      email: "admin@example.com",
      password: adminPassword,
      role: "ADMIN",
    },
  })

  // Create staff users
  const staffPassword = await hash("staff123", 10)

  const staffMembers = [
    { name: "Ahmad Teknisi", email: "ahmad@example.com" },
    { name: "Budi Teknisi", email: "budi.teknisi@example.com" },
    { name: "Citra Teknisi", email: "citra@example.com" },
  ]

  for (const staff of staffMembers) {
    await prisma.user.upsert({
      where: { email: staff.email },
      update: {},
      create: {
        name: staff.name,
        email: staff.email,
        password: staffPassword,
        role: "STAFF",
      },
    })
  }

  // Create regular users
  const userPassword = await hash("user123", 10)

  const users = [
    { name: "Budi Santoso", email: "budi@example.com", room: "A-101" },
    { name: "Dewi Lestari", email: "dewi@example.com", room: "B-205" },
    { name: "Ahmad Rizki", email: "ahmad.rizki@example.com", room: "C-310" },
    { name: "Ahmad Rizki", email: "ahmad.rizki@example.com", room: "C-310" },
    { name: "Syubbanul Siddiq", email: "Syubbanul Siddiq", room: "C-310" },
    
  ]

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        password: userPassword,
        role: "USER",
        room: {
          connect: {
            id: user.room,
          },
        },
      },
    })
  }

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

