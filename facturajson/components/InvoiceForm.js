class InvoiceForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.editMode = false;
        this.editId = null;
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
    }

    addEventListeners() {
        this.shadowRoot.querySelector('form').addEventListener('submit', this.handleSubmit.bind(this));
        window.addEventListener('edit-invoice', async (e) => {
            this.editMode = true;
            this.editId = e.detail.id;
            await this.loadInvoiceData(this.editId);
        });
    }

    async loadInvoiceData(id) {
        try {
            const invoice = await InvoiceService.getById(id);
            const form = this.shadowRoot.querySelector('form');
            form.nombre.value = invoice.info_usu.nombre;
            form.direccion.value = invoice.info_usu.direccion;
            form.email.value = invoice.info_usu.email;
            form.producto.value = invoice.productos[0].nombre;
            form.cantidad.value = invoice.productos[0].cantidad;
            form.valor.value = invoice.productos[0].valor;
            this.shadowRoot.querySelector('button').textContent = 'Actualizar Factura';
        } catch (error) {
            console.error('Error:', error);
            this.showError(error.message);
        }
    }

    showError(message) {
        const errorDiv = this.shadowRoot.querySelector('.error');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => errorDiv.style.display = 'none', 3000);
    }

    async handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        const invoice = {
            info_usu: {
                nombre: formData.get('nombre'),
                id: Date.now().toString(),
                direccion: formData.get('direccion'),
                email: formData.get('email')
            },
            productos: [{
                id: "1",
                cantidad: formData.get('cantidad'),
                nombre: formData.get('producto'),
                valor: formData.get('valor')
            }]
        };

        try {
            if (this.editMode) {
                await InvoiceService.update(this.editId, invoice);
            } else {
                await InvoiceService.create(invoice);
            }

            event.target.reset();
            this.editMode = false;
            this.editId = null;
            this.shadowRoot.querySelector('button').textContent = 'Crear Factura';
            document.querySelector('invoice-list').loadInvoices();
        } catch (error) {
            console.error('Error:', error);
            this.showError(error.message);
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                form {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    max-width: 500px;
                }
                input {
                    padding: 5px;
                    margin: 5px 0;
                }
                button {
                    background-color: #4CAF50;
                    color: white;
                    padding: 10px;
                    border: none;
                    cursor: pointer;
                }
                .error {
                    display: none;
                    color: red;
                    padding: 10px;
                    margin: 10px 0;
                }
            </style>
            <div class="invoice-form">
                <h2>Gestionar Factura</h2>
                <div class="error"></div>
                <form>
                    <h3>Información del Cliente</h3>
                    <input name="nombre" placeholder="Nombre" required>
                    <input name="direccion" placeholder="Dirección" required>
                    <input name="email" type="email" placeholder="Email" required>
                    
                    <h3>Información del Producto</h3>
                    <input name="producto" placeholder="Nombre del Producto" required>
                    <input name="cantidad" type="number" placeholder="Cantidad" required>
                    <input name="valor" type="number" placeholder="Valor" required>
                    
                    <button type="submit">Crear Factura</button>
                </form>
            </div>
        `;
    }
}

customElements.define('invoice-form', InvoiceForm);