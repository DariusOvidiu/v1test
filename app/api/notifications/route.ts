import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRole } from '@/middleware/checkRole';
import { logInfo, logError } from '@/lib/logger';
import { jwtVerify } from 'jose';

// Obține toate notificările unui utilizator
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verifică token-ul și obține ID-ul utilizatorului
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;

    // Obține notificările utilizatorului
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    logInfo('Notifications retrieved successfully', { userId });
    return NextResponse.json(notifications);
  } catch (error) {
    logError('Error retrieving notifications', error);
    return NextResponse.json(
      { message: 'An error occurred while retrieving notifications' },
      { status: 500 }
    );
  }
}

// Marchează o notificare ca citită
export async function PATCH(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { notificationId } = body;

    // Verifică token-ul și obține ID-ul utilizatorului
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;

    // Verifică dacă notificarea aparține utilizatorului
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId
      }
    });

    if (!notification) {
      return NextResponse.json(
        { message: 'Notification not found' },
        { status: 404 }
      );
    }

    // Marchează notificarea ca citită
    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    });

    logInfo('Notification marked as read', { notificationId, userId });
    return NextResponse.json(updatedNotification);
  } catch (error) {
    logError('Error marking notification as read', error);
    return NextResponse.json(
      { message: 'An error occurred while marking notification as read' },
      { status: 500 }
    );
  }
}

// Șterge o notificare
export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { notificationId } = body;

    // Verifică token-ul și obține ID-ul utilizatorului
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;

    // Verifică dacă notificarea aparține utilizatorului
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId
      }
    });

    if (!notification) {
      return NextResponse.json(
        { message: 'Notification not found' },
        { status: 404 }
      );
    }

    // Șterge notificarea
    await prisma.notification.delete({
      where: { id: notificationId }
    });

    logInfo('Notification deleted', { notificationId, userId });
    return NextResponse.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    logError('Error deleting notification', error);
    return NextResponse.json(
      { message: 'An error occurred while deleting notification' },
      { status: 500 }
    );
  }
} 