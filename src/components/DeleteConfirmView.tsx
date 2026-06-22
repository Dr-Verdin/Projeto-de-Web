import { Button } from "./ui/button";

type DeleteConfirmViewProps = {
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteConfirmView({ onCancel, onConfirm }: DeleteConfirmViewProps) {
  return (
    <div className="p-6 text-center max-w-sm mx-auto animate-in fade-in zoom-in-95 duration-150">
      <h2 className="text-xl font-bold text-red-600">Confirmar exclusão</h2>
      <p className="mt-2 text-sm text-gray-500">
        Esta ação é permanente e não poderá ser desfeita de forma alguma.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Button 
          variant="outline" 
          className="rounded-2xl" 
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button 
          onClick={onConfirm} 
          className="bg-red-600 text-white hover:bg-red-700 rounded-2xl"
        >
          Excluir definitivamente
        </Button>
      </div>
    </div>
  );
}