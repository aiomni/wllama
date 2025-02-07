import './style.css';

interface InputProps {
  placeholder?: string | number;
  value: string;
  onChange: (value: string) => void;
}

export default function Input({ placeholder = '', value, onChange }: InputProps) {
  return (
    <div className="omni-input">
      <input
        placeholder={String(placeholder)}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}