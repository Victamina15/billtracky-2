import { useState, useMemo } from 'react';
import { User, Phone, MapPin, Plus, Check, ArrowLeft } from 'lucide-react';
import { useClientesStore } from '../../../hooks/clientes/useClientesStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../ui/command';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { toast } from 'sonner';

/**
 * Modal profesional de búsqueda y creación de clientes
 * Paleta oficial Billtracky-2 aplicada
 * Flujo unificado: búsqueda y creación dentro del mismo modal
 */
export default function ClienteModal({ isOpen, onClose, onSelectCliente }) {
  const [modoCrear, setModoCrear] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    notas: '',
  });
  const [errors, setErrors] = useState({});

  // Store
  const busqueda = useClientesStore((state) => state.busqueda);
  const setBusqueda = useClientesStore((state) => state.setBusqueda);
  const getClientesFiltrados = useClientesStore((state) => state.getClientesFiltrados);
  const addCliente = useClientesStore((state) => state.addCliente);
  const setClienteSeleccionado = useClientesStore((state) => state.setClienteSeleccionado);

  const clientesFiltrados = useMemo(() => getClientesFiltrados(), [busqueda, getClientesFiltrados]);

  const handleSelectCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    onSelectCliente(cliente);
    handleClose();
  };

  const handleClose = () => {
    setBusqueda('');
    setModoCrear(false);
    setFormData({ nombre: '', telefono: '', direccion: '', notas: '' });
    setErrors({});
    onClose();
  };

  const handleCrearCliente = (e) => {
    e.preventDefault();
    setErrors({});

    // Validación básica
    const newErrors = {};
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Agregar cliente
    const result = addCliente(formData);

    if (result.success) {
      toast.success('Cliente creado exitosamente');
      setClienteSeleccionado(result.cliente);
      onSelectCliente(result.cliente);
      handleClose();
    } else {
      toast.error('Error al crear cliente');
      if (result.error) {
        const zodErrors = {};
        result.error.forEach((err) => {
          zodErrors[err.path[0]] = err.message;
        });
        setErrors(zodErrors);
      }
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px] bg-white border-[#E5E7EB]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {modoCrear && (
              <button
                onClick={() => setModoCrear(false)}
                className="p-2 hover:bg-[#F4F4F5] rounded-lg transition-colors"
                aria-label="Volver a búsqueda"
              >
                <ArrowLeft className="w-5 h-5 text-[#4B5563]" />
              </button>
            )}
            <div>
              <DialogTitle className="text-2xl text-[#111827]">
                {modoCrear ? 'Crear Nuevo Cliente' : 'Buscar Cliente'}
              </DialogTitle>
              <DialogDescription className="text-[#6B7280]">
                {modoCrear
                  ? 'Completa los datos del nuevo cliente'
                  : 'Busca y selecciona un cliente existente'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {modoCrear ? (
          // FORMULARIO DE CREACIÓN
          <form onSubmit={handleCrearCliente} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-[#111827] font-medium">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nombre"
                placeholder="Ej: Juan Pérez"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                className={`border-[#E5E7EB] text-[#111827] placeholder:text-[#9CA3AF] focus:ring-[#2563EB] focus:border-[#2563EB] ${
                  errors.nombre ? 'border-red-500' : ''
                }`}
              />
              {errors.nombre && (
                <p className="text-sm text-red-500">{errors.nombre}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono" className="text-[#111827] font-medium">
                Teléfono <span className="text-red-500">*</span>
              </Label>
              <Input
                id="telefono"
                type="tel"
                placeholder="Ej: 809-555-1234"
                value={formData.telefono}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
                className={`border-[#E5E7EB] text-[#111827] placeholder:text-[#9CA3AF] focus:ring-[#2563EB] focus:border-[#2563EB] ${
                  errors.telefono ? 'border-red-500' : ''
                }`}
              />
              {errors.telefono && (
                <p className="text-sm text-red-500">{errors.telefono}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion" className="text-[#111827] font-medium">
                Dirección (opcional)
              </Label>
              <Input
                id="direccion"
                placeholder="Ej: Av. 27 de Febrero, Santo Domingo"
                value={formData.direccion}
                onChange={(e) => handleInputChange('direccion', e.target.value)}
                className="border-[#E5E7EB] text-[#111827] placeholder:text-[#9CA3AF] focus:ring-[#2563EB] focus:border-[#2563EB]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notas" className="text-[#111827] font-medium">
                Notas (opcional)
              </Label>
              <Input
                id="notas"
                placeholder="Ej: Cliente frecuente"
                value={formData.notas}
                onChange={(e) => handleInputChange('notas', e.target.value)}
                className="border-[#E5E7EB] text-[#111827] placeholder:text-[#9CA3AF] focus:ring-[#2563EB] focus:border-[#2563EB]"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModoCrear(false)}
                className="flex-1 border-[#E5E7EB] text-[#111827] hover:bg-[#F4F4F5]"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#2563EB] hover:bg-[#1E40AF] text-white"
              >
                <Check className="w-4 h-4 mr-2" />
                Crear Cliente
              </Button>
            </div>
          </form>
        ) : (
          // BÚSQUEDA Y LISTA
          <div className="space-y-4 mt-4">
            <Command className="rounded-lg border-[#E5E7EB] shadow-md bg-white">
              <CommandInput
                placeholder="Buscar por nombre o teléfono..."
                value={busqueda}
                onValueChange={setBusqueda}
                className="text-[#111827] placeholder:text-[#9CA3AF]"
              />
              <CommandList className="max-h-[300px]">
                <CommandEmpty>
                  <div className="py-8 text-center">
                    <div className="bg-[#F4F4F5] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-[#6B7280]" />
                    </div>
                    <p className="text-sm text-[#6B7280] mb-4">
                      No se encontraron clientes
                    </p>
                    <Button
                      onClick={() => setModoCrear(true)}
                      className="bg-[#2563EB] hover:bg-[#1E40AF] text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Cliente
                    </Button>
                  </div>
                </CommandEmpty>
                <CommandGroup>
                  {clientesFiltrados.map((cliente) => (
                    <CommandItem
                      key={cliente.id}
                      onSelect={() => handleSelectCliente(cliente)}
                      className="cursor-pointer hover:bg-[#F4F4F5] rounded-lg my-1 p-3"
                    >
                      <div className="flex items-start gap-3 w-full">
                        <div className="bg-[#EFF6FF] p-2.5 rounded-full flex-shrink-0">
                          <User className="w-5 h-5 text-[#2563EB]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#111827] truncate text-base">
                            {cliente.nombre}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Phone className="w-3.5 h-3.5 text-[#6B7280]" />
                            <p className="text-sm text-[#6B7280]">
                              {cliente.telefono}
                            </p>
                          </div>
                          {cliente.direccion && (
                            <div className="flex items-center gap-2 mt-1">
                              <MapPin className="w-3.5 h-3.5 text-[#6B7280]" />
                              <p className="text-sm text-[#6B7280] truncate">
                                {cliente.direccion}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>

            {/* Botón para crear cliente cuando hay resultados */}
            {clientesFiltrados.length > 0 && (
              <Button
                onClick={() => setModoCrear(true)}
                variant="outline"
                className="w-full border-[#E5E7EB] text-[#111827] hover:bg-[#F4F4F5]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Nuevo Cliente
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
