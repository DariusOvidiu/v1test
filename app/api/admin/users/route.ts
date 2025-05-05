import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRole } from '@/middleware/checkRole';
import { logInfo, logError } from '@/lib/logger';

export async function GET(request: NextRequest) {
  // Verifică dacă utilizatorul are rol de admin
  const roleCheck = await checkRole(request, ['admin']);
  if (roleCheck.status !== 200) {
    return roleCheck;
  }

  try {
    // Obține toți utilizatorii cu rolurile lor
    const users = await prisma.user.findMany({
      include: {
        roles: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Elimină parolele din răspuns
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        interests: JSON.parse(user.interests)
      };
    });

    logInfo('Users list retrieved successfully');
    return NextResponse.json(usersWithoutPasswords);
  } catch (error) {
    logError('Error retrieving users', error);
    return NextResponse.json(
      { message: 'An error occurred while retrieving users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Verifică dacă utilizatorul are rol de admin
  const roleCheck = await checkRole(request, ['admin']);
  if (roleCheck.status !== 200) {
    return roleCheck;
  }

  try {
    const body = await request.json();
    const { userId, roles } = body;

    // Actualizează rolurile utilizatorului
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        roles: {
          set: roles.map((roleId: string) => ({ id: roleId }))
        }
      },
      include: {
        roles: true
      }
    });

    // Elimină parola din răspuns
    const { password, ...userWithoutPassword } = user;

    logInfo('User roles updated successfully', { userId, roles });
    return NextResponse.json({
      message: 'User roles updated successfully',
      user: {
        ...userWithoutPassword,
        interests: JSON.parse(user.interests)
      }
    });
  } catch (error) {
    logError('Error updating user roles', error);
    return NextResponse.json(
      { message: 'An error occurred while updating user roles' },
      { status: 500 }
    );
  }
} 