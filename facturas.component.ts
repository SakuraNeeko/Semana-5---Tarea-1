import { Component, OnInit } from '@angular/core';
import { FacturaService } from 'src/app/Services/factura.service';
import { IFactura } from 'src/app/Interfaces/factura';
import { Router } from '@angular/router';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.scss']
})
export class FacturasComponent implements OnInit {
  listaFacturas: IFactura[] = [];

  constructor(private facturaService: FacturaService, private router: Router) {}

  ngOnInit(): void {
    this.cargarFacturas();
  }

  cargarFacturas(): void {
    this.facturaService.todos().subscribe(data => {
      this.listaFacturas = data;
    });
  }

  editar(idFactura: number): void {
    this.router.navigate([`/facturas/editar/${idFactura}`]);
  }

  eliminar(idFactura: number): void {
    if (confirm('¿Está seguro de eliminar la factura?')) {
      this.facturaService.eliminar(idFactura).subscribe(() => {
        this.cargarFacturas();
      });
    }
  }
}
