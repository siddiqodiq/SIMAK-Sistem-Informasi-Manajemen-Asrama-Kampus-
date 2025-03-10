import { hash, compare } from "bcryptjs"
import { prisma } from "./prisma"

export async function hashPassword(password: string) {
  return await hash(password, 10)
}

export async function comparePasswords(plainPassword: string, hashedPassword: string) {
  return await compare(plainPassword, hashedPassword)
}

export async function createUser(data: {
  name: string
  email: string
  password: string
  roomId?: string
  role?: "USER" | "ADMIN" | "STAFF"
}) {
  const hashedPassword = await hashPassword(data.password)

  return prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  })
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      room: true,
    },
  })
}

export async function verifyUser(email: string, password: string) {
  const user = await getUserByEmail(email)

  if (!user) {
    return null
  }

  const passwordMatch = await comparePasswords(password, user.password)

  if (!passwordMatch) {
    return null
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    room: user.room,
  }
}

