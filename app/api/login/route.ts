import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { SignJWT } from 'jose';
import { logInfo, logError } from '@/lib/logger';

const loginSchema = z.object({
  identifier: z.string(),
  password: z.string()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    logInfo('Received login request', { identifier: body.identifier });

    const validatedData = loginSchema.parse(body);

    // Caută utilizatorul după email sau telefon
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.identifier },
          { phone: validatedData.identifier }
        ]
      },
      include: {
        roles: true
      }
    });

    if (!user) {
      logInfo('Login failed: User not found', { identifier: validatedData.identifier });
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verifică parola
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);

    if (!isPasswordValid) {
      logInfo('Login failed: Invalid password', { username: user.username });
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generează token JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ 
      userId: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles.map(role => role.name)
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);

    // Returnează datele utilizatorului și token-ul
    const { password, ...userWithoutPassword } = user;
    logInfo('Login successful', { username: user.username });
    
    return NextResponse.json({
      message: 'Login successful',
      user: {
        ...userWithoutPassword,
        interests: JSON.parse(user.interests)
      },
      token
    }, { 
      status: 200,
      headers: {
        'Set-Cookie': `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`
      }
    });

  } catch (error) {
    logError('Login error', error);
    return NextResponse.json(
      { message: 'An error occurred during login' },
      { status: 500 }
    );
  }
} 