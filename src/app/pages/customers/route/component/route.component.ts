import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import {first} from "rxjs/operators";
import {config} from "../../../../shared/shared.config";
import {Route} from "../models/route.model";
import {RouteService} from "../services/route.service";
import {Providers} from "../../../providers/provider/models/providers.model";

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.scss']
})
export class RouteComponent implements OnInit {


  idRouteOuput: number = 0;
  newRoute = false;
  textButton = "Registrar";
  action = 0;


  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  routeForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  routes?: any;
  test: Route[] = [];
  routesList!: Observable<Route[]>;
  total: Observable<number>;
  pipe: any;

  constructor(public service: RouteService,
              private modalService: NgbModal,
              private formBuilder: UntypedFormBuilder) {
    this.routesList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Cliente' }, { label: 'Rutas de clientes', active: true }];

    /**
     * Form Validation
     */
    this.routeForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      routeStart: ['', [Validators.required]],
      routeEnd: ['', [Validators.required]],
      zone: ['', [Validators.required]],
      distanceKM: ['', [Validators.required]],
      gallons: ['', [Validators.required]],
      btnSave: []
    });

    this.routesList.subscribe(x => {
      this.content = this.routes;
      this.routes = Object.assign([], x);
    });
    this.idRouteOuput = 0;
    console.log(this.idRouteOuput);

    this.listRoutes();
  }

  /**
   * Open modal
   * @param content modal content
   */
  openViewModal(content: any) {
    this.modalService.open(content, { centered: true });
  }

  // Delete Data
  delete(id: any) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger ms-2'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons
      .fire({
        title: '¿Está seguro?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        showCancelButton: true
      })
      .then(result => {
        if (result.value) {
          this.deleteRoute(id);
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your imaginary file is safe :)',
            'error'
          );
        }
      });
  }

  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.action = 1;
    this.clear();
    this.submitted = false;
    this.newRoute = false;
    this.textButton = "Registrar";
    this.enableInputs();
    this.modalService.open(content, { size: 'md', centered: true });
  }

  /**
   * Form data get
   */
  get form() {
    return this.routeForm.controls;
  }

  /**
   * Save user
   */
  saveUser() {
    this.submitted = true
    if (this.routeForm.valid) {
      this.pipe = new DatePipe('en-US');
      const routeStart = this.routeForm.get('routeStart')?.value;
      const routeEnd = this.routeForm.get('routeEnd')?.value;
      const zone = this.routeForm.get('zone')?.value;
      const distanceKM = this.routeForm.get('distanceKM')?.value;
      const gallons = this.routeForm.get('gallons')?.value;

      let route = new Route();
      route.routeStart = routeStart;
      route.routeEnd = routeEnd;
      route.zone = zone;
      route.distanceKM = distanceKM;
      route.gallons = gallons;
      const id = this.routeForm.get('id')?.value;
      console.log(route);
      console.log(id);
      if (id == '0') {
        this.registerRoutes(route);
      } else {
        route.id = id;
        this.updateRoutes(route);
      }

      this.modalService.dismissAll();
      setTimeout(() => {
        this.routeForm.reset();
      }, 2000);

    }
  }

  /**
   * Open Edit modal
   * @param content modal content
   */
  editDataGet(id: any, content: any) {
    this.submitted = false;
    this.pipe = new DatePipe('en-US');
    this.enableInputs();
    this.action = 2;
    this.newRoute = true;
    this.textButton = "Actualizar";
    this.modalService.open(content, { size: 'md', centered: true });
    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = 'Actualizar rutas';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Actualizar";
    var listData = this.routes.filter((data: { id: any; }) => data.id === id);
    this.routeForm.controls['id'].setValue(listData[0].id);
    this.routeForm.controls['routeStart'].setValue(listData[0].routeStart);
    this.routeForm.controls['routeEnd'].setValue(listData[0].routeEnd);
    this.routeForm.controls['zone'].setValue(listData[0].zone);
    this.routeForm.controls['distanceKM'].setValue(listData[0].distanceKM);
    this.routeForm.controls['gallons'].setValue(listData[0].gallons);
    this.idRouteOuput = id;

  }

  listRoutes() {
    this.service.listRoutes()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.routeDtoList;
              this.service.paginationTable(this.test);
            } else {
              Swal.fire({
                icon: config.WARNING,
                title: response.meta.mensajes[0].mensaje,
                showConfirmButton: false,
              });
            }
          }
        },
        error => {
          Swal.fire({
            icon: config.ERROR,
            title: error,
            showConfirmButton: false,
          });
        });
  }

  registerRoutes(routes) {
    this.service.registerRoute(routes)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            console.log(response);
            if (response.datos) {
              Swal.fire(
                '¡Registrado!',
                response.meta.mensajes[0].mensaje,
                'success'
              );
              this.newRoute=true;
              this.action=0;
              this.disableInputs();
              const routeDto = response.datos.routeDto;
              this.idRouteOuput = routeDto.id;
              this.listRoutes();
            } else {
              Swal.fire({
                icon: config.WARNING,
                title: response.meta.mensajes[0].mensaje,
                showConfirmButton: false,
              });
            }
          } else {
            Swal.fire({
              icon: config.ERROR,
              title: "Ocurrio un error",
              showConfirmButton: false,
            });
          }
        },
        error => {
          Swal.fire({
            icon: config.ERROR,
            title: error,
            showConfirmButton: false,
          });
        });
  }

  updateRoutes(routes) {
    this.service.updateRoute(routes)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.listRoutes();
            } else {
              Swal.fire({
                icon: config.WARNING,
                title: response.meta.mensajes[0].mensaje,
                showConfirmButton: false,
              });
            }
          } else {
            Swal.fire({
              icon: config.ERROR,
              title: "Ocurrio un error",
              showConfirmButton: false,
            });
          }
        },
        error => {
          Swal.fire({
            icon: config.ERROR,
            title: error,
            showConfirmButton: false,
          });
        });
  }

  clear() {
    this.routeForm.controls['id'].setValue("0");
    this.routeForm.controls['routeStart'].setValue(null);
    this.routeForm.controls['routeEnd'].setValue("");
    this.routeForm.controls['zone'].setValue("");
    this.routeForm.controls['distanceKM'].setValue("");
    this.routeForm.controls['gallons'].setValue("");

  }

  enableInputs() {
    this.routeForm.controls['id'].enable();
    this.routeForm.controls['routeStart'].enable();
    this.routeForm.controls['routeEnd'].enable();
    this.routeForm.controls['zone'].enable();
    this.routeForm.controls['distanceKM'].enable();
    this.routeForm.controls['gallons'].enable();
  }
  disableInputs() {
    this.routeForm.controls['id'].disable();
    this.routeForm.controls['routeStart'].disable();
    this.routeForm.controls['routeEnd'].disable();
    this.routeForm.controls['zone'].disable();
    this.routeForm.controls['distanceKM'].disable();
    this.routeForm.controls['gallons'].disable();
  }


  deleteRoute(id) {
    this.service.deleteRoute(id)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.meta.mensajes[0].codigo == '0') {
              Swal.fire(
                '¡Eliminado!',
                'Su archivo ha sido eliminado.',
                'success'
              );
              this.listRoutes();
            } else {
              Swal.fire({
                icon: config.WARNING,
                title: response.meta.mensajes[0].mensaje,
                showConfirmButton: false,
              });
            }
          } else {
            Swal.fire({
              icon: config.ERROR,
              title: "Ocurrio un error",
              showConfirmButton: false,
            });
          }
        },
        error => {
          Swal.fire({
            icon: config.ERROR,
            title: error,
            showConfirmButton: false,
          });
        });
  }
}
