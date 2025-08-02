"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  HiOutlineBell,
  HiOutlineCheck,
  HiOutlineClock,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import { notificationService } from "@/services/notifications";
import { NotificationStatus, NotificationType } from "@/types/notifications";

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  hasPendingInvoices?: boolean;
}

function formatNotificationDate(date: Date) {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return "Agora";
  if (diffInHours < 24) return `${diffInHours}h atrás`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d atrás`;
  
  return new Date(date).toLocaleDateString('pt-BR');
}

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case NotificationType.RESERVATION_REQUEST:
    case NotificationType.RESERVATION_APPROVED:
    case NotificationType.RESERVATION_REJECTED:
    case NotificationType.RESERVATION_CANCELLED:
      return "🏟️";
    case NotificationType.PAYMENT_SUCCESS:
    case NotificationType.PAYMENT_FAILED:
      return "💳";
    case NotificationType.SUBSCRIPTION_EXPIRING:
    case NotificationType.SUBSCRIPTION_EXPIRED:
      return "⚠️";
    case NotificationType.SYSTEM_ANNOUNCEMENT:
      return "📢";
    default:
      return "🔔";
  }
}

export function NotificationsDropdown({ isOpen, onClose, hasPendingInvoices }: NotificationsDropdownProps) {
  const queryClient = useQueryClient();

  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.getNotifications({ page: 1, limit: 10 }),
    enabled: isOpen,
  });

  const { data: unreadCountData } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationService.getUnreadCount(),
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) => notificationService.markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (notificationId: string) => notificationService.deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });

  const notifications = notificationsData?.notifications || [];
  const unreadCount = unreadCountData?.count || 0;

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 max-h-[600px] overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <HiOutlineBell className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-lg">Notificações</h3>
              <p className="text-sm text-slate-500">
                {unreadCount} não lida{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          {notifications.length > 0 && (
            <button
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
            >
              {markAllAsReadMutation.isPending ? 'Marcando...' : 'Marcar todas'}
            </button>
          )}
        </div>
      </div>

      <div className="overflow-y-auto max-h-[500px]">
        {hasPendingInvoices && (
          <div className="m-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <HiOutlineBell className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-red-800 text-sm mb-1">
                  Boletos pendentes
                </div>
                <div className="text-xs text-red-700 mb-3">
                  Entre em contato com o suporte para regularizar sua situação.
                </div>
                <a
                  href="https://sportmap.atlassian.net/servicedesk/customer/portal/1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-2 rounded-lg transition-colors"
                >
                  <HiOutlineEye className="w-3 h-3" />
                  Contatar suporte
                </a>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
              <span className="text-slate-600">Carregando notificações...</span>
            </div>
          </div>
        ) : notifications.length > 0 ? (
          <div className="p-4 space-y-3">
            {notifications.map((notification) => (
              notification.type === NotificationType.PAYMENT_SUCCESS ? (
                <div
                  key={notification._id}
                  className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="flex-shrink-0 mt-1">
                    <HiOutlineCheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-900 text-base">
                        {notification.title}
                      </span>
                      <span className="border border-green-500 text-green-600 text-xs font-medium px-2 py-0.5 rounded-full bg-white">
                        Sucesso
                      </span>
                    </div>
                    <div className="text-slate-700 text-sm mb-1">
                      {notification.message}
                    </div>
                    <div className="text-xs text-slate-400">
                      {formatNotificationDate(notification.createdAt)}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={notification._id}
                  className={`group relative p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                    notification.status === NotificationStatus.UNREAD
                      ? "bg-blue-50 border-blue-200 shadow-sm"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-lg">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-slate-900 text-sm leading-tight">
                              {notification.title}
                            </h4>
                            {notification.status === NotificationStatus.UNREAD && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 mb-2 leading-relaxed">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <HiOutlineClock className="w-3 h-3" />
                            {formatNotificationDate(notification.createdAt)}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {notification.status === NotificationStatus.UNREAD && (
                            <button
                              onClick={() => markAsReadMutation.mutate(notification._id)}
                              disabled={markAsReadMutation.isPending}
                              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
                              title="Marcar como lida"
                            >
                              <HiOutlineCheck className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotificationMutation.mutate(notification._id)}
                            disabled={deleteNotificationMutation.isPending}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Excluir"
                          >
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiOutlineBell className="w-8 h-8 text-slate-400" />
            </div>
            <h4 className="font-medium text-slate-900 mb-2">Nenhuma notificação</h4>
            <p className="text-sm text-slate-500">
              Você está em dia com todas as suas notificações
            </p>
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">
              Mostrando {notifications.length} de {notificationsData?.total || 0} notificações
            </span>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 