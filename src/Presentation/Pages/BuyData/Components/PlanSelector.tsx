import SelectionDrawer from '../../../Components/SelectionDrawer';

export interface DataPlan {
  id: string;
  size: string;
  amount: number;
  type: string;
  network: string;
}

interface PlanSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  plans: DataPlan[];
  selectedPlan: DataPlan | null;
  onSelect: (plan: DataPlan) => void;
  isLoading?: boolean;
}

const PlanSelector = ({ isOpen, onClose, plans, selectedPlan, onSelect, isLoading }: PlanSelectorProps) => {
  return (
    <SelectionDrawer isOpen={isOpen} onClose={onClose} title="Select Data Plan">
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : plans.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)] text-center py-6">
          No plans available. Select network and data type first.
        </p>
      ) : (
        <ul className="space-y-2">
          {plans.map((plan) => {
            const isSelected = selectedPlan?.id === plan.id;
            return (
              <li key={plan.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(plan);
                    onClose();
                  }}
                  className={`w-full text-left py-3 px-4 rounded-lg border transition-colors
                    ${isSelected
                      ? 'bg-[var(--accent-hover)] border-[var(--accent-primary)]'
                      : 'bg-[var(--bg-tertiary)] border-[var(--border-color)] hover:bg-[var(--bg-hover)]'
                    }`}
                >
                  <span className="block font-semibold text-sm text-[var(--text-primary)]">{plan.size}</span>
                  <span className="text-xs text-[var(--text-tertiary)]">₦{plan.amount.toLocaleString()} ({plan.type})</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </SelectionDrawer>
  );
};

export default PlanSelector;
