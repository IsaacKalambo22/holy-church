import { WebSocketServer, WebSocket } from 'ws'
import { prisma } from '@/lib/prisma'

interface Client {
  ws: WebSocket
  userId: string
}

const clients = new Map<string, Client>()

export function createWebSocketServer(port: number = 3002) {
  const wss = new WebSocketServer({ port })

  wss.on('connection', (ws: WebSocket, req) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`)
    const userId = url.searchParams.get('userId')

    if (!userId) {
      ws.close(1008, 'User ID required')
      return
    }

    // Verify user exists
    prisma.user
      .findUnique({ where: { id: userId } })
      .then((user) => {
        if (!user) {
          ws.close(1008, 'User not found')
          return
        }

        const client: Client = { ws, userId }
        clients.set(userId, client)

        ws.on('message', (data) => {
          try {
            const message = JSON.parse(data.toString())
            handleMessage(client, message)
          } catch {
            ws.send(JSON.stringify({ error: 'Invalid message format' }))
          }
        })

        ws.on('close', () => {
          clients.delete(userId)
        })

        ws.on('error', (error) => {
          console.error('WebSocket error:', error)
          clients.delete(userId)
        })

        // Send confirmation
        ws.send(JSON.stringify({ type: 'connected', userId }))
      })
      .catch((error) => {
        console.error('Error verifying user:', error)
        ws.close(1011, 'Internal server error')
      })
  })

  // WebSocket server running on port ${port}
  return wss
}

interface WebSocketMessage {
  type: string
  notificationId?: string
}

interface NotificationData {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  createdAt: string
}

async function handleMessage(client: Client, message: WebSocketMessage) {
  switch (message.type) {
    case 'ping':
      client.ws.send(JSON.stringify({ type: 'pong' }))
      break
    case 'mark_read':
      await prisma.notification.update({
        where: { id: message.notificationId, userId: client.userId },
        data: { read: true },
      })
      break
    default:
      client.ws.send(JSON.stringify({ error: 'Unknown message type' }))
  }
}

export function broadcastNotification(userId: string, notification: NotificationData) {
  const client = clients.get(userId)
  if (client && client.ws.readyState === WebSocket.OPEN) {
    client.ws.send(JSON.stringify({
      type: 'notification',
      data: notification,
    }))
  }
}

export function broadcastToRole(role: string, notification: NotificationData) {
  // This would require querying users by role
  // For now, we'll implement a simpler version
  clients.forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      prisma.user
        .findUnique({ where: { id: client.userId } })
        .then((user) => {
          if (user && user.role === role) {
            client.ws.send(JSON.stringify({
              type: 'notification',
              data: notification,
            }))
          }
        })
        .catch((error) => {
          console.error('Error broadcasting to role:', error)
        })
    }
  })
}
