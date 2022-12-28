import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {ProvinceEstivators} from "../../province-estivators/models/province-estivators.model";
import {Observable} from "rxjs";
import {ProvinceEstivatorsService} from "../../province-estivators/services/province-estivators.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import {first} from "rxjs/operators";
import {config} from "../../../../shared/shared.config";
import {Providers} from "../models/providers.model";
import {ProviderService} from "../services/provider.service";

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.scss']
})
export class ProviderComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  providersForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  providers?: any;
  test: Providers[] = [];
  providersList!: Observable<Providers[]>;
  total: Observable<number>;
  pipe: any;

  constructor(public service: ProviderService,
              private modalService: NgbModal,
              private formBuilder: UntypedFormBuilder) {
    this.providersList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Proveedores' }, { label: 'Proveedores', active: true }];

    /**
     * Form Validation
     */
    this.providersForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      ruc: ['', [Validators.required]],
      businessName: ['', [Validators.required]],
      contactName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      address: ['', [Validators.required]],
      admissionDate: ['', [Validators.required]],
      bankAccount: ['', [Validators.required]],
      observation: ['', [Validators.required]],
    });

    this.providersList.subscribe(x => {
      this.content = this.providersForm;
      this.providers = Object.assign([], x);
    });

    this.listProviders();
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
          this.deleteProviders(id);
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
    this.submitted = false;
    this.modalService.open(content, { size: 'md', centered: true });
  }

  /**
   * Form data get
   */
  get form() {
    return this.providersForm.controls;
  }

  /**
   * Save user
   */
  saveUser() {
    this.submitted = true
    if (this.providersForm.valid) {
      this.pipe = new DatePipe('en-US');
      const ruc = this.providersForm.get('ruc')?.value;
      const businessName = this.providersForm.get('businessName')?.value;
      const contactName = this.providersForm.get('contactName')?.value;
      const email = this.providersForm.get('email')?.value;
      const phoneNumber = this.providersForm.get('phoneNumber')?.value;
      const address = this.providersForm.get('address')?.value;
      const admissionDate = this.providersForm.get('admissionDate')?.value;
      const fortmatadmissionDate = this.pipe.transform(admissionDate, 'yyyy-MM-dd');
      const bankAccount = this.providersForm.get('bankAccount')?.value;
      const observation = this.providersForm.get('observation')?.value;



      let providers = new Providers();
      providers.ruc = ruc;
      providers.businessName = businessName;
      providers.contactName = contactName;
      providers.email = email;
      providers.phoneNumber = phoneNumber;
      providers.address = address;
      providers.admissionDate = fortmatadmissionDate;
      providers.bankAccount = bankAccount;
      providers.observation = observation;

      const id = this.providersForm.get('id')?.value;
      console.log(providers);
      console.log(id);
      if (id == '0') {
        this.registerProviders(providers);
      } else {
        providers.id = id;
        this.updateProviders(providers);
      }

      this.modalService.dismissAll();
      setTimeout(() => {
        this.providersForm.reset();
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
    modelTitle.innerHTML = 'Actualizar proveedores';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Actualizar";
    var listData = this.providers.filter((data: { id: any; }) => data.id === id);
    const fabricationDate = listData[0].fabricationDate.substring(0, 10);
    const fortmatFabricationDate = this.pipe.transform(fabricationDate, 'yyyy-MM-dd');
    this.providersForm.controls['id'].setValue(listData[0].id);
    this.providersForm.controls['ruc'].setValue(listData[0].ruc);
    this.providersForm.controls['businessName'].setValue(listData[0].businessName);
    this.providersForm.controls['contactName'].setValue(listData[0].contactName);
    this.providersForm.controls['email'].setValue(listData[0].email);
    this.providersForm.controls['phoneNumber'].setValue(listData[0].phoneNumber);
    this.providersForm.controls['address'].setValue(listData[0].address);
    this.providersForm.controls['admissionDate'].setValue(fortmatFabricationDate);
    this.providersForm.controls['bankAccount'].setValue(listData[0].bankAccount);
    this.providersForm.controls['observation'].setValue(listData[0].observation);

  }

  listProviders() {
    this.service.listProviders()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.providers;
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

  registerProviders(providers) {
    this.service.registerProviders(providers)
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
              this.listProviders();
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
              title: "Ocurrio un error, comuniquese con el encargado",
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

  updateProviders(providers) {
    this.service.updateProviders(providers)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.listProviders();
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
              title: "Ocurrio un error, comuniquese con el encargado",
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

  deleteProviders(id) {
    this.service.deleteProviders(id)
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
              this.listProviders();
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
              title: "Ocurrio un error, comuniquese con el encargado",
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
