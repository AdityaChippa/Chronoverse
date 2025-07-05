import { io, Socket } from 'socket.io-client';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(url: string = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001') {
    if (this.socket?.connected) return;

    this.socket = io(url, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.reconnectAttempts++;
    });
  }

  emit(event: string, data?: any) {
    if (!this.socket?.connected) {
      console.warn('WebSocket not connected');
      return;
    }
    this.socket.emit(event, data);
  }

  on(event: string, callback: (data: any) => void) {
    if (!this.socket) return;
    this.socket.on(event, callback);
  }

  off(event: string, callback?: (data: any) => void) {
    if (!this.socket) return;
    this.socket.off(event, callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Satellite tracking updates
  subscribeSatelliteUpdates(satelliteId: string) {
    this.emit('subscribe:satellite', { satelliteId });
  }

  unsubscribeSatelliteUpdates(satelliteId: string) {
    this.emit('unsubscribe:satellite', { satelliteId });
  }

  // Mission updates
  subscribeMissionUpdates(missionId: string) {
    this.emit('subscribe:mission', { missionId });
  }

  // Classroom sync
  joinClassroom(classroomId: string, userId: string) {
    this.emit('classroom:join', { classroomId, userId });
  }

  leaveClassroom(classroomId: string, userId: string) {
    this.emit('classroom:leave', { classroomId, userId });
  }

  syncClassroomState(classroomId: string, state: any) {
    this.emit('classroom:sync', { classroomId, state });
  }
}

export const wsService = new WebSocketService();