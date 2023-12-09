import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SingleDatePicker = ({ selectedDate, handleDateChange }) => {
  const onDateChange = (date) => {
    handleDateChange(date || new Date()); // Update the date or default to the current date
  };

  const safeDate = selectedDate ? new Date(selectedDate) : new Date(); // Ensure selectedDate is a valid Date object

  return (
    <DatePicker
      selected={safeDate}
      onChange={onDateChange}
      isClearable={false}
      popperPlacement="auto"
    />
  );
};

export default SingleDatePicker;
