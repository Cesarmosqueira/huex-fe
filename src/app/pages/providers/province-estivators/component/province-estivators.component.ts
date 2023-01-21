import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {ProvinceEstivators} from "../../../providers/province-estivators/models/province-estivators.model";
import {Observable} from "rxjs";
import {ProvinceEstivatorsService} from "../../../providers/province-estivators/services/province-estivators.service";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import {first} from "rxjs/operators";
import {config} from "../../../../shared/shared.config";
import {Providers} from "../../provider/models/providers.model";
import {Route} from "../../../customers/route/models/route.model";
import {RouteService} from "../../../customers/route/services/route.service";
import {ProviderService} from "../../provider/services/provider.service";

@Component({
  selector: 'app-province-estivators',
  templateUrl: './province-estivators.component.html',
  styleUrls: ['./province-estivators.component.scss']
})
export class ProvinceEstivatorsComponent implements OnInit {

  idProvinceEstivatorOuput: number = 0;


  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  provinceEstivatorForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  provinceEstivator?: any;
  test: ProvinceEstivators[] = [];
  provinceEstivatorsList!: Observable<ProvinceEstivators[]>;
  total: Observable<number>;
  pipe: any;

  providers:Providers[]=[];
  selectProvider=null;

  routes:Route[]=[];
  selectRoute=null;

  constructor(public service: ProvinceEstivatorsService,
              private modalService: NgbModal,
              private serviceProvider:ProviderService,
              private serviceRoute:RouteService,
              private formBuilder: UntypedFormBuilder) {
    this.provinceEstivatorsList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Proveedores' }, { label: 'Proveedores estivadores', active: true }];

    /**
     * Form Validation
     */
    this.provinceEstivatorForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      route: ['', [Validators.required]],
      provider: ['', [Validators.required]],
      costM3: ['', [Validators.required]],
      observation: ['', [Validators.required]],
      btnSave: []

    });

    this.provinceEstivatorsList.subscribe(x => {
      this.content = this.provinceEstivator;
      this.provinceEstivator = Object.assign([], x);
    });

    this.idProvinceEstivatorOuput = 0;
    console.log(this.idProvinceEstivatorOuput);
    this.listProviders();
    this.listRoutes();
    this.listProvinceEstivators();
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
          this.deleteProvinceEstivators(id);
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
    this.modalService.open(content, ngbModalOptions);
  }

  /**
   * Form data get
   */
  get form() {
    return this.provinceEstivatorForm.controls;
  }

  /**
   * Save user
   */
  saveUser() {
    this.submitted = true
    if (this.provinceEstivatorForm.valid) {
      this.pipe = new DatePipe('en-US');
      const routeId = this.selectRoute.id;
      const providerId =this.selectProvider.id;
      const costM3 = this.provinceEstivatorForm.get('costM3')?.value;
      const observation = this.provinceEstivatorForm.get('observation')?.value;

      let provinceEstivators = new ProvinceEstivators();
      let routes=new Route();
      let providers=new Providers();
      routes.id=routeId;
      providers.id=providerId;

      provinceEstivators.route = routes;
      provinceEstivators.provider = providers;
      provinceEstivators.costM3 = costM3;
      provinceEstivators.observation = observation;

      const id = this.provinceEstivatorForm.get('id')?.value;

      console.log(provinceEstivators);
      console.log(id);
      if (id == '0') {
        this.registerProvinceEstivators(provinceEstivators);
      } else {
        provinceEstivators.id = id;
        this.updateProvinceEstivators(provinceEstivators);
      }

      this.modalService.dismissAll();
      setTimeout(() => {
        this.provinceEstivatorForm.reset();
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
    this.modalService.open(content, { size: 'md', centered: true });
    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = 'Actualizar estivadores';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Actualizar";
    var listData = this.provinceEstivator.filter((data: { id: any; }) => data.id === id);
    this.provinceEstivatorForm.controls['id'].setValue(listData[0].id);
    this.provinceEstivatorForm.controls['route'].setValue(listData[0].route);
    this.provinceEstivatorForm.controls['provider'].setValue(listData[0].provider);
    this.provinceEstivatorForm.controls['costM3'].setValue(listData[0].costM3);
    this.provinceEstivatorForm.controls['observation'].setValue(listData[0].observation);
    this.idProvinceEstivatorOuput = id;

  }

  listProvinceEstivators() {
    this.service.listProvinceEstivators()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.provinceEstivators;
              this.service.paginationTable(this.test);
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
              title: "Ocurrio un error, comuniquese con el Encargado",
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

  registerProvinceEstivators(provinceEstivators) {
    this.service.registerProvinceEstivators(provinceEstivators)
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
              this.listProvinceEstivators();
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

  updateProvinceEstivators(provinceEstivators) {
    this.service.updateProvinceEstivators(provinceEstivators)
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
              this.listProvinceEstivators();
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
    this.provinceEstivatorForm.controls['id'].setValue("0");
    this.provinceEstivatorForm.controls['route'].setValue("");
    this.provinceEstivatorForm.controls['provider'].setValue("");
    this.provinceEstivatorForm.controls['costM3'].setValue("");
    this.provinceEstivatorForm.controls['observation'].setValue("");
  }

  enableInputs() {
    this.provinceEstivatorForm.controls['id'].enable();
    this.provinceEstivatorForm.controls['route'].enable();
    this.provinceEstivatorForm.controls['provider'].enable();
    this.provinceEstivatorForm.controls['costM3'].enable();
    this.provinceEstivatorForm.controls['observation'].enable();
  }

  deleteProvinceEstivators(id) {
    this.service.deleteProvinceEstivators(id)
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
              this.listProvinceEstivators();
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

  listRoutes() {
    this.serviceRoute.listRoutes()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.routes = response.datos.routes;
              console.log(this.routes);
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

  listProviders() {
    this.serviceProvider.listProviders()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.providers = response.datos.providers;
              console.log(this.providers);
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
