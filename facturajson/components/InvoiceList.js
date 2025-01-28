class InvoiceList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.invoices = [];
    }

    connectedCallback() {
        this.loadInvoices();
        this.render();
    }

    async loadInvoices() {
        try {
            this.invoices = await InvoiceService.getAll();
            this.render();
        } catch (error) {
            console.error('Error:', error);
            this.showError(error.message);
        }
    }

    async handleDelete(id) {
        try {
            await InvoiceService.delete(id);
            await this.loadInvoices();
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

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .invoice-item { 
                    border: 1px solid #ddd;
                    margin: 10px 0;
                    padding: 10px;
                }
                .error {
                    display: none;
                    color: red;
                    padding: 10px;
                    margin: 10px 0;
                }
                .actions {
                    display: flex;
                    gap: 10px;
                }
                button {
                    padding: 5px 10px;
                    cursor: pointer;
                }
                .delete { background-color: #ff4444; color: white; }
                .edit { background-color: #4444ff; color: white; }
            </style>
            <div class="invoice-list">
                <div class="error"></div>
                <h2>Facturas</h2>
                ${this.invoices.map(factura => this.renderInvoiceItem(factura)).join('')}
            </div>
        `;

        // Add event listeners after rendering
        this.shadowRoot.querySelectorAll('.delete').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                this.handleDelete(id);
            });
        });

        this.shadowRoot.querySelectorAll('.edit').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                this.dispatchEvent(new CustomEvent('edit-invoice', {
                    bubbles: true,
                    composed: true,
                    detail: { id }
                }));
            });
        });
    }

    renderInvoiceItem(factura) {
        return `
            <div class="invoice-item">
                <h3>Factura #${factura.id}</h3>
                <p>Cliente: ${factura.info_usu.nombre}</p>
                <p>Email: ${factura.info_usu.email}</p>
                <h4>Productos:</h4>
                <ul>
                    ${factura.productos.map(producto => `
                        <li>${producto.cantidad} x ${producto.nombre} - $${producto.valor}</li>
                    `).join('')}
                </ul>
                <div class="actions">
                    <button class="edit" data-id="${factura.id}">Editar</button>
                    <button class="delete" data-id="${factura.id}">Eliminar</button>
                </div>
            </div>
        `;
    }
}

customElements.define('invoice-list', InvoiceList);