import { useState, useMemo } from 'react';
import { User, Phone, MapPin, Plus, Check } from 'lucide-react';
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
 * Estilo Shopify POS
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

  const clientesFiltrados = useMemo(() => getClientesFiltrados(), [busqueda, getClientesFiltrados]);

  const handleSelectCliente = (cliente) => {
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
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {modoCrear ? 'Crear Nuevo Cliente' : 'Buscar Cliente'}
          </DialogTitle>
          <DialogDescription>
            {modoCrear
              ? 'Completa los datos del nuevo cliente'
              : 'Busca y selecciona un cliente existente o crea uno nuevo'}
          </DialogDescription>
        </DialogHeader>

        {modoCrear ? (
          // FORMULARIO DE CREACIÓN
          <form onSubmit={handleCrearCliente} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nombre"
                placeholder="Ej: Juan Pérez"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                className={errors.nombre ? 'border-red-500' : ''}
              />
              {errors.nombre && (
                <p className="text-sm text-red-500">{errors.nombre}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">
                Teléfono <span className="text-red-500">*</span>
              </Label>
              <Input
                id="telefono"
                type="tel"
                placeholder="Ej: 809-555-1234"
                value={formData.telefono}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
                className={errors.telefono ? 'border-red-500' : ''}
              />
              {errors.telefono && (
                <p className="text-sm text-red-500">{errors.telefono}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección (opcional)</Label>
              <Input
                id="direccion"
                placeholder="Ej: Av. 27 de Febrero, Santo Domingo"
                value={formData.direccion}
                onChange={(e) => handleInputChange('direccion', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notas">Notas (opcional)</Label>
              <Input
                id="notas"
                placeholder="Ej: Cliente frecuente"
                value={formData.notas}
                onChange={(e) => handleInputChange('notas', e.target.value)}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModoCrear(false)}
                className="flex-1"
              >
                Volver a Búsqueda
              </Button>
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Check className="w-4 h-4 mr-2" />
                Crear Cliente
              </Button>
            </div>
          </form>
        ) : (
          // BÚSQUEDA Y LISTA
          <div className="space-y-4">
            <Command className="rounded-lg border shadow-md">
              <CommandInput
                placeholder="Buscar por nombre o teléfono..."
                value={busqueda}
                onValueChange={setBusqueda}
              />
              <CommandList>
                <CommandEmpty>
                  <div className="py-6 text-center">
                    <p className="text-sm text-gray-500 mb-4">
                      No se encontraron clientes
                    </p>
                    <Button
                      onClick={() => setModoCrear(true)}
                      className="bg-blue-600 hover:bg-blue-700"
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
                      className="cursor-pointer"
                    >
                      <div className="flex items-start gap-3 w-full">
                        <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">
                            {cliente.nombre}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Phone className="w-3 h-3 text-gray-500" />
                            <p className="text-sm text-gray-600">
                              {cliente.telefono}
                            </p>
                          </div>
                          {cliente.direccion && (
                            <div className="flex items-center gap-2 mt-1">
                              <MapPin className="w-3 h-3 text-gray-500" />
                              <p className="text-sm text-gray-500 truncate">
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

            <Button
              onClick={() => setModoCrear(true)}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Nuevo Cliente
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
