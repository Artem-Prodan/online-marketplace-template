//orderProgress

const getStatusStep = (status) => {
  const steps = ["Placed", "Processing", "Confirmed", "Delivered", "Completed"];
  return steps.indexOf(status);
};

const ProgressTracker = ({ currentStatus }) => {
  const steps = ["Order Placed", "Processing", "Confirmed", "Delivered", "Completed"];
  const currentStep = getStatusStep(currentStatus);

  return (
    <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
      {steps.map((step, index) => (
        <div key={step} style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              backgroundColor: index <= currentStep ? "#8f72de" : "#ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "0.75rem",
            }}
          >
            {index + 1}
          </div>
          <span style={{ marginLeft: 8, marginRight: 12 }}>{step}</span>
          {index < steps.length - 1 && (
            <div
              style={{
                height: 2,
                width: 30,
                backgroundColor: index < currentStep ? "#8f72de" : "#ccc",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};


export default ProgressTracker;