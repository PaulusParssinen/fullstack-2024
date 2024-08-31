import { useSelector } from "react-redux";

const Notification = () => {
  const notification = useSelector((state) => state.notification.message);

  return (
    notification && (
      <div
        style={{
          border: "solid",
          padding: 10,
          borderWidth: 1,
        }}
      >
        {notification}
      </div>
    )
  );
};

export default Notification;
