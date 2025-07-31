const handleSubmit = async (e) => {
  e.preventDefault();
  if (!comment.trim() || rating < 1) {
    setError("Please enter your feedback and select at least one star.");
    return;
  }

  console.log("Submitting feedback:", {
    student: user?._id,
    comment,
    rating,
  });

  setError("");
  try {
    await api.post("/feedback", {
      student: user?._id,
      comment,
      rating,
    });
    setSuccess(true);
    setComment("");
    setRating(0);
  } catch (err) {
    console.error("Feedback error:", err.response || err.message);
    setError(err.response?.data?.error || "Submission failed");
  }
};
