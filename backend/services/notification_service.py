class NotificationService:
    @staticmethod
    def send_notification(user_id, message):
        """Mock external notification"""
        print(f"Sending notification to {user_id}: {message}")
        return True
