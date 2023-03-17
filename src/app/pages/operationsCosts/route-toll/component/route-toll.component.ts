import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Toll} from "../../toll/models/toll.model";
import {Observable} from "rxjs";
import {TollService} from "../../toll/services/toll.service";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import {first} from "rxjs/operators";
import {config} from "../../../../shared/shared.config";
import {Route} from "../../../customers/route/models/route.model";
import {RouteService} from "../../../customers/route/services/route.service";
import {RouteToll} from "../models/route-toll.model";
import {RouteTollService} from "../services/route-toll.service";

@Component({
  selector: 'app-route-toll',
  templateUrl: './route-toll.component.html',
  styleUrls: ['./route-toll.component.scss']
})
export class RouteTollComponent implements OnInit {


  idRouteTollOuput: number = 0;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  routeTollForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  routeTolls?: any;
  test: RouteToll[] = [];
  routeTollsList!: Observable<RouteToll[]>;
  total: Observable<number>;
  pipe: any;

  tolls:Toll[]=[];
  selectToll=null;

  routes:Route[]=[];
  selectRoute=null;

  journey:string[]=['IDA','VUELTA'];

  constructor(public service: RouteTollService,
              private modalService: NgbModal,
              private serviceRoute:RouteService,
              private serviceToll:TollService,
              private formBuilder: UntypedFormBuilder) {
    this.routeTollsList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Costo operaciones' }, { label: 'Peajes de ruta', active: true }];

    /**
     * Form Validation
     */
    this.routeTollForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      route: ['', [Validators.required]],
      toll: ['', [Validators.required]],
      journey: [''],
      btnSave: []
    });

    this.routeTollsList.subscribe(x => {
      this.content = this.routeTolls;
      this.routeTolls = Object.assign([], x);
    });
    this.idRouteTollOuput = 0;

    this.listRouteToll();
    this.listToll();
    this.listRoutes()
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
          this.deleteRouteToll(id);
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
    this.clear();
    this.submitted = false;
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'md'
    };
    this.selectToll=null;
    this.selectRoute=null;
    this.modalService.open(content, ngbModalOptions);
  }

  /**
   * Form data get
   */
  get form() {
    return this.routeTollForm.controls;
  }

  /**
   * Save user
   */
  saveUser() {
    this.submitted = true
    if (this.routeTollForm.valid) {
      this.pipe = new DatePipe('en-US');
      const tollId =this.selectToll.id;
      const routeId = this.selectRoute.id;
      const journey = this.routeTollForm.get('journey')?.value;

      let routeToll = new RouteToll();
      let toll=new Toll();
      let routes=new Route();
      toll.id=tollId;
      routes.id=routeId;
      routeToll.toll = toll;
      routeToll.route = routes;
      routeToll.journey = journey;


      const id = this.routeTollForm.get('id')?.value;

      if (id == '0') {
        this.registerRouteToll(routeToll);
      } else {
        routeToll.id = id;
        this.updateRouteToll(routeToll);
      }
      this.modalService.dismissAll();
      setTimeout(() => {
        this.routeTollForm.reset();
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

    this.modalService.open(content, { size: 'md', centered: true });
    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = 'Actualizar rutas';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Actualizar";
    var listData = this.routeTolls.filter((data: { id: any; }) => data.id === id);
    this.routeTollForm.controls['id'].setValue(listData[0].id);
    this.routeTollForm.controls['journey'].setValue(listData[0].journey);
    this.selectRoute=listData[0].route;
    this.selectToll=listData[0].toll;
    this.idRouteTollOuput = id;
  }

  listRouteToll() {
    this.service.listRouteTolls()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.routeToll;
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

  registerRouteToll(routeToll) {
    this.service.registerRouteToll(routeToll)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              Swal.fire(
                '¡Registrado!',
                response.meta.mensajes[0].mensaje,
                'success'
              );
              this.listRouteToll();
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

  updateRouteToll(routeToll) {
    this.service.updateRouteToll(routeToll)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              Swal.fire(
                '¡Actualizado!',
                response.meta.mensajes[0].mensaje,
                'success'
              );
              this.listRouteToll();
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
    this.routeTollForm.controls['id'].setValue("0");
    this.routeTollForm.controls['toll'].setValue(null);
    this.routeTollForm.controls['route'].setValue(null);
    this.routeTollForm.controls['journey'].setValue("");

  }
  enableInputs() {
    this.routeTollForm.controls['id'].enable();
    this.routeTollForm.controls['toll'].enable();
    this.routeTollForm.controls['route'].enable();
    this.routeTollForm.controls['journey'].enable();

  }

  deleteRouteToll(id) {
    this.service.deleteRouteToll(id)
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
              this.listRouteToll();
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

  listToll() {
    this.serviceToll.listTolls()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.tolls = response.datos.tollDto;
              this.tolls.forEach(element => {
                let to = new Toll();
                to.id = element.id;
                to.name = element.place + "/" + element.configuration;
                element.name = to.name;

              });
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

  listRoutes() {
    this.serviceRoute.listRoutes()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.routes = response.datos.routes;
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
}
