import { ChangeEvent, useState } from "react";
type BirthdayInputProps = {
  name: string;
  label: string;
  onBirthdayChange: (field: string, value: string) => void;
};

const BirthdayInput = ({
  name,
  label,
  onBirthdayChange,
}: BirthdayInputProps) => {
  const [dateParts, setDateParts] = useState({
    year: "",
    month: "",
    day: "",
  });
  const inputCategory = [
    { name: "year", value: dateParts.year, placeholder: "YYYY" },
    { name: "month", value: dateParts.month, placeholder: "MM" },
    { name: "day", value: dateParts.day, placeholder: "DD" },
  ];
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name: partName, value: partValue } = e.target;
    const newDateParts = {
      ...dateParts,
      [partName]: partValue,
    };
    setDateParts(newDateParts);

    const { year, month, day } = newDateParts;

    if (year && month && day) {
      const paddedMonth = month.padStart(2, "0");
      const paddedDay = day.padStart(2, "0");

      const birthday = `${year}-${paddedMonth}-${paddedDay}`;

      onBirthdayChange("birthday", birthday);
    }
  };
  return (
    <div className="w-[373px] min-h-[86px] space-y-[5px]">
      <p className="text-header-s font-medium">{label}</p>

      <div className="w-full flex justify-between">
        {inputCategory.map((item, index) => (
          <input
            key={index}
            className={` outline-none border w-[117px] h-[48px] rounded-[6px] pl-[10px] border-[--border-input_box] focus:border-[2px] text-center`}
            type="number"
            placeholder={item.placeholder}
            name={item.name}
            value={item.value}
            onChange={handleDateChange}
            required
          />
        ))}
      </div>
    </div>
  );
};
export default BirthdayInput;
