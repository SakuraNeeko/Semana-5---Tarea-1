import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientesService } from 'src/app/Services/clientes.service';
import { FacturaService } from 'src/app/Services/factura.service';
import { ICliente } from 'src/app/Interfaces/icliente';
import { IFactura } from 'src/app/Interfaces/factura';

@Component({
  selector: 'app-editarfactura',
  templateUrl: './editarfactura.component.html',
  styleUrls: ['./editarfactura.component.scss']
})
export class EditarfacturaComponent implements OnInit {
  titulo = 'Editar Factura';
  frm_factura: FormGroup;
  listaClientes: ICliente[] = [];
  totalapagar: number = 0;
  idFactura: number;

  constructor(
    private clientesService: ClientesService,
    private facturaService: FacturaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.idFactura = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.frm_factura = new FormGroup({
      Fecha: new FormControl('', Validators.required),
      Sub_total: new FormControl('', Validators.required),
      Sub_total_iva: new FormControl('', Validators.required),
      Valor_IVA: new FormControl('0.15'),
      Clientes_idClientes: new FormControl('', Validators.required)
    });

    this.clientesService.todos().subscribe(data => {
      this.listaClientes = data;
    });

    this.facturaService.uno(this.idFactura).subscribe((factura: IFactura) => {
      this.frm_factura.patchValue(factura);
      this.calculos();
    });
  }

  actualizar(): void {
    const factura: IFactura = { ...this.frm_factura.value, idFactura: this.idFactura };
    this.facturaService.actualizar(factura).subscribe(() => {
      alert('Factura actualizada');
      this.router.navigate(['/facturas']);
    });
  }

  calculos(): void {
    const sub_total = this.frm_factura.get('Sub_total')?.value;
    const iva = this.frm_factura.get('Valor_IVA')?.value;
    const sub_total_iva = sub_total * iva;
    this.frm_factura.get('Sub_total_iva')?.setValue(sub_total_iva);
    this.totalapagar = sub_total + sub_total_iva;
  }
}
