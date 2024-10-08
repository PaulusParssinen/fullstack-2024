const notificationStyle = {
  background: "lightgrey",
  fontSize: "24px",
  borderStyle: "solid",
  borderRadius: "6px",
  padding: "10px",
  marginBottom: "10px",
};

const errorStyle = {
  ...notificationStyle,
  color: "red",
};

const successStyle = {
  ...notificationStyle,
  color: "green",
};

const Notification = ({ value }) =>
  value && (
    <div
      style={value.isError ? errorStyle : successStyle}
      data-testid="notification"
    >
      <b>{value.message}</b>
    </div>
  );

export default Notification;
