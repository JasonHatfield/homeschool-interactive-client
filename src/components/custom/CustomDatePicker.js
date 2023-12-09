import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomDatePicker = ({ selectedDateRange, handleDateRangeChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleInputClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div onClick={handleInputClick}>
        <DatePicker
          selectsRange={true}
          startDate={selectedDateRange[0]}
          endDate={selectedDateRange[1]}
          onChange={(update) => handleDateRangeChange(update[0], update[1])}
          isClearable={false}
          popperPlacement="auto"
        />
      </div>
    </>
  );
};

export default CustomDatePicker;
