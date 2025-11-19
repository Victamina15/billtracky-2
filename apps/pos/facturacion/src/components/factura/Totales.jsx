import { formatCurrency } from '../../utils/formatCurrency';
import { useFacturaStore } from '../../hooks/useFacturaStore';

export default function Totales() {
  const getSubtotal = useFacturaStore((state) => state.getSubtotal);
  const getItbis = useFacturaStore((state) => state.getItbis);
  const getTotal = useFacturaStore((state) => state.getTotal);

  const subtotal = getSubtotal();
  const itbis = getItbis();
  const total = getTotal();

  return (
    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between text-gray-700">
        <span>Subtotal</span>
        <span className="font-semibold">{formatCurrency(subtotal)}</span>
      </div>

      <div className="flex items-center justify-between text-gray-700">
        <span>ITBIS (18%)</span>
        <span className="font-semibold">{formatCurrency(itbis)}</span>
      </div>

      <div className="h-px bg-gray-300" />

      <div className="flex items-center justify-between text-2xl font-bold text-gray-900">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
