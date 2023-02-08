import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
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


  idProviderOuput: number = 0;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  providerForm!: UntypedFormGroup;
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
    this.breadCrumbItems = [{ label: 'Proveedor' }, { label: 'Proveedores', active: true }];

    /**
     * Form Validation
     */
    this.providerForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      ruc: ['', [Validators.required]],
      businessName: ['', [Validators.required]],
      contactName: ['', [Validators.required]],
      email: [''],
      phoneNumber: [''],
      address: [''],
      admissionDate: ['', [Validators.required]],
      bankName: [''],
      bankAccount: [''],
      interbankAccount: [''],
      providerType: [''],
      observation: [''],
      btnSave: []
    });

    this.providersList.subscribe(x => {
      this.content = this.providers;
      this.providers = Object.assign([], x);
    });
    this.idProviderOuput = 0;
    console.log(this.idProviderOuput);

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
          this.deleteProvider(id);
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
      size: 'lg'
    };

    this.modalService.open(content, ngbModalOptions);
  }

  /**
   * Form data get
   */
  get form() {
    return this.providerForm.controls;
  }

  /**
   * Save user
   */
  saveUser() {
    this.submitted = true
    if (this.providerForm.valid) {
      this.pipe = new DatePipe('en-US');
      const ruc = this.providerForm.get('ruc')?.value;
      const businessName = this.providerForm.get('businessName')?.value;
      const contactName = this.providerForm.get('contactName')?.value;
      const email = this.providerForm.get('email')?.value;
      const phoneNumber = this.providerForm.get('phoneNumber')?.value;
      const address = this.providerForm.get('address')?.value;
      const admissionDate = this.providerForm.get('admissionDate')?.value;
      const fortmatadmissionDate = this.pipe.transform(admissionDate, 'yyyy-MM-dd');
      const bankName = this.providerForm.get('bankName')?.value;
      const bankAccount = this.providerForm.get('bankAccount')?.value;
      const interbankAccount = this.providerForm.get('interbankAccount')?.value;
      const providerType = this.providerForm.get('providerType')?.value;
      const observation = this.providerForm.get('observation')?.value;

      let providers = new Providers();
      providers.ruc = ruc;
      providers.businessName = businessName;
      providers.contactName = contactName;
      providers.email = email;
      providers.phoneNumber = phoneNumber;
      providers.address = address;
      providers.admissionDate = fortmatadmissionDate;
      providers.bankName = bankName;
      providers.bankAccount = bankAccount;
      providers.interbankAccount = interbankAccount;
      providers.providerType = providerType;
      providers.observation = observation;

      const id = this.providerForm.get('id')?.value;

      console.log(Providers);
      console.log(id);
      if (id == '0') {
        this.registerProvider(providers);
      } else {
        providers.id = id;
        this.updateProvider(providers);
      }
      this.modalService.dismissAll();
      setTimeout(() => {
        this.providerForm.reset();
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

    this.modalService.open(content, { size: 'lg', centered: true });
    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = 'Actualizar proveedores';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Actualizar";
    var listData = this.providers.filter((data: { id: any; }) => data.id === id);
    const registerDate = listData[0].admissionDate.substring(0, 10);
    const fortmatregisterDate = this.pipe.transform(registerDate, 'yyyy-MM-dd');
    this.providerForm.controls['id'].setValue(listData[0].id);
    this.providerForm.controls['ruc'].setValue(listData[0].ruc);
    this.providerForm.controls['businessName'].setValue(listData[0].businessName);
    this.providerForm.controls['contactName'].setValue(listData[0].contactName);
    this.providerForm.controls['email'].setValue(listData[0].email);
    this.providerForm.controls['phoneNumber'].setValue(listData[0].phoneNumber);
    this.providerForm.controls['address'].setValue(listData[0].address);
    this.providerForm.controls['admissionDate'].setValue(fortmatregisterDate);
    this.providerForm.controls['bankName'].setValue(listData[0].bankName);
    this.providerForm.controls['bankAccount'].setValue(listData[0].bankAccount);
    this.providerForm.controls['interbankAccount'].setValue(listData[0].interbankAccount);
    this.providerForm.controls['providerType'].setValue(listData[0].providerType);
    this.providerForm.controls['observation'].setValue(listData[0].observation);
    this.idProviderOuput = id;
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

  registerProvider(providers) {
    this.service.registerProviders(providers)
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
              const providers = response.datos.provider;
              this.idProviderOuput = providers.id;
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

  updateProvider(providers) {
    this.service.updateProviders(providers)
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
    this.providerForm.controls['id'].setValue("0");
    this.providerForm.controls['ruc'].setValue("");
    this.providerForm.controls['businessName'].setValue("");
    this.providerForm.controls['contactName'].setValue("");
    this.providerForm.controls['email'].setValue("");
    this.providerForm.controls['phoneNumber'].setValue("");
    this.providerForm.controls['address'].setValue("");
    this.providerForm.controls['admissionDate'].setValue("");
    this.providerForm.controls['bankName'].setValue("");
    this.providerForm.controls['bankAccount'].setValue("");
    this.providerForm.controls['interbankAccount'].setValue("");
    this.providerForm.controls['providerType'].setValue("");

    this.providerForm.controls['observation'].setValue("");

  }

  enableInputs() {
    this.providerForm.controls['id'].enable();
    this.providerForm.controls['ruc'].enable();
    this.providerForm.controls['businessName'].enable();
    this.providerForm.controls['contactName'].enable();
    this.providerForm.controls['email'].enable();
    this.providerForm.controls['phoneNumber'].enable();
    this.providerForm.controls['address'].enable();
    this.providerForm.controls['admissionDate'].enable();
    this.providerForm.controls['bankName'].enable();
    this.providerForm.controls['bankAccount'].enable();
    this.providerForm.controls['interbankAccount'].enable();
    this.providerForm.controls['providerType'].enable();
    this.providerForm.controls['observation'].enable();

  }


  deleteProvider(id) {
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
