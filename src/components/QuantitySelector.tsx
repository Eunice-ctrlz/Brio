import { MinusIcon, PlusIcon } from './Icons';

interface Props {
  value: number;
  max: number;
  onChange: (next: number) => void;
  /** Product name, used for accessible button labels. */
  label: string;
}

export function QuantitySelector({ value, max, onChange, label }: Props) {
  return (
    <div className="qty" role="group" aria-label={`Quantity for ${label}`}>
      <button
        type="button"
        className="qty__btn"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label={`Decrease quantity of ${label}`}
      >
        <MinusIcon size={14} />
      </button>
      <span className="qty__value" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className="qty__btn"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Increase quantity of ${label}`}
      >
        <PlusIcon size={14} />
      </button>
    </div>
  );
}