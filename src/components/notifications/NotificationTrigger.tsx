import React from "react";
import { NotificationsModal } from "./NotificationsModal";
import { useSelector } from "react-redux";
import { type RootState } from "@/store/store";

interface NotificationTriggerProps {
  className?: string;
  onNavigate?: (url: string) => void; // Callback for navigation
  userId?: string; // Optional userId prop for React.js
}

export const NotificationTrigger: React.FC<NotificationTriggerProps> = ({
  className,
  onNavigate,
  userId,
}) => {
  // Try to get user from Redux store, fallback to userId prop
  const storeUser = useSelector((state: RootState) => state.auth?.user);
  const currentUserId = userId || storeUser?.id;

  if (!currentUserId) {
    return null;
  }

  return (
    <div className={className}>
      <NotificationsModal userId={currentUserId} onNavigate={onNavigate} />
    </div>
  );
};
