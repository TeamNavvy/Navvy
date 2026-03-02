export const RadioButtonGroup = (props) => {
  const { options, selectedOption, onChange } = props;
  return (
    <div>
      {options.map((option) => (
        <label key={option}>
          <input
            type="radio"
            value={option}
            checked={selectedOption === option}
            onChange={onChange}
          />
          {option}
        </label>
      ))}
    </div>
  );
};
