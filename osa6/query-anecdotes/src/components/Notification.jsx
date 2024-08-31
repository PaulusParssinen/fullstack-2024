import { useNotificationValue } from "../NotificationContext";

const Notification = () => {
  const notification = useNotificationValue();

  return (
    notification && (
      <div
        style={{
          border: "solid",
          padding: 10,
          borderWidth: 1,
          marginBottom: 5,
        }}
      >
        {notification}
      </div>
    )
  );
};

export default Notification;
