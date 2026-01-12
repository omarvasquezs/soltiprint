<x-filament-widgets::widget>
    <x-filament::section>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Clientes -->
            <a href="{{ \App\Filament\Resources\CustomerResource::getUrl() }}" class="flex items-center space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition">
                <div class="p-3 bg-blue-100 text-blue-600 rounded-full">
                    <x-heroicon-o-users class="w-8 h-8"/>
                </div>
                <div>
                    <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">Clientes</h3>
                    <p class="text-sm text-gray-500">Permite añadir nuevos clientes y gestionarlos.</p>
                </div>
            </a>

            <!-- Presupuestos -->
            <a href="{{ \App\Filament\Resources\QuoteResource::getUrl() }}" class="flex items-center space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition">
                <div class="p-3 bg-red-100 text-red-600 rounded-full">
                    <x-heroicon-o-document-text class="w-8 h-8"/>
                </div>
                <div>
                    <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">Presupuestos</h3>
                    <p class="text-sm text-gray-500">Permite preparar nuevos presupuestos y consultarlos.</p>
                </div>
            </a>

            <!-- Ordenes de Trabajo -->
            <a href="{{ \App\Filament\Resources\WorkOrderResource::getUrl() }}" class="flex items-center space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition">
                <div class="p-3 bg-cyan-100 text-cyan-600 rounded-full">
                    <x-heroicon-o-cog class="w-8 h-8"/>
                </div>
                <div>
                    <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">Órdenes de trabajo</h3>
                    <p class="text-sm text-gray-500">Permite gestionar produccion y OTs.</p>
                </div>
            </a>

            <!-- Materiales -->
            <a href="{{ \App\Filament\Resources\MaterialResource::getUrl() }}" class="flex items-center space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition">
                <div class="p-3 bg-green-100 text-green-600 rounded-full">
                    <x-heroicon-o-swatch class="w-8 h-8"/>
                </div>
                <div>
                    <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">Papeles y materiales</h3>
                    <p class="text-sm text-gray-500">Gestionar stock de papeles y tintas.</p>
                </div>
            </a>

            <!-- Configuración Costes -->
            <a href="{{ \App\Filament\Resources\MachineResource::getUrl() }}" class="flex items-center space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition">
                <div class="p-3 bg-gray-100 text-gray-600 rounded-full">
                    <x-heroicon-o-calculator class="w-8 h-8"/>
                </div>
                <div>
                    <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">Configuración de costes</h3>
                    <p class="text-sm text-gray-500">Definir costes horarios y de click.</p>
                </div>
            </a>
        </div>
    </x-filament::section>
</x-filament-widgets::widget>
