class InvoiceService {
    static BASE_URL = 'http://localhost:3001/facturas';

    static async getAll() {
        const response = await fetch(this.BASE_URL);
        if (!response.ok) throw new Error('Error obteniendo facturas');
        return response.json();
    }

    static async getById(id) {
        const response = await fetch(`${this.BASE_URL}/${id}`);
        if (!response.ok) throw new Error('Error obteniendo factura');
        return response.json();
    }

    static async create(invoice) {
        const response = await fetch(this.BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(invoice)
        });
        if (!response.ok) throw new Error('Error creando factura');
        return response.json();
    }

    static async update(id, invoice) {
        const response = await fetch(`${this.BASE_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(invoice)
        });
        if (!response.ok) throw new Error('Error actualizando factura');
        return response.json();
    }

    static async delete(id) {
        const response = await fetch(`${this.BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error eliminando factura');
        return true;
    }
}